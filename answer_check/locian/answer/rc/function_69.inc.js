// (a/b) / (c/d) => ad / bc

export function fracComplex(tree) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    const [operator, ...operand] = tree;

    if (operator !== 'fraction') {
        const operand_new = operand.map(term => fracComplex(term));
        return [operator, ...operand_new];
    }
    let [num, den] = operand;
    num = fracComplex(num);
    den = fracComplex(den);

    let nums = [];
    let dens = [];
    if (num[0] === 'fraction') {
        nums = [...nums, num[1]];
        dens = [...dens, num[2]];
    } else {
        nums = [...nums, num];
    }
    if (den[0] === 'fraction') {
        dens = [...dens, den[1]];
        nums = [...nums, den[2]];
    } else {
        dens = [...dens, den];
    }
    const num_new = form_term(nums);
    const den_new = form_term(dens);
    return [operator, num_new, den_new]
}

function form_term(terms) {
    return terms.length > 1
        ? ['mulchain', ...terms.map(term => ['mul', term])]
        : terms[0];
}
