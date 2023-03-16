export function fracSimpInt(tree) {
    var tree_1 = JSON.parse(JSON.stringify(tree));
    if (Array.isArray(tree_1)) {
        var operator = tree_1.shift();  
        var newOperand = [];
        if (operator === 'fraction') {
            var num = fracSimpInt(tree_1[0]);
            var den = fracSimpInt(tree_1[1]);
            var intNum;
            var intDen;
            if (num[0] === 'natural') {
                intNum = parseInt(num[1]);
                
            } else if (num[0] === 'mulchain') {
                var arrNum = [];
                var narrNum = [];
                var num_1 = num.slice(1);
                for (var term of num_1) {
                    if (term[0] === 'mul' && term[1][0] === 'natural') {
                        arrNum.push(parseInt(term[1][1]));
                    } else {
                        narrNum.push(term);
                    }
                }
                if (arrNum.length == 0) {
                    intNum = 1;
                } else if (arrNum.length == 1) {
                    intNum = arrNum[0];
                } else {
                    intNum = 1;
                    for (var v of arrNum) {
                        intNum *= v;
                    }
                    
                }
            } else {
                intNum = 1;
            }
            var arrDen = [];    
            var narrDen = [];
            
            if (den[0] === 'natural') {
                intDen = parseInt(den[1]);
            } else if (den[0] === 'mulchain') {
                var den_1 = den.slice(1);
                for (var term of den_1) {
                    if (term[0] === 'mul' && term[1][0] === 'natural') {
                        arrDen.push(parseInt(term[1][1]));
                    } else {
                        narrDen.push(term);
                    }
                }
                if (arrDen.length == 0) {
                    intDen = 1;
                } else if (arrDen.length == 1) {
                    intDen = arrDen[0];
                } else {
                    intDen = 1;
                    for (var v of arrDen) {
                        intDen *= v;
                    }
                }
            } else {
                intDen = 1;
            }
            
            var gcf = EuclidAlg(intNum, intDen);
            var newNum = (intNum/gcf).toString();
            var newDen = (intDen/gcf).toString();
            
            if (num[0] === 'natural') {
                newOperand.push(['natural', newNum]);
            } else if (num[0] === 'mulchain') {
                if (newNum !== '1') {
                    narrNum.unshift(['mul', ['natural', newNum]]);
                }
                if (narrNum.length == 1) {
                    narrNum = narrNum[0][1];
                } else {
                    narrNum.unshift('mulchain');
                }
                newOperand.push(narrNum);
            } else {
                newOperand.push(num);
            }
            
            if (den[0] === 'natural') {
                if (newDen === '1') {
                    operator = newOperand[0].shift();
                    newOperand = newOperand[0];
                } else {
                    newOperand.push(['natural', newDen]);
                }
            } else if (den[0] === 'mulchain') {
                if (newDen !== '1') {
                    narrDen.unshift(['mul', ['natural', newDen]]);
                }
                if (narrDen.length == 1) {
                    narrDen = narrDen[0][1];
                } else {
                    narrDen.unshift('mulchain');
                }
                newOperand.push(narrDen);
            } else {
                newOperand.push(den);
            }
        } else {
            for (var v of tree_1) {
                newOperand.push(fracSimpInt(v));
            }
        }
        tree_1 = [operator].concat(newOperand);
    }
    return tree_1;
}

export function EuclidAlg(A, B) {
    while (B != 0) {
        var temp = B;
        B = A % B;
        A = temp;
    }
    return A;
}

