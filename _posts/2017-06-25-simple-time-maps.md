---
layout: post
title: Simpler time map plots
tags: exploration
---

<p class="post-intro" markdown="1">
Proposing a one dimensional version of [time
map](https://districtdatalabs.silvrback.com/time-maps-visualizing-discrete-events-across-many-timescales)
plots which doesn't lose any information displayed in most cases and is cleaner
to understand.
</p>
<!--more-->

<span class="dropcap">B</span>ehavior of time series is tricky to judge from
simple plots. The process generating the series can have multiple underlying
mechanics and simple plots make it hard to discern these. Sometime back I read
about
[time maps](https://districtdatalabs.silvrback.com/time-maps-visualizing-discrete-events-across-many-timescales),
which try to solve a part of this problem (I encourage you to read that post
before this one). Time maps target visualizing time differences between discrete
events. This is helpful, for example, to see if there are multiple modes in the
repetition of some events. If on a single day you eat 5 times from 9 AM to 11 AM
and call it a day, your eating time plot will have repetitions for those small
intervals *and* for the daily one. A time map captures these two modes easily.

Consider the following time series. The x axis shows date and the y axis shows
my lastfm [scrobbles](https://www.last.fm/user/abhinavtushar) per day.

<figure>
<div id="counts-lfm"></div>
<figcaption>My daily lastfm scrobbles</figcaption>
</figure>

Nothing much to it. If I plot it as a time map, I get this (scale is log; sorry
for the *not that useful* tick labels in this whole post,
[will fix it](https://github.com/lepisma/tufte.js/issues/21)).

<figure>
<div id="diffs-lfm-vanilla"></div>
<figcaption>Scrobbles time map</figcaption>
</figure>

Each dot here is a listen. The \\( x \\) value being the time difference between
it and the previous listen, \\( y \\) being the difference with next listen.
Note that the plot is log scaled (thus the repeated pattern in lower values)
which helps us understand the diffs at multiple scales.

Another important point is the *almost* symmetry along \\( x = y \\) line. When
you use the *pre-event* and *post-event* time diffs of each event as \\( x \\)
and \\( y \\) value for plotting, one points \\( x \\) will be previous one's
(according to event ordering) \\( y \\) value. Now this has consequences on
whether a time map is useful for you. What follows is the same plot with
marginal histograms along the axis. No doubt the \\( x \\) and \\( y \\)
marginals are similar. This is not because of the data but because of the way
both axis values are derived, resulting in a non-exact symmetry.

<figure>
<div id="diffs-lfm"></div>
<figcaption>Time map with marginals</figcaption>
</figure>

Think about a point in top left corner. This refers to an event which was
preceded by another event shortly but is followed by the next event after a long
time gap. The opposite happens with point in bottom right. Because adjacent
events share \\( x \\) and \\( y \\), the mass of points has similar
distributions (notice that this is not the case with very few points). Unless
you are displaying another data dimension using color / size of the circles
(like in the original
[blog](https://districtdatalabs.silvrback.com/time-maps-visualizing-discrete-events-across-many-timescales),
where we see points colored according to the time of day), the two dimensions
here just add to the visual clutter.

---

Lets tweak the lastfm data a little bit. Now, the scrobbles are filtered to show
only the first listen of each song. To give this some meaning, a lot of these
*filtered* scrobbles in a short time span would mean that I explored more as
compared to repeating the same old songs.

<figure>
<div id="diffs-lfm-dd"></div>
<figcaption>First listen time map</figcaption>
</figure>

Notice how easy it is to find the bumps in the marginal plot. A plot of \\( x
\\) marginal follows.

<figure>
<div id="dd-hist"></div>
<figcaption>x marginal plot of first listens</figcaption>
</figure>

As a side note this plot makes me wonder about the origin of the bumps. The
initial rise up to \\( x = 3, 4 \\) (around 20, 50 minutes) is mostly due to
radios listens (which give you fresh songs frequently) or binging on some new
album/artist. The one around 7 (around 18 hours) might be a *session* change. A
new session, with fresh items probably. Need to dig in the actual songs to
understand this.

## Tweets

The original blog made a time map for tweets
of [@BarackObama](https://twitter.com/BarackObama). I did a re-crawl. Here is
the time plot of tweets per day.

<figure>
<div id="counts-tw"></div>
<figcaption>Tweets per day @BarackObama</figcaption>
</figure>

Next is the full time map for the series.

<figure>
<div id="diffs-tw"></div>
<figcaption>Tweets time map @BarackObama</figcaption>
</figure>

As argued earlier, unless we are showing extra information, its much easier to
see the marginal to get the frequency behavior of the series. See the plot
below.

<figure>
<div id="tw-hist"></div>
<figcaption>Tweets time map 1D @BarackObama</figcaption>
</figure>

## Gotchas

- Making sense of a histogram in log scale (the kind I used, with uniform bins
  over log scaled data; You can have non-uniform, log scaled bins too. I haven't
  tried that) is tricky. The bins and density don't exactly go as you would
  think. Additionally you would see repeated pattern (exposing the discrete
  values) in the beginning and smoothing in the end. More rigorous analysis
  should be done to derive something other than qualitative meanings from these.
- Add to it the number-of-bins problem. Plots above
  use
  [Freedman-Diaconis rule](https://en.wikipedia.org/wiki/Freedman%E2%80%93Diaconis_rule) to
  get the number of bins. Changing this number can result in different views
  as shown below.

<figure>
<div id="tw-hist-less"></div>
<figcaption>Tweets time map with 10 bins</figcaption>
</figure>

<figure>
<div id="tw-hist-more"></div>
<figcaption>Tweets time map with 200 bins</figcaption>
</figure>

---

Time maps are neat exploratory tools. To me, they have more qualitative value
than quantitative. Most of the visualizations with more than a few dozen points
make more sense qualitatively and are better without unnecessary details, that's
why we prefer heatmaps instead of regular scatter in certain cases. A marginal
time map follows the same idea.

<script src="https://d3js.org/d3.v4.min.js"></script>
<script src="/scripts/posts/time-maps/tufte.min.js"></script>
<script src="/scripts/posts/time-maps/script.js"></script
