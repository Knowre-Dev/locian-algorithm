import { LatexToTree, compareMathTree } from '../checkmath.js'
import { eqIdentity } from '../rc/function_65.inc.js'
import json from './kr_json_function'

let data
for (const item of json) {
  if (item.id === 65) {
    data = item.data
    break
  }
}

describe('Table Data Tests', () => {
  data.forEach((row, index) => {
    let tree_1 = LatexToTree(row.answer)
    let tree_2 = LatexToTree(row.inswer)
    tree_1 = eqIdentity(tree_1)
    tree_2 = eqIdentity(tree_2)
    const compareResult = compareMathTree(tree_1, tree_2) ? 1 : 0
    test(`${row.answer} && ${row.inswer} should have a result of ${row.result}`, () => {
      expect(compareResult).toBe(row.result)
    })
  })
})
