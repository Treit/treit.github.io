---
layout: post
title:  "Basics of Regular Expressions and PowerShell"
date:   2019-03-02 16:27:35 -0800
categories: PowerShell, Programming, Regex
---
While the real magic of PowerShell is the ability to work with streams of objects instead of just text, it is still quite good at text processing. If you do much text processing at all, you will know one of the key tools in your toolbox is the good old-fashioned [regular expression](https://en.wikipedia.org/wiki/Regular_expression).

In my day-to-day work I find myself using regular expressions in PowerShell constantly, so I thought I would write up a bit of a primer on how it works.

.NET support for regular expressions is excellent, which of course translates to good support in PowerShell. In fact there are some nice convenience features in PowerShell that make using regexes a very natural part of the command-line experience. We will cover those features shortly.

If you don’t know regex
I’m not going to go into much detail about how regular expressions work, but if you struggle with them then I highly, highly recommend you read what I consider THE book on the topic, [Mastering Regular Expressions](https://www.amazon.com/Mastering-Regular-Expressions-Jeffrey-Friedl/dp/0596528124) by Jeffrey Friedl.

![](/images/RegexBook1.jpg)

This book changed my life back in the day when I was struggling to understand just how to make use of regex. Read the first four chapters and you will have a solid grasp on how to use this powerful tool.

## Regular Expressions in .NET
Support for regex in .NET comes from the `System.Text.RegularExpressions.Regex` type, which you can use directly in PowerShell if desired. Here is a trivial example that will match any string that consists of exactly one character:

    $re = New-Object System.Text.RegularExpressions.Regex("^.$")
    $re.IsMatch("a")
    True

    $re.IsMatch("ab")
    False

You don’t actually need to type out the entire fully-qualified type name; `[regex]` can be used to access the type as well, as in:

    New-Object regex("^.$") 

The simplest way to use a regular expression instance is to call IsMatch, as shown above, to see if the regex matched on the input. This can be used in a Where-Object pipeline to filter a sequence of text values:

    "a","b","abc","cd" | ?{$re.IsMatch($_)}
    a
    b

If you need to do something more sophisticated, the Match method can be used to get back a Match object. In this example we will match on a string that consists of exactly three comma-separated digits, and retrieve the second digit.

    $re = New-Object regex("^(\d),(\d),(\d)$")
    $m = $re.Match("2,4,6")
    $m
    Groups   : {0, 1, 2, 3}
    Success  : True
    Name     : 0
    Captures : {0}
    Index    : 0
    Length   : 5
    Value    : 2,4,6

    $m.Groups[1].Value
    2

Working with a regex object directly in this way gives you, of course, all of the power and flexibility provided by the .NET regular expression API. For many common text processing scenarios, though, we don’t need to deal with the complexity of directly manipulating Match objects and their properties. PowerShell provides some nice built-in operators to make it much simpler to do our regex processing.

## The match operator
The primary way to use regex through PowerShell is via the `match` operator. The match operator take a regular expression pattern, such as our `^.$` example, and applies it to some text, returning true if there is a match and false if there is not. As a side-effect, it also automatically populates a special variable called `$matches`, which can be used to access the values returned by the overall match and any matching groups.

Here is a simple example, re-using our "3 digits separated by commas" regex from earlier:

    "abc", "2,4,6", "1,2,3,4", "99,98,97", "a,b,c" | ?{$_ -match "^(\d),(\d),(\d)$"}
    2,4,6

Here we passed a series of five strings through the pipeline and used Where-Object to filter for anything matching our regex. Only the second string matches the pattern we care about, so that is the single item that comes out of the pipeline. Since our regular expression used parentheses to define three separate capture groups, we can now access, for instance, the value in the second group through the aforementioned $matches object:

    $matches[2]
    4

Note that the match at index zero will be the overall match, so the first capture group starts at index 1, and so on.

In the case of streaming data through the PowerShell pipeline, $matches will contain the result of the most recent match; i.e., the last item in the pipeline that matched the regular expression.

The `$matches` object, incidentally, is simply a `System.Collections.Hashtable` mapping integer keys (the match index) to string values (the matched text.)

##The notmatch operator
There is a complementary operator to `match` called `notmatch`, which does pretty much what you would expect:

    "xyz", "0,1,2", "1,2,3,4", "01,02,03", "x,y,z", "9,9,9" | ?{$_ -notmatch "^(\d),(\d),(\d)$"}
    xyz
    1,2,3,4
    01,02,03
    x,y,z

What might not be obvious is that the $matches variable will still be populated by the notmatch operator. In this example there were two matching strings, "0,1,2" and "9,9,9" so we would expect $matches to contain the latter, which it does:

    $matches
    Name                           Value
    ----                           -----
    3                              9
    2                              9
    1                              9
    0                              9,9,9

## A real-world example
Here is an example of a real-world text processing problem that came up at work recently.

We have a large blob of text that looks something like this:

    ServerA
        2019-03-02 20:09:04Z, 5717517a-fc75-4fd4-9550-fe429f01e63c, 6256f564-3bed-47bf-8a8d-b48fc2f2b9c9
        2019-03-02 20:08:21Z, 591736ac-cec4-4fc0-9db9-7c736e4540ae, e347cfc4-b470-4ee3-9654-e5de7522d8be
        2019-03-02 20:09:10Z, b8a6f60e-6068-4139-b91a-c02ef0d6bf31, 989a5b6d-eaf1-4ad1-bb5a-605917628eaf
        2019-03-02 20:09:12Z, f855816a-854a-4737-9851-1c0361e529c4, 0387b04f-baa7-4029-93cf-5c67a29b5ecf
        2019-03-02 20:05:45Z, 7fa86130-46e1-4f1b-8683-9585eb22fd0e, fb43dc18-007b-429d-a3fb-2f22bd0e7eff
    ServerB
        2019-03-02 20:08:10Z, 2c747149-ca77-484d-86c0-4fe0755b315f, 1922bfef-4ae9-4179-ad36-b6c4984a3ede
        2019-03-02 20:08:12Z, 32074e51-69ea-4ab7-8b28-d34b07dd7c28, e5121de7-9ae9-460e-89fc-4ab89587ab71
        2019-03-02 20:05:46Z, 8fa30244-fe29-4277-b911-95b4a425bec4, 0935af29-5839-4904-8df7-9705f03b1f96
        2019-03-02 20:08:23Z, c1605868-ff56-4a50-816c-48c25bec6974, df8f17ef-4016-41dc-9a85-76f8e8413600
        2019-03-02 20:09:19Z, 9e6d8261-e8ff-470d-9c5a-6740b29076c1, b19f8e04-8a27-4fc6-8224-73da3d4577aa
    ServerC
        2019-03-02 20:10:41Z, ddf00266-777f-436e-882b-bd3e7fa63b8f, d20e195f-840a-439c-b228-5e2e6d3ae21b
        2019-03-02 20:10:41Z, ddf00266-777f-436e-882b-bd3e7fa63b8f, d20e195f-840a-439c-b228-5e2e6d3ae21b
        2019-03-02 20:10:44Z, 8072acc2-344c-4663-bf2d-bc5c4968515b, de7ea27c-c6d2-4c53-b6cc-87390616ce21
        2019-03-02 20:10:44Z, 8072acc2-344c-4663-bf2d-bc5c4968515b, de7ea27c-c6d2-4c53-b6cc-87390616ce21
        2019-03-02 20:10:50Z, d9a35eff-9465-41ca-afba-6c26d0f3c574, 50b37ced-4ed3-4b4b-b3d0-2940096148a1
(This continues for, say, thousands of lines.)

This text is the output of some diagnostic command, and we need to extract the unique set of GUIDs from it. I know plenty of people whose first instinct would be to dump this data into Excel and use that to do the filtering, but PowerShell can make quick work of this particular problem, using the techniques we have been discussing.

First we need a regex to match the data we are interested in; in this case, a good starting point would be to have a regex that will match a GUID. It’s clear that each GUID has a very specific format:

We have groups of hexadecimal digits separated by dashes, in the pattern:

    8-4-4-4-12

(Where each number is the count of consecutive hex digits.)

This can be represented quite exactly with a regular expression like so:

    $re = "[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}"

It’s also possible to use the nice string interpolation feature of PowerShell to compose the regex in a way that makes it clear we are re-using the same set of characters in a specific pattern. For instance, it might be easier to comprehend if we wrote the above as:

    $hex = "[0-9a-fA-F]"
    $re = "$hex{8}-$hex{4}-$hex{4}-$hex{4}-$hex{12}"

These two approaches are entirely equivalent; which you prefer is a matter of taste.

In any event, given a regex to match a GUID, we can then compose that into a regex that matches two GUIDs separated by a comma and a space, which is the pattern in our blob of text that we care about. Again, using string interpolation:

    cat c:\temp\data.txt | ?{$_ -match "($re), ($re)"} | %{$matches[1]; $matches[2]} | Select-Object -Unique
    5717517a-fc75-4fd4-9550-fe429f01e63c
    6256f564-3bed-47bf-8a8d-b48fc2f2b9c9
    591736ac-cec4-4fc0-9db9-7c736e4540ae
    e347cfc4-b470-4ee3-9654-e5de7522d8be
    b8a6f60e-6068-4139-b91a-c02ef0d6bf31
    989a5b6d-eaf1-4ad1-bb5a-605917628eaf
    f855816a-854a-4737-9851-1c0361e529c4
    0387b04f-baa7-4029-93cf-5c67a29b5ecf
    7fa86130-46e1-4f1b-8683-9585eb22fd0e
    fb43dc18-007b-429d-a3fb-2f22bd0e7eff
    2c747149-ca77-484d-86c0-4fe0755b315f
    1922bfef-4ae9-4179-ad36-b6c4984a3ede
    32074e51-69ea-4ab7-8b28-d34b07dd7c28
    e5121de7-9ae9-460e-89fc-4ab89587ab71
    8fa30244-fe29-4277-b911-95b4a425bec4
    0935af29-5839-4904-8df7-9705f03b1f96
    c1605868-ff56-4a50-816c-48c25bec6974
    df8f17ef-4016-41dc-9a85-76f8e8413600
    9e6d8261-e8ff-470d-9c5a-6740b29076c1
    b19f8e04-8a27-4fc6-8224-73da3d4577aa
    ddf00266-777f-436e-882b-bd3e7fa63b8f
    d20e195f-840a-439c-b228-5e2e6d3ae21b
    8072acc2-344c-4663-bf2d-bc5c4968515b
    de7ea27c-c6d2-4c53-b6cc-87390616ce21
    d9a35eff-9465-41ca-afba-6c26d0f3c574
    50b37ced-4ed3-4b4b-b3d0-2940096148a1

Mission accomplished! We have extracted each unique GUID from the blob of diagnostic output with a simple one-liner PowerShell script.

In the example above we filter for matches using our composed regular expression and, for each match, we write the contents of each capture group separately to the pipeline:

    %{$matches[1]; $matches[2]}

Note the semi-colon that is used to put two separate objects into the output pipeline.

As an aside, I’ve noticed some people are unaware of this technique to produce multiple output objects in the output pipeline for each item in the input pipeline. It can be useful in many circumstances; for instance, let’s say we want to output the value, square and cube of each input item in a sequence of numbers:

    (1..5) | %{$_; $_ * $_; $_ * $_ * $_; "-----"}
    1
    1
    1
    -----
    2
    4
    8
    -----
    3
    9
    27
    -----
    4
    16
    64
    -----
    5
    25
    125
    -----

Although that’s kind of a trivial little example, the technique has many useful applications. The more you work with PowerShell and get used to the idea of composing using pipelines of objects (which is what allows us to naturally apply mathematical operations to our input objects in the above example) the happier you will be as you solve those little day-to-day problems with PowerShell.

## A final word of caution
If you happen to be new to regular expressions, it is very easy to fall into the trap of trying to use them for everything. While they have splendidly useful applications across many types of text processing problems, they can be a terrible choice in many cases. Use them judiciously.

I urge you to read this very well-thought-out [Stack Overflow answer](https://stackoverflow.com/a/1732454/2030691) on this particular topic.