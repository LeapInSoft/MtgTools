const _ = require("lodash");
const Downloader = require("./downloader.js").Downloader;
const oOo = require("./dataParser.js");
const sets = require('c:/P/Magic/AllSets.json');

let d = new Downloader("C:/P/forge-gui-desktop-1.6.5/Cache/pics/cards");

let set = process.argv[2];
if (set === undefined) {
    console.log("Usage : node index.js <SET>");
    return;
}

let r = oOo.mtgJsonCardsToDlList(sets[set].cards, set);

console.log(`Let's download :${set}`);
for (let i = 0; i < r.length; i++) {
    let info = r[i];
    let action = function(name, set, multiverseid) {
        return _ => d.download(name, set, `http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=${multiverseid}&type=card`);
    }
    setTimeout(action(info.name, info.set, info.multiverseid), 1000 * i);
}
