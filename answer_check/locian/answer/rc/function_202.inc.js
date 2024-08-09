import { fracNegative } from '../rc/function_53.inc.js';
import { fracSeparation } from '../rc/function_54.inc.js';
import { fracSimpVar } from '../rc/function_77.inc.js';

export function eqIneqDivPi(tree = null) { // 등식, 부둥식에서 각 항을  pi로 나눔
    if (!Array.isArray(tree)) {
        return tree;
    }

    const [operator, ...operand] = tree;
    if (!['equation', 'inequality'].includes(operator)) {
        return tree;
    }
    switch (operator) {
        case 'equation': {
            return operand.every(term => checkPi(term))
                ? [operator, ...operand.map(term => divide_by_pi(term))]
                : tree;
        }
        case 'inequality': {
            const term = operand[0];
            if (!checkPi(term)) {
                return tree;
            }
            const term_new = divide_by_pi(term);
            let newOperand = [term_new];
            const max = Math.floor(operand.length / 2);
            for (let i = 1; i <= max; i++) { // 부둥호 아닌 부분만 pi로 나눔
                const term = operand[2 * i];
                if (!checkPi(term)) {
                    return tree
                }
                const term_new = divide_by_pi(term);
                newOperand = [...newOperand, operand[2 * i - 1], term_new];
            }
            return [operator, ...newOperand];
        }
    }
}
/*
import {LatexToTree} from '../checkmath.js';
let latex_1 = '2\\pi x=0';
let latex_2 = '2x=0';
let tree_1 = LatexToTree(latex_1);
let tree_2 = LatexToTree(latex_2);
let tree_11 = eqIneqDivPi(tree_1);
let tree_21 = eqIneqDivPi(tree_2);
let result_1 = JSON.stringify(tree_11, null, 4);
let result_2 = JSON.stringify(tree_21, null, 4);
console.log(result_1 === result_2);
console.log(JSON.stringify(tree_11, null, 4));
console.log(JSON.stringify(tree_21, null, 4));
*/
/*
export function sub_divPi(tree, div) {
    return JSON.stringify(tree) === JSON.stringify(['natural', '0'])
        ? tree
        : fracSimpVar(fracSeparation(fracNegative(['fraction', tree, div])));
}
*/
export function divide_by_pi(term) {
    const frac_function = tree_1 => fracSimpVar(fracSeparation(fracNegative(tree_1)));
    const zero = JSON.stringify(['natural', '0']);
    const pi = ['variable', 'pi'];

    return JSON.stringify(term) === zero
        ? term
        : frac_function(['fraction', term, pi]);
}

export function checkPi(tree) {
    if (!Array.isArray(tree)) {
        return false;
    }
    const [operator, ...operand] = tree;
    switch (operator) {
        case 'natural': {
            // 0 이어도 pi 나누기 가능해서 추가
            return operand[0] === '0';
        }
        case 'variable': {
            return operand[0] === 'pi';
        }
        case 'mulchain': {
            return operand.some(term => term[0] === 'mul' && checkPi(term[1]));
        }
        default: {
            return operand.some(term => checkPi(term));
        }
    }
}

/*
import {LatexToTree} from '../checkmath.js';
let latex_1 = '125\\pi \\le \\frac{25}{3}\\pi x\\le 200\\pi ';
let latex_2 = '125\\le \\frac{25}3{x}\\le 200';
let tree_1 = LatexToTree(latex_1);
let tree_2 = LatexToTree(latex_2);
let tree_11 = checkPi(tree_1);
let tree_21 = checkPi(tree_2);
let result_1 = JSON.stringify(tree_11, null, 4);
let result_2 = JSON.stringify(tree_21, null, 4);
console.log(result_1 === result_2);
console.log(JSON.stringify(tree_11, null, 4));
console.log(JSON.stringify(tree_21, null, 4));
*/
