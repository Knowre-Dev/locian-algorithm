import { addNegative } from '../rc/function_71.inc.js';

export function addFactorNegative(tree) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    const [operator] = tree;

    switch (operator) {
        case 'negative': {
            const [, ...operand] = tree;
            const newOperand = [];
            newOperand.push(addFactorNegative(operand[0]));
            if (newOperand[0][0] === 'negative') {
                return newOperand[0][1];
            }
            return [operator, ...newOperand];
        }
        case 'mulchain': {
            const [, ...operand] = tree;
            let sign = 1;
            const termArr = [];
            const factArr = [];
            for (const term of operand) {
                if (term[0] === 'mul') {
                    if (term[1][0] === 'addchain') {
                        let addchain = term[1];
                        if (addchain[1][0] === 'sub') {
                            addchain = addNegative(['negative', addchain]);
                            sign *= -1;
                        }
                        factArr.push(['mul', addchain]);
                    } else {
                        termArr.push(term);
                    }
                } else {
                    termArr.push(term);
                }
            }
            const newOperand = [];
            for (const term of termArr) {
                newOperand.push(term);
            }
            for (const term of factArr) {
                newOperand.push(term);
            }
            return sign === -1 ? ['negative', [operator, ...newOperand]]
                : [operator, ...newOperand];
        }
        case 'addchain': {
            const [, ...operand] = tree;
            let sign = 1;
            let addchain = ['addchain', ...operand];
            if (addchain[1][0] === 'sub') {
                addchain = addNegative(['negative', addchain]);
                sign *= -1;
            }
            return sign === -1 ? ['negative', addchain] : addchain;
        }
        default: {
            const [, ...operand] = tree;
            const newOperand = operand.map(term => addFactorNegative(term));
            return [operator, ...newOperand];
        }
    }
}
