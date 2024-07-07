// import { addNegative } from '../rc/function_71.inc.js';
import { addFactor_1 } from '../rc/function_128.inc.js';
import { sign_change } from '../rc/sub_functions.js';
// 부호와 constant정리 및 term들 순서 정리
export function addFactoredForm(tree) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    const [operator, ...operand] = tree;
    switch (operator) {
        case 'negative': {
            const term = addFactoredForm(operand[0]);
            return term[0] === 'negative' // negtive  제거
                ? term[1]
                : [operator, term];
        }
        case 'mulchain': {
            let is_addchain = false;
            let is_nega = false;
            let cons = [];
            const facts = [];
            const others = [];
            const [term_0, ...operand_1] = operand;
            if (term_0[0] === 'mul' && term_0[1][0] === 'natural') { // 첫항이 자연수
                cons = [...cons, term_0];
            } else {
                [is_addchain, is_nega] = update_terms(term_0, is_addchain, is_nega, cons, facts, others); // term을 종류별로 분류
            }
            operand_1.forEach(term => {
                [is_addchain, is_nega] = update_terms(term, is_addchain, is_nega, cons, facts, others);
            });
            if (!is_addchain) {
                /* 지우지 말것
                return is_nega
                    ? ['negative', tree]
                    : tree;
                    */
                   return tree;
            }
            let newOperand = [...others, ...facts];
            const natural = cons.reduce((a, b) => a * b[1][1], 1);
            if (natural !== 1) {
                newOperand = [['mul', ['natural', natural.toString()]], ...newOperand];
            }
            const tree_new = [operator, ...newOperand];
            return is_nega
                ? ['negative', tree_new]
                : tree_new;
        }
        case 'addchain': {
            const fact = addFactor_1(tree); // constant부분을 앞으로 몰아줌
            let con = [];
            let addchain = fact;
            let is_nega = false;
            if (fact[0] === 'mulchain') {
                [, con, [, addchain]] = fact;
            }
            if (addchain[1][0] === 'sub') {
                addchain = sign_change(addchain);
                is_nega = true;
            }
            const new_tree = fact[0] === 'mulchain'
                ? ['mulchain', con, ['mul', addchain]]
                : addchain;
            return is_nega
                ? ['negative', new_tree]
                : new_tree;
        }
        default: {
            const operand_new = operand.map(term => addFactoredForm(term));
            return [operator, ...operand_new];
        }
    }
}

function update_terms(term, is_addchain, is_nega, cons, facts, others) {
    if (term[0] === 'mul' && term[1][0] === 'addchain') {
        is_addchain = true;
        const fact = addFactor_1(term[1]);
        let addchain = [];
        const [operator_1] = fact;
        if (operator_1 === 'mulchain') {
            cons.push(fact[1]);
            [, , [, addchain]] = fact;
        } else if (operator_1 === 'addchain') {
            addchain = fact;
        }
        if (addchain[1][0] === 'sub') {
            addchain = sign_change(addchain);
            is_nega = !is_nega;
        }
        facts.push(['mul', addchain]);
    } else {
        others.push(term);
    }
    return [is_addchain, is_nega];
}
