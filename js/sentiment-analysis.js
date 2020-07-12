const HOSTED_URLS = {
    queryTwitter:  window.location.protocol + '//'+ window.location.hostname + '/js/sentiment/queryTwitter.php?q=',
    model: 'https://storage.googleapis.com/tfjs-models/tfjs/sentiment_cnn_v1/model.json',
    metadata: 'https://storage.googleapis.com/tfjs-models/tfjs/sentiment_cnn_v1/metadata.json'
};  
const LOCAL_URLS = {
    queryTwitter:  'php/queryTwitter.php?q=',
    model: 'https://storage.googleapis.com/tfjs-models/tfjs/sentiment_cnn_v1/model.json',
    metadata: 'https://storage.googleapis.com/tfjs-models/tfjs/sentiment_cnn_v1/metadata.json'
};
const SentimentThreshold = {
    Positive: 0.66,
    Neutral: 0.33,
    Negative: 0
}
const PAD_INDEX = 0;
const OOV_INDEX = 2;

let urls, model, metadata;

$("#tag-input").on('keyup', function (e) {
    if (e.keyCode === 13) {
        twitterSentiment();
    }
});

$(".btn-search").click(function () {
    twitterSentiment();
});

function init(){
    if(window.location.hostname == 'localhost'){
        urls = LOCAL_URLS;
    }else {
        urls = HOSTED_URLS;
    }
}

async function setupSentimentModel(){
    if(typeof model === 'undefined'){
        model = await loadModel(urls.model);
    }
    if(typeof metadata === 'undefined'){
        metadata = await loadMetadata(urls.metadata);
    }
}

function twitterSentiment(){
    $('#tweet-list').addClass('d-none');
    $('#positive').empty();
    $('#neutral').empty();
    $('#negative').empty();
    $('#chartContainer').empty();
    $('.spinner-border').removeClass('d-none');
    
    getTwitterHashTagData($("#tag-input").val(), processTwitterData);
}

function processTwitterData(tweets){
    setupSentimentModel().then(
        result => {
            const twitterData = [];
            $.each(tweets, function( index, tweet ) {
                const tweet_text = tweet.full_text.replace(/(?:https?|ftp):\/\/[\n\S]+/g, '');
                const sentiment_score = getSentimentScore(tweet_text);
                let tweet_sentiment = '';
                if(sentiment_score > SentimentThreshold.Positive){
                    tweet_sentiment = 'positive'
                }else if(sentiment_score > SentimentThreshold.Neutral){
                    tweet_sentiment = 'neutral'
                }else if(sentiment_score >= SentimentThreshold.Negative){
                    tweet_sentiment = 'negative'
                }
                twitterData.push({
                    sentiment: tweet_sentiment,
                    score: sentiment_score.toFixed(4),
                    tweet: tweet_text
                });
            });
            console.log(twitterData);
            $('.spinner-border').addClass('d-none');
            displayTweets(twitterData.filter(t => t.sentiment == 'positive'), 'positive');
            displayTweets(twitterData.filter(t => t.sentiment == 'neutral'), 'neutral');
            displayTweets(twitterData.filter(t => t.sentiment == 'negative'), 'negative');
            $('#tweet-list').removeClass('d-none');
            displayPieChart(twitterData);
        }
    )   
}

async function loadModel(url) {
    try {
        const model = await tf.loadLayersModel(url);
        return model;
    } catch (err) {
        console.log(err);
    }
}

async function loadMetadata(url) {
    try {
        const metadataJson = await fetch(url);
        const metadata = await metadataJson.json();
        return metadata;
    } catch (err) {
        console.log(err);
    }
}

function padSequences(sequences, maxLen, padding = 'pre', truncating = 'pre', value = PAD_INDEX) {
  return sequences.map(seq => {
    if (seq.length > maxLen) {
      if (truncating === 'pre') {
        seq.splice(0, seq.length - maxLen);
      } else {
        seq.splice(maxLen, seq.length - maxLen);
      }
    }

    if (seq.length < maxLen) {
      const pad = [];
      for (let i = 0; i < maxLen - seq.length; ++i) {
        pad.push(value);
      }
      if (padding === 'pre') {
        seq = pad.concat(seq);
      } else {
        seq = seq.concat(pad);
      }
    }

    return seq;
  });
}

function getSentimentScore(text) {
    const inputText = text.trim().toLowerCase().replace(/(\.|\,|\!)/g, '').split(' ');
    // Convert the words to a sequence of word indices.
    const sequence = inputText.map(word => {
      let wordIndex = metadata.word_index[word] + metadata.index_from;
      if (wordIndex > metadata.vocabulary_size) {
        wordIndex = OOV_INDEX;
      }
      return wordIndex;
    });
    // Perform truncation and padding.
    const paddedSequence = padSequences([sequence], metadata.max_len);
    const input = tf.tensor2d(paddedSequence, [1, metadata.max_len]);

    const predictOut = model.predict(input);
    const score = predictOut.dataSync()[0];
    predictOut.dispose();

    return score;
}

function getTwitterHashTagData(query, callback) {
    $.getJSON( urls.queryTwitter + query, function(result) {
        console.log(result);
        if(result !== null && result.statuses !== null){
            callback(result.statuses);
        }
    });
}

function displayTweets(twitterData, sentiment){
    var tbl  = document.createElement('table');
    var tr = tbl.insertRow();
    for( var j in twitterData[0] ) {
        if(j !=='sentiment'){
            var td = tr.insertCell();
            td.appendChild(document.createTextNode(j));
        }
    }

    for( var i = 0; i < twitterData.length; i++) {
        var tr = tbl.insertRow();
        for( var j in twitterData[i] ) {
            if(j !=='sentiment'){
                var td = tr.insertCell();
                var text = twitterData[i][j];
                td.appendChild(document.createTextNode(text));
            }
        }
    }
    tbl.setAttribute('class', 'tweet-table')
    $('#'+sentiment).append(tbl);
    $('#'+sentiment+'-counter').html('('+ twitterData.length +')');
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
        theme: "light2",
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

init();