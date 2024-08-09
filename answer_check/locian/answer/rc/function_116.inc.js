// squareroot안 정리해서 정부 부분으로 분리 sqrt(8) => 2*sqrt(2)
export function rootSimpInt(tree) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    const [operator, ...operand] = tree;
    if (operator === 'squareroot' && operand[0][0] === 'natural') {
        return simp_squareroot(tree);
    }
    if (operator === 'mulchain') {
        return simp_mulchain(tree);
    }
    return [operator, ...operand.map(term => rootSimpInt(term))];
}

function simp_mulchain(tree) {
    const [operator, ...operand] = tree;
    let cons = []; // 상수
    let others = [];
    operand.forEach(term => {
        const [op, term_1] = term;
        if (op !== 'mul') {
            others = [...others, term];
        }
        if (term_1[0] === 'squareroot') {
            const nroot = rootSimpInt(term_1);
            switch (nroot[0]) {
                case 'natural': {
                    cons = [...cons, ['mul', nroot]];
                    break;
                }
                case 'mulchain': {
                    cons = [...cons, nroot[1]]; // 첫항이 수
                    others = [...others, nroot[2]];
                    break;
                }
                case 'squareroot': {
                    others = [...others, ['mul', nroot]];
                    break;
                }
            }
        } else if (['natural', 'fraction'].includes(term_1[0])) {
            cons = [...cons, term];
        }
    });
    if (cons.length < 2) {
        return [operator, ...cons, ...others];
    }
    let num = 1;
    let den = 1;
    cons.forEach(term => {
        const [, term_1] = term;
        if (term_1[0] === 'natural') {
            num *= term_1[1];
        } else if (term_1[0] === 'fraction') {
            num *= term_1[1][1];
            den *= term_1[2][1];
        }
    });
    num = ['natural', num.toString()];
    const con = den === 1
        ? ['mul', num]
        : ['mul', ['fraction', num, ['natural', den.toString()]]];
    return [operator, con, ...others];
}

function simp_squareroot(tree) {
    let [, [, n]] = tree;
    let max = Math.floor(Math.sqrt(n));
    let inside = 1; // 근호안의 수
    let outside = 1; // 근호밖의 수
    if (n % 2 === 0) {
        [n, inside, outside, max] = root_separation(n, 2, inside, outside);
    }
    let p = 3;
    let primes = [];
    while (n > 1 && p <= max) {
        if (n % p === 0) {
            [n, inside, outside, max] = root_separation(n, p, inside, outside);
        }
        if (n > 1) {
            do {
                p += 2;
            } while (p < max && primes.some(p_1 => p % p_1 === 0));
            if (p > max) {
                inside *= n;
            }
        }
        primes = [...primes, p];
    }
    return outside === 1
        ? tree
        : inside === 1
            ? ['squareroot', ['natural', inside.toString()]]
            : ['mulchain', ['mul', ['natural', outside.toString()]], ['mul', ['squareroot', ['natural', inside.toString()]]]];
    /* 원래 함수 (내부가 1일때도 그냥 tree 반환)
    return outside === 1 || inside === 1
        ? tree
        : ['mulchain', ['mul', ['natural', outside.toString()]], ['mul', ['squareroot', ['natural', inside.toString()]]]];
    */
}

function root_separation(n, p, inside, outside) {
    let exp = 0;
    while (n % p === 0) {
        exp++;
        n /= p;
    }
    inside *= Math.pow(p, exp % 2);
    outside *= Math.pow(p, (exp - exp % 2) / 2);
    const max = Math.floor(Math.sqrt(n));
    return [n, inside, outside, max]
}
/*
import { LatexToTree } from '../checkmath.js';
const latex_1 = '\\sqrt{60}';
const tree_1 = LatexToTree(latex_1)
console.log(JSON.stringify(tree_1, null, 4));
const tree_11 = rootSimpInt(tree_1);
const result_1 = JSON.stringify(tree_11, null, 4);
console.log(result_1);
*/
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
