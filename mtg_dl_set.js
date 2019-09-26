const http = require('https');
const fs = require('fs');
const sets = require('./ELD.json');
const R = require('ramda');

// # Data manipulation
const choiceName = (card) => card.names !== undefined ? (card.names.length > 1 ? card.names.join("") : card.name) : card.name;
const setAlias = (setName) => {
  switch (setName) {
    case 'CON':
      return 'CFX';
  }
  return setName;
}
const simplifiedCards = (setName) => R.map(x => ({ multiverseid : x.multiverseId , name : choiceName(x), set : setName}))
const trackCountedCard = (countedCard, name) => countedCard[name] ? 
    [`${name}${countedCard[name]}`, {...countedCard, [name]: countedCard[name] + 1 } ]
    : [name, countedCard];

// Helper
const wizardsUrl = (id) => `https://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=${id}&type=card`;
const reduceIndexed = R.addIndex(R.reduce);

// Impure Download
const downloadImpure = (log)  => (filename, setDirectory, url) => {
  const fullFileName = `./${setDirectory}/${filename}`;
  log(filename, setDirectory, url);
  !fs.existsSync(setDirectory) && fs.mkdirSync(setDirectory);

  if (fs.existsSync(fullFileName)) {
    log(`Skip ${fullFileName}`)
  } else {
    http.get(url, function(response) {
      response.pipe(fs.createWriteStream(fullFileName));
    });
  }
}
const delayQueueN = (callback, time, n) => {
  setTimeout(callback, time * n)
}
const dlFromWizardH = (downloadImpure) => 
  (name, directory, multiverseid) => downloadImpure(`${name}.full.jpg`, directory, wizardsUrl(multiverseid));

const dlFromWizard = dlFromWizardH(downloadImpure(console.log));

const dlCardReducer = (countedCard, card, i) => {
  try {
    const [name, nextCountedCard] = trackCountedCard(countedCard, card.name);
    delayQueueN(() => dlFromWizard(name, card.set, card.multiverseid), 2000, i);
    return nextCountedCard;
  } catch (e) {
    console.log(card,i, countedCard, e);
  }
  return countedCard;
}


const dlCards = reduceIndexed(dlCardReducer, {
  Forest : 1,
  Mountain : 1,
  Swamp : 1,
  Plains : 1,
  Island : 1
});
var setName = process.argv[2];
var set = sets[setName] || sets;

console.log(set.cards.length);
R.pipe(simplifiedCards(setAlias(setName)), dlCards)(set.cards);