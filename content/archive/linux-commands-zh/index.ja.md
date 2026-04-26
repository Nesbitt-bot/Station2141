---
title: "Linux でよく使うコマンド"
image: "cover.png"
date: 2021-07-04T03:00:42Z
lastmod: 2021-07-06T01:21:10Z
categories: ["ネットワーク"]
draft: false
---

ファイルを移動する:

```
mv /original_directory /target_directory
```

バックグラウンドで静かに実行する:

```
nohup command &
```

サイレント実行の出力を確認する:

```
cat nohup.out
```

プロセスを確認する:

```
ps aux | grep process_name
```

プロセスを終了する:

```
kill pid
```

ファイル/フォルダの権限を確認する:

```
ls -l
```

tarball を展開する:

```
tar xvfz something.tar.gz
```

```
tar xvf something.tar
```
