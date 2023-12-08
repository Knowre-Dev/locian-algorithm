export function solParenthesis(tree = null) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    let operator = tree[0];
    switch (operator) {
        case 'mulchain': {
            const tree_1 = tree.slice(1);
            let mul = true;
            const addchain = [];
            const mono = [];
            for (const v of tree_1) {
                if (v[0] === 'mul') {
                    switch (v[1][0]) {
                        case 'addchain': {
                            addchain.push(v[1]);
                            break;
                        }
                        case 'mulchain': {
                            const expand = solParenthesis(v[1]);
                            expand[0] === 'addchain' ? addchain.push(expand)
                            : mono.push(v);
                            break;
                        }
                        case 'power': {
                            const expand = solParenthesis(v[1]);
                            expand[0] === 'addchain' ? addchain.push(expand)
                            : mono.push(v);
                            break;
                        }
                        default: {
                            mono.push(v);
                        }
                    }
                } else {
                    mul = false;
                }
            }

            if (mul === false) {
                return [operator].concat(tree_1)
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
                            const merge = mono.concat([['mul', term[1]]]);
                            newOperand.push([term[0], ['mulchain'].concat(merge)]);
                        }
                    }
                    return [operator].concat(newOperand);
                }
                default: {
                    operator = 'addchain';
                    let first = addchain.shift();

                    if (mono.length !== 0) {
                        const merge = ['mulchain', ['mul', first]];
                        for (const m of mono) {
                            merge.push(m);
                        }
                        first = solParenthesis(merge);
                    }

                    for (const a1 of addchain) {
                        a1.shift();
                        const term = [];
                        for (const a of a1) {
                            let merge = [];
                            for (const f of first) {
                                merge = ['mulchain'];
                                if (Array.isArray(f) && Array.isArray(a)) {
                                    let flag1;
                                    JSON.stringify(f[0]) === JSON.stringify(a[0]) ? flag1 = 'add'
                                    : flag1 = 'sub';
                                    merge.push(['mul', f[f.length - 1]]);
                                    merge.push(['mul', a[a.length - 1]]);
                                    term.push([flag1, merge]);
                                }
                            }
                            merge = [];
                        }
                        first = ['addchain'].concat(term);
                    }
                    return [operator].concat(first.slice(1));
                }
            }
        }
        case 'power': {
            const tree_1 = tree.slice(1);
            if (tree_1[0][0] === 'addchain' && tree_1[1][0] === 'natural') {
                const int = parseInt(tree_1[1][1]);
                const arr = [];
                for (let i = 0; i < int; i++) {
                    arr.push(['mul', tree_1[0]]);
                }
                return solParenthesis(['mulchain'].concat(arr));
            }
            return [operator].concat(tree_1);
        }
        default: {
            const tree_1 = tree.slice(1);
            const newOperand = [];
            for (const v of tree_1) {
                newOperand.push(solParenthesis(v));
            }
            return [operator].concat(newOperand);
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
