export function rootSimpInt(tree) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    let operator = tree[0];
    const tree_1 = tree.slice(1);
    if (operator === 'squareroot' && tree_1[0][0] === 'natural') {
        const factors = pfactor(parseInt(tree_1[0][1]));
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
        if (inside === 1) {
            return tree;
        }
        if (outside === 1) {
            const newOperand = [];
            newOperand.push(tree_1[0]);
            return [operator].concat(newOperand);
        }
        operator = 'mulchain';
        const newOperand = [];
        newOperand.push(['mul', ['natural', outside.toString()]]);
        newOperand.push(['mul', ['squareroot', ['natural', inside.toString()]]]);
        return [operator].concat(newOperand);
    }
    if (operator === 'mulchain') {
        const newOperand = [];
        const cons = [];
        for (const term of tree_1) {
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
        }
        const cons_length = cons.length;
        if (cons_length === 1) {
            newOperand.unshift(cons[0]);
            return [operator].concat(newOperand);
        }
        if (cons_length > 1) {
            let num = 1;
            let den = 1;
            for (const term of cons) {
                if (term[1][0] === 'natural') {
                    num *= parseInt(term[1][1]);
                } else if (term[1][0] === 'fraction') {
                    num *= parseInt(term[1][1][1]);
                    den *= parseInt(term[1][2][1]);
                }
            }
            let mul = [];
            if (den === 1) {
                mul = ['mul', ['natural', num.toString()]];
            } else {
                mul = ['mul', ['fraction', ['natural', num.toString()], ['natural', den.toString()]]];
            }
            newOperand.unshift(mul);
            return [operator].concat(newOperand);
        }
        return [operator].concat(newOperand);
    }
    const newOperand = [];
    for (const v of tree_1) {
        newOperand.push(rootSimpInt(v));
    }
    return [operator].concat(newOperand);
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
