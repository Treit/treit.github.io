---
layout: post
title:  "A little bit about PowerShell"
date:   2019-02-04 16:27:35 -0800
categories: PowerShell
---
## A small bit of history

Although I've spent my entire career on Windows and, up until a year ago had essentially never used a *nix operating system, I'm a command line guy at heart. When I'm not actively writing code I am usually at a command prompt for various reasons: navigating the file system, kicking off build commands, killing processes, grepping through our codebase, etc.

Back in my early days as a software tester, I became a master of cmd.exe and Windows batch files. I wrote ridiculously complicated scripts for all sorts of tasks, such as setting up a new OS environment for my test machines; Later on I wrote my new teams' test automation harness purely using batch files. It was actually rather elegant, being something of an impudent response to the ridiculously over-engineered test system we were being told we had to use at the time.

Ah, NT cmd.exe scripting. Just thinking about it brings back many nostalgic memories. At the time the bible for anyone doing anything on the Windows NT command line was "The Turtle Book", [Windows NT Shell Scripting](https://www.amazon.com/Windows-Shell-Scripting-Timothy-Hill/dp/1578700477/ref=sr_1_1?ie=UTF8&amp;qid=1549313218&amp;sr=8-1&amp;keywords=Windows+NT+Shell+Scripting) by Tim Hill. A wonderful book, actually. Here's my well-worn copy:

![The Turtle Book](/images/TurtleBook1.jpg)

If it was possible to do on the command line on a Windows NT box, this book told you how to do it.

You could do some surprisingly sophisticated processing in cmd.exe; I remember becoming something of a wizard at parsing using the `for /f` command, a 'simple' example of which is below:

    for /f "delims=, tokens=1,3" %i in ('script.bat') do set a=%i-%j && echo %a%

(This captures the first and third elements in the last comma-delimited string of the output printed by the 'script.bat' batch file.)

I think at one point I may have known more about how to write effective cmd.exe batch files than just about anyone at the company, or at least I never met anyone else who had achieved my level of 'sophistication', if that's the right word for it.

As a small digression, being on the Windows NT 5 team at the time, we were rather prickly about being associated with that other Windows OS, since we were of course building a *real* operating system, not a toy. So it would drive us crazy when someone running an NT-based operating system would refer to using a 'DOS prompt'. It's not a DOS prompt, for crying out loud! It's a 'command prompt'! A DOS prompt is what you get when you run [command.com](https://en.wikipedia.org/wiki/COMMAND.COM) (shudder), not cmd.exe.

(I later worked for someone who had been on the Win9x team and he mentioned that the snobbery of us Windows NT guys at the time was pretty exasperating.)

## Ok, Windows cmd.exe scripting sucks

Of course, the reality is that the scripting language of cmd.exe is an absolute travesty. It's terrible! The amount of hours I wasted wrestling with the batch file 'language', in retrospect, is rather dispiriting. I just didn't know any better at the time.

Then, along came PowerShell and I never looked back. Being one of those somewhat rare 'command line guys' on Windows, I was hooked as soon as I first read an internal whitepaper on Monad, as it was called at the time. Taking inspiration from the Unix world but having the brilliant insight to pipe structured objects instead of plain text; I just loved the idea of it. There are plenty of *nix users out there who rather look down their noses at PowerShell, at least based on the noise one sees in online forums, but I think they don't know what they are missing. Now that the .NET ecosystem is migrating to a cross-platform world, if you happen to be a Linux user you should definitely give the <a href="https://aka.ms/pscore6">cross-platform PowerShell</a> a try.

<p>I was an early adopter; in fact, I remember attending a training workshop where we were told that we would be the first people in the world outside of the PowerShell team to author cmdlets. It was exciting and quite a bit of fun.</p>

<p>So, these days I use PowerShell for just about everything. A few weeks back I happened to have a somewhat newer hire in my office and we were checking to see if I had a particular certificate installed. I knocked out a little one-liner to check, hardly thinking about it, until my co-worker asked: "What...what did you just do???" </p>

<p>Me: "What do you mean?"<br>Him: "What...what WAS that you just used? It reminds me of stuff we did with Unix when I was in college."<br>Me: "Oh, you mean PowerShell?"<br>Him: "What's PowerShell?"<br></p>

<p>Egads! We have developers who don't even know about this wonderful tool! I emailed him some information and a few examples to get him started.</p>

<p>For the record, here is the little one-liner I cooked up to answer the question about whether I had a certificate installed:</p>

{% highlight PowerShell %}
dir cert:\LocalMachine\My | %{$_.ThumbPrint} | Select-Object -Unique | ?{$_ -match "f44"}
{% endhighlight %}

<p>The above uses various PowerShell conveniences, like <code>%{}</code>for <code>ForEach-Object</code>and <code>?{}</code>for <code>Where-Object</code>. These little shorthand helpers are standing in for the more verbose version:<p>

{% highlight PowerShell %}
Get-ChildItem cert:\LocalMachine\My | ForEach-Object {$_.ThumbPrint} | Select-Object -Unique 
| Where-Object {$_ -match "f44"}
{% endhighlight %}

<p>PowerShell is really wonderful at allowing you to write one-liners to answer all manners of questions, which I am doing constantly. Just now, multi-tasking away as I was writing this, msbuild vomited out 600+ lines of warnings due to a new code analyzer I am in the process of adding to our codebase. </p>

<p>(The analyzer, <a href="https://www.nuget.org/packages/Microsoft.VisualStudio.Threading.Analyzers/">Microsoft.VisualStudio.Threading.Analyzers</a>, is great at pointing out issues with how you write async code in .NET. Highly recommended!)</p>

<p>Staring at the spew of warnings from the analyzer, I wanted to identify the unique set of warning codes that were firing, so I could suppress them for this particular project. This is the kind of thing PowerShell just excels at. I dumped the giant blob of text sitting on my screen into a scratch file and ran the following:</p>

{% highlight PowerShell %}
cat c:\temp\foo.txt | ?{$_ -match "(VSTHRD.+?):"} | %{$matches[1]} | Select-Object -Unique
VSTHRD002
VSTHRD200
VSTHRD105
{% endhighlight %}

<p>Great, out of the roughly 20 rules in this analyzer, we are hitting three of them and now I know exactly which rule identifiers to put in the .ruleset file to suppress them.</p>

<p>The above code snippet shows a technique I use all the time, but which I have found other PowerShell users sometimes aren't aware of: the use of <code>$matches</code> after matching on a regular expression in a <code>Where-Object</code> filter. <code>$matches[0]</code> gives you the full match, but <code>$matches[1]</code> gets you the first thing captured in parentheses (and so on), which is a very nice way to extract specific pieces of text from a given string.</p>

<p>Here's my number one tip if you are new to using PowerShell: make extensive use of your <code>$profile</code>. If you don't know what that is, yikes! You are missing out on one of the best ways to automate those trivial daily tasks that you perform day-in and day-out as a software developer. I am going to give a few examples from my own <code>$profile</code>in a follow-up post.</p>