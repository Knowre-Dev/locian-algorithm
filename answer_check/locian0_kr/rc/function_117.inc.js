import { fracSimpVar } from '../rc/function_77.inc.js';
import { sub_deter, sub_mulCommutative } from '../rc/function_126.inc.js';
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
            const gcd = new Map();
            const [[, term_0], ...operand_1] = operand;
            switch (term_0[0]) {
                case 'variable': {
                    const [, variable] = term_0
                    gcd.set(variable, 1);
                    break;
                }
                case 'mulchain': {
                    const [, ...terms_mul] = term_0;
                    terms_mul.forEach(term_mul => {
                        const [, term_mul_1] = term_mul
                        if (term_mul_1[0] === 'variable') {
                            const [, variable] = term_mul_1;
                            if (gcd.has(variable)) {
                                gcd.set(variable, gcd.get(variable) + 1);
                            } else {
                                gcd.set(variable, 1);
                            }
                        } else if (term_mul_1[0] === 'power' && term_mul_1[1][0] === 'variable' && term_mul_1[2][0] === 'natural') {
                            let [, [, variable], [, exp]] = term_mul_1;
                            exp = parseInt(exp);
                            if (gcd.has(variable)) {
                                gcd.set(variable, gcd.get(variable) + exp);
                            } else {
                                gcd.set(variable, exp);
                            }
                        }
                    });
                    break;
                }
                case 'power': {
                    let [, base, exp] = term_0;
                    if (!(base[0] === 'variable' && exp[0] === 'natural')) {
                        return sub_mulCommutative(tree);
                    }
                    const [, variable] = base;
                    exp = parseInt(exp[1]);
                    gcd.set(variable, exp);
                    break;
                }
                default: {
                    return sub_mulCommutative(tree);
                }
            }
            const opereand_1_length = operand_1.length;
            for (let i = 0; i < opereand_1_length; i++) {
                const [, term] = operand_1[i];
                switch (term[0]) {
                    case 'variable': {
                        const [, variable] = term
                        if (!gcd.has(variable)) {
                            gcd.delete(variable);
                        }
                        break;
                    }
                    case 'mulchain': {
                        const [, [, ...terms]] = operand_1[i];
                        const vars = new Map();
                        terms.forEach(term => {
                            const [, term_1] = term
                            if (term_1[0] === 'variable') {
                                const [, variable] = term_1;
                                if (vars.has(variable)) {
                                    vars.set(variable, vars.get(variable) + 1);
                                } else {
                                    vars.delete(variable);
                                }
                            } else if (term_1[0] === 'power' && term_1[1][0] === 'variable' && term_1[2][0] === 'natural') {
                                let [, [, variable], [, exp]] = term_1;
                                exp = parseInt(exp);
                                if (vars.has(variable)) {
                                    vars.set(variable, vars.get(variable) + exp);
                                } else {
                                    vars.delete(variable);
                                }
                            }
                        })
                        vars.forEach((variable, exp) => {
                            if (gcd.has(variable)) {
                                gcd.set(variable, Math.min(gcd.get(variable), exp));
                            } else {
                                gcd.delete(variable);
                            }
                        })
                        break;
                    }
                    case 'power': {
                        let [, base, exp] = term;
                        if (!(base[0] === 'variable' && exp[0] === 'natural')) {
                            return sub_mulCommutative(tree);
                        }
                        const [, variable] = base;
                        exp = parseInt(exp[1]);
                        if (gcd.has(variable)) {
                            gcd.set(variable, Math.min(gcd.get(variable), exp));
                        } else {
                            gcd.delete(variable);
                        }
                        break;
                    }
                    default: {
                        return sub_mulCommutative(tree);
                    }
                }
            }
            let variables = [];
            gcd.forEach((variable, exp) => {
                variable = ['variable', variable];
                if (exp === 1) {
                    variables = [...variables, variable]
                } else {
                    exp = ['natural', exp.toString()];
                    variables = [...variables, ['power', variable, exp]];
                }
            })

            switch (variables.length) {
                case 0: {
                    return sub_mulCommutative(tree);
                }
                case 1: {
                    const [variable] = variables;
                    const operand_1 = operand.map(term => [term[0], fracSimpVar(['fraction', term[1], variable])]);
                    const newOperand = [['mul', variable], ['mul', ['addchain', ...operand_1]]];
                    return sub_mulCommutative(['mulchain', ...newOperand]);
                }
                default: {
                    const div = [...variables];
                    variables = variables.map(term => ['mul', term]);
                    const operand_1 = operand.map(term => [term[0], div.reduce((a, b) => fracSimpVar(['fraction', a, b]), term[1])]);
                    const newOperand = [...variables, ['mul', ['addchain', ...operand_1]]];
                    return sub_mulCommutative(['mulchain', ...newOperand]);
                }
            }
        }
    }
}
*/

import { LatexToTree } from '../checkmath.js';
const latex = '1\\le \\frac{x}{2}+3\\le 3.4';
let tree = LatexToTree(latex)
tree = addFactoredFormVar(tree);
const result = JSON.stringify(tree, null, 4);
console.log(result);

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
            let vars = [];
            let has_other = false;
            operand.forEach(term => {
                switch (term[1][0]) {
                    case 'variable': {
                        vars = [...vars, [term[1][1]]];
                        break;
                    }
                    case 'mulchain': {
                        let vars_mul = [];
                        const [, [, ...terms_1]] = term;
                        terms_1.forEach(term_1 => {
                            if (term_1[1][0] === 'variable') {
                                vars_mul = [...vars_mul, term_1[1][1]];
                            } else if (term_1[1][0] === 'power' && term_1[1][1][0] === 'variable' && term_1[1][2][0] === 'natural') {
                                const [, [, , [, max]]] = term_1;
                                for (let i = 0; i < max; i++) {
                                    vars_mul = [...vars_mul, term_1[1][1][1]];
                                }
                            }
                        });
                        vars = [...vars, vars_mul];
                        break;
                    }
                    case 'power': { // power를 mulchain으로 변환
                        if (term[1][1][0] === 'variable' && term[1][2][0] === 'natural') {
                            let terms_mul = [];
                            let var_mul = [];
                            const [, [, , [, max]]] = term;
                            for (let i = 0; i < max; i++) {
                                terms_mul = [...terms_mul, ['mul', term[1][1]]];
                                var_mul = [...var_mul, term[1][1][1]];
                            }
                            term = [term[0], ['mulchain', ...terms_mul]];
                            vars = [...vars, var_mul];
                        } else {
                            has_other = true;
                            // return sub_mulCommutative(tree);
                        }
                        break;
                    }
                    default: {
                        has_other = true;
                        // return sub_mulCommutative(tree);
                    }
                }
            });
            if (has_other) {
                return sub_mulCommutative(tree);
            }
            let [var_1st] = vars;
            [, ...vars] = vars;
            const unique = [...new Set(var_1st)];
            vars.forEach(var_mul => {
                unique.forEach(term_uni => {
                    const keys_1 = var_1st.reduce((keys, term_1, key_1) => JSON.stringify(term_1) === JSON.stringify(term_uni)
                        ? [...keys, key_1]
                        : keys,
                    []);
                    const keys_2 = var_mul.reduce((keys, term_2, key_2) => JSON.stringify(term_2) === JSON.stringify(term_uni)
                        ? [...keys, key_2]
                        : keys,
                    []);
                    const keys_1_length = keys_1.length;
                    const keys_2_length = keys_2.length;
                    if (keys_2_length === 0) {
                        keys_1.forEach(vk => {
                            delete var_1st[vk];
                        });
                    } else if (keys_1_length > keys_2_length) {
                        const max = keys_1_length - keys_2_length;
                        for (let i = 0; i < max; i++) {
                            delete var_1st[keys_1[i]];
                        }
                    }
                    var_1st = var_1st.filter(x => x);
                });
            });
            var_1st = var_1st.filter(x => x);
            switch (var_1st.length) {
                case 0: {
                    return sub_mulCommutative(tree);
                }
                case 1: {
                    const operand_1 = operand.map(term => [term[0], fracSimpVar(['fraction', term[1], ['variable', var_1st[0]]])]);
                    const newOperand = [['mul', ['variable', var_1st[0]]], ['mul', ['addchain', ...operand_1]]];
                    return sub_mulCommutative(['mulchain', ...newOperand]);
                }
                default: {
                    let div = [];
                    let head = [];
                    unique.forEach(term_unique => {
                        const find_keys = var_1st.reduce((keys, term_1, key_1) => JSON.stringify(term_1) === JSON.stringify(term_unique)
                            ? [...keys, key_1]
                            : keys,
                        []);
                        const find_keys_length = find_keys.length;
                        const variable = ['variable', term_unique];
                        const exp = ['natural', find_keys_length.toString()];
                        div = find_keys_length > 1
                            ? [...div, ['power', variable, exp]]
                            : [...div, variable];
                        head = find_keys_length > 1
                            ? [...head, ['mul', ['power', variable, exp]]]
                            : [...head, ['mul', variable]];
                    });
                    const operand_1 = operand.map(term => [term[0], div.reduce((a, b) => fracSimpVar(['fraction', a, b]), term[1])]);
                    const newOperand = [...head, ['mul', ['addchain', ...operand_1]]];
                    return sub_mulCommutative(['mulchain', ...newOperand]);
                }
            }
        }
    }
}
