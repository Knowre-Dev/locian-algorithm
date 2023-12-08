//
import { addNegative } from '../rc/function_71.inc.js';
import { addFactor_1 } from '../rc/function_128.inc.js';

export function addFactoredForm(tree) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    let operator = tree[0];
    let newOperand = [];
    switch (operator) {
        case 'negative': {
            const tree_1 = tree.slice(1);
            newOperand.push(addFactoredForm(tree_1[0]));
            if (newOperand[0][0] === 'negative') {
                operator = newOperand[0][1].shift();
                newOperand = newOperand[0][1];
            }
            return [operator].concat(newOperand);
        }
        case 'mulchain': {
            const termArr = [];
            const consArr = [];
            const factArr = [];
            let tree_1 = tree.slice(1);
            let add = false;
            let sign = 1;
            const tree_1_entries = tree_1.entries();
            for (const [kt, term] of tree_1_entries) {
                if (term[0] === 'mul') {
                    if (term[1][0] === 'addchain') {
                        const fact = addFactor_1(term[1]);
                        let addchain;
                        switch (fact[0]) {
                            case 'mulchain': {
                                consArr.push(fact[1]);
                                addchain = fact[2][1];
                                break;
                            }
                            case 'addchain': {
                                addchain = fact;
                                break;
                            }
                        }
                        if (addchain[1][0] === 'sub') {
                            addchain = addNegative(['negative', addchain]);
                            sign = -1 * sign;
                        }
                        factArr.push(['mul', addchain]);
                        add = true;
                    } else if (term[1][0] === 'natural' && kt === 0) {
                        consArr.push(term);
                    } else {
                        termArr.push(term);
                    }
                } else {
                    termArr.push(term);
                }
            }

            if (add === false) {
                newOperand = tree_1;
                tree_1 = [operator].concat(newOperand);
            } else {
                let val = 1;
                for (const term of consArr) {
                    val = val * parseInt(term[1][1]);
                }
                const con = ['mul', ['natural', val.toString()]];

                if (val !== 1) {
                    newOperand.push(con);
                }
                for (const term of termArr) {
                    newOperand.push(term);
                }
                for (const term of factArr) {
                    newOperand.push(term);
                }
            }
            return sign === -1 ? ['negative', [operator].concat(newOperand)]
                : [operator].concat(newOperand);
        }
        case 'addchain': {
            const tree_1 = tree.slice(1);
            const fact = addFactor_1(['addchain'].concat(tree_1));
            let con;
            let addchain;
            let sign = 1;
            if (fact[0] === 'mulchain') {
                con = fact[1];
                addchain = fact[2][1];
            } else {
                addchain = fact;
            }
            if (addchain[1][0] === 'sub') {
                addchain = addNegative(['negative', addchain]);
                sign = -1 * sign;
            }
            if (fact[0] === 'mulchain') {
                operator = 'mulchain';
                newOperand.push(con);
                newOperand.push(['mul', addchain]);
            } else {
                newOperand = addchain.slice(1);
            }
            return sign === -1 ? ['negative', [operator].concat(newOperand)]
                : [operator].concat(newOperand);
        }
        default: {
            const tree_1 = tree.slice(1);
            for (const v of tree_1) {
                newOperand.push(addFactoredForm(v));
            }
            return [operator].concat(newOperand);
        }
    }
}
