const R = require('ramda');
const goldBank = 5000;
const winPercent = 40;
const eventPrice = 250;
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
    rules: { loose : 2, win : 5},
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

const winTable = winTableConstructed;

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
console.log(participateEvent(initialState))
/*
const participateUntilNoGold = (state, eventPrice) => {
    if (state.gold - eventPrice <= 0) return state;
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
    const x = randCard(value.icrs);
    return {u : acc.u + x.u, r : acc.r + x.r, gold: acc.gold + value.gold }
}
const computeParticipationtResult = R.reduce(iterator, {u: 0, r: 0, gold: 0});


const simulations = R.times(() =>  participateUntilNoGold({
    gold: goldBank, 
    result : [], 
    games: 0,
    spendGold: 0,
    earnGold: 0
}, eventPrice), 1000);

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
    spendGold : result.spendGold / result.n,
    earnGold : result.earnGold / result.n,
    games: result.games / result.n, 
    unco : result.u / result.n, 
    rare : result.r / result.n
}
console.log({...x, diff: x.earnGold - x.spendGold});*/