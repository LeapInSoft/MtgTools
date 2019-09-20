const set = require('./m20.json');
const stats = require('./data/m20-draft-stat.json')
const R = require('ramda');

// usage: joinRight(R.prop('id'), R.prop('buyer'), people, transactions)
// result:
// [{ buyer: 1, seller: 10, id: 1, name: 'me' },
//  { buyer: 2, seller: 5 }]
const joinRight = R.curry((mapper1, mapper2, t1, t2) => {
    let indexed = R.indexBy(mapper1, t1);
    return t2.map((t2row) => R.merge(t2row, indexed[mapper2(t2row)]));
});


// usage: joinInner(R.prop('id'), R.prop('buyer'), people, transactions)
// result:
// [{ buyer: 1, seller: 10, id: 1, name: 'me' }]
const joinInner = R.curry((f1, f2, t1, t2) => {
    let indexed = R.indexBy(f1, t1);
    return R.chain((t2row) => {
        let corresponding = indexed[f2(t2row)];
        return corresponding ? [R.merge(t2row, corresponding)] : [];
    }, t2);
});

// Create a pool of card

// Select cards
(function(set) {
    const schema = [
        'name', 'manaCost', 'convertedManaCost',
        'type', 'rarity', 'flavorText'
    ];
    const joinByName = (cards) => R.map((card) => {
        const [num, name] = card.split('.');
        
        const cardResult = R.find(R.propEq('name', name.trim()), cards);
        return cardResult ? {...R.pick(schema, cardResult), num} : card;
    })
    const xx = (tier) => ({...tier, cards : joinByName(set.cards)(tier.cards)})
    fs.writeFileSync('./result.json', JSON.stringify(R.map(xx ,stats2)))
})(std["WAR"])


////////////////// Util
const booster = [
    [ 'rare', 'mythic rare' ],
    'uncommon',
    'uncommon',
    'uncommon',
    'common',
    'common',
    'common',
    'common',
    'common',
    'common',
    'common',
    'common',
    'common',
    'common',
    'land',
    'token'
  ];

const impureSample = R.curry((random, list) => {
    const len = list.length;
    const idx = Math.floor(random() * len);
    return list[idx];
})
const sample = impureSample(Math.random);
const propIncludes = R.curry((name, val, obj) => R.includes(R.prop(name, obj), val))
const createBooster3 = (set) => {
    const boosterSchema = set.boosterV3;
    return boosterSchema.map((rarity) => {
        const landFilter = R.filter(R.propEq('type'), 'land');
        const rarityFilter = R.ifElse(Array.isArray(rarity), R.filter(propIncludes('rarity', rarity)), R.filter(R.propEq('rarity', rarity)));
        const filter = R.cond([
            [R.equals('land'), landFilter],
            [R.T, rarityFilter]
        ])(rarity);
        return sample(filter(set.cards));
    })
};

console.log(createBooster(set))