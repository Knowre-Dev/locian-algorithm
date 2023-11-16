import _ from 'lodash';

export function addNegative(tree) {
    if (!Array.isArray(tree)) {
        return tree;
    }
    let tree_1 = _.cloneDeep(tree);
    let operator = tree_1.shift();
    let newOperand = [];
    if (operator === 'negative' && tree_1.length === 1) {
        let addchain = addNegative(tree_1[0]);           
        if (addchain[0] === 'addchain') {
            operator = addchain.shift();
            for (let term of addchain) {
                if (term[0] === 'add') {
                    newOperand.push(['sub', term[1]]);
                } else if (term[0] === 'sub') {
                    newOperand.push(['add', term[1]]);
                } else {
                    newOperand.push(term);
                }
            }
        } else {
            newOperand = tree_1;
        }
    } else if (operator === 'addchain') {
        for (let term of tree_1) {
            if (term[0] === 'sub' && term[1][0] === 'addchain') {
                let term_1 = term[1].slice(1)
                for (let inner of term_1) {
                    if (inner[0] === 'add') {
                        newOperand.push(['sub', inner[1]]);
                    } else if (inner[0] === 'sub') {
                        newOperand.push(['add', inner[1]]);
                    } else {
                        newOperand.push(inner);
                    }
                }
            } else {
                newOperand.push(term);
            }
        }
    } else {
        for (let v of tree_1) {
            newOperand.push(addNegative(v));
        }
    }
    tree_1 = [operator].concat(newOperand);

    return tree_1;
}

