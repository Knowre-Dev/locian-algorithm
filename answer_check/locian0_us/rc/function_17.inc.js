
export function rearrangeTreeEq(A, B) {
    var A_1 = JSON.parse(JSON.stringify(A));
    var B_1 = JSON.parse(JSON.stringify(B));
    if (Array.isArray(A_1) && !Array.isArray(B_1)) {
        return 1;
    } else if (!Array.isArray(A_1) && Array.isArray(B_1)) {
        return -1;
    } else if (!Array.isArray(A_1) && !Array.isArray(B_1)) {
        if (typeof A_1 > typeof B_1) {
            return 1;
        } else if (typeof A_1 < typeof B_1) {
            return -1;
        } else if (A_1 > B_1) {
            return 1;
        } else if (A < B_1) {
            return -1;
        } else {
            return 0;
        }
    }
    
    var negA = false;
    var operatorA;
    var operandA;
    if (A_1[0] === 'negative') {
        operatorA = A_1[1][0];
        operandA = A_1[1].slice(1);
        negA = true;
    } else {
        operatorA = A_1[0];
        operandA = A_1.slice(1);
    }
    
    var operatorB;
    var operandB;
    var negB = false;
    if (B[0] === 'negative') {
        operatorB = B_1[1][0];
        operandB = B_1[1].slice(1);
        negB = true;
    } else {
        operatorB = B_1[0];
        operandB = B_1.slice(1);
    }
    
    var place = [0, 0];
    var opflag;
    for (var [k, term] of [operatorA, operatorB].entries()) {
        switch (term) {
            case 'add':
            case 'sub':
            case 'addsub':
            case 'subadd':
                opflag = false;
                break;
            
            case 'negative':
                place[k] = 1;
                break;
            
            case 'fraction':
                place[k] = 2;
                break;
            
            case 'mul':
                place[k] = 1;
                break;
            
            default:
                opflag = true;               
                break;
        }
    }
    
    if (place[0] < place[1]) {
        return 1;
    } else if (place[0] > place[1]) {
        return -1;
    } else {
        if (operatorA > operatorB) {
            return 1;
        } else if (operatorA < operatorB) {
            return -1;
        } else if (operatorA == operatorB && operatorA == 'div') { // disable commutative property for div
            return 1;
        } else {
            if (operandA.length > operandB.length) {
                return 1;
            } else if (operandA.length < operandB.length) {
                return -1;
            } else {
                for (var [k, v] of operandA.entries()) {
                    var temp = rearrangeTreeEq(v, operandB[k]);
                    if (temp === 0) {
                        continue;
                    } else {
                        return temp;
                    }
                }
                if (negA && !negB) {
                    return 1;
                } else if (!negA && negB) {
                    return -1;
                } else {
                    return 0;
                }
            }
        }
    }
}