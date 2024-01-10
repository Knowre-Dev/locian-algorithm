import { termExists } from '../rc/function_152.inc.js';

export function makeOneSideOfEqIneqZero(tree = null) {
    if (!Array.isArray(tree)) {
        return tree;
    }
    const [operator] = tree;
    switch (operator) {
        case 'equation': {
            const [, ...operand] = tree;
            for (const subtree of operand) {
                if (JSON.stringify(subtree) === JSON.stringify(['natural', '0'])) {
                    return tree;
                }
            }
            // From here on, we are guaranteed that
            // no side in the chain of equalities is already identically zero
            let newOperand = [['natural', '0']];
            const [, ...operand_operand] = operand;
            operand_operand.forEach(term => {
                let temp = term;
                if (term[0] !== 'addchain') {
                    temp = ['addchain', ['add', term]];
                }
                temp = [...temp, ['sub', operand[0]]];
                newOperand = [...newOperand, temp];
            })
            return [operator, ...newOperand];
        }
        case 'inequality': {
            const [, ...operand] = tree;
            for (const subtree of operand) {
                if (JSON.stringify(subtree) === JSON.stringify(['natural', '0'])) {
                    return [operator, ...operand];
                }
            }
            // From here on, we are guaranteed that
            // no side in the chain of inequalities is already identically zero

            let newOperand = [['natural', '0']];
            const [, ...operand_operand] = operand;
            operand_operand.forEach(term => {
                let temp = term;
                if (!['lt', 'le', 'ge', 'gt'].includes(term) &&
                    !termExists('infinity', term)) {
                    if (term[0] !== 'addchain') {
                        temp = ['addchain', ['add', term]];
                    }
                    temp = [...temp, ['sub', operand[0]]];
                }
                newOperand = [...newOperand, temp];
            });
            return [operator, ...newOperand];
        }
        default: {
            return tree;
        }
    }
    // NOTE: This function does not distribute the minus sign
    //     Use addNegative() right after this function to perform that transformation
}
