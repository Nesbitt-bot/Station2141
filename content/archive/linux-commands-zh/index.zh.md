---
title: "Linux 常用指令"
image: "cover.png"
date: 2021-07-04T03:00:42Z
lastmod: 2021-07-06T01:21:10Z
categories: ["网络"]
draft: false
aliases:
  - /linux-commands-zh/
---

移动文件

```
mv /original_directory /target_directory
```

静默运行

```
nohup command &
```

查看静默运行结果

```
cat nohup.out
```

查看进程

```
ps aux | grep process_name
```

结束进程

```
kill pid
```

查看文件夹权限

```
ls -l
```

解压文件

```
tar xvfz something.tar.gz
```

```
tar xvf something.tar
```
