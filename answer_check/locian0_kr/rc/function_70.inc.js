// import { addNegative } from '../rc/function_71.inc.js';
import { addFactor_1 } from '../rc/function_128.inc.js';
import { sign_change } from '../rc/sub_functions.js';
export function addFactoredForm(tree) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    const [operator, ...operand] = tree;
    switch (operator) {
        case 'negative': {
            const term = addFactoredForm(operand[0]);
            return term[0] === 'negative' // negtive  제거
                ? term[1]
                : [operator, term];
        }
        case 'mulchain': {
            let is_addchain = false;
            let sign = 1;
            let terms = [];
            let facts = [];
            let cons = [];
            operand.forEach((term, key) => {
                if (term[0] === 'mul' && term[1][0] === 'addchain') {
                    is_addchain = true;
                    const fact = addFactor_1(term[1]);
                    let addchain;
                    const [operator_1] = fact;
                    if (operator_1 === 'mulchain') {
                        cons = [...cons, fact[1]];
                        [, , [, addchain]] = fact;
                    } else if (operator_1 === 'addchain') {
                        addchain = fact;
                    }
                    if (addchain[1][0] === 'sub') {
                        addchain = sign_change(addchain);
                        sign *= -1;
                    }
                    facts = [...facts, ['mul', addchain]];
                } else if (term[0] === 'mul' && term[1][0] === 'natural' && key === 0) {
                    cons = [...cons, term];
                } else {
                    terms = [...terms, term];
                }
            });
            if (!is_addchain) {
                return sign === -1
                    ? ['negative', tree]
                    : tree;
            }
            const val = cons.reduce((a, b) => a * b[1][1], 1);
            const newOperand = val !== 1
                ? [['mul', ['natural', val.toString()]], ...terms, ...facts]
                : [...terms, ...facts];
            return sign === -1
                ? ['negative', [operator, ...newOperand]]
                : [operator, ...newOperand];
        }
        case 'addchain': {
            const fact = addFactor_1(tree);
            let con = [];
            let addchain = fact;
            let sign = 1;
            if (fact[0] === 'mulchain') {
                [, con, [, addchain]] = fact;
            }
            if (addchain[1][0] === 'sub') {
                addchain = sign_change(addchain);
                sign *= -1;
            }
            return fact[0] === 'mulchain'
                ? sign === -1
                    ? ['negative', ['mulchain', con, ['mul', addchain]]]
                    : ['mulchain', con, ['mul', addchain]]
                : sign === -1
                    ? ['negative', addchain]
                    : addchain;
        }
        default: {
            return [operator, ...operand.map(term => addFactoredForm(term))];
        }
    }
}
