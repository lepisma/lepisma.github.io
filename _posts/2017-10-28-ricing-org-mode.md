---
layout: post
title: Ricing up Org mode
tags: org-mode emacs ricing ux
---

<span class="dropcap">T</span>his is a short post pulling in [my
comment](https://www.reddit.com/r/unixporn/comments/73vwpa/stumpwm_light_colors_with_purple_accent/dnvqwt8/?context=1)
on a /r/unixporn submission where I document my Org mode dotfiles for a word
processor like interface. The aim is to recreate a
[rice](https://www.reddit.com/r/unixporn/comments/6lj3h3/stumpwmkde_emacs_org_mode_writing_setup/)
I submitted on /r/unixporn some time back. Shown below is a demo of what the
thing actually looks like.

<aside>
<div class="aside-title">
In action
</div>

<p>
Following screencast shows the setup in action.
</p>

<video width="100%" controls="controls">
  <source src="https://u.teknik.io/5Vy1T.mp4" type="video/mp4">
</video>
</aside>

<figure>
  <img src="/images/posts/org-rice/demo.png">
</figure>

The look is inspired from the style used by [Edward
Tufte](https://edwardtufte.github.io/et-book) in his books. A replication of the
style in CSS is up on github for free at
[tufte-css](https://edwardtufte.github.io/tufte-css/). Other than the proper
spacing and margins, the thing that I like in Tufte's style is the font [ET
Book](https://edwardtufte.github.io/et-book) which is an old-style serif font
with beautiful _italics_.

<figure>
  <a href="/images/posts/org-rice/et-book.png" data-lightbox="bootstrap">
    <img src="/images/posts/org-rice/et-book.png">
  </a>
  <figcaption>
    Et Book font
  </figcaption>
</figure>

---

To start, we need a nice looking light color scheme so that faces other than
that of Org mode look decent. I
selected [spacemacs-light](https://github.com/nashamri/spacemacs-theme) mostly
because I use spacemacs and it is pretty complete as far as number of faces
covered is concerned. Also, it has a good off-white background (`#fbf8ef`).
There are three basic steps involved from here:

1. Setting faces and themes
2. Padding and stuff
3. Other Org-mode visual and usability tweaks

## Faces

We will set Et Book (named `EtBembo`) font to most of the org mode. Get the font
[here](https://github.com/edwardtufte/et-book). If you are using spacemacs, the
easy way is to use the `theming` layer in spacemacs to set faces. My face config
are available
[here](https://github.com/lepisma/rogue/blob/75ab1c3422b409f41daa4c003b931e869eed0914/config.el#L205).
For each face, the second set of properties are for the light theme
(spacemacs-light). I have set the `variable-pitch` font to be `EtBembo` (along
with title and stuff) and enable `variable-pitch-mode` when in an org buffer.

Note that unlike other face settings, `org-indent`'s `(:inherit (org-hide
fixed-pitch))` has a crucial effect of aligning text under Org heading in a
non-monospace font, so you might not want to miss that.

## Padding

There are a few places where you can gain some breathing space.

1. Line spacing

   Per buffer line spacing can be set using the variable `line-spacing`.
   Something like 0.1 goes well here.
   
2. Top padding
   
   Similar to `mode-line`, Emacs also has `header-line` for windows. Setting its
   format to empty string `(setq header-line-format " ")` gives you top padding.
   Also by changing header-line face height, you can change this spacing.

3. Side padding

   Adding side spaces is possible by setting margin width. You also need to
   reset the buffer to make the change visible. Here is a function that does
   that:

   ```emacs-lisp
   (lambda () (progn
     (setq left-margin-width 2)
     (setq right-margin-width 2)
     (set-window-buffer nil (current-buffer))))
   ```
   
If you need padding all around the frame so that everything (including
mode-line) goes inside the padded view, you can set `internal-border-width`.

You can also try
[writeroom-mode](https://github.com/joostkremers/writeroom-mode) which makes the
writing buffer cleaner and has settings for many of the padding related stuff.
One neat feature is that it makes the buffer text centered and hides mode line.
I don't use it much since my current settings reproduce pretty much what I need
from it. Nevertheless, [here is some
config](https://github.com/lepisma/rogue/blob/75ab1c3422b409f41daa4c003b931e869eed0914/packages.el#L264-L287)
for writeroom.

## Other tweaks

Whatever information your mode line might be displaying, most likely it can be
turned off if you are aiming for a distraction free setup. Spacemacs provide a
minor mode `hidden-mode-line-mode` to hide the mode line, which can be added to
your org hook. Some other minor settings follow:

```emacs-lisp
(setq org-startup-indented t
      org-bullets-bullet-list '(" ") ;; no bullets, needs org-bullets package
      org-ellipsis "  " ;; folding symbol
      org-pretty-entities t
      org-hide-emphasis-markers t
      ;; show actually italicized text instead of /italicized text/
      org-agenda-block-separator ""
      org-fontify-whole-heading-line t
      org-fontify-done-headline t
      org-fontify-quote-and-verse-blocks t)
```

Also try disabling `hl-line-mode` in org-mode as varying line heights make these
highlights look bad. Install
[org-pretty-table-mode](https://github.com/Fuco1/org-pretty-table) for getting
beautiful table borders. Other stuff like latex (`org-latex-toggle-fragment`)
and image previews (`org-image-toggle-inline`) come bundled in with org.

[Here](https://github.com/lepisma/rogue/tree/75ab1c3422b409f41daa4c003b931e869eed0914)
is the snapshot of my Emacs dotfiles with config related to this post.
