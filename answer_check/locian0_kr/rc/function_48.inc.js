export function fracExpress(tree) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    const [operator, ...operand] = tree;
    if (operator === 'mulchain' && operand[0][1][0] === 'fraction') {
        let num = [];
        let den = [];
        let nega = false;
        operand.forEach(term => {
            if (term[1][0] === 'fraction') {
                if (term[1][1][0] === 'mulchain') {
                    num = [...num, ...term[1][1].slice(1)];
                } else if (term[1][1][0] === 'negative') {
                    term[1][1][1][1] === '1' ? nega = true
                    : num.push([term[0], term[1][1]])
                } else if (term[1][1][1] !== '1') {
                    num.push([term[0], term[1][1]]);
                }
                if (term[1][2][0] === 'mulchain') {
                    den = [...den, ...term[1][2].slice(1)];
                } else if (term[1][2][1] !== '1') {
                    den.push([term[0], term[1][2]]);
                }
            } else {
                term[1][0] === 'mulchain' ? num = [...num, ...term[1].slice(1)]
                    : num.push([term[0], term[1]])
            }
        });
        const num_length = num.length;
        num_length === 1 ? num = num[0][1]
        : num_length === 0 ? num = ['natural', '1']
        : num = ['mulchain', ...num];

        den.length === 1 ? den = den[0][1]
        : den = ['mulchain', ...den];

        if (den.length > 1) {
            return nega ? ['negative', ['fraction', num, den]]
                : ['fraction', num, den];
        }
        return nega ? ['negative', num]
            : num;
    }
    const newOperand = operand.map(term => fracExpress(term));
    return [operator, ...newOperand];
}
