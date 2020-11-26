---
layout: post
title:  "Untangling AKS, Managed Identity and Key Vault"
date:   2020-11-25 13:02:00
categories: C#, Azure, Kubernetes, KeyVault
---
<img src="/images/2020-11-25/tangle2.png" style="width:100%; height:100%;float:top"/>

In [part one]({% post_url 2020/2020-3-6-StartingRust %}) we started an initial exploration of the Rust programming language, using a small programming problem as a starting point. The problem was:

> Given a string which contains comma-separated values, transform it into a list of Globally Unique Identifiers (GUIDs) if and only if every value is a valid GUID. Ignore whitespace and newlines.

The following Rust function was given as a candidate solution, which proved to capably solve the problem while retaining execellent runtime performance:

{% highlight rust %}
fn extract_ids(input: &str) -> Option<Vec<&str>> {
    input
        .split(',')
        .map(|s| s.trim())
        .map(|s| Uuid::parse_str(s).ok().map(|_| s))
        .collect()
}
{% endhighlight %}

This is not necessarily the most optimal way to solve this problem, but it is succinct and correct and good enough for our initial purposes.

Is it obvious, though, how it works?

Let's unpack it.

{% highlight rust %}
fn extract_ids(input: &str) ...
{% endhighlight %}

We have a function that takes as input an `&str`, which is Rust's way of saying a 'reference to a [string slice](https://doc.rust-lang.org/std/primitive.str.html).'

### References, ownership and borrows
If you have never programmed Rust, it would be very useful to read up on [ownership](https://doc.rust-lang.org/book/ch04-01-what-is-ownership.html). This is one of the fundamental concepts in Rust and one of the things that makes the language novel and interesting. Coming from a garbage collected language like C#, the strict ownership rules in Rust might seem onerous, and even bizarre. The rewards for following these rules, however, are great: memory safety without performance overhead.

I'm not going to attempt to explain all of the details of Rust's ownership system in this blog post, but we can summarize the salient points:

1. Creating a reference to some memory location is known as 'borrowing' that memory location.
2. References (borrows) of a given location are immutable by default.
3. You can have as many immutable borrows of a location in memory as you like.
4. You can have exactly one mutable borrow of a memory location at any given time.
5. You cannot create a mutable borrow while there are existing immutable borrows.
6. Accessing a memory location without borrowing it implies transferring ownership of that location. This is called 'moving' ownership.
7. There are exceptions for types that can be cheaply copied. This include primitive types such as integers, where accessing the memory location for the type makes a copy of the bits at the original location. C# programmers will be familiar with that as the difference between 'value types' and 'reference types' in that language.

Ok, this sounds like a lot of rules to have to keep track of. Once you grasp the rules, however, (and if you don't, believe me the compiler will let you know) it is not too hard to get comfortable with the system. The results are well worth it.

So: using the `&` symbol to create a reference means taking a borrow of the memory in question. We use `&mut` to take a mutable borrow.

The Rust compiler keeps track of all of the memory in use by the program, who owns it, and what borrows of that memory exist. When the owner of a piece of memory goes out of scope (i.e., is no longer used elsewhere in the program), the memory that was owned is freed.

This is how Rust achieves memory safety without a garbage collector: the compiler does all of the work!

(This does mean compile times in Rust can be atrocious, but it's hard to argue that this inconvenience outweighs the somewhat incredible end result.)

### Examining the input type
We can see that our function takes as input a `&str`, which is an immutable reference (borrow) of a string [slice](https://doc.rust-lang.org/std/str/). A string slice is simply a pointer to some UTF8 string and a length, similar to the Span<char> and ReadOnlySpan<char> types in C#.

As there is no `null` reference concept in Rust (more on that in a bit), we avoid needing to write boilerplate code to validate that we were not passed input that can cause us to crash. This helps keep the code succinct while still being correct.

Incidentally, lack of boilerplate is one of those things that drew me to functional programming (F#) originally, and Rust happily continues that experience. C#, on the other hand, is boilerplate city.

### Examining the return type
The return type of our function is `Option<Vec<&str>>`. What's this?

Well, we are using generic type parameters here so really what we have is: a `Vec<T>`, where `T` is an `&str`, and an `Option<T>`, where `T` is...our `Vec<&str>`.

Generic type parameters here work the same as in C# code. The type parameter is a placeholder that gets replaced by some concrete type at compile time.

`Vec<T>` in Rust is analogous to `List<T>` in C#. It's a list type that grows as needed to accomodate new items being added to it.

#### Falling in love with the Option type
So, what's an [`Option<T>`](https://doc.rust-lang.org/std/option/)?

Option types are one solution to [the billion dollar mistake](https://www.linkedin.com/pulse/20141126171912-7082046-tony-hoare-invention-of-the-null-reference-a-billion-dollar-mistake/), the ability to have null references. They are, for me, one of the best ideas from the world of functional programming languages. The Option type provides an explicit way to encapsulate the idea that an operation either produced a value, or it produced nothing. What's more, programming languages like Rust require your code to account for both possibilites; if you do not, the code will not compile! For seasoned C# programmers this is a concept that takes a bit of getting used to...imagine a world where you never have to check arguments for null, you never have to worry about accessing a null reference,  the null coalescing and null conditional operators don't exist...

An Option is a form of discriminated union, meaning it can contain exactly one of the possible choices for that union. For Option, we either have Some(T) (meaning, we have produced a value of type T) or None. Those are the two possibilities.

Because the `None` value is not something that is going to convert to a value of type `T`, the type system in Rust prevents blindly passing in an Option result to something that expects a T.

If you are thinking having to write code to always test every operation for both the Some(T) and None possibilities is going to be tedious, it's really not! Rust provides some nice syntactic ways to do pattern matching on Option types that make the code straight-forward. 

Here is some sample code where we can see Option in action:

{% highlight rust %}
fn make_a_slice() {
    let s = "Hello!";

    // Create a slice, starting at index one and going up to,
    // but not including, index three.
    let opt = s.get(1..3);

    if let Some(slice) = opt {
        println!("{} - {}", s, slice);
    }

    // Try to create an invalid slice that is much too large.
    let opt = s.get(1..1000);

    match opt {
        Some(slice) => println!("{} - {}", s, slice),
        None => println!("Did not produce a slice!"),
    }
}
{% endhighlight %}

This illustrates two possible ways (`if let` and `match`) of pattern matching on an Option result and extracting the result, if any.

### Declarative coding fun with iterators
We have examined the input and return types for our sample string processing function: we will either produce Some(Vec<&str>) for the case where everything passed in was a valid GUID, or we will produce None.

Now let's look at the actual computation the function is performing:

{% highlight rust %}
input
    .split(',')
    .map(|s| s.trim())
    .map(|s| Uuid::parse_str(s).ok().map(|_| s))
    .collect()
{% endhighlight %}

If you have used LINQ in C# this probably looks somewhat familiar; iterators in Rust are similar to IEnumerable<T> in C#, where LINQ provides a rich set of operations that can be applied to the sequence. Both are lazily evaluated and both support chaining operations together to express the logic used to produce a final result.

A major difference is that with LINQ you typically pay a performance penalty for this terse style of declarative coding, whereas with Rust you do not!

Let's compare some significant differences between C# and Rust.

We will start by modifying our example code to simply tokenize our input string and just print the first two tokens after trimming any whitespace.

Here is a Rust version:

{% highlight rust %}
let tokens = input
    .split(',')
    .map(|s| s.trim())
    .take(2);

for x in tokens {
    println!("{}", x);
}
{% endhighlight %}

Here is a C# version:

{% highlight c# %}
var tokens = input
    .Split(",")
    .Select(s => s.Trim())
    .Take(2);

foreach (var token in tokens)
{
    Console.WriteLine(token);
}
{% endhighlight %}

Both pieces of code provide a very natural, ergonomic way to tokenize a delimited string and get the first couple of entries.

There is a reason, however, that every time I see string.Split() called in C# my eyes narrow with suspicion.

Consider our original example scenario from part one of this series where we were loading a lot of text: 10 million GUIDs, along with a bunch of commas and whitespace characters. On disk it's about 450MB of data. In C# when we call Split(), how many strings did we just allocate? Well, the method returns a string[], that array had to be allocated and filled with the results of splitting, so we just allocated 10 million additional strings. We then allocate an additional 'trimmed' string for each item we iterate, since we are calling string.Trim() to remove the whitespace, which allocates yet another string. At least lazy evaluation saves us from allocating 10 million trimmed strings!

A memorable line from a talk I saw some time back was: the garbage collector isn't your problem, the garbage is your problem!

In reality, C# makes it very, very easy to allocate on the heap like crazy and, while there are ways to avoid this if you are a particularly careful programmer, most developers go with the path of least resistance. There are a _lot_ of string.Split() calls out there in the real world.

You probably saw this next bit coming. How many new strings does the Rust code allocate?

Zero.

Remember that &str is a reference to a string _slice_, which is just a pointer to the underlying string and a length. With default immutability having our back, is it really necessary to allocate an entirely new string when splitting? What if we just...adjusted where our slice points to? We could point to the first non-comma character and set the length to end just before the next comma. When we trim the string, can't we just slide the pointer to the first non-whitespace character and set the length to end just before the next whitespace character? In addition, split() being lazy by default (unlike the C# version) means even if we need to stack allocate some slice instances as we are iterating, we don't need to create millions of them. We are saving hundreds of megabytes of unnecessary memory allocations, yet we wrote essentially the exact same code.

(Caveat: I haven't looked into how split is actually implemented in Rust, I'm just passing along what I have learned by observing the behavior through some experimentation with a debugger attached.)

Ok, let's prove that Rust isn't allocating strings. Recall that our input consists of a bunch of whitespace and GUIDs and commas. Let's assume our giant 450MB file starts like this:

{% highlight text %}
    b55af7cc-e4f2-4f8e-8b0e-18582d9feaba,          7ce3cb99-8b43-486c-b9a8-89bb1807651f, 
{% endhighlight %}

(and goes on for millions of more such entries.)

We read that entire file in as a string and then we do our splitting and trimming and taking.

Let's look in the debugger what 'x' points to on the first iteration.

{% highlight rust %}
let tokens = input
    .split(',')
    .map(|s| s.trim())
    .take(2);

for x in tokens {
    println!("{}", x); // What is the x slice pointing to?
}
{% endhighlight %}

{% highlight gdb %}
0:000> dq x
0000000d`c9f1ef28  000001d6`26adf044 00000000`00000024
...
{% endhighlight %}

Here we are using the [windbg](https://docs.microsoft.com/en-us/archive/blogs/windbg/) debugger to examine the actual memory of the variable `x`. We see a 64-bit address (`0x000001d626adf044`) and a 64-bit length (`0x0000000000000024`), which is exactly what we would expect for a string slice. Since our GUIDs are 0x24 (36) characters long, the length is correct.

Let's look at where the pointer is...pointing.

{% highlight text %}
0:000> db 000001d6`26adf044
000001d6`26adf044  62 35 35 61 66 37 63 63-2d 65 34 66 32 2d 34 66  b55af7cc-e4f2-4f
000001d6`26adf054  38 65 2d 38 62 30 65 2d-31 38 35 38 32 64 39 66  8e-8b0e-18582d9f
000001d6`26adf064  65 61 62 61 2c 20 20 20-20 20 20 20 20 20 20 37  eaba,          7
000001d6`26adf074  63 65 33 63 62 39 39 2d-38 62 34 33 2d 34 38 36  ce3cb99-8b43-486
000001d6`26adf084  63 2d 62 39 61 38 2d 38-39 62 62 31 38 30 37 36  c-b9a8-89bb18076
000001d6`26adf094  35 31 66 2c 20 0d 0a 31-30 37 64 31 34 66 38 2d  51f, ..107d14f8-
000001d6`26adf0a4  63 33 36 37 2d 34 65 38-36 2d 62 61 37 31 2d 36  c367-4e86-ba71-6
000001d6`26adf0b4  61 39 39 34 64 37 35 61-37 33 34 2c 20 20 20 20  a994d75a734,    
{% endhighlight %}

Clearly, it appears to be pointing into our original string, since we can see the expected whitespace and newlines following this. We can look a little bit behind this string and confirm that the original four spaces are there.

{% highlight text %}
0:000> db 000001d6`26adf044-4
000001d6`26adf040  20 20 20 20 62 35 35 61-66 37 63 63 2d 65 34 66      b55af7cc-e4f
000001d6`26adf050  32 2d 34 66 38 65 2d 38-62 30 65 2d 31 38 35 38  2-4f8e-8b0e-1858
000001d6`26adf060  32 64 39 66 65 61 62 61-2c 20 20 20 20 20 20 20  2d9feaba,       
000001d6`26adf070  20 20 20 37 63 65 33 63-62 39 39 2d 38 62 34 33     7ce3cb99-8b43
000001d6`26adf080  2d 34 38 36 63 2d 62 39-61 38 2d 38 39 62 62 31  -486c-b9a8-89bb1
000001d6`26adf090  38 30 37 36 35 31 66 2c-20 0d 0a 31 30 37 64 31  807651f, ..107d1
000001d6`26adf0a0  34 66 38 2d 63 33 36 37-2d 34 65 38 36 2d 62 61  4f8-c367-4e86-ba
000001d6`26adf0b0  37 31 2d 36 61 39 39 34-64 37 35 61 37 33 34 2c  71-6a994d75a734,
{% endhighlight %}

Of course, there are the four spaces.

Finally, just to absolutely prove the point, we can show that the address we just dumped out (`0x000001d626adf040`) should be exactly the same as the address our `input` string slice variable is pointing to.

{% highlight text %}
0:000> dq input
0000000d`c9f1ed18  000001d6`26adf040 00000000`1c314c56
{% endhighlight %}

It's a perfect match (but, we knew that.)

### Conclusion
I find it extremely encouraging to work through these sorts of small examples and realize just how dedicated the developers of the Rust language (and core libraries) care about efficiency. When they say 'zero cost abstractions' are a core part of the language design, they aren't kidding.

As I think I made clear in my previous post, I am kind of blown away that you can write what feels like very high-level code in Rust, yet get efficiency and performance that is right up there with hand-optimized, native code.

The brilliant use of things like slices in conjunction with lazily evaluated iterators, as we just saw, steers you into doing things in an efficient way, without imposing cognitive overhead or requiring the use of subtle tricks to squeeze out performance. 'It just works' is kind of a cliché in programming circles, but at least in this case...Rust makes it true.

Next time, we will finally unravel this line of code from our example program:

{% highlight rust %}
.map(|s| Uuid::parse_str(s).ok().map(|_| s))
{% endhighlight %}

Initially inscrutable to me, working through it will show it all makes sense when we start transitioning from thinking like a C# programmer to thinking like a Rustacean.