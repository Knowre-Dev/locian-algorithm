//
import {addNegative} from '../rc/function_71.inc.js';
import {addFactor_1} from '../rc/function_128.inc.js';
import _ from 'lodash';

export function addFactoredForm(tree) {
    if (!Array.isArray(tree)) {
        return tree;
    }
    
    let operator = tree[0];
    let tree_1 = tree.slice(1);
    let sign = 1; 
    let newOperand = [];
    if (operator === 'negative') {
        newOperand.push(addFactoredForm(tree_1[0]));
        if (newOperand[0][0] === 'negative') {
            operator = newOperand[0][1].shift();
            newOperand = newOperand[0][1];
        }
    } else if (operator === 'mulchain') {
        let termArr = [];
        let consArr = [];
        let factArr = [];
        let add = false;
        for (let [kt, term] of tree_1.entries()) {
            if (term[0] === 'mul') {
                if (term[1][0] === 'addchain') {
                    let fact = addFactor_1(term[1]);
                    let addchain;
                    if (fact[0] === 'mulchain') {
                        consArr.push(fact[1]);
                        addchain = fact[2][1];
                    } else if (fact[0] === 'addchain') {
                        addchain = fact;
                    }
                    if (addchain[1][0] === 'sub') {
                        addchain = addNegative(['negative', addchain]);
                        sign = -1*sign;
                    }
                    factArr.push(['mul', addchain]);
                    add = true;
                } else if (term[1][0] === 'natural' && kt === 0) {
                    consArr.push(term);
                } else {
                    termArr.push(term);
                }
            } else {
                termArr.push(term);
            }
        }

        if (add === false) {
            newOperand = tree_1;
            tree_1 = [operator].concat(newOperand);
        } else {
            let val = 1;
            for (let term of consArr) {
                val = val * parseInt(term[1][1]);
            }
            let con = ['mul', ['natural', val.toString()]];
            
            if (val !== 1) {
                newOperand.push(con);
            }
            for (let term of termArr) {
                newOperand.push(term);
            }
            for (let term of factArr) {
                newOperand.push(term);
            }
        }  
    } else if (operator === 'addchain') {
        let fact = addFactor_1(['addchain'].concat(tree_1));
        let con;
        let addchain;
        if (fact[0] === 'mulchain') {
            con = fact[1];
            addchain = fact[2][1];
        } else {
            addchain = fact;
        }
        if (addchain[1][0] === 'sub') {
            addchain = addNegative(['negative', addchain]);
            sign = -1 * sign;
        }
        if (fact[0] === 'mulchain') {
            operator = 'mulchain';
            newOperand.push(con);
            newOperand.push(['mul', addchain]);
        } else {
            newOperand = addchain.slice(1);
        }
    } else {
        for (let v of tree_1) {
            newOperand.push(addFactoredForm(v));
        }
    }
    
    if (sign === -1) {
        newOperand = [[operator].concat(newOperand)];
        operator = 'negative';
    }
    return [operator].concat(newOperand);
    
    
}


