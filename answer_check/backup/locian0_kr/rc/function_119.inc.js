export function natElimZero(tree = null) {
    var tree_1 = JSON.parse(JSON.stringify(tree));
    if (Array.isArray(tree_1)) {
        var operator = tree_1.shift();
        var newOperand = [];
        
        if (operator === 'natural') {
            
            //*
            //newOperand.push(tree_1[0].replaceAll(new RegExp('^[0]+(\d+)$', 'g'), '$1'));
            newOperand.push(tree_1[0].replaceAll(new RegExp('^0+(?!$)', 'g'), ''));
            
            /*/
            natArr = str_split(tree_1[0]);
            while (reset(natArr) == '0') {
                array_shift(natArr);
            }
            
            if(sizeof(natArr) == 0){
                natArr = ['0'];
            }
            nat = implode('', natArr);
            newOperand[] = nat;
            //*/
        } else {
            for (var v of tree_1) {
                newOperand.push(natElimZero(v));
            }
        }
        tree_1 = [operator].concat(newOperand);
    }

    return tree_1;
}



