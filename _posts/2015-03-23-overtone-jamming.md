---
layout: post
title: Overtone Jamming
summary: Programming music with Clojure.
tags: ramble
---

> The writer knows *shit* about music composition. So, no questions on chords,
> scales or any other music jargon. Please.

<span class="dropcap">W</span>hen I was younger, I came to know about
algorithmic (and mathematical) music composition through an awesome piece of
work by Carl McTague that goes by the name
[*6 Integers*](http://www.mctague.org/carl/music/computer/pieces/6_integers/).

Don't know what exactly happened at that time, but I started hunting for these
stuff recently and my searches pointed to a hugely popular tool for real-time
audio synthesis and algorithmic composition,
[SuperCollider](http://supercollider.sourceforge.net/).

Turned out, raw SuperCollider needs effort to get started with, and most
importantly, to quickly generate meaningful music.

Looking for alternatives, I found [Sonic Pi](http://sonic-pi.net/). This was
impressive, try the sample sounds on their website. But, the coolest thing was
[Overtone](http://overtone.github.io/).

# Overtone

Overtone allows you to [live] code (and compose music) in
[Clojure](http://clojure.org), which is a modern dialect of lisp that runs on
JVM. Emacs has a really nice plugin for Clojure named
[Cider](https://github.com/clojure-emacs/cider). This, alongwith
[Leiningen](http://leiningen.org/) makes it really easy to get started with
overtone.

~~~ clojure
--> Booting external SuperCollider server...

--> Connecting to external SuperCollider server: 127.0.0.1:31214


    _____                 __
   / __  /_  _____  _____/ /_____  ____  ___
  / / / / | / / _ \/ ___/ __/ __ \/ __ \/ _ \
 / /_/ /| |/ /  __/ /  / /_/ /_/ / / / /  __/
 \____/ |___/\___/_/   \__/\____/_/ /_/\___/

   Collaborative Programmable Music. v0.9.1


Hello Lepisma. Do you feel it? I do. Creativity is rushing through your veins today!
~~~

It starts with a rather flattering message.

Anyways, as the message shows, it works on SuperCollider server, so has all the
power you need. I, personally, don't exactly feel at home while using Clojure,
due to its *lispy* and functional style, but trust me, in live coding
situations, this feels much better and usable. There is also a Clojure version
of Processing named [quil](https://github.com/quil/quil) that supports live
coding. Try that too and you will feel the difference.

---

So, you can play basic waves like sin, sawtooth, square etc. and control pretty
much everything like bpms, scales. A simple example is here.

~~~ clojure
;; the 'kick' instrument
;; taken from https://github.com/overtone/overtone/wiki/Live-coding

(definst kick [freq 120 dur 0.3 width 0.5]
  (let [freq-env (* freq (env-gen (perc 0 (* 0.99 dur))))
        env (env-gen (perc 0.01 dur) 1 1 0 1 FREE)
        sqr (* (env-gen (perc 0 0.01)) (pulse (* 2 freq) width))
        src (sin-osc freq-env)
        drum (+ sqr (* env src))]
    (compander drum drum 0.2 1 0.1 0.01 0.01)))

;; use it on a loop with metronome; 128 bpm
(def metro (metronome 128))

(defn player [beat]
  (at (metro beat) (kick))
  (apply-by (metro (inc beat)) #'player (inc beat) []))

;; play
(player (metro))
~~~

Here is what you get

<iframe width="100%" height="166" scrolling="no" frameborder="no"
src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/197327870&amp;color=111111&amp;auto_play=false&amp;hide_related=false&amp;show_comments=true&amp;show_user=true&amp;show_reposts=false"></iframe>
<br>

You can also do other stuff like sweeping the signal, using band pass filters,
white noise etc. The most important thing, *get few things right and the noise
feels impressive.*

By the way, if the above example didn't impress you. The next just might. Its a
slight modification of dubstep from
[here](https://github.com/overtone/overtone/blob/master/src/overtone/examples/instruments/dubstep.clj).

<iframe width="100%" height="166" scrolling="no" frameborder="no"
src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/197334347&amp;color=111111&amp;auto_play=false&amp;hide_related=false&amp;show_comments=true&amp;show_user=true&amp;show_reposts=false"></iframe>
<br>

Here is one of my attempts at randomly mixing stuff. Though not even remotely
close to be called good, it does put the power of overtone on show.

<iframe width="100%" height="166" scrolling="no" frameborder="no"
src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/197347055&amp;color=111111&amp;auto_play=false&amp;hide_related=false&amp;show_comments=true&amp;show_user=true&amp;show_reposts=false"></iframe>
<br>

Here is one that uses strings. *The Messenger* by *Linkin Park*. Pretty basic
chords, but kind of gets nearby.

<iframe width="100%" height="166" scrolling="no" frameborder="no"
src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/197342369&amp;color=111111&amp;auto_play=false&amp;hide_related=false&amp;show_comments=true&amp;show_user=true&amp;show_reposts=false"></iframe>
<br>

Once you start programming music, Its addictive. I don't know if the composition
means anything to anyone, but it sure is fun to do.

I didn't mention it before, there are bands that compose using Overtone.
Do check them out, specially [Meta-eX](http://meta-ex.com/).
