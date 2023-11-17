import _ from 'lodash';

export function addPolyZero(tree) {
    if (!Array.isArray(tree)) {
        return tree;
    }
    let tree_1 = _.cloneDeep(tree);

    let operator = tree_1.shift();
    let newOperand = [];
    if (operator === 'addchain') {
        for (let term of tree_1) {
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
        for (let v of tree_1) {
            newOperand.push(addPolyZero(v));
        }
    }
    return [operator].concat(newOperand);
    
    
}

export function checkZeroEquiv(tree) {
    
    let result = false
    if (!Array.isArray(tree)) {
        return result;
    }
    let tree_1 = _.cloneDeep(tree);
    let operator = tree_1.shift();
    
    switch (operator) {
        case 'fraction':
            result = checkZeroEquiv(tree_1[0]);
            break;
        case 'mulchain':
            for (let term of tree_1[0]) {
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

