import { LatexToTree, compareMathTree } from '../checkmath.js'
import { makeOneSideOfEqIneqZero } from '../rc/function_155.inc.js'
import json from './kr_json_function'

let data
for (const item of json) {
  if (item.id === 155) {
    data = item.data
    break
  }
}

describe('Table Data Tests', () => {
  data.forEach((row, index) => {
    let tree_1 = LatexToTree(row.answer)
    let tree_2 = LatexToTree(row.inswer)
    tree_1 = makeOneSideOfEqIneqZero(tree_1)
    tree_2 = makeOneSideOfEqIneqZero(tree_2)
    const compareResult = compareMathTree(tree_1, tree_2) ? 1 : 0
    test(`${row.answer} && ${row.inswer} should have a result of ${row.result}`, () => {
      expect(compareResult).toBe(row.result)
    })
  })
})
