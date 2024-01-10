export function solParenthesis(tree = null) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    const [operator] = tree;
    switch (operator) {
        case 'mulchain': {
            const [, ...operand] = tree;
            let mul = true;
            let addchain = [];
            let mono = [];
            operand.forEach(term => {
                if (term[0] === 'mul') {
                    switch (term[1][0]) {
                        case 'addchain': {
                            addchain = [...addchain, term[1]];
                            break;
                        }
                        case 'mulchain': {
                            const expand = solParenthesis(term[1]);
                            expand[0] === 'addchain' ? addchain = [...addchain, expand]
                            : mono = [...mono, term];
                            break;
                        }
                        case 'power': {
                            const expand = solParenthesis(term[1]);
                            expand[0] === 'addchain' ? addchain = [...addchain, expand]
                            : mono = [...mono, term];
                            break;
                        }
                        default: {
                            mono = [...mono, term];
                        }
                    }
                } else {
                    mul = false;
                }
            });
            if (mul === false) {
                return [operator, ...operand]
            }
            const addchain_length = addchain.length;
            switch (addchain_length) {
                case 0: {
                    return tree;
                }
                case 1: {
                    let newOperand = [];
                    const addchain_0 = addchain[0]
                    addchain_0.forEach(term => {
                        if (Array.isArray(term)) {
                            newOperand = [...newOperand, [term[0], ['mulchain', ...mono, ['mul', term[1]]]]];
                        }
                    });
                    return ['addchain', ...newOperand];
                }
                default: {
                    let [first] = addchain;
                    [, ...addchain] = addchain;
                    if (mono.length !== 0) {
                        first = solParenthesis(['mulchain', ['mul', first], ...mono]);
                    }
                    addchain.forEach(term_a => {
                        [, ...term_a] = term_a;
                        let term = [];
                        term_a.forEach(term_a_1 => {
                            first.forEach(term_f => {
                                if (Array.isArray(term_f) && Array.isArray(term_a_1)) {
                                    const flag1 = JSON.stringify(term_f[0]) === JSON.stringify(term_a_1[0]) ? 'add'
                                        : 'sub';
                                    const merge = ['mulchain', ['mul', term_f[term_f.length - 1]], ['mul', term_a_1[term_a_1.length - 1]]];
                                    term = [...term, [flag1, merge]];
                                }
                            });
                        });
                        first = ['addchain', ...term];
                    });
                    return ['addchain', ...first.slice(1)];
                }
            }
        }
        case 'power': {
            const [, ...operand] = tree;
            if (operand[0][0] === 'addchain' && operand[1][0] === 'natural') {
                const int = parseInt(operand[1][1]);
                let arr = [];
                for (let i = 0; i < int; i++) {
                    arr = [...arr, ['mul', operand[0]]];
                }
                return solParenthesis(['mulchain', ...arr]);
            }
            return [operator, ...operand];
        }
        default: {
            const [, ...operand] = tree;
            return [operator, ...operand.map(term => solParenthesis(term))];
        }
    }
}

/*
import {LatexToTree} from '../checkmath.js';
let latex_1 = 'x\\div 3 + 1';
let tree_1 = LatexToTree(latex_1);
let tree_11 = solParenthesis(tree_1);
let result_1 = JSON.stringify(tree_11, null, 4);
console.log(JSON.stringify(tree_11, null, 4));
*/
