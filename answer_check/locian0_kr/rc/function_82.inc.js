import { checkZeroEquiv } from '../rc/function_80.inc.js';

export function mulZero(tree) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    const [operator] = tree;
    if (operator === 'mulchain') {
        const [, ...operand] = tree;
        return operand.some(term => checkZeroEquiv(term[1])) ? ['natural', '0']
            : tree;
    }
    const [, ...operand] = tree;
    return [operator, ...operand.map(term => mulZero(term))];
}
