export function addNegative(tree) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    let [operator, ...operand] = tree;
    if (operator === 'negative' && operand.length === 1) {
        let addchain = addNegative(operand[0]);
        if (addchain[0] === 'addchain') {
            [operator, ...addchain] = addchain;
            const newOperand = addchain.map(term =>
                term[0] === 'add' ? ['sub', term[1]]
                : term[0] === 'sub' ? ['add', term[1]]
                : term);
            return [operator, ...newOperand];
        }
        return tree;
    }
    if (operator === 'addchain') {
        let newOperand = [];
        operand.forEach(term => {
            if (term[0] === 'sub' && term[1][0] === 'addchain') {
                const [, [, ...term_1]] = term;
                const term_11 = term_1.map(inner =>
                    inner[0] === 'add' ? ['sub', inner[1]]
                    : inner[0] === 'sub' ? ['add', inner[1]]
                    : inner);
                newOperand = [...newOperand, ...term_11];
            } else {
                newOperand = [...newOperand, term];
            }
        });
        return [operator, ...newOperand];
    }
    return [operator, ...operand.map(term => addNegative(term))];
}
