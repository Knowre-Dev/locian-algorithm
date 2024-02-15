import { checkZeroEquiv } from '../rc/function_80.inc.js';

export function mulZero(tree) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    const [operator, ...operand] = tree;
    return operator === 'mulchain'
        ? operand.some(term => checkZeroEquiv(term[1]))
            ? ['natural', '0']
            : tree
        : [operator, ...operand.map(term => mulZero(term))];
}
