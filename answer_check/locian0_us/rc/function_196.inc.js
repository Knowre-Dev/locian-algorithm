function negToMul(tree) { 
    var tree_1 = JSON.parse(JSON.stringify(tree));
    if (Array.isArray(tree_1)) {
        var operator = tree_1.shift();       
        var newOperand = []; 
        if (operator === 'negative' && tree_1[0][0] === 'mulchain') {
            tree_1 = tree_1[0];
            operator = tree_1.shift();
            
            for (var [k, mterm] of tree_1.entries()) {
                if (k === 0) {
                    if (mterm[1][0] == 'mulchain') {
                        var nterm = negToMul(['negative', mterm[1]]);
                        newOperand.push([mterm[0], nterm]);
                    } else {
                        newOperand.push([mterm[0], ['negative', mterm[1]]]);
                    }
                } else {
                    newOperand.push(mterm);
                }
            }
        } else {
            for (var v of tree_1) {
                newOperand.push(negToMul(v));
            }
        }
        
        tree_1 = [operator].concat(newOperand);
    }
  
    return tree_1;
}
/*
import {LatexToTree, is_equal_tree} from '../checkmath.js';
var func = negToMul;
var latex1 = '-1\\left(-7\\right)\\cdot\\left(-2\\right)';
var latex2 = '\\left(-1\\right)\\left(-7\\right)\\cdot\\left(-2\\right)';
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