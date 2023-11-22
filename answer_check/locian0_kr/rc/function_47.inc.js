import { rearrangeTree } from '../rc/function_61.inc.js'
import _ from 'lodash'

export function addCommutative (tree) {
  return Array.isArray(tree)
    ? rearrangeTree(tree, ['addchain'])
    : tree
}
