//
import { addNegative } from '../rc/function_71.inc.js';
import { addFactor_1 } from '../rc/function_128.inc.js';

export function addFactoredForm(tree) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    const [operator] = tree;
    switch (operator) {
        case 'negative': {
            const [, ...operand] = tree;
            const term = addFactoredForm(operand[0]);
            return term[0] === 'negative' ? term[1]
                : [operator, term];
        }
        case 'mulchain': {
            const [, ...operand] = tree;
            let add = false;
            let sign = 1;
            let termArr = [];
            let factArr = [];
            let consArr = [];
            operand.forEach((term, key) => {
                if (term[0] === 'mul') {
                    if (term[1][0] === 'addchain') {
                        const fact = addFactor_1(term[1]);
                        let addchain = [];
                        const [fact_0] = fact;
                        if (fact_0 === 'mulchain') {
                            consArr = [...consArr, fact[1]];
                            addchain = fact[2][1];
                        } else if (fact_0 === 'addchain') {
                            addchain = fact;
                        }
                        if (addchain[1][0] === 'sub') {
                            addchain = addNegative(['negative', addchain]);
                            sign *= -1;
                        }
                        factArr = [...factArr, ['mul', addchain]];
                        add = true;
                    } else if (term[1][0] === 'natural' && key === 0) {
                        consArr = [...consArr, term];
                    } else {
                        termArr = [...termArr, term];
                    }
                } else {
                    termArr = [...termArr, term];
                }
            });
            if (!add) {
                return sign === -1 ? ['negative', tree]
                    : tree;
            }
            const val = consArr.reduce((a, b) => a * b[1][1], 1);
            const newOperand = val !== 1 ? [['mul', ['natural', val.toString()]], ...termArr, ...factArr]
                : [...termArr, ...factArr];
            return sign === -1 ? ['negative', [operator, ...newOperand]]
                : [operator, ...newOperand];
        }
        case 'addchain': {
            const [, ...operand] = tree;
            const fact = addFactor_1(['addchain', ...operand]);
            let con = [];
            let addchain = fact;
            let sign = 1;
            if (fact[0] === 'mulchain') {
                con = fact[1];
                addchain = fact[2][1];
            }
            if (addchain[1][0] === 'sub') {
                addchain = addNegative(['negative', addchain]);
                sign *= -1;
            }
            return fact[0] === 'mulchain' ? sign === -1 ? ['negative', ['mulchain', con, ['mul', addchain]]]
                : ['mulchain', con, ['mul', addchain]]
                : sign === -1 ? ['negative', [operator, ...addchain.slice(1)]]
                : [operator, ...addchain.slice(1)];
        }
        default: {
            const [, ...operand] = tree;
            return [operator, ...operand.map(term => addFactoredForm(term))];
        }
    }
}
