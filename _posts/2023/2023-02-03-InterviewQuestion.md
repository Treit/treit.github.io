---
layout: post
title:  "Making my favorite interview question real"
date:   2023-02-03 19:00:00
categories: Programming, Interviewing
---
Here is a variation of my favorite go-to interview question:

> I hand you a drive containing two files.
>
>Each file is extremely simple: it consists of 32-bit integers, one after the other. So, the first four bytes is the first integer. The next four bytes is the second integer, and so on. The integers happen to be written in little-endian byte order.
>
>Your task is to produce a third file containing the distinct set of integers that are shared between the two input files. For example, if the value 100 happens to be in the first file but not the second file, it should not be included in the output file. If it happens to exist in both files, then it should be included in the output file.
>
>I need the result file by the end of the day. Other than that, I do not care at all how you produce it. Tell me how, if you were given this problem in the real world, you would *actually* create the result file.

Now, there are many ways to approach this problem, which is one of the reasons I like this question.

However, there is a twist to this particular problem. If a candidate happens to come up with a nice solution, I give them a variation: what if the files are absolutely enormous? How would that change how you approach solving the problem?

While I have my personal favorite solutions for tackling this, in reality I never actually bothered to produce gigantic files and see how long it would actually take to solve. I knew solutions that should work in theory, but actually trying them was kind of left as an exercise.

Sharing this problem with other programmers, I've been asked a few times to actually give them the kind of input files I describe in the problem. They want to tackle it!

Well, ok then, let's do it.

## Update: 10/23/2025
In the original version of this blog post I included links to the actual files hosted in the cloud. Due, however, to the length of time needed to download such files and the also not-entirely-zero egress cost I was paying, I have removed them.

Instead, I present a small C# program to generate the files locally.

### C# Program to generate the input files
{% highlight c# %}
using System.Buffers.Binary;

if (args.Length < 2)
{
    Console.WriteLine($"Usage:");
    Console.WriteLine($"Program.exe <filepath> <size> <seed>");
    return;
}

var filename = args[0];
if (!long.TryParse(args[1], out var size))
{
    Console.WriteLine("Invalid input.");
    return;
}

if (!int.TryParse(args[2], out var seed))
{
    Console.WriteLine("Invalid input.");
    return;
}

var r = new Random(seed);
using var fs = new FileStream(filename, FileMode.Create);

var buff = new byte[4];

var buffer = size < (1024 * 1024 * 1024) ? new byte[size] : new byte[1024 * 1024 * 1024];
var totalWritten = 0L;

while (totalWritten < size)
{
    r.NextBytes(buffer);
    long amountToWrite = size - totalWritten;
    fs.Write(buffer, 0, (int)Math.Min(amountToWrite, buffer.Length));
    totalWritten += buffer.Length;
}
Console.WriteLine($"{totalWritten} bytes written.");
{% endhighlight %}

If you want to take a stab at solving this problem, feel free to try to produce the third file. Remember that duplicates should be removed from the output, as we want the distinct set of shared values.

Use (50 * 1024 * 1024 * 1024) = 53687091200 for the `size` parameter.

If you drop me a line telling me the size of the result file, I can tell you if you're right 🙂.

Have fun!
