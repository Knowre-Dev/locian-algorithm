import { addAssociative } from '../rc/function_45.inc.js';

export function setAssociative(tree) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    const [operator, ...operand] = tree;
    let newOperand = [];
    for (const term of operand) {
        const term_1 = addAssociative(term);
        if (operator === term_1[0]) {
            newOperand = [...newOperand, ...term_1.slice(1)];
        } else {
            newOperand.push(term_1);
        }
    }
    return [operator, ...newOperand];
}
