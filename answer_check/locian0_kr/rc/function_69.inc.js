// (a/b) / (c/d) => ad / bc

export function fracComplex(tree) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    const [operator, ...operand] = tree;

    if (operator !== 'fraction') {
        return [operator, ...operand.map(term => fracComplex(term))];
    }
    let nums = [];
    let dens = [];
    const num = fracComplex(operand[0]);
    const den = fracComplex(operand[1]);
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

    const newNum = nums.length > 1
        ? ['mulchain', ...nums.map(term => ['mul', term])]
        : nums[0];
    const newDen = dens.length > 1
        ? ['mulchain', ...dens.map(term => ['mul', term])]
        : dens[0];
    return [operator, newNum, newDen]
}
