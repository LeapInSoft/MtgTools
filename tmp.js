const sets = require('c:/P/Magic/AllSets.json');
const _ = require('lodash');

let r = _(sets).map(x =>{return {code : x.code, oldcode : x.oldCode}}).value();
console.log(r);