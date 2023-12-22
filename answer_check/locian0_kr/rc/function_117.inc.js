import { fracSimpVar } from '../rc/function_77.inc.js';
import { sub_deter, sub_mulCommutative } from '../rc/function_126.inc.js';

export function addFactoredFormVar(tree = null) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    const deter = sub_deter(tree);

    if (!deter) {
        return tree;
    }

    let [operator] = tree;
    switch (operator) {
        case 'addchain': {
            const [, ...operand] = tree;
            const newOperand = [];
            const vars = [];
            for (let term of operand) {
                if (term[1][0] === 'power') {
                    if (term[1][1][0] === 'variable' && term[1][2][0] === 'natural') {
                        const mul_term = [];
                        const max = parseInt(term[1][2][1])
                        for (let i = 0; i < max; i++) {
                            mul_term.push(['mul', term[1][1]]);
                        }
                        term = [term[0], ['mulchain', ...mul_term]];
                    }
                }
                switch (term[1][0]) {
                    case 'variable': {
                        vars.push(term[1][1]);
                        break;
                    }
                    case 'mulchain': {
                        const var_mul = [];
                        const [, ...term_1] = term[1];
                        for (const term_term_1 of term_1) {
                            if (term_term_1[1][0] === 'variable') {
                                var_mul.push(term_term_1[1][1]);
                            } else if (term_term_1[1][0] === 'power' && term_term_1[1][1][0] === 'variable' && term_term_1[1][2][0] === 'natural') {
                                const max = parseInt(term_term_1[1][2][1]);
                                for (let i = 0; i < max; i++) {
                                    var_mul.push(term_term_1[1][1][1]);
                                }
                            }
                        }
                        vars.push(var_mul);
                        break;
                    }
                    default: {
                        vars.push('1');
                    }
                }
            }
            if (vars.includes('1')) {
                return sub_mulCommutative(tree);
            }
            let first = vars.shift();
            if (!Array.isArray(first)) {
                first = [first];
            }
            const unique = [...new Set(first)];
            for (let vari of vars) {
                if (!Array.isArray(vari)) {
                    vari = [vari];
                }
                for (const term_unique of unique) {
                    const key1 = [];
                    const first_entries = first.entries();
                    for (const [key_1, term_1] of first_entries) {
                        if (term_1 === term_unique) {
                            key1.push(key_1);
                        }
                    }
                    const key2 = [];
                    const v_entries = vari.entries();
                    for (const [key_2, term_2] of v_entries) {
                        if (term_2 === term_unique) {
                            key2.push(key_2);
                        }
                    }
                    const key1_length = key1.length;
                    const key2_length = key2.length;
                    if (key2_length === 0) {
                        for (const vk of key1) {
                            delete first[vk];
                        }
                    } else if (key1_length > key2_length) {
                        const max = key1_length - key2_length;
                        for (let i = 0; i < max; i++) {
                            delete first[key1[i]];
                        }
                    }
                    first = first.filter(x => typeof x !== 'undefined');
                }
            }
            first = first.filter(x => typeof x !== 'undefined');
            const first_length = first.length;
            switch (first_length) {
                case 0: {
                    return sub_mulCommutative(tree);
                }
                case 1: {
                    operator = 'mulchain';
                    const div = [['variable', first[0]]];
                    const div_1 = [];
                    for (const t of operand) {
                        const frac = fracSimpVar(['fraction', t[1], ['variable', first[0]]]);
                        div_1.push([t[0], frac]);
                    }
                    div.push(['addchain', ...div_1]);
                    for (const term_div of div) {
                        newOperand.push(['mul', term_div]);
                    }
                    return sub_mulCommutative([operator, ...newOperand]);
                }
                default: {
                    operator = 'mulchain';
                    const div = [];
                    for (const term_unique of unique) {
                        const find_keys = [];
                        const first_entries = first.entries();
                        for (const [key_1, term_1] of first_entries) {
                            if (term_1 === term_unique) {
                                find_keys.push(key_1);
                            }
                        }
                        find_keys.length > 1 ? div.push(['power', ['variable', term_unique], ['natural', find_keys.length.toString()]])
                        : div.push(['variable', term_unique]);
                    }

                    const div_1 = [];
                    for (const term of operand) {
                        let frac = term[1];
                        for (const term_div of div) {
                            frac = fracSimpVar(['fraction', frac, term_div]);
                        }
                        div_1.push([term[0], frac]);
                    }
                    div.push(['addchain', ...div_1]);
                    for (const term_div of div) {
                        newOperand.push(['mul', term_div]);
                    }
                    return sub_mulCommutative([operator, ...newOperand]);
                }
            }
        }
        case 'mulchain': {
            const [, ...operand] = tree;
            const newOperand = [];
            for (const term of operand) {
                term[1][0] === 'addchain' ? newOperand.push(addFactoredFormVar(term))
                : newOperand.push(term);
            }
            return sub_mulCommutative([operator, ...newOperand]);
        }
        default: {
            const [, ...operand] = tree;
            const newOperand = operand.map(term => addFactoredFormVar(term));
            return sub_mulCommutative([operator, ...newOperand]);
        }
    }
}
/*
import {LatexToTree} from '../checkmath.js';
let latex_1 = 'xy^2+x(y+z)';
let latex_2 = '1';
let tree_1 = LatexToTree(latex_1);
let tree_2 = LatexToTree(latex_2);
let tree_11 = addFactoredFormVar(tree_1);
let tree_21 = addFactoredFormVar(tree_2);
let result_1 = JSON.stringify(tree_11, null, 4);
let result_2 = JSON.stringify(tree_21, null, 4);
console.log(result_1 === result_2);
console.log(JSON.stringify(tree_11, null, 4));
console.log(JSON.stringify(tree_21, null, 4));
*/
