import { fracSimp } from '../rc/function_67.inc.js';

export function rdecToFrac(tree) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    const operator = tree[0];
    if (operator === 'rdecimal') {
        const [, ...operand] = tree;
        if (operand[1] === '') {
            const [int, , rdec] = operand;
            const num = int === '0' ? rdec
                : int * Math.pow(10, rdec.length) + rdec - int;
            const den = (9 * Math.pow(10, rdec.length - 1)).toString();
            return fracSimp(['fraction', ['natural', num], ['natural', den]]);
        }
        const [int, dec, rdec] = operand;
        const rdec_length = rdec.length;
        const num = int === '0' ? dec * Math.pow(10, rdec_length) + rdec - dec
            : (int + dec) * Math.pow(10, rdec_length) + rdec - (int + dec);
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
