import _ from 'lodash';

export function fracSimpInt(tree) {
    if (!Array.isArray(tree)) {
        return tree;
    }
    
    let operator = tree[0];
    let tree_1 = tree.slice(1);
    let newOperand = [];
    if (operator === 'fraction') {
        let num = fracSimpInt(tree_1[0]);
        let den = fracSimpInt(tree_1[1]);
        let intNum;
        let intDen;
        let narrNum = [];
        if (num[0] === 'natural') {
            intNum = parseInt(num[1]);
            
        } else if (num[0] === 'mulchain') {
            let arrNum = [];
           
            let num_1 = num.slice(1);
            for (let term of num_1) {
                if (term[0] === 'mul' && term[1][0] === 'natural') {
                    arrNum.push(parseInt(term[1][1]));
                } else {
                    narrNum.push(term);
                }
            }
            if (arrNum.length === 0) {
                intNum = 1;
            } else if (arrNum.length === 1) {
                intNum = arrNum[0];
            } else {
                intNum = 1;
                for (let v of arrNum) {
                    intNum *= v;
                }
                
            }
        } else {
            intNum = 1;
        }
        let arrDen = [];    
        let narrDen = [];
        
        if (den[0] === 'natural') {
            intDen = parseInt(den[1]);
        } else if (den[0] === 'mulchain') {
            let den_1 = den.slice(1);
            for (let term of den_1) {
                if (term[0] === 'mul' && term[1][0] === 'natural') {
                    arrDen.push(parseInt(term[1][1]));
                } else {
                    narrDen.push(term);
                }
            }
            if (arrDen.length === 0) {
                intDen = 1;
            } else if (arrDen.length === 1) {
                intDen = arrDen[0];
            } else {
                intDen = 1;
                for (let v of arrDen) {
                    intDen *= v;
                }
            }
        } else {
            intDen = 1;
        }
        
        let gcf = EuclidAlg(intNum, intDen);
        let newNum = (intNum/gcf).toString();
        let newDen = (intDen/gcf).toString();
        
        if (num[0] === 'natural') {
            newOperand.push(['natural', newNum]);
        } else if (num[0] === 'mulchain') {
            if (newNum !== '1') {
                narrNum.unshift(['mul', ['natural', newNum]]);
            }
            if (narrNum.length === 1) {
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
            if (narrDen.length === 1) {
                narrDen = narrDen[0][1];
            } else {
                narrDen.unshift('mulchain');
            }
            newOperand.push(narrDen);
        } else {
            newOperand.push(den);
        }
    } else {
        for (let v of tree_1) {
            newOperand.push(fracSimpInt(v));
        }
    }
    return [operator].concat(newOperand);
    
    
}

export function EuclidAlg(A, B) {
    while (B !== 0) {
        let temp = B;
        B = A % B;
        A = temp;
    }
    return A;
}

