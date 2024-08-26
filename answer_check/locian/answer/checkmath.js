import { Laco } from './libs/common.inc.js';
import { getOrderedAnswerArray, compareOrderedAnswerArray } from './check_commonfunction.js';
import { is_equal, is_numeric, _replacementInMathTree } from './functions.js'
import { evaluateEx } from './check_evaluate.js'
import { LatexToTree } from './LatexToTree.js';
// const

/* eslint-disable no-useless-escape */

/*
function: compare two trees
input: treeA - tree, treeB - tree
ouput: true, false
*/
export function compareMathTree(tree_A, tree_B) {
    if (typeof tree_A !== typeof tree_B) {
        return false;
    }
    if (!Array.isArray(tree_A)) {
        return JSON.stringify(tree_A) === JSON.stringify(tree_B);
    }
    if ([tree_A[0], tree_B[0]].includes('anything')) {
        return true;
    }
    /* don't delete (둘중 하나라도 "anything"이면 결국 두 트리는 같은 것이 되므로 결과는  true)
    if (tree_A[0] === 'anything') {
        tree_A = tree_B;
    } else if (tree_B[0] === 'anything') {
        tree_B = tree_A;
    }
    */
    if (tree_A.length === 1) {
        return true;
    }
    const [operator_A, ...operand_A] = tree_A;
    const [operator_B, ...operand_B] = tree_B;
    if (operator_A !== operator_B || tree_A.length !== tree_B.length) {
        return false;
    }
    if (operator_A !== 'eval') {
        return operand_A.every((term_A, key) => compareMathTree(term_A, operand_B[key]));
    }
    let num_null = 0;
    const operand_A_entries = operand_A.entries();
    for (const [key, term_A] of operand_A_entries) {
        const term_B = operand_B[key];
        if (term_A === null && term_B === null) {
            num_null++;
            if (num_null === 4) {
                return false;
            }
            continue;
        }
        let re_A;
        let re_B;
        let im_A;
        let im_B;
        if (term_A[0] === 'equation') {
            // 160818 larwein - equation patch : 계산값의 차를 구해서 비교 + 이항 부호 다르면 바꿔서 비교
            const [, [re_l_A, im_l_A], [re_r_A, im_r_A]] = term_A;
            re_A = (parseFloat(re_l_A) - parseFloat(re_r_A)).toExponential(4);
            im_A = (parseFloat(im_l_A) - parseFloat(im_r_A)).toExponential(4);

            const [, [re_l_B, im_l_B], [re_r_B, im_r_B]] = term_B;
            re_B = (parseFloat(re_l_B) - parseFloat(re_r_B)).toExponential(4);
            im_B = (parseFloat(im_l_B) - parseFloat(im_r_B)).toExponential(4);

            if (re_A === -1 * re_B && im_A === -1 * im_B) {
                continue;
                // re_B = re_A;
                // im_B = im_A;
            }
        } else {
            // 150818 larwein - 유효숫자 범위 줄임
            [re_A, im_A] = term_A;
            re_A = parseFloat(re_A).toExponential(4);
            im_A = parseFloat(im_A).toExponential(4);

            [re_B, im_B] = term_B;
            re_B = parseFloat(re_B).toExponential(4);
            im_B = parseFloat(im_B).toExponential(4);
        }
        if (re_A !== re_B || im_A !== im_B) {
            return false;
        }
    }
    return true;
}

// checkmath
export function checkMath(answer, inswer) {
    answer = getOrderedAnswerArray(answer);
    inswer = getOrderedAnswerArray(inswer);
    return compareOrderedAnswerArray(answer, inswer, 'Math');
}

/***********************************************************
name:   checkMath_one
role:
input:
output:
 ***********************************************************/
let preset;
export function checkMath_one(right, input, option) { //
    // 170206 larwein - laco
    const laco = new Laco();
    if (option[0] === 'laco' && option[1]) {
        const answer = laco.parse(right);
        const inswer = laco.parse(input);
        // fb(preset[option[1]], 'laco_mode : ');

        const answer_result = preset[option[1]](answer);
        const answer_logs = laco.getLogs();
        answer_logs.forEach(log => {
            log = laco.getLatex(log.tree);
        })
        // fb(answer_logs, 'answer_laco_logs : ');

        const inswer_result = preset[option[1]](inswer);
        const inswer_logs = laco.getLogs();
        inswer_logs.forEach(log => {
            log = laco.getLatex(log.tree);
        })

        // fb(inswer_logs, 'inswer_laco_logs : ');
        // fb(answer_result, 'answer_result');
        // fb(inswer_result, 'inswer_result');

        return compareMathTree(answer_result, inswer_result);
    }
    const treeRight = !Array.isArray(right)
        ? LatexToTree(right)
        : right;
    if (!treeRight) {
        return false;
    }
    const treeInput = !Array.isArray(input)
        ? LatexToTree(input)
        : input;
    if (!treeInput) {
        return false;
    }

    const orgRight = organizeMathTree(treeRight, option);
    const orgInput = organizeMathTree(treeInput, option);

    if (orgRight && orgInput) {
        return compareMathTree(orgRight, orgInput);
    } else {
        return false;
    }
}

/***********************************************************
name:   organizeMathTree
role:
input:
output:
subfunctions:
 ***********************************************************/

function organizeMathTree(tree, option) { // fin
    // do pre-process of special option (if it exists)
    let specialOption;
    if (typeof option[5] !== 'undefined') {
        specialOption = option[5];
        tree = organizeMathTree_preSpecial(tree, specialOption);
    }

    const [optionArrange] = option;
    option = option.slice(1, 5);
    let result;
    switch (optionArrange) {
        case 'single': {
            result = organizeMathTree_arrangeSingle(tree, option);
            break;
        }
        case 'set': {
            if (tree[0] === 'array' && tree.length > 2) {
                result = organizeMathTree_arrangeSet(tree, option);
            } else {
                return organizeMathTree_arrangeSingle(tree, option);
            }
            break;
        }
        case 'seq': {
            if (tree[0] === 'array' && tree.length > 2) {
                result = organizeMathTree_arrangeSeq(tree, option);
            } else {
                result = organizeMathTree_arrangeSingle(tree, option);
            }
            break;
        }
        default: {
            result = false;
        }
    }

    // do post-process of special option (if it exists)
    if (typeof specialOption !== 'undefined') {
        result = organizeMathTree_postSpecial(result, specialOption);
    }
    return result;
}

/***********************************************************
name:   organizeMathTree_arrangeSingle
role:
input:
output:
 ***********************************************************/

function organizeMathTree_arrangeSingle(tree, option) { // fin
    const [optionFactor] = option;
    [, ...option] = option;
    // comma => eg. 3,000 as 3000
    // eqsys, prop 은 현재 사용되지 않음
    tree = _organizeMathTree_arrangeSingle_decimalMarker(tree);
    switch (optionFactor) {
        case 'ex': {
            return organizeMathTree_relationEx(tree, option);
        }
        case 'eq': {
            return organizeMathTree_relationEq(tree, option);
        }
        case 'eqeq': {
            return organizeMathTree_relationEqeq(tree, option);
        }
        case 'eqsys': { // 연립방정식 - 현재 미개발, 추후에도 계획 없음
            return organizeMathTree_relationEqsys(tree, option);
        }
        case 'prop': { // 비례식 a:b=c:d 와 동치인지 - 현재 미개발
            return organizeMathTree_relationProp(tree, option);
        }
        default: {
            return false;
        }
    }
}

/***********************************************************
name:   organizeMathTree_arrangeSingle_decimalMarker
role:
input:
output:
 ***********************************************************/

function _organizeMathTree_arrangeSingle_decimalMarker(tree) {
    const objs_1 = _searchTypeInMathtree(tree, 'array');
    const objs_2 = _searchTypeInMathtree(tree, 'tuple');
    const objs = [...objs_1, ...objs_2];
    for (const obj of objs) {
        let flag_change = true;
        let newObj = '';
        const entries_o = obj.slice(1).entries();
        for (const [k, block] of entries_o) {
            if (block[0] === 'natural') {
                if (k === 0 && block[1].length < 4) {
                    newObj += block[1];
                } else if (block[1].length === 3) {
                    newObj += block[1];
                } else {
                    flag_change = false;
                    break;
                }
            } else {
                flag_change = false;
                break;
            }
        }
        if (flag_change) {
            tree = _replacementInMathTree(tree, obj, ['natural', newObj]);
        }
    }
    return tree;
}

function organizeMathTree_arrangeSeq(tree, option) { // fin
    const [operator, ...operand] = tree;
    const operand_new = operand.map(v => organizeMathTree_arrangeSingle(v, option))
    return [operator, ...operand_new];
}

function organizeMathTree_arrangeSet(tree, option) { // fin
    const set = organizeMathTree_arrangeSeq(tree, option);
    return rearrangeMathTree(set, ['array']);
}

function organizeMathTree_relationEx(tree, option) { // fin
    const [operator, ...operand] = tree;
    switch (operator) {
        case 'ratio':
        case 'equation': {
            const operand_new = operand.map(v => organizeMathTree_relationEx(v, option));
            return [operator, ...operand_new];
        }
        case 'inequality': {
            const result = [operator];
            operand.forEach((v, k) => {
                if (k % 2 === 0) {
                    result.push(organizeMathTree_relationEx(v, option));
                } else {
                    result.push(v);
                }
            })
            return result;
        }
    }
    const [optionRelation] = option;
    [, ...option] = option;
    switch (optionRelation) {
        case 'simp': {
            return organizeMathTree_factorSimp(tree, option);
        }
        case 'fact': {
            return organizeMathTree_factorFact(tree, option);
        }
        default: {
            return false;
        }
    }
}

function organizeMathTree_relationEq(tree, option) { // fin
    const newTree = organizeMathTree_relationEx(tree, option);
    return rearrangeMathTree(newTree, ['equation', 'inequality']);
}

function organizeMathTree_relationEqeq(tree, option) { // postpone
    const [operator, ...operand] = tree;
    let newTree;
    switch (operator) {
        case 'equation': {
            newTree = [
                'equation',
                ['addchain', ['add', operand[0]], ['sub', operand[1]]],
                ['natural', 0]
            ];
            break;
        }
        case 'inequality': {
            if (operand[1] === 'gt' || operand[1] === 'ge') {
                newTree = [
                    'inequality',
                    ['addchain', ['add', operand[0]], ['sub', operand[2]]],
                    operand[1],
                    ['natural', 0]
                ];
            } else {
                newTree = [
                    'inequality',
                    ['addchain', ['add', operand[2]], ['sub', operand[0]]],
                    operand[1] === 'lt' ? 'gt' : 'ge',
                    ['natural', 0]
                ];
            }
            break;
        }
        default: {
            return organizeMathTree_simplifiedEqui(tree, null);
        }
    }

    let evaluated = evaluateEx(newTree);
    const [, [, head]] = evaluated;
    [, ...evaluated] = evaluated;
    if (head[0] < 0) {
        evaluated.forEach((v, k) => {
            switch (v[2]) {
                case 'gt': {
                    evaluated[k][2] = 'lt';
                    break;
                }
                case 'ge': {
                    evaluated[k][2] = 'le';
                    break;
                }
                case 'lt': {
                    evaluated[k][2] = 'gt';
                    break;
                }
                case 'le': {
                    evaluated[k][2] = 'ge';
                    break;
                }
                default: {
                    break;
                }
            }
        })
    }
    const newEval = [];
    evaluated.forEach((v, k) => {
        const eq = v;
        const den = Math.pow(head[0], 2) * Math.pow(head[0], 2);
        const lhs = [
            (eq[1][0] * head[0] + eq[1][1] * head[1]) / den,
            (eq[1][1] * head[0] - eq[1][0] * head[1]) / den
        ];

        eq[1] = ['eval', lhs];
        newEval.push(eq);
    })
    return newEval;
}

function organizeMathTree_relationEqsys(tree, option) { // postpone
    return false;
}

function organizeMathTree_relationProp(tree, option) { // postpone
    return false;
}

function organizeMathTree_factorSimp(tree, option) { // fin
    const [optionFactor] = option;
    [, option] = option;
    switch (optionFactor) {
        case 'same': {
            return organizeMathTree_simplifiedSame(tree, option);
        }
        case 'simp': {
            return organizeMathTree_simplifiedSimp(tree, option);
        }
        case 'equi': {
            return organizeMathTree_simplifiedEqui(tree, option);
        }
    }
}

function organizeMathTree_factorFact(tree, option) { // fin
    const sign = { sign: 1 };
    const [operator] = tree;
    if (operator === 'positive') {
        [, tree] = tree;
    } else if (operator === 'negative') {
        sign.sign *= -1;
        [, tree] = tree;
    }

    const [, ...operand] = tree;
    let tree_new = [];
    if (operator === 'mulchain') {
        tree_new = ['mulchain'];
        operand.forEach(v => {
            if (v[0] === 'div') {
                tree_new.push(['div', organizeMathTree_factorSimp(v[1], option)]);
            } else { // when v[0] === 'mul'
                const [, factor] = v;
                if (factor[0] === 'addchain') {
                    tree_new.push(['mul', _organizeMathTree_factorFact_organizeAddChain(factor, option, sign)]);
                } else if (factor[0] === 'power') {
                    tree_new.push(['mul', _organizeMathTree_factorFact_organizePower(factor, option, sign)]);
                } else {
                    tree_new.push(['mul', _organizeMathTree_factorFact_organizeMonomial(factor, option, sign)]);
                }
            }
        })
    } else if (operator === 'power') {
        tree_new = _organizeMathTree_factorFact_organizePower(tree, option, sign);
    } else {
        tree_new = _organizeMathTree_factorFact_organizeMonomial(tree, option, sign);
    }

    if (sign.sign === -1) {
        tree_new = ['negative', tree_new];
    }

    return organizeMathTree_factorSimp(tree_new, option);
}

function _organizeMathTree_factorFact_organizeAddChain(factor, option, sign) { // fin
    const orderedFactor = organizeMathTree_factorSimp(factor, option);
    const factorNegative = orderedFactor;
    const entries_f = factorNegative.entries();
    for (const [k, v] of entries_f) {
        if (k === 0) {
            continue;
        }
        factorNegative[k][0] = v[0] === 'add'
            ? 'sub'
            : 'add';
    }
    const orderedFactorNegative = organizeMathTree_factorSimp(factorNegative, option);

    if (_rearrangeMathTree_sortEq(orderedFactor, orderedFactorNegative) < 0) {
        return orderedFactor;
    }
    sign.sign *= -1;
    return orderedFactorNegative;
}

function _organizeMathTree_factorFact_organizePower(factor, option, sign) { // fin
    let [, base, expo] = factor;

    if (expo[0] === 'natural' && expo[1] + 0 > 0) {
        const signTemp = sign.sign;
        if (base[0] === 'addchain') {
            base = _organizeMathTree_factorFact_organizeAddChain(base, option, sign);
        } else if (base[0] === 'power') {
            base = _organizeMathTree_factorFact_organizePower(base, option, sign);
        } else {
            base = _organizeMathTree_factorFact_organizeMonomial(base, option, sign);
        }

        if (expo[1] % 2 === 0) {
            sign.sign = signTemp;
        }
    } else {
        base = organizeMathTree_factorSimp(base, option);
    }
    return ['power', base, expo];
}

function _organizeMathTree_factorFact_organizeMonomial(factor, option, sign) { // fin
    if (factor[0] === 'negative') {
        sign.sign *= -1;
        return organizeMathTree_factorSimp(factor[1], option);
    } else {
        return organizeMathTree_factorSimp(factor, option);
    }
}

function organizeMathTree_simplifiedSame(tree, option) { // fin
    return tree;
}

function organizeMathTree_simplifiedSimp(tree, option) { // fin??
    [option] = option;
    if (!(option & parseInt('10000000000', 2))) {
        tree = organizeMathTree_identicalSeperationFrac(tree);
    }
    if (!(option & parseInt('00100000000', 2))) {
        tree = organizeMathTree_identicalMfracFrac(tree);
    }
    if (!(option & parseInt('00010000000', 2))) {
        tree = organizeMathTree_identicalPosiSign(tree);
    }
    if (!(option & parseInt('01000000000', 2))) {
        tree = organizeMathTree_identicalNegaFrac(tree);
    }
    if (!(option & parseInt('00001000000', 2))) {
        tree = organizeMathTree_identicalMeaninglessParen(tree);
    }
    if (!(option & parseInt('00000010000', 2))) {
        tree = organizeMathTree_identicalVarFrac(tree);
    }
    if (!(option & parseInt('00000000001', 2))) {
        tree = organizeMathTree_identicalMulAss(tree);
    }
    if (!(option & parseInt('00000000010', 2))) {
        tree = organizeMathTree_identicalAddAss(tree);
    }
    if (!(option & parseInt('00000000100', 2))) {
        tree = organizeMathTree_identicalMulCom(tree);
    }
    if (!(option & parseInt('00000001000', 2))) {
        tree = organizeMathTree_identicalAddCom(tree);
    }
    if (!(option & parseInt('00000100000', 2))) {
        tree = organizeMathTree_identicalFracDec(tree);
    }
    return tree;
}

function organizeMathTree_simplifiedEqui(tree, option) { // fin
    const result = evaluateEx(tree);
    if (result) {
        return result;
    } else {
        return false;
    }
}

function organizeMathTree_identicalMulCom(tree) { // fin
    const result = rearrangeMathTree(tree, ['mulchain']);
    if (result) {
        return result;
    } else {
        return false;
    }
}

function organizeMathTree_identicalAddCom(tree) { // fin
    const result = rearrangeMathTree(tree, ['addchain']);
    if (result) {
        return result;
    } else {
        return false;
    }
}
function organizeMathTree_identicalMulAss(tree) { // fin
    if (Array.isArray(tree)) {
        const [operator, ...operand] = tree;
        const newOperand = [];
        operand.forEach((v, k) => {
            const term = organizeMathTree_identicalMulAss(v);
            if (operator === 'mulchain' && term[0] === 'mul' && term[1][0] === 'mulchain') {
                term[1].forEach((v, k) => {
                    if (k !== 0) {
                        newOperand.push(v);
                    }
                })
            } else {
                newOperand.push(term);
            }
        })
        tree = [operator, ...newOperand];
    }
    return tree;
}

function organizeMathTree_identicalAddAss(tree) { // fin
    if (Array.isArray(tree)) {
        const [operator, ...operand] = tree;

        const newOperand = []
        operand.forEach(v => {
            const term = organizeMathTree_identicalMulAss(v);
            if (operator === 'addchain' && term[0] === 'add' && term[1][0] === 'addchain') {
                term[1].forEach((v_1, k_1) => {
                    if (k_1 !== 0) {
                        newOperand.push(v_1);
                    }
                })
            } else {
                newOperand.push(term);
            }
        })
        tree = [operator, ...newOperand];
    }
    return tree;
}

function organizeMathTree_identicalFracDec(tree) { // fin
    if (Array.isArray(tree)) {
        const [operator, ...operand] = tree;

        const newOperand = [];
        if (operator === 'decimal') {
            const val = operand[0].split('.');
            let num = parseInt(val[0] + val[1]);
            let denum = Math.pow(10, val[1].length);

            if (num !== 0) {
                // find gcf
                let max = Math.max(num, denum);
                let min = Math.min(num, denum);
                let cnt = 0;
                let rest;
                while ((rest = max % min) !== 0) {
                    max = min;
                    min = rest;
                    if (++cnt > 100) {
                        break;
                    }
                }
                const gcf = min;
                num = parseInt(num / gcf);
                denum = parseInt(denum / gcf);
            }
            // cancle
            return ['fraction', ['natural', num.toString()], ['natural', denum.toString()]];
        } else {
            operand.forEach((v) => {
                newOperand.push(organizeMathTree_identicalFracDec(v));
            })
            return [operator, ...newOperand];
        }
    }
    return tree;
}

function organizeMathTree_identicalVarFrac(tree) { // fin
    if (Array.isArray(tree)) {
        const [operator, ...operand] = tree;
        const newOperand = [];
        operand.forEach((v) => {
            newOperand.push(organizeMathTree_identicalVarFrac(v));
        })
        if (operator === 'mulchain' &&
            newOperand[0][0] === 'mul' &&
            newOperand[0][1][0] === 'fraction' &&
            newOperand[1][0] === 'mul' &&
            newOperand[1][1][0] !== 'fraction') {
            let num;
            if (newOperand[0][1][1][0] === 'natural' && newOperand[0][1][1][1] === '1') {
                num = ['mulchain'];
            } else if (newOperand[0][1][1][0] === 'mulchain') {
                num = newOperand[0][1][1];
            } else {
                num = ['mulchain', ['mul', newOperand[0][1][1]]];
            }

            const rest = ['mulchain'];
            let flag = true;
            const entries_n = newOperand.entries();
            for (const [k, v] of entries_n) {
                if (k === 0) {
                    continue;
                }

                if (flag) {
                    if (v[0] === 'mul' && v[1][0] !== 'fraction') {
                        num.push(v);
                    } else {
                        rest.push(v);
                        flag = false;
                    }
                } else {
                    rest.push(v);
                }
            }
            let head;
            switch (num.length) {
                case 0:
                case 1: {
                    return false;
                }
                case 2: {
                    head = ['fraction', num[1][1], newOperand[0][1][2]];
                    break;
                }
                default: {
                    head = ['fraction', num, newOperand[0][1][2]];
                }
            }
            switch (rest.length) {
                case 0: {
                    return false;
                }
                case 1: {
                    return head;
                }
                default: {
                    return [...rest, ['mul', head]]; // array_splice(rest, -1 , 0, ['mul', head]);
                }
            }
        } else {
            return [operator, ...newOperand];
        }
    }
    return tree;
}

function organizeMathTree_identicalMeaninglessParen(tree) {
    if (Array.isArray(tree)) {
        const [operator, ...operand] = tree;
        const newOperand = operand.map(v => organizeMathTree_identicalMeaninglessParen(v))
        if (operator === 'addchain' && newOperand[0][0] === 'add' && newOperand[0][1][0] === 'negative') {
            newOperand[0] = ['sub', newOperand[0][1][1]];
        }
        return [operator, ...newOperand];
    }
    return tree;
}

function organizeMathTree_identicalPosiSign(tree) {
    if (Array.isArray(tree)) {
        const [operator, ...operand] = tree;
        const newOperand = operand.map(v => organizeMathTree_identicalPosiSign(v))
        if (operator === 'positive') {
            return newOperand[0];
        } else {
            return [operator, ...newOperand];
        }
    }
    return tree;
}

function organizeMathTree_identicalMfracFrac(tree) {
    if (Array.isArray(tree)) {
        const [operator, ...operand] = tree;
        const newOperand = operand.map(v => organizeMathTree_identicalMfracFrac(v));
        if (operator === 'mfraction') {
            // 161113 larwein - 대분수의 분수 부분이 진분수인 경우만 허용
            if (is_numeric(tree[2][1]) && is_numeric(tree[3][1]) && tree[2][1] < tree[3][1]) {
                const num = ['natural', (tree[1][1] * tree[3][1] + tree[2][1]).toString()];
                const denum = tree[3];
                return ['fraction', num, denum];
            }
            return tree;
        }
        return [operator, ...newOperand];
    } else {
        return tree;
    }
}

function organizeMathTree_identicalNegaFrac(tree) {
    if (Array.isArray(tree)) {
        const [operator, ...operand] = tree;
        const newOperand = operand.map(v => organizeMathTree_identicalNegaFrac(v));
        if (operator === 'fraction' && newOperand[0][0] === 'negative' && newOperand[1][0] !== 'negative') {
            const frac = ['fraction', newOperand[0][1], newOperand[1]];
            return ['negative', frac];
        } else if (operator === 'fraction' && newOperand[0][0] !== 'negative' && newOperand[1][0] === 'negative') {
            const frac = ['fraction', newOperand[0], newOperand[1][1]];
            return ['negative', frac];
        } else {
            return [operator, ...newOperand];
        }
    } else {
        return tree;
    }
}

function organizeMathTree_identicalSeperationFrac(tree) {
    if (Array.isArray(tree)) {
        const [operator, ...operand] = tree;
        const newOperand = operand.map(v => organizeMathTree_identicalSeperationFrac(v));
        if (operator === 'fraction' && newOperand[0][0] === 'addchain') {
            const newAddChain = ['addchain'];
            const entries_n = newOperand[0].entries();
            for (const [k, v] of entries_n) {
                if (k === 0) {
                    continue;
                }
                newAddChain.push([v[0], ['fraction', v[1], newOperand[1]]]);
            }
            return newAddChain;
        } else {
            return [operator, ...newOperand];
        }
    } else {
        return tree;
    }
}

function organizeMathTree_preSpecial(tree, option) {
    option.forEach(v => {
        switch (v[0]) {
            case 'string': {
                tree = organizeMathTree_preSpecial_string(tree, v.slice(1));
                break;
            }
            case 'interval': {
                tree = organizeMathTree_preSpecial_interval(tree, v.slice(1));
                break;
            }
        }
    })
    return tree;
}

function organizeMathTree_preSpecial_string(tree, option) {
    // first. find string sequence and change it to variable.
    //   string sequence means sequence of consecutive upper-case alphabets.
    if (Array.isArray(tree)) {
        const [operator, ...operand] = tree;
        let strTree;
        let flag = true;
        if (operator === 'mulchain') {
            strTree = ['variable'];
            for (const v of operand) {
                if (v[0] === 'mul' &&
                    v[1][0] === 'variable' &&
                    v[1][1].charCodeAt(0) > 64 &&
                    v[1][1].charCodeAt(0) < 91) { // upper-case alphabets' ascii #
                    strTree.push(v[1][1]);
                } else {
                    flag = false;
                    break;
                }
            }
        } else {
            flag = false;
        }

        // when given tree is string sequence, organize it by using option.
        if (flag) {
            [option] = option;

            if (!(option & parseInt('000000001', 2))) {
                strTree = organizeMathTree_stringIdenticalReverse(strTree);
            }
            if (!(option & parseInt('000000010', 2))) {
                strTree = organizeMathTree_stringIdenticalShift(strTree);
            }
            return strTree;
        } else { // when given tree is not string sequence, check and do the process on descents of given tree.
            const newOperand = operand.map(v => organizeMathTree_preSpecial_string(v, option));
            return [operator, ...newOperand];
        }
    } else {
        return tree;
    }
}

function organizeMathTree_preSpecial_interval(tree, option) {
    if (Array.isArray(tree)) {
        const [operator, ...operand] = tree;
        const variable = LatexToTree(option[0]);
        if (variable === false) {
            return false;
        }
        if (operator === 'interval') {
            return [
                'inequality',
                operand[1],
                operand[0] === '(' ? 'lt' : 'le',
                variable,
                operand[3] === ')' ? 'lt' : 'le',
                operand[2]
            ];
        } else if (operator === 'tuple' && operand.length === 2) {
            return [
                'inequality',
                operand[0],
                'lt',
                variable,
                'lt',
                operand[1]
            ];
        } else {
            const newOperand = operand.map(v => organizeMathTree_preSpecial_interval(v, option));
            return [operator, ...newOperand];
        }
    } else {
        return tree;
    }
}

function organizeMathTree_stringIdenticalReverse(tree) {
    if (Array.isArray(tree)) {
        let [operator, ...operand] = tree;
        // when given tree is a sequence of alphabets.
        if (operator === 'variable' && operand.length > 1) {
            let pos_max = [0];
            let dir_max;
            const entries_o = operand.entries();
            for (const [k, v] of entries_o) {
                if (v <= operand[pos_max[0]]) {
                    let flag_stop = false;
                    let temp_dir;
                    for (let i = 1; flag_stop === false && i < operand.length; i++) {
                        const char_pos_right = (k + i) % operand.length;
                        const char_pos_left = (k - i + operand.length) % operand.length;
                        if (operand[char_pos_right] < operand[char_pos_left]) {
                            flag_stop = true;
                            temp_dir = 'r';
                        } else if (operand[char_pos_right] > operand[char_pos_left]) {
                            flag_stop = true;
                            temp_dir = 'l';
                        }
                    }
                    if (flag_stop === false) {
                        temp_dir = 'both';
                    }

                    if (k === 0) {
                        pos_max = [0];
                        dir_max = [temp_dir];
                    } else if (v < operand[pos_max[0]]) {
                        pos_max = [k];
                        dir_max = [temp_dir];
                    } else {
                        flag_stop = false;
                        for (let i = 1; flag_stop === false && i < operand.length; i++) {
                            const char_pos_max = dir_max[0] === 'r'
                                ? (pos_max[0] + i) % operand.length
                                : (pos_max[0] - i + operand.length) % operand.length;

                            const char_pos_new = temp_dir[0] === 'r'
                                ? (k + i) % operand.length
                                : (k - i + operand.length) % operand.length;

                            if (operand[char_pos_max] < operand[char_pos_new]) {
                                flag_stop = true;
                            } else if (operand[char_pos_max] > operand[char_pos_new]) {
                                flag_stop = true;
                                pos_max = [k];
                                dir_max = [temp_dir];
                            }
                        }
                        if (flag_stop === false) {
                            pos_max.push(k);
                            dir_max.push(temp_dir);
                        }
                    }
                }
            }

            if (pos_max[0] > operand.length - 1 - pos_max[pos_max.length - 1]) {
                pos_max = pos_max[pos_max.length - 1];
                if (dir_max[dir_max.length - 1] === 'both') {
                    dir_max = 'l';
                } else {
                    dir_max = dir_max[dir_max.length - 1];
                }
            } else {
                pos_max = pos_max[0];
                if (dir_max[0] === 'both') {
                    dir_max = 'r';
                } else {
                    [dir_max] = dir_max;
                }
            }

            if (dir_max === 'l') {
                operand = operand.reverse();
            }
            return ['variable', ...operand];
        } else if (operator === 'variable') { // when given tree is a single character variable.} {
            return tree;
        } else { // when given tree is not a variable.
            const newOperand = operand.map(v => organizeMathTree_stringIdenticalReverse(v));
            return [operator, ...newOperand];
        }
    }
    return tree;
}

function organizeMathTree_stringIdenticalShift(tree) {
    if (Array.isArray(tree)) {
        let [operator, ...operand] = tree;
        // when given tree is a sequence of alphabet.
        if (operator === 'variable' && operand.length > 1) {
            let pos_max = 0;
            operand.forEach((v, k) => {
                if (v < operand[pos_max]) {
                    pos_max = k;
                } else if (is_equal(v, operand[pos_max])) {
                    for (let i = 1; i < operand.length; i++) {
                        const max_son = (pos_max + i) % operand.length;
                        const now_son = (k + i) % operand.length;
                        if (operand[now_son] > operand[max_son]) {
                            break;
                        } else if (operand[now_son] < operand[max_son]) {
                            pos_max = k;
                            break;
                        }
                    }
                }
            })
            if (pos_max !== 0) {
                operand = [...operand.slice(pos_max), ...operand.slice(0, pos_max)];
            }
            return ['variable', ...operand];
        } else if (operator === 'variable') { // when given tree is single character variable.
            return tree;
        } else { // when given tree is not a variable.
            const newOperand = operand.map(v => organizeMathTree_stringIdenticalShift(v));
            return [operator, ...newOperand];
        }
    } else {
        return tree;
    }
}

function organizeMathTree_postSpecial(tree, option) {
    option.forEach(v => {
        switch (v[0]) {
            case 'interval': {
                tree = organizeMathTree_postSpecial_interval(tree, v.slice(1));
                break;
            }
        }
    })
    return tree;
}

function organizeMathTree_postSpecial_interval(tree, option) {
    if (Array.isArray(tree)) {
        const [operator, ...operand] = tree;
        const variable = LatexToTree(option[0]);
        if (operator === 'inequality') {
            if (operand.length === 5 && operand[2] === variable) {
                if (is_equal(operand[0], ['negative', ['infinity']]) && // -\inf < x < \inf  =>  R
                    operand[1] === 'lt' &&
                    operand[3] === 'lt' &&
                    is_equal(operand[4], ['infinity'])) {
                    return ['setname', 'real'];
                } else if (is_equal(operand[4], ['negative', ['infinity']]) && // \inf > x > -\inf  => R
                    operand[3] === 'gt' &&
                    operand[1] === 'gt' &&
                    is_equal(operand[0], ['infinity'])) {
                    return ['setname', 'real'];
                } else if (is_equal(operand[0], ['negative', ['infinity']]) && // -\inf < x (<|<=) b => x (<|<=) b
                    operand[1] === 'lt' &&
                    (operand[3] === 'lt' || operand[3] === 'le') &&
                    !is_equal(operand[4], ['infinity'])) {
                    return ['inequality', operand[2], operand[3], operand[4]];
                } else if (is_equal(operand[4], ['negative', ['infinity']]) && // b (>|>=) x > -\inf => b (>|>=) x
                    operand[3] === 'gt' &&
                    (operand[1] === 'gt' || operand[1] === 'ge') &&
                    !is_equal(operand[0], ['infinity'])) {
                    return ['inequality', operand[0], operand[1], operand[2]];
                } else if (!is_equal(operand[0], ['infinity']) && // a (<|<=) x < \inf  =>  a (<|<=) x
                    (operand[1] === 'lt' || operand[1] === 'le') &&
                    operand[3] === 'lt' &&
                    is_equal(operand[4], ['infinity'])) {
                    return ['inequality', operand[0], operand[1], operand[2]];
                } else if (is_equal(operand[0], ['infinity']) && // \inf > x (>|>=) a => x (>|>=) a
                        operand[1] === 'gt' &&
                        (operand[3] === 'gt' || operand[3] === 'ge') &&
                        !is_equal(operand[4], ['infinity'])) {
                    return ['inequality', operand[2], operand[3], operand[4]];
                }
            }
        } else {
            const newOperand = operand.map(v => organizeMathTree_postSpecial_interval(v, option))
            return [operator, ...newOperand];
        }
    } else {
        return tree;
    }
    return tree;
}

// 배열로 값을 가지는 애들 array, ***chain 등의 값을 sort
function rearrangeMathTree(tree, types = null) { // fin
    const [operator, ...sons] = tree;
    const newTree = [operator];

    let newSons = [];
    sons.forEach(v => {
        if (Array.isArray(v)) {
            newSons.push(rearrangeMathTree(v, types));
        } else {
            newSons.push(v);
        }
    })

    if (types.includes(operator)) {
        switch (operator) {
            case 'array':
            case 'mulchain':
            case 'addchain':
            case 'equation':
            case 'neq': {
                newSons.sort(_rearrangeMathTree_sortEq);
                break;
            }
            case 'inequality': {
                let rightNum = 0;
                for (let i = 1; i < newSons.length; i += 2) {
                    if (newSons[i] === 'gt' || newSons[i] === 'ge') {
                        rightNum++;
                    } else {
                        rightNum--;
                    }
                }
                if (rightNum < 0) {
                    const temp = [];
                    newSons.reverse().forEach((v, k) => {
                        if (v === 'gt') {
                            temp.push('lt');
                        } else if (v === 'ge') {
                            temp.push('le');
                        } else if (v === 'lt') {
                            temp.push('gt');
                        } else if (v === 'le') {
                            temp.push('ge');
                        } else {
                            temp.push(v);
                        }
                    })
                    newSons = temp;
                } else if (rightNum === 0) {
                    return 'ERROR-ineq';
                }
                break;
            }
            default:{
                break;
            }
        }
    }

    return [...newTree, ...newSons];
}

function _rearrangeMathTree_sortEq(A, B) { // fin
    if (Array.isArray(A) && !Array.isArray(B)) {
        return 1;
    } else if (!Array.isArray(A) && Array.isArray(B)) {
        return -1;
    } else if (!Array.isArray(A) && !Array.isArray(B)) {
        if (typeof A > typeof B) {
            return 1;
        }
        if (typeof A < typeof B) {
            return -1;
        }
        if (A > B) {
            return 1;
        }
        if (A < B) {
            return -1;
        }
        return 0;
}

    const [operatorA, ...operandA] = A;
    const [operatorB, ...operandB] = B;

    if (operatorA > operatorB) {
        return 1;
    } else if (operatorA < operatorB) {
        return -1;
    } else {
        if (operandA.length > operandB.length) {
            return 1;
        } else if (operandA.length < operandB.length) {
            return -1;
        } else {
            const entries_A = operandA.entries();
            for (const [k, v] of entries_A) {
                const temp = _rearrangeMathTree_sortEq(v, operandB[k]);
                if (temp === 0) {
                    continue;
                } else {
                    return temp;
                }
            }
            return 0;
        }
    }
}

function _searchTypeInMathtree(tree, type, option = 'all', overlap = false, self = true) {
    if (!Array.isArray(tree)) {
        return [];
    }

    const [operator, ...operand] = tree;

    if (!Array.isArray(type)) {
        type = [type];
    }
    let result = [];
    if (self === true && type.includes(operator)) {
        switch (option) {
            case 'out': {
                result.push(tree);
                break;
            }
            case 'in': {
                let temp = [];
                for (const subTree of operand) {
                    temp = [...result, ..._searchTypeInMathtree(subTree, type, option, overlap, true)];
                }
                if (temp.length === 0) {
                    result.push(tree);
                } else {
                    result = temp;
                }
                break;
            }
            case 'all': {
                result.push(tree);
                for (const subTree of operand) {
                    result = [...result, ..._searchTypeInMathtree(subTree, type, option, overlap, true)];
                }
                break;
            }
            default: {
                result = false;
                break;
            }
        }
    } else {
        for (const subTree of operand) {
            result = [...result, ..._searchTypeInMathtree(subTree, type, option, overlap, true)];
        }
    }

    if (overlap === false) {
        const temp = [];
        for (const v of result) {
            if (!temp.includes(v)) {
                temp.push(v);
            }
        }
        result = temp;
    }
    return result;
}

/*
function organizeMathTree_identicalIdentity(tree, option) {
    if (Array.isArray(tree)) {
        const [operator, ...operand] = tree;
        const newOperand = operand.map(v => organizeMathTree_identicalIdentity(v, option));
        if (option['add'] && operator === 'addchain') {
            newOperand.forEach((v, k) => {
                if (v[1][0] === 'natural' && v[1][1] == 0) {
                    delete newOperand[k]; // unset(newOperand[k]);
                }
            })
            switch(newOperand.length) {
                case 0: {
                    return ['natural', '0'];
                }
                case 1: {
                    newOperand = newOperand.values();
                    if (newOperand[0][0] === 'add') {
                        return newOperand[0][1];
                    } else {
                        return ['negative', newOperand[0][1]];
                    }
                }
                default: {
                    newOperand = newOperand.values();
                    return [operator, ...newOperand];
                }
            }
        } else if(option['mul'] && operator === 'mulchain') {
            newOperand.forEach((v, k) => {
                if (v[1][0] === 'natural' && v[1][1] == 1) {
                    delete newOperand[k]; // unset(newOperand[k]);
                }
            })
            switch(newOperand.length)  {
                case 0: {
                    return ['natural', 1];
                }
                case 1: {
                    newOperand = newOperand.values();
                    return newOperand[0][1];
                }
                default: {
                    newOperand = newOperand.values();
                    return [operator, ...newOperand];
                }
            }
        } else if ((option['frac'] && operator === 'fraction') || (option['power'] && operator === 'power')) {
            if (newOperand[1][0] === 'natural' && newOperand[1][1] == 1) {
                return newOperand[0];
            }
        } else {
            return [operator, ...newOperand];
        }
    }
    else return tree;
}

function organizeMathTree_identicalMulIdentity(tree){

}

function organizeMathTree_identicalDivIdentity(tree){

}

function organizeMathTree_identicalFracIdentity(tree){

}

function organizeMathTree_identicalPowIdentity(tree){

}

function organizeMathTree_identicalNegExp(tree) { //postpone{
    return false;
}

function organizeMathTree_identicalRatExp(tree) { //postpone
    return false;
}
function organizeMathTree_identicalSciNot(tree) { //postpone
    return false;
}
*/

/*
function _evaluateExWithValue(A, valueArr) {
    if (!Array.isArray(A)) {
        return A;
    }
    const [operator, ...operandTree] = Ae;
    const operand = [];
    for (let each of operandTree) {
        operand.puish(_evaluateExWithValue(each, valueArr));
    }

    switch (operator) {
        case 'variable': {
            if (valueArr[operand[0]] !== null)
                return [valueArr[operand[0]], 0];
            break;
        }
        case 'equation':
        case 'neq':
        case 'ratio':
        case 'inequality': {
            return [operator, ...operand];
        }
        default: {
            return _evaluateOperation(operator, operand);
        }
    }

}
*/

/*
function: compare two trees
input: treeA - tree, treeB - tree
ouput: true, false
*/
/*
export function is_equal_tree(tree_1, tree_2) {
    const tree_11 = tree_1;
    const tree_21 = tree_2;
    const type_1 = typeof tree_11;
    const type_2 = typeof tree_21;
    if (type_1 !== type_2) {
        return false;
    }
    if (type_1 === 'string') {
        return tree_11 === tree_21;
    }

    if (type_1 === 'number') {
        const d = Math.pow(0.1, 5);
        return Math.abs(tree_11 - tree_21) < d;
    }

    if (!Array.isArray(tree_11) || !Array.isArray(tree_21)) {
        return false;
    }

    if (JSON.stringify(tree_11) === JSON.stringify(tree_21)) {
        return true;
    }

    const length_1 = tree_11.length;
    const length_2 = tree_21.length;
    if (length_1 !== length_2) {
        return false;
    }
    for (let i = 0; i < length_1; i++) {
        if (!is_equal_tree(tree_11[i], tree_21[i])) {
            return false;
        }
    }
    return true
}
*/
