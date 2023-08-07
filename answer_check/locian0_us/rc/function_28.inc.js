import {flipOp} from '../rc/function_135.inc.js';

export function addNegative(tree) {
    var tree_1 = JSON.parse(JSON.stringify(tree));
    if (Array.isArray(tree_1)) {
        var operator = tree_1.shift();

        var newOperand = [];
        if (operator === 'negative' && tree_1.length == 1) {
            var addchain = addNegative(tree_1[0]);
            if (addchain[0] === 'addchain') {
                operator = addchain.shift();
                for (var addterm of addchain) {
                    newOperand.push(flipOp(addterm));
                }
            } else if (addchain[0] === 'negative') {
                // Negative of negative, so just remove the double negative and return
                return addchain[1];
            } else {
                newOperand = tree_1;
            }
            
        } else if (operator === 'addchain') {
            for (var addterm of tree_1) {
                var addop = addterm[0];
                // Propagate subtraction to nodes in addterm[1]
                var subtree;
                if (addop === 'sub') {
                    addop = 'add';
                    subtree = addNegative(['negative', addterm[1]]);
                } else {
                    subtree = addNegative(addterm[1]);
                }
                // Update newOperand with new additive terms
                if (subtree[0] === 'addchain') {
                    newOperand = newOperand.concat(subtree.slice(1));
                } else {
                    var newterm = [addop, subtree];
                    if (subtree[0] === 'negative')
                        newterm = flipOp([addop, subtree[1]]);
                    newOperand.push(newterm);
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
import {LatexToTree, is_equal_tree} from '../checkmath.js';
var func = addNegative;
var latex1 = '-x+a';
var latex2 = '-(x-a)';
var tree1 = LatexToTree(latex1);
var tree2 = LatexToTree(latex2);
var tree11 = func(tree1);
var tree21 = func(tree2);
console.log(is_equal_tree(tree11, tree21));
console.log(JSON.stringify(tree11, null, 4));
console.log(JSON.stringify(tree21, null, 4));
*/