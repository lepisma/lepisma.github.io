---
layout: post
title: Constitution De Markov
date: 2016-01-23
summary: Nonsense Constitutional Wisdom
categories: articles
---

<span class="dropcap">R</span>ecently I came across [Constitute](https://www.constituteproject.org/) project that provides *"the World's Constitutions to read, search, and compare"*. Now, 194 constitutions have enough text to play around with generative text models. That is, to create a model of text from the corpus and generate similar data from it.

Most of the impressive feats you will see around at present for generating text use Recurrent Neural Networks. If you want to try these, use [char-rnn](https://github.com/karpathy/char-rnn) (lua) or [lstm-text-generation-example](https://github.com/fchollet/keras/blob/master/examples/lstm_text_generation.py) of keras (python). There are many entertaining examples. Look around for generated [TED talks](https://medium.com/@samim/ted-rnn-machine-generated-ted-talks-3dd682b894c0#.z0dofjaea), [Obama speeches](https://medium.com/@samim/obama-rnn-machine-generated-political-speeches-c8abd18a2ea0), [Biblical tweets](https://twitter.com/rnn_bible) etc. See Karpathy's [post](http://karpathy.github.io/2015/05/21/rnn-effectiveness/) for more examples and insights.

Naturally, I tried doing the same with all the constitutions combined (a universal constitution, all that power!). But, the amount of training time required turned me off. So, I left RNNs for a simpler (faster) model, and wasn't disappointed.

## Markov Chains

Lots and lots of parody text generators on the Internet use Markov Chains. They provide probabilities of transition from one state (letter or word) to other based on the statistics of data they are modeled on. The idea is really simple and beautifully explained [here](http://setosa.io/blog/2014/07/26/markov-chains/).

I will quickly jump to the fun part.

## Wisdom

I used markov model on dump of all the constitutional text combined. Here are some of the pieces of wisdom generated.

Oh, and I hold no responsibilities here.

> The Riksdag may, if necessary, be pursued to the highest point of Mt.

<br>

> Article 104, dissolve the House of Assembly or affect the coinage or currency of Pakistan or any part of Samoa and the efficient management of their affairs. Provided that the parties may elect to have their case decided within a reasonable time. Regarding contracts which regulate the status of a county by law.

<br>

> Mining rights, which include minerals, the electromagnetic spectrum and the space located above the national territory.

<br>

> Privacy shall take place before December 31st, 1995.

<br>

> Any person in pre-trial detention has the right to undisturbed relations and cooperation with their compatriots outside the territory of India.

<br>

> The Riigikogu may express no-confidence in the Prime Minister if more than half of all of the entire Nation.

<br>

> The modalities of management and of results, founded on efficiency and effectiveness, economy, equity, opportunity and objectivity, and are determined by the Constitution and by law. No person may perform a state or public function in conflict with their other functions, occupation or private interests. Foreign citizens and persons without citizenship shall not enjoy the right to freedom.

<br>

> Children shall care for all government officials, and of the judicial or administrative matters that fall within the territory of the Republic. The Deputies represent the respective territorial entity. The conditions under which the conformation of its member within thirty days from the date of appointment to a Sunday.

<br>

> The Constitution of the people of Iran is Islam.

<br>

> Everyone has a right of farmers and crafters and find marketplaces for them.

<br>

> Unless otherwise provided by an independent budget whose items are handled before Congress in conformity with the leave of absence or from a minimum of five independent notable persons. Protection of the Republic can restrict the freedom of association, or by the President shall submit to it against a determination of an Extradition Act.

<br>

> The law shall come into operation of transportation, in the organic laws and shall keep the President.

<br>

> Commercial activities may be regulated by law, to the authority and support the charitable activities for the current term. Efficient, economic, and Schleswig-Holstein. They shall respect the basic needs of the games and lotteries.

<br>

> Constitutional Province of Lower Canada is hereby recognized. The President for a crime.

<br>

> If a Minister must resign. A non-South Sudanese may acquire title to land, natural disaster.

<br>

> The President shall be held to furnish them to sell products to the Constitution. Provided that licences or permits relating to the Union.

<br>

> Sabotage of the Judicial Power of Parliament; that I will not accept their oath during the period between 2015 and 2020 are inferior to 40%.

<br>

> Copyrights, patents of invention and patent rights shall be dealt with behind closed doors. The Prime Minister shall be twice put in place for despotism, repression, tyranny, heals the wounds of the content of other persons indicated by law to protect it.

---

If you want to play around with the data and/or script, head over to the repository [here](https://github.com/lepisma/fake-charter). The script uses [RiTa](http://rednoise.org/rita) and runs on *node.js*. Try changing the N factor (default 3) for creating different N-gram models. A higher value gives similar to original results.

And remember

> Loss of citizenship starts at 11 a. m.
