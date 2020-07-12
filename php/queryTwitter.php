<?php
require_once('TwitterAPIExchange.php');

$hashtag = $_GET["q"];

$settings = array(
    'oauth_access_token' => "YOUR_ACCESS_TOKEN",
    'oauth_access_token_secret' => "YOUR_ACCESS_TOKEN_SECRET",
    'consumer_key' => "YOUR_CONSUMER_KEY",
    'consumer_secret' => "YOUR_CONSUMER_SECRET"
);

$url = 'https://api.twitter.com/1.1/search/tweets.json';
$getfield = '?q=#'.$hashtag.' AND -filter:retweets AND -filter:replies&lang=en&count=20&tweet_mode=extended';
$requestMethod = 'GET';

$twitter = new TwitterAPIExchange($settings);
$response = $twitter->setGetfield($getfield)
     ->buildOauth($url, $requestMethod)
     ->performRequest();

echo $response;
?>