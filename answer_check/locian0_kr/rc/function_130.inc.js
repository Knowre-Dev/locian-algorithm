import {addCommutative} from '../rc/function_47.inc.js';
import {addFactorNegative} from '../rc/function_81.inc.js';
import {addAdjacentSigns} from '../rc/function_83.inc.js';
import _ from 'lodash';


export function sub_addFactorNegative(tree = null) {
    if (!Array.isArray(tree)) {
        return tree;
    }
    
    let operator = tree[0];
    let tree_1 = tree.slice(1);    
    if (operator === 'addchain') {
        let newOperand = [];
        for (let t of tree_1) {
            t = addCommutative(t);
            newOperand.push(addFactorNegative(t));
        }        
        
        tree_1 = ['addchain'].concat(newOperand);
        tree_1 = addAdjacentSigns(tree_1);
        tree_1 = addFactorNegative(tree_1);
    } else if (operator === 'equation') {
        let newOperand = [];
        for (let v of tree_1) {
            newOperand.push(sub_addFactorNegative(v));
        }
        tree_1 = ['equation'].concat(newOperand);
    } else if (operator === 'inequality') {
        let newOperand = [];
        for (let v of tree_1) {
            newOperand.push(sub_addFactorNegative(v));
        }
        tree_1 = ['inequality'].concat(newOperand);
    } else {
        let arr = [operator].concat(tree_1);
        tree_1 = addFactorNegative(arr);
    }
    
    
    
    return tree_1;
}

