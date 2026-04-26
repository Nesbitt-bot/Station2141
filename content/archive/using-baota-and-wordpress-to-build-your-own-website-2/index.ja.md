---
title: "Baota と WordPress で自分のサイトを立てる"
date: 2021-04-01T12:28:01Z
lastmod: 2021-04-01T12:29:02Z
image: "cover.png"
categories: ["インターネット"]
draft: false
---

月額コスト: 約 7 ドル。

第 1 ステップ: [https://sg.godaddy.com/](https://sg.godaddy.com/) で自分のドメインを購入する。

第 2 ステップ: [https://my.vultr.com/](https://my.vultr.com/) で VPS を借りる。デフォルト OS は **CentOS 7.0** を選ぶ。

第 3 ステップ: VPS に Baota Panel をインストールする。ターミナルを開いて次のコマンドを貼り付ける:

```
yum install -y wget && wget -O install.sh http://download.bt.cn/install/install_6.0.sh && sh install.sh
```

その後、以下のガイドに従って Baota Panel から WordPress をインストールする（中国語が読めなければ Google 翻訳を使えばよい）。

> [WordPress 教程, インストールから利用までゼロから建てるサイト構築（2020/12 月更新）](https://blog.naibabiji.com/an-zhuang-wordpress)
