import { termExists } from '../rc/function_152.inc.js';

export function makeOneSideOfEqIneqZero(tree = null) {
    if (!Array.isArray(tree)) {
        return tree;
    }
    const [operator, ...operand] = tree;
    switch (operator) {
        case 'equation': {
            const zero = JSON.stringify(['natural', '0']);
            if (operand.some(term => JSON.stringify(term) === zero)) {
                return tree;
            }
            // From here on, we are guaranteed that
            // no side in the chain of equalities is already identically zero
            let newOperand = [['natural', '0']];
            const [, ...operand_operand] = operand;
            operand_operand.forEach(term => {
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
                if (JSON.stringify(operand[2 * i]) === zero) {
                    return tree;
                }
            }
            // From here on, we are guaranteed that
            // no side in the chain of inequalities is already identically zero

            let newOperand = [['natural', '0']];
            const [term_0, ...operand_1] = operand;
            max = Math.floor(operand_1.length / 2);
            for (let i = 0; i < max; i++) {
                newOperand = [...newOperand, operand_1[2 * i]];
                let term = operand_1[2 * i + 1];
                if (!termExists('infinity', term)) {
                    term = term[0] !== 'addchain'
                        ? ['addchain', ['add', term], ['sub', term_0]]
                        : [...term, ['sub', term_0]];
                }
                newOperand = [...newOperand, term];
            }
            return [operator, ...newOperand];
        }
        default: {
            return tree;
        }
    }
    // NOTE: This function does not distribute the minus sign
    //     Use addNegative() right after this function to perform that transformation
}
