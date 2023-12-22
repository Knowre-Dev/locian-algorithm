export function addNegative(tree) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    let [operator, ...operand] = tree;
    if (operator === 'negative' && operand.length === 1) {
        const addchain = addNegative(operand[0]);
        if (addchain[0] === 'addchain') {
            operator = addchain.shift();
            const newOperand = [];
            for (const term of addchain) {
                term[0] === 'add' ? newOperand.push(['sub', term[1]])
                : term[0] === 'sub' ? newOperand.push(['add', term[1]])
                : newOperand.push(term)
            }
            return [operator, ...newOperand];
        }
        return tree;
    }
    if (operator === 'addchain') {
        const newOperand = [];
        for (const term of operand) {
            if (term[0] === 'sub' && term[1][0] === 'addchain') {
                const [, ...term_1] = term[1];
                for (const inner of term_1) {
                    inner[0] === 'add' ? newOperand.push(['sub', inner[1]])
                    : inner[0] === 'sub' ? newOperand.push(['add', inner[1]])
                    : newOperand.push(inner)
                }
            } else {
                newOperand.push(term);
            }
        }
        return [operator, ...newOperand];
    }
    const newOperand = operand.map(term => addNegative(term));
    return [operator, ...newOperand];
}
