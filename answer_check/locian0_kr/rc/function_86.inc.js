export function decIdentity(tree) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    const [operator] = tree;
    switch (operator) {
        case 'decimal': {
            const [, ...operand] = tree;
            return operand[0].substr(0, 1) === '.' ? [operator, '0' + operand[0]]
                : tree;
        }
        case 'rdecimal': {
            const [, ...operand] = tree;
            return operand[0] === '' ? [operator, '0', operand[1], operand[2]]
                : tree;
        }
        default: {
            const [, ...operand] = tree;
            const newOperand = operand.map(term => decIdentity(term));
            return [operator, ...newOperand];
        }
    }
}
