/*
a^3 => a*a*a, a(b+c+d) => ab+ac+ad
*/
export function solParenthesis(tree = null) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    const [operator, ...operand] = tree;
    switch (operator) {
        case 'mulchain': {
            return sol_mulchain(tree);
        }
        case 'power': {
            const [base, exp] = operand;
            if (base[0] !== 'addchain' || exp[0] !== 'natural') {
                return tree;
            }
            const [, max] = exp;
            let newOperand = [];
            for (let i = 0; i < max; i++) {
                newOperand = [...newOperand, ['mul', base]];
            }
            return solParenthesis(['mulchain', ...newOperand]);
        }
        default: {
            const operand_new = operand.map(term => solParenthesis(term));
            return [operator, ...operand_new];
        }
    }
}

function sol_mulchain(tree) {
    const [, ...operand] = tree;
    let addchains = [];
    let others = [];
    operand.forEach(term => { // addchain들 수집
        const [op, term_1] = term;
        if (op !== 'mul') {
            return tree;
        }
        switch (term_1[0]) {
            case 'addchain': {
                addchains = [...addchains, term_1];
                break;
            }
            case 'mulchain':
            case 'power': {
                const expand = solParenthesis(term_1);
                expand[0] === 'addchain'
                    ? addchains = [...addchains, expand]
                    : others = [...others, term];
                break;
            }
            default: {
                others = [...others, term];
            }
        }
    })
    const number_add = addchains.length;
    switch (number_add) {
        case 0: {
            return tree;
        }
        case 1: {
            const [[, ...terms_a]] = addchains;
            const newOperand = terms_a.map(term_a => [term_a[0], ['mulchain', ...others, ['mul', term_a[1]]]]);
            return ['addchain', ...newOperand];
        }
        default: {
            let [addchain_0] = addchains;
            if (others.length !== 0) { // addchain 아닌 것들을 앞으로 몰아줌
                addchain_0 = solParenthesis(['mulchain', ['mul', addchain_0], ...others]);
            }
            [, ...addchains] = addchains;
            let [, ...newOperand] = addchain_0;
            addchains.forEach(addchain => {
                const [, ...terms_a] = addchain;
                newOperand = multi_addchains(newOperand, terms_a);
            });
            return ['addchain', ...newOperand];
        }
    }
}

function multi_addchains(terms_1, terms_2) {
    let terms = [];
    terms_2.forEach(term_2 => {
        const [op_2, term_21] = term_2;
        terms_1.forEach(term_1 => {
            const [op_1, term_11] = term_1
            const op = op_1 === op_2
                ? 'add'
                : 'sub';
            const mulchain = ['mulchain', ['mul', term_11], ['mul', term_21]];
            terms = [...terms, [op, mulchain]];
        });
    });
    return terms;
}

/*
import {LatexToTree} from '../checkmath.js';
let latex_1 = 'x\\div 3 + 1';
let tree_1 = LatexToTree(latex_1);
let tree_11 = solParenthesis(tree_1);
let result_1 = JSON.stringify(tree_11, null, 4);
console.log(JSON.stringify(tree_11, null, 4));
*/
