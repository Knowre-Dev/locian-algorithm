// 1과 -1 정리
export function mulIdentity(tree) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    const [operator, ...operand] = tree;
    switch (operator) {
        case 'negative': {
            const newOperand = [mulIdentity(operand[0])];
            return newOperand[0][0] === 'negative'
                ? newOperand[0][1]
                : [operator, ...newOperand];
        }
        case 'mulchain': {
            let newOperand = [];
            let is_nega = false;
            const minus_one = JSON.stringify(['negative', ['natural', '1']]);
            const one = JSON.stringify(['natural', '1']);
            operand.forEach(term => {
                const term_1 = JSON.stringify(term[1]);
                if (term_1 === minus_one) {
                    is_nega = true;
                } else if (term_1 !== one) {
                    newOperand = [...newOperand, mulIdentity(term)];
                }
            });
            const new_tree = newOperand.length === 1
                ? newOperand[0][1]
                : [operator, ...newOperand]
            return is_nega
                    ? ['negative', new_tree]
                    : new_tree;
        }
        default: {
            return [operator, ...operand.map(term => mulIdentity(term))];
        }
    }
}
