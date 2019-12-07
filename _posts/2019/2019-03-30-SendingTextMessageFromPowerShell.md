---
layout: post
title:  "Sending text messages from PowerShell"
date:   2019-03-30 17:27:35 -0800
categories: PowerShell
---
I’m sitting at the bar in El Gaucho enjoying an IPA when my phone buzzes. I glance at the incoming text message and see the following:

![sms](/images/2019-03-30/sms1.jpg)

My computer helpfully letting me know I can get back to work

This is the result of my having run a simple command about 30 minutes earlier, before heading downstairs:

{% highlight PowerShell %}
msbuild; Send-SMS "Finish your beer, the build is done!"
{% endhighlight %}

This is using a simple PowerShell function in my $profile called Send-SMS. I use it to automate sending text messages to myself, often allowing me to head down the hallway to chat with colleagues, or in this case to pop downstairs for a tasty beverage. When my computer is done crunching away at whatever task I set it to, I get alerted and can go back and check the results.

A while back I signed up for an account with Twilio, one of the major players in the online SMS messaging space. I pay maybe a couple dollars a month for the service, so it’s quite inexpensive and very handy if you want to automate sending yourself messages.

The function itself is quite simple. I simply use curl.exe to post a request to Twilio’s REST API; there is probably a more idiomatic way to do this in PowerShell, but it works fine.

When you sign up for Twilio you get an Account SID that acts to identify your calls to the REST API, as well as an Auth Token. Both are essentially simple 16-byte hashes encoded as strings.

Here is the simple PowerShell function:

{% highlight PowerShell %}
function Send-SMS
{
    $body = $args[0]
    $cmd = "curl.exe 'https://api.twilio.com/2010-04-01/Accounts/[AccountSID]/Messages.json'"
    $cmd += " -X POST"
    $cmd += " --data-urlencode `"Body=$body`""
    $cmd += " --data-urlencode 'To=+1[DestinationPhoneNumber]'"
    $cmd += " --data-urlencode 'From=+1[SourcePhoneNumber]'"
    $cmd += "-u [AccountSID]:[AuthToken]"
    iex $cmd 
}
{% endhighlight %}

In this case I’ve put in placeholders for the AccountSID, the AuthToken and both the source and destination phone numbers.

The source phone number is something you buy from Twilio. Each number is good for about 250 messages per-day, so for personal use you just need a single number. You pay $1.00 a month for each number and $0.0075 for every message you send. So…it’s cheap!

As you can see, the REST API is very simple and in my experience it works completely reliably.

I’ve found adding the ability to text myself to be a very nice addition to my scripting toolbox.
