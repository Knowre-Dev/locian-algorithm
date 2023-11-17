
import {addNegative} from '../rc/function_71.inc.js';
import _ from 'lodash';

export function addFactorNegative(tree) {
    if (!Array.isArray(tree)) {
        return tree;
    }
    let tree_1 = _.cloneDeep(tree);

    let operator = tree_1.shift();
    let sign = 1;
    let newOperand = [];
    if (operator === 'negative') {
        newOperand.push(addFactorNegative(tree_1[0]));
        if (newOperand[0][0] === 'negative') {
            operator = newOperand[0][1].shift();
            newOperand = newOperand[0][1];
        }            
    } else if (operator === 'mulchain') {
        let termArr = [];
        let factArr = [];
        for (let term of tree_1) {
            if (term[0] === 'mul') {
                if (term[1][0] === 'addchain') {
                    let addchain = term[1];
                    if (addchain[1][0] === 'sub') {
                        addchain = addNegative(['negative', addchain]);
                        sign = -1 * sign;
                    }
                    factArr.push(['mul', addchain]);
                } else {
                    termArr.push(term);
                }
            } else {
                termArr.push(term);
            }
        }

        for (let term of termArr) {
            newOperand.push(term);
        }
        for (let term of factArr) {
            newOperand.push(term);
        }
    } else if (operator === 'addchain') {
        let addchain = ['addchain'].concat(tree_1);
        if (addchain[1][0] === 'sub') {
            addchain = addNegative(['negative', addchain]);
            sign = -1 * sign;
        }
        newOperand = addchain.slice(1);            
    } else {
        for (let v of tree_1) {
            newOperand.push(addFactorNegative(v));
        }
    }
    
    if (sign === -1) {
        newOperand = [[operator].concat(newOperand)];
        operator = 'negative';
    }
    return [operator].concat(newOperand);
    
    
}

