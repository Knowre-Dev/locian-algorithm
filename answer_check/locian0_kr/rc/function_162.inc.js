import { fracSimp } from '../rc/function_67.inc.js'
import { addFactoredForm } from '../rc/function_70.inc.js'
import { fracSimpVar } from '../rc/function_77.inc.js'
import { addFactoredFormVar } from '../rc/function_117.inc.js'
import _ from 'lodash'

export function sub_addFactored (tree = null) {
  if (!Array.isArray(tree)) {
    return tree
  }

  const simple1 = fracSimp(tree)
  const simple2 = fracSimpVar(tree)
  // 약분되는 경우는 안묶고 그냥 return (어차피 틀림)
  if (JSON.stringify(tree) !== JSON.stringify(simple1) || JSON.stringify(tree) !== JSON.stringify(simple2)) {
    return tree
  }

  const operator = tree[0]
  const tree_1 = tree.slice(1)
  let newOperand = []

  if (operator === 'addchain') {
    const add_term = []
    for (const t of tree_1) {
      if (t[0] === 'add') {
        if (t[1][0] === 'addchain') {
          const t_1_entries = t[1].entries()
          for (const [k, t11] of t_1_entries) {
            if (k !== 0) {
              add_term.push(t11)
            }
          }
        } else {
          if (t[1][0] === 'mulchain') {
            let addchain = false
            const t_1_entries = t[1].entries()
            for (const [k, t1] of t_1_entries) {
              if (k !== 0 && t1[1][0] === 'addchain') {
                addchain = t
              }
            }
            if (addchain !== false) {
              const trans1 = addFactoredFormVar(addchain)
              const trans2 = addFactoredForm(trans1)
              add_term.push(trans2)
            } else {
              add_term.push(t)
            }
          } else {
            add_term.push(t)
          }
        }
      } else {
        if (t[1][0] === 'addchain') {
          const t_1_entries = t[1].entries()
          for (const [k, t11] of t_1_entries) {
            if (k !== 0) {
              if (t11[0] === 'add') {
                add_term.push(['sub', t11[1]])
              } else {
                add_term.push(['add', t11[1]])
              }
            }
          }
        } else {
          if (t[1][0] === 'mulchain') {
            let addchain = false
            const t_1_entries = t[1].entries()
            for (const [k, t1] of t_1_entries) {
              if (k !== 0 && t1[1][0] === 'addchain') {
                addchain = t
                break
              }
            }

            if (addchain !== false) {
              const trans1 = addFactoredFormVar(addchain)
              const trans2 = addFactoredForm(trans1)
              add_term.push(trans2)
            } else {
              add_term.push(t)
            }
          } else {
            add_term.push(t)
          }
        }
      }
    }

    if (add_term.length !== 0) {
      const add_tree = ['addchain'].concat(add_term)
      const add_trans1 = addFactoredFormVar(add_tree)
      return add_trans1
    }
  } else if (operator === 'mulchain') {
    for (const t of tree_1) {
      newOperand.push(sub_addFactored(t))
    }
  } else {
    newOperand = tree_1
  }
  return [operator].concat(newOperand)
}

/*
import {LatexToTree} from '../checkmath.js';
let latex_1 = '(2-12a)+(3a+6)\\sqrt{2}';
latex_1 = '(3a+6)\\sqrt{2}+(2-12a)';
let tree_1 = LatexToTree(latex_1);
let tree_11 = sub_addFactored(tree_1);
let result_1 = JSON.stringify(tree_11, null, 4);
console.log(JSON.stringify(tree_11, null, 4));
*/
