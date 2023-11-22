import { LatexToTree, compareMathTree } from '../checkmath.js'
import { simp_distribute } from '../rc/preset_29.inc.js'
import json from './kr_json_preset'

let data
for (const item of json) {
  if (item.id === 29) {
    data = item.data
    break
  }
}

describe('Table Data Tests', () => {
  data.forEach((row, index) => {
    let tree_1 = LatexToTree(row.answer)
    let tree_2 = LatexToTree(row.inswer)
    tree_1 = simp_distribute(tree_1)
    tree_2 = simp_distribute(tree_2)
    const compareResult = compareMathTree(tree_1, tree_2) ? 1 : 0
    test(`${row.answer} && ${row.inswer} should have a result of ${row.result}`, () => {
      expect(compareResult).toBe(row.result)
    })
  })
})
