export function fracDecimal(tree) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    const [operator, ...operand] = tree;
    if (operator !== 'decimal') {
        return [operator, ...operand.map(term => fracDecimal(term))];
    }
    const [int, dec] = operand[0].split('.');
    if (parseFloat(dec) === 0) {
        return ['natural', int.toString()];
    }
    let num = parseInt(int + dec);
    const exp = dec.length;
    let exp_2 = 0;
    let exp_5 = 0;
    while (num % 2 === 0 && exp_2 < exp) {
        num /= 2;
        exp_2++;
    }
    while (num % 5 === 0 && exp_5 < exp) {
        num /= 5;
        exp_5++;
    }
    const den = Math.pow(2, exp - exp_2) * Math.pow(5, exp - exp_5);
    return ['fraction', ['natural', num.toString()], ['natural', den.toString()]];
}
/*
import {LatexToTree} from '../checkmath.js';
let latex1 = '3.2';
let tree1 = LatexToTree(latex1);
let tree11 = fracDecimal(tree1);
let result1 = JSON.stringify(tree11, null, 4);
console.log(JSON.stringify(tree11, null, 4));
*/
