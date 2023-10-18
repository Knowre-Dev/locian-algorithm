
export function 곱셈결합법칙(tree) {
    var tree_1 = JSON.parse(JSON.stringify(tree));
    if (Array.isArray(tree_1)) {
        var operator = tree_1.shift();

        var newOperand = [];
        for (var [k, v] of tree_1.entries()) {
            var term = 곱셈결합법칙(v);
            if (operator === 'mulchain' && 
                term[0] === 'mul' && 
                term[1][0] === 'mulchain') {
                
                for (var [tk, tv] of term[1].entries()) {
                    if (tk !== 0) {
                        newOperand.push(tv);
                    }
                }
            } else {
                newOperand.push(term);
            }
        }
        tree_1 = [operator].concat(newOperand);
    }
    return tree_1;
}

import {LatexToTree, compareMathTree, is_equal_tree} from "../checkmath.js";

var tree_1 = LatexToTree("a(b(cd))");
var tree_2 = LatexToTree("abcd");
tree_1 = 곱셈결합법칙(tree_1);
tree_2 = 곱셈결합법칙(tree_2);
var result_1 = JSON.stringify(tree_1, null, 4);
var result_2 = JSON.stringify(tree_2, null, 4);
var result = compareMathTree(tree_1, tree_2);
console.log(result_1);
console.log(result_2);


