// inequality에서 부호정리 -a<b<-c => c<-b<a
export function ineqRearrange(tree = null) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    const [operator, ...operand] = tree;
    if (!(operator === 'inequality' && operand[0][0] === 'negative')) {
        return tree;
    }
    const opeerand_rev = operand.reverse();
    const newOperand = opeerand_rev.map(term_rev => Array.isArray(term_rev)
        ? term_rev[0] === 'negative'
            ? term_rev[1]
            : ['negative', term_rev]
        : term_rev);
    return [operator, ...newOperand];
}
