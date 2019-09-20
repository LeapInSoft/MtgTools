import * as _ from './mtg-lib/stat';
import * as R from 'ramda';

const winTableMomir = {
    rules: { loose : 2, win : 5, eventPrice: 250},
    0: {gold : 50, icrs: [15, 1]},
    1: {gold : 100, icrs: [20, 5]},
    2: {gold : 150, icrs: [25, 10]},
    3: {gold : 200, icrs: [35, 15]},
    4: {gold : 250, icrs: [100, 15]},
    5: {gold : 300, icrs: [100, 15]}
};

const participateMomir = _.participateEvent(R.__, winTableMomir);
const participateWithWinrate = R.pipe(_.isRandomWin, _.playMatch, participateMomir);
console.log(participateWithWinrate(50));