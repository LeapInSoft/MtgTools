var http = require('http');
var fs = require('fs');
var sets = require('./AllSets.json');

function dl(filename, setDirectory, url) {
  console.log(filename, setDirectory, url);
    if (!fs.existsSync(setDirectory)) {
      fs.mkdirSync(setDirectory);
    }
    let fullFileName = `./${setDirectory}/${filename}`;
    if (fs.existsSync(fullFileName)) {
      console.log(`Skip ${fullFileName}`);
      return;
    }

    var file = fs.createWriteStream(fullFileName);
    var request = http.get(url, function(response) {
        response.pipe(file);
    });
}

function dlCards(cards) {
  var nbrCards = cards.length,
      land = {
        Forest : 1,
        Mountain : 1,
        Swamp : 1,
        Plains : 1,
        Island : 1
      };
  console.log(nbrCards);
  for (var i = 0; i < nbrCards; i++) {
      try {
        var card = cards[i],
          name = card.name;
        if (land[name]) {
          let tempName = name;
          name = `${name}${land[name]}`;
          land[tempName]++;
        } 
        let action = function(name, set, multiverseid) {
          return _ => dl(`${name}.full.jpg`, set, `http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=${multiverseid}&type=card`)
        };
        setTimeout(action(name, card.set, card.multiverseid), 1000 * i);
      } catch (e) {
        console.log(card,i);
        console.log(e);
      }
      
  }
}
var setName = process.argv[2];
console.log(setName);
var set = sets[setName];
var cards = set.cards.map(x => { return { multiverseid : x.multiverseid , name : x.name, set : setName}})
console.log(cards.length);
dlCards(cards);