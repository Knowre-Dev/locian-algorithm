/*
Groups variable terms in addchain into like terms (i.e., with the same variables)
Note: Does NOT handle terms where variable is in the denominator

PRECONDITIONS:
1. No mulchain within mulchain or addchain within addchain
2. Input is an addchain of i) variables, ii) constants, and
   iii) mulchains only with i) and at most one ii)
3. No variable is in the denominator of any fraction

Parameters:
tree: A Laco tree

Returns:
A new tree with like terms grouped together into mulchains of an addchain and variable(s)

*/

import { exprSimpConst } from '../rc/function_154.inc.js';
// import { findVars, termExists, array2ChainTree } from '../rc/sub_functions.js';
import { findVars, array2ChainTree } from '../rc/sub_functions.js';
export function groupLikeVariableTerms(tree = null) {
    if (!Array.isArray(tree)) {
        return tree;
    }
    const [operator, ...operand] = tree;
    const is_numeric = ['natural', 'decimal', 'variable'].includes(operator);
    if (is_numeric) {
        return tree;
    }
    const is_not_chain = !['addchain', 'mulchain'].includes(operator);
    if (is_not_chain) {
        const operand_new = operand.map(term => groupLikeVariableTerms(term))
        return [operator, ...operand_new];
    }
    switch (operator) {
        case 'addchain': {
            return group_addchain(operator, operand);
        }
        case 'mulchain': {
            return group_mulchain(operator, operand);
        }
    }
}

function group_addchain(operator, operand) {
    // Recursive portion
    // added to allow for proper parse in case a power term is present
    operand = operand.map(term => [term[0], groupLikeVariableTerms(term[1])])
    // Find all variables in this tree
    const vars = findVars([operator, ...operand]);//  variable 수집
    if (vars.length === 0) {
        return [operator, ...operand];
    }
    // Pick a variable
    // and group among the terms not yet visited (i.e., accounted for)
    // that contains this variable/mulchain of variables
    let terms = [...operand];
    let newOperand = [];
    // Iterate through each variable in vars
    vars.forEach(vari => {
        // All terms have been visited,
        // so no need to execute the outer foreach loop further
        if (terms.length !== 0) {
            // Go through each unvisited child node in the tree
            const coef = [];
            const vari_s = JSON.stringify(vari);
            let terms_non_var = [];
            terms.forEach(term => {
                    // If the term contains variable,
                    // then update the coefficient table
                    // and remove this term's index from
                    // the list of indices of not-yet-visited terms
                    const has_var = update_coef(term, vari_s, coef)
                    if (!has_var) {
                        terms_non_var = [...terms_non_var, term];
                    }
                    // original code - don't delete
                    // const has_var = termExists(vari, term_1, false, true);
                    // if (has_var) {
                    //    let term_c = [];
                    //    if (vari_s === JSON.stringify(term_1)) {
                    //        term_c = ['natural', '1'];
                    //    } else if (term_1[0] === 'mulchain') {
                    //        const [, ...terms_1] = term_1;
                    //        term_c = terms_1.filter(term_11 => vari_s !== JSON.stringify(term_11[1]));
                    //        term_c = array2ChainTree(term_c);
                    //    }
                    //    coef = [...coef, [op, term_c]];
                    //    keys.splice(keys.indexOf(key_t), 1);
                    // }
            })
            terms = terms_non_var;
            // end going through each unvisited child node in the tree
            // Convert each coefficient
            // into either a single constant or an addchain of constants

            if (coef.length > 0) { // Construct new operands
                const term = form_term(coef, vari);
                newOperand = [...newOperand, term];
            }
        }
    });

    // Don't forget any constant term
    // Account for all constant terms, if any
    if (terms.length > 0) {
        let con = array2ChainTree(terms)
        con = con[0] === 'negative'
            ? ['sub', con[1]]
            : ['add', con];
        newOperand = [...newOperand, con];
    }

    // If there is only one operand, just output that operand
    // with an appropriate sign as applicable
    return newOperand.length === 1
        ? array2ChainTree(newOperand)
        : [operator, ...newOperand];
}

function update_coef(term, vari_s, coef) {
    const [op, term_1] = term;
    if (vari_s === JSON.stringify(term_1)) {
        const term_c = [op, ['natural', '1']];
        coef.push(term_c);
        return true;
    }
    const [op_1, ...terms_1] = term_1;
    if (op_1 !== 'mulchain') {
        return false;
    }
    let term_c = [];
    let has_var = false;
    terms_1.forEach(term_11 => {
        if (JSON.stringify(term_11[1]) === vari_s) {
            has_var = true;
        } else {
            term_c = [...term_c, term_11];
        }
    })
    if (has_var) {
        term_c = [op, array2ChainTree(term_c)];
        coef.push(term_c)
    }
    return has_var;
}

function form_term(coef, vari) {
    const ops = new Map([
        ['negative', 'sub'],
        ['pm', 'addsub']
    ]);
    coef = array2ChainTree(coef);
    let op = 'add';
    const has_op = Array.isArray(coef) && ops.has(coef[0]);
    if (has_op) {
        op = ops.get(coef[0]);
        [, coef] = coef;
    }
    const term = JSON.stringify(coef) === JSON.stringify(['natural', '1'])
        ? vari // Omit coefficient of 1
        : ['mulchain', ['mul', coef], ['mul', vari]];
    return [op, term];
}

function group_mulchain(operator, operand) { // operator === 'mulchain'
    // Recursive portion
    operand = operand.map(term => [term[0], groupLikeVariableTerms(term[1])]);
    // Combine each repeating term into an exponential term

    // form basese and exps
    const [bases, exps] = form_bases_exps(operand);

    // form new opernad
    let newOperand = form_new_operand(bases, exps);

    // Snippet 1
    // If there is only one operand, just output that operand
    // with inversion, as applicable
    if (newOperand.length === 1) {
        const [[op, term]] = newOperand;
        return op === 'div'
            ? ['fraction', ['natural', '1'], term]
            : term;
    }
    // Prepend 1 at the front if all terms are division terms
    const has_mul = newOperand.some(term => term[0] === 'mul');
    if (has_mul) {
        newOperand = [['mul', ['natural', '1']], ...newOperand]
    }
    return [operator, ...newOperand];
}

function form_bases_exps(operand) {
    let bases = [];
    let exps = [];
    loop_2: for (const term of operand) {
        const [, term_1] = term; // term = ['mul', term_1];
        // base
        const base = term_1[0] === 'power' // ['power', a, b] ?
            ? ['mul', term_1[1]]
            : ['mul', term_1];
        // exp
        const exp = term_1[0] === 'power' // ['power', a, b] ?
            ? term_1[2][0] === 'negative' // a = ['negative', a_1]
                ? ['sub', term_1[2][1]]
                : ['add', term_1[2]]
            : ['add', ['natural', '1']];
        // update exp
        const bases_ent = bases.entries();
        const base_s = JSON.stringify(base);
        for (const [key, value] of bases_ent) {
            if (JSON.stringify(value) === base_s) {
                exps[key] = typeof exps[key] === 'undefined'
                    ? [exp]
                    : [...exps[key], exp];
                continue loop_2;
            }
        }
        bases = [...bases, base];
        exps = [...exps, [exp]];
    }
    return [bases, exps];
}

function form_new_operand(bases, exps) {
    let newOperand = [];
    const zero = JSON.stringify(['natural', '0']);
    const one = JSON.stringify(['natural', '1']);
    // form new operand
    bases.forEach((base, key) => {
        let exp = exprSimpConst(array2ChainTree(exps[key]));
        const exp_s = JSON.stringify(exp);
        if (exp_s !== zero) {
            if (exp[0] === 'negative') {
                base[0] = 'div';
                [, exp] = exp;
            }
            const term = exp_s === one
                ? base
                : [base[0], ['power', base[1], exp]];
            newOperand = [...newOperand, term];
        }
    })
    return newOperand;
}

/*
import { LatexToTree } from '../checkmath.js';
const latex_1 = '4x+6';
const tree1 = groupLikeVariableTerms(LatexToTree(latex_1));
const result_1 = JSON.stringify(tree1, null, 4);
console.log('2222222222')
console.log(result_1);
*/
