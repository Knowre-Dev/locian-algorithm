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
