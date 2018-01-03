;;; omd.el --- Org to markdown for blog posts

;; Copyright (c) 2018 Abhinav Tushar

;; Author: Abhinav Tushar <lepisma@fastmail.com>
;; Version: 0.0.1
;; Package-Requires: ((emacs "25"))
;; URL: https://github.com/lepisma/lepisma.github.io/blob/source/omd.el

;;; Commentary:

;; Covert org posts to markdown for further transformation by jekyll
;; This file is not a part of GNU Emacs.

;;; License:

;; This program is free software: you can redistribute it and/or modify
;; it under the terms of the GNU General Public License as published by
;; the Free Software Foundation, either version 3 of the License, or
;; (at your option) any later version.

;; This program is distributed in the hope that it will be useful,
;; but WITHOUT ANY WARRANTY; without even the implied warranty of
;; MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
;; GNU General Public License for more details.

;; You should have received a copy of the GNU General Public License
;; along with this program. If not, see <http://www.gnu.org/licenses/>.

;;; Code:

(require 's)
(require 'f)
(require 'dash)
(require 'dash-functional)

(defun omd-posts ()
  "Read posts from _org directory"
  (f-entries "./_org" (-cut s-ends-with? ".org" <>)))

(defun omd-post-output (input-file)
  (s-replace-all '((".org" . ".md")
                   ("_org". "_drafts")) input-file))

(defun omd-file-mtime (file-name)
  (nth 5 (file-attributes file-name)))

(defun omd-post-uptodate? (input-file)
  "Check if the output file corresponding to input is
  up to date"
  (let ((output (omd-post-output input-file)))
    (if (f-exists? output)
        (time-less-p (omd-file-mtime input-file) (omd-file-mtime output))
      nil)))

(defun omd-is-header? (line)
  "Tell if the line is a header for jekyll"
  (let ((keys '("layout" "title" "tags" "summary")))
    (-any? (lambda (k)
             (s-starts-with? (format "#+%s:" k) (s-trim (downcase line))))
           keys)))

(defun omd-transform-header (line)
  "Transform line to yaml style"
  (let ((splits (s-split-up-to ":" line 1)))
    (format "%s: %s"
            (s-chop-prefix "#+" (downcase (car splits)))
            (second splits))))

(defun omd-transform-lines (lines &optional acc header-done)
  "Replace org headers with yaml top matter"
  (if (null acc) (omd-transform-lines lines '("---"))
    (if (null lines) (reverse acc)
      (let ((current-line (car lines)))
        (if header-done
            (omd-transform-lines nil (append (reverse lines) acc))
          (if (omd-is-header? current-line)
              (omd-transform-lines (cdr lines)
                                   (cons (omd-transform-header current-line) acc))
            (omd-transform-lines (cdr lines) (append (list current-line "---") acc) t)))))))

(defun omd-revert-katex (string)
  "Revert wrong conversions in katex blocks"
  (let ((lines (->> string
                  (s-replace-all '(("<sub>"  . "_{")
                                   ("</sub>" . "}")
                                   ("<sup>"  . "^{")
                                   ("</sup>" . "}")))
                  (s-split "\n")
                  (-map #'s-trim)
                  (-map (lambda (line)
                          (if (s-starts-with? "* " line)
                              (s-concat "-" (substring-no-properties line 2))
                            line))))))
    (s-join "\n" lines)))

(defun omd-fix-katex (string)
  "Fix katex blocks in the string"
  (with-temp-buffer
    (insert string)
    (goto-char (point-min))
    (while (search-forward "{% katex " nil t)
      (let* ((start (search-forward "%}"))
             (end (- (search-forward "{% endkatex %}") 14))
             (block-text (buffer-substring-no-properties start end)))
        (delete-region start end)
        (goto-char start) ;; probably not needed
        (insert (omd-revert-katex block-text))
        (goto-char start)))
    (buffer-string)))

(defun omd-export-post (input-file)
  "Export the post"
  (let ((tmp (make-temp-file "omd"))
        (output (omd-post-output input-file)))
    (--> input-file
       (f-read-text it)
       (s-split "\n" it)
       (omd-transform-lines it)
       (s-join "\n" it)
       (f-write-text it 'utf-8 tmp))
    (--> (shell-quote-argument tmp)
       (shell-command-to-string (format "bundle exec org-ruby --translate markdown %s" it))
       (omd-fix-katex it)
       (f-write-text it 'utf-8 output))))

(provide 'omd)

;;; omd.el ends here
