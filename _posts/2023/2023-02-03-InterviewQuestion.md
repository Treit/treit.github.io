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

Here is the first file:

[1.bin](https://mtreitdata.blob.core.windows.net/test/1.bin?sp=r&st=2023-02-08T23:08:21Z&se=2030-02-09T07:08:21Z&spr=https&sv=2021-06-08&sr=b&sig=1R1DCql04bboXDsQDd%2Fz6iN15Xtv60NYoeX3HJcJh4I%3D)

Here is the second file:

[2.bin](https://mtreitdata.blob.core.windows.net/test/2.bin?sp=r&st=2023-02-08T23:07:28Z&se=2030-02-09T07:07:28Z&spr=https&sv=2021-06-08&sr=b&sig=4h0hLUiYSHybmVN%2Bfse4jSxh%2F04ItGCHLdTDmZ2O%2Fqo%3D)


You can download these files directly via the URLs, but I recommend using [azcopy](https://learn.microsoft.com/en-us/azure/storage/common/storage-use-azcopy-v10) if possible for a better download experience. The files are quite large and will probably take some time to download, depending on your connection speed.

Here is the syntax to use for azcopy:

`azcopy cp "<url>" <destinationFile>`

~~Providing a program to generate the files was also an option, but since my scenario involves actual pre-existing files, I wanted to make it real.~~

## UPDATE 2/14/2023
By popular demand due to some people having quite slow bandwidth, as well as to save myself some money, I have bit the bullet and will share a program that can be used to generate the test files instead of downloading them. However, you will need to provide a different seed input for each file and the files I generated previously did not use a seed. I will probably update this post with the two seed values to use in the future, after I re-solve the problem.

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

If you drop me a line telling me the size of the result file, I can tell you if you're right 🙂.

Have fun!
