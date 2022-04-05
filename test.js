const dayjs = require('dayjs');
var utc = require('dayjs/plugin/utc')
var timezone = require('dayjs/plugin/timezone')
const date = '05 Apr 2022';
const Fajr = '04:43';
const Maghrib = '17:53';
dayjs.extend(utc);
dayjs.extend(timezone);
let res = dayjs('2022-04-05 03:43').tz('Asia/Jakarta');
let tar = dayjs(date);
const waktu = (res.format('H') < 5) ? Fajr : Maghrib;
const end = (res.format('H') < 5) ? 'Shubuh' : 'Maghrib';
const done = (res.format('H') < 12) ? 'Semangat berpuasa!' : 'Udah buka ya?';

tar = dayjs(tar.format('YYYY-MM-DD ') + waktu).tz('Asia/Jakarta');
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
console.log(result);
