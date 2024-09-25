// addchain 부호 정리 -(a+b)+c => -a-b+c
export function addNegative(tree) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    let [operator, ...operand] = tree;
    if (!['negative', 'addchain'].includes(operator)) {
        return [operator, ...operand.map(term => addNegative(term))];
    }
    const ops = new Map([
        ['add', 'sub'],
        ['sub', 'add']
    ]);
    switch (operator) {
        case 'negative': {
            let addchain = addNegative(operand[0]);
            [operator, ...addchain] = addchain;
            if (operator !== 'addchain') {
                return tree;
            }
            const newOperand = addchain.map(term => ops.has(term[0])
                ? [ops.get(term[0]), term[1]]
                : term);
            return [operator, ...newOperand];
        }
        case 'addchain': {
            let newOperand = [];
            operand.forEach(term => {
                if (term[0] === 'sub' && term[1][0] === 'addchain') {
                    let [, [, ...terms_1]] = term;
                    terms_1 = terms_1.map(term_1 => ops.has(term_1[0])
                        ? [ops.get(term_1[0]), term_1[1]]
                        : term_1);
                    newOperand = [...newOperand, ...terms_1];
                } else {
                    newOperand = [...newOperand, term];
                }
            });
            return [operator, ...newOperand];
        }
    }
}
