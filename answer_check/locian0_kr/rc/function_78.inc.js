import { fracSimp } from '../rc/function_67.inc.js';

export function rdecToFrac(tree) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    let operator = tree[0];
    if (operator === 'rdecimal') {
        const tree_1 = tree.slice(1);
        let newOperand = [];
        if (tree_1[1] === '') {
            const int = tree_1[0];
            const rdec = tree_1[2];
            let num;
            let mul;
            if (int === '0') {
                num = parseInt(rdec);
            } else {
                mul = parseInt(int) * Math.pow(10, rdec.length) + parseInt(rdec);
                num = mul - parseInt(int);
            }
            const den = (9 * Math.pow(10, rdec.length - 1)).toString();
            const frac = fracSimp(['fraction', ['natural', num], ['natural', den]]);
            operator = frac.shift();
            newOperand = frac;
        } else {
            const int = tree_1[0];
            const dec = tree_1[1];
            const rdec = tree_1[2];
            let mul;
            let num;
            const rdec_length = rdec.length;
            if (int === '0') {
                mul = parseInt(dec) * Math.pow(10, rdec_length) + parseInt(rdec);
                num = mul - parseInt(dec);
            } else {
                mul = parseInt(int + dec) * Math.pow(10, rdec_length) + parseInt(rdec);
                num = mul - parseInt(int + dec);
            }
            const den = (9 * Math.pow(10, rdec_length + dec.length - 1)).toString();
            const frac = fracSimp(['fraction', ['natural', num], ['natural', den]]);
            operator = frac.shift();
            newOperand = frac;
        }
        return [operator].concat(newOperand);
    }
    const newOperand = [];
    const tree_1 = tree.slice(1);
    for (const v of tree_1) {
        newOperand.push(rdecToFrac(v));
    }
    return [operator].concat(newOperand);
}
/*
import {LatexToTree} from '../checkmath.js';
let latex_1 = '0.\\overline{2}';
let latex_2 = '0.1\\overline{2}';
let tree_1 = rdecToFrac(LatexToTree(latex_1));
let tree_2 = rdecToFrac(LatexToTree(latex_2));
let result_1 = JSON.stringify(tree_1, null, 4);
let result_2 = JSON.stringify(tree_2, null, 4);
console.log(result_1 === result_2);
console.log(JSON.stringify(tree_1, null, 4));
console.log(JSON.stringify(tree_2, null, 4));
*/
