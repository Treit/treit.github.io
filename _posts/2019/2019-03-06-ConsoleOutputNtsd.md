---
layout: post
title:  "Capturing console output when debugging using ntsd and PowerShell"
date:   2019-03-06 16:27:35 -0800
categories: PowerShell, Debugging
---
A colleague asked if I knew how to attach a debugger to a console application, yet retain the ability to redirect the console output to a file. The reason was that the amount of spew to the console easily exceeded the 9,999 line maximum vertical buffer size:

![Cmd](/images/2019-03-06/cmdbuffer1.png)

Normally if you are executing a console application that writes a lot of text to the console via stdout, you can simply redirect it to a file. For instance, here is a simple little program that counts the occurrences of all words in a text file. Here we are summarizing the word counts for the King James Bible:

{% highlight PowerShell %}
.\SummarizeWords.exe C:\temp\kjvdat.txt\kjvdat.txt
{% endhighlight %}

Incidentally, something like the text of the bible can be useful for testing out text processing programs. The size of the text (4.5 MB) and the amount of words (~790,000) is definitely non-trivial enough to allow for some useful benchmarking of different techniques, and it’s easily available online from this site..

Running the above program exceeds my 9,999 line console buffer, as it prints out 12,792 lines, so I can’t actually view all of the output. Normally, we would redirect the output to a file using either the redirection operator ‘>’ (in, say, cmd.exe) or perhaps via Out-File in PowerShell.

In cmd.exe:

{% highlight batch %}
.\SummarizeWords.exe C:\temp\kjvdat.txt\kjvdat.txt > output.txt
{% endhighlight %}

In PowerShell:

{% highlight PowerShell %}
.\SummarizeWords.exe C:\temp\kjvdat.txt\kjvdat.txt | Out-File output.txt -Encoding ascii
{% endhighlight %}

However, in our scenario we would like to actually debug the application and it is not obvious how to attach a debugger while still getting stdout redirected to a file.

My preferred set of debuggers come from the [Debugging Tools for Windows](https://docs.microsoft.com/en-us/windows-hardware/drivers/debugger/debugger-download-tools) so I am going to use those for this example. If you are not familiar with them, they are a very powerful set of tools and highly recommended if you are doing development on Windows.

The console-based ntsd.exe is the first debugger I learned how to use; it’s slightly more user-friendly sibling, windbg.exe, soon followed. Both debuggers have the same debugging engine under the hood and feature equivalent functionality. I’m not an expert with them by any means, but I can muddle through the basics without too much re-reading of the documentation.

Normally we would use windbg to debug our program, but that spawns a UI program that then debugs the application under a separate console, meaning our attempt to redirect the output fails.

This doesn’t work (cmd):

{% highlight cmd %}
C:\debuggers\windbg.exe .\SummarizeWords.exe C:\temp\kjvdat.txt\kjvdat.txt > output.txt
{% endhighlight %}

Neither does this (PowerShell):

{% highlight PowerShell %}
C:\debuggers\windbg.exe .\SummarizeWords.exe C:\temp\kjvdat.txt\kjvdat.txt | Out-File output.txt -encoding ascii
{% endhighlight %}

Both result in an empty output.txt file after pressing ‘g’ in the debugger and letting the program run to completion.

However, perhaps we can get our console version of the debugger, ntsd.exe, to work.

Let’s try it from cmd:

{% highlight cmd %}
C:\debuggers\ntsd.exe .\SummarizeWords.exe C:\temp\kjvdat.txt\kjvdat.txt > output.txt
{% endhighlight %}

Once again, if we press ‘g’ and allow the program to execute we end up with an empty, zero-byte file.

Let’s try again, but using PowerShell’s Out-File CmdLet:

{% highlight PowerShell %}
C:\debuggers\ntsd.exe .\SummarizeWords.exe C:\temp\kjvdat.txt\kjvdat.txt | Out-File output.txt -encoding ascii
{% endhighlight %}

Note that you don’t need to force ascii output, but if you don’t you will get a UTF16 file by default and unless you really need Unicode output I generally prefer dealing with plain old ascii files for maximum compatibility with various text manipulation tools. If you are dealing with Unicode, UTF8 is a much better choice than the default UTF16 used in .NET.

Anyway, what happened when we ran the command above?

{% highlight PowerShell %}
#> dir .\output.txt

    Directory: C:\users\mtreit\source\SummarizeWords\SummarizeWords\bin\Debug


Mode                LastWriteTime     Length Name
----                -------------     ------ ----
-a----         3/6/2019   3:29 PM     370240 output.txt
{% endhighlight %}

That’s more like it! We got the console output we wanted redirected to a file, and we had the opportunity to actually debug the program while it was running. Exactly what we were hoping to achieve.

If we open the output.txt file we see the word counts as expected:

{% highlight text %}
whales -> 1
pison -> 1
tiller -> 1
tillest -> 1
nod -> 1
jabal -> 1
jubal -> 1
instructer -> 1
wounding -> 1
gopher -> 1

... bunch of entries elided

not -> 6596
him -> 6659
is -> 6989
be -> 7013
they -> 7376
lord -> 7830
a -> 8177
his -> 8473
i -> 8854
for -> 8970
unto -> 8997
shall -> 9838
he -> 10420
in -> 12667
that -> 12912
to -> 13562
of -> 34617
and -> 51696
the -> 63924
Counted 789628 (12791 distinct) words in 417 ms.
{% endhighlight %}

## Conclusion
Another win for PowerShell and the venerable ntsd debugger.

Using PowerShell’s `Out-File` (`Tee-Object` works as well) we get exactly what we wanted. We can debug the program to our hearts content and not lose any of the console output due to our limited screen buffer.

So, if you need to debug a console program and also need to capture the stdout, use ntsd.exe and PowerShell and you should be all set.

Incidentally I have no idea if this is possible using the Visual Studio debugger. It might be, but I am a complete novice at using that particular tool for anything except the most rudimentary tasks.