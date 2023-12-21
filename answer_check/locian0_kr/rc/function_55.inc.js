export function addIdentity(tree) {
    if (!Array.isArray(tree)) {
        return tree;
    }
    const [operator] = tree;
    if (operator === 'addchain') {
        const [, ...operand] = tree;
        const newOperand = [];
        for (const term of operand) {
            if (!(term[1][0] === 'natural' && term[1][1] === '0')) {
                newOperand.push(term);
            }
        }
        const newOperand_length = newOperand.length;
        switch (newOperand_length) {
            case 0: {
                return ['natural', '0'];
            }
            case 1: {
                switch (newOperand[0][0]) {
                    case 'add': {
                        return newOperand[0][1];
                    }
                    case 'sub': {
                        return ['negative', newOperand[0][1]];
                    }
                    case 'addsub': {
                        return ['pm', newOperand[0][1]];
                    }
                    case 'subadd': {
                        return ['mp', newOperand[0][1]];
                    }
                    default: {
                        return [operator, ...newOperand];
                    }
                }
            }
            default: {
                return [operator, ...newOperand];
            }
        }
    }
    const [, ...operand] = tree;
    const newOperand = operand.map(term => addIdentity(term));
    return [operator, ...newOperand];
}
