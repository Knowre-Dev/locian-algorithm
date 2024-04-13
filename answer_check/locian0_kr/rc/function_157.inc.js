export function mulAssociative(tree) { // a(bc) => abc
    if (!Array.isArray(tree)) {
        return tree;
    }

    const [operator, ...operand] = tree;
    let newOperand = [];
    operand.forEach(term => {
        const term_1 = mulAssociative(term);
        const is_mulchains = operator === 'mulchain' && term_1[0] === 'mul' && term_1[1][0] === 'mulchain'; // muchain of mulchain
        newOperand = is_mulchains
            ? [...newOperand, ...term_1[1].slice(1)]
            : [...newOperand, term_1];
    });
    return [operator, ...newOperand];
}
