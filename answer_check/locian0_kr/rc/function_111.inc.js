import { addCommutative } from '../rc/function_47.inc.js';

export function powBaseSort(tree = null) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    const [operator] = tree;
    if (operator === 'power') {
        const [, ...operand] = tree;
        const base = addCommutative(operand[0]);
        const expo = operand[1];
        if (base[0] === 'addchain' && expo[1] % 2 === 0) {
            if (base[1][0] === 'sub') {
                base.shift();
                const newBaseTerm = [];
                for (const term of base) {
                    term[0] === 'sub' ? newBaseTerm.push(['add', term[1]])
                    : newBaseTerm.push(['sub', term[1]])
                }
                return [operator, ['addchain', ...newBaseTerm], expo];
            }
            return [operator, base, expo];
        }
        if (base[0] === 'negative' && expo[1] % 2 === 0) {
            return [operator, ...powBaseSort([base[1], expo])];
        }
        return [operator, base, expo];
    }
    const [, ...operand] = tree;
    const newOperand = operand.map(term => powBaseSort(term));
    return [operator, ...newOperand];
}
