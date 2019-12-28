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

We can now install the PSColors module:

{% highlight PowerShell %}
Install-Module PSColors -Scope CurrentUser -AllowClobber
{% endhighlight %}


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

### A few indispensable PowerShell functions
I have a few customs functions I just can't live without. In particular, `gt` to go to the folder location for a specific file path is one that I use dozens of times per day. Also, running `utc` to get the local-time to UTC-time conversions quickly is another one I use constantly. So, before we move on I will definitely be adding the following small functions to my $profile:

{% highlight PowerShell %}
function g {[guid]::NewGuid() | %{$_.Guid}}

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

function Get-Utc
{
    Param(
        [Parameter(Mandatory=$False, Position=0, ValueFromPipeline=$True, ValueFromPipelinebyPropertyName=$True)]
        [string[]]$Date
    )

    Process
    {
        if (!$Date)
        {
            $Date = [DateTime]::Now
        }
        
        $Date | %{
            $dt = ([DateTime]$_).ToString("M/d/yyyy")
            (0..23) | %{([DateTime] "$dt $($_):00")} | %{
                New-Object PSObject -Property @{
                    UTC = $_.ToString("(ddd) M/d/yyyy HH:mm")
                    Local = $_.ToLocalTime().ToString("(ddd) M/d/yyyy HH:mm")
                }
            }
        }

        "$([Environment]::NewLine)Current UTC: $([DateTime]::UtcNow)"
    }
}

function InWindowsTerminal {
    if ($env:WT_SESSION) {
        return $true
    }

    return $false
}
{% endhighlight %}

I've covered most of these in some previous posts...see [here]({% post_url 2019/2019-02-07-TrivialPowerShell %}) and [here]({% post_url 2019/2019-02-08-MoreTrivialPowerShell-Utc %}).

The `InWindowsTerminal` function is useful to determine if you can write things like emoji into your script output and expect it to render.


## Installing the Windows Subsystem for Linux (WSL)
With the work we have done so far we have our OS and a good editor installed; we can clone git repositories, build native and managed code and we have an aesthetically pleasing PowerShell experience using PowerShell Core and PSColors. 

We are ready to move into building and installing some really useful command-line tools from the open-source community. In fact, we are going to build some of them from source, as alluded to in the previous post where we got our command-line build tools installed and working.

Many open-source products have their roots in the Linux operating system and some of the installation routines are really geared towards Linux. In order to ensure we can seamlessly use either native Windows tools _or_ native Linux tools, we will install the awesome [Windows Subsystem for Linux](https://docs.microsoft.com/en-us/windows/wsl/about).

We start by running the following from our PowerShell Core prompt:

{% highlight PowerShell %}
Enable-WindowsOptionalFeature -Online -FeatureName Microsoft-Windows-Subsystem-Linux
{% endhighlight %}

Once this completes (a reboot may be required) we can install and configure out desired Linux distribution. In our case we will install Ubuntu:

{% highlight PowerShell %}
curl.exe -L -o ubuntu-1804.appx https://aka.ms/wsl-ubuntu-1804
Add-AppxPackage .\ubuntu-1804.appx
{% endhighlight %}

(Since we are running on a very recent Windows 10 Insider build, curl.exe should be present as it is now a built-in command.)

After the distro is added, we can install it by clicking the Ubuntu link on our Start Menu. After that installs we can make sure everything is up to date with:

{% highlight bash %}
sudo apt update && sudo apt upgrade
{% endhighlight %}

This will take a while, but once it completes we will have a working Ubuntu environment that is ready to use.

### Installing the .NET Core SDK on WSL
We want to be able to install things like PowerShell Core and potentially build .NET applications in our WSL environment, so we will start by installing the .NET Core SDK into our Ubuntu WSL environment.

We are going to fllow the instructions from [here](https://docs.microsoft.com/en-us/dotnet/core/install/linux-package-manager-ubuntu-1804).

{% highlight bash %}
wget -q https://packages.microsoft.com/config/ubuntu/18.04/packages-microsoft-prod.deb -O packages-microsoft-prod.deb
sudo dpkg -i packages-microsoft-prod.deb
sudo add-apt-repository universe
sudo apt-get update
sudo apt-get install apt-transport-https
sudo apt-get update
{% endhighlight %}

This ensure we have the Microsoft key registered and dependencies installed.

Then we can simply install the SDK:

{% highlight bash %}
sudo apt-get install dotnet-sdk-3.1
{% endhighlight %}

Once that completes, we can verify the SDK is installed:

{% highlight text %}
mtreit@mtreit3:~$ dotnet --info
.NET Core SDK (reflecting any global.json):
 Version:   3.1.100
 Commit:    cd82f021f4

Runtime Environment:
 OS Name:     ubuntu
 OS Version:  18.04
 OS Platform: Linux
 RID:         ubuntu.18.04-x64
 Base Path:   /usr/share/dotnet/sdk/3.1.100/

Host (useful for support):
  Version: 3.1.0
  Commit:  157910edee

.NET Core SDKs installed:
  3.1.100 [/usr/share/dotnet/sdk]

.NET Core runtimes installed:
  Microsoft.AspNetCore.App 3.1.0 [/usr/share/dotnet/shared/Microsoft.AspNetCore.App]
  Microsoft.NETCore.App 3.1.0 [/usr/share/dotnet/shared/Microsoft.NETCore.App]

To install additional .NET Core runtimes or SDKs:
  https://aka.ms/dotnet-download
https://docs.microsoft.com/en-us/dotnet/core/install/linux-package-manager-ubuntu-1804
{% endhighlight %}

### Installing PowerShell Core on WSL
Finally, we can get PowerShell Core installed. Since we have installed the .NET SDK, this is simply a matter of executing the following:

{% highlight bash %}
dotnet tool install --global PowerShell
{% endhighlight %}

Now when we open a WSL Bash prompt from our Windows Terminal dropdown, we can run `pwsh` to start a PowerShell Core prompt and use the PowerShell commands we know and love.

I added the same utility functions to my WSL $profile that we saw earlier added to the $profile on Windows. I did omit importing the PSColors module since it seems to have Windows-specific dependencies.

## Wrapping up for now
We've made more great progress getting our development workstation setup for maximum productivity!

We installed PowerShell Core and the PSColors module for a better experience on the command-line.
We updated our PowerShell $profile to include some useful utility functions, with the idea that we will add many more such functions and aliases in the days to come.
We installed Windows Subsystem for Linux (WSL) running Ubuntu 18.04.
We got the .NET Core SDK installed in our Linux environment.
We got PowerShell Core installed in our Linux environment.

Next time I plan on showing how we can install a few of my favorite command-line tools that happen to be written in the fascinating [Rust](https://www.rust-lang.org/) programming language. To do that, we will install the Rust development environment and build the tools ourselves from source.