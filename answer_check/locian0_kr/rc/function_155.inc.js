import { termExists } from '../rc/sub_functions.js';
// import { termExists } from '../rc/function_152.inc.js';

export function makeOneSideOfEqIneqZero(tree = null) {
    if (!Array.isArray(tree) || !['equation', 'inequality'].includes(tree[0])) {
        return tree;
    }
    const [operator, ...operand] = tree;
    switch (operator) {
        case 'equation': { // a = b => 0 = a - b
            const zero = JSON.stringify(['natural', '0']);
            if (operand.some(term => JSON.stringify(term) === zero)) {
                return tree;
            }
            // From here on, we are guaranteed that
            // no side in the chain of equalities is already identically zero
            let newOperand = [['natural', '0']];
            const [, ...operand_1] = operand;
            operand_1.forEach(term => {
                const temp = term[0] === 'addchain'
                    ? term
                    : ['addchain', ['add', term]];
                newOperand = [...newOperand, [...temp, ['sub', operand[0]]]];
            })
            return [operator, ...newOperand];
        }
        case 'inequality': {
            const zero = JSON.stringify(['natural', '0']);
            let max = Math.floor(operand.length / 2);
            for (let i = 0; i <= max; i++) {
                if (JSON.stringify(operand[2 * i]) === zero) { // a < b < 0 < c
                    return tree;
                }
            }
            // From here on, we are guaranteed that
            // no side in the chain of inequalities is already identically zero

            let newOperand = [['natural', '0']];
            const [term_0, ...operand_1] = operand;
            max = Math.floor(operand_1.length / 2);
            for (let i = 0; i < max; i++) { // a < b < c => 0 < b - a < c - a
                newOperand = [...newOperand, operand_1[2 * i]];
                let term = operand_1[2 * i + 1];
                if (!termExists('infinity', term)) {
                    term = term[0] === 'addchain'
                        ? [...term, ['sub', term_0]]
                        : ['addchain', ['add', term], ['sub', term_0]];
                }
                newOperand = [...newOperand, term];
            }
            return [operator, ...newOperand];
        }
    }
    // NOTE: This function does not distribute the minus sign
    //     Use addNegative() right after this function to perform that transformation
}
