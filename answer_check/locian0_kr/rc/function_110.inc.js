import {fracSimpInt} from '../rc/function_76.inc.js';
import _ from 'lodash';


export function mfracEquiv(tree = null) {
    if (!Array.isArray(tree)) {
        return tree;
    }
    let tree_1 = _.cloneDeep(tree);
    let operator = tree_1.shift();
    let newOperand = [];
    if (operator === 'mfraction') {
        
        let nfrac = fracSimpInt(['fraction', tree_1[1], tree_1[2]]);
        if (nfrac[0] === 'fraction') {
            newOperand.push(tree_1[0]);
            newOperand.push(nfrac[1]);
            newOperand.push(nfrac[2]);
        } else {
            operator = 'natural';
            newOperand.push((parseInt(tree_1[0][1]) + parseInt(nfrac[1])).toString());
        }
    } else {
        for (let v of tree_1) {
            newOperand.push(mfracEquiv(v));
        }
    }
    tree_1 = [operator].concat(newOperand);
    

    return tree_1;
}

