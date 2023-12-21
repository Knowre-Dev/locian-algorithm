export function decIdentity(tree) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    const [operator] = tree;
    switch (operator) {
        case 'decimal': {
            const [, ...operand] = tree;
            if (operand[0].substr(0, 1) === '.') {
                return [operator, '0' + operand[0]];
            }
            return tree;
        }
        case 'rdecimal': {
            const [, ...operand] = tree;
            if (operand[0] === '') {
                return [operator, '0', operand[1], operand[2]];
            }
            return tree;
        }
        default: {
            const [, ...operand] = tree;
            const newOperand = [];
            for (const term of operand) {
                newOperand.push(decIdentity(term));
            }
            return [operator, ...newOperand];
        }
    }
}
