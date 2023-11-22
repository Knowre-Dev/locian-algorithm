import _ from 'lodash'

export function fracComplex (tree) {
  if (!Array.isArray(tree)) {
    return tree
  }

  const operator = tree[0]
  const tree_1 = tree.slice(1)
  const numArr = []
  const denArr = []
  let newOperand = []
  if (operator === 'fraction') {
    const num = fracComplex(tree_1[0])
    const den = fracComplex(tree_1[1])
    if (num[0] === 'fraction') {
      numArr.push(num[1])
      denArr.push(num[2])
    } else {
      numArr.push(num)
    }
    if (den[0] === 'fraction') {
      denArr.push(den[1])
      numArr.push(den[2])
    } else {
      denArr.push(den)
    }

    let newNum = []
    if (numArr.length > 1) {
      newNum = ['mulchain']
      for (const term of numArr) {
        newNum.push(['mul', term])
      }
    } else {
      newNum = numArr[0]
    }

    let newDen = []
    if (denArr.length > 1) {
      newDen = ['mulchain']
      for (const term of denArr) {
        newDen.push(['mul', term])
      }
    } else {
      newDen = denArr[0]
    }
    newOperand = [newNum, newDen]
  } else {
    for (const v of tree_1) {
      newOperand.push(fracComplex(v))
    }
  }
  return [operator].concat(newOperand)
}
