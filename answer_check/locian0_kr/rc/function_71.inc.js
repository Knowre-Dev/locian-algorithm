import _ from 'lodash'

export function addNegative (tree) {
  if (!Array.isArray(tree)) {
    return tree
  }

  let operator = tree[0]
  const tree_1 = tree.slice(1)
  let newOperand = []
  if (operator === 'negative' && tree_1.length === 1) {
    const addchain = addNegative(tree_1[0])
    if (addchain[0] === 'addchain') {
      operator = addchain.shift()
      for (const term of addchain) {
        term[0] === 'add'
          ? newOperand.push(['sub', term[1]])
          : term[0] === 'sub'
            ? newOperand.push(['add', term[1]])
            : newOperand.push(term)
      }
    } else {
      newOperand = tree_1
    }
  } else if (operator === 'addchain') {
    for (const term of tree_1) {
      if (term[0] === 'sub' && term[1][0] === 'addchain') {
        const term_1 = term[1].slice(1)
        for (const inner of term_1) {
          inner[0] === 'add'
            ? newOperand.push(['sub', inner[1]])
            : inner[0] === 'sub'
              ? newOperand.push(['add', inner[1]])
              : newOperand.push(inner)
        }
      } else {
        newOperand.push(term)
      }
    }
  } else {
    for (const v of tree_1) {
      newOperand.push(addNegative(v))
    }
  }
  return [operator].concat(newOperand)
}
