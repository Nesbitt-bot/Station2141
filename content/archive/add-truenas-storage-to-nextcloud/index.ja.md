---
title: "TrueNAS の既存ストレージを NextCloud に追加する"
image: "cover.png"
date: 2021-07-04T02:51:49Z
lastmod: 2021-07-04T02:55:04Z
categories: ["ネットワーク"]
draft: false
aliases:
  - /add-truenas-storage-to-nextcloud-zh/
---

https://www.youtube.com/watch?v=G21w49zLnM0&t=443s

上の動画では NextCloud にマウントポイントを追加する方法を紹介している。ただし、既存のデータセットを追加する場合は別途手順をまとめておく価値がある。

筆者の場合、SMB で使っていたデータセット（`CrystalMemory`）をそのまま NextCloud から見えるようにしたかった。

![](image-3-1024x497.png)

ステップ 1: Edit Permissions を開く。

![](image-4-1024x642.png)

データセットの User を `www`、Group を `www` に変更する。**Apply User** と **Apply Group** にチェックを入れるのを忘れない。チェックしないと変更は保存されない。

ステップ 2: Mount Point を設定する。

![](image-5-1024x229.png)

`Source` は今変更したデータセットのパス。`Destination` は Jail 内のパスで、たいていは `mnt/<your pool>/iocage/jails/<your nextcloud>/root/...` の形になる。末尾は自由に決めてよい。ここでは `mnt/<your pool>/iocage/jails/<your nextcloud>/root/mnt/CrystalMemory` とした。`mnt/CrystalMemory` の部分は任意で、動画の例のように `/media` でもよい。

ステップ 3: サービスを有効化する。NextCloud にログインしてアバターをクリックし、**Apps** を選ぶ。

![](image-6.png)

**External Storage** が有効になっていることを確認する。

![](image-7-1024x496.png)

無効になっている場合は **Disabled apps** から有効化する。

**Settings** を選ぶ。

![](image-8.png)

Administration セクションから **External storages** を選ぶ。

![](image-9.png)

先ほどの Mount Point を追加する。

![](image-10-1024x101.png)

元の画面に戻ると追加されているはず。

![](image-11-1024x98.png)
