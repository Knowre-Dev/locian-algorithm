import {rearrangeTree} from '../rc/function_61.inc.js';
import _ from 'lodash';

export function addCommutative(tree) {
    let tree_1 = _.cloneDeep(tree);                              
    if (Array.isArray(tree_1)) {
        tree_1 = rearrangeTree(tree_1, ['addchain']);
    }
    return tree_1;
}


