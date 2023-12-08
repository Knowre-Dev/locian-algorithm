import { addCommutative } from '../rc/function_47.inc.js';

export function powBaseSort(tree = null) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    const operator = tree[0];
    if (operator === 'power') {
        const tree_1 = tree.slice(1);
        const base = addCommutative(tree_1[0]);
        const expo = tree_1[1];
        if (base[0] === 'addchain' && expo[1] % 2 === 0) {
            if (base[1][0] === 'sub') {
                base.shift();
                const newBaseTerm = [];
                for (const b of base) {
                    b[0] === 'sub' ? newBaseTerm.push(['add', b[1]])
                    : newBaseTerm.push(['sub', b[1]])
                }
                return [operator, ['addchain'].concat(newBaseTerm), expo];
            }
            return [operator, base, expo];
        }
        if (base[0] === 'negative' && expo[1] % 2 === 0) {
            base.shift();
            return [operator].concat(powBaseSort([base[0], expo]));
        }
        return [operator, base, expo];
    }
    const tree_1 = tree.slice(1);
    const newOperand = [];
    for (const v of tree_1) {
        newOperand.push(powBaseSort(v));
    }
    return [operator].concat(newOperand);
}
