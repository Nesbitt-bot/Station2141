---
title: "Common Site-Setup Issues"
image: "cover.png"
date: 2021-01-03T23:57:23Z
lastmod: 2021-04-10T08:15:41Z
categories: ["Network"]
draft: false
---

Resetting the Baota Panel security entry point:

Open an SSH terminal and run:

![](Screen-Shot-2021-01-04-at-07.56.27.png)

```
/etc/init.d/bt default
```

Check the current server processes:

```
system status nameOfTheTask
```

Restart a service:

```
system restart nameOfTheTask
```
