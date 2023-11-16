import _ from 'lodash';

export function rootSimpInt(tree) {
    if (!Array.isArray(tree)) {
        return tree;
    }
    var tree_1 = _.cloneDeep(tree);
    var operator = tree_1.shift();
    var newOperand = [];
    if (operator === 'squareroot' && tree_1[0][0] === 'natural') {
        var factors = pfactor(parseInt(tree_1[0][1]));
        
        var inside = 1;
        var outside = 1;
        for (var [factor, power] of factors.entries()) {
            if (power === undefined) {
                continue;
            }
            if (power === 1) {
                inside *= factor;
            } else if (power % 2 === 0) {
                outside *= Math.pow(factor, power / 2);
            } else {
                inside *= factor;
                outside *= Math.pow(factor, (power - 1)/2);
            }
        }
        if (inside === 1) {
            newOperand = tree_1;
            
        } else if (outside === 1) {
            newOperand.push(tree_1[0]);
           
        } else {
            operator = 'mulchain';
            newOperand.push(['mul', ['natural', outside.toString()]]);
            newOperand.push(['mul', ['squareroot', ['natural', inside.toString()]]]);
        }
    } else if (operator === 'mulchain') {
        var cons = [];
        for (var term of tree_1) {
            if (term[0] === 'mul' && term[1][0] === 'squareroot') {
                var nroot = rootSimpInt(term[1]);
                if (nroot[0] === 'natural') {
                    cons.push(['mul', nroot]);
                } else if (nroot[0] === 'mulchain') {
                    cons.push(nroot[1]);
                    newOperand.push(nroot[2]);
                } else if (nroot[0] === 'squareroot') {
                    newOperand.push(['mul', nroot]);
                }
            } else if (term[0] === 'mul' && ['natural', 'fraction'].includes(term[1][0])) {
                cons.push(term);
            } else {
                newOperand.push(term);
            }
        }
        if (cons.length === 1) {
            newOperand.unshift(cons[0]);
        } else if (cons.length > 1) {
            var num = 1;
            var den = 1;
            for (var term of cons) {
                if (term[1][0] === 'natural') {
                    num *= parseInt(term[1][1]);
                } else if (term[1][0] === 'fraction') {
                    num *= parseInt(term[1][1][1]);
                    den *= parseInt(term[1][2][1]);
                }
            }
            var mul = [];
            if (den === 1) {
                mul = ['mul', ['natural', num.toString()]];
            } else {
                mul = ['mul', ['fraction', ['natural', num.toString()], ['natural', den.toString()]]];
            }
            newOperand.unshift(mul);
        }
    } else {
        for (var v of tree_1) {
            newOperand.push(rootSimpInt(v));
        }
    }
    tree_1 = [operator].concat(newOperand);
    
    return tree_1;
}

export function pfactor(n) {
    // max_n = 2^31-1 = 2147483647
    var d = 2;
    var factors = [];
    var dmax = Math.floor(Math.sqrt(n));
    var sieve = [];
    sieve.fill(1, 1, dmax);
    do {
        var r = false;
        while (n % d === 0) {
            if (!(d in factors)) {
                factors[d] = 0;
            }
            factors[d]++;
            n /= d;
            r = true;
        }
        if (r) {
            dmax = Math.floor(Math.sqrt(n));
        }
        if (n > 1) {
            for (var i = d; i <= dmax; i += d) {
                sieve[i] = 0;
            }
            do {
                d++;
            } while (d < dmax && sieve[d] !== 1);
            if (d > dmax) {
                if (!(n in factors)) {
                    factors[n] = 0
                }
                factors[n]++;
            }
        }
    } while (n > 1 && d <= dmax);
    return factors;
}


