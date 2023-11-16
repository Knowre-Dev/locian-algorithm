import {addCommutative} from '../rc/function_47.inc.js';
import {addFactor} from '../rc/function_72.inc.js';
import {sub_mulCommutative} from '../rc/function_126.inc.js';
import _ from 'lodash';


export function powAddFactoredForm(tree = null) {
    if (!Array.isArray(tree)) {
        return tree;
    }
    var tree_1 = _.cloneDeep(tree);
    var operator = tree_1.shift();
    var newOperand = [];
    
    if (operator === 'power') {
        var base = addCommutative(tree_1[0]);
        base = sub_mulCommutative(base);
        var expo = tree_1[1];
        
        if (base[0] === 'addchain' && expo[0] === 'natural') {
            var fact = addFactor(base);
            if (fact[0] === 'mulchain') {
                operator = 'mulchain';
                fact.shift();
                
                newOperand = [];
                for (var f of fact) {
                    newOperand.push([f[0], ['power', f[1], expo]]);
                }
            } else {
                newOperand = [base, expo];
            }
        } else {
            newOperand = [base, expo];
        } 
    } else {
        for (var v of tree_1) {
            newOperand.push(powAddFactoredForm(v));
        }
    }
    tree_1 = [operator].concat(newOperand);
    
    return tree_1;
}

