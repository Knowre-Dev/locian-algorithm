export function mulAssociative(tree) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    const [operator, ...operand] = tree;
    const newOperand = [];
    for (const term of operand) {
        const term_1 = mulAssociative(term);
        if (operator === 'mulchain' &&
            term_1[0] === 'mul' &&
            term_1[1][0] === 'mulchain') {
            const term_1_entries = term_1[1].entries();
            for (const [key, term_term_1] of term_1_entries) {
                if (key !== 0) {
                    newOperand.push(term_term_1);
                }
            }
        } else {
            newOperand.push(term_1);
        }
    }
    return [operator, ...newOperand];
}
