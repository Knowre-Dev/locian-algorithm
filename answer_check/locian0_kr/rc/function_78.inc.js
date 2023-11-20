import {fracSimp} from '../rc/function_67.inc.js';
import _ from 'lodash';

export function rdecToFrac(tree) {
    if (!Array.isArray(tree)) {
        return tree;
    }
    
    let operator = tree[0];
    let tree_1 = tree.slice(1);
    let newOperand = [];
    if (operator === 'rdecimal') {
        if (tree_1[1] === '') {
            let int = tree_1[0];
            let rdec = tree_1[2];
            let num;
            let mul;
            if (int === '0') {
                num = parseInt(rdec);
            } else {
                mul = parseInt(int) * Math.pow(10, rdec.length) + parseInt(rdec);
                num = mul - parseInt(int);
            }
            let den = (9 * Math.pow(10, rdec.length - 1)).toString();
            
            let frac = fracSimp(['fraction', ['natural', num], ['natural', den]]);
            operator = frac.shift();
            newOperand = frac;
        } else {
            let int = tree_1[0];
            let dec = tree_1[1];
            let rdec = tree_1[2];
            let mul;
            let num;
            if (int === '0') {
                mul = parseInt(dec) * Math.pow(10, rdec.length) + parseInt(rdec);
                num = mul - parseInt(dec);
            } else {
                mul = parseInt(int + dec)* Math.pow(10, rdec.length) + parseInt(rdec);
                num = mul - parseInt(int + dec);
            }
            let den = (9 * Math.pow(10, rdec.length + dec.length - 1)).toString();
            
            let frac = fracSimp(['fraction', ['natural', num], ['natural', den]]);
            operator = frac.shift();
            newOperand = frac;
        }
    } else {
        for (let v of tree_1) {
            newOperand.push(rdecToFrac(v));
        }
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