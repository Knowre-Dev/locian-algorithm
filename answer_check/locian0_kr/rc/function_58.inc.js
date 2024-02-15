export function fracIdentity(tree) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    const [operator, ...operand] = tree;
    return operator === 'fraction'
        ? JSON.stringify(operand[1]) === JSON.stringify(['natural', '1'])
            ? operand[0]
            : tree
        : [operator, ...operand.map(term => fracIdentity(term))];
}
