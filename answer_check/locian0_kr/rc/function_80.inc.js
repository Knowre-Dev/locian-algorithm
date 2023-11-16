import _ from 'lodash';

export function addPolyZero(tree) {
    if (!Array.isArray(tree)) {
        return tree;
    }
    var tree_1 = _.cloneDeep(tree);

    var operator = tree_1.shift();
    var newOperand = [];
    if (operator === 'addchain') {
        for (var term of tree_1) {
            if (term[0] === 'sub') {
                if (checkZeroEquiv(term[1])) {
                    newOperand.push(['add', term[1]]);
                } else {
                    newOperand.push(term);
                }
            } else {
                newOperand.push(term);
            }
        }
    } else {
        for (var v of tree_1) {
            newOperand.push(addPolyZero(v));
        }
    }
    tree_1 = [operator].concat(newOperand);
    
    return tree_1;
}

export function checkZeroEquiv(tree) {
    var tree_1 = _.cloneDeep(tree);
    var result = false
    if (!Array.isArray(tree_1)) {
        return result;
    }
    var operator = tree_1.shift();
    var result = false;
    switch (operator) {
        case 'fraction':
            result = checkZeroEquiv(tree_1[0]);
            break;
        case 'mulchain':
            for (var term of tree_1[0]) {
                if (term[0] === 'natural' && term[1] === '0') {
                    result = true;
                }
            }
            break;          
        case 'natural':
            if (tree_1[0] === '0') {
                result = true;
            }
            break;
        default:
            break;
    }
    
    return result;
}

