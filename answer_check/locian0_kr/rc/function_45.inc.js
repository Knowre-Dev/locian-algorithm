export function addAssociative(tree) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    const [operator, ...operand] = tree;
    let newOperand = [];
    operand.forEach(term => {
        const term_1 = addAssociative(term);
        const [operator_term_1, ...operand_term_1] = term_1;
        const is_addchain = operator === 'addchain' && operator_term_1 === 'add' && operand_term_1[0][0] === 'addchain';
        newOperand = is_addchain
            ? [...newOperand, ...operand_term_1[0].slice(1)]
            : [...newOperand, term_1];
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
