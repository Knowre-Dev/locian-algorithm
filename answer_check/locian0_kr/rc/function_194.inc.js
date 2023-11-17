import _ from 'lodash';

export function mulToExp(tree = null) {
    if (!Array.isArray(tree)) {
        return tree;
    }
    let tree_1 = _.cloneDeep(tree);
    let operator = tree_1.shift();
    let newOperand = [];
    if (operator === 'mulchain') {
        let power = new Object();
        let varNum = [];
        for (let term of tree_1) {
            if (term[0] === 'mul') {
                if (term[1][0] === 'variable') {
                    if (!power.hasOwnProperty(term[1][1])) {
                        power[term[1][1]] = [];
                    }
                    power[term[1][1]].push(term[1]); 
                } else if (term[1][0] === 'power' && term[1][1][0] === 'variable') {
                    varNum.push(term);
                } else {
                    varNum.push(term);
                }
            } else {
                varNum.push(term);
            }
        }
        for (let v of Object.values(power)) {
            if (v.length > 1){
                varNum.push(['mul', ['power', v[0], ['natural', (v.length).toString()]]]);
            } else {
                varNum.push(['mul', v[0]]);
            }           
        }
        if (varNum.length === 1) {
            operator = varNum[0][1].shift();
            newOperand = varNum[0][1];
        } else {
            newOperand = varNum;
        }
    } else {
        for (let v of tree_1) {
            newOperand.push(mulToExp(v));
        }
    }
    return [operator].concat(newOperand);
    
    
}


