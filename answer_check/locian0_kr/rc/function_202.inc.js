export function eqIneqDivPi(tree = null) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    const [operator] = tree;
    switch (operator) {
        case 'equation': {
            const [, ...operand] = tree;
            return (checkPi(operand[0]) && checkPi(operand[1])) ? [operator, ...operand.map(term => sub_divPi(term, ['variable', 'pi']))]
                : [operator, ...operand];
        }
        case 'inequality': {
            const [, ...operand] = tree;
            const operand_length = operand.length;
            const max = Math.floor(operand_length / 2);
            for (let i = 0; i <= max; i++) {
                if (!checkPi(operand[2 * i])) {
                    return tree
                }
            }

            let newOperand = [];
            for (let i = 0; i < max; i++) {
                newOperand = [...newOperand, sub_divPi(operand[2 * i], ['variable', 'pi']), operand[2 * i + 1]];
            }
            newOperand = [...newOperand, sub_divPi(operand[2 * max], ['variable', 'pi'])];
            return [operator, ...newOperand];
        }
        default: {
            return tree;
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

import { fracNegative } from '../rc/function_53.inc.js';
import { fracSeparation } from '../rc/function_54.inc.js';
import { fracSimpVar } from '../rc/function_77.inc.js';

export function sub_divPi(tree, div) {
    if (JSON.stringify(tree) === JSON.stringify(['natural', '0'])) {
        return tree;
    }
    return fracSimpVar(fracSeparation(fracNegative(['fraction', tree, div])));
}

export function checkPi(tree) {
    if (Array.isArray(tree)) {
        const [operator, ...operand] = tree;
        switch (operator) {
            case 'variable': {
                if (operand[0] === 'pi') {
                    return true;
                }
                break;
            }
            case 'mulchain': {
                for (const term of operand) {
                    if (term[0] === 'mul' && checkPi(term[1])) {
                        return true;
                    }
                }
                break;
            }
            case 'addchain': {
                let check = true;
                for (const term of operand) {
                    check = checkPi(term);
                    if (!check) {
                        return check;
                    }
                }
                return check;
            }
            case 'negative': {
                let check = true;
                for (const term of operand) {
                    check = checkPi(term);
                    if (!check) {
                        return check;
                    }
                }
                return check;
            }
            case 'power': {
                let check = true;
                for (const term of operand) {
                    check = checkPi(term);
                    if (!check) {
                        return check;
                    }
                }
                return check;
            }
            case 'natural': {
                if (operand[0] === '0') {
                    // 0 이어도 pi 나누기 가능해서 추가
                    return true;
                }
                return false;
            }
            default: {
                let check = true;
                for (const term of operand) {
                    check = checkPi(term);
                    if (check === true) {
                        return check;
                    }
                }
                return check;
            }
        }
    }
    return false;
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
