import { addAssociative } from '../rc/function_45.inc.js';

export function setAssociative(tree) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    const [operator, ...operand] = tree;
    let newOperand = [];
    operand.forEach(term => {
        const term_1 = addAssociative(term);
        operator === term_1[0] ? newOperand = [...newOperand, ...term_1.slice(1)]
        : newOperand.push(term_1);
    });
    return [operator, ...newOperand];
}
