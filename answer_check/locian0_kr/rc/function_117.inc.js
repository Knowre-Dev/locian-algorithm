import { fracSimpVar } from '../rc/function_77.inc.js';
import { sub_deter, sub_mulCommutative } from '../rc/function_126.inc.js';

export function addFactoredFormVar(tree = null) {
    if (!Array.isArray(tree) || !sub_deter(tree)) {
        return tree;
    }

    let [operator, ...operand] = tree;
    switch (operator) {
        case 'addchain': {
            let vars = [];
            operand.forEach(term => {
                if (term[1][0] === 'power') {
                    if (term[1][1][0] === 'variable' && term[1][2][0] === 'natural') {
                        let mul_term = [];
                        const [, [, , [, max]]] = term;
                        for (let i = 0; i < max; i++) {
                            mul_term = [...mul_term, ['mul', term[1][1]]];
                        }
                        term = [term[0], ['mulchain', ...mul_term]];
                    }
                }
                switch (term[1][0]) {
                    case 'variable': {
                        vars = [...vars, term[1][1]];
                        break;
                    }
                    case 'mulchain': {
                        let var_mul = [];
                        const [, [, ...term_1]] = term;
                        term_1.forEach(term_term_1 => {
                            if (term_term_1[1][0] === 'variable') {
                                var_mul = [...var_mul, term_term_1[1][1]];
                            } else if (term_term_1[1][0] === 'power' && term_term_1[1][1][0] === 'variable' && term_term_1[1][2][0] === 'natural') {
                                const max = term_term_1[1][2][1];
                                for (let i = 0; i < max; i++) {
                                    var_mul = [...var_mul, term_term_1[1][1][1]];
                                }
                            }
                        });
                        vars = [...vars, var_mul];
                        break;
                    }
                    default: {
                        vars = [...vars, '1'];
                    }
                }
            });
            if (vars.includes('1')) {
                return sub_mulCommutative(tree);
            }
            let [first] = vars;
            [, ...vars] = vars;
            if (!Array.isArray(first)) {
                first = [first];
            }
            const unique = [...new Set(first)];
            vars.forEach(vari => {
                if (!Array.isArray(vari)) {
                    vari = [vari];
                }
                unique.forEach(term_unique => {
                    const key1 = first.reduce((keys, term_1, key_1) => term_1 === term_unique
                        ? [...keys, key_1]
                        : keys,
                    []);
                    const key2 = vari.reduce((keys, term_2, key_2) => term_2 === term_unique
                        ? [...keys, key_2]
                        : keys,
                    []);
                    const key1_length = key1.length;
                    const key2_length = key2.length;
                    if (key2_length === 0) {
                        key1.forEach(vk => {
                            delete first[vk];
                        });
                    } else if (key1_length > key2_length) {
                        const max = key1_length - key2_length;
                        for (let i = 0; i < max; i++) {
                            delete first[key1[i]];
                        }
                    }
                    first = first.filter(x => typeof x !== 'undefined');
                });
            });
            first = first.filter(x => typeof x !== 'undefined');
            switch (first.length) {
                case 0: {
                    return sub_mulCommutative(tree);
                }
                case 1: {
                    operator = 'mulchain';
                    let div = [['variable', first[0]]];
                    const div_1 = operand.map(t => [t[0], fracSimpVar(['fraction', t[1], ['variable', first[0]]])]);
                    div = [...div, ['addchain', ...div_1]];
                    const newOperand = div.map(term_div => ['mul', term_div]);
                    return sub_mulCommutative([operator, ...newOperand]);
                }
                default: {
                    operator = 'mulchain';
                    let div = [];
                    unique.forEach(term_unique => {
                        const find_keys = first.reduce((keys, term_1, key_1) => term_1 === term_unique
                            ? [...keys, key_1]
                            : keys,
                        []);
                        div = find_keys.length > 1
                            ? [...div, ['power', ['variable', term_unique], ['natural', find_keys.length.toString()]]]
                            : [...div, ['variable', term_unique]];
                    });
                    const div_1 = operand.map(term => [term[0], div.reduce((a, b) => fracSimpVar(['fraction', a, b]), term[1])]);
                    div = [...div, ['addchain', ...div_1]];
                    const newOperand = div.map(term_div => ['mul', term_div]);
                    return sub_mulCommutative([operator, ...newOperand]);
                }
            }
        }
        case 'mulchain': {
            const newOperand = operand.map(term => term[1][0] === 'addchain'
                ? addFactoredFormVar(term)
                : term);
            return sub_mulCommutative([operator, ...newOperand]);
        }
        default: {
            return sub_mulCommutative([operator, ...operand.map(term => addFactoredFormVar(term))]);
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
