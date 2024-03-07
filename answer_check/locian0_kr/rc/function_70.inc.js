// import { addNegative } from '../rc/function_71.inc.js';
import { addFactor_1 } from '../rc/function_128.inc.js';

export function addFactoredForm(tree) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    const [operator, ...operand] = tree;
    switch (operator) {
        case 'negative': {
            const term = addFactoredForm(operand[0]);
            return term[0] === 'negative'
                ? term[1]
                : [operator, term];
        }
        case 'mulchain': {
            let add = false;
            let sign = 1;
            let termArr = [];
            let factArr = [];
            let consArr = [];
            operand.forEach((term, key) => {
                if (term[0] === 'mul' && term[1][0] === 'addchain') {
                    const fact = addFactor_1(term[1]);
                    let addchain;
                    const [operator_1] = fact;
                    if (operator_1 === 'mulchain') {
                        consArr = [...consArr, fact[1]];
                        [, , [, addchain]] = fact;
                    } else if (operator_1 === 'addchain') {
                        addchain = fact;
                    }
                    if (addchain[1][0] === 'sub') {
                        const ops = new Map([
                            ['add', 'sub'],
                            ['sub', 'add']
                        ]);
                        addchain = addchain.map(term => ops.get(term[0])
                            ? [ops.get(term[0]), term[1]]
                            : term);
                        // addchain = addNegative(['negative', addchain]);
                        sign *= -1;
                    }
                    factArr = [...factArr, ['mul', addchain]];
                    add = true;
                } else if (term[0] === 'mul' && term[1][0] === 'natural' && key === 0) {
                    consArr = [...consArr, term];
                } else {
                    termArr = [...termArr, term];
                }
            });
            if (!add) {
                return sign === -1
                    ? ['negative', tree]
                    : tree;
            }
            const val = consArr.reduce((a, b) => a * b[1][1], 1);
            const newOperand = val !== 1
                ? [['mul', ['natural', val.toString()]], ...termArr, ...factArr]
                : [...termArr, ...factArr];
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
                const ops = new Map([
                    ['add', 'sub'],
                    ['sub', 'add']
                ]);
                addchain = addchain.map(term => ops.get(term[0])
                    ? [ops.get(term[0]), term[1]]
                    : term);
                // addchain = addNegative(['negative', addchain]);
                sign *= -1;
            }
            return fact[0] === 'mulchain'
                ? sign === -1
                    ? ['negative', ['mulchain', con, ['mul', addchain]]]
                    : ['mulchain', con, ['mul', addchain]]
                : sign === -1
                    ? ['negative', [operator, ...addchain.slice(1)]]
                    : [operator, ...addchain.slice(1)];
        }
        default: {
            return [operator, ...operand.map(term => addFactoredForm(term))];
        }
    }
}
