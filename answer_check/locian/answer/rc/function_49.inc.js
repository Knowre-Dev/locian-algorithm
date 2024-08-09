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
    let exp_2;
    [num, exp_2] = divide_by_prime(num, 2, exp);
    let exp_5;
    [num, exp_5] = divide_by_prime(num, 5, exp);

    let den = Math.pow(2, exp - exp_2) * Math.pow(5, exp - exp_5);
    num = ['natural', num.toString()];
    den = ['natural', den.toString()];
    return ['fraction', num, den];
}
/*
import {LatexToTree} from '../checkmath.js';
let latex1 = '3.2';
let tree1 = LatexToTree(latex1);
let tree11 = fracDecimal(tree1);
let result1 = JSON.stringify(tree11, null, 4);
console.log(JSON.stringify(tree11, null, 4));
*/

function divide_by_prime(num, prime, exp) {
    let exp_prime = 0;
    while (num % prime === 0 && exp_prime < exp) {
        num /= prime;
        exp_prime++;
    }
    return [num, exp_prime];
}
