/*
a(b+c+d) => ab+ac+ad
*/
export function solParenthesis(tree = null) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    const [operator, ...operand] = tree;
    switch (operator) {
        case 'mulchain': {
            let addchains = [];
            let others = [];
            operand.forEach(term => { // addchain들 수집
                if (term[0] !== 'mul') {
                    return tree;
                }
                switch (term[1][0]) {
                    case 'addchain': {
                        addchains = [...addchains, term[1]];
                        break;
                    }
                    case 'mulchain':
                    case 'power': {
                        const expand = solParenthesis(term[1]);
                        expand[0] === 'addchain'
                            ? addchains = [...addchains, expand]
                            : others = [...others, term];
                        break;
                    }
                    default: {
                        others = [...others, term];
                    }
                }
            });
            const addchains_length = addchains.length;
            switch (addchains_length) {
                case 0: {
                    return tree;
                }
                case 1: {
                    const [[, ...operand_add]] = addchains;
                    const newOperand = operand_add.map(term => [term[0], ['mulchain', ...others, ['mul', term[1]]]]);
                    return ['addchain', ...newOperand];
                }
                default: { // addchains_length >= 2
                    let [addchain_0] = addchains;
                    [, ...addchains] = addchains;
                    if (others.length !== 0) { // adchain 아닌 것들을 앞으로 몰아줌
                        addchain_0 = solParenthesis(['mulchain', ['mul', addchain_0], ...others]);
                    }
                    let [, ...newOperand] = addchain_0;
                    addchains.forEach(addchain => {
                        const [, ...operand_a] = addchain;
                        let terms = [];
                        operand_a.forEach(term_a => {
                            newOperand.forEach(term_n => {
                                const sign = term_n[0] === term_a[0]
                                    ? 'add'
                                    : 'sub';
                                const mulchain = ['mulchain', ['mul', term_n[1]], ['mul', term_a[1]]];
                                terms = [...terms, [sign, mulchain]];
                            });
                        });
                        newOperand = terms;
                    });
                    return ['addchain', ...newOperand];
                }
            }
        }
        case 'power': {
            if (operand[0][0] === 'addchain' && operand[1][0] === 'natural') {
                const [, [, max]] = operand;
                let newOperand = [];
                for (let i = 0; i < max; i++) {
                    newOperand = [...newOperand, ['mul', operand[0]]];
                }
                return solParenthesis(['mulchain', ...newOperand]);
            }
            return tree;
        }
        default: {
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
