---
layout: post
title:  "Getting comfortable with binary data (with help from PowerShell)"
date:   2019-05-04 16:27:35 -0800
categories: PowerShell, Programming
---
<style type="text/css">
.pretty-table
{
  padding: 0;
  margin: 0;
  border-collapse: collapse;
  border: 1px solid #333;
  font-family: "Trebuchet MS", Verdana, Arial, Helvetica, sans-serif;
  font-size: 0.9em;
  color: #000;
  background: #bcd0e4 url("widget-table-bg.jpg") top left repeat-x;
}

.pretty-table caption
{
  caption-side: bottom;
  font-size: 0.9em;
  font-style: italic;
  text-align: right;
  padding: 0.5em 0;
}

.pretty-table th, .pretty-table td
{
  border: 1px dotted #666;
  padding: 0.5em;
  text-align: left;
  color: #632a39;
}

.pretty-table tr:hover th[scope=row], .pretty-table tr:hover td
{
  background-color: #632a2a;
  color: #fff;
}	
</style>

Getting comfortable with binary data (with help from PowerShell)
"How does the computer store the data?" I’m asked.

"Is it in hexadecimal? Or just ones and zeroes? Or what?"

This relates to my previously discussed experience (see here and here) that a lot of newer programmers are just not comfortable with the basic manipulation of ‘binary’ data.

If you are not comfortable working with binary data, perhaps having only ever written Python or Javascript or some other relatively high-level language that rarely requires you to interact with ‘bytes’ directly, here are a few simple thoughts to get you on the right track…

Getting comfortable with manipulating raw bytes is really not difficult. You just need a few tools to take the mystery away and a basic understanding of what we mean by ‘bytes’.

## What are bytes?
There is a really wonderful video, featuring Adam Savage of Mythbusters fame, illustrating what bytes are. This would be an entertaining and enlightening place to start.

Here is the video: [Inside Adam Savage’s Cave: Geeking Out about Bits and Bytes](https://youtu.be/2o8kehh9ejk)

We all know that computers work with "ones and zeroes", also known as binary digits, or bits. While ‘streams of bits’ is a good description of what binary data actually is, we rarely work with binary data at a granularity of individual bits. Rather, we chunk those bits into packages called bytes, and bytes are generally the smallest-sized chunk of data we directly address and work with.

It is possible to manipulate the indivdiual bits within a given byte (through shifts and similar bitwise operations), but you would not, for instance, ask the computer to go fetch 3 bits from some arbitrary memory location, or to write exactly 5 bits to a file on disk. Reads and writes will always be at the granularity of one or more bytes.

An individual byte consists of 8 bits. That means we can store 28 individual values in a single byte. 28 is equal to 256, so the maximum value is 255. This is because the first value is zero, not one. So a single byte can represent a numeric value from 0-255.

To represent values greater than 255, we can string bytes together. Groups of bytes are known as ‘words’, and the number of bits in each word is usually used to distinguish different word lengths. So, you will see references to ’16-bit words’ (two bytes), ’32-bit words’ (4 bytes) and ’64-bit words’ (8 bytes).

Word lengths longer than 64 bits are certainly possible, but not commonly encountered.

<table width="680" border="1" class="pretty-table">
  <caption>
    Word sizes
  </caption>
  <tbody>
    <tr>
      <th width="138" scope="col">Bits</th>
      <th width="260" scope="col">Bytes</th>
      <th width="260" scope="col">Max value</th>
    </tr>
    <tr>
      <td>8</td>
      <td>1</td>
      <td>255</td>
    </tr>
    <tr>
      <td>16</td>
      <td>2</td>
      <td>65,535</td>
    </tr>
    <tr>
      <td>32</td>
      <td>4</td>
      <td>4,294,967,295</td>
    </tr>
    <tr>
      <td>64</td>
      <td>8</td>
      <td>18,446,744,073,709,551,615</td>
    </tr>
  </tbody>
</table>

Incidentally, it doesn’t have to be that way. Historically there were all sorts of different variants of computers that used a variety of sizes of bytes and words. Eventually the need for efficient handling of character data, among other things, lead to the standardization of the 8-bit byte, which is now used almost everywhere you are likely to find yourself writing code.

There is a good [Computerphile Video](https://youtu.be/ixJCo0cyAuA) discussing some of the history behind how the 8-bit byte finally came to be, which is worth a watch.

## So…how *does* the computer represent bytes?

When we, as humans, work with bytes we need a way to represent the values in question. We need a way, for instance, to write the value down and we need some symbols to do that. The representation of the byte consisting of all bits toggled to ‘on’ could be: base-16 hexadecimal (0xFF), base-10 decimal (255), base-8 octal (0o377) or base-2 binary (11111111), among others; these symbolic representations are purely a convenience for the use of us humans. Picking the right representation can be incredibly helpful when working with binary data in the form of bytes, and the most useful form is often the hexadecimal representation.

The computer, however, doesn’t use symbols to represent byte values; the bits comprising bytes at the hardware level are represented by things like voltages within a certain range, or the magentic orientation of some region on a magnetic disk, or one of many other clever ways hardware designers have come up with over the years to persist the ‘on or off’ state of bits.

If you create a new file on disk and you write our single byte consisting of all ‘on’ bits to that file, what is the ‘representation’ ?

Here, let’s use PowerShell to do exactly that:

{% highlight PowerShell %}
$bytes = [byte]0xFF 
Set-Content -Path c:\temp\test.bin -Value $bytes -Encoding Byte
{% endhighlight %}

This creates a file containing a single byte, 0xFF.

If we had wanted to write a sequence of bytes, we could just add more bytes to our initial array. Let’s say we wanted to store the members of the fibonacci sequence that can fit in a single byte (i.e., are less than 255):

{% highlight PowerShell %}
[byte[]](1,1,2,3,5,8,13,21,34,55,89,144,233) | Set-Content -Path .\fibs.bin -Encoding byte
{% endhighlight %}

This writes the series of values to the file, one after the other.

Note that in the first case we used hexadecimal notation, and in the second case we used decimal notation; which we use is simply a matter of personal preference. We could have just as easily used 255 instead of 0xFF in the first example. The numeric values written to the disk are the same in any case.

## Inspecting binary data with Format-Hex
One of the most useful tools you can have in your programming toolkit is a good hex editor or hex viewer.

On terminals that support ANSI color escape sequences, I like to use a viewer called hexyl to quickly view the binary content of files. It does some color formatting of the output that I find pleasing.

However, for this simple example let’s stick with PowerShell:

{% highlight PowerShell %}
Format-Hex .\test.bin

           Path: C:\temp\test.bin

           00 01 02 03 04 05 06 07 08 09 0A 0B 0C 0D 0E 0F

00000000   FF
{% endhighlight %}

Format-Hex shows 16 bytes of data per-row, but because we only wrote a single byte to our first file we can see that it simply shows that one byte, 0xFF, at offset zero.

The 00000000 value at the start of our single row shows the starting offset of that row, and the columns with values 00-0x0F show the values (0 through 15 in decimal) to add to the value on the left to get the offset of an individual byte.

Note: it is important to understand that the ‘rows’ and ‘columns’ shown in the output of a command like Format-Hex is not showing the actual structure of the file on disk. There are no ‘rows’ or ‘columns’ in the file on disk, only a one-dimensional series of one or more bytes, one after the other. Like an array in computer memory, a file on disk is nothing more than a series of consecutive storage locations, each containing a single byte. The structure of a file is imposed on it by us, the programmer, through how those streams of byte values are interpreted by our programs.

The ‘structure’ shown by Format-Hex is just to make it easier for us to make sense of the data we are inspecting.

Let’s look at the second file:

{% highlight PowerShell %}
Format-Hex .\fibs.bin
           Path: C:\temp\fibs.bin

           00 01 02 03 04 05 06 07 08 09 0A 0B 0C 0D 0E 0F

00000000   01 01 02 03 05 08 0D 15 22 37 59 90 E9           ........"7Yé
{% endhighlight %}

Now we can see the values that we saved to the second file, starting at offset 00 and proceeding to offset 12.

As you can see, it’s quite simple to access the actual binary content of any file using Format-Hex, giving a quick way to verify the actual numeric values of the individual bytes the computer is actually working with.

We used Set-Content to write the files; similarly, we can use Get-Content to read them out again:

{% highlight PowerShell %}
Get-Content .\fibs.bin -Encoding Byte
1
1
2
3
5
8
13
21
34
55
89
144
233
{% endhighlight %}

The value of each byte is written to the pipeline in turn. Note that we had to again specify that we wanted to read the raw bytes, using -Encoding Byte. If we had not specified ‘Byte’ as our encoding, PowerShell would have tried to read the content as text and we would have seen kind of a garbled mess:

{% highlight PowerShell %}
Get-Content .\fibs.bin

"7Yé
{% endhighlight %}

We can see a few recognizable characters in there like ‘7’ and ‘Y’ and the quotation mark character because the standardized numeric values of those characters happen to correspond to values in our fibonacci sequence. The value 34 (0x22) is the [ASCII code](https://en.wikipedia.org/wiki/ASCII#Printable_characters) for the quotation mark character, the value 55 (0x37) is the code for ‘7’ and 89 (0x59) is the code for the uppercase ‘Y’ character.

You may have noticed that Format-Hex printed the same characters off on the right-hand side. Most hex editors and viewers attempt to render the bytes as characters in addition to showing the individual numeric values of each byte. This is often very helpful when trying to check what type of file you are dealing with, as many files start with standard, recognizable byte sequences. Two well known examples are that executable files on Windows always start with the letters ‘MZ’, and zip archives always start with ‘PK’.

(‘MZ’ being the initials of Mark Zbikowski, the programmer at Microsoft who designed the original executable format, and ‘PK’ for Phil Katz, the creator of the ZIP file format.)

This knowledge can be used to discover interesting things about files encountered in the wild, such as that .nupkg files used in the NuGet package management system are…simply ZIP archives:

{% highlight PowerShell %}
#> Format-Hex .\fsharp.core.4.3.1.nupkg | Select-Object -First 5

           Path: C:\users\mtreit\.nuget\packages\fsharp.core\4.3.1\fsharp.core.4.3.1.nupkg

           00 01 02 03 04 05 06 07 08 09 0A 0B 0C 0D 0E 0F

00000000   50 4B 03 04 14 00 00 00 08 00 AE 6D 39 4C 01 CD  PK........®m9L.Í
00000010   5B CE 0F 01 00 00 FD 01 00 00 0B 00 00 00 5F 72  [Î....ý......._r
00000020   65 6C 73 2F 2E 72 65 6C 73 95 91 CB 6A C3 30 10  els/.relsËjÃ0.
00000030   45 F7 85 FE 83 D0 3E 96 1C CB 76 52 E2 64 51 28  E÷þÐ>.ËvRâdQ(
00000040   74 9B E6 07 A6 A3 91 2D 1A 59 42 52 42 FB F7 15  t.¦£-.YBRBû÷.
{% endhighlight %}

We see the file starts with 0x50 0x4B, or the letters ‘PK’…it’s most likely a ZIP file. In this case we can rename the file to end with a .zip file extension and extract it like any other zip file.

## Writing and reading (numeric) words
What if we had wanted to write or read some numbers larger than [byte]::MaxValue (that is, 255 or 0xFF) ?

We can use the same techniques, but we need to represent our numbers using multiple bytes. Let’s write a very large number to disk.

Earlier I showed a table that contained different word sizes and their maximum value. Let’s write 1/7th of the maximum value of a 64-bit word to disk. The maximum value of a 64-bit integer is a very large number: 18,446,744,073,709,551,615.

That’s 18.4 quintillion, 446 quadrillion, 744 trillion, 73 billion, 709 million, 551 thousand, 615.

Dividing by seven, we get a mere 2.6 quintillion: 2,635,249,153,387,078,656.

We need 8 bytes to store this single number:

{% highlight PowerShell %}
$bytes = [System.BitConverter]::GetBytes([UInt64]([Uint64]::MaxValue / 7))
$bytes | Set-Content -Path test3.bin -Encoding byte

Format-Hex .\test3.bin

           Path: C:\temp\test3.bin

           00 01 02 03 04 05 06 07 08 09 0A 0B 0C 0D 0E 0F

00000000   00 24 49 92 24 49 92 24                          .$I$I$
{% endhighlight %}

Here we used the very useful System.BitConverter class to get the raw bytes for our 64-bit word value, then piped those to Set-Content to write the bytes to disk. As we can see, we wrote 8 bytes to disk as expected.

Note: an important point is that there is nothing in the file on disk that tells us the byte values stored here are intended to represent the numeric value 2,635,249,153,387,078,656! We could interpret the byte sequence 0x00, 0x24, 0x49, 0x92, 0x24 as something else entirely if we wanted to. We could interpret this file as containing eight individual byte values, or four 16-bit words, or two 32-bit words, or one 16-bit word followed by one 32-bit word followed by a second 16-bit word. The file, and thus the computer hardware when it fetches the content of the file for us, has no knowledge of what these bytes are intended to represent.

## Byte values vs. their symbolic (textual) representation

In the previous examples we were taking the literal numeric values corresponding to a specific bit pattern and writing them to disk. That is, if we have an 8-bit value consisting of the bit pattern 00000010 (the number 2), those are the exact bits that we wrote to disk. Similarly, the bit sequence we wrote to disk in the most recent example was as follows:

0010010010010010010010010010010010010010010010010010010000000000

You can see why we generally stick to hexadecimal notation instead!

The thing to realize is that the file on disk contains just the series of magnetic orientations (or whatever) representing an on or off state represented by the sequence we wrote out above. When we read the file, we read the individual bytes, either one at a time or in groups; the API used will typically allow us to specify how many bytes we want to read in a given operation. We do not read individual bits, and the individual bytes we read are just numeric values between 0 and 255. Therre is no "reading of ones and zeroes" or "reading the file as hexadecimal". We simply get back numeric values and it’s up to us to interpret them.

However, you will note that when I showed the value of UInt64.MaxValue divided by seven, I wrote it out thusly: 2,635,249,153,387,078,656.

That decimal representation of the number, complete with commas to make it easier to digest, is the textual representation of the number using ASCII characters. Let’s write this textual representation to disk:

{% highlight PowerShell %}
"2,635,249,153,387,078,656" | Set-Content -Path test4.bin -Encoding Ascii -NoNewLine
{% endhighlight %}

Now let’s examine the contents:

{% highlight PowerShell %}
Format-Hex .\test4.bin

           Path: C:\temp\test4.bin

           00 01 02 03 04 05 06 07 08 09 0A 0B 0C 0D 0E 0F

00000000   32 2C 36 33 35 2C 32 34 39 2C 31 35 33 2C 33 38  2,635,249,153,38
00000010   37 2C 30 37 38 2C 36 35 36                       7,078,656	
{% endhighlight %}

If we count them up, we can see this textual representation consumes 25 bytes on disk, over three times as many as our binary representation.

In addition, if we wanted to read the above file in and get the value stored back as a numeric quantity, we have to write some program or call some existing routine to take the textual representation of the value and convert it to the numeric representation.

As an aside, "Implement [atoi](http://www.cplusplus.com/reference/cstdlib/atoi/)", where atoi is the C programming language function for doing the text-to-number conversion for 32-bit integer values, used to be an immensely popular interview question at Microsoft. It seems less used these days, possibly because so many interview candidates don’t know C any longer. It’s a useful programming exercise, even in higher-level languages. You might want to give it a try!

For the file where we stored the value as the 8 raw bytes that actually make up the numeric value, there is *no conversion needed at all*! We already have the actual bytes, we can just read them into memory and treat them as the actual 64-bit word that we started with.

**Note**: I am ignoring endianness conversion issues, which in the real world you would want to account for if your code runs on multiple platforms. If you aren’t familiar with big endian and little endian, I highly recommend reading the original article in which the term was borrowed from Gulliver’s Travels to apply to computing. It is both interesting and entertaining.

Anyway, thinking only in terms of the textual representation of numbers is where many of the interview candidates I see get lost: they assume all files are text files, because they have rarely been asked to work with data that is not text! The entire concept of working directly with the bytes that comprise numeric values like integers or floating point quantities seems to have hardly occured to them. This is why they want to know if the files are in hexadecimal or binary or whatnot; as we have seen, if we are storing the raw byte values instead of text, that question really doesn’t make any sense. It’s all just bytes, values between 0 and 255, in a sequence.

## In conclusion
If you’re one of the people who has struggled to understand how to read and write data that isn’t ‘text’, I hope this post has shown that there is really nothing mysterious about dealing with the actual binary data. I highly recommend finding a hex viewer you like and using it to explore the data you are working with; as I’ve shown, PowerShell can make a nice tool for investigating this area of programming.