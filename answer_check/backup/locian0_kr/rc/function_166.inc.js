import {addAssociative} from '../rc/function_45.inc.js';

export function setAssociative(tree) {    
    var tree_1 = JSON.parse(JSON.stringify(tree));
    if (Array.isArray(tree_1)) {
        var operator = tree_1.shift();
        var newOperand = [];
        for (var v of tree_1) {
            var term = addAssociative(v);
            if (operator == term[0]) {
                term.shift();
                newOperand = newOperand.concat(term);
               
            } else {
                newOperand.push(term);
            }
        }
        tree_1 = [operator].concat(newOperand);
    }
    return tree_1;
}


