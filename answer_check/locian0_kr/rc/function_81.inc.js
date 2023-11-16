
import {addNegative} from '../rc/function_71.inc.js';
import _ from 'lodash';

export function addFactorNegative(tree) {
    if (!Array.isArray(tree)) {
        return tree;
    }
    var tree_1 = _.cloneDeep(tree);

    var operator = tree_1.shift();
    var sign = 1;
    var newOperand = [];
    if (operator === 'negative') {
        newOperand.push(addFactorNegative(tree_1[0]));
        if (newOperand[0][0] === 'negative') {
            operator = newOperand[0][1].shift();
            newOperand = newOperand[0][1];
        }            
    } else if (operator === 'mulchain') {
        var termArr = [];
        var factArr = [];
        for (var term of tree_1) {
            if (term[0] === 'mul') {
                if (term[1][0] === 'addchain') {
                    var addchain = term[1];
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

        for (var term of termArr) {
            newOperand.push(term);
        }
        for (var term of factArr) {
            newOperand.push(term);
        }
    } else if (operator === 'addchain') {
        var addchain = ['addchain'].concat(tree_1);
        if (addchain[1][0] === 'sub') {
            addchain = addNegative(['negative', addchain]);
            sign = -1 * sign;
        }
        newOperand = addchain.slice(1);            
    } else {
        for (var v of tree_1) {
            newOperand.push(addFactorNegative(v));
        }
    }
    
    if (sign === -1) {
        newOperand = [[operator].concat(newOperand)];
        operator = 'negative';
    }
    tree_1 = [operator].concat(newOperand);
    
    return tree_1;
}

