
import _ from 'lodash';

export function addAssociative(tree) {
    
    if (!Array.isArray(tree)) {
        return tree;
    }
    
    let operator = tree[0];
    let tree_1 = tree.slice(1);
    let newOperand = [];
    for (let v of tree_1) {
        let term = addAssociative(v);
        if (operator === 'addchain' && term[0] === 'add' && term[1][0] === 'addchain') {
            let term_1_entries = term[1].entries()
            for (let [tk, tv] of term_1_entries) {
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
import {LatexToTree, compareMathTree} from "../checkmath.js";

let tree_1 = LatexToTree("a+(b+c)");
let tree_2 = LatexToTree("(a+b)+c");
tree_1 = addAssociative(tree_1);
tree_2 = addAssociative(tree_2);
let result_1 = JSON.stringify(tree_1, null, 4);
let result_2 = JSON.stringify(tree_2, null, 4);
let result = compareMathTree(tree_1, tree_2);
console.log(result);
console.log(result_1);
console.log(result_2);
*/