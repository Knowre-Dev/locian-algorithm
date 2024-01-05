export function addAssociative(tree) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    const [operator, ...operand] = tree;
    const newOperand = [];
    operand.forEach(term => {
        const term_1 = addAssociative(term);
        const is_addchain = operator === 'addchain' && term_1[0] === 'add' && term_1[1][0] === 'addchain';
        if (is_addchain) {
            const [, ...term_rest] = term_1[1];
            newOperand.push(...term_rest);
        } else {
            newOperand.push(term_1);
        }
    });
    return [operator, ...newOperand];
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
