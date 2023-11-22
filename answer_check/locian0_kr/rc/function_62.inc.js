import _ from 'lodash';

export function varShift(tree, types = [null], parent = null) {
    if (!Array.isArray(tree)) {
        return tree;
    }
    
    let operator = tree[0];
    let tree_1 = tree.slice(1);
    let tree_1_entries = tree_1.entries();
    for (let [k, v] of tree_1_entries) {
        tree_1[k] = varShift(v, types, operator);
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
        
        
        let vars_length = vars.length;
        for (let i = k; i < vars_length; i++) {
            result.push(['mul', ['variable', vars[i]]]);
        }
        for (let i = 0; i < k; i++) {
            result.push(['mul', ['variable', vars[i]]]);
        }
            
        
        tree_1 = result;
        operator += '_fixed';
    }

    return [operator].concat(tree_1);
    
    
}

