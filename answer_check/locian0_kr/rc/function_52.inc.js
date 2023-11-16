import _ from 'lodash';

export function fracMfrac(tree) {
    
    if (!Array.isArray(tree)) {
        return tree;
    }
    
    var tree_1 = _.cloneDeep(tree);
    var operator = tree_1.shift();
    var newOperand = [];
    if (operator === 'mfraction' && parseInt(tree_1[1][1]) < parseInt(tree_1[2][1])) {
        var num = ['natural', (parseInt(tree_1[0][1]) * parseInt(tree_1[2][1]) + parseInt(tree_1[1][1])).toString()];
        var den = tree_1[2];

        var operator = 'fraction';
        newOperand.push(num);
        newOperand.push(den);
    } else {
        for (var v of tree_1) {
            newOperand.push(fracMfrac(v));
        }
    }
    tree_1 = [operator].concat(newOperand);
    
    return tree_1;
}
/*
import {LatexToTree} from '../checkmath.js';
var latex_1 = '\\mfrac[1]{7}{3}';
var tree_1 = LatexToTree(latex_1);
var tree_11 = fracMfrac(tree_1);
var result_1 = JSON.stringify(tree_11, null, 4);
console.log(JSON.stringify(tree_11, null, 4));
*/
