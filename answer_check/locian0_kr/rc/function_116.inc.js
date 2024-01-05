export function rootSimpInt(tree) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    const [operator, ...operand] = tree;
    if (operator === 'squareroot' && operand[0][0] === 'natural') {
        const factors = pfactor(parseInt(operand[0][1]));
        let inside = 1;
        let outside = 1;
        const factors_entries = factors.entries();
        for (const [factor, power] of factors_entries) {
            if (power === undefined) {
                continue;
            }
            if (power === 1) {
                inside *= factor;
            } else if (power % 2 === 0) {
                outside *= Math.pow(factor, power / 2);
            } else {
                inside *= factor;
                outside *= Math.pow(factor, (power - 1) / 2);
            }
        }
        return inside === 1 ? tree
            : outside === 1 ? [operator, operand[0]]
            : ['mulchain', ['mul', ['natural', outside.toString()]],
                ['mul', ['squareroot', ['natural', inside.toString()]]]
            ];
    }
    if (operator === 'mulchain') {
        const newOperand = [];
        const cons = [];
        operand.forEach(term => {
            if (term[0] === 'mul' && term[1][0] === 'squareroot') {
                const nroot = rootSimpInt(term[1]);
                switch (nroot[0]) {
                    case 'natural': {
                        cons.push(['mul', nroot]);
                        break;
                    }
                    case 'mulchain': {
                        cons.push(nroot[1]);
                        newOperand.push(nroot[2]);
                        break;
                    }
                    case 'squareroot': {
                        newOperand.push(['mul', nroot]);
                        break;
                    }
                }
            } else if (term[0] === 'mul' && ['natural', 'fraction'].includes(term[1][0])) {
                cons.push(term);
            } else {
                newOperand.push(term);
            }
        });
        const cons_length = cons.length;
        if (cons_length === 1) {
            return [operator, cons[0], ...newOperand];
        }
        if (cons_length > 1) {
            let num = 1;
            let den = 1;
            cons.forEach(term => {
                if (term[1][0] === 'natural') {
                    num *= parseInt(term[1][1]);
                } else if (term[1][0] === 'fraction') {
                    num *= parseInt(term[1][1][1]);
                    den *= parseInt(term[1][2][1]);
                }
            });
            const mul = den === 1 ? ['mul', ['natural', num.toString()]]
                : ['mul', ['fraction', ['natural', num.toString()], ['natural', den.toString()]]];
            return [operator, mul, ...newOperand];
        }
        return [operator, ...newOperand];
    }
    const newOperand = operand.map(term => rootSimpInt(term));
    return [operator, ...newOperand];
}

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
