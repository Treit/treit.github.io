---
layout: post
title:  "A C# programmer examines Rust - Part 1"
date:   2020-3-6 16:29:00
categories: Programming, Rust, C#
---
<style type="text/css">
.pretty-table
{
  padding: 0;
  margin: 0;
  border-collapse: collapse;
  border: 1px solid #333;
  font-family: "Trebuchet MS", Verdana, Arial, Helvetica, sans-serif;
  font-size: 0.9em;
  color: #000;
}

.pretty-table caption
{
  caption-side: bottom;
  font-size: 0.9em;
  font-style: italic;
  text-align: right;
  padding: 0.5em 0;
}

.pretty-table th, .pretty-table td
{
  border: 1px dotted #666;
  padding: 0.5em;
  text-align: left;
  color: #632a39;
}

.pretty-table tr:hover th[scope=row], .pretty-table tr:hover td
{
  background-color: #632a2a;
  color: #fff;
}	
</style>

It's a dark, gloomy February night and I can hear the rain pelting against the windows of my office, behind me. It's late, but I've lost track of time. I am puzzling over some code, kind of hacking away at it, trying to gain clarity. On my second monitor there is a Discord channel running, which I'm trying to follow while experimenting on my own with the code. The book on my desk is open to Chapter 13 and I occasionally refer to it. Something about the problem I'm working on is not quite clicking, but I can feel it...I'm getting close to understanding.

The book is [_The Rust Programming Language_](https://doc.rust-lang.org/stable/book/) and the Discord window is showing the #beginners channel on [The Rust Programming Language Discord Server](https://discord.gg/T2vjnny).

I've been dabbling with Rust off and on for about a year, but only in the most ephemeral ways; I'd complete a small code sample from "The Book" every once in a while; I'd play around with some trivial toy code to try and understand simple things, like how to retrieve the actual memory address of a variable so I can go poke around at it in the debugger.

Incidentally:

{% highlight rust %}
fn get_address_value<T>(val: &T) -> usize {
    val as *const _ as usize
}
{% endhighlight %}

<img src="/images/2020-03-06/rustbook1.jpg" style="width:50%; height:50%;float:right"/>

I was curious, quite intrigued, really, but not to the point where I was heavily motivated to dive in and put in the work to actually go deeper.

That changed, however, after I attended the first ever conference on Rust at Microsoft. This was an internal event designed to bring Rust enthusiasts from around the company together; between a series of informative presentations and some great workshops, it was a success that lit a fire to re-kindle my latent interest in the language.

This night, therefore, I was embarking on the start of attempting some actual, real-world programming in Rust. The purpose was purely educational; I had decided to port an existing Command Line Interface (CLI) app, written a few years earlier, to Rust. The app in question was also originally written as a learning project, at the time to teach myself some rudimentary [F# programming](https://fsharp.org/).

### Why Rust?
To say Rust is a fascinating language would be an understatement. It represents something novel: a language with the memory-safety guarantees of garbage-collected languages like C#, with the performance and control of systems programming languages like C. It also incorporates expressive, higher-level abstractions borrowed from a variety of other languages, including OCaml, C++, Haskell, Erlang, Scheme, and [more](https://doc.rust-lang.org/reference/influences.html).

Around a year ago, I had no idea what Rust was. I'm sure I had seen references to it, as I read a lot of programming forums and blogs, but with no context I remained unaware of it. It's like when you learn a new word and start hearing it everywhere; it was always there, but your brain just filtered it out.

Then by chance I stumbled across the video [Is It Time to Rewrite the Operating System in Rust?](https://youtu.be/HgtRAbE1nBM), featuring Bryan Cantrill. I'm a sucker for computing history and this video just had everything to engage my attention: an entertaining speaker, history lessons on systems programming, funny anecdotes and, not least, the intriguing promise of this new programming languages called Rust.

So, I got interested...and here we are a year late on a stormy night, cozy in our office and wrestling with Rust.

### A small programming problem
The F# program I decided to port to Rust can take several types of input. One possible input is a list of Globally Unique Identifiers (GUIDs), separated by commas. Therefore, we have the following small programming problem to solve:

> Given a string which contains comma-separated values, transform it into a list of Globally Unique Identifiers (GUIDs) if and only if every value is a valid GUID. Ignore whitespace and newlines.

This is not a sophisticated problem, but it is rather typical of the sort of pragmatic problem we have to solve all of the time. This was the problem I was working on solving in Rust, as a first-step to porting my F# program over.

To test any candidate solution, I created ten million GUIDs and wrote them to disk, separating them with commas and random whitespace, including newlines. Why so many? Because trivial amounts of data are just so...uninteresting. You find useful insights when you push your data into the millions, such as bad algorithmic choices that are way too slow, or stack overflows because you assumed memory is boundless, or other interesting issues that my former professional-software-tester self still loves to find.

I know we just wasted ten million GUIDs, [a precious resource that we need to worry about running out of (#SaveTheGuids)](http://www.technofattie.com/2013/04/15/but-what-if-we-run-out-of-guids.html), I hope you can get past my wanton waste.

We should test the invalid case as well, since we stipulated we must only produce a list if all values are valid GUIDs. To test this, we make a copy of the first file and down near the bottom of the mass of GUIDs, newlines and spaces, we can do something like this:

<pre>
53d33661-95f4-4410-8005-274cb477c318,                  fd9cef68-7783-449e-bd02-f6aa1591de84,
6160607e-c770-40ab-94be-ddd5dd092300,        4a35fac7-6768-4c57-8a06-42b96c5b3438,7864a0db-1707-4358-b877-594bc4648f6b,
68d2091f-e194-4361-a1a4-f38332b1ab13,    
979cde21-0b24-433e-9790-8d52daf125fd,  
83a36f67-db75-4b8f-92a8-369001416a5e,            <span style="color:red">I_AM_NOT_A_GUID</span>,3f4d46ca-0b38-4f65-b915-d280187bcc4f,  
71ba44b1-eb6d-472c-841a-56f08f08ec87,                   d12be9e7-2eb6-4841-b9d0-275db66a4d6e,
f9942cff-c51e-4d48-9b8e-225edc397528,   
</pre>

Perfect, we now have two files: one that should produce a list of ten million GUIDs, the other that should produce some result indicating the input was not a valid, well-formed bowl of GUID soup.

#### Solving the problem with imperative coding - C#.
Two popular paradigms when solving a programming problem are _imperative_, where the code details the specific steps the computer should execute in order to arrive at a solution, and _declarative_, where the code specifies the desired logic without detailing every specific step.

Let's first look at solving our small programming problem using an imperative style.

A straight-forward implementation in something like C# might look like the following:

{% highlight c# %}
static List<string> ExtractIds(string input)
{
    List<string> result = null;

    string[] tokens = input.Split(",");

    for (int i = 0; i < tokens.Length; i++)
    {
        string trimmed = tokens[i].Trim();
        
        if (Guid.TryParse(trimmed, out _))
        {
            if (result == null)
            {
                result = new List<string>();
            }

            result.Add(trimmed);
        }
        else
        {
            result = null;
            break;
        }
    }

    return result;
}
{% endhighlight %}

#### Solving the problem with declarative coding - Rust.
While Rust certainly supports the constructs like loops and if-else conditionals that are often used as the primary tools in imperative programming, the examples I have seen of idiomatic Rust code tend towards the more declarative style favored by functional programming languages.

Here is the same solution, written in Rust using a declarative style:

{% highlight rust %}
fn extract_ids(input: &str) -> Option<Vec<&str>> {
    input
        .split(',')
        .map(|s| s.trim())
        .map(|s| Uuid::parse_str(s).ok().map(|_| s))
        .collect()
}
{% endhighlight %}

(Thanks to the folks on the Discord channel who helped me find my way to this particular solution.)

#### Comparison
Which code sample is better? That depends, of course, on your criteria: better in terms of readability? Better in terms of runtime performance? Better in terms of likelihood to have bugs?

I would argue the Rust code is better in all of those criteria, once you have a minimum fluency in functional programming and Rust syntax.

Programmers love to argue about useless trivia, like what it means for a language to be 'low-level' or 'high-level'. Is C# a low-level programming language? Is Rust?

Well, come on, just look at that Rust code. Does that look like a 'low-level' language to you???

The amazing promise of Rust, however, is that you can write declarative code that looks decidedly like it came from a high-level language, yet get the runtime performance of languages like C. Indeed, the code above compiles down to very efficient machine code.

We can look, albeit informally, at the performance characteristics of these two pieces of code in a bit. I'd like to point something else out, which is probably far more important than runtime performance. In most applications, code like the above is not really going to need to process ten million GUIDs. It will be processing a few hundred or maybe a few thousand, and the couple of milliseconds of difference in performance is unlikely to matter.

What does matter? Bugs. Correctness. Confidence in the code.

Now, we're looking at a rather trivial problem and solution, but look closely at both versions of the code and ask yourself: which is more likely to have bugs? Which has mutable state? Which has possible null dereferences?

The Rust code is entirely immune from entire classes of bugs, which is just...awesome. You can't pass it input that is invalid and will make the code crash ('panic', in Rust lingo) because, for instance, there is no 'null' in Rust. The Rust function has no mutable state and no possibility of null references. (Everything is immutable by default in Rust, the exact opposite of C#). 

In the C# code, it crashes if 'input' happens to be null. Oops. There is no such possibility in the Rust version: the input is guaranteed by the compiler to be valid.

There is no possibility of an off-by-one error in the Rust code, for instance because we messed up some loop variable. The C# compiler, on the other hand, won't catch that `for (int i = 0; i <= tokens.Length; i++)` is going to crash at runtime, if we had mistakenly written it that way. In fact, in my original version of the code I wrote `for (int i = 0; i <= input.Length; i++>)` (using the 'input' variable instead of 'tokens') and it crashed. Oops.

Now expand this trivial, almost silly little example to code that is thousands or tens of thousands or more lines of code. Which style of coding is going to give you more confidence? I know for me, knowing that certain kinds of bugs are completely impossible is a huge win.

(Don't even get me started on Rust's amazing concurrency guarantees...)

#### Solving the problem with declarative coding - C#.
We can take a stab at re-writing our C# code to use a declarative style, which the language supports via Language Integrated Query (LINQ).

Here's the code:

{% highlight c# %}
static List<string> ExtractIdsDeclarative(string input)
{
    if (input == null)
    {
        return null;
    }

    var result = input.Split(",").Select(s => s.Trim());
    
    if (result.Any(s => !Guid.TryParse(s, out _)))
    {
        return null;
    }

    return result.ToList();
}
{% endhighlight %}

By adding some parameter validation and using a declarative style for mapping the input to normalized tokens and validating the result, it's better. There is less to go wrong, at least.

There's a problem, however. The less-error-prone declarative C# version is significantly slower to execute, as we shall see shortly. We paid for that additional safety by introducing runtime inefficiency.

In most languages, higher-level abstractions result in a trade-off: higher runtime costs in terms of execution time or memory usage or both.

Rust is one of those rare exceptions where using higher-level abstractions often does not result in any runtime penalty at all.

#### Quick performance comparison - building and validating a list of ten million GUIDs
A quick-and-dirty performance comparison, just for fun. This is not a scientific, rigorous benchmark, just a quick measurement of the code snippets above.

(Note that I excluded stats for executing against the 'invalid' input file because the performance data was essentially the same.)

<table width="680" border="1" class="pretty-table">
  <caption>
    Performance comparison
  </caption>
  <tbody>
    <tr>
      <th width="138" scope="col">Test</th>
      <th width="260" scope="col">Elapsed Milliseconds</th>
      <th width="260" scope="col">Peak Memory Usage</th>
      <th width="260" scope="col">Memory Usage After Processing</th>
      <th width="260" scope="col">Memory Usage After Gen2 GC</th>
    </tr>
    <tr>
      <td>C# - Imperative</td>
      <td>5444</td>
      <td>3.4GB</td>
      <td>3.4GB</td>
      <td>2.05GB</td>
    </tr>
    <tr>
      <td>C# - Declarative</td>
      <td>6785</td>
      <td>3.2GB</td>
      <td>3.2GB</td>
      <td>1.9GB</td>
    </tr>
    <tr>
      <td>Rust - Declarative</td>
      <td>2851</td>
      <td>859MB</td>
      <td>464MB</td>
      <td>N/A</td>
    </tr>
  </tbody>
</table>

The .NET code, being garbage collected, has to of course wait for the GC to come around and do it's thing, so I forced a gen2 GC to get an approximately apples-to-apples comparison of the memory usage after all of the processing was done.

### In summary
I'm a Rust beginner, so as I start exploring the language I am bound to get some things terribly wrong, make a lot of mistakes and learn a lot in the process. If you see anything egregiously incorrect, please drop me a note so I can address it in a follow-up post.

This post barely scratched the surface of why I think Rust has an amazing future, both for systems programming and for programming higher up the technology stack, like in the cloud services I work on for a living. Is Rust going to imminently replace C# and the amazing open-source .NET ecosystem? Of course not. Does it have a role in solving hard, real-world performance and scale problems that are hard to achieve within a managed (garbage collected) environment? I think that it obviously does.

We took a very small code sample for a trivial coding problem and used that to explore some interesting properties of Rust. First, we saw how the language gives us a declarative way of coding that makes introducing common classes of bugs impossible. Second, we saw how much more efficient the Rust code is at runtime over a garbage-collected language like C#, both in terms of speed and memory usage.

If you didn't understand the Rust code at all, I don't blame you. Rust is not easy to grasp if you haven't seen it before. The learning curve is high, there are many complex features and the code itself tends to be very 'symbol dense' and non-obvious. It's sort of like an anti-Python. What you gain for all of that complexity, however, is performance, correctness and control down to the lowest levels.

I am hoping to try to 'unpack' this intriguing little code sample in a future blog post, to go through and explain what's going on and how it works, as well as to document what else I have learned as I continue poking around in the Rust landscape.
