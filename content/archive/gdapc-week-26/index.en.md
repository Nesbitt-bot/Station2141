---
title: "GDAPC Week 26 — <a id=\"_if00285aq78k\"></a>Effective data stories"
date: 2026-04-26T07:26:30.000Z
image: "cover.png"
description: "Google Data Analytics Professional Certificate — Week 26 notes."
tags: ["GDAPC","Google Data Analytics","Coursera","Week 26"]
categories: ["Google data analytics professional certificates"]
draft: false
---

<a id="_1vrmggwjbzp"></a>Week 26

Dashboard: A tool that organizes information from multiple datasets into one central location for tracking analysis, and simple visualization\.

Data storytelling: Communicating the meaning of a dataset with visuals and narratives that are customized for each particular audience\.

3 data storytelling steps:

- Engage your audience

Catching and keeping your audience's attention\.

- Create compelling visuals

Share the story of your data\.

- Tell the story in an interesting narrative

Connect the story and make compelling statements\.

# <a id="_if00285aq78k"></a>Effective data stories

In data analytics, data storytelling is communicating the meaning of a dataset with visuals and a narrative that is customized for a particular audience\. In data journalism, journalists engage their audience of readers by combining visualizations, narrative, and context into data\-driven articles\. It turns out that data analysts and data journalists have a lot in common\! As a junior data analyst, you might learn a few things about effective storytelling from data journalism\. Read further to explore the role and work of a data journalist in telling a good story\.

Note: This reading refers to an article published in *The New Yorker*\. Non\-subscribers may access several free articles each month\. If you already reached your monthly limit on free articles, bookmark the article and come back to this reading later\.

## <a id="_qswr7lu8rer1"></a>__Take a tour of a data\-driven article__

__![This illustration is of a tour bus that tourists ride in New York City.](image-1.png) __

[Ben Wellington](https://www.newyorker.com/contributors/ben-wellington), a contributing writer for *The New Yorker* and a professor at the Pratt Institute, used New York City’s[ open data portal](https://nycopendata.socrata.com/Social-Services/311-Service-Requests-from-2010-to-Present/erm2-nwe9?) to track down noise complaints from logged service requests\. He analyzed the data to gain a more quantitative understanding of where the noise was coming from and which neighborhoods were the noisiest\. Then, he presented his findings in the[ Mapping New York's Noisiest Neighborhoods](https://www.newyorker.com/tech/annals-of-technology/mapping-new-york-noise-complaints) article\.

First, click the link above to skim the article and familiarize yourself with the data visualizations\. Then, join the bus tour of the data\! You will be directed to three visualizations \(tour stops\) to observe how each visualization helped strengthen the overall storytelling in the article\.

### <a id="_hauq1kroegih"></a>__Tour stop 1: setting context __

Earlier in the training, you learned how context is important to understand data\. Context is the condition in which something exists or happens\. Based on the categorization of noise complaints, the data journalist set the context in the article by defining what people considered to be noise\.

In the article, review the[ combo table and bar chart](https://media.newyorker.com/photos/590965cfebe912338a3758c4/master/w_1600%2Cc_limit/Wellington-noise-ComplaintCounts.jpg) that categorizes the noise complaints\. Evaluate the visualization:

How does the visualization help set the context?

- The combo table and bar chart is effective in summarizing the noise categories as percentages of the logged complaints\. This helps set the context by answering the question, “what is noise?” Notice that the data journalist created a combo table and bar chart instead of a pie chart\. With 11 noise categories, a list with a bar chart showing relative proportions is an elegant representation\. A pie chart with 11 slices would have been harder to read\.

How does the visualization help clarify the data?

- If you add the percentages in the categories in the combo table and bar chart, the total is ninety\-eight percent\. There is a difference of two percent that can’t be accounted for in the visualization\. So, rather than clarifying the data, the visualization actually causes a little confusion\. One lesson is to always make sure that your percentages add up correctly\. Sometimes rounding decimal places up or down causes percentages to be off so they don’t add up to 100%\.

Do you notice a data visualization best practice?

You learned that a companion table in Tableau shows data in a different way in case some in your audience prefer tables\. It appears that the data journalist had the same idea by using a combo table and bar chart\.

- Note: As a refresher, a companion table in Tableau is displayed right next to a visualization\. A companion table displays the same data as the visualization, but in a table format\. You may replay the[ Getting Creative](https://www.coursera.org/learn/visualize-data/lecture/Eytgs/getting-creative) video which includes an example of a companion table\.

### <a id="_icpd0mwefhce"></a>__Tour stop 2: analyzing variables__

After setting the context by identifying the noise categories, the data journalist describes his analysis of the noise data\. One interesting analysis is the distribution of noise complaints versus the time of day\.

In the article, review the[ stacked area chart](https://media.newyorker.com/photos/590965cd1c7a8e33fb38d4ac/master/w_1600%2Cc_limit/Wellington-noise-ComplaintsHours.jpg) for the distribution of noise complaints by hour of the day\. Evaluate the visualization:

How does the visualization perform against the five\-second rule?

- Recall that the five\-second rule states that you should understand what is being conveyed within the first five seconds of seeing a chart\. We are guessing that this visualization performs quite well\! The area charts for loud music and barking dogs help the audience understand that more of these types of noise complaints were made during late night and early morning hours \(between 10:00 PM and 2:00 AM\)\. Notice also that the color coding in the legend aligns with the colors in the chart\. A chart legend normally has the largest category at the top, but the data journalist chose to order the legend so the largest category, “Loud music or party” appears at the bottom instead\. How much time do you think this alignment saved readers?

How does the visualization help clarify the data?

- Unlike the visualization from the previous tour stop, this visualization does a better job of clearly showing that all percentages add up to 100%\.

Do you notice a data visualization best practice?

- As a best practice, both the x\-axis and y\-axis should be labeled\. But, the data journalist chose to include % or A\.M\. and P\.M\. with each tick on an axis\. As a result, labeling the x\-axis “Time of Day'' and the y\-axis “Percentage of Noise Complaints” isn’t required\. This demonstrates that a little creativity with labeling can help you achieve a cleaner chart\.

### <a id="_a9p9ywu5il61"></a>__Tour stop 3: drawing conclusions__

After describing how the data was analyzed, the data journalist shares which neighborhoods are the noisiest using a variety of visualizations:[ combo table and bar chart](https://media.newyorker.com/photos/590965ceebe912338a3758c2/master/w_1600%2Cc_limit/Wellington-noise-ComplaintsNeighborhoods.jpg),[ density map](https://media.newyorker.com/photos/590965cfc14b3c606c1067b0/master/w_1600%2Cc_limit/Wellington-noise-complete.jpg), and[ neighborhood map](https://media.newyorker.com/photos/590965d0ebe912338a3758c8/master/w_1600%2Cc_limit/Wellington-noise-WilliamsburgDetail.jpg)\.

In the article, review the[ neighborhood map](https://media.newyorker.com/photos/590965d0ebe912338a3758c8/master/w_1600%2Cc_limit/Wellington-noise-WilliamsburgDetail.jpg) for how close a noisy neighborhood is to a quiet neighborhood\. Evaluate the visualization:

How does the visualization help make a point?

- The data journalist observed that one of the noisiest neighborhoods was right next to one of the quietest neighborhoods\. The neighborhood map is effective in emphasizing this observation as a dark blue area versus a white area\.

How does the visualization help clarify the data?

- The visualization classifies the data by neighborhood and allows the audience to follow along when the journalist focuses specifically on the Williamsburg, East Williamsburg, and North Side/South Side neighborhoods\.

Do you notice a data visualization best practice?

- Each neighborhood is directly labeled so a legend isn’t necessary\.

## <a id="_vjnt7kprfvzd"></a>__End of the tour: being inspired __

We hope you enjoyed your tour of a data journalist’s work\! May this inspire your data storytelling to be as engaging as possible\. For additional information about effective data storytelling, read these articles:

- [What is Data Storytelling?](https://www.nugit.co/what-is-data-storytelling/)
- [The Art of Storytelling in Analytics and Data Science | How to Create Data Stories?](https://www.analyticsvidhya.com/blog/2020/05/art-storytelling-analytics-data-science/)
- [Use Data and Analytics to Tell a Story](https://www.gartner.com/smarterwithgartner/use-data-and-analytics-to-tell-a-story/)
- [Tell a Meaningful Story With Data](https://www.thinkwithgoogle.com/marketing-resources/data-measurement/tell-meaningful-stories-with-data/)

<a id="_c80mev2oy2g"></a>Engage your audience

Stories make people care\.

Speaking to your audience:

- What role does this audience play?
- What is their stake in the project?
- What do they hope to get from the data insights I deliver?

Choose your primary message\.

Spotlighting: Scanning through data to quickly identify the most important insights\.

<a id="_nhql8psdh6bc"></a>Create compelling visuals

Dashboard: A tool that organizes information from multiple datasets into one central location for tracking, analysis, and simple visualization through tables, charts and graphs\.

# <a id="_t15q8n8tqwfl"></a>Live and static insights

Previously, you learned about data storytelling and interpreting your dataset through a narrative\. In this reading, you will explore the difference between live and static insights to make your data even clearer\.

![An image of a man driving. His car’s dashboard is made up of bar chart, pie chart, line graph, and heatmap](image-2.png)

## <a id="_30hzjv9gqz6t"></a>__Live versus static __

Identifying whether data is live or static depends on certain factors:

- How old is the data?
- How long until the insights are stale or no longer valid to make decisions?
- Does this data or analysis need updating on a regular basis to remain valuable?

S​tatic data involves providing screenshots or snapshots in presentations or building dashboards using snapshots of data\. There are pros and cons to static data\.

PROS

- Can tightly control a point\-in\-time narrative of the data and insight
- Allows for complex analysis to be explained in\-depth to a larger audience

CONS

- Insight immediately begins to lose value and continues to do so the longer the data remains in a static state
- S​napshots can't keep up with the pace of data change

L​ive data means that you can build dashboards, reports, and views connected to automatically updated data\.

PROS

- Dashboards can be built to be more dynamic and scalable
- Gives the most up\-to\-date data to the people who need it at the time when they need it
- Allows for up\-to\-date curated views into data with the ability to build a scalable “single source of truth” for various use cases
- Allows for immediate action to be taken on data that changes frequently
- Alleviates time/resources spent on processes for every analysis

CONS

- Can take engineering resources to keep pipelines live and scalable, which may be outside the scope of some companies' data resource allocation
- Without the ability to interpret data, you can lose control of the narrative, which can cause data chaos \(i\.e\. teams coming to conflicting conclusions based on the same data\)
- Can potentially cause a lack of trust if the data isn’t handled properly

## <a id="_3t6gsb57rhov"></a>__Key takeaways__

Analysts need to familiarize themselves with the business and data so they can recommend when an updated static analysis is needed or should be refreshed\. Also, this data insight will help you make the case for what sorts of analyses, visualizations, and additional data are recommended for the types of decisions that the business needs to make\.

<a id="_63ngm31oc3mq"></a>Tell the story in an interesting narrative

Key elements in narriating:

- Characters

Refering to people affected by your story \(stakehoders, customers, clients, and others\.\)

- Setting

All the background information you need to know in the data project\.

- Plot

What creates the tension in the situation, the key conflict\.

- Big reveal

The resolution you find in the data that you can solve the problem\.

- Aha moment

Share your recommendation and why you think this would make your company be successful\.

Sharing data in slide show:

- Theme

Theme, title are important to show your professionality\.

- Text

Each slide should have less than 5 lines and at most 25 words per slide\.

- Visuals

Make each point on slide clear and easy to understand\.

- Reveal

Highlight the Aha moment

- Paste

Data may not update automatically\.

- Link

Keep data the same as you update them\.

- Embed
