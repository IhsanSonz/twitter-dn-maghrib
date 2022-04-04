const { default: axios } = require('axios');
var cron = require('node-cron');
require('dotenv').config();
const { TwitterApi } = require('twitter-api-v2');

var cron = require('node-cron');

const twitterApi = new TwitterApi({
  appKey: process.env.TWITTER_API_KEY,
  appSecret: process.env.TWITTER_API_SECRET,
  accessToken: process.env.TWITTER_ACCESS_TOKEN,
  accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

const getTime = async () =>  {
  let result = {date: '', time: ''};
  await axios.get('http://api.aladhan.com/v1/timingsByCity?city=Bandung&country=Indonesia')
    .then(res => {
      result.date = res.data.data.date.gregorian.date;
      result.time = res.data.data.timings.Maghrib;
    });

  return result;
}

const createDiff = (date, time) => {
  date = date.split('-');
  time.split(':')
  var today = new Date();
  var target = new Date(date + ' ' + time);
  var diffMs = (target - today); // milliseconds between now & target
  var diffHrs = Math.floor((diffMs % 86400000) / 3600000); // hours
  var diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes
  return diffHrs + ' jam ' + diffMins + ' menit';
}

var task = cron.schedule('* * * * *', () =>  {
  getTime().then((res) => {
    result = createDiff(res.date, res.time);

    let arr = result.split(' ');
    result +=' menuju Maghrib untuk Bandung';
  
    if (arr[2] < 0) {
      twitterApi.v2.post(
        'account/update_profile.json',
        { name: 'Udah buka ya?' },
        { prefix: 'https://api.twitter.com/1.1/' },
      );
    } else {
      twitterApi.v2.post(
        'account/update_profile.json',
        { name: result },
        { prefix: 'https://api.twitter.com/1.1/' },
      );
    }
  });
});
