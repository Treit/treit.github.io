---
layout: post
title:  "Blog reboot"
date:   2019-12-07 16:00
categories: Misc, Blogging
---
Welcome to the new location of my blog, which is now hosted using [GitHub Pages](https://pages.github.com/)!

I've been meaning to do some more blog posts for a while, but with a project at work keeping me really busy for the most of the year, I didn't find time. There was another reason, however, and that was my growing distaste for the blogging platform I had started using.

I was originally hosting my blog as a [WordPress site using BlueHost](https://www.bluehost.com/wordpress/wordpress-hosting). The experience was not great. The web interface for crafting posts was abominably slow and the plugin-mania that comes with WordPress results in an unseemly level of bloat.

I don't like bloat. I'm a command-line guy. I care deeply about performance optimization. This wasn't working out.

So, in the back of my mind I've had plans to revisit my blog hosting platform and over the past two days I finally got around to migrating my old blog posts to a new and much more enjoyable infrastructure.

## Simplifying things with GitHub Pages and Jekyll
At the end of the day I had in my mind a kind of idealized workflow: I just want to write simple markdown files in the editor of my choice and have those turn into blog posts with minimum fuss. I wasn't aware of a simple way to accomplish that, though, until I found out about the awesomeness of GitHub pages and the very nice [Jekyll](https://jekyllrb.com/) framework that they interface with.

This sounded like exactly what I was looking for. Plus, I love the GitHub user experience already; if I can use that for my blog it's a match made in heaven.

Jekyll provides a very simple way of turning your markdown pages into a full-fledged HTML site, with unlimited customization options once you have things set up properly. The [installation instructions for Windows](https://jekyllrb.com/docs/installation/windows/) worked without any major issues for me. I was able to install the necessary Ruby SDK and the package manager ([bundler](https://bundler.io/)) and get Jekyll running locally in almost no time at all.

I did spend an inordinate amount of time trying to install different themes for Jekyll, of which there are [many](http://jekyllthemes.org/).

After hitting various incompatibilites with certain themes and GitHub Pages, I eventually reverted back to the base theme, minima, and ended up doing a few small CSS tweaks myself to get a layout I was happier with. (I'm not exactly a web developer, so it was nice to have a decent starting point.)

I'm sure I'll play around with the look and feel of the site more going forward, but the beautiful thing is that I have complete control. At the end of the day it's just regular HTML, CSS, Javascript and some Ruby magic available if you want to use it. No more of the proprietary WordPress 'widgets' for authoring content.

Embedding custom HTML in-line was always a real pain for me on the WordPress site, but with Jekyll it 'just works', so if I want to do something a litle fancier than what I get with markdown, I can easily. An example is the custom table I whipped up in my [post on exploring binary data]({% post_url /2019/2019-05-04-GettingComfortableWithBinary %}).

## Big news for command-line enthusiasts this year
On another topic...

There have been some huge things happening in the Windows software world this year, especially if you like working on the command-line like I do . In particular the release of the new [Windows Terminal Preview](https://devblogs.microsoft.com/commandline/introducing-windows-terminal/) is an epic change that is going to revolutionize command-line use on Windows. It's funny looking back on my PowerShell-related posts from earlier in the year and wincing at the ugliess of the screenshots.

Going from this experience:
![OldTerminal](/images/2019-02-11/pwsh_after1.png)

...to this experience:
![NewTerminal](/images/terminal1.png)

...is just amazing. And it's still just a preview!