import { addCommutative } from '../rc/function_47.inc.js';
import { addFactorNegative } from '../rc/function_81.inc.js';
import { addAdjacentSigns } from '../rc/function_83.inc.js';

export function sub_addFactorNegative(tree = null) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    const [operator, ...operand] = tree;
    switch (operator) {
        case 'addchain': {
            const newOperand = operand.map(term => addFactorNegative(addCommutative(term)));
            return addFactorNegative(addAdjacentSigns([operator, ...newOperand]));
        }
        case 'equation':
        case 'inequality': {
            return [operator, ...operand.map(term => sub_addFactorNegative(term))];
        }
        default: {
            return addFactorNegative(tree);
        }
    }
}
