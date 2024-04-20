export function rootToExp(tree = null) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    const [operator, ...operand] = tree;
    switch (operator) {
        case 'nthroot': {
            const [index, radicand] = operand;
            switch (radicand[0]) {
                case 'mulchain': { // 루트 안이 곱셈식일 경우
                    return radicand.map(term =>
                        Array.isArray(term)
                            ? [term[0], rootToExp(['nthroot', index, term[1]])]
                            : term);
                }
                case 'power': { // 루트 안이 거듭제곱일 경우
                    return ['power', radicand[1], ['fraction', radicand[2], index]];
                }
                default: {
                    return ['power', radicand, ['fraction', ['natural', '1'], index]];
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
