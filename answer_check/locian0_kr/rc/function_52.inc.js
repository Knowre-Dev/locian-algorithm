export function fracMfrac(tree) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    const [operator, ...operand] = tree;
    if (!(operator === 'mfraction' && operand[1][1] < operand[2][1])) {
        return [operator, ...operand.map(term => fracMfrac(term))];
    }
    let num = (parseInt(operand[0][1]) * parseInt(operand[2][1]) + parseInt(operand[1][1])).toString()
    num = ['natural', num];
    return ['fraction', num, operand[2]];
}

/*
import {LatexToTree} from '../checkmath.js';
let latex_1 = '\\mfrac[1]{7}{3}';
let tree_1 = LatexToTree(latex_1);
let tree_11 = fracMfrac(tree_1);
let result_1 = JSON.stringify(tree_11, null, 4);
console.log(JSON.stringify(tree_11, null, 4));
*/
