import {addNegative} from '../rc/function_28.inc.js';
import {addFactor} from '../rc/function_29.inc.js';


export function addFactoredForm(tree) {
    var tree_1 = JSON.parse(JSON.stringify(tree));
    if (Array.isArray(tree_1)) {
        var operator = tree_1.shift();

        var sign = 1; 
        var newOperand = [];
        if (operator === 'negative') {
            newOperand.push(addFactoredForm(tree_1[0]));
            if (newOperand[0][0] === 'negative') {
                operator = newOperand[0][1].shift();
                newOperand = newOperand[0][1];
            }
        } else if (operator === 'mulchain') {
            var termArr = [];
            var consArr = [];
            var factArr = [];
            for (var term of tree_1) {
                if (term[0] === 'mul') {
                    if (term[1][0] === 'addchain') {
                        fact = addFactor(term[1]);
                        if (fact[0] === 'mulchain') {
                            consArr.push(fact[1]);
                            addchain = fact[2][1];
                        } else if (fact[0] === 'addchain') {
                            addchain = fact;
                        }
                        if (addchain[1][0] === 'sub') {
                            addchain = addNegative(['negative', addchain]);
                            sign = -1*sign;
                        }
                        factArr.push(['mul', addchain]);
                    } else if (term[1][0] === 'natural') {
                        consArr.push(term);
                    } else {
                        termArr.push(term);
                    }
                } else {
                    termArr.push(term);
                }
            }

            var val = 1;
            for (var term of consArr) {
                val = val * parseInt(term[1][1]);
            }
            var con = ['mul', ['natural', val.toString()]];
            
            if (val !== 1) {
                newOperand.push(con);
            }
            for (var term of termArr) {
                newOperand.push(term);
            }
            for (var term of factArr) {
                newOperand.push(term);
            }
            
        } else if (operator === 'addchain') {
            var fact = addFactor(['addchain'].concat(tree_1));
            var addchain;
            if (fact[0] === 'mulchain') {
                con = fact[1];
                addchain = fact[2][1];
            } else {
                addchain = fact;
            }
            if (addchain[1][0] === 'sub') {
                addchain = addNegative(['negative', addchain]);
                sign = -1 * sign;
            }
            if (fact[0] === 'mulchain') {
                operator = 'mulchain';
                newOperand.push(con);
                newOperand.push(['mul', addchain]);
            } else {
                newOperand = addchain.slice(1);
            }
        } else {
            for (var v of tree_1) {
                newOperand.push(addFactoredForm(v));
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
var func = addFactoredForm;
var latex1 = '2(4-y)';
var latex2 = '8-2y';
var tree1 = LatexToTree(latex1);
var tree2 = LatexToTree(latex2);
var tree11 = func(tree1);
var tree21 = func(tree2);
console.log(is_equal_tree(tree11, tree21));
console.log(JSON.stringify(tree11, null, 4));
console.log(JSON.stringify(tree21, null, 4));
*/