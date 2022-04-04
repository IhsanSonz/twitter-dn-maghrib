const { default: axios } = require('axios');
var cron = require('node-cron');
require('dotenv').config();
const { TwitterApi } = require('twitter-api-v2');

const dayjs = require('dayjs');
var utc = require('dayjs/plugin/utc')
var timezone = require('dayjs/plugin/timezone')
var cron = require('node-cron');

console.log('App is running');

const twitterApi = new TwitterApi({
    appKey: process.env.TWITTER_API_KEY,
    appSecret: process.env.TWITTER_API_SECRET,
    accessToken: process.env.TWITTER_ACCESS_TOKEN,
    accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

const getTime = async () => {
    let result = { date: '', time: '' };
    await axios.get('http://api.aladhan.com/v1/timingsByCity?city=Bandung&country=Indonesia')
        .then(res => {
            result.date = res.data.data.date.gregorian.date;
            result.time = res.data.data.timings.Maghrib;
        });

    return result;
}

const createDiff = ({date, time}) => {
    dayjs.extend(utc);
    dayjs.extend(timezone);
    let res = dayjs().tz('Asia/Jakarta');
    let tar = dayjs(date + ' ' + time).tz('Asia/Jakarta');
    let hour = res.diff(tar, 'hour');
    let minute = res.diff(tar, 'minute');
    let result = (hour < 0) ? (hour * -1) + ' jam' : '';
    result += (minute < 0) ? ((minute % 60) * -1) + ' menit' : '';

    return result;
}

if (process.env.APP_DEBUG) {
    console.log('App is on debug mode');
} else {
    cron.schedule('* * * * *', () => {
        getTime().then((res) => {
            result = createDiff(res);

            let arr = result.split(' ');
            result += ' menuju Maghrib untuk Bandung';

            result = (arr[2] < 0) ? result : 'Udah buka ya?';

            twitterApi.v2.post(
                'account/update_profile.json',
                { name: 'Udah buka ya?' },
                { prefix: 'https://api.twitter.com/1.1/' },
            );

            console.log(result);
        });
    });
}
