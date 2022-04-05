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
            result.date = res.data.data.date.readable;
            result.time = res.data.data.timings;
        });

    return result;
}

const createDiff = ({date, time}) => {
    const {Fajr, Maghrib} = time;
    dayjs.extend(utc);
    dayjs.extend(timezone);
    let res = dayjs().tz('Asia/Jakarta').utc(true);
    let tar = dayjs(date);
    const waktu = (res.format('H') < 5) ? Fajr : Maghrib;
    const end = (res.format('H') < 5) ? 'Shubuh' : 'Maghrib';
    const done = (res.format('H') < 12) ? 'Semangat berpuasa!' : 'Udah buka ya?';
    
    tar = dayjs(tar.format('YYYY-MM-DD ') + waktu).utc(true);
    let hour = res.diff(tar, 'hour') * -1;
    let minute = (res.diff(tar, 'minute') % 60) * -1;
    console.log(res.format(), tar.format());
    console.log(hour, minute);

    let result;
    if (hour <= 0 && minute <= 0) {
        result = done;
    } else {
        result = (hour > 0) ? hour + ' jam ' : '';
        result += (minute > 0) ? minute + ' menit ' : '';
        result += 'menuju ' + end + ' untuk Bandung';
    }

    return result;
}

if (process.env.APP_DEBUG == 'true') {
    console.log('App is on debug mode');

    getTime().then((res) => {
        result = createDiff(res);

        console.log(result);
    });
} else {
    cron.schedule('* * * * *', () => {
        getTime().then((res) => {
            result = createDiff(res);

            twitterApi.v2.post(
                'account/update_profile.json',
                { name: result },
                { prefix: 'https://api.twitter.com/1.1/' },
            );

            console.log(result);
        });
    });
}
