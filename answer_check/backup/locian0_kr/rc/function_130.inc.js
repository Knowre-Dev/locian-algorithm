import {addCommutative} from '../rc/function_47.inc.js';
import {addFactorNegative} from '../rc/function_81.inc.js';
import {addAdjacentSigns} from '../rc/function_83.inc.js';

export function sub_addFactorNegative(tree = null) {
    var tree_1 = JSON.parse(JSON.stringify(tree));
    if (Array.isArray(tree_1)){
        var operator = tree_1.shift();        
        if (operator === 'addchain') {
            var newOperand = [];
            for (var [k, t] of tree_1.entries()) {
                var t = addCommutative(t);
                newOperand.push(addFactorNegative(t));
            }        
            
            tree_1 = ['addchain'].concat(newOperand);
            tree_1 = addAdjacentSigns(tree_1);
            tree_1 = addFactorNegative(tree_1);
        } else if (operator == 'equation') {
            var newOperand = [];
            for (var [k, v] of tree_1.entries()){
                newOperand.push(sub_addFactorNegative(v));
            }
            tree_1 = ['equation'].concat(newOperand);
            //tree = addAdjacentSigns(tree);
            //tree = addFactorNegative(tree);
        } else if (operator == 'inequality') {
            var newOperand = [];
            for (var [k, v] of tree_1.entries()) {
                newOperand.push(sub_addFactorNegative(v));
            }
            tree_1 = ['inequality'].concat(newOperand);
        } else {
            var arr = [operator].concat(tree_1);
            tree_1 = addFactorNegative(arr);
        }
        
    }
    
    return tree_1;
}

