import { checkZeroEquiv } from '../rc/function_80.inc.js';

export function mulZero(tree) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    const [operator] = tree;
    if (operator === 'mulchain') {
        const [, ...operand] = tree;
        for (const term of operand) {
            if (checkZeroEquiv(term[1])) {
                return ['natural', '0'];
            }
        }
        return tree;
    }
    const [, ...operand] = tree;
    const newOperand = [];
    for (const term of operand) {
        newOperand.push(mulZero(term));
    }
    return [operator, ...newOperand];
}
