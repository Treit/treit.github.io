---
layout: post
title:  "Software tools I love - Part 3"
date:   2019-12-17 13:00:00
categories: Programming
---
<style>
.cat1 {
    color:#1e3799;
}
</style>
This is part 3 in my series where I document my process for going from a brand new computer to one that has the basic set of tools I want present to feel productive.

See [part 1]({% post_url 2019/2019-12-8-ToolsICantLiveWithout %}) and [part 2]({% post_url 2019/2019-12-16-ToolsICantLiveWithoutPart2 %}) to recap the process we have gone through so far.

So far we have:

* Installed [The latest Windows 10 Insider Build](https://blogs.windows.com/blog/tag/windows-insider-program/).
* Installed [Windows Terminal](https://devblogs.microsoft.com/commandline/introducing-windows-terminal/).
* Installed the [Cascadia Code font](https://devblogs.microsoft.com/commandline/cascadia-code/).
* Installed [Visual Studio Code](https://code.visualstudio.com/).
* Installed [Git](https://git-scm.com/downloads).
* Installed the [Visual Studio Build Tools 2019](https://visualstudio.microsoft.com/thank-you-downloading-visual-studio/?sku=BuildTools&rel=16).
* Configured Windows Terminal to have profiles for building both native and managed code.
* Verified we can build simple C and C# programs from the terminal.

Next up: customizing our PowerShell environment.

## Making the PowerShell experience more awesome
<img src="/images/2019-12-17/powershell1.png" style="width:10%; height:10%;float:right;margin:20px;"/>

As my previous blog posts have shown, I am a _huge_ fan of PowerShell and have been since, oh, about 2002 when it was known as project [Monad](https://devblogs.microsoft.com/powershell/monad-manifesto-the-origin-of-windows-powershell/#mainContent) inside of Microsoft.

There are many useful PowerShell modules that can make life on the command-line much more enjoyable. What follows are the customizations I can't live without and am going to get working right away on the machine we are setting up.

### Move to PowerShell Core
When we start PowerShell on our new computer we see a message that looks like this:

<img src="/images/2019-12-17/coreprompt1.png" style="width:70%; height:70%;float:center;margin:20px;"/>

We are going to take the advice of that message suggesting we 'Try the new cross-platform PowerShell', which is known as PowerShell Core.

Built on .NET Core, PowerShell Core is the future. Not only is it cross-platform, it gets new features and improvements on a much faster cadence than the traditional Windows PowerShell that ships with Windows. Let's get it installed and use that instead of the built-in version!

Because we previously installed the .NET Core SDK, we can use a `dotnet` command to install PowerShell Core. We do that by running the following:

{% highlight PowerShell %}
dotnet tool install --global PowerShell
{% endhighlight %}

Once it is installed, we use `pwsh` instead of `PowerShell` to launch our command-line environment.

I also replace `PowerShell` with `pwsh` in the wrapper scripts we created in the previous post; now when I launch one of my development profiles for Windows Terminal we will get a PowerShell Core environment.

### PSColors
I use the [PSColors](https://github.com/ecsousa/PSColors) module to make things more visually pleasing in PowerShell. Let's look at how to get it installed.

Because we have a brand-new machine, we need to run a few commands to allow installing the module. We execute the following:

{% highlight PowerShell %}
Set-PSRepository -Name PSGallery -InstallationPolicy Trusted
Set-ExecutionPolicy Unrestricted
{% endhighlight %}

I didn't include all of the output from those commands, but if you execute them in the above order they should complete without any errors.

Now we will add importing the module into our session by updating our $profile script. First we open $profile in our editor:

{% highlight PowerShell %}
code $profile
{% endhighlight %}

Then we add this line to the profile and save it:

{% highlight PowerShell %}
Import-Module PSColors
{% endhighlight %}

Now we should get nice, colorized output on the command-line.

I also make a few tweaks to the colorization format file used by PSColors. The details for doing that can be found in a [previous blog post]({% post_url 2019/2019-02-11-ATouchOfColor %}) I did talking about PSColors.
