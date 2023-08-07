export function expToFrac(tree = null) {
    var tree_1 = JSON.parse(JSON.stringify(tree));
    if (Array.isArray(tree_1)) {
        var operator = tree_1.shift();
        var newOperand = [];
        if (operator === 'power') {
            if (tree_1[1][0] == 'negative') {
                var newPower = tree_1[1][1];                
                //밑이 분수일 경우
                if (tree_1[0][0] == 'fraction') { 
                    if (tree_1[0][1][0] == 'natural' && tree_1[0][1][1] == '1') {
                        newOperand = tree_1[0][2];
                    } else {
                        newOperand = ['fraction', tree_1[0][2], tree_1[0][1]];
                    }
                    if (newPower[0] == 'natural' && newPower[1] == '1') {
                        return newOperand;
                    } else {
                        newOperand = ['power'].concat([newOperand]);
                        newOperand.push(newPower);
                    }
                    return newOperand;
                } else { // 최종 형태 분수, 1/(exp) 의 형태
                    
                    if (newPower[0] == 'natural' && newPower[1] == '1') {
                        newOperand = ['fraction', ['natural', '1'], tree_1[0]];
                    } else {
                        newOperand = ['fraction', 
                            ['natural', '1'], 
                            ['power', tree_1[0], newPower]
                        ];
                    }
                    return newOperand;
                }
            } else {
                newOperand = tree_1;
            }
            
        } else {
            for (var v of tree_1) {
                newOperand.push(expToFrac(v));
            }
        }
        
        tree_1 = [operator].concat(newOperand);
        tree_1 = fracFirst(tree_1);
    }   
    return tree_1;
}

export function fracFirst(tree) {
    var tree_1 = JSON.parse(JSON.stringify(tree));
    var operator = tree_1.shift();
    var newOperand = [];
    if (operator == 'mulchain') {
        var frac = [];
        var other = [];
        for (var [k, v] of tree_1.entries()) {
            if (v[0] == 'mul' && v[1][0] == 'fraction') {
                frac.push(v);
            }else{
                other.push(v);
            }
        }
        newOperand = frac.concat(other);        
    } else {
        return [operator].concat(tree_1);
    }   
    
    tree_1 = [operator].concat(newOperand);    
    return tree_1;
}
