### Peeking into memory usage - string slices
So we have a function that takes as input something of type `&str`, which we can see is a reference (or, a borrow) to some piece of memory occupied by a 'string slice'.

What's a string slice? Simple: it's a pointer to a string, coupled with a length. C# programmers who have kept up on recent platform changes will recognize this as the equivalent of a [ReadOnlySpan\<char\>](https://docs.microsoft.com/en-us/dotnet/api/system.span-1?view=netcore-3.1).

The Rust world and the C# world do things quite differently, however.

C# programmers take for granted that most objects we create have some inherent overhead. In addition to the actual data properties of a given object, we often have 'sync blocks' and 'method tables' and other bookkeeping stuff used by the underlying runtime.

In Rust, this simply doesn't exist when your program is executing. There is no bookkeeping. There is no runtime.

We described a string slice as a pointer and a length. If you were to look at the actual memory pointed to by a string slice, that's exactly what you would see...and nothing else.

In fact, let's do it. Opening up the hood and looking at inner workings of running code can be enlightening. Plus it's fun.

So let's say we have some local variable `s` of type `&str` that is a six byte slice pointing to the string `Hello!`. Further, let's suppose we take a two byte slice of `s` and put that into a variable called `slice`.

That is:

{% highlight rust %}
fn make_a_slice() {
    let s = "Hello!";

    // Create a slice, starting at index one and going up to,
    // but not including, index three.
    let x = s.get(1..3);

    if let Some(slice) = x {
        println!("{} - {}", s, slice);
    }
}
{% endhighlight %}

What does `s` look like in memory? We can use a debugger ([windbg](https://docs.microsoft.com/en-us/archive/blogs/windbg/) in this case) to look at the memory address of `s`:

{% highlight text %}
0:000> dd s
000000d5`fd2ff898  df456630 00007ff6 00000006 00000000
{% endhighlight %}

Here `s` refers to an address on the stack. At that address we have 16 bytes: the 64-bit pointer to the string (0x00007ff6df456630) followed by the 64-bit length of the slice (0x0000000000000006).

How about `slice` ?

{% highlight text %}
0:000> dd slice
000000d5`fd2ff8c8  df456631 00007ff6 00000002 00000000
{% endhighlight %}

As was probably obvious, it's the same thing except the address is pointing one byte futher than the original slice, and the length is 2.

No overhead. No bookkeeping. It's a refreshing change if you've been doing C# for a long time like I have.

We can confirm the pointer is pointing to what we expect:

{% highlight text %}
0:000> db 00007ff6df456631
00007ff6`df456631  65 6c 6c 6f 21 20 2d 20-0a 00 00 00 00 00 00 36  ello! - .......6
{% endhighlight %}

It is, of course, and there we see the sequence of UTF8 characters we are pointing to.

The fact that Rust compiles directly to native machine code, does not have a runtime to speak of and avoids all of the overhead of maintaining metadata that a runtime would need, is something not to be taken lightly! Debugging .NET managed code, in particular memory dumps, often requires a sophisticated knowledge of how the Common Language Runtime (CLR) works, where all of the bookkeeping structures are, etc. Rust takes us back to a much simpler time, where 'what you see is what you get' and you can make sense of what the debugger is telling you without going through a lot of time-consuming hoops.

(Every C# programmer should probably own a copy of Mario Hewardt's excellent [Advanced .NET Debugging](https://www.amazon.com/Advanced-NET-Debugging-Mario-Hewardt/dp/0321578899), which shows many great debugging techniques when working with managed .NET code).