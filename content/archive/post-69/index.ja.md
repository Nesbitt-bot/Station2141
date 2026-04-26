---
title: "サイト構築でよくある問題"
image: "cover.png"
date: 2021-01-03T23:57:23Z
lastmod: 2021-04-10T08:15:41Z
categories: ["ネットワーク"]
draft: false
---

Baota Panel のセキュリティ入口を再確認する:

SSH ターミナルに入って次を入力:

![](Screen-Shot-2021-01-04-at-07.56.27.png)

```
/etc/init.d/bt default
```

現在のサーバプロセスを確認する:

```
system status nameOfTheTask
```

サービスを再起動する:

```
system restart nameOfTheTask
```
