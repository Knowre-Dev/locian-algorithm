import _ from 'lodash'

export function addPolyZero (tree) {
  if (!Array.isArray(tree)) {
    return tree
  }

  const operator = tree[0]
  const tree_1 = tree.slice(1)
  const newOperand = []
  if (operator === 'addchain') {
    for (const term of tree_1) {
      if (term[0] === 'sub') {
        if (checkZeroEquiv(term[1])) {
          newOperand.push(['add', term[1]])
        } else {
          newOperand.push(term)
        }
      } else {
        newOperand.push(term)
      }
    }
  } else {
    for (const v of tree_1) {
      newOperand.push(addPolyZero(v))
    }
  }
  return [operator].concat(newOperand)
}

export function checkZeroEquiv (tree) {
  let result = false
  if (!Array.isArray(tree)) {
    return result
  }

  const operator = tree[0]
  const tree_1 = tree.slice(1)
  switch (operator) {
    case 'fraction':
      result = checkZeroEquiv(tree_1[0])
      break
    case 'mulchain':
      const tree_1_0 = tree_1[0]
      for (const term of tree_1_0) {
        if (term[0] === 'natural' && term[1] === '0') {
          result = true
        }
      }
      break
    case 'natural':
      if (tree_1[0] === '0') {
        result = true
      }
      break
    default:
      break
  }

  return result
}
