---
layout: post
title:  "Trivial PowerShell"
date:   2019-02-06 16:00:00 -0800
categories: PowerShell
---

I concluded a [previous post]({% post_url 2019/2019-02-04-ALittleBitAboutPowerShell %}) discussing some tidbits about PowerShell with the comment that you should make good use of your $profile.

So what's $profile? Let's see:

    > $profile
    C:\Users\mtreit\Documents\WindowsPowerShell\Microsoft.PowerShell_profile.ps1

It's simply a string that points to a profile script that is automatically executed when you launch PowerShell, as long as you don't pass the -NoProfile switch. By default the script file it points to will not exist, but of course it's simple to create one:

    > New-Item $profile
    Directory: C:\Users\mtreit\Documents\WindowsPowerShell

    Mode                LastWriteTime     Length Name
    ----                -------------     ------ ----
    -a----         2/5/2019   7:11 PM          0 Microsoft.PowerShell_profile.ps1

I said the script is automatically executed when you launch PowerShell. Technically it's actually 'dot sourced', which means the context in which the script executes is the current context. Normally if you execute a PowerShell script it gets it's own context, which goes away after the script completes. This means variables, functions and other entities defined in the script do not persist. By dot sourcing, entities defined in the script will be persisted into the current context. The upshot of this is that functions defined in your $profile script will be pulled into your current PowerShell session and available for you to use.

You can dot source a script at any time using, well, the 'dot' or period character:

    > . $profile

Of course in the example snippets above, we know our current $profile is empty so this is a no-op.

Open $profile in your favorite editor and you can start adding useful functions. Some PowerShell purists will undoubtedly insist that your functions should follow the PowerShell standard conventions of using common nouns and verbs to compose the names; that's all well and good if it makes you happy, but your $profile is very personal. In my opinion it should reflect your individual style and aesthetic taste.


For me, that means brevity. Conciseness is a virtue when working on the command line, and while I think PowerShell proper (meaning the cmdlets that come along with it) errs on the right side by using highly organized and descriptive names such as <code><code>Get-ChildItem</code></code> and <code>Invoke-WebRequest</code> and the like, it also provides aliases and shorthand versions for many of these for a reason. Nobody wants to do that much typing.

Here are a few trivial little PowerShell functions that exist in my $profile and which I use almost every day:
{% highlight PowerShell %}
function gt
{
    if ($args[0])
    {
        Push-Location (Split-Path $args[0])
    }
}

function spop
{
    while ((Get-Location -stack).Count -gt 0)
    {
        popd
    }
}

function g {[guid]::NewGuid() | %{$_.Guid}}
{% endhighlight %}
The first function, gt, which stands for 'go-to', is probably one of my favorite little inventions to make my daily life easier. As you can see, it takes a path as input, runs it through the Split-Path cmdlet, then changes to that location. Split-Path, by default, returns all but the last part of a given path, so it is highly useful for getting the folder name a file resides in. That's exactly what it's used for here: given a file name, it moves you to the folder where that file lives.

Let's say I am building my source code tree and a specific project, c:\somecode\projectX\projectX.csproj fails. I just double-click that path in the build output, right-click (which, due to having QuickEdit on in my console settings copies the path to the clipboard) then type gt <space> <right-click> <Enter>and I'm right where the file lives so I can start working on the problem. In practice it takes no time at all. Quite useful.

Also, because this function uses Push-Location (aka, pushd), I can fix the problem and then return to where I was with a simple popd (or Pop-Location) command.


Incidentally, if you don't use pushd and popd to move around on the command-line, you're doing it wrong! Using cd, or Set-Location, is usually a waste because it does not give you a nice way to jump backwards. It's sort of like navigating the web in your browser without a back button. If you get used to using the location stack and pushing and popping your way around you will be much happier.

Which brings us to my second trivial little function, spop, (super pop) which unwinds the location stack. Sometimes you've pushed and pushed and pushed your way down a deep rat-hole of folders and you just want to unwind the whole mess and get back to where you started, clean up the location stack and start fresh. 

Finally there is the trivial little g function, which generates a Guid. I don't know about you, but I often need to generate Guids and I can do it in two key-presses (g <Enter>) from my ever-present PowerShell window. None of this overkill nonsense:

![Guid Overkill](/images/guid1.png)

I mean, I can appreciate that Visual Studio has this nice mechanism to generate Guids in all of these possible formats, but in my daily development life I nearly always just want the normal '78a12142-7c88-482d-8563-800617f0fc8f' type of format with no curly braces, an option which the tool above does not even provide. (I love that the default option above is the IMPLEMENT_OLECREATE one. Presumably this was useful at some point in the distant past of writing COM servers, but I'm guessing it's not the one most developers are looking for.)

Anyway, I just type 'g'.

The point of all this isn't that you should use these same functions, although you might find them useful to add to your $profile, but rather to show that you can make your life so much easier by building up your own library of trivial little PowerShell functions to make those day-to-day tasks just a bit faster, and easier, and more fun!

{% highlight PowerShell %}
function flip 
{ 
    Set-Clipboard "(╯°□°）╯︵ ┻━┻"
}

function shrug
{ 
    Set-Clipboard "¯\_(ツ)_/¯"
}

{% endhighlight %}