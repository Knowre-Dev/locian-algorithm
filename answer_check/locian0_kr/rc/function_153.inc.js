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

    const operator = tree[0];
    if (operator === 'addchain') {
        const denomArr = findDenominators(tree, true);
        if (denomArr.length === 0) {
            return tree;
        }

        const denomArr_entries = denomArr.entries();
        for (const [k, d] of denomArr_entries) {
            denomArr[k] = ['mul', d];
        }
        let denom = array2ChainTree(denomArr);
        const find = findGCF(denom);

        if (JSON.stringify(find.sym) !== JSON.stringify([])) {
            const denom_arr = [];
            const find_entries = Object.entries(find);
            for (const [k, f] of find_entries) {
                if (k === 'const') {
                    denom_arr.push(['mul', f]);
                } else {
                    for (const f1 of f) {
                        denom_arr.push(['mul', f1]);
                    }
                }
            }
            denom = ['mulchain'].concat(denom_arr);
        }
        const operand = tree.slice(1);
        const newOperand = [];
        for (const term of operand) {
            newOperand.push([term[0], mulIdentity(mulAssociative(multFactor(term[1], ['mul', denom], true)))]);
        }

        const newtree = array2ChainTree(newOperand);
        return ['fraction', newtree, denom];
    }
    const operand = tree.slice(1);
    const newOperand = [];
    for (const subtree of operand) {
        newOperand.push(fracCombine(subtree));
    }
    return [operator].concat(newOperand);
}

/*
import {LatexToTree} from '../checkmath.js';
let latex_1 = '(x-\\frac{5}{2})^2+(y+\\frac{5}{2})^{2}=\\frac{25}{2}';
let tree_1 = LatexToTree(latex_1);
let tree_11 = fracCombine(tree_1);
let result_1 = JSON.stringify(tree_11, null, 4);
console.log(result_1);
*/
