import _ from 'lodash';

export function varReverseShift(tree, types = [null], parent = null) {
    if (!Array.isArray(tree)) {
        return tree;
    }
   
    let operator = tree[0];
    let tree_1 = tree.slice(1);
    for (let [k, v] of tree_1.entries()) {
        tree_1[k] = varReverseShift(v, types, operator);
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
        let vars_1 = _.cloneDeep(vars);
        vars_1.sort();
        
        let k = Object.keys(vars).find(key => vars[key] === vars_1[0]);
        let result = [];

        if (((typeof vars[k-1] !== 'undefined') ? vars[k-1] : vars[vars.length-1]) 
            < ((typeof vars[k+1] !== 'undefined') ? vars[k+1] : vars[0])) {
            k = vars.length - 1 - k;
            vars = vars.reverse();
        }

        for (let v of [[k, vars.length], [0, k]]) {
            for (let i = v[0]; i < v[1]; i++) {
                result.push(['mul', ['variable', vars[i]]]);
            }
        }

        tree_1 = result;
        operator += '_fixed';
    }
    
    return [operator].concat(tree_1);
    
    
}



