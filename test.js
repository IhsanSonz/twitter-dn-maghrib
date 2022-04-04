const dayjs = require('dayjs');
var utc = require('dayjs/plugin/utc')
var timezone = require('dayjs/plugin/timezone')

dayjs.extend(utc);
dayjs.extend(timezone);
let res = dayjs().tz('Asia/Jakarta');
let tar = dayjs(dayjs().format('YYYY-MM-DD') + ' 17:53').tz('Asia/Jakarta');
console.log(res.diff(tar, 'hour'), (res.diff(tar, 'minute') % 60));

let result = (res.diff(tar, 'hour') < 0) ? (res.diff(tar, 'hour') * -1) + ' jam' : '';
result += (res.diff(tar, 'minute') < 0) ? ((res.diff(tar, 'minute') % 60) * -1) + ' menit' : '';
console.log(result);
