export function rootSimpInt(tree) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    const [operator, ...operand] = tree;
    if (operator === 'squareroot' && operand[0][0] === 'natural') {
        let n = operand[0][1];
        let d = 2;
        let dmax = Math.floor(Math.sqrt(n));
        let primes = [];
        let inside = 1;
        let outside = 1;
        do {
            let exp = 0;
            while (n % d === 0) {
                exp++;
                n /= d;
            }
            if (exp !== 0) {
                inside *= Math.pow(d, exp % 2);
                outside *= Math.pow(d, (exp - exp % 2) / 2);
                dmax = Math.floor(Math.sqrt(n));
                primes = [...primes, d];
            }
            if (n > 1) {
                do {
                    d++;
                } while (d < dmax && primes.every(p => d % p === 0));
                if (d > dmax) {
                    inside *= n;
                }
            }
        } while (n > 1 && d <= dmax);
        return inside === 1
            ? tree
            : outside === 1
                ? [operator, operand[0]]
                : ['mulchain', ['mul', ['natural', outside.toString()]],
                    ['mul', ['squareroot', ['natural', inside.toString()]]]];
    }
    if (operator === 'mulchain') {
        let newOperand = [];
        let cons = [];
        operand.forEach(term => {
            if (term[0] === 'mul' && term[1][0] === 'squareroot') {
                const nroot = rootSimpInt(term[1]);
                switch (nroot[0]) {
                    case 'natural': {
                        cons = [...cons, ['mul', nroot]];
                        break;
                    }
                    case 'mulchain': {
                        cons = [...cons, nroot[1]];
                        newOperand = [...newOperand, nroot[2]];
                        break;
                    }
                    case 'squareroot': {
                        newOperand = [...newOperand, ['mul', nroot]];
                        break;
                    }
                }
            } else if (term[0] === 'mul' && ['natural', 'fraction'].includes(term[1][0])) {
                cons = [...cons, term];
            } else {
                newOperand = [...newOperand, term];
            }
        });
        switch (cons.length) {
            case 0: {
                return [operator, ...newOperand];
            }
            case 1: {
                return [operator, cons[0], ...newOperand];
            }
            default: {
                let num = 1;
                let den = 1;
                cons.forEach(term => {
                    if (term[1][0] === 'natural') {
                        num *= term[1][1];
                    } else if (term[1][0] === 'fraction') {
                        num *= term[1][1][1];
                        den *= term[1][2][1];
                    }
                });
                const mul = den === 1
                    ? ['mul', ['natural', num.toString()]]
                    : ['mul', ['fraction', ['natural', num.toString()], ['natural', den.toString()]]];
                return [operator, mul, ...newOperand];
            }
        }
    }
    return [operator, ...operand.map(term => rootSimpInt(term))];
}
/*
export function pfactor(n) {
    let d = 2;
    const factors = [];
    let dmax = Math.floor(Math.sqrt(n));
    const sieve = [];
    sieve.fill(1, 1, dmax);
    do {
        let r = false;
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
            for (let i = d; i <= dmax; i += d) {
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
*/
