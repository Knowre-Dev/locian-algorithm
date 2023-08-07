

export function addAdjacentSigns(tree) {
    var tree_1 = JSON.parse(JSON.stringify(tree));
    if (Array.isArray(tree_1)) {
        var operator = tree_1.shift();
        
        var sign = 1;
        var newOperand = [];
        /*
        if (operator === 'negative') {
            newOperand[] = addAdjacentSigns(tree[0]);
            if (newOperand[0][0] === 'negative') {
                operator = array_shift(newOperand[0][1]);
                newOperand = newOperand[0][1];
            }
        } else
        */ 
        if (operator === 'addchain') {
            for (var term of tree_1) {             
                var nterm = addAdjacentSigns(term[1]);
                if (nterm[0] === 'negative') {
                    if (term[0] === 'add') {
                        newOperand.push(['sub', nterm[1]]);
                    } else if (term[0] === 'sub') {
                        newOperand.push(['add', nterm[1]]);
                    } else {
                        newOperand.push([term[0], nterm[1]]);
                    }
                } else {
                    newOperand.push([term[0], nterm]);
                }
            }
        } else {
            for (var v of tree_1) {
                newOperand.push(addAdjacentSigns(v));
            }
        }
        if (sign === -1) {
            newOperand = [[operator].concat(newOperand)];
            operator = 'negative';
        }
        tree_1 = [operator].concat(newOperand);
    }
    return tree_1;
}

/*
import {LatexToTree, is_equal_tree} from '../checkmath.js';
var func = addAdjacentSigns;
var latex1 = 'x-2';
var latex2 = 'x-+2';
var tree1 = LatexToTree(latex1);
var tree2 = LatexToTree(latex2);
var tree11 = func(tree1);
var tree21 = func(tree2);
console.log(is_equal_tree(tree11, tree21));
console.log(JSON.stringify(tree11, null, 4));
console.log(JSON.stringify(tree21, null, 4));
*/