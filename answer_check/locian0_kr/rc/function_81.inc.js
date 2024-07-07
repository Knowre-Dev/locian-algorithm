// import { addNegative } from '../rc/function_71.inc.js';
import { sign_change } from '../rc/sub_functions.js';
export function addFactorNegative(tree) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    const [operator, ...operand] = tree;
    switch (operator) {
        case 'negative': {
            const term = addFactorNegative(operand[0]);
            return term[0] === 'negative'
                ? term[1]
                : [operator, term];
        }
        case 'mulchain': {
            let sign = 1;
            let others = [];
            let facts = [];
            operand.forEach(term => {
                const [op, term_1] = term;
                if (op === 'mul' && term_1[0] === 'addchain') {
                    let addchain = term_1;
                    if (addchain[1][0] === 'sub') {
                        addchain = sign_change(addchain);
                        sign *= -1;
                    }
                    facts = [...facts, ['mul', addchain]];
                } else {
                    others = [...others, term];
                }
            });
            const new_tree = [operator, ...others, ...facts];
            return sign === -1
                ? ['negative', new_tree]
                : new_tree;
        }
        case 'addchain': {
            return operand[0][0] === 'sub'
                ? ['negative', sign_change(tree)]
                : tree;
        }
        default: {
            return [operator, ...operand.map(term => addFactorNegative(term))];
        }
    }
}
