/*
Combines an addchain with at least one fraction into a single fraction
*/
import { mulIdentity } from '../rc/function_56.inc.js';
import { array2ChainTree, findDenominators, findGCF, multFactor } from '../rc/function_152.inc.js';
import { mulAssociative } from '../rc/function_157.inc.js';

export function fracCombine(tree) {
    if (!Array.isArray(tree) || tree.length < 1) {
        return tree;
    }

    const [operator] = tree;
    if (operator === 'addchain') {
        const denomArr = findDenominators(tree, true);
        if (denomArr.length === 0) {
            return tree;
        }

        const denomArr_entries = denomArr.entries();
        for (const [key, denom] of denomArr_entries) {
            denomArr[key] = ['mul', denom];
        }
        let denom = array2ChainTree(denomArr);
        const find = findGCF(denom);

        if (JSON.stringify(find.sym) !== JSON.stringify([])) {
            const denom_arr = [];
            const find_entries = Object.entries(find);
            for (const [key, value] of find_entries) {
                if (key === 'const') {
                    denom_arr.push(['mul', value]);
                } else {
                    for (const value_1 of value) {
                        denom_arr.push(['mul', value_1]);
                    }
                }
            }
            denom = ['mulchain', ...denom_arr];
        }
        const [, ...operand] = tree;
        const newOperand = [];
        for (const term of operand) {
            newOperand.push([term[0], mulIdentity(mulAssociative(multFactor(term[1], ['mul', denom], true)))]);
        }

        return ['fraction', array2ChainTree(newOperand), denom];
    }
    const [, ...operand] = tree;
    const newOperand = [];
    for (const subtree of operand) {
        newOperand.push(fracCombine(subtree));
    }
    return [operator, ...newOperand];
}

/*
import {LatexToTree} from '../checkmath.js';
let latex_1 = '(x-\\frac{5}{2})^2+(y+\\frac{5}{2})^{2}=\\frac{25}{2}';
let tree_1 = LatexToTree(latex_1);
let tree_11 = fracCombine(tree_1);
let result_1 = JSON.stringify(tree_11, null, 4);
console.log(result_1);
*/
