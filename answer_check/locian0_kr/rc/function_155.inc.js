import { termExists } from '../rc/sub_functions.js';

// equation 이나 inequatliy의 한뽁을 0으로 만듬  a = b => 0 = b - a,   a < b < c => 0 < b - a < c - a
// equation : ['equation', left, right]
//            a = b => ['equation', ['variable', 'a'],  ['variable', 'b']]
// inequality: ['inequality', term ineq, term, ineq, term]
//            a < b < c => ['inequality', ['variable', 'a'], 'lt', ['variable', 'b'], 'lt', ['variable', 'c']]

// frac{a}{b} => ['fraction', [varialb, a], [variable, b]]

export function makeOneSideOfEqIneqZero(tree = null) {
    const [operator, ...operand] = tree;
    const is_not_appl = !Array.isArray(tree) || !['equation', 'inequality'].includes(operator);
    if (is_not_appl) {
        return tree;
    }
    const zero = JSON.stringify(['natural', '0']);
    switch (operator) {
        case 'equation': { // a = b => 0 = a - b
            const [term_0, ...terms] = operand;
            //  첫째항
            if (JSON.stringify(term_0) === zero) { // 항중에 0이 있는 경우
                return tree;
            }
            let newOperand = [['natural', '0']];
            // 나머지항들
            const term_sub = ['sub', term_0] // 공통으로 빼는 항
            const max = terms.length;
            for (let i = 0; i < max; i++) {
                let term = terms[i];
                if (JSON.stringify(term) === zero) { // 항중에 0이 있는 경우
                    return tree;
                }
                term = subtraction_term(term, term_sub); // a < b =>  0 < b - a
                newOperand = [...newOperand, term];
            }
            return [operator, ...newOperand]; // no side in the chain of inequalities is already identically zero
        }
        case 'inequality': {
            const [term_0, ...operand_1] = operand;
            // 첫째항
            if (JSON.stringify(term_0) === zero) { // 항중에 0이 있는 경우
                return tree;
            }
            let newOperand = [['natural', '0']];
            // 나머지항들
            const term_sub = ['sub', term_0]; // 공통으로 빼는 항
            const max = operand_1.length / 2;
            for (let i = 0; i < max; i++) { // operand_1 = [op, term, op, term]
                const op = operand_1[2 * i]
                let term = operand_1[2 * i + 1];
                if (JSON.stringify(term) === zero) { // 항중에 0이 있는 경우
                    return tree;
                }
                if (!termExists('infinity', term)) { // 항중에  infinityr가 있을 경우
                    term = subtraction_term(term, term_sub);
                }
                newOperand = [...newOperand, op, term];
            }
            return [operator, ...newOperand]; // no side in the chain of inequalities is already identically
        }
    }
    // NOTE: This function does not distribute the minus sign
    //     Use addNegative() right after this function to perform that transformation
}

function subtraction_term(term, term_sub) {
    return term[0] === 'addchain'
        ? [...term, term_sub]
        : ['addchain', ['add', term], term_sub];
}
