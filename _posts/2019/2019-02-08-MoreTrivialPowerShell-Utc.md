---
layout: post
title:  "More trivial PowerShell - UTC"
date:   2019-02-08 03:00:00 -0800
categories: PowerShell
---
I've never been good at arithmetic, and certainly I've never been good at calculating time differences, especially when wrapping across day boundaries.

For instance: it's 2 AM in London and 6 PM here in the Seattle area, what's the time difference? Also, which day is it in London?
Having a hobbyist background in amateur radio, and in particular 'working DX', or communicating with distant countries over High Frequency (HF) radio wave propagation, I've always been familiar with [UTC](https://en.wikipedia.org/wiki/Coordinated_Universal_Time") - the international time standard that syncs everyone to be on the same page no matter their physical, geographical location.

Working as a professional software developer, UTC is also very frequently used to ensure everyone is talking about the same thing: if I am asked to debug an issue with our online service and I'm told the problem occurred "around 5 o'clock", which logs should I look at? Did you mean AM or PM? Local time? East coast time? UTC?

Incidentally this is one of the reasons I quite dislike "AM" and "PM" time that we all learned at an early age. The 24-hour clock, or 'military time' as it's sometimes called, is really the only way to go.

"We observed an outage starting at 18:05 UTC and lasting for 10 minutes." Ok! Now we're talking and I have something to work with.

Anyway, I happen to know that in the winter ('Pacific Standard Time') we are 8 hours behind UTC, and in the summer ('Pacific Daylight Time') we are 7 hours behind. So, UTC is local time +8 at the moment I'm writing this.

I'm still bad at doing the mental conversion, though, which I often need to do multiple times a day if I'm trying to make sense of logs I'm using to investigate a problem. So, of course, I use PowerShell.

I have a function, Get-UTC, or simply 'utc', in my $profile that I use to immediately pull up a conversion table to show me local time vs UTC time for every hour of the day. It looks like this:

{% highlight PowerShell %}
utc
Local                UTC
-----                ---
(Wed) 2/6/2019 16:00 (Thu) 2/7/2019 00:00
(Wed) 2/6/2019 17:00 (Thu) 2/7/2019 01:00
(Wed) 2/6/2019 18:00 (Thu) 2/7/2019 02:00
(Wed) 2/6/2019 19:00 (Thu) 2/7/2019 03:00
(Wed) 2/6/2019 20:00 (Thu) 2/7/2019 04:00
(Wed) 2/6/2019 21:00 (Thu) 2/7/2019 05:00
(Wed) 2/6/2019 22:00 (Thu) 2/7/2019 06:00
(Wed) 2/6/2019 23:00 (Thu) 2/7/2019 07:00
(Thu) 2/7/2019 00:00 (Thu) 2/7/2019 08:00
(Thu) 2/7/2019 01:00 (Thu) 2/7/2019 09:00
(Thu) 2/7/2019 02:00 (Thu) 2/7/2019 10:00
(Thu) 2/7/2019 03:00 (Thu) 2/7/2019 11:00
(Thu) 2/7/2019 04:00 (Thu) 2/7/2019 12:00
(Thu) 2/7/2019 05:00 (Thu) 2/7/2019 13:00
(Thu) 2/7/2019 06:00 (Thu) 2/7/2019 14:00
(Thu) 2/7/2019 07:00 (Thu) 2/7/2019 15:00
(Thu) 2/7/2019 08:00 (Thu) 2/7/2019 16:00
(Thu) 2/7/2019 09:00 (Thu) 2/7/2019 17:00
(Thu) 2/7/2019 10:00 (Thu) 2/7/2019 18:00
(Thu) 2/7/2019 11:00 (Thu) 2/7/2019 19:00
(Thu) 2/7/2019 12:00 (Thu) 2/7/2019 20:00
(Thu) 2/7/2019 13:00 (Thu) 2/7/2019 21:00
(Thu) 2/7/2019 14:00 (Thu) 2/7/2019 22:00
(Thu) 2/7/2019 15:00 (Thu) 2/7/2019 23:00
{% endhighlight %}

Current UTC: 02/08/2019 02:33:53

On the left is the local time, on the right is the corresponding UTC time. If I know the problem happened at 21:25 local time on Wednesday, I can immediately see I need to check our (UTC-based) logs for what happened around 05:25 on Thursday.

It's another example of a trivial little function that can help make those day-to-day tasks just a bit faster and more enjoyable.

One other quick note about PowerShell and time values is that it has a very nice syntax for converting strings to DateTime objects, and then allowing you to do simple math on them to get a corresponding TimeSpan value. To use a little example: let's say I know some interesting event (an anomaly, say) started happening on October 12th. Today is February 7th. Quick: how many days ago did the problem start?

In PowerShell we can just do this and quickly get the answer:

{% highlight PowerShell %}
[DateTime]"2/7/2019" - [DateTime]"10/12/2018"

Days              : 118
Hours             : 0
Minutes           : 0
Seconds           : 0
Milliseconds      : 0
Ticks             : 101952000000000
TotalDays         : 118
TotalHours        : 2832
TotalMinutes      : 169920
TotalSeconds      : 10195200
TotalMilliseconds : 10195200000

{% endhighlight %}

So, 118 days ago.

Similarly we can use other nice APIs to do date and time calculations. What will the date be in 100 days?

{% highlight PowerShell %}
(Get-Date).AddDays(100)
Saturday, May 18, 2019 18:46:07
{% endhighlight %}

So, May 18th.

If you're a wizard at date calculations, congratulations, but for myself I'll happily stick with my little PowerShell helpers when I need them.

For reference, here is the code for my little utc function:

{% highlight PowerShell %}
dir Function:\Get-Utc | %{$_.Definition}
    Param(
        [Parameter(Mandatory=$False, Position=0, ValueFromPipeline=$True)]
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
{% endhighlight %}
