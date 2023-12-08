import { EuclidAlg } from '../rc/function_76.inc.js';

export function fracDecimal(tree) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    let operator = tree[0];
    if (operator === 'decimal') {
        const tree_1 = tree.slice(1);
        const newOperand = [];
        const val = tree_1[0].split('.');
        const num = parseInt(val[0] + val[1]);
        const den = Math.pow(10, val[1].length);
        const gcf = EuclidAlg(num, den);
        const newNum = num / gcf;
        const newDen = den / gcf;

        if (newDen === 1) {
            operator = 'natural';
            newOperand.push(newNum.toString());
        } else {
            operator = 'fraction';
            newOperand.push(['natural', newNum.toString()]);
            newOperand.push(['natural', newDen.toString()]);
        }
        return [operator].concat(newOperand);
    }
    const newOperand = [];
    const tree_1 = tree.slice(1);
    for (const v of tree_1) {
        newOperand.push(fracDecimal(v));
    }
    return [operator].concat(newOperand);
}
/*
import {LatexToTree} from '../checkmath.js';
let latex1 = '1\\le \\frac{x}{2}+3\\le 3.4';
let tree1 = LatexToTree(latex1);
let tree11 = fracDecimal(tree1);
let result1 = JSON.stringify(tree11, null, 4);
console.log(JSON.stringify(tree11, null, 4));
*/
