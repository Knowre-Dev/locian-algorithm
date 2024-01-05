export function addPolyZero(tree) {
    if (!Array.isArray(tree)) {
        return tree;
    }
    const [operator] = tree;
    if (operator === 'addchain') {
        const [, ...operand] = tree;
        const newOperand = [];
        operand.forEach(term => {
            term[0] === 'sub' ? checkZeroEquiv(term[1]) ? newOperand.push(['add', term[1]])
                : newOperand.push(term)
            : newOperand.push(term);
        });
        return [operator, ...newOperand];
    }
    const [, ...operand] = tree;
    const newOperand = operand.map(term => addPolyZero(term));
    return [operator, ...newOperand];
}

export function checkZeroEquiv(tree) {
    if (!Array.isArray(tree)) {
        return false;
    }

    const [operator] = tree;
    switch (operator) {
        case 'fraction': {
            return checkZeroEquiv(tree[1]);
        }
        case 'mulchain': {
            const [, operand] = tree;
            for (const term of operand) {
                if (term[0] === 'natural' && term[1] === '0') {
                    return true;
                }
            }
            return false;
        }
        case 'natural': {
            const [, ...operand] = tree;
            return operand[0] === '0';
        }
        default: {
            return false;
        }
    }
}
