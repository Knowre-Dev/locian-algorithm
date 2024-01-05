export function addNegative(tree) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    let [operator, ...operand] = tree;
    if (operator === 'negative' && operand.length === 1) {
        let addchain = addNegative(operand[0]);
        if (addchain[0] === 'addchain') {
            [operator, ...addchain] = addchain;
            const newOperand = [];
            addchain.forEach(term => {
                term[0] === 'add' ? newOperand.push(['sub', term[1]])
                : term[0] === 'sub' ? newOperand.push(['add', term[1]])
                : newOperand.push(term)
            });
            return [operator, ...newOperand];
        }
        return tree;
    }
    if (operator === 'addchain') {
        const newOperand = [];
        operand.forEach(term => {
            if (term[0] === 'sub' && term[1][0] === 'addchain') {
                const [, ...term_1] = term[1];
                term_1.forEach(inner => {
                    inner[0] === 'add' ? newOperand.push(['sub', inner[1]])
                    : inner[0] === 'sub' ? newOperand.push(['add', inner[1]])
                    : newOperand.push(inner)
                });
            } else {
                newOperand.push(term);
            }
        });
        return [operator, ...newOperand];
    }
    const newOperand = operand.map(term => addNegative(term));
    return [operator, ...newOperand];
}
