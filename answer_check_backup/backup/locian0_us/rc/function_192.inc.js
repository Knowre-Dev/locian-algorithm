

export function reWrtLogWithBase(tree = null) {
    var tree_1 = JSON.parse(JSON.stringify(tree));  
    if (Array.isArray(tree_1)) {
        var operator = tree_1.shift();
    
        var newOperand = [];
        if (operator === 'log' && tree_1.length === 1) { 
            newOperand.push(tree_1[0]);  
            newOperand.push(['natural', '10']);
        } else if (operator === 'ln' && tree_1.length === 1) {
            operator = 'log';
            newOperand.push(tree_1[0]);
            newOperand.push(['variable', 'e']);
        } else {
            for (var v of tree_1) {
                newOperand.push(reWrtLogWithBase(v));
            }
        }
        tree_1 = [operator].concat(newOperand);
    }
   
    return tree_1;
}


/*
import {LatexToTree, is_equal_tree} from '../checkmath.js';
var func = reWrtLogWithBase;
var latex1 = '\\log_{2}{8}=3';
var latex2 = '\\log_{2}{16}=4';
var tree1 = LatexToTree(latex1);
console.log('+++++++++++++');
console.log(JSON.stringify(tree1, null, 4));
console.log('+++++++++++++');
var tree2 = LatexToTree(latex2);
console.log(JSON.stringify(tree2, null, 4));
var tree11 = func(tree1);
var tree21 = func(tree2);
console.log(is_equal_tree(tree11, tree21));
console.log('>>>>>>>>>>>>>>');
console.log(JSON.stringify(tree11, null, 4));
console.log('>>>>>>>>>>>>>>');
console.log(JSON.stringify(tree21, null, 4));
*/