import { termExists } from '../rc/sub_functions.js';
// import { termExists } from '../rc/function_152.inc.js';

export function makeOneSideOfEqIneqZero(tree = null) {
    const is_not_appl = !Array.isArray(tree) || !['equation', 'inequality'].includes(tree[0]);
    if (is_not_appl) {
        return tree;
    }
    const [operator, ...operand] = tree;
    switch (operator) {
        case 'equation': { // a = b => 0 = a - b
            const zero = JSON.stringify(['natural', '0']);
            const [term_0, ...terms] = operand;
            if (JSON.stringify(term_0) === zero) {
                return tree;
            }
            let newOperand = [['natural', '0']];
            const term_sub = ['sub', term_0]
            const max = terms.length;
            for (let i = 0; i < max; i++) {
                let term = terms[i];
                if (JSON.stringify(term) === zero) {
                    return tree;
                }
                term = term_new(term, term_sub);
                newOperand = [...newOperand, term];
            }
            return [operator, ...newOperand]; // no side in the chain of inequalities is already identically zero
        }
        case 'inequality': {
            const zero = JSON.stringify(['natural', '0']);
            const [term_0, ...operand_1] = operand;
            if (JSON.stringify(term_0) === zero) {
                return tree;
            }
            const max = operand_1.length / 2;
            let newOperand = [['natural', '0']];
            const term_sub = ['sub', term_0];
            for (let i = 0; i < max; i++) {
                const op = operand_1[2 * i]
                let term = operand_1[2 * i + 1];
                if (JSON.stringify(term) === zero) {
                    return tree;
                }
                if (!termExists('infinity', term)) {
                    term = term_new(term, term_sub);
                }
                newOperand = [...newOperand, op, term];
            }
            return [operator, ...newOperand]; // no side in the chain of inequalities is already identically
        }
    }
    // NOTE: This function does not distribute the minus sign
    //     Use addNegative() right after this function to perform that transformation
}

function term_new(term, term_sub) {
    return term[0] === 'addchain'
        ? [...term, term_sub]
        : ['addchain', ['add', term], term_sub];
}
