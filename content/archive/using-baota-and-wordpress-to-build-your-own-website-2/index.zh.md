---
title: "用 Baota 和 WordPress 搭建自己的网站"
date: 2021-04-01T12:28:01Z
lastmod: 2021-04-01T12:29:02Z
image: "cover.png"
categories: ["互联网"]
draft: false
---

每月开销：约 7 美元。

第一步，去 [https://sg.godaddy.com/](https://sg.godaddy.com/) 买一个属于自己的域名。

第二步，在 [https://my.vultr.com/](https://my.vultr.com/) 买一台 VPS。记得把默认系统选成 **CentOS 7.0**。

第三步，在 VPS 上装宝塔，打开终端贴入命令：

```
yum install -y wget && wget -O install.sh http://download.bt.cn/install/install_6.0.sh && sh install.sh
```

然后按下面的教程在宝塔里装 WordPress（不会中文的话用 Google Translate）。

> [WordPress 教程，从安装到使用 0 基础建站教学（2020/12 月更新）](https://blog.naibabiji.com/an-zhuang-wordpress)
