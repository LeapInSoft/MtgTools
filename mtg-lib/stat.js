import * as R from 'ramda';
export const EVENT_INITIAL_STATE = {
    win: 0, 
    loose: 0, 
    games: 0, 
    spendGold: 0,
    earnGold: 0
};

export const isRandomWin = (percent) => () => Math.random() < percent / 100;


export const playMatch = R.curry((isWin, state) => isWin() ? 
    {games: state.games + 1, loose: state.loose, win: state.win + 1} : 
    {games: state.games + 1, win: state.win, loose: state.loose + 1});

// participateEvent :: Function -> object -> object
export const participateEvent = R.curry((playMatch, winTable) => {
    const isEnd = (state) => state.loose === winTable.rules.loose || state.win === winTable.rules.win;
    const eventResult = R.until(isEnd, playMatch)(EVENT_INITIAL_STATE);
    return {...winTable[eventResult.win], eventResult};
});

const participateUntil = (pred, participateEvent) => {
    R.until(pred, participateEvent)
    const event = participateEvent(initialState);
    pred()
    /*const nextState = {
        gold: state.gold - eventPrice + event.gold, 
        earnGold: state.earnGold + event.gold,
        spendGold: state.spendGold + eventPrice,
        result : [...state.result, event],
        games: state.games + event.games
    };*/
}