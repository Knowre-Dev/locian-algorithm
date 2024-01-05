import { addNegative } from '../rc/function_71.inc.js';

export function addNegaToSub(tree = null) {
    if (!Array.isArray(tree)) {
        return tree;
    }
    const [operator] = tree;
    if (operator === 'addchain') {
        const [, ...operand] = tree;
        let newOperand = [];

        const [operator_operand] = operand;
        (operator_operand[0] === 'add' && operator_operand[1][0] === 'negative') ? newOperand.push(['sub', operator_operand[1][1]])
        : (operator_operand[0] === 'add' && operator_operand[1][0] === 'positive') ? newOperand.push(['add', operator_operand[1][1]])
        : newOperand.push(operator_operand)
        newOperand = [...newOperand, ...operand.slice(1)];
        return [operator, ...newOperand];
    }
    const [, ...operand] = tree;
    const newOperand = operand.map(term => addNegative(term));
    return [operator, ...newOperand];
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
