export function nthrootToSquareroot(tree = null) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    const [operator, ...operand] = tree;
    if (operator === 'nthroot' && JSON.stringify(operand[0]) === JSON.stringify([])) {
        return ['squareroot', operand[1]];
    }
    const newOperand = [];
    for (const term of operand) {
        newOperand.push(nthrootToSquareroot(term));
    }
    return [operator, ...newOperand];
}
/*
import {LatexToTree} from '../checkmath.js';
let latex = '\\nthroot[]{2}';
let tree1 = LatexToTree(latex);
let tree11 = nthrootToSquareroot(tree1);
let result1 = JSON.stringify(tree11, null, 4);
console.log(result1);
*/
