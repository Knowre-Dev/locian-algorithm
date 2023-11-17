import {rearrangeTree} from '../rc/function_61.inc.js';
import _ from 'lodash';

export function setCommutative(tree = null) {
    if (!Array.isArray(tree)) {
        return tree; 
    }
    return rearrangeTree(tree, ['cap', 'cup']);
    
    
}



