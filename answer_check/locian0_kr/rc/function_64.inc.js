import _ from 'lodash';

export function varReverse(tree, types = [null], parent = null) {
    if (!Array.isArray(tree)) {
        return tree;
    }
    let tree_1 = _.cloneDeep(tree);
  
    let operator = tree_1.shift();
    for (let [k, v] of tree_1.entries()) {
        tree_1[k] = varReverse(v, types, operator);
    }
    if (operator === 'mulchain' && types.includes(parent)) {
        let vars = [];

        for (let v of tree_1) {
            if (v[0] === 'mul' && v[1][0] === 'variable' && v.length === 2) {
                vars.push(v[1][1]);
            } else {
                return [operator].concat(tree_1);
            }
        }

        if (vars[0] > vars[vars.length-1]) {
            vars = vars.reverse();
        }

        let result = [];

        for (let v of vars) {
            result.push(['mul', ['variable', v]]);
        }

        tree_1 = result;
        operator += '_fixed';
    }

    return [operator].concat(tree_1);
    
    
}

/*
import {LatexToTree} from '../checkmath.js';
let latex_1 = 'BCA';
let tree_1 = LatexToTree(latex_1);
let tree_11 = varReverse(tree_1);
let result_1 = JSON.stringify(tree_11, null, 4);
console.log(result_1);
*/