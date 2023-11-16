import _ from 'lodash';

export function fracMfrac(tree) {
    
    if (!Array.isArray(tree)) {
        return tree;
    }
    
    let tree_1 = _.cloneDeep(tree);
    let operator = tree_1.shift();
    let newOperand = [];
    if (operator === 'mfraction' && parseInt(tree_1[1][1]) < parseInt(tree_1[2][1])) {
        let num = ['natural', (parseInt(tree_1[0][1]) * parseInt(tree_1[2][1]) + parseInt(tree_1[1][1])).toString()];
        let den = tree_1[2];

        operator = 'fraction';
        newOperand.push(num);
        newOperand.push(den);
    } else {
        for (let v of tree_1) {
            newOperand.push(fracMfrac(v));
        }
    }
    tree_1 = [operator].concat(newOperand);
    
    return tree_1;
}
/*
import {LatexToTree} from '../checkmath.js';
let latex_1 = '\\mfrac[1]{7}{3}';
let tree_1 = LatexToTree(latex_1);
let tree_11 = fracMfrac(tree_1);
let result_1 = JSON.stringify(tree_11, null, 4);
console.log(JSON.stringify(tree_11, null, 4));
*/
