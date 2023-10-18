function mulToNeg(tree) {
    var tree_1 = JSON.parse(JSON.stringify(tree));  
    if (Array.isArray(tree_1)) {
        var operator = tree_1.shift();
       
        var newOperand = []; 
        if (operator === 'mulchain' && tree_1[0][0] === 'mul' && tree_1[0][1][0] == 'negative') {
            operator = 'negative';
            newOperand.push('mulchain');
            
            for (var [k, mterm] of tree_1.entries()) {
                if (k === 0) {
                    newOperand.push([mterm[0], mterm[1][1]]);
                } else {
                    newOperand.push(mterm); 
                }
            }
            
            newOperand = [newOperand];
        } else {
            for (var v of tree_1) {
                newOperand.push(mulToNeg(v));
            }
        }
        
        tree_1 = [operator].concat(newOperand);
    }

    return tree_1;
}
/*
import {LatexToTree, is_equal_tree} from '../checkmath.js';
var func = mulToNeg;
var latex1 = '-5\\cdot 2';
var latex2 = '\\left(-5\\right)\\cdot 2';
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