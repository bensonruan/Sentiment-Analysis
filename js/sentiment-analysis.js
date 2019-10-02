var async = require('async');
var sentiment = require('sentiment');
var request = require('request');

var options = {
    url: window.location.protocol + '//'+ window.location.hostname + '/projects/sentiment-analysis/php/queryTwitter.php?q='
};


$("#tag-input").on('keyup', function (e) {
    if (e.keyCode === 13) {
        $('#tweet-list').empty();
        $('#chartContainer').empty();
        $('.spinner-border').removeClass('d-none');
        getTwitterHashTagData(this.value, function (error, twitterData) {
            if (error) console.log(error);
            $('.spinner-border').addClass('d-none');
            displayTweets(twitterData);
            displayPieChart(twitterData);
        });
    }
});

function getTwitterHashTagData(query, callback) {
    request.get( options.url + query, function(error, response, body) {
        var tweets = jQuery.parseJSON(body);
        var twitterData = [];
        async.each(tweets.statuses, function (item, callEach) {
            var sentScore = sentiment(item.text, function (err, data) {
                var tweet_sentiment = '';
                if(data.score==0){
                    tweet_sentiment = 'neutral'
                }else if(data.score>0){
                    tweet_sentiment = 'positive'
                }else if(data.score<0){
                    tweet_sentiment = 'negative'
                }
                twitterData.push({
                    sentiment: tweet_sentiment,
                    score: data.score,
                    tweet: item.text
                });
                callEach(); 
            });

        }, function () {

            callback(null, twitterData);

        });
    });
}

function displayTweets(twitterData){
    var tbl  = document.createElement('table');
    var tr = tbl.insertRow();
    for( var j in twitterData[0] ) {
        var td = tr.insertCell();
        td.appendChild(document.createTextNode(j));
    }

    for( var i = 0; i < twitterData.length; i++) {
        var tr = tbl.insertRow();
        for( var j in twitterData[i] ) {
            var td = tr.insertCell();
            var text = twitterData[i][j];
            if(j=='sentiment'){
                var cssClass = '';
                switch(text) {
                    case 'positive':
                      cssClass = 'alert alert-success';
                      break;
                    case 'negative':
                      cssClass = 'alert alert-danger';
                      break;
                    case 'neutral':
                      cssClass = 'alert alert-secondary';
                      break;
                }
                td.setAttribute('class', cssClass);
            }
            td.appendChild(document.createTextNode(text));
        }
    }
    tbl.setAttribute('class', 'tweet-table')
    $('#tweet-list').append(tbl);
    $('#tweet-list').addClass('tweet-list');
}

function displayPieChart(twitterData){
    var sentimentsCounter = {"Negative": 0, "Neutral": 0, "Positive": 0};
    for( var i = 0; i < twitterData.length; i++) {
        switch(twitterData[i].sentiment) {
            case 'positive':
              sentimentsCounter["Positive"] += 1;
              break;
            case 'negative':
              sentimentsCounter["Negative"] += 1;
              break;
            case 'neutral':
              sentimentsCounter["Neutral"] += 1;
              break;
        }
    }
    var chart = new CanvasJS.Chart("chartContainer", {
        theme: "light2", // "light1", "light2", "dark1", "dark2"
        exportEnabled: true,
        animationEnabled: true,
        data: [{
            type: "pie",
            startAngle: 25,
            toolTipContent: "<b>{label}</b>: {y}%",
            showInLegend: "true",
            legendText: "{label}",
            indexLabelFontSize: 16,
            indexLabel: "{label} - {y}%",
            dataPoints: [
                { y: (sentimentsCounter["Positive"] * 100.00/twitterData.length).toFixed(2), label: "Positive" },
                { y: (sentimentsCounter["Neutral"] * 100.00/twitterData.length).toFixed(2), label: "Neutral" },
                { y: (sentimentsCounter["Negative"] * 100.00/twitterData.length).toFixed(2), label: "Negative" },
            ]
        }]
    });
    chart.render();
}