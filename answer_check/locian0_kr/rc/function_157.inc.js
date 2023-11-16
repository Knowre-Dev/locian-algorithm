import _ from 'lodash';


export function mulAssociative(tree) {
    if (!Array.isArray(tree)) {
        return tree;
    }
    let tree_1 = _.cloneDeep(tree);
    let operator = tree_1.shift();
    let newOperand = [];
    for (let v of tree_1) {
        let term = mulAssociative(v);
        if (operator === 'mulchain' && 
            term[0] === 'mul' && 
            term[1][0] === 'mulchain') {
            
            for (let [tk, tv] of term[1].entries()) {
                if (tk !== 0) {
                    newOperand.push(tv);
                }
            }
        } else {
            newOperand.push(term);
        }
    }
    tree_1 = [operator].concat(newOperand);
    
    return tree_1;
}


