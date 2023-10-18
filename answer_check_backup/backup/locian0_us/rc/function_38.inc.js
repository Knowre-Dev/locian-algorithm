import {addNegative} from '../rc/function_28.inc.js';

export function addFactorNegative(tree) {
    var tree_1 = JSON.parse(JSON.stringify(tree));
    if (Array.isArray(tree_1)) { //print_r(tree); echo "<br />";echo "<br />";
        var operator = tree_1.shift();

        var sign = 1;
        var newOperand = [];
        if (operator === 'negative') {
            newOperand.push(addFactorNegative(tree_1[0]));
            if (newOperand[0][0] === 'negative') {
                operator = newOperand[0][1].shift();
                newOperand = newOperand[0][1];
            }            
        } else if (operator === 'mulchain') {
            var addchain;
            for (var term of tree_1) {
                if (term[0] === 'mul') {
                    if (term[1][0] === 'addchain') {
                        addchain = term[1];
                        if (addchain[1][0] === 'sub') {
                            addchain = addNegative(['negative', addchain]);
                            sign = -1 * sign;
                        }
                        newOperand.push(['mul', addchain]);
                    } else {
                        // (-(-2+x))*5 === (2-x)*5
                        if (term[1][0] === 'negative' && 
                            term[1][1][0] === 'addchain' &&
                            term[1][1][1][0] === 'sub') { // ahjin, new
                            addchain = term[1][1];
                            addchain = addNegative(['negative', addchain]);
                            term = [term[0], addchain];
                        } else if (term[1][0] === 'negative') { // original 
                            term = [term[0], term[1][1]];
                            sign = -1 * sign;
                        }
                        newOperand.push(term);
                    }
                } else {
                    newOperand.push(term);
                }
            }
            if (addchain == null) {
                newOperand = tree_1; // if there is no addchain to factor, revert to original
                sign = 1;
            }
        } else if (operator === 'addchain') {
            addchain = ['addchain'].concat(tree_1);
            if (addchain[1][0] === 'sub') {
                addchain = addNegative(['negative', addchain]);
                sign = -1 * sign;
            }
            newOperand = addchain.slice(1);
        } else {
            for (var v of tree_1) {
                newOperand.push(addFactorNegative(v));
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
var func = addFactorNegative;
var latex1 = '-(-2)(x+y)';
var latex2 = '2(x+y)';
var tree1 = LatexToTree(latex1);
var tree2 = LatexToTree(latex2);
var tree11 = func(tree1);
var tree21 = func(tree2);
console.log(is_equal_tree(tree11, tree21));
console.log(JSON.stringify(tree11, null, 4));
console.log(JSON.stringify(tree21, null, 4));
*/