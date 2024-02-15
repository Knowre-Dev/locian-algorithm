import { addNegative } from '../rc/function_71.inc.js';

export function eqMulNeg(tree) {
    if (!Array.isArray(tree)) {
        return tree;
    }
    const [operator, ...operand] = tree;
    const is_negative = operator === 'equation' && (operand[0][0] === 'negative' || (operand[0][0] === 'addchain' && operand[0][1][0] === 'sub'));
    if (!is_negative) {
        return tree;
    }
    let newOperand = [];
    newOperand = operand[0][0] === 'negative'
        ? [...newOperand, operand[0][1]]
        : [...newOperand, addNegative(['negative', operand[0]])];
    newOperand = operand[1][0] === 'negative'
        ? [...newOperand, operand[1][1]]
        : operand[1][0] === 'addchain'
            ? [...newOperand, addNegative(['negative', operand[1]])]
            : (operand[1][0] === 'natural' && operand[1][1] === '0')
                ? [...newOperand, operand[1]]
                : [...newOperand, ['negative', operand[1]]];
    return [operator, ...newOperand];
}
