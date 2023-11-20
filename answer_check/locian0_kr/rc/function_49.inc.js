import {EuclidAlg} from '../rc/function_76.inc.js';
import _ from 'lodash';

export function fracDecimal(tree) {
    
    if (!Array.isArray(tree)) {
        return tree;
    }  
    
    let operator = tree[0];
    let tree_1 = tree.slice(1);
    let newOperand = [];
    if (operator === 'decimal') {
        let val = tree_1[0].split('.');
        
        
        let num = parseInt(val[0] + val[1]);
        let den = Math.pow(10, val[1].length);
    
        let gcf = EuclidAlg(num, den);
        let newNum = num / gcf;
        let newDen = den / gcf;
        
        if (newDen === 1) {
            operator = 'natural';
            newOperand.push(newNum.toString());
        } else {
            operator = 'fraction';
            newOperand.push(['natural', newNum.toString()]);
            newOperand.push(['natural', newDen.toString()]);
        }
    } else {
        for (let v of tree_1) {
            newOperand.push(fracDecimal(v));
        }
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