'use strict';
const R = require('ramda');
const goldBank = 5000;
const winPercent = 30;
const nOfSimulation = 10000;
const initialState = {
    win: 0, 
    loose: 0, 
    games: 0, 
    spendGold: 0,
    earnGold: 0
};
const TOTAL_UNCOMMUN = 363;
const TOTAL_RARE = 253;


const winTableMomir = {
    rules: { loose : 2, win : 5, eventPrice: 250},
    0: {gold : 50, icrs: [15, 1]},
    1: {gold : 100, icrs: [20, 5]},
    2: {gold : 150, icrs: [25, 10]},
    3: {gold : 200, icrs: [35, 15]},
    4: {gold : 250, icrs: [100, 15]},
    5: {gold : 300, icrs: [100, 15]}
};
const winTableConstructed = {
    rules: { loose : 3, win : 7},
    0: {gold : 100, icrs: [5, 1, 1]},
    1: {gold : 200, icrs: [5, 1, 1]},
    2: {gold : 300, icrs: [5, 1, 1]},
    3: {gold : 400, icrs: [5, 1, 1]},
    4: {gold : 500, icrs: [5, 1, 1]},
    5: {gold : 600, icrs: [100, 5, 1]},
    6: {gold : 800, icrs: [100, 100, 5]},
    7: {gold : 1000, icrs: [100, 100, 5]}
};

const rankedDraft = {
    rules: { loose : 3, win : 7, eventPrice: 5000},
    0: {gold : 0, gems : 50, packs: 1.20},
    1: {gold : 0, gems : 100, packs: 1.22},
    2: {gold : 0, gems : 200, packs: 1.24},
    3: {gold : 0, gems : 300, packs: 1.26},
    4: {gold : 0, gems : 450, packs: 1.30},
    5: {gold : 0, gems : 650, packs: 1.35},
    6: {gold : 0, gems : 850, packs: 1.40},
    7: {gold : 0, gems : 950, packs: 2}
}
const winTable = winTableMomir;

const isRandomWinH = (percent) => () => Math.random() < percent / 100;
const isRandomWin = isRandomWinH(winPercent);
const playMatch = (state) => isRandomWin() ? 
    {games: state.games + 1, loose: state.loose, win: state.win + 1} : 
    {games: state.games + 1, win: state.win, loose: state.loose + 1}

const participateEventH = R.curry((playMatch, winTable, state) => {
    const isEnd = (state) => state.loose === winTable.rules.loose || state.win === winTable.rules.win;
    const eventResult = R.until(isEnd, playMatch)(state);
    return {...winTable[eventResult.win], games : eventResult.games};
})
const participateEvent = participateEventH(playMatch, winTable);

const participateUntil3400Gems = (state) => {
    if (state.gems >= 3400) return state;
    const event = participateEvent(initialState);
    const nextState = {
        participation: (state.participation || 0) + 1,
        gems: (state.gems || 0) + event.gems, 
        packs: (state.packs || 0) + event.packs
    };
    return participateUntil3400Gems(nextState)
}
/*
const N = 10000;
const participateNTimes = R.times(() => participateUntil3400Gems({gems: 3100, packs: 0}), N);
const result = R.reduce(
    (acc, val) => {
        return {
            participation: (acc.participation || 0) + val.participation,
            gems : (acc.gems || 0) + val.gems,
            packs : (acc.packs || 0) + val.packs
        }
    },
    { participation: 0, gems: 0, packs: 0 },
    participateNTimes);
console.log({ 
    participation: result.participation / N,
    gems: result.gems / N,
    packs: result.packs / N
});
*/
const participateUntilNoGold = (state, eventPrice) => {
    if (state.gold - eventPrice < 0) return state;
    const event = participateEvent(initialState);
    const nextState = {
        gold: state.gold - eventPrice + event.gold, 
        earnGold: state.earnGold + event.gold,
        spendGold: state.spendGold + eventPrice,
        result : [...state.result, event],
        games: state.games + event.games
    };
    return participateUntilNoGold(nextState, eventPrice);
}

const participateUntil900VaultPoint = (state, eventPrice) => {
    const computed = computeParticipationtResult(state.result)
    if (computed.r > TOTAL_RARE) return state;
    const event = participateEvent(initialState);
    const nextState = {
        gold: state.gold - eventPrice + event.gold, 
        earnGold: state.earnGold + event.gold,
        spendGold: state.spendGold + eventPrice,
        result : [...state.result, event],
        games: state.games + event.games
    };
    return participateUntil900VaultPoint(nextState, eventPrice);
}

const randCard = R.reduce((acc, val) => {
    const x = Math.random() < val / 100 ? {u: 0, r: 1} :  {u: 1, r: 0};
    return {u: acc.u + x.u, r: acc.r + x.r};
}, {u: 0,r: 0});

const iterator = (acc, value) => {
    const x = value.icrs ? randCard(value.icrs) : {u: 0, r: 0, gold: acc.gold + value.gold };
    return {u : acc.u + x.u, r : acc.r + x.r, gold: acc.gold + value.gold }
}
const computeParticipationtResult = R.reduce(iterator, {u: 0, r: 0, gold: 0});


const run = (nOfSimulation, winTable, goldBank, participateUntil) => {
    const simulations = R.times(() =>  participateUntil({
        gold: goldBank, 
        result : [], 
        games: 0,
        spendGold: 0,
        earnGold: 0
    }, winTable.rules.eventPrice), nOfSimulation);
    
    const result = R.reduce((acc, value) => {
        const c = computeParticipationtResult(value.result);
        return {
            spendGold: acc.spendGold + value.spendGold,
            earnGold: acc.earnGold + value.earnGold,
            games: acc.games + value.games, 
            n : acc.n + 1, 
            u: acc.u + c.u, 
            r: acc.r + c.r
        };
    }, {n: 0, u: 0, r: 0, games: 0, spendGold: 0, earnGold: 0}, simulations);
    
    const x = {
        nOfSimulation : result.n,
        startingGolds: goldBank, 
        spendGold : result.spendGold / result.n,
        earnGold : result.earnGold / result.n,
        games: result.games / result.n, 
        unco : result.u / result.n, 
        rare : result.r / result.n,
        winPercent
    }
    console.log({...x, diff: x.earnGold - x.spendGold});
}

exports.run = run;
run(nOfSimulation, winTable, goldBank, participateUntilNoGold);
