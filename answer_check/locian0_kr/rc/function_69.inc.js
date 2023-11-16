import _ from 'lodash';

export function fracComplex(tree) {
    if (!Array.isArray(tree)) {
        return tree;
    }
    var tree_1 = _.cloneDeep(tree);
    var operator = tree_1.shift();
    var numArr = [];
    var denArr = [];
    var newOperand = [];
    if (operator === 'fraction') {
        var num = fracComplex(tree_1[0]);
        var den = fracComplex(tree_1[1]);
        if (num[0] === 'fraction') {
            numArr.push(num[1]);
            denArr.push(num[2]);
        } else {
            numArr.push(num);
        }
        if (den[0] === 'fraction') {
            denArr.push(den[1]);
            numArr.push(den[2]);
        } else {
            denArr.push(den);
        }
        
        var newNum = [];
        if (numArr.length > 1) {
            newNum = ['mulchain'];
            for (var term of numArr) {
                newNum.push(['mul', term]);
            }
        } else {
            newNum = numArr[0];
        }
        
        var newDen = [];
        if (denArr.length > 1) {
            newDen = ['mulchain'];
            for (var term of denArr) {
                newDen.push(['mul', term]);
            }
        } else {
            newDen = denArr[0];
        }
        newOperand = [newNum, newDen];
    } else {
        for (var v of tree_1) {
            newOperand.push(fracComplex(v));
        }
    }
    tree_1 = [operator].concat(newOperand);
    
    return tree_1;
}

