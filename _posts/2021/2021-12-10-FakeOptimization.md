---
layout: post
title:  "Fake Optimization"
date:   2021-12-10 13:00:00
categories: Programming, Performance, C#
---
## The start: an online discussion
I recently participated in an online conversation between a few C# programmers who were discussing the difference between [jagged arrays](https://docs.microsoft.com/en-us/dotnet/csharp/programming-guide/arrays/jagged-arrays) and [multidimensional arrays](https://docs.microsoft.com/en-us/dotnet/csharp/programming-guide/arrays/multidimensional-arrays) in C#.

The conversation went like this:

<div style="font-family:Verdana;">
<b>Me</b>: Multi-dimensional arrays are contiguous in memory. Also, the sizes are fixed, whereas a jagged array the sizes of each element can be different.<br/><br/>
<b>Programmer A</b>: Much faster to loop through an int[,] than int[][].<br/><br/>
<b>Me</b>: You have a benchmark for that?<br/><br/>
<b>Programmer B</b>: Does it really need one... like looping through something that is contiguous in memory would be faster than looping through something that's scattered all around...right?<br/><br/>
<b>Me</b>: I don't doubt it is likely faster, but I'm an empiricist and when people say "much faster" I like to know "how much". But without a benchmark, I can't say.<br/><br/>
<b>Programmer A</b>: I don't have a benchmark for it.<br/><br/>
</div>

## The problem
This short discussion reveals a problem that in some ways plagues the software industry. I have seen it many times in discussions with colleagues and other programmers.

So what's the issue?

Step back and consider what we have here.

First, there is a flatly stated claim that it is "much faster" to use a multidimensional array over a jagged array.

Second, it is considered so obviously true to Programmer B that the idea of benchmarking it seems utterly unnecessary.

This is a picture perfect example of what [Casey Muratori](https://twitter.com/cmuratori) calls "fake optimization" in his excellent talk on [Philosophies of Optimization](https://youtu.be/pgoetgxecw8).

Fake optimization is when someone makes a claim, such as "arrays are always faster than linked lists." (it depends) or "for loops are faster than foreach loops in C#." ([they're not](https://github.com/Treit/MiscBenchmarks/tree/main/ArrayForVsForeach)), without actually knowing what they are talking about.

The insidiousness of fake optimization is that it very often falls under the guise of conventional wisdom, things that "obviously" must be true, so programmers blindly accept it uncritically. I've been hearing the "for loops are faster than foreach loops" line for decades; perhaps it was true at one point. Actually measuring it myself, however, showed that this accepted "fact" was completely bogus, at least in the context of looping over arrays in C#.

The broader point is this: we as software developers, if we want to write high quality software that is fast, the kind of software that users actually *want to use*, must think critically. We must question our assumptions, constantly.

In other words, we need to embrace empiricism.

## Empiricism
Empiricism is a philosophy focusing on the idea that knowledge should be based on evidence, not a priori reasoning. It is one of the fundamental building blocks of the scientific method: theories that cannot be tested against real-world observations are inherently unscientific.

This idea should apply to computer programs as well as scientific theories.

In my experience, programmers who apply this philosophy to their work, emphasizing practicial experimentation and measurements over the purely theoretical, tend to build the best software. Such programmers are pragmatic. They are skeptical. They question their own assumptions and the assumptions of others. They keep everyone honest.

I have worked with some brilliant people who are not empiricists. Their approach to software is based more on theory, mathematical reasoning, beauty, perfectionism, ideal design ideas and patterns. These folks, brilliant though they are, do not write the highest quality software.

Perhaps it is better to let the theorists design the algorithms and prove the math, and let us grubby empiricists build the actual product.

I worked on an optimization problem once. The code in question did something like this:

1. Fetch a few hundred thousand rows from a remote database.
2. Round any floating point columns to two decimal places.
3. Apply a filter to the data in memory.
4. Sort the data in memory.
5. Return the appropriate page of results.

The overall performance of the above sequence was unacceptably slow: it was taking seconds.

A fellow co-worker assumed the issue had to be in the database query since that was the only part that was doing anything that should have been remotely expensive and was the only part that was doing I/O. Everything else was pure in-memory operations, which should be incredibly fast, even on a few hundred thousands rows of data. They went to work on improving the database code.

Being an empiricist and not liking to make assumptions, I spent some time adding highly granular performance logging instrumentation to measure where all of the time was actually being spent inside the code.

It turns out that 90% of the time was in rounding the floating point values to two decimal places. That was the bottleneck.

(If you think that sounds crazy, we can talk about how terrible DataSet and DataTable are for performance over a beer some time.)

Empiricists go where the evidence leads, and sometimes it leads to surprising places.

## Benchmarking
<img src="/images/bdn1.jpg" style="width:50%; height:50%;float:right"/>
Benchmarking is one of the great tools of the empiricist programmer. In the world of C# and .NET programming, we have the excellent [BenchmarkDotNet](https://benchmarkdotnet.org/) tool to make it very easy to write high quality benchmarks.

I maintain a collection of microbenchmarks using BenchmarkDotNet at [https://github.com/Treit/MiscBenchmarks](https://github.com/Treit/MiscBenchmarks). These often arise from discussions with other programmers who practice fake optimization: they make a claim about performance, but they do not have the evidence to back it up. As an empiricist, I cannot help but want to see for myself what is actually true.

It is perhaps our greatest tool to defeat fake optimization.

So when Programmer A said that iterating multidimensional arrays is "much faster" than jagged arrays, I naturally wanted to see some evidence. It made sense to me that working with contiguous memory would indeed be faster, as it works better with CPU caches and prefetching and that kind of thing. I was curious how much faster.

So I wrote [a benchmark](https://github.com/Treit/MiscBenchmarks/tree/main/MultiDimensionalVsJaggedArray), of course.

{% highlight c# %}
public class Benchmark
{
    private byte[,] _mdim;
    private byte[][] _jagged;

    [Params(4, 10, 100, 1024)]
    public int Size { get; set; }

    [GlobalSetup]
    public void GlobalSetup()
    {
        _mdim = new byte[Size, Size];
        _jagged = new byte[Size][];

        var r = new Random();

        for (int i = 0; i < Size; i++)
        {
            _jagged[i] = new byte[Size];

            for (int j = 0; j < Size; j++)
            {
                byte b = (byte)r.Next(256);
                _mdim[i, j] = b;
                _jagged[i][j] = b;
            }
        }
    }

    [Benchmark]
    public long SumJagged()
    {
        long result = 0;
        for (int i = 0; i < Size; i++)
        {
            for (int j = 0; j < Size; j++)
            {
                result += _jagged[i][j];
            }
        }

        return result;
    }

    [Benchmark(Baseline = true)]
    public long SumMultiDimensional()
    {
        long result = 0;
        for (int i = 0; i < Size; i++)
        {
            for (int j = 0; j < Size; j++)
            {
                result += _mdim[i, j];
            }
        }

        return result;
    }
}
{% endhighlight %}

## Results


|                                 Method | Size |             Mean |          Error |         StdDev | Ratio | RatioSD |
|--------------------------------------- |----- |-----------------:|---------------:|---------------:|------:|--------:|
|                              **SumJagged** |    **4** |        **14.086 ns** |      **0.3162 ns** |      **0.5782 ns** |  **0.65** |    **0.04** |
|                    SumMultiDimensional |    4 |        22.088 ns |      0.4707 ns |      0.6283 ns |  1.00 |    0.00 |
|                                        |      |                  |                |                |       |         |
|                              **SumJagged** |   **10** |        **77.723 ns** |      **1.5904 ns** |      **3.5243 ns** |  **0.67** |    **0.04** |
|                    SumMultiDimensional |   10 |       116.340 ns |      2.3632 ns |      5.4298 ns |  1.00 |    0.00 |
|                                        |      |                  |                |                |       |         |
|                              **SumJagged** |  **100** |     **7,396.521 ns** |    **144.2413 ns** |    **236.9925 ns** |  **0.66** |    **0.02** |
|                    SumMultiDimensional |  100 |    11,273.073 ns |    220.4851 ns |    301.8024 ns |  1.00 |    0.00 |
|                                        |      |                  |                |                |       |         |
|                              **SumJagged** | **1024** |   **739,746.989 ns** | **14,707.8503 ns** | **28,686.5325 ns** |  **0.65** |    **0.04** |
|                    SumMultiDimensional | 1024 | 1,133,884.866 ns | 22,135.5315 ns | 51,302.4602 ns |  1.00 |    0.00 |

## Conclusion
The original statement, that using multidimensional arrays would be "much faster", while intuitively obvious to many programmers, was not just based on no actual evidence. 

It was not just wrong.

It was spectacularly wrong. 

The results in fact show the opposite: jagged arrays are faster.

That, my friends, is fake optimization.