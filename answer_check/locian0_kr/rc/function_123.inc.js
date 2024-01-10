export function mulFracSeparation(tree = null) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    const [operator] = tree;

    if (operator === 'fraction') {
        const [, ...operand] = tree;
        if (operand[1][0] === 'mulchain') {
            if (operand[0][0] === 'natural' && operand[0][1] === '1') {
                const operand_1 = operand[1];
                let newOperand = [];
                operand_1.forEach(term_1 => {
                    if (Array.isArray(term_1)) {
                        newOperand = [...newOperand, [term_1[0], ['fraction', operand[0], term_1[1]]]];
                    }
                });
                return ['mulchain', ...newOperand];
            }
            return tree;
        }
        return tree;
    }
    const [, ...operand] = tree;
    return [operator, ...operand.map(term => mulFracSeparation(term))];
}
