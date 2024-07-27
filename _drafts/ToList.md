---
layout: post
title:  "The tragedy of ToList()"
date:   2024-07-26 10:00:00
categories: Programming, .NET
---
```cs
int i = 0;
```


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