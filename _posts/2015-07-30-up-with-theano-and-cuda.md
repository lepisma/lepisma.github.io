---
layout: post
title: Up and running with Theano (GPU) + PyCUDA on Windows
date: 2015-07-30
summary: Setting up Theano with CUDA acceleration and PyCUDA on Windows.
categories: articles
---


<span class="dropcap">G</span>etting CUDA to work with python on Windows is really frustrating. Its not exactly hard, but is sure irritating when you start doing it. If you have ever tried it, you might be knowing that many possible combinations of *compilers*, *cuda toolkit*, *python* etc. don't work.

This post describe the steps that I followed for a working setup of theano working with GPU acceleration and PyCUDA for general access to GPU from python. Hopefully, it will help if you haven't found the sweet spot yet.

## Setting up

Starting with my machine, it is a **Pavilion DV6 7012tx** Laptop with Nvidia GeForce GT **630m** card. Right now its running **Windows 10 x64**. If you are already having `cygwin` or `mingw` based `gcc` in place, you might want to remove that since our scientific python stack will provide that.

### 1. Install Visual Studio

This is needed to get Nvidia's CUDA compiler (`nvcc`) working. For choosing the version, go to the latest [CUDA on Windows doc](http://docs.nvidia.com/cuda/cuda-getting-started-guide-for-microsoft-windows/index.html) and see which version of visual studio the current CUDA toolkit supports.

At the time of writing, CUDA 7 was the latest release and Visual Studio 2013 was the latest supported version. You also don't need to install 2008 or 2010 version of compiler for python. This will be taken care of later, just go with everything latest.

After installation, you don't actually need to add `cl.exe` (usually in a directory like `C:\Program Files (x86)\Microsoft Visual Studio 12.0\VC\bin`, depending on your Visual Studio version) to `PATH` for theano since we will define this explicitly in `.theanorc`, but it is better to do this as many other tools might be using it.

### 2. Install CUDA toolkit

This should be easy, get the latest CUDA and install it. Keep the samples while installing, they are nice for checking if things are working fine.

### 3. Setup Python

This is where most of the trouble is. Its easy to get lost while setting up vanilla python for theano specially since you also are setting up `gcc` and related tools. The theano installation tutorial will bog you down in this phase if you don't actually read it carefully. Most likely you would end up downloading lots of legacy Visual Studio versions and other stuff. We won't be going that way.

Install a scientific python distribution like [Anaconda](http://continuum.io/downloads). I haven't tried setting up theano using other distributions but this should be one of the easier ways because of [conda](http://conda.pydata.org/docs/#conda) package manager. This really relieves you from setting up a separate `mingw` environment and handling *commonly used* libraries which are as easy as `conda install boost` in Anaconda.

If you feel Anaconda is a bit too heavy, try [miniconda](http://conda.pydata.org/miniconda.html) and adding basic packages like `numpy` on top of it.

Once you install Anaconda, install additional dependencies.

```
conda install mingw libpython
```

### 4. Install theano

Install theano using `pip install theano` and create a **.theanorc** file in your `HOME` directory with following contents.

```
[global]
floatX = float32
device = gpu

[nvcc]
flags=-LC:\Anaconda\libs
compiler_bindir=C:\Program Files (x86)\Microsoft Visual Studio 12.0\VC\bin
```

Make sure to change the path `C:\Anaconda\libs` according to your Anaconda install directory and **compiler_bindir** to the path with `cl.exe` in it.

### 5. Install PyCUDA

Best way to install PyCUDA is to get the Unofficial Windows Binaries by Christoph Gohlke [here](http://www.lfd.uci.edu/~gohlke/pythonlibs/).

For quick setup, you can use [pipwin](https://github.com/lepisma/pipwin) which basically automates the process of installing Gohlke's packages.

```python
pip install pipwin
pipwin install pycuda
```

### 6. Testing it out


#### Theano

A very basic test is to simply import theano.

```python
import theano
Using gpu device 0: GeForce GT 630M (CNMeM is disabled)
```

This should tell you if the GPU is getting used.

One error says that *CUDA is installed, but device gpu is not available*. For me, this was solved after installing `mingw` and `libpython` via conda since Anaconda doesn't setup `gcc` along with it as it used to do earlier.

For a more extensive test, try the following snippet taken from [theano docs](http://deeplearning.net/software/theano/tutorial/using_gpu.html).

```python
from theano import function, config, shared, sandbox
import theano.tensor as T
import numpy
import time

vlen = 10 * 30 * 768  # 10 x #cores x # threads per core
iters = 1000

rng = numpy.random.RandomState(22)
x = shared(numpy.asarray(rng.rand(vlen), config.floatX))
f = function([], T.exp(x))
print f.maker.fgraph.toposort()
t0 = time.time()
for i in xrange(iters):
    r = f()
t1 = time.time()
print 'Looping %d times took' % iters, t1 - t0, 'seconds'
print 'Result is', r
if numpy.any([isinstance(x.op, T.Elemwise) for x in f.maker.fgraph.toposort()]):
    print 'Used the cpu'
else:
    print 'Used the gpu'
```

You should see something like this.

```python
Using gpu device 0: GeForce GT 630M (CNMeM is disabled)
[GpuElemwise{exp,no_inplace}(<CudaNdarrayType(float32, vector)>), HostFromGpu(GpuElemwise{exp,no_inplace}.0)]
Looping 1000 times took 1.42199993134 seconds
Result is [ 1.23178029  1.61879349  1.52278066 ...,  2.20771813  2.29967761
  1.62323296]
Used the gpu
```

#### PyCUDA

Here is a quick test snippet from the PyCUDA web page [here](http://documen.tician.de/pycuda/index.html)

```python
import pycuda.autoinit
import pycuda.driver as drv
import numpy

from pycuda.compiler import SourceModule
mod = SourceModule("""
__global__ void multiply_them(float *dest, float *a, float *b)
{
  const int i = threadIdx.x;
  dest[i] = a[i] * b[i];
}
""")

multiply_them = mod.get_function("multiply_them")

a = numpy.random.randn(400).astype(numpy.float32)
b = numpy.random.randn(400).astype(numpy.float32)

dest = numpy.zeros_like(a)
multiply_them(
        drv.Out(dest), drv.In(a), drv.In(b),
        block=(400,1,1), grid=(1,1))

print dest-a*b
```

Seeing a array of zeros ? Its working fine then.

Hopefully, this should give you a working *pythonish* CUDA setup using the latest versions of VS, Windows, Python etc.
