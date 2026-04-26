---
title: "Baota と WordPress で自分のサイトを立てる"
date: 2021-01-02T11:53:54Z
lastmod: 2021-04-01T12:27:25Z
image: "cover.png"
categories: ["インターネット"]
draft: false
---

* * *

月額コスト: 約 40 元（RMB）。

1. ドメインを購入する: [https://sg.godaddy.com/](https://sg.godaddy.com/)

2. VPS を購入する: [https://my.vultr.com/](https://my.vultr.com/)

   一般的には**シンガポール、日本、カナダ、アメリカ**リージョンの **CentOS 7.0** で月 5 ドル程度の VPS を選ぶとよい。

3. サーバに Baota Panel をインストールする:

```
yum install -y wget && wget -O install.sh http://download.bt.cn/install/install_6.0.sh && sh install.sh
```

4. WordPress をインストールする:

https://blog.naibabiji.com/an-zhuang-wordpress
