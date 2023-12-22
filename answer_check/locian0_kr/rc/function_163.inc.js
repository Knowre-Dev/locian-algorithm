export function solParenthesis(tree = null) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    let [operator] = tree;
    switch (operator) {
        case 'mulchain': {
            const [, ...operand] = tree;
            let mul = true;
            const addchain = [];
            const mono = [];
            for (const term of operand) {
                if (term[0] === 'mul') {
                    switch (term[1][0]) {
                        case 'addchain': {
                            addchain.push(term[1]);
                            break;
                        }
                        case 'mulchain': {
                            const expand = solParenthesis(term[1]);
                            expand[0] === 'addchain' ? addchain.push(expand)
                            : mono.push(term);
                            break;
                        }
                        case 'power': {
                            const expand = solParenthesis(term[1]);
                            expand[0] === 'addchain' ? addchain.push(expand)
                            : mono.push(term);
                            break;
                        }
                        default: {
                            mono.push(term);
                        }
                    }
                } else {
                    mul = false;
                }
            }

            if (mul === false) {
                return [operator, ...operand]
            }
            const addchain_length = addchain.length;
            switch (addchain_length) {
                case 0: {
                    return tree;
                }
                case 1: {
                    operator = 'addchain';
                    const newOperand = [];
                    const addchain_0 = addchain[0]
                    for (const term of addchain_0) {
                        if (Array.isArray(term)) {
                            newOperand.push([term[0], ['mulchain', ...mono, ['mul', term[1]]]]);
                        }
                    }
                    return [operator, ...newOperand];
                }
                default: {
                    operator = 'addchain';
                    let first = addchain.shift();

                    if (mono.length !== 0) {
                        first = solParenthesis(['mulchain', ['mul', first]].concat(mono));
                    }

                    for (const term_a of addchain) {
                        term_a.shift();
                        const term = [];
                        for (const term_a_1 of term_a) {
                            let merge = [];
                            for (const term_f of first) {
                                merge = ['mulchain'];
                                if (Array.isArray(term_f) && Array.isArray(term_a_1)) {
                                    let flag1;
                                    JSON.stringify(term_f[0]) === JSON.stringify(term_a_1[0]) ? flag1 = 'add'
                                    : flag1 = 'sub';
                                    merge.push(['mul', term_f[term_f.length - 1]]);
                                    merge.push(['mul', term_a_1[term_a_1.length - 1]]);
                                    term.push([flag1, merge]);
                                }
                            }
                        }
                        first = ['addchain', ...term];
                    }
                    return [operator, ...first.slice(1)];
                }
            }
        }
        case 'power': {
            const [, ...operand] = tree;
            if (operand[0][0] === 'addchain' && operand[1][0] === 'natural') {
                const int = parseInt(operand[1][1]);
                const arr = [];
                for (let i = 0; i < int; i++) {
                    arr.push(['mul', operand[0]]);
                }
                return solParenthesis(['mulchain', ...arr]);
            }
            return [operator, ...operand];
        }
        default: {
            const [, ...operand] = tree;
            const newOperand = operand.map(term => solParenthesis(term));
            return [operator, ...newOperand];
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
