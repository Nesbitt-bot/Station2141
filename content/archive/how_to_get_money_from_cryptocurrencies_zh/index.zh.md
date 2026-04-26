---
title: "如何稳赚不赔的享受加密货币市场"
image: "cover.png"
date: 2021-05-24T15:01:39Z
lastmod: 2021-05-24T15:25:39Z
categories: ["未分类"]
draft: false
aliases:
  - /how_to_get_money_from_cryptocurrencies_zh/
---

危险声明：  
1、每一台电脑都有自己的体质和个性，不要强求，不要暴力，出了事不要找我。  
2、不要过于在乎钱，涨跌很正常，高收益高风险，世界上从没有免费的午餐。  
3、千万不要花真金白银买加密货币，只卖不买你就永远不会亏，只是少赚一点。  
4、本文章只针对对加密货币有兴趣，闲的没事干的臭打游戏的，矿老板请让步，这里赚钱效率低。

需要的东西：  
1、一台显存超过6G的显卡  
2、良好的心态  
3、一些电能和让显卡奔跑的设备  
4、优秀的排风系统

准备措施：  
[1、去火币矿池注册一个账号](https://www.hpt.com/pow/miners?coin=eth)  
2、下载NBminer[https://github.com/NebuTech/NBMiner/releases](https://github.com/NebuTech/NBMiner/releases)  
3、把不用的脚本删干净

![](image.png)

这里start\_eth是挖以太币的脚本，记得更改里面的内容。

4、在火币矿池开通挖矿子账户。（内容根据自己情况自选）

![](image-1-1024x652.png)

mining account name 对应子账户名称

5、更改脚本，在对应的位置填写子账户名。（不要为了别人挖矿，这些钱是绝对追不回来的。）

![](image-2.png)

标记区域为我的子账户名，不要瞎抄

```
nbminer -a ethash -o stratum+tcp://es.huobipool.com:443 -u mining_account_name -log
```

6、利用软件把显卡风扇拉满，保证通风顺畅。这一步非常重要，直接影响挖矿后显卡使用寿命，我一般把温度控制在70度以下，以免危险。

![](image-3.png)

这里使用的软件是MSI afterburner

7、双击脚本开始挖矿

![](image-4.png)

8、出售加密货币，打开火币交易所[https://www.huobi.com/zh-cn/](https://www.huobi.com/zh-cn/)，并登录之前在矿池的账号。

![](image-5-1024x308.png)

点击资产，选择币币账户。（以下以以太币为例）

ps.所有资产需要划转到法币账户下才可以出售，点击划转划转加密货币。

![](image-12-1024x468.png)

（1）直接卖出加密货币

![](image-8-1024x247.png)

点击旁边的三个小点，选择法币交易（在此之前，你需要绑定收钱的账号）按照指示操作。

![](image-9-1024x542.png)

根据自己的需求出售加密货币，千万不要买。只卖永远不会亏（除非电费高于币价）

（2）风险转移（利用USDT转移风险）

![](image-10-1024x244.png)

点击旁边的三个小点，选择ETH/USDT交易（在此之前，你需要绑定收钱的账号）按照指示操作。

![](image-11-1024x569.png)

USDT是火币交易所的基本加密货币，可以达到一定的保值作用，相当于美元，而且价格也大致相同。

一般情况下直接拉满，点击卖出即可。当然这里还有很多其他选择，不一定要按照限价出售，可以自己定，只是限价出售速度极快，不需要什么等待时间而已。

之后按照出售一般加密货币的流程（1）出售USDT即可。

参考资料：  
[https://www.bilibili.com/video/BV1Pv411a7xU](https://www.bilibili.com/video/BV1Pv411a7xU)  
[https://www.hpt.com/pow/help/3/all?from=home](https://www.hpt.com/pow/help/3/all?from=home)  
[https://github.com/NebuTech/NBMiner](https://github.com/NebuTech/NBMiner)
