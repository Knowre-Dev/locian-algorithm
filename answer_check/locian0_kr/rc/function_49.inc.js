import { EuclidAlg } from '../rc/function_76.inc.js';

export function fracDecimal(tree) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    const [operator] = tree;
    if (operator === 'decimal') {
        const [, ...operand] = tree;
        const val = operand[0].split('.');
        const num = parseInt(val[0] + val[1]);
        const den = Math.pow(10, val[1].length);
        const gcf = EuclidAlg(num, den);
        const newNum = num / gcf;
        const newDen = den / gcf;
        return newDen === 1 ? ['natural', newNum.toString()]
            : ['fraction', ['natural', newNum.toString()], ['natural', newDen.toString()]];
    }
    const [, ...operand] = tree;
    const newOperand = operand.map(term => fracDecimal(term));
    return [operator, ...newOperand];
}
/*
import {LatexToTree} from '../checkmath.js';
let latex1 = '1\\le \\frac{x}{2}+3\\le 3.4';
let tree1 = LatexToTree(latex1);
let tree11 = fracDecimal(tree1);
let result1 = JSON.stringify(tree11, null, 4);
console.log(JSON.stringify(tree11, null, 4));
*/
