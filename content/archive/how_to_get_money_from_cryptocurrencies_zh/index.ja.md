---
title: "暗号資産市場で損をせずに楽しむ方法"
image: "cover.png"
date: 2021-05-24T15:01:39Z
lastmod: 2021-05-24T15:25:39Z
categories: ["未分類"]
draft: false
---

注意書き:
1. PC にはそれぞれ個性があるので、無理させない。何かあっても自己責任。
2. お金にこだわりすぎない。値動きはあって当然、ハイリターンはハイリスク。世の中に無料の昼食はない。
3. **絶対に**現金で暗号資産を買わない。売るだけ、買わないなら、決して損はしない。儲けが少しだけ少なくなるだけ。
4. この記事は暗号資産に興味のある暇なゲーマー向け。マイニング業者の方は遠慮なく退場してほしい。ここでの収益効率は低いので。

必要なもの:
1. VRAM 6GB 超の GPU
2. 平常心
3. ある程度の電力と GPU を回し続けるための機材
4. 十分な換気

準備:
[1. Huobi Pool に登録する](https://www.hpt.com/pow/miners?coin=eth)
2. NBMiner をダウンロードする: [https://github.com/NebuTech/NBMiner/releases](https://github.com/NebuTech/NBMiner/releases)
3. 使わないスクリプトは削除する。

![](image.png)

`start_eth` は ETH を掘るためのスクリプト。中身を必ず書き換える。

4. Huobi Pool でマイニング用のサブアカウントを開く。（設定はお好みで。）

![](image-1-1024x652.png)

`mining account name` がサブアカウント名にあたる。

5. スクリプトを書き換え、サブアカウント名を入れる。（他人に掘らせないこと。そのお金は絶対に取り戻せない。）

![](image-2.png)

ハイライト部分は自分のサブアカウント名。そのままコピーしない。

```
nbminer -a ethash -o stratum+tcp://es.huobipool.com:443 -u mining_account_name -log
```

6. ツールで GPU ファンを最大に回し、通気を確保する。これがとても重要で、GPU の寿命に直結する。私はだいたい 70℃ 以下に抑えている。

![](image-3.png)

ここで使っているのは MSI Afterburner。

7. スクリプトをダブルクリックしてマイニングを開始する。

![](image-4.png)

8. 暗号資産を売る。Huobi 取引所 [https://www.huobi.com/zh-cn/](https://www.huobi.com/zh-cn/) を開き、マイニングプールのアカウントでログインする。

![](image-5-1024x308.png)

**Assets** をクリックして現物アカウントを選ぶ。（ここでは ETH を例にする。）

ps. 売却にはまず法定通貨アカウントへ振替する必要がある。**Transfer** をクリックして暗号資産を移す。

![](image-12-1024x468.png)

(1) 暗号資産を直接売る

![](image-8-1024x247.png)

三点ボタンを押して **Fiat Trading** を選ぶ（先に受取口座を紐付けておく必要がある）。あとは指示に従う。

![](image-9-1024x542.png)

必要なだけ売る。**買わない**。売るだけなら絶対に損はしない（電気代が暗号資産価格を上回らない限り）。

(2) リスクの移し替え（USDT を使う）

![](image-10-1024x244.png)

三点ボタンを押して **ETH/USDT** を選ぶ（先に受取口座を紐付けておく）。

![](image-11-1024x569.png)

USDT は Huobi の基軸通貨で、ドル連動の価値保存手段としてだいたい機能する。価格もほぼ 1 ドル相当。

通常は最大までスライドして売却ボタンを押せばよい。指値などの選択肢もあるが、限価売却は早くて待ち時間もない。

あとはフロー (1) と同じ流れで USDT を売却する。

参考:
[https://www.bilibili.com/video/BV1Pv411a7xU](https://www.bilibili.com/video/BV1Pv411a7xU)
[https://www.hpt.com/pow/help/3/all?from=home](https://www.hpt.com/pow/help/3/all?from=home)
[https://github.com/NebuTech/NBMiner](https://github.com/NebuTech/NBMiner)
