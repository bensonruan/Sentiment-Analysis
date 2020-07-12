# Sentiment-Analysis
Twitter Sentiment Analysis with npm Sentiment module 
 
Connect to Twitter API,  gather tweets by hashtag, compute the sentiment of each tweet, and build a real-time dashboard to show the result.

## Live Demo
**[https://bensonruan.com/twitter-sentiment-analysis-with-sentiment-node-js/](https://bensonruan.com/twitter-sentiment-analysis-with-sentiment-node-js/)**

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

3. run below code in the root directory to install required packages
``` bash
npm install
```

4. run below code to install browserify and watchify
``` bash
npm install -g browserify watchify
```

5. run below code in the js directory to watch sentiment-analysis.js change and output the bundle js
``` bash
watchify sentiment-analysis.js -o sentiment-analysis-bundle.js
```

6. Config your path to the queryTwitter.php inside sentiment-analysis.js and sentiment-analysis-bundle.js
``` bash
url: window.location.protocol + '//'+ window.location.hostname + 'YOUR-PATH-TO-queryTwitter.php?q='
```

7. Point your localhost to the cloned root directory. Browse to http://localhost/index.html 


## Note
If you are on Windows, you would need to install PHP via Web Platform Installer

## Library
* [twitter-api-php](https://github.com/J7mbo/twitter-api-php) - PHP Wrapper for Twitter API v1.1 calls
* [jquery](https://code.jquery.com/jquery-3.3.1.min.js) - JQuery
* [sentiment](https://www.npmjs.com/package/sentiment) - Node.js module that uses the AFINN-165 wordlist and Emoji Sentiment Ranking to perform sentiment analysis on arbitrary blocks of input text.
* [canvasjs](https://canvasjs.com/jquery-charts/) - JQuery chart library
