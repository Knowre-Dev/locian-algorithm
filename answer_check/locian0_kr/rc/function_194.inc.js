import _ from 'lodash'

export function mulToExp (tree = null) {
  if (!Array.isArray(tree)) {
    return tree
  }

  let operator = tree[0]
  const tree_1 = tree.slice(1)
  let newOperand = []
  if (operator === 'mulchain') {
    const power = new Object()
    const varNum = []
    for (const term of tree_1) {
      if (term[0] === 'mul') {
        if (term[1][0] === 'variable') {
          if (!power.hasOwnProperty(term[1][1])) {
            power[term[1][1]] = []
          }
          power[term[1][1]].push(term[1])
        } else if (term[1][0] === 'power' && term[1][1][0] === 'variable') {
          varNum.push(term)
        } else {
          varNum.push(term)
        }
      } else {
        varNum.push(term)
      }
    }
    const power_values = Object.values(power)
    for (const v of power_values) {
      if (v.length > 1) {
        varNum.push(['mul', ['power', v[0], ['natural', (v.length).toString()]]])
      } else {
        varNum.push(['mul', v[0]])
      }
    }
    if (varNum.length === 1) {
      operator = varNum[0][1].shift()
      newOperand = varNum[0][1]
    } else {
      newOperand = varNum
    }
  } else {
    for (const v of tree_1) {
      newOperand.push(mulToExp(v))
    }
  }
  return [operator].concat(newOperand)
}
