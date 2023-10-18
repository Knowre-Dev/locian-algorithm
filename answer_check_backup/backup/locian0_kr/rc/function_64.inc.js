export function varReverse(tree, types = [null], parent = null) {
    var tree_1 = JSON.parse(JSON.stringify(tree));
    var types_1 = JSON.parse(JSON.stringify(types));
    if (Array.isArray(tree_1)) {
        var operator = tree_1.shift();
        for (var [k, v] of tree_1.entries()) {
            tree_1[k] = varReverse(v, types_1, operator);
        }
        if (operator === 'mulchain' && types_1.includes(parent)) {
            var vars = [];

            for (var v of tree_1) {
                if (v[0] === 'mul' && v[1][0] === 'variable' && v.length === 2) {
                    vars.push(v[1][1]);
                } else {
                    return [operator].concat(tree_1);
                }
            }

            if (vars[0] > vars[vars.length-1]) {
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
import {LatexToTree} from '../checkmath.js';
var latex_1 = 'BCA';
var tree_1 = LatexToTree(latex_1);
var tree_11 = varReverse(tree_1);
var result_1 = JSON.stringify(tree_11, null, 4);
console.log(result_1);
*/