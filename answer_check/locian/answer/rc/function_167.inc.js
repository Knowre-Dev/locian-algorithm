import { rearrangeTree } from '../rc/function_61.inc.js';

export function setCommutative(tree = null) {
    return rearrangeTree(tree, ['cap', 'cup']);
}
