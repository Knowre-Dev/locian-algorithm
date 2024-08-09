import { addAssociative } from '../rc/function_45.inc.js';
// associative 적용
export function setAssociative(tree) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    const [operator, ...operand] = tree;
    let newOperand = [];
    operand.forEach(term => {
        const term_1 = addAssociative(term);
        const [operator_1, ...operand_1] = term_1;
        newOperand = operator === operator_1
            ? [...newOperand, ...operand_1]
            : [...newOperand, term_1];
    });
    return [operator, ...newOperand];
}
