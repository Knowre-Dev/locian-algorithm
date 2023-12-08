import { addCommutative } from '../rc/function_47.inc.js';
import { addFactor } from '../rc/function_72.inc.js';
import { sub_mulCommutative } from '../rc/function_126.inc.js';

export function powAddFactoredForm(tree = null) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    let operator = tree[0];
    if (operator === 'power') {
        const tree_1 = tree.slice(1);
        const base = sub_mulCommutative(addCommutative(tree_1[0]));
        const expo = tree_1[1];

        if (base[0] === 'addchain' && expo[0] === 'natural') {
            const fact = addFactor(base);
            if (fact[0] === 'mulchain') {
                operator = 'mulchain';
                fact.shift();
                const newOperand = [];
                for (const f of fact) {
                    newOperand.push([f[0], ['power', f[1], expo]]);
                }
                return [operator].concat(newOperand);
            } else {
                return [operator, base, expo];
            }
        } else {
            return [operator, base, expo];
        }
    }
    const newOperand = [];
    const tree_1 = tree.slice(1);
    for (const v of tree_1) {
        newOperand.push(powAddFactoredForm(v));
    }
    return [operator].concat(newOperand);
}
