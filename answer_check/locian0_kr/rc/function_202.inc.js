export function eqIneqDivPi(tree = null) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    const operator = tree[0];
    switch (operator) {
        case 'equation': {
            const tree_1 = tree.slice(1);
            if (checkPi(tree_1[0]) && checkPi(tree_1[1])) {
                const newOperand = [];
                for (const v of tree_1) {
                    newOperand.push(sub_divPi(v, ['variable', 'pi']));
                }
                return [operator].concat(newOperand);
            }
            return [operator].concat(tree_1);
        }
        case 'inequality': {
            const tree_1 = tree.slice(1);
            let check = true;
            const tree_1_length = tree_1.length
            for (let i = 0; i < tree_1_length; i++) {
                if (i % 2 === 0) {
                    check = checkPi(tree_1[i]);
                    if (check === false) {
                        break;
                    }
                }
            }
            if (!check) {
                return [operator].concat(tree_1);
            }
            const newOperand = [];
            for (let i = 0; i < tree_1_length; i++) {
                i % 2 === 0 ? newOperand.push(sub_divPi(tree_1[i], ['variable', 'pi']))
                : newOperand.push(tree_1[i])
            }
            return [operator].concat(newOperand);
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
    if (tree[0] === 'natural' && tree[1] === '0') {
        return tree;
    }

    const frac = fracNegative(['fraction', tree, div]);
    const separation = fracSeparation(frac);
    return fracSimpVar(separation);
}

export function checkPi(tree) {
    if (Array.isArray(tree)) {
        const operator = tree[0];
        const tree_1 = tree.slice(1);
        if (operator === 'variable') {
            if (tree_1[0] === 'pi') {
                return true;
            }
        } else if (operator === 'mulchain') {
            for (const t of tree_1) {
                if (t[0] === 'mul' && checkPi(t[1])) {
                    return true;
                }
            }
        } else if (operator === 'addchain') {
            let check = true;
            for (const t of tree_1) {
                check = checkPi(t);
                if (check === false) {
                    break;
                }
            }
            return check;
        } else if (operator === 'negative') {
            let check = true;
            for (const t of tree_1) {
                check = checkPi(t);
                if (check === false) {
                    break;
                }
            }
            return check;
        } else if (operator === 'power') {
            let check = true;
            for (const t of tree_1) {
                check = checkPi(t);
                if (check === false) {
                    break;
                }
            }
            return check;
        } else if (operator === 'natural') {
            if (tree_1[0] === '0') {
                // 0 이어도 pi 나누기 가능해서 추가
                return true;
            } else {
                return false;
            }
        } else {
            let check = true;
            for (const t of tree_1) {
                check = checkPi(t);
                if (check === true) {
                    break;
                }
            }
            return check;
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
