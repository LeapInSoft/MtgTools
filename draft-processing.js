const set = require('./ELD.json');
const rating = require('./ignore_data/ELD-draft.json')
const fs = require('fs');

const iCards = (tier) => (acc, val) => {
    const card = set.cards.find(x => x.name == val.name);
    if (card === undefined) {
        console.log(`Not found ${val.name}`);
        return acc;
    }
    const temp = {
        colors: card.colors,
        name: card.name,
        rarity: card.rarity,
        type: card.type,
        manaCost: card.manaCost,
        text: card.text,
        score: val.score,
        tier: tier
    }
    return [...acc, temp];
};

const proceded = rating.reduce((acc, val) => {
    const cards = val.cards.reduce(iCards(val.title), []);
    return [...acc, ...cards];
}, []);


fs.writeFileSync('./result.json', JSON.stringify(proceded));