import { addCommutative } from '../rc/function_47.inc.js';

export function powBaseSort(tree = null) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    const [operator, ...operand] = tree;
    if (operator !== 'power') {
        return [operator, ...operand.map(term => powBaseSort(term))];
    }
    let base = addCommutative(operand[0]);
    const [, expo] = operand;
    if (base[0] === 'addchain' && expo[1] % 2 === 0) {
        if (base[1][0] === 'sub') {
            [, ...base] = base;
            const newBaseTerm = base.map(term => term[0] === 'sub'
                ? ['add', term[1]]
                : ['sub', term[1]]);
            return [operator, ['addchain', ...newBaseTerm], expo];
        }
        return [operator, base, expo];
    }
    return base[0] === 'negative' && expo[1] % 2 === 0
        ? [operator, ...powBaseSort([base[1], expo])]
        : [operator, base, expo];
}
