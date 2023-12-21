export function addAdjacentSigns(tree) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    const [operator] = tree;
    if (operator === 'addchain') {
        const [, ...operand] = tree;
        const newOperand = [];
        for (const term of operand) {
            const nterm = addAdjacentSigns(term[1]);
            if (nterm[0] === 'negative') {
                switch (term[0]) {
                    case 'add': {
                        newOperand.push(['sub', nterm[1]]);
                        break;
                    }
                    case 'sub': {
                        newOperand.push(['add', nterm[1]]);
                        break;
                    }
                    default: {
                        newOperand.push([term[0], nterm[1]]);
                    }
                }
            } else {
                newOperand.push([term[0], nterm]);
            }
        }
        return [operator, ...newOperand];
    }
    const [, ...operand] = tree;
    const newOperand = [];
    for (const term of operand) {
        newOperand.push(addAdjacentSigns(term));
    }
    return [operator, ...newOperand];
}
