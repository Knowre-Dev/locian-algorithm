export function rootToExp(tree = null) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    const [operator, ...operand] = tree;
    switch (operator) {
        case 'nthroot': {
            switch (operand[1][0]) {
                case 'mulchain': { // 루트 안이 곱셈식일 경우
                    const [, operand_1] = operand;
                    return operand_1.map(term =>
                        Array.isArray(term)
                            ? [term[0], rootToExp(['nthroot', operand[0], term[1]])]
                            : term);
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
            return rootToExp(['nthroot', ['natural', '2'], ...operand]);
        }
        default: {
            return [operator, ...operand.map(term => rootToExp(term))];
        }
    }
}
