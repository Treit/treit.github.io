---
layout: post
title:  "Fundamentals I wish you knew: bits and bytes. Part 1."
date:   2019-03-11 16:27:35 -0800
categories: Programming, Interviewing
---

## The scene: a programming interview
The interview candidate is staring at me, frowning. Behind them is the whiteboard, where they have tentatively sketched out a rudimentary function prototype. They are trying to understand more about what exactly they need to do to implement the function, and it's going poorly.

"Binary data. So, you mean, zeroes and ones?"

I'm fine with the question. Really the term "binary data" is actually a bit nebulous...isn't all data processed by the computer ultimately 'binary'? So I try to clarify:

"Sure, ultimately we can think of the data as the 'zeroes and ones' that the computer needs to work with. When I say binary data I just mean the actual bytes the computer uses to store the data. Since we are talking about 32-bit integers, think about how such an integer is stored in memory. Now assume we've taken exactly those bytes from memory and written them to disk. That's all we're talking about here. You just need to get them back off the disk and into a form you can work with."

"Ok, so...ones and zeroes."

"Sure, if you want to think of it that way."

They think for a while. I try to get them to relax. "Think out loud, let me know your thought process" I say, gesturing a bit to try and get them to loosen up, "if you're not sure how to approach it we can just come up with some kind of sketch of an API for reading the data and I can walk you through it. The details really aren't that important."

The truth is, I don't especially care if they know the API for reading integers stored as bytes on disk. That...that's not the problem. The problem is, well, we'll see in a moment.

The candidate is now writing some Python code to try and open a file and read data from it. They make a call to something called `readlines()` (I'm not a Python programmer, but I can certainly guess what that does) and then they comment:

"So I assume each number is on a line by itself, and since you said it's binary I'm going to read each character and test if it's a one or a zero. You said these are 32 bit integers, so I guess I will need to read each one or zero 32 times. Then I need a way to convert those to a number somehow...I'm trying to think how to do that."

I'm giving them a smile of encouragement and preparing to go back over how the computer stores 32 bit integers, but mentally I'm shaking my head and thinking "Not again!"

## A worrisome trend
The interview candidate has concluded that if you take a 32-bit integer and need to store it as 'binary data' in a file, you are going to have a text file that looks something like this:

    00000000000000000000000000000001
    00000000000000000000000000010011
    00000000110001100110111110111111 

...where ASCII '1' and '0' characters are strung together, each number on a line, for the extent of the file.

Here's the reality: I've had at least half-a-dozen almost identical scenarios in the past two years where a bright young prospective employee, just finishing up a college degree in computer science, appears to really struggle to think on the computer's terms: in terms of the basic "stuff" a computer deals with: bits and bytes, memory and storage. A decade ago, and I've been interviewing for longer than that, I never encountered this reaction to my favorite interview question.

I won't give the exact interview question I ask here (I might discuss it in some later post), but the bottom line is that it's a practical problem where I describe handing the employee-to-be a storage drive of some kind that has some files on it. I explain that the files contain simple integer sequences stored as binary data: 32-bit integers, one after the other. They will need to do some processing of these integer sequences to solve the interview question.

As I mentioned, I really (really!) do not care if they have no clue how to read the files. An API like `fread` from C or `FileStream` from C# or `InputStream` from Java all follow a simple pattern that's easy to explain and pseudo-code into the solution without spending a lot of time on the details. That is: you have a buffer to put bytes into, you have a stream that internally has a pointer that advances as you read data, you ask for a certain number of bytes, your buffer gets filled, you do some work with the buffer...repeat until you've read everything. It's straight-forward.

The worrisome trend is the number of candidates that can't articulate or reason about the idea that a 32-bit integer is ultimately represented in memory, and on disk, as a sequence of four bytes. Their experience working with files, if to any extent at all, seems to have moved entirely to working with text data: JSON in particular seems very popular in college projects (mirroring the industry trend, I suppose) and especially seems to be the the case for those with a Machine Learning focus which...boy...seems to be just about everyone these days.

Machine learning.
Python. 
Data science. 
Text files.
Can't work with 'binary' data in the form of raw bytes.

That seems to be the trend.

## Perhaps I'm in the wrong
I've had a couple of colleagues, upon hearing my lament about "kids these days" or words to that effect, comment that perhaps it's time for my trusty interview question to be retired. "They just don't teach that stuff any longer" I'm told.

Are they right? If you're a smart, aspiring professional computer programmer in this day and age of zillions of web frameworks and 'full stack' developers and machine learning everywhere and all the latest dockerized container infrastructure blah blah blah buzzword of the week, do you need to know that low-level bits and bytes stuff?

I'd like to think it's still important. 

I'm not a systems programmer. I generally don't do 'low level'. Almost all of my coding has been in C# and much of it working at very high levels of abstraction, interfacing with databases, talking to web services, gluing things together. Yet I like to think I have a grasp on at least the most basic of basics: like, if I need to calculate the size of a struct with two ints and a long and estimate how much data we are going to be processing pushing 10,000 of those per-second, I can do the back-of-the-envelope calculation. If I need to optimize a serialization bottleneck, I can think in terms of the right trade-offs between data size and CPU time and parsing convenience vs raw speed. That kind of thinking requires at least a fundamental understanding that when you read 'binary data' you are not reading ASCII characters '1' and '0' from a text file!

So, if you're on one of my interview loops there are some fundamental things I just really wish you would know. We can go into a few specifics in a follow-up post. 