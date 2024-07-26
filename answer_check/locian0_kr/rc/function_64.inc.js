export function varReverse(tree, types = [null], parent = null) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    let [operator, ...operand] = tree;
    if (!(operator === 'mulchain' && types.includes(parent))) {
        return tree;
    }
    operand = operand.map(term => varReverse(term, types, operator));
    let vars = [];
    for (const term of operand) {
        const is_variable = term[0] === 'mul' && term[1][0] === 'variable';
        if (!is_variable) {
            return [operator, ...operand];
        }
        vars = [...vars, term[1][1]];
    }

    if (vars[0] > vars[vars.length - 1]) {
        vars = vars.reverse();
    }
    return [operator + '_fixed', ...vars.map(vari => ['mul', ['variable', vari]])];
}

/*
import {LatexToTree} from '../checkmath.js';
let latex_1 = 'BCA';
let tree_1 = LatexToTree(latex_1);
let tree_11 = varReverse(tree_1);
let result_1 = JSON.stringify(tree_11, null, 4);
console.log(result_1);
*/
