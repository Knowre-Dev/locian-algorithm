

import _ from 'lodash';

export function 곱셈결합법칙(tree) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    
    let operator = tree[0];
    let tree_1 = tree.slice(1);
    let newOperand = [];
    for (let v of tree_1) {
        let term = 곱셈결합법칙(v);
        if (operator === 'mulchain' && term[0] === 'mul' && term[1][0] === 'mulchain') {
            for (let [tk, tv] of term[1].entries()) {
                if (tk !== 0) {
                    newOperand.push(tv);
                }
            }
        } else {
            newOperand.push(term);
        }
    }
    return [operator].concat(newOperand);
    
    
}

/*
import {LatexToTree, compareMathTree, is_equal_tree} from "../checkmath.js";

let tree_1 = LatexToTree("a(b(cd))");
let tree_2 = LatexToTree("abcd");
tree_1 = 곱셈결합법칙(tree_1);
tree_2 = 곱셈결합법칙(tree_2);
let result_1 = JSON.stringify(tree_1, null, 4);
let result_2 = JSON.stringify(tree_2, null, 4);
let result = compareMathTree(tree_1, tree_2);
console.log(result_1);
console.log(result_2);
*/

