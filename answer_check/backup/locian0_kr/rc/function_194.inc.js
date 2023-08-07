export function mulToExp(tree = null) {
    var tree_1 = JSON.parse(JSON.stringify(tree));
    if (Array.isArray(tree_1)) {
        var operator = tree_1.shift();
        var newOperand = [];
        if (operator == 'mulchain') {
            var power = new Object();
            var varNum = [];
            for (var term of tree_1) {
                if (term[0] === 'mul') {
                    if (term[1][0] === 'variable') {
                        if (!term[1][1] in power) {
                            power[term[1][1]] = [];
                        }
                        power[term[1][1]].push(term[1]); 
                    } else if (term[1][0] === 'power' && term[1][1][0] === 'variable') {
                        varNum.push(term);
                    } else {
                        varNum.push(term);
                    }
                } else {
                    varNum.push(term);
                }
            }
            for (var [k, v] of power.entries()) {
                if (v.length > 1){
                    varNum.push(['mul', ['power', v[0], ['natural', (v.length).toString()]]]);
                } else {
                    varNum.push(['mul', v[0]]);
                }           
            }
            if (varNum.length == 1) {
                operator = varNum[0][1].shift();
                newOperand = varNum[0][1];
            } else {
                newOperand = varNum;
            }
        } else {
            for (var v of tree_1) {
                newOperand.push(mulToExp(v));
            }
        }
        tree_1 = [operator].concat(newOperand);
    }
    return tree_1;
}


