---
layout: post
title: Optional typing
summary: Experiences with static type checking
category: articles
---

<span class="dropcap">I</span> recently
tried [TypeScript](https://www.typescriptlang.org/) for a project. Essentially,
it is a [gradually typed](https://en.wikipedia.org/wiki/Gradual_typing) superset
of JavaScript. Originally intended for learning, the switch immediately felt
empowering. Not that TypeScript is necessarily better (haven't used it enough to
say that) but for a long time python user like me, (pushed) optional type
annotations is refreshing.

Python is one of the popular dynamic typed languages. Not specifying data types
like `int`, `string` allows for simpler programming and faster prototyping,
making it easy to learn. Its not just about being simple
though, [duck typed](https://en.wikipedia.org/wiki/Duck_typing) languages have
their share of benefits which are regularly exploited by the users.

Recent python versions have been pushing through a new change. Python now
provides type hinting support using a now
stable [typing](https://docs.python.org/3.6/library/typing.html#module-typing)
module. I never really cared about types in Python because, well, thats what I
probably have been avoiding by using Python all along. But this is slowly
changing as I use static typing more and more.

## Reading your own code

I enjoy cricket and Emacs. So wrote up a
package, [cricbuzz.el](https://github.com/lepisma/cricbuzz.el), for displaying
cricket scores in Emacs. It basically is a web scraper
for [cricbuzz.com](https://www.cricbuzz.com/). Occasionally, there are changes
to the web page structure and I have to do a little bit of tweaking.
It was broken recently and I had to fix it a few months back. Here is one of the
changes I did

```elisp
 -  (let* ((header-node (first data-nodes))
 -         (col-size (length header-node))
 -         (row-nodes (cdr data-nodes))
 +  (let* ((header-node (second data-nodes))
 +         (col-size (length (-remove-item " " header-node)))
 +         (row-nodes (cdr (cdr data-nodes)))
```

I don't know what changed in the variable `data-nodes`. Don't even know what it
holds. The only thing I know is that it contains html elements parsed to
form S-expressions and contains structured data scraped from the website.
The fix works for now but this thing will bug me badly again when something
changes. Knowing that enforcing a structure in html is hard, the point here is that it is
important to know what the symbols contain in your code. This is really helpful
for maintaining the code over a long period of time, or when there are too many
pieces to keep track of.

There are two things really that are usually done to solve these issues:

1. Documenting functions, variables
2. Using helpful names

Helpful names are helpful. But they can get weird. There are understandable
limits to them. Documentations, specially function docs are more helpful.
Usually you add data types for the arguments in the docstring too. Like this
(numpy style):

```python
def noot_noot(pingu, n_noots):
    """
    
    Parameters
    ----------
    pingu : Pingu
        A pingu object
    n_noots : int
        Number of times to noot
    """

    pass
```

This helps in knowing what is going to happen in the function. This also gets
parsed by a documentation generator
like [sphinx](http://www.sphinx-doc.org/en/stable/) so the types specified in
here end up being useful. But they still are pretty passive. There is no way
anyone could stop you from writing this

```python
noot_noot(Pingu(), 1.3)
```

Not until runtime that is.

Notice the function again. The definition line itself is pretty much self
explanatory (thanks to variable naming). There are many similar cases in
practice which need *just a little bit* of hint about data types to clarify their
tasks. "Type hinting" fills in this sweet spot and at the same time flags logical
bugs like passing `float` where `int` is expected.

## Type Hinting

Type hinting is the idea of adding annotations about data type for variables,
function arguments etc. These are usually parsed and checked before runtime
and usually are similar in spirit to something like automatic spell-checkers.
Doing this helps in marking inconsistencies in variables which flow around here
and there. I came to know about type hinting from JavaScript. There
is [flow](https://flowtype.org/) which lets you add hints in plain JS without
much intrusion and strip them off using something
like [babel](https://flowtype.org/docs/running.html) in the compilation step.

Here is a sample taken from flow's homepage.

```js
// @flow
function bar(x): string {
  return x.length;
}
bar('Hello, world!');
```

You drop hints when needed and running `flow` gives you the error it detects

```
3:   return x.length;
            ^^^^^^^^ number. This type is incompatible with the expected return type of
2: function bar(x): string {
                    ^^^^^^ string
```

Then there is TypeScript which behaves more like a superset of JS but with
the same idea. Your development process gets assisted by static types and then
the code gets converted to plain JS and runs *like a duck*.

## mypy

Although not that popular, Python has in-language support for adding type hints
which can be checked by something like [mypy](http://mypy-lang.org/). What this
means for our example is that you could do something like the following:

```python
def noot_noot(pingu: Pingu, n_noots: int):
    pass
    
noot_noot(Pingu(), 1.3)
```

This time, running mypy gives the following:

```
Argument 2 to "noot_noot" has incompatible type "float"; expected "int"
```

Running this code itself will not give any error if there is nothing in
`noot_noot` which relies on `n_noots` not being a float (for example
`range(n_noots)`). This is *just* handy for something as trivial as this. But
gets really useful when you have a lot of structured data going in and out of
things.
The [typing](https://docs.python.org/3/library/typing.html#module-typing) module
provides many primitives to build tailored types. For example, if my program
works with geographical coordinates (a pair of numbers) of cities (string), I
could do something like the following:

```python
from typing import Dict, Tuple

Coordinate = Tuple[float, float]

def minimum_trip_distance(cities: Dict[str, Coordinate]) -> float:
    pass

```

Notice the nice name of the type which helps in identifying the associated
object. We know whenever there is `Coordinate` that its going to be pair of
floats and not
more. mypy's support for types can be seen in
its [doc](http://mypy.readthedocs.io/en/latest/kinds_of_types.html).

Here are a few reasons other than the already helpful type checking to use these
hints:

1. Its not really much to write and actually saves keystrokes as compared to
   writing unnecessary and passive documentation strings.
2. It avoids runtime overheads as compared to defining a logical type using a
   dummy class.

There are concerns about the readability of code as such when using hints as it
goes against python's philosophy. I feel like readability should not be judged
by how it looks to a non-programmer but to a python programmer. Its easier for
me to read that a function takes coordinates (which is known to be a pair of numbers
since I decided to read the code dealing with geography) rather than an argument
described solely by its name and / or docstring.

## Keeping it Optional

Typing is something that feels like it comes attached with performance benefits.
But using mypy for around a month now has convinced me that just the
documentation part is reason enough to use it here and there. It helps keep
track of tiny things like whether I am passing `str` or a `stream` when a
function works on a file. This itself has reduced the load on variable naming.
Also, if you are not writing a hackish script, it does help to put barriers at
places to frame the program.

Most importantly, it really is non-intrusive and purely optional. You could use
hints wherever needed and skip where is it unnecessary and verbose (though I am
not sure if this is a recommended practice).

## Final thoughts

Static type checking in python is not *that* popular if as compared to JS.
But JS community is particularly
[well known](https://hackernoon.com/how-it-feels-to-learn-javascript-in-2016-d3a717dd577f#.yehrvien7) to
quickly get hands on new technologies. The python community is somewhat
different. The users have different expectations from the language and the
language has molded itself to be easy for the users. To elaborate on this: you
won't
see [f-strings](https://docs.python.org/3/whatsnew/3.6.html#whatsnew36-pep498)
getting hugely popular right away because:

- the users don't care about it if the older ways are working (`format()` or
  similar in this case)
- packages / libraries supporting [babel](https://babeljs.io/)-ish ideas are not
  that common to find in python. Even if you are *living on the edge* kind of
  person, you can't just go on your way that easily. (Though I would blame the
  v2-v3 divide for this)
  
Other than that, support for 3rd party modules is not that extensive as of now.
There is [typeshed](https://github.com/python/typeshed/) but doesn't compare to
something
like [DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped). But
this really is a reflection of how popular type hinting is. If not many are
going to use it, there will always be lesser stubs in there.

Of course your IDE / editor need to support on-the-fly type checking to actually
be helpful. Emacs has [flycheck](http://www.flycheck.org/en/latest/) which has an
[extension](https://github.com/lbolla/emacs-flycheck-mypy) for adding mypy as a
checker. PyCharm
also
[supports](https://www.jetbrains.com/help/pycharm/2016.3/type-hinting-in-pycharm.html) it.
