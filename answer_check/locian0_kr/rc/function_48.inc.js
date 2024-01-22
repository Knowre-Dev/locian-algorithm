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
                    : num = [...num, [term[0], term[1][1]]];
                } else if (term[1][1][1] !== '1') {
                    num = [...num, [term[0], term[1][1]]];
                }
                if (term[1][2][0] === 'mulchain') {
                    den = [...den, ...term[1][2].slice(1)];
                } else if (term[1][2][1] !== '1') {
                    den = [...den, [term[0], term[1][2]]];
                }
            } else {
                num = term[1][0] === 'mulchain' ? [...num, ...term[1].slice(1)]
                    : [...num, [term[0], term[1]]];
            }
        });
        const num_length = num.length;
        num = num_length === 1 ? num[0][1]
            : num_length === 0 ? ['natural', '1']
            : ['mulchain', ...num];

        den = den.length === 1 ? den[0][1]
            : ['mulchain', ...den];
        return den.length > 1 ? nega ? ['negative', ['fraction', num, den]]
            : ['fraction', num, den]
            : nega ? ['negative', num]
            : num;
    }
    return [operator, ...operand.map(term => fracExpress(term))];
}
