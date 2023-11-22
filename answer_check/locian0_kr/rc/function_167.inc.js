import { rearrangeTree } from '../rc/function_61.inc.js'
import _ from 'lodash'

export function setCommutative (tree = null) {
  return Array.isArray(tree)
    ? rearrangeTree(tree, ['cap', 'cup'])
    : tree
}
