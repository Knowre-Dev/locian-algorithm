import { addNegative } from '../rc/function_71.inc.js';

export function eqMulNeg(tree) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    const [operator, ...operand] = tree;
    if (operator === 'equation' &&
        (operand[0][0] === 'negative' || (operand[0][0] === 'addchain' && operand[0][1][0] === 'sub'))) {
        const newOperand = [];
        operand[0][0] === 'negative' ? newOperand.push(operand[0][1])
        : newOperand.push(addNegative(['negative', operand[0]]));
        operand[1][0] === 'negative' ? newOperand.push(operand[1][1])
        : operand[1][0] === 'addchain' ? newOperand.push(addNegative(['negative', operand[1]]))
        : (operand[1][0] === 'natural' && operand[1][1] === '0') ? newOperand.push(operand[1])
        : newOperand.push(['negative', operand[1]]);
        return [operator, ...newOperand];
    }
    return tree;
}
