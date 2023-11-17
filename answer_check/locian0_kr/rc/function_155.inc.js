import {termExists} from '../rc/function_152.inc.js';
import _ from 'lodash';

export function makeOneSideOfEqIneqZero(tree = null) {
    if (!Array.isArray(tree)) {
        return tree;
    }
    let tree_1 = _.cloneDeep(tree);
    let operator = tree_1.shift();
    let newOperand = [];
    if (operator === 'equation') {
        for (let subtree of tree_1) {
            if (JSON.stringify(subtree) === JSON.stringify(['natural', '0'])) {
                return [operator].concat(tree_1);
            }
        }
        // From here on, we are guaranteed that
        // no side in the chain of equalities is already identically zero
        
        let term = ['sub', tree_1[0]];
        for (let [k, v] of tree_1.entries()) {
            let temp;
            if (k === 0) {
                temp = ['natural', '0'];
            } else {
                temp = v;
                if (v[0] !== 'addchain') {
                    temp = ['addchain', ['add', v]];
                }
                temp.push(term);
            }
            newOperand.push(temp);
        }
        
    } else if (operator === 'inequality') {
        for (let subtree of tree_1) {
            if (JSON.stringify(subtree) === JSON.stringify(['natural', '0']))
                return [operator].concat(tree_1);
        }
        // From here on, we are guaranteed that
        // no side in the chain of inequalities is already identically zero
        
        let term = ['sub', tree_1[0]];
        for (let [k, v] of tree_1.entries()) {
            let temp;
            if (k === 0) {
                temp = ['natural', '0'];
            } else {
                temp = v;
                if (!['lt', 'le', 'ge', 'gt'].includes(v) &&
                    !termExists('infinity', v)) {
                    if (v[0] !== 'addchain') {
                        temp = ['addchain', ['add', v]];
                    }
                    temp.push(term);
                }
            }
            newOperand.push(temp);
        }
        
    } else {
        newOperand = tree_1;
    }
    return [operator].concat(newOperand);
    
    
    // NOTE: This function does not distribute the minus sign
    //     Use addNegative() right after this function to perform that transformation
    
    
}

