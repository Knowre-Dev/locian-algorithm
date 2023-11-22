import _ from 'lodash'

export function absToMul (tree = null) {
  if (!Array.isArray(tree)) {
    return tree
  }

  let operator = tree[0]
  const tree_1 = tree.slice(1)
  let newOperand = []

  if (operator === 'absolute') {
    if (tree_1[0][0] === 'variable') {
      newOperand = tree_1
    } else if (tree_1[0][0] === 'negative' &&
            tree_1[0][1][0] === 'variable') {
      const ntree = tree_1[0]
      ntree.shift()
      newOperand = ntree
    } else if (tree_1[0][0] === 'mulchain') {
      const ntree = tree_1[0]
      ntree.shift()
      const vari = []
      const nat = []
      for (const nt of ntree) {
        if (nt[1][0] === 'negative') {
          if (nt[1][1][0] === 'variable') {
            vari.push([nt[0], nt[1][1]])
          } else {
            nat.push([nt[0], nt[1][1]])
          }
        } else {
          if (nt[1][0] === 'variable') {
            vari.push(nt)
          } else {
            nat.push(nt)
          }
        }
      }
      if (nat.length === 0) {
        newOperand.push(['mulchain'].concat(vari))
      } else {
        if (vari.length === 1) {
          const abs_arr = [vari[0][0], ['absolute', vari[0][1]]]
          const mul_arr = nat.concat([abs_arr])
          operator = 'mulchain'
          newOperand = mul_arr
        } else {
          const mul1 = ['mulchain'].concat(vari)
          const abs_arr = ['mul', ['absolute', mul1]]
          const mul_arr = nat.concat([abs_arr])
          operator = 'mulchain'
          newOperand = mul_arr
        }
      }
    } else if (tree_1[0][0] === 'negative') {
      tree_1[0][0] = 'absolute'
      newOperand = absToMul(tree_1[0])
      operator = newOperand.shift()
    } else {
      newOperand = tree_1
    }
  } else {
    for (const v of tree_1) {
      newOperand.push(absToMul(v))
    }
  }
  return [operator].concat(newOperand)
}
