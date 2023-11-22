import _ from 'lodash';


export function mulAssociative(tree) {
    if (!Array.isArray(tree)) {
        return tree;
    }
    
    let operator = tree[0];
    let tree_1 = tree.slice(1);
    let newOperand = [];
    for (let v of tree_1) {
        let term = mulAssociative(v);
        if (operator === 'mulchain' && 
            term[0] === 'mul' && 
            term[1][0] === 'mulchain') {
            let term_1_entries = term[1].entries();
            for (let [tk, tv] of term_1_entries) {
                if (tk !== 0) {
                    newOperand.push(tv);
                }
            }
        } else {
            newOperand.push(term);
        }
    }
    return [operator].concat(newOperand);
    
    
}


