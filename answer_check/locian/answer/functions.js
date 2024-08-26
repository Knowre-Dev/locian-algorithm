export function is_equal(a, b) {
    return JSON.stringify(a) === JSON.stringify(b);
}

// javascript version is_numeric
export function is_numeric(number) {
    return isFinite(number) && !isNaN(parseFloat(number))
}

export function is_include(items, a) {
    return items.some(item => is_equal(item, a));
}

// javascript version preg_match_all

export function match_all(string, regexp) {
    const matches = [...string.matchAll(regexp)];
    let result = [];
    if (matches.length === 0) {
        return result;
    }
    const match_0_length = matches[0].length;
    for (let i = 0; i < match_0_length; i++) {
        result = [...result, []];
    }
    matches.forEach(match => {
        match.forEach((value, key) => {
            result[key] = [...result[key], value];
        });
    });
    return result;
}

export function _replacementInMathTree(tree, from, to) {
    if (is_equal(tree, from)) {
        return to;
    }
    const [operator, ...operand] = tree;

    const newOperand = [];
    for (const v of operand) {
        if (Array.isArray(v)) {
            newOperand.push(_replacementInMathTree(v, from, to));
        } else {
            newOperand.push(v);
        }
    }

    return [operator, ...operand];
}
