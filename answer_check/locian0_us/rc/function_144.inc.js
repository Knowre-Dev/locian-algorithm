

export function compareRelation_old(right = null, input = null) {
    var right_1 = JSON.parse(JSON.stringify(right));
    var input_1 = JSON.parse(JSON.stringify(input));
    if (right_1['type'] === 'Relation' && input_1['type'] === 'Relation') {
        var info_right = Relation_old_getInfo(right_1);
        var info_input = Relation_old_getInfo(input_1);

        //console.log(JSON.stringify(info_right, null, 4));
        //console.log(JSON.stringify(info_input, null, 4));
       
        var indexArrays = [];
        if (!Relation_set(info_right['set'], info_input['set'], indexArrays)) {
            return false; 
        }
        if (!Relation_arrow(info_right['arrow'], info_input['arrow'], indexArrays)) {
            return false;
        }
        return true;
    }

    return false;
}

export function Relation_arrow(arrow_right, arrow_input, indexArrays) {
    var arrow_right_1 = JSON.parse(JSON.stringify(arrow_right));
    var arrow_input_1 = JSON.parse(JSON.stringify(arrow_input));
    if (arrow_right_1.length !== arrow_input_1.length) {
        return false;
    }
    
    // matching
    for (var [k1, arrow_set1] of arrow_right_1.entries()) {
        if (typeof arrow_set1 == 'undefined') {
            return false;
        }
        
        for (var arrow_set2 of arrow_input) {
            if (arrow_set1.length !== arrow_set2.length) {
                return false;
            }
            
            var sourceSet = indexArrays[k1];
            var targetSet = indexArrays[k1+1];
            var arrow_set2 = Relation_reArrows(arrow_set2, sourceSet, targetSet);
            
            if (!Relation_matchArrows(arrow_set1, arrow_set2)) {
                return false;
            }
        }
    }
    
    return true;
}

export function Relation_reArrows(inputArrows, sourceSet, targetSet) {
    var inputArrows_1 = JSON.parse(JSON.stringify(inputArrows));
    var sourceSet_1 = JSON.parse(JSON.stringify(sourceSet));
    var targetSet_1 = JSON.parse(JSON.stringify(targetSet));
    var result = [];
    for (var iarrow of inputArrows_1) {
        var s = iarrow[0];
        var t = iarrow[1];
        if (s in sourceSet_1) {
            s = sourceSet_1[s];
        }
        if (t in targetSet_1) {
            t = targetSet_1[t];
        }
        result.push([s, t]);
    }
    
    return result;
}

export function Relation_matchArrows(set1, set2) {
    var set1_1 = JSON.parse(JSON.stringify(set1));
    var set2_1 = JSON.parse(JSON.stringify(set2));
    if (set1_1 == null && set2_1 == null) {
        return true;
    }
    if(set1_1 == null || set2_1 == null) {
        return false;
    }
    if (set1_1.length !== set2_1.length) {
        return false;
    }
    
    for (var a of set1_1) {
        var doMatch = false;
        for (var [i, b] of set2_1.entries()) {
            if (b == null) {
                continue;
            }
            doMatch = (JSON.stringify(a) === JSON.stringify(b));

            if (doMatch) {
                set2_1[i] = null;
                break;
            }
        }

        if (doMatch === false) {
            return false;
        }
    }

    return true;
}

import {Relation_compTree} from '../rc/function_169.inc.js';

export function Relation_set(set_right, set_input, indexArrays) { 
    var set_right_1 = JSON.parse(JSON.stringify(set_right));
    var set_input_1 = JSON.parse(JSON.stringify(set_input));
    
    if (set_right_1 == null && set_input_1 == null) {
        return true;
    }
    if (set_right_1 == null || set_input_1 == null) {
        return false;
    }
    if (set_right_1.length !== set_input_1.length) {
        return false;
    }
    
    for (var [k1, setArray1] of set_right_1.entries()) {
        if (setArray1.length !== set_input_1[k1].length) {
            return false;
        }
       
        var indexArr = [];
        for (var value1 of setArray1) {
            
            for (var [k3, value2] of set_input_1[k1].entries()) {
                if (typeof value2 != 'undefined') {
                    if (value1['type'] === value2['type']) {
                        var value1 = Relation_getValue(value1);
                        var value2 = Relation_getValue(value2);
                        if (Relation_compTree(value1['value'], value2['value'])) {
                            if (typeof value2['index'] != 'undefined') {
                                indexArr[value2['index']] = value1['index'];
                            }
                            delete set_input_1[k1][k3];
                            break;
                        } else if (typeof value1['whitelist'] !== 'undefined') {
                            for (var w of value1['whitelist']) {
                                if (Relation_compTree(w, value2['value'])) {
                                    if (typeof value2['index'] != 'undefined') {
                                        indexArr[value2['index']] = value1['index'];
                                    }
                                    delete set_input_1[k1][k3];
                                    break;
                                }
                            }
                        }
                    }
                }
            }            
        }
        
        indexArrays[k1] = indexArr;  // [source, target]
        set_input_1[k1] = set_input_1[k1].filter(Boolean);
        if (set_input_1[k1].length !== 0) {
            return false;
        }
    }
    
    return true;
}

import {Relation_getTree} from '../rc/function_169.inc.js';

export function Relation_getValue(jsonArr) {
    var jsonArr_1 = JSON.parse(JSON.stringify(jsonArr));
    if (typeof jsonArr_1['lacoType'] == 'undefined') {
        return jsonArr_1;
    }
    
    if (jsonArr_1['type'] === 'math') {
        jsonArr_1['value'] = Relation_getTree(jsonArr_1['value'], null, jsonArr_1['lacoType']);
    } else if (jsonArr_1['type'] === 'text'){
        jsonArr_1['value'] = jsonArr_1['value'].toLowerCase();
        jsonArr_1['value'] = jsonArr_1['value'].replace(' ', '', );
    }
    
    if (typeof jsonArr_1['whitelist'] != 'undefined') {
        for (var [k, w] of jsonArr_1['whitelist'].entries()) {
            if (w != null) {
                if (jsonArr_1['type'] === 'math') {
                    jsonArr_1['whitelist'][k] = Relation_getTree(w, null, jsonArr_1['lacoType']);
                } else if (jsonArr_1['type'] === 'text') {
                    jsonArr_1['whitelist'][k] = w.toLowerCase().replace(' ', '');
                }
            }
        }
    }
    
    return jsonArr_1;
}

export function Relation_old_getInfo(relation) {
    var relation_1 = JSON.parse(JSON.stringify(relation));
    // get set array
    var set = [];
    for (var eachSet of relation_1['set']) {
        var eachElement = [];
        for (var [k, eachValue] of eachSet['element'].entries()) {
            if (eachValue['type'] === 'Input') {
                eachElement.push({
                    'type': eachValue['mode'],
                    'value': eachValue['value'],
                    'whitelist': typeof eachValue['option']['whitelist'] != 'undefined' ? eachValue['option']['whitelist'] : [],//null,
                    'lacoType': eachValue['option']['lacoType'],    
                    'index': k 
                });
            }
        }
        set.push(eachElement);
    }
    
    // get arrow array
    var arrow = [];
    for (var eachRelation of relation_1['relation']) {
        var eachArrow = [];
        for (var eachValue of eachRelation['value']) {
            eachArrow.push([eachValue['source'], eachValue['target']]);
        }
        arrow.push(eachArrow);
    }
    
    return {
        'set': set,
        'arrow': arrow
    };
}

// copy and paste from checkmath.php
export function Relation_forregex(c) {
    var special = [
        '\\','/','^','$','.','[',']',
        '|','(',')','?','*','+','{',
        '-',
        ','
    ];
    var nc = c.split('');
    var result = '';
    for (var v of nc) {
        if (special.includes(v)) {
            result += "\\" + v;
        } else {
            result += v;
        }
    }
    return result;
}

import {match_all} from '../checkmath.js';

export function Relation_LatexToTree(A, node = null, node_idx = null) {
    var node_1 = JSON.parse(JSON.stringify(node));
    var partL = '@';
    var partR = '#';
    
    A = A.replaceAll(
        new RegExp(
            '\\\\angle[ ]*([a-zA-Z]+)',
            'g'
        ), 
        '\\angle{$1}');
    A = A.replaceAll(
        new RegExp(
            'm[ ]*\\\\angle',
            'g'),
        '\\mangle');

    // 160906 larwein - trigonometry
    A = A.replaceAll(
        new RegExp(
            '\\\\(sin|cos|tan)[ ]*',
            'g'),
        '\\\$1');

    var delimeter = '\\';
    var cmdWhitespace = ':';
 
    var cmdLeft = 'left';
    var cmdRight = 'right';

    var cmd = {
        'pi': 1,
        'theta': 2,
        'overline': 3,
        'mfrac': 4,
        'frac': 5,
        'sqrt': 6,
        'nthroot': 7,
        'abs': 8,
        'times': 9,
        'cdot': 10,
        'div': 11,
        'neq': 12,
        'ne': 12,
        'gt': 13,
        'ge': 14,
        'lt': 15,
        'le': 16,
        'summ': 17,
        'overrightarrow': 18,
        'overleftarrow': 19,
        'overleftrightarrow': 20,
        'widearc': 41,
        'arc': 21,
        'mangle': 30,
        'angle': 31,
        'sin': 32,
        'cos': 33,
        'tan': 34,
        'varnothing': 22,
        'infty': 23,
        'pm': 24,
        'circ': 25,
        'R': 26,
        'mathbb(R)': 26,
        'text': 27
    };
    var cmd_special = {
        'logbase': 1,
        'log': 2,
        'ln': 3
    };

    var signParenthesisLeft = '('; 
    var signParenthesisRight = ')';
    var signBracketLeft = '['; 
    var signBracketRight = ']';
    var signBraceLeft = '{'; 
    var signBraceRight = '}';
    var signBar = '|';

    var signDecimaldot = '.';
    var signExponent = '^';
    var signSubscript = '_';

    if (node_1 === null) {
        node_1 = [];
    }
    if (node_idx === null) {
        node_idx = 1;
    }
    var newA = A;

    //pre-process
    //remove whitespace(\:)
    var replace = new Map([
        [delimeter + cmdWhitespace, '']
    ]);
    for (var [k, v] of replace.entries()) {
        newA = newA.replaceAll(k, v);
    }   
    //change absolute sign
    replace = new Map([
        [delimeter + cmdLeft + signBar, delimeter + 'abs' + signBraceLeft],
        [delimeter + cmdRight + signBar, signBraceRight]
    ]);
    for (var [k, v] of replace.entries()) { 
        newA = newA.replaceAll(k, v);
    }
    //change all grouping sign to parenthesis
    var replace = new Map([
        [signBraceLeft, signParenthesisLeft],
        [signBraceRight, signParenthesisRight]
    ]);
    for (var [k, v] of replace.entries()) {
        newA = newA.replaceAll(k, v);
    }
    //remove cmd 'left' and 'right' and 'text'
    replace = new Map([
        [delimeter + cmdLeft, ''],
        [delimeter + cmdRight, ''],
        [delimeter + 'text', '']
    ]);
    for (var [k, v] of replace.entries()) {
        newA = newA.replaceAll(k, v);
    }
    //change < or > to \lt or \gt
    replace = new Map([
        ['> ', '\\gt '],
        ['< ', '\\lt '],
        ['>', '\\gt '],
        ['<', '\\lt '],
        ['\\leq', '\\le'],
        ['\\geq', '\\ge']
    ]);
    for (var [k, v] of replace.entries()) {
        newA = newA.replaceAll(k, v);
    }
    
    
    //change mfrac form to mfrac command
    var regex = new RegExp();
    regex = new RegExp(
        "([0-9]+)" + 
        Relation_forregex(delimeter) + 
        "frac" +
        Relation_forregex(signParenthesisLeft) +
        "([0-9]+)" +
        Relation_forregex(signParenthesisRight) +
        Relation_forregex(signParenthesisLeft) +
        "([0-9]+)" +
        Relation_forregex(signParenthesisRight),
        'g');
    replace =
        delimeter +
        'mfrac' +
        signParenthesisLeft +
        '$1' +
        signParenthesisRight +
        signParenthesisLeft +
        '$2' +
        signParenthesisRight +
        signParenthesisLeft +
        '$3' +
        signParenthesisRight;

    newA = newA.replaceAll(regex, replace);
    

    regex = new RegExp(
        "([_\^])([0-9])",
        'g');
    replace = 
        '$1' + 
        signParenthesisLeft + 
        '$2' +
        signParenthesisRight;

    newA = newA.replaceAll(regex, replace);
    
    regex = new RegExp(
        /sqrt\[([1-9]+[0-9]*)\]/, 
        'g');
    replace = 'nthroot($1)';
    
    newA = newA.replaceAll(regex, replace);

    //change log_ to logbase

    replace = new Map([
        ['log_', 'logbase']
    ]);
    for (var [k, v] of replace.entries()) {
        newA = newA.replaceAll(k, v);
    }
    //change cmd to special_cmd...
    replace = new Map([
        ['\\logbase', 'logbase'],
        ['\\log', 'log'],
        ['\\ln',  'ln']
    ]);
    for (var [k, v] of replace.entries()) {
        newA = newA.replaceAll(k, v)
    }


    var match = [];
    //get number
    //repeating decimal
    regex = new RegExp(
        "([0-9]*)" +
        Relation_forregex(signDecimaldot) +
        "([0-9]*)" +
        Relation_forregex(delimeter) +
        "overline" +
        "\\(([0-9]+)\\)",
        'g');
    match = match_all(newA, regex);
    
    if (typeof match[0] != 'undefined') {
        match[0].sort().reverse();

        for (var [k, v] of match[0].entries()) {
            newA = newA.replaceAll(
                new RegExp(
                    Relation_forregex(v),
                    'g'),
                partL + node_idx.toString() + partR,
            );
            node_1[node_idx] = [
                'rdecimal',
                match[1][k],
                match[2][k],
                match[3][k]
            ];
            node_idx++;
        }
    }
    
    //decimal
    regex = new RegExp(
        "[0-9]*" + 
        Relation_forregex(signDecimaldot) + 
        "[0-9]+",
        'g');
    match = match_all(newA, regex);
    
    if (typeof match[0] != 'undefined') {
        match[0].sort().reverse();

        for (var v of match[0]) {
            newA = newA.replaceAll(
                new RegExp(
                Relation_forregex(v),
                'g'),
                partL + node_idx.toString() +partR);
            node_1[node_idx] = ['decimal', v];
            node_idx++;
        }
    }
    
    // 160727 larwein - commanatural
    regex = new RegExp(
        "[0-9]+(,[0-9]{3})*(?!" + 
        Relation_forregex(partL) +
        ")",
        "g");
    match = match_all(newA, regex);
    if (typeof match[0] != 'undefined') {
        match[0].sort().reverse();

        for (var v of match[0]) {
            newA = newA.replaceAll(
                new RegExp(
                    v + 
                    '(?![0-9]*' + 
                    Relation_forregex(partR) + ")",
                    'g'),
                partL + node_idx.toString() + partR);
            node_1[node_idx] = ['natural', v.replaceAll(',', '')];
            node_idx++;
        }
    }

    //natural
    regex = new RegExp(
        "[0-9]+(?!" + 
        Relation_forregex(partL) + 
        ")",
        'g');
    match = match_all(newA, regex);
    if (typeof match[0] != 'undefined') {
        match[0].sort().reverse();

        for (var v of match[0]) {
            newA = newA.replaceAll(
                new RegExp(
                v + 
                '(?![0-9]*' + Relation_forregex(partR) +
                ")",
                'g'),
                partL + node_idx.toString() + partR);
            node_1[node_idx] = ['natural', v];
            node_idx++;
        }
    }
    
  
    //get cmd
    for (var [k, v] of Object.entries(cmd)) {
        newA = newA.replaceAll(
            delimeter + k, 
            partL + '0' + v.toString() + partR        
        );
    }
    
    //get cmd_special
    for (var [k, v] of Object.entries(cmd_special)) {
        newA = newA.replaceAll(k, partL + '00' + v.toString() + partR);
    }

    //get variable
    //korean
    regex = new RegExp(
        "([가-힣])",
        'g');
    match = match_all(newA, regex);
    if (typeof match[0] != 'undefined') {
        match[0].sort().reverse();

        for (var v of match[0]) {
            newA = newA.replaceAll(
                new RegExp(
                    Relation_forregex(v),
                    'g'
                ),
                partL + node_idx.toString() + partR);
            node_1[node_idx] = ['variable', v];
            node_idx++;
        }
    }
  
    //greek
    regex = new RegExp(
        Relation_forregex(partL) + 
        '0(' + 
        cmd['pi'].toString() + 
        "|" + 
        cmd['theta'].toString() + 
        ")" +
        Relation_forregex(partR) +
        " ?", 
        'g'
    );
    match = match_all(newA, regex);
    if (typeof match[0] != 'undefined') {
        for (var v of match[0]) {
            newA = newA.replaceAll(
                new RegExp(
                    Relation_forregex(v),
                    'g'),
                partL + node_idx.toString() + partR);
            node_1[node_idx] = [
                'variable',
                match[1][k] === cmd['pi'].toString() ? 'pi' : 'theta'
            ];
            node_idx++;
        }
    }
    //English
    regex = new RegExp(
        "[a-zA-Z][']*",
        'g');
    match = match_all(newA, regex);
    if (typeof match[0] != 'undefined') {
        match[0].sort().reverse();
    
        for (var v of match[0]) {
            newA = newA.replaceAll(v, partL + node_idx.toString() + partR);
            node_1[node_idx] = ['variable', v];
            node_idx++;
        }
    }
    //get single command (command that has no argument)
    regex = new RegExp(
        Relation_forregex(partL) + 
        '0(' + 
        cmd['R'].toString() + 
        "|" + 
        cmd['varnothing'].toString() + 
        "|" + 
        cmd['infty'].toString() + 
        ")" + 
        Relation_forregex(partR) + 
        " ?",
        'g');
    match = match_all(newA, regex);
    if (typeof match[0] != 'undefined') {
        for (var [k, v] of match[0].entries()) {
            newA = newA.replaceAll(
                new RegExp(
                    Relation_forregex(v),
                    'g'),
                partL + node_idx.toString() + partR);
            switch (match[1][k]) {
                case cmd['R'].toString():
                    node_1[node_idx] = ['setname', 'real'];
                    break;

                case cmd['varnothing'].toString():
                    node_1[node_idx] = ['setname', 'empty'];
                    break;

                case cmd['infty'].toString():
                    node_1[node_idx] = ['infinity'];
                    break;
            }
            node_idx++;
        }
    }
    //get grouping
    var oldA = '';
    while (newA != oldA) {
        oldA = newA;

        //get parenthesis
        regex = new RegExp(
            "([" + 
            Relation_forregex(signBracketLeft) + 
            Relation_forregex(signParenthesisLeft) +
            "])" +
            "([^" + 
            Relation_forregex(signParenthesisLeft) + 
            Relation_forregex(signParenthesisRight) +
            "]*)" + 
            "([" +
            Relation_forregex(signBracketRight) + 
            Relation_forregex(signParenthesisRight) +
            "])",
            'g');
        match = match_all(newA, regex);
        if (typeof match[0] != 'undefined') {
            for (var [k, v] of match[0].entries()) {
                newA = newA.replaceAll(
                    v,
                    partL + node_idx.toString() + partR
                );
                var tempTree = Relation_LatexToTree(
                    match[2][k],
                    node_1,
                    node_idx
                );
                if (match[1][k] === '(' && match[3][k] === ')' && tempTree[0] === 'array') {
                    tempTree[0] = 'tuple';
                } else if (tempTree.length === 3 && tempTree[0] === 'array') {
                    tempTree = [
                        'interval',
                        match[1][k],
                        tempTree[1],
                        tempTree[2],
                        match[3][k]
                    ];
                }
                node_1[node_idx] = tempTree;
                node_idx++;
            }
        }
        
        //get binary operation (super,subscription)
        regex = new RegExp(
            Relation_forregex(partL) + 
            "([1-9][0-9]*)" +
            Relation_forregex(partR) +
            "([" +
            Relation_forregex(signExponent) +
            Relation_forregex(signSubscript) +
            "])" +
            Relation_forregex(partL) +
            "([1-9][0-9]*)" +
            Relation_forregex(partR),
            'g');
        match = match_all(newA, regex);
        if (typeof match[0] != 'undefined') {
            for (var [k, v] of match[0].entries()) {
                newA = newA.replaceAll(
                    v,
                    partL + node_idx.toString() + partR);
                node_1[node_idx] = [
                    match[2][k] === '^' ? 'power' : 'subscript',
                    node_1[match[1][k]],
                    node_1[match[3][k]]
                ];
                node_idx++;
            }
        }
        //get command no arg

        //get command 1 arg
        regex = new RegExp(
            Relation_forregex(partL) +
            "0" +
            "(" +
            cmd['overline'].toString() +
            "|" +
            cmd['overrightarrow'].toString() +
            "|" +
            cmd['overleftarrow'].toString() +
            "|" +
            cmd['overleftrightarrow'].toString() +
            "|" +
            cmd['widearc'].toString() + 
            "|" +
            cmd['arc'].toString() +
            "|" +
            cmd['mangle'].toString() +
            "|" +
            cmd['angle'].toString() +
            "|" +
            cmd['sin'].toString() +
            "|" +
            cmd['cos'].toString() +
            "|" +
            cmd['tan'].toString() +
            "|" +
            cmd['sqrt'].toString() +
            "|" +
            cmd['abs'].toString() +
            ")" +
            Relation_forregex(partR) +
            "[ ]*" +
            Relation_forregex(partL) +
            "([1-9][0-9]*)" +
            Relation_forregex(partR),
            'g');
        match = match_all(newA, regex);
        if (typeof match[0] != 'undefined') {
            for (var [k, v] of match[0].entries()) {
                newA = newA.replaceAll(
                    v,
                    partL + node_idx.toString() + partR);
                var typeName;
                switch(match[1][k]) {
                    case cmd['sqrt'].toString():
                        typeName = 'squareroot';
                        break;

                    case cmd['abs'].toString():
                        typeName = 'absolute';
                        break;

                    case cmd['overline'].toString():
                        typeName = 'overline';
                        break;

                    case cmd['overrightarrow'].toString():
                        typeName = 'overrightarrow';
                        break;

                    case cmd['overleftarrow'].toString():
                        typeName = 'overleftarrow';
                        break;

                    case cmd['overleftrightarrow'].toString():
                        typeName = 'overleftrightarrow';
                        break;

                    case cmd['mangle'].toString():
                        typeName = 'mangle';
                        break;

                    case cmd['angle'].toString():
                        typeName = 'angle';
                        break;
                    
                    case cmd['widearc'].toString():
                        typeName = 'arc';
                        break;

                    case cmd['arc'].toString():
                        typeName = 'arc';
                        break;

                    case cmd['angle'].toString():
                        typeName = 'angle';
                        break;

                    case cmd['sin'].toString():
                        typeName = 'sine';
                        break;

                    case cmd['cos'].toString():
                        typeName = 'cosine';
                        break;

                    case cmd['tan'].toString():
                        typeName = 'tangent';
                        break;
                }
                node_1[node_idx] = [
                    typeName,
                    node_1[match[2][k]]
                ];
                node_idx++;
                
                node_idx++;
            }
        }
        //get command 2 arg
        regex = new RegExp(
            Relation_forregex(partL) +
            "0" +
            "(" +
            cmd['frac'].toString() +
            "|" +
            cmd['nthroot'].toString() +
            ")" +
            Relation_forregex(partR) +
            Relation_forregex(partL) +
            "([1-9][0-9]*)" +
            Relation_forregex(partR) +
            Relation_forregex(partL) +
            "([1-9][0-9]*)" +
            Relation_forregex(partR),
            'g');
        match = match_all(newA, regex);
        if (typeof match[0] != 'undefined') {
            for (var [k, v] of match[0].entries()) {
                newA = newA.replaceAll(
                    v,
                    partL + node_idx.toString() + partR
                );
                node_1[node_idx] = [
                    match[1][k] === cmd['frac'].toString() ? 'fraction' : 'nthroot',
                    node_1[match[2][k]],
                    node_1[match[3][k]]
                ];
                node_idx++;
            }
        }
        
        //get command 3 arg
        regex = new RegExp(
            Relation_forregex(partL) +
            "0" +
            "(" +
            cmd['mfrac'].toString() +
            ")" +
            Relation_forregex(partR) +
            Relation_forregex(partL) +
            "([1-9][0-9]*)" +
            Relation_forregex(partR) +
            Relation_forregex(partL) +
            "([1-9][0-9]*)" +
            Relation_forregex(partR) +
            Relation_forregex(partL) +
            "([1-9][0-9]*)" +
            Relation_forregex(partR),
            'g');
        match = match_all(newA, regex);
        if (typeof match[0] != 'undefined') {
            for (var [k, v] of match[0].entries()) {
                newA = newA.replaceAll(
                    v,
                    partL + node_idx.toString() + partR
                );
                node_1[node_idx] = array(
                    'mfraction',
                    node_1[match[2][k]],
                    node_1[match[3][k]],
                    node_1[match[4][k]]
                );
                node_idx++;
            }
        }
        //get export function
    }

    //echo newA.'!!';
    oldA = '';
    while (oldA != newA) {
        oldA = newA;
        //get special lv1 command 2 arg
        regex = new RegExp(
            Relation_forregex(partL) +
            "00" +
            "(" +
            cmd_special['logbase'] +
            ")" +
            Relation_forregex(partR) +
            Relation_forregex(partL) +
            "([1-9][0-9]*)" +
            Relation_forregex(partR) +
            "((" +
            Relation_forregex(partL) +
            "([1-9][0-9]*)" +
            Relation_forregex(partR) +
            ")*)",
            'g');
        match = match_all(newA, regex);
        if (typeof match[0] != 'undefined') {
            for (var [k, v] of match[0].entries()) {
                newA = newA.replace(
                    v,
                    partL + node_idx.toString()+ partR
                );
                node_1[node_idx] = [
                    'log',
                    Relation_sub_LatexToTree(match[3][k], node_1, node_idx),
                    node_1[match[2][k]]
                ];
                node_idx++;
            }
        }
        //get special lv1 command 1 arg
        regex = new RegExp(
            Relation_forregex(partL) +
            "00" +
            "(" +
            cmd_special['log'] +
            "|" +
            cmd_special['ln'] +
            ")" +
            Relation_forregex(partR) +
            "((" +
            Relation_forregex(partL) +
            "([1-9][0-9]*)" +
            Relation_forregex(partR) +
            ")*)",
            'g');
        match = match_all(newA, regex);
        if (typeof match[0] != 'undefined') {    
            for (var [k, v] of match[0].entries()) {
                newA = newA.replaceAll(
                    v,
                    partL + node_idx.toString() + partR
                );
                node_1[node_idx] = [
                    match[1][k] === cmd_special['log'].toString() ? 'log' : 'ln',
                    Relation_sub_LatexToTree(match[2][k], node_1, node_idx)
                ];
                node_idx++;
            }
        }
    }
    oldA = '';
    while (oldA != newA) {
        oldA = newA;
        //get special lv2 command 3 arg
        regex = new RegExp(
            Relation_forregex(partL) +
            "0" +
            "(" +
            cmd['summ'].toString() +
            ")" +
            Relation_forregex(partR) +
            Relation_forregex(partL) +
            "([1-9][0-9]*)" +
            Relation_forregex(partR) +
            Relation_forregex(partL) +
            "([1-9][0-9]*)" +
            Relation_forregex(partR) +
            "((" +
            Relation_forregex(partL) +
            "([1-9][0-9]*)" +
            Relation_forregex(partR) +
            ")*)",
            'g');
        match = match_all(newA, regex);
        if (typeof match[0] != 'undefined') {
            for (var [k, v] of match[0].entries()) {
                newA = newA.replaceAll(
                    v,
                    partL + node_idx.partR
                );
                node_1[node_idx] = [
                    'summation',
                    node_1[match[2][k]],
                    node_1[match[3][k]],
                    Relation_sub_LatexToTree(match[4][k], node_1, node_idx)
                ];
                node_idx++;
            }
        }
    }
    //construct tree
    
    var result = Relation_sub_LatexToTree(newA, node_1, node_idx);
    
    return result;
}

//var latex = 'y=-2(x-(-1))^2+(0)';
//console.log(JSON.stringify(Relation_LatexToTree(latex), null, 4));

export function Relation_sub_LatexToTree(newA, node, node_idx) {
    var node_1 = JSON.parse(JSON.stringify(node));
    var partL = '@';
    var partR = '#';
    
    var delimeter = '\\';
    
    var cmd = {
        'pi': 1,
        'theta': 2,
        'overline': 3,
        'mfrac': 4,
        'frac': 5,
        'sqrt': 6,
        'nthroot': 7,
        'abs': 8,
        'times': 9,
        'cdot': 10,
        'div': 11,
        'neq': 12,
        'ne': 12,
        'gt': 13,
        'ge': 14,
        'lt': 15,
        'le': 16,
        'summ': 17,
        'overrightarrow': 18,
        'overleftarrow': 19,
        'overleftrightarrow': 20,
        'widearc': 41,
        'arc': 21,
        'mangle': 30,
        'angle': 31,
        'sin': 32,
        'cos': 33,
        'tan': 34,
        'varnothing': 22,
        'infty': 23,
        'pm': 24,
        'circ': 25,
        'R': 26
    };
    
    var signComma = ',';

    var signPlus = '+';
    var signMinus = '-';
    var signEquation = '=';
    var signGreaterthan = '>';
    var signLessthan = '<';
    var signRatio = ':';
    var regex = new RegExp();
    /*
    regex = new RegExp(
        Relation_forregex(partL) +
        "([1-9][0-9]*)" +
        Relation_forregex(partR),
        'g');
        */
    regex = new RegExp(
        '^' + 
        Relation_forregex(partL) +
        '([1-9][0-9]*)' +
        Relation_forregex(partR) +
        '$',
        'g');
    var match = match_all(newA, regex);
    if (typeof match[1] != 'undefined') {
        if (match[1].length === 1) {
            return node_1[match[1][0]];

        }
    }
    // array
    var arr = newA.split(signComma);
    if (arr.length > 1) {
        var result = ['array'];
        for (var v of arr)
            result.push(Relation_sub_LatexToTree(v, node_1, node_idx));
        return result;
    }
    
    // inequality
    regex = new RegExp( 
        Relation_forregex(partL) +
        "0(" +
        cmd['gt'].toString() +
        "|" +
        cmd['ge'].toString() +
        "|" +
        cmd['lt'].toString() +
        "|" +
        cmd['le'].toString() +
        ")" +
        Relation_forregex(partR) +
        " ?",
        'g');
    arr = newA.split(regex);
    if (arr.length !== 1) {
        var result = ['inequality'];
        for (var [k, v] of arr.entries()) {
            if (k % 2 === 0) {
                result.push(Relation_sub_LatexToTree(v, node_1,node_idx));
            } else {
                switch(v) {
                    case cmd['gt'].toString() :
                    result.push('gt');
                    break;
     
                    case cmd['ge'].toString() :
                    result.push('ge');
                    break;

                    case cmd['lt'].toString() :
                    result.push('lt');
                    break;

                    case cmd['le'].toString() :
                    result.push('le');
                    break;

                    default:
                    result.push(ERROR);
                }
            }
        }
        return result;
    }
    
    regex = new RegExp(
        Relation_forregex(partL) +
        "0" +
        cmd['neq'].toString() +
        Relation_forregex(partR) +
        " ?",
        'g');
    arr = newA.split(regex);
    if (arr.length !== 1) {
        var result = ['neq'];
        for (var v of arr) {
            result.push(Relation_sub_LatexToTree(v, node_1, node_idx));
        }
        return result;
    }
 
    arr = newA.split(signEquation);
    
    if (arr.length !== 1) {
        //console.log(arr);
        //console.log(JSON.stringify(node_1, null, 4));
        
        var result = ['equation'];
        for (var v of arr) {
            result.push(Relation_sub_LatexToTree(v, node_1, node_idx));
        }
        return result;
    }

    arr = newA.split(signRatio);
    if (arr.length !== 1) {
        var result = ['ratio'];
        for (var v of arr) {
            result.push(Relation_sub_LatexToTree(v, node_1, node_idx));
        }
        return result;
    } 
    
    regex = new RegExp(
        "(" +
        Relation_forregex(partL) +
        '0' +
        cmd['circ'].toString() +
        Relation_forregex(partR) +
        " ?" + 
        ")",
        'g'
    );
    arr = newA.split(regex);
    if (arr.length !== 1) {
        var result = ['composition'];
        for (var v of arr) {
            result.push(Relation_sub_LatexToTree(v, node_1, node_idx));
        }
        return result;
    }

    //addchain
    regex = new RegExp(
        "(" + 
        Relation_forregex(signPlus) +
        "|" +
        Relation_forregex(signMinus) +
        "|" +
        Relation_forregex(partL) +
        '0' +
        cmd['pm'].toString() +
        Relation_forregex(partR) +
        " ?" +
        ")",
        'g'
    );
    
    arr = newA.split(regex);
    
    if (arr.length !== 1) {
        var result = [];
        for (var i = 0; i < arr.length; i += 2) {
            
            if (i === 0 && arr[i] === '') {
            
            } else if (i === 0) {
                result.push([
                    'add',
                    Relation_sub_LatexToTree(arr[i], node_1, node_idx)
                ]);
            } else if (arr[i-1] === signPlus) {
                result.push([
                    'add',
                    Relation_sub_LatexToTree(arr[i], node_1, node_idx)
                ]);
            } else if (arr[i-1] === signMinus) {
                result.push([
                    'sub',
                    Relation_sub_LatexToTree(arr[i], node_1, node_idx)
                ]);
            } else {
                result.push([
                    'addsub',
                    Relation_sub_LatexToTree(arr[i], node_1, node_idx)
                ]);
            }
        }
        if (result.length === 1) {
            if (result[0][0] === 'add') {
                result = ['positive', result[0][1]];
            } else if (result[0][0] === 'sub') {
                result = ['negative', result[0][1]];
            } else {
                result = ['pm', result[0][1]];
            }
        } else { 
            result = ['addchain'].concat(result);
        }
        return result;
    }

    regex = new RegExp(
        Relation_forregex(partL) +
        "0(" +
        cmd['times'].toString() +
        "|" +
        cmd['div'].toString() +
        ")" +
        Relation_forregex(partR) +
        " ?",
        'g'
    );
    arr = newA.split(regex);
    if (arr.length !== 1) {
        var result = ['mulchain'];
        for (var i = 0; i < arr.length; i += 2) {
            if (i === 0) {
                result.push([
                    'mul',
                    Relation_sub_LatexToTree(arr[i], node_1, node_idx)
                ]);
            } else if (arr[i-1] === cmd['times'].toString()) {
                result.push([
                    'mul',
                     Relation_sub_LatexToTree(arr[i], node_1, node_idx)
                ]);
            } else {
                result.push([
                    'div',
                    Relation_sub_LatexToTree(arr[i], node_1, node_idx)
                ]);
            }
        }
        return result;
    }

    regex = new RegExp(
        Relation_forregex(partL) +
        "0(" +
        cmd['cdot'].toString() +
        ")" +
        Relation_forregex(partR) +
        " ?",
        'g'
    );
    arr = newA.split(regex);
    if (arr.length !== 1) {
        var result = ['mulchain'];
        for (var v of arr) {
            result.push([
                'mul',
                Relation_sub_LatexToTree(v, node_1, node_idx)
            ]);
        }
        return result;
    }

    regex = new RegExp(
        Relation_forregex(partL) +
        "([1-9][0-9]*)" +
        Relation_forregex(partR),
        'g'
    );
    match = match_all(newA, regex);
    var result = [];
    if (match[0].length > 1) {
        result = ['mulchain'];
    } else { 
        return false;
    }
    for (var v of match[1]) {
        result.push(['mul', node_1[v]]);
    }
    return result;
}

var object = {
    "type": "Relation",
    "input": true,
    "height": "short",
    "set": [
        {
            "name": {
                "type": "Static",
                "mode": "null"
            },
            "element": [
                {
                    "type": "Static",
                    "mode": "math",
                    "value": "3\\times 4"
                },
                {
                    "type": "Static",
                    "mode": "math",
                    "value": "2\\times 6"
                },
                {
                    "type": "Static",
                    "mode": "math",
                    "value": "2\\times 4"
                }
            ],
            "width": 210
        },
        {
            "name": {
                "type": "Static",
                "mode": "null"
            },
            "element": [
                {
                    "type": "Static",
                    "mode": "math",
                    "value": "4\\times 2"
                },
                {
                    "type": "Static",
                    "mode": "math",
                    "value": "4\\times 3"
                },
                {
                    "type": "Static",
                    "mode": "math",
                    "value": "6\\times 2"
                }
            ],
            "width": 210
        }
    ],
    "relation": [
        {
            "name": {
                "type": "Static",
                "mode": "null"
            },
            "value": [
                {
                    "source": 0,
                    "target": 1,
                    "color": 1,
                    "arrow": [
                        false,
                        true
                    ]
                },
                {
                    "source": 1,
                    "target": 2,
                    "color": 1,
                    "arrow": [
                        false,
                        true
                    ]
                },
                {
                    "source": 2,
                    "target": 0,
                    "color": 1,
                    "arrow": [
                        false,
                        true
                    ]
                }
            ],
            "width": 100
        }
    ],
    "option": {
        "border": true,
        "setName": false,
        "relationName": false
    }
} 