

export function varReverse(tree, types = [null], parent = null) {
    var tree_1 = JSON.parse(JSON.stringify(tree));
    if (Array.isArray(tree_1)) {
        var operator = tree_1.shift();
        
        for (var [k, v] of tree_1.entries()) {
            tree_1[k] = varReverse(v, types, operator);
        }

        if (operator === 'mulchain' && types.includes(parent)) {
            var vars = [];

            for (var v of tree_1) {
                if (v[0] === 'mul' && v[1][0] === 'variable' && v.length === 2) {
                    vars.push(v[1][1]);
                } else {
                    return [operator].concat(tree_1);
                }
            }

            if (vars[0] > vars[vars.length - 1]) {
                vars = vars.reverse();
            }

            var result = [];

            for (var v of vars) {
                result.push(['mul', ['variable', v]]);
            }

            tree_1 = result;
            operator += '_fixed';
        }

        tree_1 = [operator].concat(tree_1);
    }
    return tree_1;
}
/*
import {LatexToTree, is_equal_tree} from '../checkmath.js';
var func = varReverse;
var latex1 = 'ABC';
var latex2 = 'BAC';
var tree1 = LatexToTree(latex1);
var tree2 = LatexToTree(latex2);
var tree11 = func(tree1);
var tree21 = func(tree2);
console.log(is_equal_tree(tree11, tree21));
console.log(JSON.stringify(tree11, null, 4));
console.log(JSON.stringify(tree21, null, 4));
*/