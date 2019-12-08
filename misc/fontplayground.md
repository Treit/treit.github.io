---
layout: page
title: Font Playground
---

<link rel="stylesheet" href="/assets/css/prism-tomorrownight.css" />
<script src="/assets/scripts/prism-minified.js"></script>

<style>
@font-face {
  font-family: 'Cascadia Mono';
  src: url('/assets/fonts/CascadiaMono.ttf') format('truetype');
}

@font-face {
  font-family: 'Cascadia Code';
  src: url('/assets/fonts/Cascadia.ttf') format('truetype');
}
</style>

<p>
    Just playing around with fonts...
</p>

#### Code sample - Cascadia Mono
<pre style="padding:0.5em">
<code class="lang-fsharp"  style="font-family:Cascadia Mono;">let extractDimensionKeyValuePairs (dim : string) =
    let tokens = dim.Split([| ',' |])
    tokens
    |> Array.map (fun x -> 
        let loc = x.IndexOf("=")
        if loc > -1 then
            (x.Substring(0, loc)), (x.Substring(loc + 1))
        else
            "MethodName", x.TrimStart('[').TrimEnd(']')
    )</code>
</pre>

#### Code sample - Cascadia Code
<pre style="padding:0.5em">
<code class="lang-fsharp"  style="font-family:Cascadia Code;">let extractDimensionKeyValuePairs (dim : string) =
    let tokens = dim.Split([| ',' |])
    tokens
    |> Array.map (fun x -> 
        let loc = x.IndexOf("=")
        if loc > -1 then
            (x.Substring(0, loc)), (x.Substring(loc + 1))
        else
            "MethodName", x.TrimStart('[').TrimEnd(']')
    )</code>
</pre>

#### Code sample - Consolas
<pre style="padding:0.5em">
<code class="lang-fsharp"  style="font-family:Consolas;">let extractDimensionKeyValuePairs (dim : string) =
    let tokens = dim.Split([| ',' |])
    tokens
    |> Array.map (fun x -> 
        let loc = x.IndexOf("=")
        if loc > -1 then
            (x.Substring(0, loc)), (x.Substring(loc + 1))
        else
            "MethodName", x.TrimStart('[').TrimEnd(']')
    )</code>
</pre>

#### Code sample - Courier
<pre style="padding:0.5em">
<code class="lang-fsharp"  style="font-family:Courier;">let extractDimensionKeyValuePairs (dim : string) =
    let tokens = dim.Split([| ',' |])
    tokens
    |> Array.map (fun x -> 
        let loc = x.IndexOf("=")
        if loc > -1 then
            (x.Substring(0, loc)), (x.Substring(loc + 1))
        else
            "MethodName", x.TrimStart('[').TrimEnd(']')
    )</code>
</pre>

#### Code sample - Fira Code
<pre style="padding:0.5em">
<code class="lang-fsharp"  style="font-family:Fira Code;">let extractDimensionKeyValuePairs (dim : string) =
    let tokens = dim.Split([| ',' |])
    tokens
    |> Array.map (fun x -> 
        let loc = x.IndexOf("=")
        if loc > -1 then
            (x.Substring(0, loc)), (x.Substring(loc + 1))
        else
            "MethodName", x.TrimStart('[').TrimEnd(']')
    )</code>
</pre>

#### Code sample - Comic Sans
<pre style="padding:0.5em">
<code class="lang-fsharp"  style="font-family:Comic Sans MS;">let extractDimensionKeyValuePairs (dim : string) =
    let tokens = dim.Split([| ',' |])
    tokens
    |> Array.map (fun x -> 
        let loc = x.IndexOf("=")
        if loc > -1 then
            (x.Substring(0, loc)), (x.Substring(loc + 1))
        else
            "MethodName", x.TrimStart('[').TrimEnd(']')
    )</code>
</pre>

#### Code sample - Lucida Calligraphy
<pre style="padding:0.5em">
<code class="lang-fsharp"  style="font-family:Lucida Calligraphy;">let extractDimensionKeyValuePairs (dim : string) =
    let tokens = dim.Split([| ',' |])
    tokens
    |> Array.map (fun x -> 
        let loc = x.IndexOf("=")
        if loc > -1 then
            (x.Substring(0, loc)), (x.Substring(loc + 1))
        else
            "MethodName", x.TrimStart('[').TrimEnd(']')
    )</code>
</pre>