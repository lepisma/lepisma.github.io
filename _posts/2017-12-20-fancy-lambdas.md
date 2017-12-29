---
layout: post
title: Fancy Little Lisp λs
summary: Exploring sugared λ functions in Common Lisp
tags: lisp programming
---

<span class="dropcap">T</span>his year, I am trying to get my hands on [Advent
of Code](https://adventofcode.com/). One of my aims is to try out programming
languages with varying paradigms. As of now, I have attempted the days
(problems) [intermittently](https://github.com/lepisma/advent-of-code) and have
not been changing languages that often too, mostly employing Common Lisp. One
side effect of that has been a chance to have a deeper look into the CL's
package ecosystem.

On first sight, you will notice that a lot of Common Lisp packages are old.
Really old. It feels like you don't have a lot of options. I actually started a
github project for collecting various handy macros/functions I use (or have
seen) in Emacs Lisp, Racket, Clojure etc. In the process, what I found was that
many of these are already present in CL. They are just spread out over lots of
packages (with lot of duplication). An interesting set of Lisp macros that I
have recently started to like is one that provides shortcuts for expressing λ
functions. In this post, I try to knot up the options in Common Lisp for these
little beauties.

---

Working in Lisp (or any language with functional inclinations) makes you use a
lot of partially applied functions. Consider a list of numbers that you want to
increment by 1. In Common Lisp this would be something like:

```common-lisp
(mapcar (lambda (n) (+ 1 n)) '(1 2 3 4 5 6))
```

The `lambda` in the middle really is just creating a partially applied version
of the function `#'+` with the first argument set to 1. Now, writing this much
code (`(lambda (n) (+ 1 n))`) for a simple function can get really boring. In
this specific case, since we already have a unary function `#'1+`, we can get
rid of the boilerplate like this:

```common-lisp
(mapcar #'1+ '(1 2 3 4 5 6))
```

But, in general, you need to use the full `lambda` form. Some Lisps, like
[hy](https://hylang.org) provide a shorter name like `fn` which is neat, but
given that we have macros in hand there can be much cleaner solutions.

# Cut

One of the solutions I first came across is the `-cut` macro in Emacs Lisp from
[dash.el](https://github.com/magnars/dash.el#-cut-rest-params). This has its
origin in [SRFI-26](https://srfi.schemers.org/srfi-26/srfi-26.html) where a one
line description says *Notation for Specializing Parameters without Currying*.

<aside markdown="1">
Currying is a process of converting an *n-ary* function into a chain of
*unary* ones. This is different from what *cut*'s specification says. Cut
returns a single new function with arbitrary positions filled in. Currying
returns a chain which can then be applied sequentially to arguments. Here is an
example of what currying does in [Racket](https://racket-lang.org/):

```racket
(expt 2 5)
;; 32

(curry expt)
;; #<procedure:curried>

((curry expt) 2)
;; #<procedure:curried>

(((curry expt) 2) 5)
;; 32
```
</aside>

In Common Lisp we have [cl-cut](http://quickdocs.org/cl-cut/) which follows
Scheme's cut specification more completely (as compared to dash in elisp). If
you want to (say) replace `?` with `!` in a list of strings, a cut based
solution would be:

```common-lisp
;; cut is from cl-cut
;; replace-all is from cl-strings
(mapcar (cut replace-all <> "?" "!") items)
```

Compare that with the full λ version:

```common-lisp
(mapcar (lambda (s) (replace-all s "?" "!")) items)
```

Not a lot different, but why complicate things if there are shorter ways? Just
like in functions, anonymity in arguments helps when the effective *name* is
clear from context. Cut also allows expressing multiple arguments and λs with
`&rest`:

```common-lisp
;; Replace ? with different string in different items
(mapcar (cut replace-all <> "?" <>) items replacements)

;; Taken from http://quickdocs.org/cl-cut/
(cut list 1 <> 3 <...>)
;; is equivalent to the following
(lambda (x2 &rest xs)
  (apply #'list 1 x2 3 xs))
```

One decision made in cut is to only allow `<>` in flat positions, i.e. the
placeholder `<>` can not be hidden inside parentheses like in the following case:

```common-lisp
;; This doesn't work
(funcall (cut + 2 (* <> 3)) 3)

;; <> inside lists are not detected while generating the argument list
;; (macroexpand '(cut + 2 (* <> 3))) gives
(lambda () (+ 2 (* <> 3)))
```

Sometimes this nesting is needed. For example, if you are converting a list of
temperature given in °F to °C, you might want to be able to write something like:

```common-lisp
(mapcar (cut * (/ 5 9) (- <> 32)) temperatures)
```

If you need only unary functions, a simple solution is to make an anaphoric
version of λ which captures `<>`:

```common-lisp
(defmacro acut (&rest body)
  `(lambda (<>) ,@body))

;; This works now
(mapcar (acut * (/ 5 9) (- <> 32)) temperatures)
```

# Xi

This is another fancy way of creating λs that I came to know from
[hy](https://hylang.org). Although its name is going to be changed in [a
while](https://github.com/hylang/hy/blob/862732ff2a96b811d9b1f077843cd89bb1049099/hy/extra/anaphoric.hy#L114),
according to [current stable
docs](http://docs.hylang.org/en/stable/extra/anaphoric.html#xi), its usage is
like this:

```common-lisp
;; (require [hy.extra.anaphoric [*]])
(xi - x1 x2)
;; This is equivalent to
(fn [x1 x2] (- x1 x2)) ; Not that `lambda` is called `fn` in Hy
```

The important thing to notice is that `xi` supports positional arguments (and
also nesting) by using the number in the placeholders `x1`, `x2` etc. For
example, consider the following snippet:

```common-lisp
;; Hy
((xi - (+ x1 x2) x3) 2 5 10) ;; -3
((xi - (+ x2 x3) x1) 2 5 10) ;; 13
```

Xi really is inspired by Clojure's [anonymous function
syntax](https://clojure.org/guides/learn/functions#_anonymous_functions) which
is pretty powerful:

```clojure
#(+ 10 %)         ;; % acts similar to <> in cut
#(- %1 (+ %3 %2)) ;; We have nesting and positional arguments (%i)
#(some-fun % %&)  ;; We have &rest (as %&) too
```

Closest looking syntax for this in Common Lisp (at least from what I found out)
is of the `#L` reader macro from
[arnesi](https://common-lisp.net/project/bese/docs/arnesi/html/api/function_005FIT.BESE.ARNESI_003A_003ASHARPL-READER.html)
and `^` macro from
[CL21](https://github.com/cl21/cl21/blob/master/doc/Reader_Macros.markdown#-3).
Using `#L`, the above examples in clojure translates to the following Common
Lisp code

<aside markdown="1">
Arnesi is not recommended for use though. The [version on
quicklisp](http://quickdocs.org/arnesi/) is an unmaintained fork and suggests
switching to newer libraries.
</aside>

```common-lisp
;; Need to enable sharp-l reader macro
;; (arnesi:enable-sharp-l-syntax)
#L(+ 10 !1)         ;; !i for position i
#L(- !1 (+ !3 !2))
                    ;; No &rest arguments here
```

In CL21, you have:
```common-lisp
^(+ 10 %)
^(- %1 (+ %3 %2))
                    ;; Don't know if &rest is supported yet
```

Another option is
[positional-lambda](http://quickdocs.org/positional-lambda/) where Clojure's
examples go like the following:
```common-lisp
(plambda (+ 10 :1))            ;; :i for position i
(plambda (- :1 (+ :3 :2)))
(plambda (some-fun :1 :rest))  ;; &rest is supported
```

---

Although using complicated λs signals that you better reconsider your decision
of *not* creating dedicated functions, these fancier variants are pretty useful.

Here is a listing of Common Lisp packages mentioned in this post and some other
which are similar in the sense that they allow creating/manipulating functions:

- [cl-cut](http://quickdocs.org/cl-cut/) for `cut` (and `cute`) syntax from
  [SRFI-26](https://srfi.schemers.org/srfi-26/srfi-26.html)
  
  [![quickdocs-cl-cut](http://quickdocs.org/badge/cl-cut.svg)](http://quickdocs.org/cl-cut/)
  
- [arnesi](http://quickdocs.org/arnesi/) for the `#L` reader macro.
  
  [![quickdocs-arnesi](http://quickdocs.org/badge/arnesi.svg)](http://quickdocs.org/arnesi/)
  
- [CL21](https://github.com/cl21/cl21) for the `^` macro. Not on quicklisp main
  repos but can be installed using ql. Instructions on project's page.

- [positional-lambda](http://quickdocs.org/positional-lambda/) for `plambda`
  macro.
  
  [![quickdocs-positional-lambda](http://quickdocs.org/badge/positional-lambda.svg)](http://quickdocs.org/positional-lambda/)
  
- There is also ```#`-reader``` in [rutils](https://github.com/vseloved/rutils)
  providing Clojure-ish but slightly limited shorthands

  ```common-lisp
  #`(+ 2 %) ; => (lambda (&optional x y) (+ 2 x)) 
  #`((print %) (1+ %)) ; => (lambda (&optional x) (print x) (1+ x))
  #`(+ % %%) ; => (lambda (&optional x y) (+ x y)) 
  ```

  [![quickdocs-rutils](http://quickdocs.org/badge/rutils.svg)](http://quickdocs.org/rutils/)

- [fn](https://github.com/cbaggers/fn) provides another set of shorthands for
  λs. Examples from github page:
  
  ```common-lisp
  (fn* (subseq _@ 0 2)) ; =>  (lambda (&rest _@) (subseq _@ 0 2))
  ;; with reader macros for fn* forms too
  λ(+ _ _1) ; =>  (lambda (_ _1) (+ _ _1))
  ```

  [![quickdocs-fn](http://quickdocs.org/badge/fn.svg)](http://quickdocs.org/fn/)

- [curry-compose-reader-macros](https://eschulte.github.io/curry-compose-reader-macros/)
  provides shorthand reader macros for currying and composing functions. A few
  examples from the github page:
  
  ```common-lisp
  ;; partial application `curry'
  (mapcar {+ 1} '(1 2 3 4)) ; => (2 3 4 5)
  ;; function composition
  (mapcar [#'list {* 2}] '(1 2 3 4)) ; => ((2) (4) (6) (8))
  ;; function split and join
  (mapcar «list {* 2} {* 3}» '(1 2 3 4)) ; => ((2 3) (4 6) (6 9) (8 12))
  ```

  [![quickdocs-curry-compose-reader-macros](http://quickdocs.org/badge/curry-compose-reader-macros.svg)](http://quickdocs.org/curry-compose-reader-macros/)
  
- [curly](http://www.cliki.net/curly) has two reader macros for currying and
  composition. Examples from homepage
  
  ```common-lisp
  '[foo bar * baz] ; => (lambda (#:g2709) (foo bar #:g2709 baz))

  '{foo (bar 16) (baz 23 * 42) quux}
  ;; => (lambda (#:g2724) (foo (bar 16 (baz 23 (quux #:g2724) 42)))
  ```
  
  [![quickdocs-curly](http://quickdocs.org/badge/curly.svg)](http://quickdocs.org/curly/)
