export function fracExpress(tree) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    let operator = tree[0];
    const tree_1 = tree.slice(1);
    if (operator === 'mulchain' && tree_1[0][1][0] === 'fraction') {
        let newOperand = [];
        let num = [];
        let den = [];
        let nega = false;
        for (const term of tree_1) {
            if (term[1][0] === 'fraction') {
                if (term[1][1][0] === 'mulchain') {
                    num = num.concat(term[1][1].slice(1));
                } else if (term[1][1][0] === 'negative') {
                    term[1][1][1][1] === '1' ? nega = true
                    : num.push([term[0], term[1][1]])
                } else if (term[1][1][1] !== '1') {
                    num.push([term[0], term[1][1]]);
                }
                if (term[1][2][0] === 'mulchain') {
                    den = den.concat(term[1][2].slice(1));
                } else if (term[1][2][1] !== '1') {
                    den.push([term[0], term[1][2]]);
                }
            } else {
                term[1][0] === 'mulchain' ? num = num.concat(term[1].slice(1))
                    : num.push([term[0], term[1]])
            }
        }
        const num_length = num.length;
        num_length === 1 ? num = num[0][1]
        : num_length === 0 ? num = ['natural', '1']
        : num.unshift('mulchain')

        den.length === 1 ? den = den[0][1]
        : den.unshift('mulchain')

        if (den.length > 1) {
            operator = 'fraction';
            newOperand.push(num);
            newOperand.push(den);
        } else {
            operator = num.shift();
            newOperand = num;
        }
        return nega ? ['negative'].concat([[operator].concat(newOperand)])
        : [operator].concat(newOperand);
    }
    const newOperand = [];
    for (const v of tree_1) {
        newOperand.push(fracExpress(v));
    }
    return [operator].concat(newOperand);
}
