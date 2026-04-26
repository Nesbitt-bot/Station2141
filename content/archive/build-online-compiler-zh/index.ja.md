---
title: "オンライン Java コンパイラを作る"
image: "cover.png"
date: 2021-04-11T02:40:08Z
lastmod: 2021-04-11T02:47:02Z
categories: ["ネットワーク"]
draft: false
---

参考資料:
https://www.youtube.com/watch?v=LeBqxEbM2dg
https://docs.jdoodle.com/
https://www.jdoodle.com/

ステップ 1: jdoodle のアカウントを作る。

![](image-1024x528.png)

**Register** をクリックして登録開始。

![](image-1.png)

ステップ 2: ログイン後、メニューから **API** を選ぶ。

![](image-2-1024x456.png)

無料枠で十分。1 日 200 ファイルあれば普通は使い切らない。

![](image-3-1024x528.png)

**Free** を選んでそのまま無料で使う。

ステップ 3: デフォルトのコードをアップロードし、自分のページに共有する。

![](image-4-1024x615.png)

三点ボタンをクリックしてコードを保存する。

![](image-5-1024x550.png)

**Editable Share** をクリックして自分のページに埋め込む。

![](image-6-1024x546.png)

URL が表示されるので、それを自分のページに貼ればよい。

![](image-7-1024x595.png)

WordPress で新しいページを作り、**Code Editor** を選ぶ。

![](image-8.png)

このフォーマットで貼り付け、`the url you just copied` の部分を、先ほどコピーしたコードに置き換えて保存する。

```
<iframe src="the url you just copied" width="100%" height="720" frameborder="0" marginwidth="0" marginheight="0" allowfullscreen=""></iframe>
```

![](image-9-1024x670.png)

自分のページを開けば動いているはず。
