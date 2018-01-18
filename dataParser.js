const codeMap = { ALL: 'AL',
ATQ: 'AQ',
APC: 'AP',
ARN: 'AN',
CHR: 'CH',
'6ED': '6E',
CSP: 'CS',
DST: 'DS',
'8ED': '8E',
EXO: 'EX',
FEM: 'FE',
'5DN': 'FD',
'5ED': '5E',
'4ED': '4E',
GPT: 'GP',
HML: 'HL',
ICE: 'IA',
INV: 'IN',
JUD: 'JU',
LEG: 'LG',
LGN: 'LE',
LEA: 'A',
LEB: 'B',
MMQ: 'MM',
MIR: 'MI',
MRD: 'MR',
NMS: 'NE',
'9ED': '9E',
ODY: 'OD',
ONS: 'ON',
PLS: 'PS',
PO2: 'P2',
PTK: 'P3',
POR: 'PT',
PCY: 'PY',
'3ED': 'R',
SCG: 'SC',
'7ED': '7E',
S99: 'ST',
S00: 'S2K',
STH: 'SH',
TMP: 'TE',
DRK: 'DK',
TOR: 'TO',
UGL: 'UG',
UNH: 'UH',
'2ED': 'U',
UDS: 'UD',
ULG: 'UL',
USG: 'US',
VIS: 'VI',
WTH: 'WL' };

let mtgJsonCardsToDlList = (cards, set) => {
    let nbrCards = cards.length,
        // tempCard as format :
        // {
        //   "Card Name" : [mutiverseId, ...]
        // }
        tempCard = {};

    // Populate tempCard
    for (let i = 0; i < nbrCards; i++) {
        let card = cards[i],
            cardName = card.name;
        
        // Clean name
        cardName = cardName.replace(/\"/g, '');
        cardName = cardName.replace(/:/g, '');
        cardName = cardName.replace('\/\/', '');
        //
        if (cardName in tempCard) {
            tempCard[cardName].push(card.multiverseid)
        } else {
            tempCard[cardName] = [card.multiverseid];
        }
    }

    // Transform
    let result = [],
        keys = Object.keys(tempCard),
        nbrKeys = keys.length;

    for (let i = 0; i < nbrKeys; i++) {
        let cardName = keys[i],
            card = tempCard[cardName];

        if (card.length > 1) {
            for (let j = 0; j < card.length; j++) {
                result.push({name : `${cardName}${j + 1}.full.jpg`, multiverseid : card[j], set : codeMap[set] || set});
            }
        } else {
            result.push({name : `${cardName}.full.jpg`, multiverseid : card[0], set : codeMap[set] || set});
        }
    }

    return result;
};

exports.mtgJsonCardsToDlList = mtgJsonCardsToDlList;