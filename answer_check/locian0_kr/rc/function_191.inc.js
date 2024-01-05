export function nthrootToSquareroot(tree = null) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    const [operator, ...operand] = tree;
    return (operator === 'nthroot' && JSON.stringify(operand[0]) === JSON.stringify([])) ? ['squareroot', operand[1]]
        : [operator, ...operand.map(term => nthrootToSquareroot(term))];
}
/*
import {LatexToTree} from '../checkmath.js';
let latex = '\\nthroot[]{2}';
let tree1 = LatexToTree(latex);
let tree11 = nthrootToSquareroot(tree1);
let result1 = JSON.stringify(tree11, null, 4);
console.log(result1);
*/
