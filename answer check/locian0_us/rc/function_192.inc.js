

export function reWrtLogWithBase(tree = null) {
    var tree_1 = JSON.parse(JSON.stringify(tree));  
    if (Array.isArray(tree_1)) {
        var operator = tree_1.shift();
    
        var newOperand = [];
        if (operator === 'log' && tree_1.length === 1) { 
            newOperand.push(tree_1[0]);  
            newOperand.push(['natural', '10']);
        } else if (operator === 'ln' && tree_1.length === 1) {
            operator = 'log';
            newOperand.push(tree_1[0]);
            newOperand.push(['variable', 'e']);
        } else {
            for (var v of tree_1) {
                newOperand.push(reWrtLogWithBase(v));
            }
        }
        tree_1 = [operator].concat(newOperand);
    }
   
    return tree_1;
}