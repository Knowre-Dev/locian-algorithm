import { fracSimpVar } from '../rc/function_77.inc.js';
import { sub_deter, sub_mulCommutative } from '../rc/function_126.inc.js';

// addchain을 공통 인수로 묶음 a^2b+abc => ab(a+c)

export function addFactoredFormVar(tree = null) {
    if (!Array.isArray(tree) || !sub_deter(tree)) {
        return tree;
    }

    const [operator, ...operand] = tree;
    if (!['addchain', 'mulchain'].includes(operator)) {
        return sub_mulCommutative([operator, ...operand.map(term => addFactoredFormVar(term))]);
    }
    switch (operator) {
        case 'mulchain': {
            const newOperand = operand.map(term => term[1][0] === 'addchain'
                ? addFactoredFormVar(term)
                : term);
            return sub_mulCommutative([operator, ...newOperand]);
        }
        case 'addchain': {
            const opereand_length = operand.length;
            const gcd = new Map(); //  쵀대공약수
            for (let i = 0; i < opereand_length; i++) {
                const [, term] = operand[i];
                const is_updated = update_exp(term, gcd);
                if (!is_updated) {
                    return sub_mulCommutative(tree);
                }
            }
            let vars = []; // gcd를 변수로 복원
            gcd.forEach((exp, variable) => {
                variable = ['variable', variable];
                if (exp !== 1) {
                    exp = ['natural', exp.toString()];
                    variable = ['power', variable, exp]
                }
                vars = [...vars, variable];
            })
            const vars_gcd = vars.map(term => ['mul', term]);
            const den = vars.length === 1
                ? vars[0]
                : ['mulchain', ...vars_gcd];

            const operand_div = operand.map(term => [term[0], fracSimpVar(['fraction', term[1], den])]);
            const newOperand = [...vars_gcd, ['mul', ['addchain', ...operand_div]]];
            return sub_mulCommutative(['mulchain', ...newOperand]);
        }
    }
}

function update_exp(term, gcd) {
    const [operator, ...operand] = term;
    const vars = new Map();
    if (gcd.size === 0) {
        compute_vars(operator, operand, gcd);
        return gcd.size !== 0;
    }
    compute_vars(operator, operand, vars);
    if (vars.size === 0) {
        return false
    }
    gcd.forEach((exp, variable) => {
        if (vars.has(variable)) {
            gcd.set(variable, Math.min(vars.get(variable), exp));
        } else {
            gcd.delete(variable);
        }
    })
    return gcd.size !== 0;
}

function compute_vars(operator, operand, vars) {
    if (operator === 'mulchain') {
        operand.forEach(term_m => {
            const [, [operator_m, ...operand_m]] = term_m;
            const [variable, exp] = compute_exp(operator_m, operand_m);
            if (vars.has(variable)) {
                vars.set(variable, vars.get(variable) + exp);
            } else if (variable !== '') {
                vars.set(variable, exp);
            }
        })
    } else {
        const [variable, exp] = compute_exp(operator, operand);
        if (variable !== '') {
            vars.set(variable, exp);
        }
    }
}

function compute_exp(operator, operand) {
    let variable = '';
    let exp = 1;
    if (operator === 'variable') {
        [variable] = operand;
    } else if (operator === 'power' && operand[0][0] === 'variable' && operand[1][0] === 'natural') {
        [[, variable], [, exp]] = operand;
        exp = parseInt(exp);
    }
    return [variable, exp]
}
/*
export function addFactoredFormVar(tree = null) {
    if (!Array.isArray(tree) || !sub_deter(tree)) {
        return tree;
    }

    const [operator, ...operand] = tree;
    if (!['addchain', 'mulchain'].includes(operator)) {
        return sub_mulCommutative([operator, ...operand.map(term => addFactoredFormVar(term))]);
    }
    switch (operator) {
        case 'mulchain': {
            const newOperand = operand.map(term => term[1][0] === 'addchain'
                ? addFactoredFormVar(term)
                : term);
            return sub_mulCommutative([operator, ...newOperand]);
        }
        case 'addchain': {
            const [[, term_0], ...operand_1] = operand;
            const gcd = new Map();
            const is_updated = update_exp(term_0, gcd);
            if (!is_updated) {
                return sub_mulCommutative(tree);
            }
            const opereand_1_length = operand_1.length;
            for (let i = 0; i < opereand_1_length; i++) {
                const [, term] = operand_1[i];
                const vars = new Map();
                const is_updated = update_exp(term, vars);
                if (!is_updated) {
                    return sub_mulCommutative(tree);
                }
                gcd.forEach((exp, variable) => {
                    if (vars.has(variable)) {
                        gcd.set(variable, Math.min(vars.get(variable), exp));
                    } else {
                        gcd.delete(variable);
                    }
                })
                if (gcd.size === 0) {
                    return sub_mulCommutative(tree);
                }
            }
            let vars = [];
            gcd.forEach((exp, variable) => {
                variable = ['variable', variable];
                if (exp !== 1) {
                    exp = ['natural', exp.toString()];
                    variable = ['power', variable, exp]
                }
                vars = [...vars, variable];
            })
            const vars_gcd = vars.map(term => ['mul', term]);
            const den = vars.length === 1
                ? vars[0]
                : ['mulchain', ...vars_gcd];

            const operand_div = operand.map(term => [term[0], fracSimpVar(['fraction', term[1], den])]);
            const newOperand = [...vars_gcd, ['mul', ['addchain', ...operand_div]]];
            return sub_mulCommutative(['mulchain', ...newOperand]);
        }
    }
}

function update_exp(term, vars) {
    const [operator, ...operand] = term;
    if (operator === 'mulchain') {
        operand.forEach(term_m => {
            const [, [operator_m, ...operand_m]] = term_m;
            const [variable, exp] = compute_exp(operator_m, operand_m);
            if (vars.has(variable)) {
                vars.set(variable, vars.get(variable) + exp);
            } else if (variable !== '') {
                vars.set(variable, exp);
            }
        })
        return vars.size !== 0;
    }
    const [variable, exp] = compute_exp(operator, operand);
    if (variable !== '') {
        vars.set(variable, exp);
    }
    return vars.size !== 0;
}

function compute_exp(operator, operand) {
    let variable = '';
    let exp = 1;
    if (operator === 'variable') {
        [variable] = operand;
    } else if (operator === 'power' && operand[0][0] === 'variable' && operand[1][0] === 'natural') {
        [[, variable], [, exp]] = operand;
        exp = parseInt(exp);
    }
    return [variable, exp]
}
*/
/*
import { LatexToTree } from '../checkmath.js';
const latex = 'xy - y';
let tree = LatexToTree(latex)
tree = addFactoredFormVar(tree);
const result = JSON.stringify(tree, null, 4);
console.log(result);
*/
