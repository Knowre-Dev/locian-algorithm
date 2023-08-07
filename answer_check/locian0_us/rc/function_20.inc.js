
export function varReverseShift(tree, types = [null], parent = null) {
    var tree_1 = JSON.parse(JSON.stringify(tree));
    if (Array.isArray(tree_1)) {
        var operator = tree_1.shift();

        for (var [k, v] of tree_1.entries()) {
            tree_1[k] = varReverseShift(v, types, operator);
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

            
            var vars_1 = JSON.parse(JSON.stringify(vars));
            vars_1.sort();
            var min = vars_1[0];
            
            var k = parseFloat(Object.keys(vars).find(key => vars[key] === min));
            if ((typeof vars[k-1] !== 'undefined' ? vars[k-1] : vars[vars.length - 1]) 
                < (typeof vars[k+1] !== 'undefined' ? vars[k+1] : vars[0])) {
                k = vars.length - 1 - k;
                
                vars = vars.reverse();
                
            }
            var result = [];
            for (var v of [[k, vars.length], [0, k]]) {
                for (var i = v[0]; i < v[1]; i++) {
                    result.push([ 'mul', ['variable', vars[i]]]);
                }
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
var func = varReverseShift;
var latex1 = 'ABCD';
var latex2 = 'BCAD';
var tree1 = LatexToTree(latex1);
var tree2 = LatexToTree(latex2);
var tree11 = func(tree1);
var tree21 = func(tree2);
console.log(is_equal_tree(tree11, tree21));
console.log(JSON.stringify(tree11, null, 4));
console.log(JSON.stringify(tree21, null, 4));
*/