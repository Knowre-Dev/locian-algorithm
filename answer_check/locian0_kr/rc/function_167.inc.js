import {rearrangeTree} from '../rc/function_61.inc.js';
import _ from 'lodash';

export function setCommutative(tree = null) {
    
    var tree_1 = _.cloneDeep(tree);
    if (Array.isArray(tree_1)) {        
        tree_1 = rearrangeTree(tree_1, ['cap', 'cup']);
        return tree_1;
    } else {
        return tree_1;
    }
}



