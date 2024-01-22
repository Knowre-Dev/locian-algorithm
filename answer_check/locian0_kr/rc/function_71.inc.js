export function addNegative(tree) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    let [operator, ...operand] = tree;
    if (operator === 'negative' && operand.length === 1) {
        let addchain = addNegative(operand[0]);
        if (addchain[0] === 'addchain') {
            [operator, ...addchain] = addchain;
            let newOperand = [];
            addchain.forEach(term => {
                newOperand = term[0] === 'add' ? [...newOperand, ['sub', term[1]]]
                    : term[0] === 'sub' ? [...newOperand, ['add', term[1]]]
                    : [...newOperand, term];
            });
            return [operator, ...newOperand];
        }
        return tree;
    }
    if (operator === 'addchain') {
        let newOperand = [];
        operand.forEach(term => {
            if (term[0] === 'sub' && term[1][0] === 'addchain') {
                const [, [, ...term_1]] = term;
                term_1.forEach(inner => {
                    newOperand = inner[0] === 'add' ? [...newOperand, ['sub', inner[1]]]
                        : inner[0] === 'sub' ? [...newOperand, ['add', inner[1]]]
                        : [...newOperand, inner]
                });
            } else {
                newOperand = [...newOperand, term];
            }
        });
        return [operator, ...newOperand];
    }
    return [operator, ...operand.map(term => addNegative(term))];
}
