---
title: "TrueNAS 添加已有数据库至 NextCloud"
image: "cover.png"
date: 2021-07-04T02:51:49Z
lastmod: 2021-07-04T02:55:04Z
categories: ["网络"]
draft: false
aliases:
  - /add-truenas-storage-to-nextcloud-zh/
---

https://www.youtube.com/watch?v=G21w49zLnM0&t=443s

在这个视频中，作者展示了如何添加mount point至nextcloud中，但对于已有的数据库，如何添加也是一项重要的问题。

以我自己为例，现有一个Dataset使用了SMB（CrystalMemory），想把它原封不动的添加到Nextcloud中。

![](image-3-1024x497.png)

第一步，点开Edit Permission

![](image-4-1024x642.png)

将数据库的User更改为www，Group改为www，记得点上Apply User和Apply Group的选项，否则更改不会保存。

第二步，设置Mount Point

![](image-5-1024x229.png)

Source为刚刚更改的数据库位置，Destination为Jails中的位置，一般为“mnt/"Name of your pool"/iocage/jails/"Name of your nextcloud"/root”后面的部分可以自己更改，这里我选择的是“mnt/"Name of your pool"/iocage/jails/"Name of your nextcloud"/root/mnt/CrystalMemory”其中mnt/CrystalMemory“可以改为别的，比如上面视频中提到的”/media“

第三步，开启服务，进入nextcloud，点击头像，选择Apps

![](image-6.png)

确保External Storage处于开启状态

![](image-7-1024x496.png)

如果没有开启，点击Disabled apps开启服务。

选择Settings

![](image-8.png)

在Administration目录下选择External storages

![](image-9.png)

添加刚才选择的Mount Point

![](image-10-1024x101.png)

再回到原来的界面就可以找到啦

![](image-11-1024x98.png)
