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
    let newOperand = operand[0][0] === 'negative'
        ? [operand[0][1]]
        : [addNegative(['negative', operand[0]])];
    const term_add = operand[1][0] === 'negative'
        ? operand[1][1]
        : operand[1][0] === 'addchain'
            ? addNegative(['negative', operand[1]])
            : operand[1][0] === 'natural' && operand[1][1] === '0'
                ? operand[1]
                : ['negative', operand[1]];
    newOperand = [...newOperand, term_add];
    return [operator, ...newOperand];
}
