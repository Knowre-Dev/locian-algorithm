import { fracSimpVar } from '../rc/function_77.inc.js';
import { sub_deter, sub_mulCommutative } from '../rc/function_126.inc.js';

export function addFactoredFormVar(tree = null) {
    if (!Array.isArray(tree) || !sub_deter(tree)) {
        return tree;
    }

    const [operator, ...operand] = tree;
    switch (operator) {
        case 'addchain': {
            let vars = [];
            let is_contain_other = false;
            operand.forEach(term => {
                switch (term[1][0]) {
                    case 'variable': {
                        vars = [...vars, [term[1][1]]];
                        break;
                    }
                    case 'mulchain': {
                        let var_mul = [];
                        const [, [, ...term_1]] = term;
                        term_1.forEach(term_term_1 => {
                            if (term_term_1[1][0] === 'variable') {
                                var_mul = [...var_mul, term_term_1[1][1]];
                            } else if (term_term_1[1][0] === 'power' && term_term_1[1][1][0] === 'variable' && term_term_1[1][2][0] === 'natural') {
                                const [, [, , [, max]]] = term_term_1;
                                for (let i = 0; i < max; i++) {
                                    var_mul = [...var_mul, term_term_1[1][1][1]];
                                }
                            }
                        });
                        vars = [...vars, var_mul];
                        break;
                    }
                    case 'power': {
                        if (term[1][1][0] === 'variable' && term[1][2][0] === 'natural') {
                            let mul_term = [];
                            let var_mul = [];
                            const [, [, , [, max]]] = term;
                            for (let i = 0; i < max; i++) {
                                mul_term = [...mul_term, ['mul', term[1][1]]];
                                var_mul = [...var_mul, term[1][1][1]];
                            }
                            term = [term[0], ['mulchain', ...mul_term]];
                            vars = [...vars, var_mul];
                        } else {
                            is_contain_other = true;
                        }
                        break;
                    }
                    default: {
                        is_contain_other = true;
                    }
                }
            });
            if (is_contain_other) {
                return sub_mulCommutative(tree);
            }
            let [first] = vars;
            [, ...vars] = vars;
            const unique = [...new Set(first)];
            vars.forEach(var_mul => {
                unique.forEach(term_unique => {
                    const keys_1 = first.reduce((keys, term_1, key_1) => term_1 === term_unique
                        ? [...keys, key_1]
                        : keys,
                    []);
                    const keys_2 = var_mul.reduce((keys, term_2, key_2) => term_2 === term_unique
                        ? [...keys, key_2]
                        : keys,
                    []);
                    const keys_1_length = keys_1.length;
                    const keys_2_length = keys_2.length;
                    if (keys_2_length === 0) {
                        keys_1.forEach(vk => {
                            delete first[vk];
                        });
                    } else if (keys_1_length > keys_2_length) {
                        const max = keys_1_length - keys_2_length;
                        for (let i = 0; i < max; i++) {
                            delete first[keys_1[i]];
                        }
                    }
                    first = first.filter(x => x);
                });
            });
            first = first.filter(x => x);
            switch (first.length) {
                case 0: {
                    return sub_mulCommutative(tree);
                }
                case 1: {
                    const operand_1 = operand.map(term => [term[0], fracSimpVar(['fraction', term[1], ['variable', first[0]]])]);
                    const newOperand = [['mul', ['variable', first[0]]], ['mul', ['addchain', ...operand_1]]];
                    return sub_mulCommutative(['mulchain', ...newOperand]);
                }
                default: {
                    let div = [];
                    let head = [];
                    unique.forEach(term_unique => {
                        const find_keys = first.reduce((keys, term_1, key_1) => term_1 === term_unique
                            ? [...keys, key_1]
                            : keys,
                        []);
                        const find_keys_length = find_keys.length;
                        div = find_keys_length > 1
                            ? [...div, ['power', ['variable', term_unique], ['natural', find_keys_length.toString()]]]
                            : [...div, ['variable', term_unique]];
                        head = find_keys_length > 1
                            ? [...head, ['mul', ['power', ['variable', term_unique], ['natural', find_keys_length.toString()]]]]
                            : [...head, ['mul', ['variable', term_unique]]];
                    });
                    const operand_1 = operand.map(term => [term[0], div.reduce((a, b) => fracSimpVar(['fraction', a, b]), term[1])]);
                    const newOperand = [...head, ['mul', ['addchain', ...operand_1]]];
                    return sub_mulCommutative(['mulchain', ...newOperand]);
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
