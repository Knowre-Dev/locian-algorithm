export function rootToExp(tree = null) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    const [operator] = tree;
    switch (operator) {
        case 'nthroot': {
            const [, ...operand] = tree;
            switch (operand[1][0]) {
                case 'mulchain': { // 루트 안이 곱셈식일 경우
                    let newOperand = [];
                    const operand_1 = operand[1];
                    operand_1.forEach(term => {
                        newOperand = Array.isArray(term) ? [...newOperand, [term[0], rootToExp(['nthroot', operand[0], term[1]])]]
                        : [...newOperand, term];
                    });
                    return newOperand;
                }
                case 'power': { // 루트 안이 거듭제곱일 경우
                    return ['power', operand[1][1], ['fraction', operand[1][2], operand[0]]];
                }
                default: {
                    return ['power', operand[1], ['fraction', ['natural', '1'], operand[0]]];
                }
            }
        }
        case 'squareroot': {
            return rootToExp(['nthroot', ['natural', '2'], ...tree.slice(1)]);
        }
        default: {
            const [, ...operand] = tree;
            return [operator, ...operand.map(term => rootToExp(term))];
        }
    }
}
