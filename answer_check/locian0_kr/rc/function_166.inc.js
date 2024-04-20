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
        const [opertor_term_1, ...operand_term_1] = term_1;
        newOperand = operator === opertor_term_1
            ? [...newOperand, ...operand_term_1]
            : [...newOperand, term_1];
    });
    return [operator, ...newOperand];
}
