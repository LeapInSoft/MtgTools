const _ = require('lodash');
const data = [2,1,2,0,1,4];

const win = _.sum(data)
const match = win + data.length * 3;
console.log(win, match, (win / match) * 100);