import { addNegative } from '../rc/function_71.inc.js';

export function addNegaToSub(tree = null) {
    if (!Array.isArray(tree)) {
        return tree;
    }
    const [operator, ...operand] = tree;
    if (operator !== 'addchain') {
        return [operator, ...operand.map(term => addNegative(term))];
    }
    let newOperand = [];
    const [operator_1, ...operand_1] = operand;
    newOperand = operator_1[0] === 'add' && operator_1[1][0] === 'negative'
        ? [...newOperand, ['sub', operator_1[1][1]]]
        : (operator_1[0] === 'add' && operator_1[1][0] === 'positive')
            ? [...newOperand, ['add', operator_1[1][1]]]
            : [...newOperand, operator_1];
    return [operator, ...newOperand, ...operand_1];
}

/*
import {LatexToTree, match_all} from '../checkmath.js';
let latex_1 = '(+2)+2';
let latex_2 = '+2+2';
let tree1 = addNegaToSub(LatexToTree(latex_1));
let tree2 = addNegaToSub(LatexToTree(latex_2));
let result1 = JSON.stringify(tree1, null, 4);
let result2 = JSON.stringify(tree2, null, 4);
console.log(result1 === result2);
console.log(JSON.stringify(tree1, null, 4));
console.log(JSON.stringify(tree2, null, 4));
*/
