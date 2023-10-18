export function absToMul(tree = null) {
    var tree_1 = JSON.parse(JSON.stringify(tree));
    if (Array.isArray(tree_1)) {
        var operator = tree_1.shift();
        var newOperand = [];
        
        if (operator === 'absolute') {
            if (tree_1[0][0] === 'variable') {
                newOperand = tree_1;
            } else if (tree_1[0][0] === 'negative' 
                && tree_1[0][1][0] === 'variable'){
                var ntree = tree_1[0];
                ntree.shift();
                newOperand = ntree;
            } else if (tree_1[0][0] == 'mulchain'){
                var ntree = tree_1[0];
                ntree.shift();
                var vari = [];
                var nat = [];
                for (var nt of ntree) {
                    if (nt[1][0] == 'negative') {
                        if (nt[1][1][0] == 'variable') {
                            vari.push([nt[0], nt[1][1]]);
                        } else {
                            nat.push([nt[0], nt[1][1]]);
                        }
                    } else {
                        if (nt[1][0] == 'variable') {
                            vari.push(nt);
                        }else{
                            nat.push(nt);                            
                        }
                    }                   
                }
                if (nat.length == 0) {
                    newOperand.push(['mulchain'].concat(vari));
                } else {
                    if (vari.length == 1) {
                        var abs_arr = [vari[0][0], ['absolute', vari[0][1]]];
                        var mul_arr = nat.concat([abs_arr]);
                        operator = 'mulchain';
                        newOperand = mul_arr;
                    } else {
                        var mul1 = ['mulchain'].concat(vari);
                        var abs_arr = ['mul', ['absolute', mul1]];
                        var mul_arr = nat.concat([abs_arr]);
                        operator = 'mulchain';
                        newOperand = mul_arr;                       
                    }
                }                
            } else if (tree_1[0][0] == 'negative'){
                tree_1[0][0] = 'absolute';
                newOperand = absToMul(tree_1[0]);
                operator = newOperand.shift(); 
            } else {
                newOperand = tree_1;
            }
        } else {
            for (var v of tree_1) {
                newOperand.push(absToMul(v));
            }
        }
        //newOperand = tree_1;
        tree_1 = [operator].concat(newOperand);  
    }
    return tree_1;
}

