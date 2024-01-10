export function mulIdentity(tree) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    const [operator] = tree;
    switch (operator) {
        case 'negative': {
            const [, ...operand] = tree;
            const newOperand = [mulIdentity(operand[0])];
            return newOperand[0][0] === 'negative' ? newOperand[0][1]
                : [operator, ...newOperand];
        }
        case 'mulchain': {
            const [, ...operand] = tree;
            let newOperand = [];
            let sign = 1;
            for (const term of operand) {
                if (term[1][0] === 'natural' && term[1][1] === '1') {
                    continue;
                } else if (term[1][0] === 'negative' && term[1][1][0] === 'natural' && term[1][1][1] === '1') {
                    sign = -1;
                } else {
                    newOperand = [...newOperand, mulIdentity(term)];
                }
            }
            return newOperand.length === 1 ? sign === -1 ? ['negative', newOperand[0][1]]
                    : newOperand[0][1]
                : sign === -1 ? ['negative', [operator, ...newOperand]]
                    : [operator, ...newOperand];
        }
        default: {
            const [, ...operand] = tree;
            return [operator, ...operand.map(term => mulIdentity(term))];
        }
    }
}
