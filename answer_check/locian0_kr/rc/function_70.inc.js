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
            let termArr = [];
            let consArr = [];
            let factArr = [];
            const [, ...operand] = tree;
            let add = false;
            let sign = 1;
            const operand_entries = operand.entries();
            for (const [key, term] of operand_entries) {
                if (term[0] === 'mul') {
                    if (term[1][0] === 'addchain') {
                        const fact = addFactor_1(term[1]);
                        let addchain;
                        switch (fact[0]) {
                            case 'mulchain': {
                                consArr = [...consArr, fact[1]];
                                addchain = fact[2][1];
                                break;
                            }
                            case 'addchain': {
                                addchain = fact;
                                break;
                            }
                        }
                        if (addchain[1][0] === 'sub') {
                            addchain = addNegative(['negative', addchain]);
                            sign = -1 * sign;
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
            }
            if (add === false) {
                return sign === -1 ? ['negative', tree] : tree;
            }
            let newOperand = [];
            let val = 1;
            consArr.forEach(term => {
                val *= parseInt(term[1][1]);
            });
            const con = ['mul', ['natural', val.toString()]];
            if (val !== 1) {
                newOperand = [...newOperand, con];
            }
            newOperand = [...newOperand, ...termArr, ...factArr];
            return sign === -1 ? ['negative', [operator, ...newOperand]]
                : [operator, ...newOperand];
        }
        case 'addchain': {
            const [, ...operand] = tree;
            const fact = addFactor_1(['addchain', ...operand]);
            let con;
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
            if (fact[0] === 'mulchain') {
                return sign === -1 ? ['negative', ['mulchain', con, ['mul', addchain]]]
                    : ['mulchain', con, ['mul', addchain]];
            }
            return sign === -1 ? ['negative', [operator, ...addchain.slice(1)]]
                : [operator, ...addchain.slice(1)];
        }
        default: {
            const [, ...operand] = tree;
            return [operator, ...operand.map(term => addFactoredForm(term))];
        }
    }
}
