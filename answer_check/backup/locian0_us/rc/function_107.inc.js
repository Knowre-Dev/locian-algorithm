

// 20180816 - optional 2nd argument added by epark
export function rootSimpInt(tree, simplifyPerfectSq = false) {
    var tree_1 = JSON.parse(JSON.stringify(tree));
    if (Array.isArray(tree_1)) {
        var operator = tree_1.shift();
        
        var newOperand = [];
        if (operator === 'squareroot' && tree_1[0][0] === 'natural') {
            var in_1 = 1;
            var out = 1;
            if (tree_1[0][1] !== '0') {
                var factors = pfactor(parseInt(tree_1[0][1]));
                for (var [factor, power] of factors.entries()) {
                    if (factor == 0) {
                        continue;
                    }
                    if (power == 1) {
                        in_1 *= factor;
                    } else if (power % 2 == 0) {
                        out *= Math.pow(factor, power / 2);
                    } else {
                        in_1 *= factor;
                        out *= Math.pow(factor, (power - 1) / 2);
                    }
                }
            }
            
            if (in_1 == 1) {
                newOperand = tree_1;
                // epark 20180816 - useful for exprSimpConst()
                // without breaking anything else
                if (simplifyPerfectSq) {
                    newOperand = [];
                    operator = 'natural';
                    newOperand.push(out.toString());
                }
                
            } else if (out == 1) {
                newOperand.push(tree_1[0]);
                //newOperand[] = ['natural', strval(in)];
            } else {
                operator = 'mulchain';
                newOperand.push(['mul', ['natural', out.toString()]]);
                newOperand.push(['mul', ['squareroot', ['natural', in_1.toString()]]]);
            }
        } else if (operator === 'mulchain') {
            var cons = [];
            for (var term of tree_1) {
                if (term[0] === 'mul' && term[1][0] === 'squareroot') {
                    var nroot = rootSimpInt(term[1], simplifyPerfectSq); // epark 20180816
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
            if (cons.length == 1) {
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
                var mul;
                if (den == 1) {
                    mul = ['mul', ['natural', num.toString()]];
                } else {
                    mul = ['mul', ['fraction', ['natural', num.toString()], ['natural', den.toString()]]];
                }
                newOperand.unshift(mul);
            }
        } else {
            for (var v of tree_1) {
                newOperand.push(rootSimpInt(v, simplifyPerfectSq)); // epark 20180816
            }
        }
        tree_1 = [operator].concat(newOperand);
    }
    return tree_1;
}

export function pfactor(n) {
    // max_n = 2^31-1 = 2147483647
    var d = 2;
    
    var dmax = Math.floor(Math.sqrt(n));
    var factors = new Array(n+1).fill(0, 1);
    var sieve = new Array(n+1).fill(1, 1);
    do {
        var r = false;
        
        while (2 <= d && n % d == 0) {
            
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
            } while (d < dmax && sieve[d] != 1);
            
            if (d > dmax) {
                if (!(n in factors)) {
                    factors[n] = 0;
                }
                factors[n]++;
            }
        }
        
    } while (n > 1 && d <= dmax);
    return factors;
}
/*
import {LatexToTree, is_equal_tree} from '../checkmath.js';
var func = rootSimpInt;
var latex1 = '\\sqrt{4}\\sqrt{xy}';
var latex2 = '2\\sqrt{xy}';
var tree1 = LatexToTree(latex1);
var tree2 = LatexToTree(latex2);
var tree11 = func(tree1);
var tree21 = func(tree2);
console.log(is_equal_tree(tree11, tree21));
console.log(JSON.stringify(tree11, null, 4));
console.log(JSON.stringify(tree21, null, 4));
*/