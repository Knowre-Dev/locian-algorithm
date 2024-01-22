export function fracIdentity(tree) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    const [operator] = tree;
    if (operator === 'fraction') {
        const [, ...operand] = tree;
        return JSON.stringify(operand[1]) === JSON.stringify(['natural', '1']) ? operand[0]
            : tree;
    }
    const [, ...operand] = tree;
    return [operator, ...operand.map(term => fracIdentity(term))];
}
