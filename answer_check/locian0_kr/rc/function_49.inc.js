import {EuclidAlg} from '../rc/function_76.inc.js';
import _ from 'lodash';

export function fracDecimal(tree) {
    
    if (!Array.isArray(tree)) {
        return tree;
    }  
    let tree_1 = _.cloneDeep(tree);
    let operator = tree_1.shift();

    let newOperand = [];
    if (operator === 'decimal') {
        let val = tree_1[0].split('.');
        // 20190419 larwein - 000.x 가 그대로 000.x 가 되면서 무한 루프에 빠지는 버그
        /*
        if (!isNaN(val[0])) {
            val[0] = val[0] + 0;                
        }
        if (val[0].substr(0, 1) === '0' && val[0].length > 1) {
            newOperand = tree_1;
        } else {
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
        }
        */
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
    tree_1 = [operator].concat(newOperand);

    return tree_1;
}
/*
import {LatexToTree} from '../checkmath.js';
let latex1 = '1\\le \\frac{x}{2}+3\\le 3.4';
let tree1 = LatexToTree(latex1);
let tree11 = fracDecimal(tree1);
let result1 = JSON.stringify(tree11, null, 4);
console.log(JSON.stringify(tree11, null, 4));
*/