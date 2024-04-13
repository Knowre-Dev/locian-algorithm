export function addNegative(tree) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    let [operator, ...operand] = tree;
    if (!['negative', 'addchain'].includes(operator)) {
        return [operator, ...operand.map(term => addNegative(term))];
    }
    switch (operator) {
        case 'negative': {
            let addchain = addNegative(operand[0]);
            [operator, ...addchain] = addchain;
            if (operator !== 'addchain') {
                return tree;
            }
            const ops = new Map([
                ['add', 'sub'],
                ['sub', 'add']
            ]);
            const newOperand = addchain.map(term => ops.has(term[0])
                ? [ops.get(term[0]), term[1]]
                : term);
            return [operator, ...newOperand];
        }
        case 'addchain': {
            let newOperand = [];
            operand.forEach(term => {
                if (term[0] === 'sub' && term[1][0] === 'addchain') {
                    let [, [, ...term_1]] = term;
                    const ops = new Map([
                        ['add', 'sub'],
                        ['sub', 'add']
                    ]);
                    term_1 = term_1.map(inner => ops.has(inner[0])
                        ? [ops.get(inner[0]), inner[1]]
                        : inner);
                    newOperand = [...newOperand, ...term_1];
                } else {
                    newOperand = [...newOperand, term];
                }
            });
            return [operator, ...newOperand];
        }
    }
}
