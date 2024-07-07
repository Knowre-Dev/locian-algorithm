import { addNegative } from '../rc/function_71.inc.js';

export function eqMulNeg(tree) {
    if (!Array.isArray(tree)) {
        return tree;
    }
    const [operator, ...operand] = tree;
    if (operator !== 'equation') {
        return tree;
    }
    const [left, right] = operand;
    const [op_l] = left;
    const [op_r] = right;
    const is_negative = op_l === 'negative' || (op_l === 'addchain' && left[1][0] === 'sub');
    if (!is_negative) {
        return tree;
    }
    let newOperand = op_l === 'negative'
        ? [left[1]]
        : [addNegative(['negative', left])];
    const term_add = op_r === 'negative'
        ? right[1]
        : op_r === 'addchain'
            ? addNegative(['negative', right])
            : op_r === 'natural' && right[1] === '0'
                ? right
                : ['negative', right];
    newOperand = [...newOperand, term_add];
    return [operator, ...newOperand];
}
