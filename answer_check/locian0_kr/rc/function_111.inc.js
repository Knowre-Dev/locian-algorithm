import { addCommutative } from '../rc/function_47.inc.js';
import { sign_change } from '../rc/sub_functions.js';
export function powBaseSort(tree = null) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    const [operator, ...operand] = tree;
    if (operator !== 'power') {
        return [operator, ...operand.map(term => powBaseSort(term))];
    }
    const base = addCommutative(operand[0]);
    const [, expo] = operand;
    return base[0] === 'addchain' && base[1][0] === 'sub' && expo[1] % 2 === 0
        ? [operator, sign_change(base), expo]
        : base[0] === 'negative' && expo[1] % 2 === 0
            ? [operator, ...powBaseSort([base[1], expo])]
            : [operator, base, expo];
}
