---
layout: post
title:  "The tragedy of ToList"
date:   2024-07-26 10:00:00
categories: Programming, .NET
---
What do you see when you come across code like this?

```cs
docList.OrderByDescending(item => item.Score).ToList().ForEach(item =>
{
    // Do something with item.
});
```

I see a tragedy.

## A bit of context

> C programmers think memory management is too important to be left to the computer. LSIP programmers think memory management is too important to be left to the user.
>
> -- <cite>Ellis and Stroustrup, The Annotated C++ Reference Manual</cite>

Automatic garbage collection (GC) in programming languages is a beautiful thing. It frees the programmer to focus on the essence of the problem they are trying to solve, not the minutiae of how the computer hardware actually implements the solution. This is especially true when applying functional programming techniques, where the declarative style of such programs makes **how** the computation is achieved unimportant compared to **what** it is achieving.

Newer programmers may have an incorrect impression that GC is a new, modern technique, designed to reduce the longstanding burden of manual memory management imposed by classical languages such as C and C++. This is entirely untrue, of course, as anyone who has studied computing history will know: one of the very first high-level programming languages, predating C by more than a decade, was John McCarthy's LISP, a functional language that introduced the technique of garbage collection to the world. This was circa 1959, at the dawn of computing, a date so long ago that the modern generation can likely hardly fathom it.

GC makes a bargain with the programmer: leave the memory management to me, at the cost of losing complete control over every aspect of how a computation is carried out. This, consequently, means accepting some possible performance overhead and inefficiency in exchange for increased simplicity and correctness. Memory safety and correctness issues are historically one of the greatest sources of bugs in computer software, so in a very large percentage of cases this is a highly acceptable tradeoff.

Even in the world of systems programming, where the mere thought of GC is anathema to the extreme performance requirements and low level control needed in something like your operating system kernel, there is a push towards memory-safe languages like [Rust](https://www.rust-lang.org/). In [a famous tweet](https://x.com/markrussinovich/status/1571995117233504257), Mark Russinovich declared that we should consider traditional languages like C/C++ deprecated for new projects.

.NET developers have the luxury of working in an ecosystem that is memory safe by default via an excellent Garbage Collector implementation, while also providing escape hatches (`unsafe`, `Span<T>`, etc.) to allow optimization in paths where the overhead of GC might be unacceptable.

## GC Quick Summary
The actual implementation of GC in .NET is a fairly complex topic; there are a lot of details related to different GC modes, various types of heaps, dealing with fragmentation and large objects, etc. I recommend reading the [GC Documentation](https://learn.microsoft.com/en-us/dotnet/standard/garbage-collection/) for details.

We can, however, summarize a few salient points:

1. The vast majority of the types you define are likely to be classes and, thus, require GC.
2. Application pauses and high CPU are some of the main performance issues in systems using garbage collection.
3. The more garbage a program generates, the more work the GC has to do.

## GC Abuse
> It's not the garbage collector that's ruining your process. The garbage is ruining your process!
>
> -- <cite>Bryan Cantrill, [Is It Time to Rewrite the Operating System in Rust?](https://www.youtube.com/watch?v=HgtRAbE1nBM)</cite>

The code snippet I opened this article with is tragic because it seems at first glance to so many programmers to be *entirely reasonable*. It is very common in my experience. This is even true in codebases where performance is critically important. Imagine a web service attempting to process hundreds or thousands of requests per-second, with minimal latency, filled with code like that.

The issue, of course, is not about calling `ToList()` in and of itself. There are many reasons to take a sequence of things and turn them into a concrete list. Perhaps we want to perform a binary search, so we need the ability to access specific elements by index. Perhaps we need to make defensive copies before handing those copies to other threads, to avoid thread-safety issues. Perhaps we have a method that only accepts an `IList<T>` so we need to accomodate it. Or, perhaps we have an expensive [LINQ](https://learn.microsoft.com/en-us/dotnet/standard/linq/) query that we want to ensure only executes exactly once. These and many more possible scenarios are completely acceptable reasons to turn our sequence into a List.

However, that is not what we have in that code snippet. What we have is this:

```cs
.ToList().ForEach(/* ... */)
```

Consider what this code does for a moment. It allocates a List for the *sole purpose* of calling the `ForEach` method, because that method only exists on the concrete `List<T>` type. That's right; unlike what you may have thought, the `ForEach` method is not part of the `IEnumerable` type (via LINQ), but is a one-off method defined on `List<T>`.

To be blunt, that method offends the senses. It should not exist.

Why? Because it offers no advantage over simply using a traditional `foreach` loop, other than being able to make it a satisfying 'fluent' one-liner. Which leads to many developers calling `ToList` *solely for the purpose of calling the `ForEach` method*!

For those of us who care about avoiding completely needless, excessive garbage on the managed heap, this is a tragedy.

Think about it. We have some (potentially large) sequence of data in memory. It is most likely already backed in memory by some sort of data structure, such as a List, an Array, a HashSet, etc. Yet because we want to call the `ForEach` method, we make an entire copy of that data in memory, on the managed heap. Copying the array costs time, it costs CPU AND it creates a bunch of additional work for the GC. All of this could be avoided by simply doing the simple thing and writing a traditional foreach loop.

```cs
var orderedList = docList.OrderByDescending(item => item.Score);
foreach (var item in orderedList)
{
    // Do something with item.
}
```

Here we have the sane version of this kind of code; no unnecessary copying of the entire list in memory, just a plain old-fashioned foreach loop.

Many developers wonder why LINQ does not provide a ForEach method. The answer is that it violates the philosophy of the functional nature of LINQ, which discourages side effects in favor of an input sequence always producing some result as output. The result can be another sequence or it can be a discrete value, but it always produces some output. In contrast, the `ForEach` method produces no output value at all; it is only about side effects.

Finally, if you are so enamored with one-liners and method chaining that you cannot live without the silly ForEach method, you can always trivially implement your own:

```cs
internal static class IEnumerableExtensions
{
    internal static void ForEach<T>(this IEnumerable<T> items, Action<T> action)
    {
        foreach (var item in items)
        {
            action(item);
        }
    }
}
```

At least that way you can avoid allocating unnecessary lists willy-nilly throughout your code.

### Non-pessimization
[Casey Muratori](https://caseymuratori.com/about) (known for his work in game engine design and optimization) did an excellent presentation some time back called [Refterm Lecture Part 1 - Philosophies of Optimization](https://youtu.be/pgoetgxecw8) that I highly recommend watching.

I cite this talk often when I give presentations to other developers, as it introduced me to one of my now-favorite programming concepts: non-pessimization.

The idea is to avoid writing 'pessimized' code, where we can think of 'pessimization' as the opposite of 'optimization'; that is, going out of your way to write code that makes the computer do more work than necessary, for no good reason whatsoever.

Calling `ToList().ForEach()` is a perfect example of pessimization in action.

Practice non-pessimization instead. Your garbage collector, and your users, will thank you.

Here is a very simple benchmark showing the difference between using a traditional foreach loop and calling `ToList().ForEach()` instead:

[ForEachVsToListForEach](https://github.com/Treit/MiscBenchmarks/blob/main/ForEachVsToListForEach/Benchmark.cs)

![bencmark results 1](/images/2024-07-26/bench1.png)

Take particular note of the memory allocation ratio and think about the impact on the garbage collector.

## More ToList anti-patterns
When I explore a codebase for the first time I must admit that one of the first things I do now is simply grep for ToList and see what pops up.

In fact, I have a magic regex that just finds bad code for me. (Should this be a Roslyn code analyzer instead of just a simple regex over the text of the source code? Probably!)

My preferred code search tool is [ripgrep](https://github.com/BurntSushi/ripgrep) from the CLI, so my simple little technique is just this handy PowerShell function:

```pwsh
function bad
{
    rg -i "\.(?:ToList|ToArray)\(\)\.(?!As|Json|Node\b|Index|CopyTo|FindLastIndex|AreMore)|Select\(. => .\)|(?:ToList|ToArray)\(\)\.Count > 0" --pcre2 --glob !*test* --glob !*Test* --glob *.cs $args[0]
}
```

What this attempts to flag, among other things, is the pattern of including a call to `ToList()` or `ToArray()` in the *middle* of a chain of other calls. Very often this means we are allocating a list and then throwing it away, doing nothing of value except creating additional garbage for the GC to have to deal with.

I present the following real-world example I came across recently, which the above regex called out as suspicious:

```cs
return groupedItemsDictionary.ToList().Select(x => new ItemView { Id = x.Key, Data = x.Value }).ToList();
```

Did the sensible programmer in you immediately recoil, or did this code look normal to you?

Here is another concrete example of a call that this regex flagged, once again in some code I was working in not that long ago:

```cs
List<KeyValuePair<string, int>> topicsList = topics.ToList();
topicsList.RemoveAll(item => item.Key == null);
topicsList.Sort((pair1, pair2) => pair2.Value.CompareTo(pair1.Value));
int numOfTopics = topicsList.Count;
List<string> sortedTopics = topicsList.Select(item => item.Key).ToList().GetRange(0, Math.Min(numOfTopics, 5));
return sortedTopics;
```

Examine this code for a moment. What do you think? Would you call this out in a code review?

Let's say that you do, commenting "This code seems inefficient. Do we really need to make a copy of the entire list here before returning?"

You get the reply: "The interface contract requires that we return a `List<T>` here, so we don't have a choice."

Your response?

### Subtle counterpoints to the anti-ToList movement
The following piece of code (taken from the Newtonsoft.json codebase) seems, at first glance, to be ludicrous.

```cs
/// <summary>
/// Creates an array from an <see cref="IEnumerable{T}"/>.
/// </summary>

public static TSource[] ToArray<TSource>(
  this IEnumerable<TSource> source)
{
    IList<TSource> ilist = source as IList<TSource>;
    if (ilist != null)
    {
        TSource[] array = new TSource[ilist.Count];
        ilist.CopyTo(array, 0);
        return array;
    }

    return source.ToList().ToArray();
}
```

The intent is clear: turn an `IEnumerable<T>` into an array. Why not, however, just call the existing `ToArray()` method that is part of LINQ?

Even if there is some justification for detecting an `IList<T>` and hand-writing the explicit array copy code (and it is not clear at first glance that such a justification exists), why have an extraneous `ToList()` before calling `ToArray()` in the subsequent code that handles types that are not `IList<T>`? Is this not committing the same sin we have been arguing against? Making an entire copy of the sequence in memory just to throw it away and allocate yet another copy by copying the List into an array?

Original sequence -> copied into new List -> copied into new Array.

Garbage everywhere!

Things are not always as straightforward as they seem, however. Consider a program that uses the above extension method:

```cs
public static void Main(string[] args)
{
    IEnumerable<int> list = new HashSet<int> { 1, 2, 3, 4, 5 };
    var array = list.ToArray();
    Console.WriteLine(string.Join(", ", array));
}

public static TSource[] ToArray<TSource>(
    this IEnumerable<TSource> source)
{
    IList<TSource> ilist = source as IList<TSource>;
    if (ilist != null)
    {
        TSource[] array = new TSource[ilist.Count];
        ilist.CopyTo(array, 0);
        return array;
    }

    return source.ToList().ToArray();
}
```

Running this program prints the following:

```
❯ dotnet run
1, 2, 3, 4, 5
```

Great, let us remove that dirty, offensive call to `ToList` and run it again:

```cs
// return source.ToList().ToArray();
return source.ToArray(); // Much better! 😎
```

Running the program again produces the following:

```
❯ dotnet run
Stack overflow.
Repeat 13771 times:
--------------------------------
   at Program.ToArray[[System.Int32, System.Private.CoreLib, Version=8.0.0.0, Culture=neutral, PublicKeyToken=7cec85d7bea7798e]](System.Collections.Generic.IEnumerable`1<Int32>)
--------------------------------
   at Program.Main(System.String[])
```

What?! Oh no!

In our zealous efforts to remove an unnecessary `ToList` call, we introduced an incurable stack overflow bug!