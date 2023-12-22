export function powIdentity(tree) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    const [operator] = tree;
    if (operator === 'power') {
        const [, ...operand] = tree;
        const is_one = operand[1][0] === 'natural' && operand[1][1] === '1';
        return is_one ? operand[0] : tree;
    }
    const [, ...operand] = tree;
    const newOperand = operand.map(term => powIdentity(term));
    return [operator, ...newOperand];
}
/*
import {LatexToTree, compareMathTree} from '../checkmath.js';
let tree1 = LatexToTree('x^2');
let tree2 = LatexToTree('x');
let tree11 = powIdentity(tree1);
let tree21 = powIdentity(tree2);
let result1 = JSON.stringify(tree11, null, 4);
let result2 = JSON.stringify(tree21, null, 4);
console.log(compareMathTree(result1, result2));
console.log(JSON.stringify(tree11, null, 4));
console.log(JSON.stringify(tree21, null, 4));
*/
