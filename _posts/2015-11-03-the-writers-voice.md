---
layout: post
title: The Writers' Voice
tags: ml exploration viz
---

<script src="https://d3js.org/d3.v3.min.js"></script>

<style>
#scatter, #words {
  font-size: 12px;
}

.tooltip {
  position: absolute;
  width: 200px;
  height: 28px;
  pointer-events: none;
  font-size: 12px;
}

.footer {
  bottom: -16px;
  position: relative;
}

</style>

<p class="post-intro" markdown="1">
Exploring a new way to compare storytelling in classics by comparing changing
signals in a word embedding space using dynamic time warping.
</p>
<!--more-->

<span class="dropcap">I</span>f you are a fanatic reader of a particular author,
you can immediately identify whether a given (unknown) text is written by
him/her or not. Apart from the idiosyncrasies and diction, the flow and
development of text is particularly unique to an author. You can actually
visualize a curve of rising and falling emotional cues like *thrill*,
*optimism*, *confusion* in their works. Taking these works as signals can, in
principle, allow us to compare the writing styles. This post tries to do the
same using a technique called *dynamic time warping* on signals based on word
vectors gathered from classic literary works.

## Text to Signal

There are many ways to see text as a time series. I will use a pretty basic and
intuitive technique with word embeddings.

### Word Embeddings

Word embeddings provide projections of *words* from any language to some {%
katex %}N{% endkatex %} dimensional mathematical space. In simple terms, it
provides a vector for each word it has seen. The vector is learned in relation
to the context in which it appears. A popular method uses Continuous Bag of
Words and Skip-gram and has a python implementation in [gensim
(Word2Vec)](https://radimrehurek.com/gensim/models/word2vec.html).

An excellent primer on the topic is on the blog of Christopher Olah
[here](http://colah.github.io/posts/2014-07-NLP-RNNs-Representations/). This
vector representation does two things for us:

1. *Gives us something much more amenable to mathematical analysis, numbers.*
2. *Arranges the words in vector space according to the semantic meanings.*

A sample of 1000 words from a 100 dimensional word space (t-SNE*ed* to 2
dimensions) after training on [Project Gutenberg's](https://www.gutenberg.org/)
1000 ebooks is shown below. Although the words look mostly archaic, lookout for
nearby words with semantic connections (hover on dots).

<div id="words">
</div>

### Cramming text

After training an embedding model (with 100 dimensions) and computing vectors
for each word in a book, we are left with a matrix of size {% katex %}N_w \times
100{% endkatex %}, where {% katex %}N_w{% endkatex %} is the number of words.
One simple reduction strategy for {% katex %}N_w{% endkatex %} is to simply take
sentence vectors by averaging out the words (though, we could have used
[Doc2Vec](https://radimrehurek.com/gensim/models/doc2vec.html) here, but lets go
with this). For 100 columns, we can hinge to few fixed word vectors like
*romance*, *mystery* and calculate cosine distances of the rows from these
anchor points. But, since the word space coverage might be severely affected, a
better way is to create anchor points in the number space directly.

A simple K-means clustering with 4 centers provide us the anchor points and now
the matrices are of size {% katex %}N_s \times 4{% endkatex %}. Below is the
graph for *The Sign of the Four* by Arthur Conan Doyle.

<figure>
<img src="/images/posts/voice/anchors.png">
</figure>

The smooth lines are generated after using a gaussian filter and they more or
less capture the essence of the flow.

## Comparing signals

Once we have set of comparable signals for each book, next step is to do actual
comparison. A simple way would be to extract some sort of features from these
time series or directly apply techniques to learn from the series. But, lets try
something more crude and direct.

<blockquote>
<p>
In time series analysis, dynamic time warping (DTW) is an algorithm for
measuring similarity between two temporal sequences which may vary in time or
speed.
</p>
<footer>
<cite title="Wikipedia">
Wikipedia
</cite>
</footer>
</blockquote>

In short this is what we want. DTW has simple working principles and is
invariant of length and positions of peaks and valleys in signals. The
[pseudo code](https://en.wikipedia.org/wiki/Dynamic_time_warping#Implementation)
on Wikipedia should get you started.

### Distances to coordinates

Once we get the distances, we get 2D cartesian coordinates using
[Multi Dimensional Scaling (MDS)](https://en.wikipedia.org/wiki/Multidimensional_scaling).
Although we won't talk about this here, MDS is a cool thing to look for in data
visualization.

Anyway, here is the scatterplot of 24 classic books.

<div id="scatter">
</div>

Jane Austen gets a personal space of her own. Mark Twain looks versatile.

One thing that personally worries me while reading fiction is the easy
predictability, not of facts (which doesn't hurt), but of what will happen next
in a global emotional context. Reading
[The Lost Symbol](https://www.goodreads.com/book/show/6411961-the-lost-symbol)
made me feel like I am reading
[Digital Fortress](https://www.goodreads.com/book/show/11125.Digital_Fortress)
all again. Hopefully, this won't happen again.

<script src="/scripts/posts/writing/scatter.js">
</script>

<script src="/scripts/posts/writing/words.js">
</script>