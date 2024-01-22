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
            const minus_one = JSON.stringify(['negative', ['natural', '1']]);
            const one = JSON.stringify(['natural', '1']);
            operand.forEach(term => {
                const term_1 = JSON.stringify(term[1]);
                if (term_1 === minus_one) {
                    sign = -1;
                } else if (term_1 !== one) {
                    newOperand = [...newOperand, mulIdentity(term)];
                }
            });
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
