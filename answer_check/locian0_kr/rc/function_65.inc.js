import {rearrangeTree} from '../rc/function_61.inc.js';
import _ from 'lodash';

export function eqIdentity(tree) {
    if (!Array.isArray(tree)) {
        return tree;
    }
    var tree_1 = _.cloneDeep(tree);
    tree_1 = rearrangeTree(tree_1, ['equation']);
    
    return tree_1;
}
