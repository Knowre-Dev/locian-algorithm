import { addCommutative } from '../rc/function_47.inc.js';
import { addFactorNegative } from '../rc/function_81.inc.js';
import { addAdjacentSigns } from '../rc/function_83.inc.js';

export function sub_addFactorNegative(tree = null) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    const operator = tree[0];
    switch (operator) {
        case 'addchain': {
            const tree_1 = tree.slice(1);
            const newOperand = [];
            for (const t of tree_1) {
                newOperand.push(addFactorNegative(addCommutative(t)));
            }

            return addFactorNegative(addAdjacentSigns(['addchain'].concat(newOperand)));
        }
        case 'equation': {
            const tree_1 = tree.slice(1);
            const newOperand = [];
            for (const v of tree_1) {
                newOperand.push(sub_addFactorNegative(v));
            }
            return ['equation'].concat(newOperand);
        }
        case 'inequality': {
            const tree_1 = tree.slice(1);
            const newOperand = [];
            for (const v of tree_1) {
                newOperand.push(sub_addFactorNegative(v));
            }
            return ['inequality'].concat(newOperand);
        }
        default: {
            return addFactorNegative(tree);
        }
    }
}
