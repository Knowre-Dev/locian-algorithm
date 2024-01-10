import { fracSimp } from '../rc/function_67.inc.js';

export function rdecToFrac(tree) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    const operator = tree[0];
    if (operator === 'rdecimal') {
        const [, ...operand] = tree;
        if (operand[1] === '') {
            const int = operand[0];
            const rdec = operand[2];
            const num = int === '0' ? parseInt(rdec)
                : parseInt(int) * Math.pow(10, rdec.length) + parseInt(rdec) - parseInt(int);
            const den = (9 * Math.pow(10, rdec.length - 1)).toString();
            return fracSimp(['fraction', ['natural', num], ['natural', den]]);
        }
        const int = operand[0];
        const dec = operand[1];
        const rdec = operand[2];
        const rdec_length = rdec.length;
        const num = int === '0' ? parseInt(dec) * Math.pow(10, rdec_length) + parseInt(rdec) - parseInt(dec)
            : parseInt(int + dec) * Math.pow(10, rdec_length) + parseInt(rdec) - parseInt(int + dec);
        const den = (9 * Math.pow(10, rdec_length + dec.length - 1)).toString();
        return fracSimp(['fraction', ['natural', num], ['natural', den]]);
    }
    const [, ...operand] = tree;
    return [operator, ...operand.map(term => rdecToFrac(term))];
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
