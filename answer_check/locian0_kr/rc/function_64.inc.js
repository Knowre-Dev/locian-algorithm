export function varReverse(tree, types = [null], parent = null) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    const [operator, ...operand] = tree;
    const operand_entries = operand.entries();
    for (const [key, term] of operand_entries) {
        operand[key] = varReverse(term, types, operator);
    }
    if (operator === 'mulchain' && types.includes(parent)) {
        let vars = [];

        for (const term of operand) {
            const is_variable = (term[0] === 'mul' && term[1][0] === 'variable' && term.length === 2);
            if (!is_variable) {
                return [operator, ...operand];
            }
            vars.push(term[1][1]);
        }

        if (vars[0] > vars[vars.length - 1]) {
            vars = vars.reverse();
        }

        const result = [];

        for (const vari of vars) {
            result.push(['mul', ['variable', vari]]);
        }

        return [operator + '_fixed', ...result];
    }

    return [operator, ...operand];
}

/*
import {LatexToTree} from '../checkmath.js';
let latex_1 = 'BCA';
let tree_1 = LatexToTree(latex_1);
let tree_11 = varReverse(tree_1);
let result_1 = JSON.stringify(tree_11, null, 4);
console.log(result_1);
*/
