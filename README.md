# Sentiment-Analysis
Twitter Sentiment Analysis with Tensorflow.js 
 
Connect to Twitter API,  gather tweets by hashtag, compute the sentiment of each tweet, and build a real-time dashboard to show the result.

## Live Demo
**[https://bensonruan.com/twitter-sentiment-analysis-with-tensorflowjs](https://bensonruan.com/twitter-sentiment-analysis-with-tensorflowjs)**

![sentiment](https://bensonruan.com/wp-content/uploads/2019/10/twitter-sentiment-analysis.gif)


## Installing
1. Clone this repository to your local computer
``` bash
git https://github.com/bensonruan/Sentiment-Analysis.git
```

2. On Twitter developer platform https://developer.twitter.com/
* Register a Twitter dev account
* Create a Twitter App 
* Get the Consumer API keys and Access tokens
* Replace your API keys in queryTwitter.php


3. Config your path to the queryTwitter.php inside sentiment-analysis.js and sentiment-analysis-bundle.js
``` bash
queryTwitter:  window.location.protocol + '//'+ window.location.hostname + '/js/sentiment/queryTwitter.php?q='
```

4. Point your localhost to the cloned root directory. Browse to http://localhost/index.html 


## Note
If you are on Windows, you would need to install PHP via Web Platform Installer

## Library
* [twitter-api-php](https://github.com/J7mbo/twitter-api-php) - PHP Wrapper for Twitter API v1.1 calls
* [jquery](https://code.jquery.com/jquery-3.3.1.min.js) - JQuery
* [tensorflow.js sentiment](https://github.com/tensorflow/tfjs-examples/tree/master/sentiment) - Perform text sentiment analysis on text using the Layers API of TensorFlow.js
* [canvasjs](https://canvasjs.com/jquery-charts/) - JQuery chart library
