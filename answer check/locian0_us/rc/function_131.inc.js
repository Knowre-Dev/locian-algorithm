import {termExists} from '../rc/function_135.inc.js';

export function makeOneSideOfEqIneqZero(tree = null) {
    var tree_1 = JSON.parse(JSON.stringify(tree));
    if (Array.isArray(tree_1)) {
        var operator = tree_1.shift();
        
        var newOperand = [];
        if (operator === 'equation') {
            for (var subtree of tree_1) {
                if (JSON.stringify(subtree) == JSON.stringify(['natural', '0'])) {
                    return [operator].concat(tree_1);
                }
            }
            // From here on, we are guaranteed that
            // no side in the chain of equalities is already identically zero
            
            var term = ['sub', tree_1[0]];
            for (var [k, v] of tree_1.entries()) {
                var temp;
                if (k == 0) {
                    temp = ['natural', '0'];
                } else {
                    temp = v;
                    if (v[0] !== 'addchain') {
                        temp = ['addchain', ['add', v]];
                    }
                    temp.push(term);
                }
                newOperand.push(temp);
            }
            
        } else if (operator === 'inequality') {
            for (var subtree of tree_1) {
                if (JSON.stringify(subtree) == JSON.stringify(['natural', '0'])) {
                    return [operator].concat(tree_1);
                }
            }
            // From here on, we are guaranteed that
            // no side in the chain of inequalities is already identically zero
            
            var term = ['sub', tree_1[0]];
            for (var [k, v] of tree_1.entries()) {
                var temp;
                if (k == 0) {
                    temp = ['natural', '0'];
                } else {
                    temp = v;
                    if (!['lt', 'le', 'ge', 'gt'].includes(v) &&
                        !termExists('infinity', v)) {
                        if (v[0] !== 'addchain') {
                            temp = ['addchain', ['add', v]];
                        }
                        temp.push(term);
                    }
                }
                newOperand.push(temp);
            }
            
        } else {
            newOperand = tree_1;
            
        }
        
        tree_1 = [operator].concat(newOperand);
        
    }
    
    // NOTE: This export function does not distribute the minus sign
    //     Use addNegative() right after this export function to perform that transformation
    return tree_1;
    
}


/*
import {LatexToTree, is_equal_tree} from '../checkmath.js';
var func = makeOneSideOfEqIneqZero;
var latex1 = 'y+3=2x+3-x';
//var latex2 = '0=y-\\sin{\\frac{x}{2}}';
var tree1 = LatexToTree(latex1);
//var tree2 = LatexToTree(latex2);
var tree11 = func(tree1);
//var tree21 = func(tree2);
//console.log(is_equal_tree(tree11, tree21));
console.log(JSON.stringify(tree11, null, 4));
//console.log(JSON.stringify(tree21, null, 4));
*/