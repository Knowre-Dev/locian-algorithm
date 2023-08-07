import {addNegative} from '../rc/function_71.inc.js';

export function addNegaToSub(tree = null) {
    var tree_1 = JSON.parse(JSON.stringify(tree));
    if (Array.isArray(tree_1)) {
        var operator = tree_1.shift();
        var newOperand = [];
        if (operator === 'addchain') {
            for (var [k, v] of tree_1.entries()) {
                
                if (k == 0) {
                    if (v[0] == 'add' && v[1][0] == 'negative') {
                        newOperand.push(['sub', v[1][1]]);
                    } else if (v[0] == 'add' && v[1][0] == 'positive') {
                        newOperand.push(['add', v[1][1]]);
                    } else {
                        newOperand.push(v);
                    }
                } else {                
                    newOperand.push(v);
                }
            }
        } else {
            for (var v of tree_1) {
                newOperand.push(addNegative(v));
            }
        }
        tree_1 = [operator].concat(newOperand);
    }
    
    return tree_1;
}

/*
import {LatexToTree, match_all} from '../checkmath.js';
var latex_1 = '(+2)+2';
var latex_2 = '+2+2';
var tree1 = addNegaToSub(LatexToTree(latex_1));
var tree2 = addNegaToSub(LatexToTree(latex_2));
var result1 = JSON.stringify(tree1, null, 4);
var result2 = JSON.stringify(tree2, null, 4);
console.log(result1 == result2);
console.log(JSON.stringify(tree1, null, 4));
console.log(JSON.stringify(tree2, null, 4));
*/