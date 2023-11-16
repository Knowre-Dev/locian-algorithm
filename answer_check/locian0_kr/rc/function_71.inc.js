import _ from 'lodash';

export function addNegative(tree) {
    if (!Array.isArray(tree)) {
        return tree;
    }
    var tree_1 = _.cloneDeep(tree);
    var operator = tree_1.shift();
    var newOperand = [];
    if (operator === 'negative' && tree_1.length === 1) {
        var addchain = addNegative(tree_1[0]);           
        if (addchain[0] === 'addchain') {
            operator = addchain.shift();
            for (var term of addchain) {
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
        for (var term of tree_1) {
            if (term[0] === 'sub' && term[1][0] === 'addchain') {
                var term_1 = term[1].slice(1)
                for (var inner of term_1) {
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
        for (var v of tree_1) {
            newOperand.push(addNegative(v));
        }
    }
    tree_1 = [operator].concat(newOperand);

    return tree_1;
}

