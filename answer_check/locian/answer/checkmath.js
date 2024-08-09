import { Laco } from './libs/common.inc.js';
import { getOrderedAnswerArray, compareOrderedAnswerArray } from './check_commonfunction.js';
import { is_equal, is_numeric } from './functions.js'

// const

/* eslint-disable no-useless-escape */

/*
convert latex to tree
*/

// const
const partL = '@';
const partR = '#';

const delimeter = '\\';
const whitespace = ':';

const left = 'left';
const right = 'right';

const parenthesis_left = '(';
const parenthesis_right = ')';
const bracket_left = '[';
const bracket_right = ']';
const brace_left = '{';
const brace_right = '}';
const bar = '|';

const decimaldot = '.';
const exponent = '^';
const subscript = '_';
const cmd = new Map([
    ['pi', '1'],
    ['theta', '2'],
    ['overline', '3'],
    ['mfrac', '4'],
    ['frac', '5'],
    ['sqrt', '6'],
    ['nthroot', '7'],
    ['abs', '8'],
    ['times', '9'],
    ['cdot', '10'],
    ['div', '11'],
    ['neq', '12'],
    ['ne', '12'],
    ['gt', '13'],
    ['ge', '14'],
    ['lt', '15'],
    ['le', '16'],
    ['summ', '17'],
    ['overrightarrow', '18'],
    ['overleftarrow', '19'],
    ['overleftrightarrow', '20'],
    ['arc', '21'],
    ['cap', '41'],
    ['cup', '42'],
    ['mangle', '30'],
    ['angle', '31'],
    ['sin', '32'],
    ['cos', '33'],
    ['tan', '34'],
    ['varnothing', '22'],
    ['infty', '23'],
    ['pm', '24'],
    ['mp', '60'],
    ['circ', '25'],
    ['R', '26'],
    ['mathbb(R)', '26'],
    ['text', '27'],
    ['alpha', '51'],
    ['beta', '52'],
    ['gamma', '53']
]);
const cmd_special = new Map([
    ['logbase', '1'],
    ['log', '2'],
    ['ln', '3']
]);

export function LatexToTree(A, node = null, node_idx = null) {
    if (A === '') {
        return []
    }
    if (node === null) {
        node = [];
    }
    if (node_idx === null) {
        node_idx = 1;
    }
    let newA = A;

    newA = newA.replace(/\s+/g, '');// added

    // pre-process
    newA = LatexToTree_pre(newA);

    // get number
    [newA, node_idx] = LatexToTree_number(newA, node, node_idx);

    // command
    newA = LatexToTree_com(newA);

    // get variable
    [newA, node_idx] = LatexToTree_variable(newA, node, node_idx);

    // get symbol
    [newA, node_idx] = LatexToTree_symbol(newA, node, node_idx);

    // get grouping
    [newA, node_idx] = LatexToTree_group(newA, node, node_idx);

    // command with args
    [newA, node_idx] = LatextoTree_com_arg(newA, node, node_idx);

    // special lv1 command
    [newA, node_idx] = LatexToTree_sp_1(newA, node, node_idx);

    // special lv2 command
    [newA, node_idx] = LatexToTree_sp_2(newA, node, node_idx);

    return form_tree(newA, node);
}

export function forregex(c) {
    const specials = [
        '\\', '/', '^', '', '.', '[', ']',
        '|', '(', ')', '?', '*', '+', '{',
        '}', '-', ','
    ];
    const nc = c.split('');
    let result = '';
    nc.forEach(value => {
        result += specials.includes(value)
            ? '\\' + value
            : value;
    });
    return result;
}

function LatexToTree_pre(newA) {
    let replace = new Map();
    // remove whitespace(\:)
    replace = new Map([
        [delimeter + whitespace, '']
    ]);
    replace.forEach((value, key) => {
        newA = newA.replaceAll(key, value);
    });

    // change absolute sign
    replace = new Map([
        [delimeter + left + bar, delimeter + 'abs' + brace_left],
        [delimeter + right + bar, brace_right]
    ]);
    replace.forEach((value, key) => {
        newA = newA.replaceAll(key, value);
    });

    // change all grouping sign to parenthesis
    replace = new Map([
        [brace_left, parenthesis_left],
        [brace_right, parenthesis_right]
    ]);
    replace.forEach((value, key) => {
        newA = newA.replaceAll(key, value);
    });

    // remove cmd 'left' and 'right' and 'text'
    replace = new Map([
        [delimeter + left, ''],
        [delimeter + right, ''],
        [delimeter + 'text', '']
    ]);
    replace.forEach((value, key) => {
        newA = newA.replaceAll(key, value);
    });

    // change < or > to \lt or \gt
    replace = new Map([
                ['> ', '\\gt '],
                ['< ', '\\lt '],
                ['>', '\\gt '],
                ['<', '\\lt '],
                ['\\leq', '\\le'],
                ['\\geq', '\\ge']
    ]);
    replace.forEach((value, key) => {
        newA = newA.replaceAll(key, value);
    });

    // change mfrac form to mfrac command
    let regex = new RegExp(
        '([0-9]+)' +
        forregex(delimeter) +
        'frac' +
        forregex(parenthesis_left) +
        '([0-9]+)' +
        forregex(parenthesis_right) +
        forregex(parenthesis_left) +
        '([0-9]+)' +
        forregex(parenthesis_right),
        'g');
    replace = delimeter +
        'mfrac' +
        parenthesis_left +
        '$1' +
        parenthesis_right +
        parenthesis_left +
        '$2' +
        parenthesis_right +
        parenthesis_left +
        '$3' +
        parenthesis_right;
    newA = newA.replaceAll(regex, replace);

    // _a, ^a
    regex = new RegExp(
        '([_\^])([0-9])',
        'g');
    replace =
        '$1' +
        parenthesis_left +
        '$2' +
        parenthesis_right;
    newA = newA.replaceAll(regex, replace);

    // sqrt
    regex = new RegExp(
        /sqrt\[([1-9]+[0-9]*)\]/,
        'g');
    replace = 'nthroot($1)';
    newA = newA.replaceAll(regex, replace);

    // change log_ to logbase
    replace = new Map([
        ['log_', 'logbase']
    ]);
    replace.forEach((value, key) => {
        newA = newA.replaceAll(key, value);
    });

    // change cmd to cmd_special...
    replace = new Map([
        ['\\logbase', 'logbase'],
        ['\\log', 'log'],
        ['\\ln', 'ln']
    ]);
    replace.forEach((value, key) => {
        newA = newA.replaceAll(key, value);
    });
    return newA;
}

function LatexToTree_number(newA, node, node_idx) {
    let matches = [];
    // repeating decimal
    let regex = new RegExp(
        '([0-9]*)' +
        forregex(decimaldot) +
        '([0-9]*)' +
        forregex(delimeter) +
        'overline' +
        '\\(([0-9]+)\\)',
        'g');
    matches = match_all(newA, regex);
    if (matches.length !== 0) {
        matches.forEach(match => match.sort().reverse());
        const [match_0] = matches;
        match_0.forEach((value, key) => {
            newA = replace_RegExp(newA, value, node_idx);
            node[node_idx] = ['rdecimal', matches[1][key], matches[2][key], matches[3][key]];
            node_idx++;
        });
    }

    // decimal
    regex = new RegExp(
        '[0-9]*' +
        forregex(decimaldot) +
        '[0-9]+',
        'g');
    matches = match_all(newA, regex);
    if (matches.length !== 0) {
        const [match_0] = matches;
        match_0.sort().reverse();
        match_0.forEach(value => {
            newA = replace_RegExp(newA, value, node_idx);
            node[node_idx] = ['decimal', value];
            node_idx++;
        });
    }

    // natural
    regex = new RegExp(
        '[0-9]+(?!' +
        forregex(partL) +
        ')',
        'g');
    matches = match_all(newA, regex);
    if (matches.length !== 0) {
        const [match_0] = matches;
        match_0.sort().reverse();
        match_0.forEach(value => {
            newA = newA.replaceAll(
                new RegExp(
                    '(?<![0-9]+)' + // lookbehind (negative)  - added
                    value +
                    '(?![0-9]*' + // lookahead (negative)
                    forregex(partR) +
                    ')',
                    'g'
                ),
                partL + node_idx + partR
            );
            node[node_idx] = ['natural', value];
            node_idx++;
        });
    }
    return [newA, node_idx];
}

function LatexToTree_com(newA) {
    // get cmd (one 0)
    cmd.forEach((value, key) => {
        newA = newA.replaceAll(delimeter + key, partL + '0' + value + partR);
    });

    // get cmd_special (two 0s)
    cmd_special.forEach((value, key) => {
        newA = newA.replaceAll(key, partL + '00' + value + partR);
    });
    return newA;
}

function LatexToTree_variable(newA, node, node_idx) {
    // korean
    let regex = new RegExp('([ㄱ-ㅎ|가-힣])', 'g');
    let matches = match_all(newA, regex);
    if (matches.length !== 0) {
        const [match_0] = matches;
        match_0.sort().reverse();
        match_0.forEach(value => {
            newA = replace_RegExp(newA, value, node_idx);
            node[node_idx] = ['variable', value];
            node_idx++;
        });
    }
    // greek
    regex = new RegExp(
        forregex(partL) +
        '0(' +
        cmd.get('pi') +
        '|' +
        cmd.get('theta') +
        '|' +
        cmd.get('alpha') +
        '|' +
        cmd.get('beta') +
        '|' +
        cmd.get('gamma') +
        ')' +
        forregex(partR) +
        ' ?',
        'g');
    matches = match_all(newA, regex);
    if (matches.length !== 0) {
        const match_0_entries = matches[0].entries();
        for (const [key, value] of match_0_entries) {
            newA = replace_RegExp(newA, value, node_idx);
            switch (matches[1][key]) {
                case cmd.get('pi'): {
                    node[node_idx] = ['variable', 'pi'];
                    break;
                }
                case cmd.get('theta'): {
                    node[node_idx] = ['variable', 'theta'];
                    break;
                }
                case cmd.get('alpha'): {
                    node[node_idx] = ['variable', 'alpha'];
                    break;
                }
                case cmd.get('beta'): {
                    node[node_idx] = ['variable', 'beta'];
                    break;
                }
                case cmd.get('gamma'): {
                    node[node_idx] = ['variable', 'gamma'];
                    break;
                }
            }
            node_idx++;
        }
    }

    // english
    regex = new RegExp("[a-zA-Z][']*", 'g');
    matches = match_all(newA, regex);
    if (matches.length !== 0) {
        const [match_0] = matches;
        match_0.sort().reverse();
        match_0.forEach(value => {
            newA = newA.replaceAll(
                value,
                partL + node_idx + partR
            );
            node[node_idx] = ['variable', value];
            node_idx++;
        });
    }
    return [newA, node_idx];
}

function LatexToTree_symbol(newA, node, node_idx) {
    const regex = new RegExp(
        forregex(partL) +
        '0(' +
        cmd.get('R') +
        '|' +
        cmd.get('varnothing') +
        '|' +
        cmd.get('infty') +
        ')' +
        forregex(partR) +
        ' ?',
        'g');
    const matches = match_all(newA, regex);
    if (matches.length !== 0) {
        const match_0_entries = matches[0].entries();
        for (const [key, value] of match_0_entries) {
            newA = replace_RegExp(newA, value, node_idx);
            switch (matches[1][key]) {
                case cmd.get('R'): {
                    node[node_idx] = ['setname', 'real'];
                    break;
                }
                case cmd.get('varnothing'): {
                    node[node_idx] = ['setname', 'empty'];
                    break;
                }
                case cmd.get('infty'): {
                    node[node_idx] = ['infinity'];
                    break;
                }
            }
            node_idx++;
        }
    }
    return [newA, node_idx];
}

function LatexToTree_group(newA, node, node_idx) {
    let oldA = '';
    do {
        oldA = newA;
        // get parenthesis
        let regex = new RegExp(
            '([' +
            forregex(bracket_left) +
            forregex(parenthesis_left) +
            '])' +
            '([^' +
            forregex(parenthesis_left) +
            forregex(parenthesis_right) +
            forregex(bracket_left) +
            forregex(bracket_right) +
            ']*)' +
            '([' +
            forregex(bracket_right) +
            forregex(parenthesis_right) +
            '])',
            'g');
        let matches = match_all(newA, regex);
        if (matches.length !== 0) {
            const [match_0] = matches;
            match_0.forEach((value, key) => {
                newA = newA.replaceAll(
                    value,
                    partL + node_idx + partR
                );
                let tree_node = LatexToTree(
                    matches[2][key],
                    node,
                    node_idx
                );
                if (tree_node[0] === 'array') {
                    if (matches[1][key] === '(' && matches[3][key] === ')') {
                        tree_node[0] = 'tuple';
                    } else if (tree_node.length === 3) {
                        tree_node = [
                            'interval',
                            matches[1][key],
                            tree_node[1],
                            tree_node[2],
                            matches[3][key]
                        ];
                    }
                }
                node[node_idx] = tree_node;
                node_idx++;
            });
        }

        // get binary operation (super, subscription)
        regex = new RegExp(
            forregex(partL) +
            '([1-9][0-9]*)' +
            forregex(partR) +
            '([' +
            forregex(exponent) +
            forregex(subscript) +
            '])' +
            forregex(partL) +
            '([1-9][0-9]*)' +
            forregex(partR),
            'g');
        matches = match_all(newA, regex);
        if (matches.length !== 0) {
            const [match_0] = matches;
            match_0.forEach((value, key) => {
                newA = newA.replaceAll(
                    value,
                    partL + node_idx + partR
                );
                const operator = matches[2][key] === '^'
                    ? 'power'
                    : 'subscript';
                node[node_idx] = [
                    operator,
                    node[matches[1][key]],
                    node[matches[3][key]]
                ];
                node_idx++;
            });
        }
    } while (newA !== oldA);
    return [newA, node_idx];
}

function LatextoTree_com_arg(newA, node, node_idx) {
    let oldA = '';
    do {
        oldA = newA;
        // get command with 1 arg
        let regex = new RegExp(
            forregex(partL) +
            '0' +
            '(' +
            cmd.get('overline') +
            '|' +
            cmd.get('overrightarrow') +
            '|' +
            cmd.get('overleftarrow') +
            '|' +
            cmd.get('overleftrightarrow') +
            '|' +
            cmd.get('arc') +
            '|' +
            cmd.get('sqrt') +
            '|' +
            cmd.get('abs') +
            '|' +
            cmd.get('sin') + // added
            '|' +
            cmd.get('cos') + // added
            '|' +
            cmd.get('tan') + // added
            '|' +
            cmd.get('angle') + // added
            '|' +
            cmd.get('mangle') + // added
            ')' +
            forregex(partR) +
            forregex(partL) +
            '([1-9][0-9]*)' +
            forregex(partR),
            'g');
        let matches = match_all(newA, regex);
        if (matches.length !== 0) {
            const match_0_entries = matches[0].entries();
            for (const [key, value] of match_0_entries) {
                newA = newA.replaceAll(
                    value,
                    partL + node_idx + partR
                );
                let operator;
                switch (matches[1][key]) {
                    case cmd.get('sqrt'): {
                        operator = 'squareroot';
                        break;
                    }
                    case cmd.get('abs'): {
                        operator = 'absolute';
                        break;
                    }
                    case cmd.get('overline'): {
                        operator = 'overline';
                        break;
                    }
                    case cmd.get('overrightarrow'): {
                        operator = 'overrightarrow';
                        break;
                    }
                    case cmd.get('overleftarrow'): {
                        operator = 'overleftarrow';
                        break;
                    }
                    case cmd.get('overleftrightarrow'): {
                        operator = 'overleftrightarrow';
                        break;
                    }
                    case cmd.get('angle'): {
                        operator = 'angle';
                        break;
                    }
                    case cmd.get('mangle'): {
                        operator = 'mangle';
                        break;
                    }
                    case cmd.get('arc'): {
                        operator = 'arc';
                        break;
                    }
                    case cmd.get('sin'): { // added
                        operator = 'sin';
                        break;
                    }
                    case cmd.get('cos'): { // added
                        operator = 'cos';
                        break;
                    }
                    case cmd.get('tan'): { // added
                        operator = 'tan';
                        break;
                    }
                }
                node[node_idx] = [
                    operator,
                    node[matches[2][key]]
                ];
                node_idx++;
            }
        }

        // get command with 2 args
        regex = new RegExp(
            forregex(partL) +
            '0' +
            '(' +
            cmd.get('frac') +
            '|' +
            cmd.get('nthroot') +
            ')' +
            forregex(partR) +
            forregex(partL) +
            '([1-9][0-9]*)' +
            forregex(partR) +
            forregex(partL) +
            '([1-9][0-9]*)' +
            forregex(partR),
            'g');
        matches = match_all(newA, regex);
        if (matches.length !== 0) {
            const [match_0] = matches;
            match_0.forEach((value, key) => {
                newA = newA.replaceAll(
                    value,
                    partL + node_idx + partR
                );
                const operator = matches[1][key] === cmd.get('frac')
                    ? 'fraction'
                    : 'nthroot';
                node[node_idx] = [
                    operator,
                    node[matches[2][key]],
                    node[matches[3][key]]
                ];
                node_idx++;
            });
        }

        // get command with 3 args
        regex = new RegExp(
            forregex(partL) +
            '0' +
            '(' +
            cmd.get('mfrac') +
            ')' +
            forregex(partR) +
            forregex(partL) +
            '([1-9][0-9]*)' +
            forregex(partR) +
            forregex(partL) +
            '([1-9][0-9]*)' +
            forregex(partR) +
            forregex(partL) +
            '([1-9][0-9]*)' +
            forregex(partR),
            'g');
        matches = match_all(newA, regex);
        if (matches.length !== 0) {
            const [match_0] = matches;
            match_0.forEach((value, key) => {
                newA = newA.replaceAll(
                    value,
                    partL + node_idx + partR
                );
                node[node_idx] = [
                    'mfraction',
                    node[matches[2][key]],
                    node[matches[3][key]],
                    node[matches[4][key]]
                ];
                node_idx++;
            });
        }
    } while (newA !== oldA);
    return [newA, node_idx];
}

function LatexToTree_sp_1(newA, node, node_idx) {
    let oldA = '';
    do {
        oldA = newA;
        // get special lv1 command with 2 args
        let regex = new RegExp(
            forregex(partL) +
            '00' +
            '(' +
            cmd_special.get('logbase') +
            ')' +
            forregex(partR) +
            forregex(partL) +
            '([1-9][0-9]*)' +
            forregex(partR) +
            '((' +
            forregex(partL) +
            '([1-9][0-9]*)' +
            forregex(partR) +
            ')*)',
            'g'
        );
        let matches = match_all(newA, regex);
        if (matches.length !== 0) {
            const [match_0] = matches;
            match_0.forEach((value, key) => {
                newA = newA.replaceAll(
                    value,
                    partL + node_idx + partR
                );
                node[node_idx] = [
                    'log',
                    form_tree(matches[3][key], node),
                    node[matches[2][key]]
                ];
                node_idx++;
            });
        }

        // get special lv1 command with 1 arg
        regex = new RegExp(
            forregex(partL) +
            '00' +
            '(' +
            cmd_special.get('log') +
            '|' +
            cmd_special.get('ln') +
            ')' +
            forregex(partR) +
            '((' +
            forregex(partL) +
            '([1-9][0-9]*)' +
            forregex(partR) +
            ')*)',
            'g');
        matches = match_all(newA, regex);
        if (matches.length !== 0) {
            const [match_0] = matches;
            const log_ind = cmd_special.get('log');
            match_0.forEach((value, key) => {
                newA = newA.replaceAll(
                    value,
                    partL + node_idx + partR
                );
                const operator = matches[1][key] === log_ind
                    ? 'log'
                    : 'ln';
                node[node_idx] = [
                    operator,
                    form_tree(matches[2][key], node)
                ];
                node_idx++;
            });
        }
    } while (oldA !== newA);
    return [newA, node_idx];
}

function LatexToTree_sp_2(newA, node, node_idx) {
    let oldA = '';
    do {
        oldA = newA;
        // get special lv2 command with 3 args
        const regex = new RegExp(
            forregex(partL) +
            '0' +
            '(' +
            cmd.get('summ') +
            ')' +
            forregex(partR) +
            forregex(partL) +
            '([1-9][0-9]*)' +
            forregex(partR) +
            forregex(partL) +
            '([1-9][0-9]*)' +
            forregex(partR) +
            '((' +
            forregex(partL) +
            '([1-9][0-9]*)' +
            forregex(partR) +
            ')*)',
            'g');
        const matches = match_all(newA, regex);
        if (matches.length !== 0) {
            const [match_0] = matches;
            match_0.forEach((value, key) => {
                newA = newA.replaceAll(
                    value,
                    partL + node_idx + partR
                );
                node[node_idx] = [
                    'summation',
                    node[matches[2][key]],
                    node[matches[3][key]],
                    form_tree(matches[4][key], node)
                ];
                node_idx++;
            });
        }
    } while (oldA !== newA);
    return [newA, node_idx];
}

const comma = ',';
const plus = '+';
const minus = '-';
const equation = '=';
const ratio = ':';

function form_tree(newA, node) {
    if (newA === '') {
        return [];
    }

    let result = form_tree_terms(newA, node);
    if (result.length !== 0) {
        return result;
    }

    result = form_tree_eq(newA, node);
    if (result.length !== 0) {
        return result;
    }

    result = form_tree_compo(newA, node);
    if (result.length !== 0) {
        return result;
    }

    result = form_tree_addchain(newA, node);
    if (result.length !== 0) {
        return result;
    }

    return form_tree_mulchain(newA, node);
}

function form_tree_terms(newA, node) {
    // single term
    const regex = new RegExp(
        '^' +
        forregex(partL) +
        '([1-9][0-9]*)' +
        forregex(partR) +
        '$',
        'g');
    const matches = match_all(newA, regex);
    if (matches.length !== 0 && matches[1].length === 1) {
        return node[matches[1][0]];
    }

    // array (multiple terms)
    const arr = newA.split(new RegExp(comma, 'g'));
    if (arr.length > 1) {
        return ['array', ...arr.map(value => form_tree(value, node))];
    }

    return [];
}

function form_tree_eq(newA, node) {
    let result = [];
    // inequality
    let regex = new RegExp(
        forregex(partL) +
        '0(' +
        cmd.get('gt') +
        '|' +
        cmd.get('ge') +
        '|' +
        cmd.get('lt') +
        '|' +
        cmd.get('le') +
        ')' +
        forregex(partR) +
        ' ?',
        'g');
    let arr = newA.split(regex);
    const arr_length = arr.length;
    if (arr_length !== 1) {
        result = ['inequality'];
        const max = Math.floor(arr_length / 2);
        for (let i = 0; i < max; i++) {
            const j = 2 * i + 1;
            result[j] = form_tree(arr[2 * i], node);
            switch (arr[2 * i + 1]) {
                case cmd.get('gt') : {
                    result[j + 1] = 'gt';
                    break;
                }
                case cmd.get('ge') : {
                    result[j + 1] = 'ge';
                    break;
                }
                case cmd.get('lt') : {
                    result[j + 1] = 'lt';
                    break;
                }
                case cmd.get('le') : {
                    result[j + 1] = 'le';
                    break;
                }
                default: {
                    result[j + 1] = 'ERROR';
                }
            }
        }
        result[2 * max + 1] = form_tree(arr[2 * max], node);
        return result;
    }

    // neq
    regex = new RegExp(
        forregex(partL) +
        '0' +
        cmd.get('neq') +
        forregex(partR) +
        ' ?',
        'g');
    arr = newA.split(regex);
    if (arr.length !== 1) {
        return ['neq', ...arr.map(value => form_tree(value, node))];
    }

    // equation
    arr = newA.split(new RegExp(equation, 'g'));
    if (arr.length !== 1) {
        return ['equation', ...arr.map(value => form_tree(value, node))];
    }

    // ratio
    arr = newA.split(ratio);
    if (arr.length !== 1) {
        return ['ratio', ...arr.map(value => form_tree(value, node))];
    }

    return result;
}

function form_tree_compo(newA, node) {
    // composition
    let regex = new RegExp(
        forregex(partL) +
        '0' +
        cmd.get('circ') +
        forregex(partR) +
        ' ?',
        'g');
    let arr = newA.split(regex);
    if (arr.length !== 1) {
        return ['composition', ...arr.map(value => form_tree(value, node))];
    }

    // cap
    regex = new RegExp(
        forregex(partL) +
        '0' +
        cmd.get('cap') +
        forregex(partR) +
        ' ?',
        'g');
    arr = newA.split(regex);
    if (arr.length !== 1) {
        return ['cap', ...arr.map(value => form_tree(value, node))];
    }

    // cup
    regex = new RegExp(
        forregex(partL) +
        '0' +
        cmd.get('cup') +
        forregex(partR) +
        ' ?',
        'g');
    arr = newA.split(regex);
    if (arr.length !== 1) {
        return ['cup', ...arr.map(value => form_tree(value, node))];
    }

    return [];
}

function form_tree_addchain(newA, node) {
    let result = [];
    const regex = new RegExp(
        '(' +
        forregex(plus) +
        '|' +
        forregex(minus) +
        '|' +
        forregex(partL) +
        '0' +
        cmd.get('pm') +
        forregex(partR) +
        '|' +
        forregex(partL) +
        '0' +
        cmd.get('mp') +
        forregex(partR) +
        ' ?' +
        ')',
        'g');
    const arr = newA.split(regex);
    const arr_length = arr.length;
    if (arr_length !== 1) {
        result = [];
        const max = Math.floor(arr_length / 2);
        if (arr[0] !== '') {
            result = [...result, ['add', form_tree(arr[0], node)]];
        }
        for (let i = 1; i <= max; i++) {
            const term_add = form_tree(arr[2 * i], node);
            let op = '';
            switch (arr[2 * i - 1]) {
                case plus: {
                    op = 'add';
                    break;
                }
                case minus: {
                    op = 'sub';
                    break;
                }
                case partL + '0' + cmd.get('pm') + partR: {
                    op = 'addsub';
                    break;
                }
                case partL + '0' + cmd.get('mp') + partR: {
                    op = 'subadd';
                    break;
                }
            }
            result = [...result, [op, term_add]]
        }
        if (result.length !== 1) {
            return ['addchain', ...result];
        }
        let operator = '';
        switch (result[0][0]) {
            case 'add': {
                operator = 'positive';
                break;
            }
            case 'sub': {
                operator = 'negative';
                break;
            }
            case 'addsub': {
                operator = 'pm';
                break;
            }
            case 'subadd': {
                operator = 'mp';
                break;
            }
        }
        return [operator, result[0][1]]
    }

    return form_tree_mulchain(newA, node);
}

function form_tree_mulchain(newA, node) {
    let result = [];

    // times, div => mulchain
    let regex = new RegExp(
        forregex(partL) +
        '0(' +
        cmd.get('times') +
        '|' +
        cmd.get('div') +
        ')' +
        forregex(partR) +
        ' ?',
        'g');
    let arr = newA.split(regex);
    const arr_length = arr.length;
    if (arr_length !== 1) {
        const max = Math.floor(arr_length / 2);
        result = ['mulchain', ['mul', form_tree(arr[0], node)]];
        for (let i = 1; i <= max; i++) {
            const op = arr[2 * i - 1] === cmd.get('times')
                ? 'mul'
                : 'div';
            result = [...result, [op, form_tree(arr[2 * i], node)]]
        }
        return result;
    }

    // cdot
    regex = new RegExp(
        forregex(partL) +
        '0' +
        cmd.get('cdot') +
        forregex(partR) +
        ' ?',
        'g');
    arr = newA.split(regex);
    if (arr.length !== 1) {
        return ['mulchain', ...arr.map(value => ['mul', form_tree(value, node)])];
    }

    // mulchain
    regex = new RegExp(
        forregex(partL) +
        '([1-9][0-9]*)' +
        forregex(partR),
        'g');
    const matches = match_all(newA, regex);
    result = [];
    if (matches.length !== 0) {
        if (matches[0].length <= 1) {
            return false;
        }
        result = ['mulchain', ['mul', node[matches[1][0]]]];
        const length = matches[0].length;
        let index = matches[0][1].length;
        let op = '';
        for (let i = 1; i < length; i++) {
            switch (newA.charAt(index)) {
                case '\/': {
                    op = 'div';
                    index += 1;
                    break;
                }
                case '*': {
                    op = 'mul';
                    index += 1;
                    break;
                }
                default: {
                    op = 'mul';
                    break;
                }
            }
            result = [...result, [op, node[matches[1][i]]]];
            index += matches[0][i].length;
        }
    }
    return result;
}

function replace_RegExp(newA, value, node_idx) {
    return newA.replaceAll(
        new RegExp(forregex(value), 'g'),
        partL + node_idx + partR
    );
}

/*
javascript version preg_match_all
*/
export function match_all(string, regexp) {
    const matches = [...string.matchAll(regexp)];
    let result = [];
    if (matches.length === 0) {
        return result;
    }
    const match_0_length = matches[0].length;
    for (let i = 0; i < match_0_length; i++) {
        result = [...result, []];
    }
    matches.forEach(match => {
        match.forEach((value, key) => {
            result[key] = [...result[key], value];
        });
    });
    return result;
}
/*
const latex_0 = 'x2';
console.log(JSON.stringify(LatexToTree(latex_0), null, 4));
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
let preset
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
    const array1 = _searchTypeInMathtree(tree, 'array');
    const array2 = _searchTypeInMathtree(tree, 'tuple');
    const array = [...array1, ...array2];
    for (const obj of array) {
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
        const lhs = [
            (eq[1][0] * head[0] + eq[1][1] * head[1]) / (head[0] * head[0] + head[1] * head[1]),
            (eq[1][1] * head[0] - eq[1][0] * head[1]) / (head[0] * head[0] + head[1] * head[1])
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
        if (v[0] === 'add') {
            factorNegative[k][0] = 'sub';
        } else {
            factorNegative[k][0] = 'add';
        }
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
        operand.forEach((v, k) => {
            const term = organizeMathTree_identicalMulAss(v);
            if (operator === 'addchain' && term[0] === 'add' && term[1][0] === 'addchain') {
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
            operand.forEach((v, k) => {
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
                            let char_pos_max;
                            if (dir_max[0] === 'r') {
                                char_pos_max = (pos_max[0] + i) % operand.length;
                            } else {
                                char_pos_max = (pos_max[0] - i + operand.length) % operand.length;
                            }
                            let char_pos_new;
                            if (temp_dir[0] === 'r') {
                                char_pos_new = (k + i) % operand.length;
                            } else {
                                char_pos_new = (k - i + operand.length) % operand.length;
                            }

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
            })

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
    } else {
        return tree;
    }
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
        } else if (typeof A < typeof B) {
            return -1;
        } else if (A > B) {
            return 1;
        } else if (A < B) {
            return -1;
        } else {
            return 0;
        }
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

function _replacementInMathTree(tree, from, to) {
    if (is_equal(tree, from)) {
        return to;
    }
    const [operator, ...operand] = tree;

    const newOperand = [];
    for (const v of operand) {
        if (Array.isArray(v)) {
            newOperand.push(_replacementInMathTree(v, from, to));
        } else {
            newOperand.push(v);
        }
    }

    return [operator, ...operand];
}

function evaluateEx(tree) {
    let newTree = [];
    switch (tree[0]) {
        // 180220 larwein - inequality patch
        case 'inequality': {
            if (tree[2] === 'gt' || tree[2] === 'ge') {
                newTree = [
                    'inequality',
                    evaluateEx(['addchain',
                        ['add', tree[1]],
                        ['sub', tree[3]]
                    ]),
                    tree[2],
                    ['natural', 0]
                ];
            } else {
                newTree = [
                    ['inequality',
                        evaluateEx(['addchain',
                            ['add', tree[3]],
                            ['sub', tree[1]]
                        ]),
                    tree[2] === 'lt' ? 'gt' : 'ge',
                    ['natural', 0]
                ]];
            }
            break;
        }
        default: {
            newTree = ['eval',
                _evaluateExWithSeed(tree, -2),
                _evaluateExWithSeed(tree, -1),
                _evaluateExWithSeed(tree, 1),
                _evaluateExWithSeed(tree, 2),
                _evaluateExWithSeed(tree, 3)
            ]
        }
    }

    return newTree;
}

function _evaluateExWithSeed(A, seed = 1) {
    if (!Array.isArray(A)) {
        return A;
    }
    const [operator, ...operandTree] = A;
    if (operator === 'summation') {
        return _evaluateOperation(operator, operandTree, seed);
    }
    const operand = [];
    for (const each of operandTree) {
        operand.push(_evaluateExWithSeed(each, seed));
    }
    switch (operator) {
        case 'variable': {
            if (operand.length === 1) {
                return _evaluateVariable(operand[0], seed);
            } else {
                return _evaluateVariable(operand, seed);
            }
        }
        case 'overline':
        case 'overleftarrow':
        case 'overrightarrow':
        case 'overleftrightarrow':
        case 'arc':
        case 'mangle':
        case 'angle':
        case 'sine':
        case 'cosine':
        case 'tangent': {
            return operand[0];
        }
        case 'equation':
        case 'neq':
        case 'ratio':
        case 'inequality':
        case 'orchain': {
            return [operator, ...operand];
        }
        default: {
            return _evaluateOperation(operator, operand);
        }
    }
}
/*
function _evaluateEx_preProcess(A) {
    return _evaluateEx_preProcess_separatePlusMinus(A);
}
*/
/*
function _evaluateEx_preProcess_separatePlusMinus(A) {
    if (!Array.isArray(A)) {
        return A;
    }
    const [operator, ...operandTree] = A;
    const operand = [[], []];
    let flag_separate = false;
    for (const each of operandTree) {
        const temp = _evaluateEx_preProcess_separatePlusMinus(each);
        if (Array.isArray(temp) && temp[0] === 'orchain') {
            flag_separate = true;
            operand[0].push(temp[1]);
            operand[1].push(temp[2]);
        } else {
            operand[0].push(temp);
            operand[1].push(temp);
        }
    }

    const newOperator = [];
    switch (operator) {
        case 'addsub': {
            newOperator[0] = 'add';
            newOperator[1] = 'sub';
            flag_separate = true;
            break;
        }
        case 'subadd': {
            newOperator[0] = 'sub';
            newOperator[1] = 'add';
            flag_separate = true;
            break;
        }
        case 'pm': {
            newOperator[0] = null;
            newOperator[1] = 'negative';
            flag_separate = true;
            break;
        }
        case 'mp': {
            newOperator[0] = 'negative';
            newOperator[1] = null;
            flag_separate = true;
            break;
        }
        default: {
            newOperator[0] = operator;
            newOperator[1] = operator;
            break;
        }
    }

    let result;
    if (flag_separate) {
        result = [
            'orchain',
            [newOperator[0], ...operand[0]],
            [newOperator[1], ...operand[1]]];
    } else {
        result = [newOperator[0], ...operand[0]];
    }
    return result;
}
*/
function _evaluateVariable(variable, seed) {
    // variable with several alphabets. e.g. ABC
    if (Array.isArray(variable)) {
        let re = 0;
        let im = 0;
        const entries_v = variable.entries();
        for (const [k, v] of entries_v) {
            if (k > 2) {
                break;
            }
            const val = _evaluateVariable(v, seed);
            re = re + ((-2.2 + k) * val[0]);
            im = im + ((1.3 - k) * val[1]);
        }
        return [re, im];
    } else if (variable === 'i') { // imaginary unit 'i'
        return [0, 1];
    } else { // single (english, korean, and greek) alphabet
        const primes = [
            2, 3, 5, 7, 11, 13, 17, 19, 23, 29,
            31, 37, 41, 43, 47, 53, 59, 61, 67, 71,
            73, 79, 83, 89, 97, 101, 103, 107, 109, 113,
            127, 131, 137, 139, 149, 151, 157, 163, 167, 173,
            179, 181, 191, 193, 197, 199, 211, 223, 227, 229,
            233, 239, 241, 251, 257, 263, 269, 271, 277, 281,
            283, 293, 307, 311, 313, 317, 331, 337, 347, 349,
            353, 359, 367, 373, 379, 383, 389, 397, 401, 409,
            419, 421, 431, 433, 439, 443, 449, 457, 461, 463,
            467, 479, 487, 491, 499, 503, 509, 521, 523, 541,
            547, 557, 563, 569, 571, 577, 587, 593, 599, 601,
            607, 613, 617, 619, 631, 641, 643, 647, 653, 659,
            661, 673, 677, 683, 691, 701, 709, 719, 727, 733,
            739, 743, 751, 757, 761, 769, 773, 787, 797, 809,
            811, 821, 823, 827, 829, 839, 853, 857, 859, 863,
            877, 881, 883, 887, 907, 911, 919, 929, 937, 941,
            947, 953, 967, 971, 977, 983, 991, 997
        ];
        const regex = "/^([ㄱ-ㅎ가-힣]|[a-zA-Z]*)([']*)/u";
        switch (variable) {
            case 'pi': {
                variable = "ㄱ'";
                break;
            }
            case 'theta': {
                variable = "ㄴ'";
                break;
            }
            case 'alpha': {
                variable = "ㄷ'";
                break;
            }
            case 'beta': {
                variable = "ㄹ'";
                break;
            }
            case 'gamma': {
                variable = "ㅁ'";
                break;
            }
        }
        const matches = match_all(regex, variable);
        variable = matches[1][0];
        const shoulder = matches[2][0].length;

        const ord = variable.charCodeAt(0);
        let num
        if (ord < 128) {
            num = ord - 64;
        } else {
            num = utf8_ord(variable);
            switch (num) {
                case 952: {
                    num = 70;
                    break;
                }
                case 960: {
                    num = 71;
                    break;
                }
                default : {
                    num = num - 12493;
                }
            }
        }
        if (seed === 2 || seed === -2) {
            num = primes.length - num;
        }
        if (num < 0) {
            num *= -1;
        }
        if (num > primes.length) {
            num = num % primes.length;
        }
        let result = num + Math.sqrt(2 * primes[num]);

        if (seed < 0) {
            result = -result;
        }
        if (seed === 3 || seed === -3) {
            result = 1 / result;
        }
        if (shoulder > 0) {
            return [result / shoulder, result - primes[shoulder]];
        } else {
            return [result, result / num];
        }
    }
}

function utf8_ord(ch) {
    const len = ch.length;
    if (len <= 0) {
        return false;
    }
    const h = ch.charCodeAt(0);// ord(ch.charAt(0));
    if (h <= 0x7F) {
        return h;
    }
    if (h < 0xC2) {
        return false;
    }
    if (h <= 0xDF && len > 1) {
        return (h & 0x1F) << 6 | (ch.charCodeAt(1) & 0x3F);
    }
    if (h <= 0xEF && len > 2) {
        return (h & 0x0F) << 12 | (ch.charCodeAt(1) & 0x3F) << 6 | (ch.charCodeAt(2) & 0x3F);
    }
    if (h <= 0xF4 && len > 3) {
        return (h & 0x0F) << 18 | (ch.charCodeAt(1) & 0x3F) << 12 | (ch.charCodeAt(2) & 0x3F) << 6 | (ch.charCodeAt(3) & 0x3F);
    }
    return false;
}

function _evaluateOperation(operator, operand, seed = null) {
    switch (operator) {
        case 'natural':
        case 'decimal': {
            return [operand[0], 0];
        }
        case 'positive':
        case 'add':
        case 'mul': {
            return operand[0];
        }
        case 'pm':
        case 'addsub': {
            return [0.8 * operand[0][0], 1.2 * operand[0][1]];
        }
        case 'negative':
        case 'sub': {
            if (Array.isArray(operand[0][0]) || Array.isArray(operand[0][1])) {
                return [0, 0];
            }
            return [-operand[0][0], -operand[0][1]];
        }
        case 'addchain': {
            const sum = [0, 0];
            for (const term of operand) {
                sum[0] += is_numeric(term[0])
                    ? term[0]
                    : 0;
                sum[1] += is_numeric(term[1])
                    ? term[1]
                    : 0;
            }
            return sum;
        }
        case 'div': {
            if (!is_numeric(operand[0][0]) || !is_numeric(operand[0][1])) {
                return [1, 1];
            }
            return [
                operand[0][0] / (operand[0][0] * operand[0][0] + operand[0][1] * operand[0][1]),
                -operand[0][1] / (operand[0][0] * operand[0][0] + operand[0][1] * operand[0][1])
            ];
        }
        case 'mulchain': {
            if (!is_numeric(operand[0][0]) ||
                !is_numeric(operand[0][1]) ||
                !is_numeric(operand[1][0]) ||
                !is_numeric(operand[1][1])) {
                return [1, 1];
            }

            const prod = [1, 0];
            for (const factor of operand) {
                const temp = prod;
                prod[0] = temp[0] * factor[0] - temp[1] * factor[1];
                prod[1] = temp[0] * factor[1] + temp[1] * factor[0];
            }
            return prod;
        }
        case 'fraction': {
            if (!is_numeric(operand[0][0]) ||
                !is_numeric(operand[0][1]) ||
                operand[1][0] === 0 ||
                !is_numeric(operand[1][0]) ||
                !is_numeric(operand[1][1])) {
                return [1234, 5678];
            }
            return [
                (operand[0][0] * operand[1][0] + operand[0][1] * operand[1][1]) / (operand[1][0] * operand[1][0] + operand[1][1] * operand[1][1]),
                (operand[0][1] * operand[1][0] - operand[0][0] * operand[1][1]) / (operand[1][0] * operand[1][0] + operand[1][1] * operand[1][1])
            ];
        }
        case 'mfraction': {
            if (!is_numeric(operand[0][0]) ||
                !is_numeric(operand[1][0]) ||
                !is_numeric(operand[2][0]) ||
                operand[2][0] === 0) {
                return [5678, 1234];
            }
            return [operand[0][0] + operand[1][0] / operand[2][0], 0];
        }
        case 'power': {
            return pow_complex(operand[0], operand[1]);
        }
        case 'squareroot': {
            return pow_complex(operand[0], [0.5, 0]);
        }
        case 'nthroot': {
            if (!is_numeric(operand[0][0]) ||
                !is_numeric(operand[0][1]) ||
                !is_numeric(operand[1][0]) ||
                !is_numeric(operand[1][1])) {
                return [1, 1];
            }
            return pow_complex(
                operand[0],
                [
                    operand[1][0] / (operand[1][0] * operand[1][0] + operand[1][1] * operand[1][1]),
                    -operand[1][1] / (operand[1][0] * operand[1][0] + operand[1][1] * operand[1][1])
                ]
            );
        }
        case 'absolute': {
            if (!is_numeric(operand[0][0]) ||
                !is_numeric(operand[0][1])) {
                return [1, 1];
            }
            return [Math.sqrt(operand[0][0] * operand[0][0] + operand[0][1] * operand[0][1]), 0];
        }
        case 'rdecimal': {
            const intg = operand[0];
            const num = operand[1] + operand[2] - operand[1];
            let denum = '';
            for (let i = 0; i < operand[2].length; i++) {
                denum += '9';
            }
            for (let i = 0; i < operand[1].length; i++) {
                denum += '0';
            }
            return [intg + (num / denum), 0];
        }
        case 'subscript':{
            if (!is_numeric(operand[0][0]) ||
                !is_numeric(operand[0][1]) ||
                !is_numeric(operand[1][0]) ||
                !is_numeric(operand[1][1])) {
                return [1, 1];
            }
            return [operand[0][0] + 2 * operand[1][1], operand[0][1] + 2 * operand[1][0]];
        }
        case 'ln': {
            return [Math.log(Math.sqrt(operand[0][0] * operand[0][0] + operand[0][1] * operand[0][1])), 0];
        }
        case 'log': {
            if (typeof operand[1] !== 'undefined') {
                return _evaluateOperation('fraction', [_evaluateOperation('ln', [operand[0]]), _evaluateOperation('ln', [operand[1]])]);
            } else {
                return _evaluateOperation('fraction', [_evaluateOperation('ln', [operand[0]]), _evaluateOperation('ln', [[10, 0]])]);
            }
        }
        case 'summation': {
            if (operand[0][0] === 'equation' &&
                operand[0][1][0] === 'variable' &&
                operand[0][2][0] === 'natural' &&
                operand[1][0] === 'natural') {
                let sum = [0, 0];
                const [[, variable, [, min]], [, max]] = operand;

                // const variable = operand[0][1];
                // const min = operand[0][2][1];
                // const max = operand[1][1];
                for (let i = min; i <= max; i++) {
                    let newEx = _replacementInMathTree(operand[2], variable, ['natural', i]);
                    newEx = _evaluateExWithSeed(newEx, seed);
                    sum = _evaluateOperation('addchain', [sum, newEx]);
                }
                return sum;
            } else {
                return null;
            }
        }
    }
}

function pow_complex(A, B) {
    if (!is_numeric(A[0]) ||
        !is_numeric(A[1]) ||
        !is_numeric(B[0]) ||
        !is_numeric(B[1])) {
        return [1, 1];
    }
    const r = Math.sqrt(A[0] * A[0] + A[1] * A[1]);
    let theta;
    if (A[1] === 0 && A[0] === 0) {
        return [0, 0];
    }
    if (A[1] === 0 && A[0] > 0) {
        theta = 0;
    } else if (A[1] === 0 && A[0] < 0) {
        theta = Math.PI;
    } else if (A[1] > 0) {
        theta = Math.acos(A[0] / r);
    } else {
        theta = 2 * Math.PI - Math.acos(A[0] / r);
    }
    const c = B[0];
    const d = B[1];

    const newR = Math.pow(r, c) / Math.exp(d * theta);
    const newTheta = d * Math.log(r) + c * theta;
    return [
        newR * Math.cos(newTheta),
        newR * Math.sin(newTheta)
    ];
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
function evaluateYValue(A, x) {
    if (!Array.isArray(A)) {
        A = LatexToTree(A);
    }
    if (Array.isArray(A) && A[0] === 'equation') {
    } else {
        return false;
    }

    const y = _evaluateExWithValue(A[2], {'x' : x});

    return y[0];
}

/*
function identifyEqWithValue(A,valueArr) {}
{
    if (gettype(A) !== 'array')
        A = LatexToTree(A);

    if (gettype(A) === 'array'
            && in_array(A[0],array('equation','inequality')));
    else
        return false;

    evaluatedEq = _evaluateExWithValue(A,valueArr);

    if (evaluatedEq[0] === 'equation')
    {
        return compareMathTree(evaluatedEq[1],evaluatedEq[2]);
    }
    else if(A[0] === 'inequality')
    {
        return false;
    }
}
*/

/*
function old_evaluateOperation(operator, operand) {
    switch(operator) {
        case 'natural':
        case 'decimal':
        case 'positive':
        case 'add':
        case 'mul': {
            return operand[0];
        }
        case 'negative':
        case 'sub': {
            return -operand[0];
        }
        case 'addchain': {
            const sum = 0;
            for (let term of operand) {
                sum += term;
            }
            return sum;
        }
        case 'div': {
            return 1 / operand[0];
        }

        case 'division': {
            return 1 / operand[0];
        }
        case 'mulchain': {
            const prod = 1;
            for (let factor of operand) {
                prod *= factor;
            }
            return prod;
        }
        case 'fraction': {
            return operand[0] / operand[1];
        }
        case 'mfraction': {
            return operand[0] + operand[1] / operand[2];
        }
        case 'power': {
            return Math.pow(operand[0], operand[1]);
        }
        case 'squareroot': {
            return Math.sqrt(operand[0]);
        }
        case 'nthroot': {
            return Math.pow(operand[0], 1 / operand[1]);
        }
        case 'absolute': {
            return Math.abs(operand[0]);
        }
        case 'rdecimal': {
            const intg = operand[0];
            const num = operand[1] . operand[2] - operand[1];
            const denum = '';
            for(let i = 0; i < operand[2].length; i++) {
                denum += '9';
            }
            for (let i = 0; i < operand[1].length; i++) {
                denum += '0';
            }
            return intg + (num / denum);
        }

    }
}
*/
/*
function makeEqWithPoints(type,points) {
    if (Array.isArray(points)) {

    } else {
        return false;
    }
    let result;
    switch(type) {
        case 'lineCurve': {
            if (points.length === 2) {
            } else {
                return false;
            }
            const xDiff = points[0][0] - points[1][0];
            if (xDiff == 0) {
                result = 'x=' + points[0][0];
                break;
            } else {
                const yDiff = points[0][1] - points[1][1];
                if (yDiff == 0) {
                    result = 'y=' + points[0][1];
                    break;
                } else {
                    let slope;
                    if (xDiff === 1) {
                        slope = yDiff;
                    } else if (xDiff === -1) {
                        slope = -yDiff;
                    } else {
                        slope = '\\frac{' + yDiff + '}{' + xDiff + '}';
                    }
                    result = 'y=' + slope + '(x-(' + points[0][0] + '))+(' + points[0][1] + ')';
                }
            }
            break;
        }
        case 'quadCurve': {
            if (points.length === 3) {
            } else {
                return false;
            }

            const xDiff = points[1][0] - points[0][0];
            const yDiff = points[1][1] - points[0][1];
            if (xDiff == 0 || yDiff == 0) {
                return false;
            } else {
                const squareXDiff = xDiff * xDiff;
                if (squareXDiff === 1) {
                    slope = yDiff;
                } else {
                    slope = '\\frac{' + yDiff + '}{' + squareXDiff + '}';
                }
                result = 'y=' + slope + '(x-(' + points[0][0] + '))^2+(' + points[0][1] + ')';
            }
            break;
        }
        case 'absCurve': {
            if (points.length === 3) {
            } else {
                return false;
            }

            const xDiff = points[1][0] - points[0][0];
            const yDiff = points[1][1] - points[0][1];
            if (xDiff == 0 || yDiff == 0) {
                return false;
            } else {
                const absXDiff = Math.abs(xDiff);
                let slope;
                if (xDiff == 1) {
                    slope = yDiff;
                } else {
                    slope = '\\frac{' + yDiff + '}{' + absXDiff + '}';
                }
                result = 'y=' + slope + '\\left|x-(' + points[0][0] + ')\\right|+(' + points[0][1] + ')';
            }
            break;
        }
        case 'expoCurve': {
            if (points.length === 3) {
            } else {
                return false;
            }

            const q = points[0][1];
            const yDiff1 = points[1][1] - q;
            const yDiff2 = points[2][1] - q;

            const xDiff = points[2][0] - points[1][0];

            if (xDiff == 0 || yDiff1 == 0 || yDiff2 == 0) {
                return false;
            } else {
                let a = '\frac{(' + yDiff1 + ')^(\frac{' + points[2][0] + '}{' + xDiff + '})}{(' + yDiff2 + ')^(\frac{' + points[1][0] + '}{' + xDiff + '})}';
                let b = '(\frac{' + yDiff2 + '}{' + yDiff1 + '})^(\frac{1}{' + xDiff + '})';
                result = 'y=(' + a + ')*(' + b + ')^x+(' + q + ')';
            }
            break;
        }
        case 'logCurve': {
            if (points.length === 3) {
            } else {
                false;
            }

            const q = points[0][0];
            const xDiff1 = points[1][0] - q;
            const xDiff2 = points[2][0] - q;
            const yDiff = points[2][1] - points[1][1];

            if (yDiff == 0 || xDiff1 == 0 || xDiff2 == 0) {
                return false;
            } else {
                const a = '\frac{(' + xDiff1 + ')^(\frac{' + points[2][1] + '}{' + yDiff + '})}{(' + xDiff2 + ')^(\frac{' + points[1][1] + '}{' + yDiff + '})}';
                const b = '(\frac{' + xDiff2 + '}{' + xDiff1 + '})^(\frac{1}{' + yDiff + '})';
                result = 'y=log_{' + b + + '}{\frac{x-' + q + '}{' + a + '}}';
            }
            break;
        }
        case 'sqrtCurve': {
            if (points.length === 2) {
            } else {
                return false;
            }
            const xDiff = points[1][0] - points[0][0];
            const yDiff = points[1][1] - points[0][1];
            if (xDiff == 0 || yDiff == 0) {
                return false;
            } else {
                if (yDiff > 0) {
                    sign = '';
                } else {
                    sign = '-';
                }
                const squareYDiff = yDiff * yDiff;
                let slope;
                if (xDiff == 1) {
                    slope = squareYDiff;
                } else if (xDiff == -1) {
                    slope = -squareYDiff;
                } else {
                    slope = '\\frac{'.squareYDiff + '}{' + xDiff + '}';
                }
                result = 'y=' + sign + '\\sqrt{' + slope + '(x-(' + points[0][0] + '))}+(' + points[0][1] + ')';
            }
            break;
        }
        case 'reciCurve': {
            if (sizeof(points) === 3) {
            } else {
                return false;
            }
            const xDiff = points[1][0] - points[0][0];
            const yDiff = points[1][1] - points[0][1];
            if (xDiff == 0 || yDiff == 0) {
                return false;
            } else {
                const slope = xDiff * yDiff;
                result = 'y=\\frac{' + slope + '}{x-(' + points[0][0] + ')}+(' + points[0][1] + ')';
            }
            break;
        }
        case 'sinCurve':
        case 'tanCurve': {
            return false;
        }
    }
    return result;
}
*/
/*
function splitAbsCurve(tree, bounds, endPoints) {
    if (bounds === null) {
        bounds = [-INF,INF];
        endPoints = [true,true];
    }
    if (!Array.isArray(tree)) {
        tree = LatexToTree(tree);
    }
    if (tree[0] !== 'equation') {
        return false;
    }
    let absTree = _searchTypeInMathtree(tree, 'absolute');
    if (absTree.length !== 1) {
        return false;
    } else {
        absTree = absTree[0];
    }
    let absEx = absTree[1];

    switch(absEx[0]) {
        case 'addchain': {
            if (absEx.length !== 3) {
                return false;
            }
            let varSize_firstTerm = _searchTypeInMathtree(absEx[1],'variable').length;
            let varSize_secondTerm = _searchTypeInMathtree(absEx[2],'variable').length;
            if (varSize_firstTerm === 1 && varSize_secondTerm === 0) {
                if (absEx[1][0] === 'add') {
                    variableTerm = absEx[1][1];
                } else {
                    variableTerm = ['negative', absEx[1][1]];
                }
                if (absEx[2][0] === 'add') {
                    constant = absEx[2][1];
                } else {
                    constant = ['negative', absEx[2][1]];
                }
            } else if (varSize_firstTerm === 0 && varSize_secondTerm === 1) {
                if (absEx[2][0] === 'add') {
                    variableTerm = absEx[2][1];
                } else {
                    variableTerm = ['negative', absEx[2][1]];
                }
                if (absEx[1][0] === 'add') {
                    constant = absEx[1][1];
                } else {
                    constant = ['negative', absEx[1][1]];
                }
            } else {
                return false;
            }
            break;
        }
        default: {
            variableTerm = absTree[1];
            constant = ['natural', 0];
        }
    }
    let sign;
    if (variableTerm[0] === 'negative') {
        sign = -1;
        variableTerm = variableTerm[1];
    } else {
        sign = 1;
    }

    switch(variableTerm[0]) {
        case 'variable': {
            variable = variableTerm;
            lineCoef = ['natural', 1];
            break;
        }
        case 'mulchain': {
            const varFactor = [];
            const coefFactor = [];
            const entries_v = variableTerm.entries();
            for (let [k, factor] of entries_v) {
                if (k === 0) {
                    continue;
                }
                if (factor[0] === 'mul') {
                    factor = factor[1];
                } else {
                    return false;
                }
                if (factor[0] === 'variable') {
                    varFactor.push(factor);
                } else {
                    coefFactor.push(factor);
                }
            }

            if (varFactor.length === 1) {
                variable = varFactor[0];
            } else {
                return false;
            }

            if (coefFactor.length === 0) {
                return false;
            } else if (coefFactor.length === 1) {
                lineCoef = coefFactor[0];
            } else {
                lineCoef = ['mulchain', ...coefFactor];
            }
            break;
        }
        //return false;
    }

    if (variable[1] !== 'x') {
        return false;
    }
    let lineCoef = _evaluateExWithValue(lineCoef, [])[0];
    let constant = _evaluateEXWithValue(constant, [])[0];
    if (sign === -1) {
        lineCoef = -lineCoef;
    }

    const mid = - constant / lineCoef;

    if (bounds[0] < mid && bounds[1] > mid) {
        newBounds1 = [bounds[0], mid];
        newBounds2 = [mid, bounds[1]];
        newEndPoints1 = [endPoints[0], true];
        newEndPoints2 = [false, endPoints[1]];
        if (lineCoef > 0) {
            return [
                [
                    _replacementInMathtree(tree, absTree, ['negative', absTree[1]]),
                    newBounds1,
                    newEndPoints1
                ],
                [
                    _replacementInMathtree(tree,absTree, absTree[1]),
                    newBounds2,
                    newEndPoints2
                ]
            ];
        } else {
            return [
                [
                    _replacementInMathtree(tree,absTree, absTree[1]),
                    newBounds1,
                    newEndPoints1
                ],
                [
                    _replacementInMathtree(tree,absTree,array('negative', absTree[1])),
                    newBounds2,
                    newEndPoints2
                ]
            ];
        }
    } else if (mid >= bounds[1]) {
        if (lineCoef > 0) {
            newEq = _replacementInMathtree(tree,absTree, ['negative', absTree[1]]);
        } else {
            newEq = _replacementInMathtree(tree,absTree, absTree[1]);
        }
        return [[newEq,bounds, endPoints]];
    } else {
        if (lineCoef > 0) {
            newEq = _replacementInMathtree(tree,absTree, absTree[1]);
        } else {
            newEq = _replacementInMathtree(tree,absTree, ['negative', absTree[1]]);
        }

        return [[newEq,bounds, endPoints]];
    }
}
*/

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
