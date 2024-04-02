export function gcd(a, b) {
    while (b !== 0) {
        [a, b] = [b, a % b];
    }
    return a;
}

export function sign_change(addchain) {
    const [operator, ...operand] = addchain;
    const signs = new Map([
        ['add', 'sub'],
        ['sub', 'add']
    ]);
    const new_operand = operand.map(term => signs.get(term[0])
        ? [signs.get(term[0]), term[1]]
        : term);
    return [operator, ...new_operand];
}
export function math_dirac(r) {
    return r
        ? 0
        : 1;
}

export function math_sign(r) {
    return r
        ? Math.abs(r) / r
        : 0;
}

export function math_step(r, sign) {
    return r
        ? (r + sign * Math.abs(r)) / (2 * r)
        : 0;
}
