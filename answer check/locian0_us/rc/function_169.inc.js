

import {organizeAnswerObj} from '../rc/functions.js';

export function compareRelation(right = null, input = null) {
    var right_1 = JSON.parse(JSON.stringify(right));
    var input_1 = JSON.parse(JSON.stringify(input));
    if (right_1['type'] === 'Relation' && input_1['type'] === 'Relation') {
        
        
        var answer = Relation_getInfo(right_1, 'answer');
        var inswer = Relation_getInfo(input_1, 'inswer');
       
        
        if (!answer['sets']) {
            
            if (!answer['maps']) { 
                return true;
            }
            if (answer['maps'].length !== inswer['maps'].length) {
                return false;
            }
            
            for (var [k, map] of answer['maps']) {
                var imap = inswer['maps'][k];
                if (amap.length !== imap.length) {
                    return false;
                }
                for (var a of amap) {
                    for (var [ki, i] of imap.entries()) {
                        if (JSON.stringify(a) === JSON.stringify(i)) {
                            delete imap[ki];
                            break;
                        }
                    }
                }
                imap = imap.filter(Boolean);
                if (imap.length !== 0) {
                    return false;
                }
            }
        } else {
            for (var [k, amap] of answer['maps'].entries()) {
                var a = [];
                
                for (var map of amap) {
                    if (answer['sets'].length != 0) {
                        a.push([answer['sets'][k][map[0]], answer['sets'][k+1][map[1]]]);
                    }
                }
                var i = [];
                for (var map of inswer['maps'][k]) {
                    if (inswer['sets'].length != 0) {
                        i.push([inswer['sets'][k][map[0]], inswer['sets'][k+1][map[1]]]);
                    }
                }
                
                if (a.length !== i.length) { 
                    return false;
                }

                for (var [ka, as] of a.entries()) {
                    for (var [ki, is] of i.entries()) {
                        
                        if (typeof a[ka] != 'undefined' && typeof i[ki] != 'undefined'&&Relation_compSet(as[0], is[0]) && Relation_compSet(as[1], is[1])) {
                                
                            delete a[ka];
                            delete i[ki];
                            break;
                        }
                    }
                }
                a = a.filter(Boolean);
                i = i.filter(Boolean);
            
                if (a.length !== 0 || i.length !== 0) {
                    return false;
                }
            }
        }
            
        return true;
    }

    return false;
}

export function Relation_getAnswer(object, answer, checktypeDefault) {
    var object_1 = JSON.parse(JSON.stringify(object));
    if (typeof object_1['sets'] != 'undefined') { // classic sinod
        for (var eachSet of object_1['sets']) {
            for (var set of eachSet['elements']) {
                organizeAnswerObj(set, answer, checktypeDefault);
                
            }
        }
    } else { // old sinod
        for (var eachSet of object_1['set']) {
            for (var set of eachSet['element']) {
                organizeAnswerObj(set, answer, checktypeDefault);
                
            }
        }
    }
    
    return object_1;
}

export function Relation_getInfo(relation, type) {
    var relation_1 = JSON.parse(JSON.stringify(relation));
    var sets = [];
    var maps = [];
    
    if (type === 'answer') {
        if (typeof relation_1['locianOptions'] != 'undefined' &&
            typeof relation_1['locianOptions']['answer'] != 'undefined' &&
            typeof relation_1['locianOptions']['answer']['elements'] != 'undefined') { 
            for (var [kSet, eachSet] of relation_1['locianOptions']['answer']['elements'].entries()) {
                var elements = [];
                for (var set of eachSet) {
                    if (set['type'] === 'MathInput') {
                        elements.push({
                            'type': 'math', 
                            'content': set['content']
                        });
                    } else {
                        elements.push({
                            'type': 'text', 
                            'content': relation_1['sets'][kSet]['elements'][ke]['content']
                        });
                    }
                }
                sets.push(elements);
            }
        } else if (typeof relation_1['set'] != 'undefined') { // old sinod
            for (var [kSet, eachSet] of relation_1['set'].entries()) {
                var elements = [];
                for (var set of eachSet['element']) {
                    if (set['type'] === 'Input') {
                        elements.push({
                            'type': 'math', 
                            'content': set['value']
                        });
                    }
                }
                if (elements) {
                    sets.push(elements);
                }
            }
        }
        
        if (typeof relation_1['locianOptions'] != 'undefined' &&
            typeof relation_1['locianOptions']['answer'] != 'undefined' &&
            typeof relation_1['locianOptions']['answer']['data'] != 'undefined') {
            for (var eachMap of relation_1['locianOptions']['answer']['data']) {
                var data = [];
                for (var map of eachMap) {
                    data.push(
                        [
                            map['source'], 
                            map['target']
                        ]
                    );
                }
                maps.push(data);
            }
        } else if (typeof relation_1['relation'] != 'undefined') { // old sinod
            for (var eachMap of relation_1['relation']) {
                var data = [];
                for (var map of eachMap['value']) {
                    data.push(
                        [
                            map['source'], 
                            map['target']
                        ]
                    );
                }
                maps.push(data);
            }
        }
    } else {
        
        if (typeof relation_1['sets'] != 'undefined') {
            for (var eachSet of relation_1['sets']) {
                var elements = [];
                for (var set of eachSet['elements']) {
                    if (set['type'] === 'MathInput') {
                        elements.push(
                            {
                                'type': 'math', 
                                'content': set['answer']
                            }
                        );
                    } else {
                        elements.push(
                            {
                                'type': 'text', 
                                'content': set['content']
                            }
                        );
                    }
                }
                sets.push(elements);
            }
            for (var eachMap of relation_1['maps']) {
                var data = [];
                for (var map of eachMap['data']) {
                    data.push(
                        [
                            map['source'], 
                            map['target']
                        ]
                    );
                }
                maps.push(data);
            }
        } else { // old sinod
            for (var [kSet, eachSet] of relation_1['set'].entries()) {
                var elements = [];
                for (var [ke, set] of eachSet['element'].entries()) {
                    if (set['type'] === 'Input') {
                        elements.push(
                            {
                                'type': 'math', 
                                'content': set['value']
                            }
                        );
                    }
                }
                if (elements) {
                    sets.push(elements);
                }
            }
            for (var eachMap of relation_1['relation']) {
                var data = [];
                for (var map of eachMap['value']) {
                    data.push(
                        [
                            map['source'], 
                            map['target']
                        ]
                    );
                }
                maps.push(data);
            }
        }
    }
    
    
    return {
        'sets': sets,
        'maps': maps
    };
}




// maybe need to add whitelist one day
export function Relation_compSet(aset, iset) {
    var aset_1 = JSON.parse(JSON.stringify(aset));
    var iset_1 = JSON.parse(JSON.stringify(iset));
    if (aset_1['type'] === iset_1['type']) {
        if (aset_1['type'] === 'text') {
            return JSON.stringify(aset_1['content']) === JSON.stringify(iset_1['content']);
        } else {  // here
            if (JSON.stringify(aset_1['content']) === JSON.stringify(iset_1['content'])) {
                return true;
            } else {
                var atree = Relation_getTree(aset_1['content']);
                var itree = Relation_getTree(iset_1['content']);
                return Relation_compTree(atree, itree);
            }
        }
    } else {
        return false;
    }
}

import {Laco} from '../libs/common.inc.js';
import {mulAssociative} from '../rc/function_1.inc.js';
import {addAssociative} from '../rc/function_2.inc.js';
import {fracExpress} from '../rc/function_5.inc.js';
import {fracDecimal} from '../rc/function_6.inc.js';
import {fracMfrac} from '../rc/function_9.inc.js';
import {fracNegative} from '../rc/function_10.inc.js';
import {fracSeparation} from '../rc/function_11.inc.js';
import {eqIdentity} from '../rc/function_22.inc.js';
import {allIdentity, allCommutative, fracSimp} from '../rc/function_24.inc.js';
import {fracComplex} from '../rc/function_26.inc.js';
import {addNegative} from '../rc/function_28.inc.js';
import {eqMulNeg} from '../rc/function_30.inc.js';
import {eqMulProp} from '../rc/function_32.inc.js';
import {rdecToFrac} from '../rc/function_35.inc.js';
import {addFactorNegative} from '../rc/function_38.inc.js';
import {intervalSetNot} from '../rc/function_41.inc.js';
import {ineqSetNot} from '../rc/function_42.inc.js';
import {fracPlusMinus} from '../rc/function_129.inc.js';
import {makeOneSideOfEqIneqZero} from '../rc/function_131.inc.js';
import {groupLikeVariableTerms} from '../rc/function_132.inc.js';
import {exprSimpConst} from '../rc/function_133.inc.js';
import {mulAllSidesByCommonDenom} from '../rc/function_134.inc.js';
import {fracCombine} from '../rc/function_136.inc.js';
import {mulNegative} from '../rc/function_137.inc.js';
import {ineqMulNeg} from '../rc/function_138.inc.js';
import {evaluateEx_new} from '../rc/function_140.inc.js';

export function Relation_getTree(string, checktype = null, lacoType = null) {
    var string_1 = JSON.parse(JSON.stringify(string));
    var tree;
    if (!Array.isArray(string_1)) {
        var laco = new Laco();
        tree = laco.parse(string_1);
    } else {
        tree = string_1;
    }
    if (checktype === 'same' || lacoType === '6') {
        return divFrac(tree);
    } else if (checktype === 'equi' || lacoType === '7') {
        // copy and paste from Evaluate of Preset
        var laco = new Laco();
        laco.getInstance();
        laco.setTree(tree);
        laco.apply(intervalSetNot);
        laco.apply(fracDecimal);
        laco.apply(rdecToFrac);
        laco.apply(fracMfrac);
        laco.apply(fracExpress);
        laco.apply(fracCombine);
        laco.apply(fracComplex);
        laco.apply(exprSimpConst);
        laco.apply(makeOneSideOfEqIneqZero);        
        laco.apply(addNegative);
        laco.apply(groupLikeVariableTerms);
        laco.apply(exprSimpConst);
        laco.apply(fracNegative);
        laco.apply(fracPlusMinus);
        laco.apply(mulAllSidesByCommonDenom);
        laco.apply(mulAssociative);
        laco.apply(fracSimp);
        laco.apply(eqMulProp);
        laco.apply(mulNegative);
        laco.apply(fracSeparation);
        laco.apply(addAssociative);
        laco.apply(addNegative);
        laco.apply(fracComplex);
        laco.apply(fracNegative);
        laco.apply(fracSimp);
        laco.apply(allCommutative);
        laco.apply(addFactorNegative);
        laco.apply(eqIdentity); 
        laco.apply(eqMulNeg);
        laco.apply(ineqMulNeg);
        laco.apply(allIdentity);
        laco.apply(ineqSetNot, ['anything', 'x']);
        laco.apply(evaluateEx_new)
        tree = laco.getTree();
        return tree;
    } else {
        return Relation_getTree(string, 'equi');
    }
}

// copy and paste from checkmath.php
export function Relation_compTree(treeA, treeB) {
    var treeA_1 = JSON.parse(JSON.stringify(treeA));
    var treeB_1 = JSON.parse(JSON.stringify(treeB));
    //console.log(JSON.stringify(treeA_1, null, 4));
    //console.log(JSON.stringify(treeB_1, null, 4));
    if (typeof treeA_1 !== typeof treeB_1) {
        return false;
    } else if (!Array.isArray(treeA_1)) { 
        if (JSON.stringify(treeA_1) == JSON.stringify(treeB_1)) {
            return true;
        } else { 
            return false;
        }
    }

    if (treeA_1[0] == 'anything') {
        treeA_1 = treeB_1;
    } else if (treeB_1[0] == 'anything') {
        treeB_1 = treeA_1;
    }
    
    
    
    if (JSON.stringify(treeA_1[0]) === JSON.stringify(treeB_1[0]) && 
        treeA_1.length === treeB_1.length) {    
        if (treeA_1[0] === 'eval') { 
            /*
            console.log(treeA_1);
            console.log(treeB_1);
            console.log('..........');
            */
            var result = true;
            var num_nullResult = 0;
            for (var [k, v] of treeA_1.entries()) {
                if (k === 0) {
                    continue;
                }
                if (v === null && treeB_1[k] === null) {
                    num_nullResult++;
                    continue;
                }
                var AReSci;
                var BReSci;
                var AImSci;
                var BImSci;
                if (v[0] == 'equation') {
                    AReSci = (v[1][0] - v[2][0]).toExponential(4);
                    BReSci = (treeB_1[k][1][0] - treeB_1[k][2][0]).toExponential(4);
                    AImSci = (v[1][1] - v[2][1]).toExponential(4);
                    BImSci = (treeB_1[k][1][1] - treeB_1[k][2][1]).toExponential(4);

                    if (parseFloat(AReSci) == -1 * parseFloat(BReSci) && parseFloat(AImSci) == -1 * parseFloat(BImSci)) {
                        BReSci = AReSci;
                        BImSci = AImSci;
                    }

                } else {
                    AReSci = v[0].toExponential(4);
                    BReSci = treeB_1[k][0].toExponential(4);
                    AImSci = v[1].toExponential(4);
                    BImSci = treeB_1[k][1].toExponential(4);
                }
                /*
                console.log(AReSci);
                console.log(BReSci);
                console.log(AImSci);
                console.log(BImSci);
                console.log('.........');
                */
                if (AReSci === BReSci && AImSci  === BImSci) {

                } else {
                    result = false;
                }
            }
            if (num_nullResult === 4) {
                result = false;
            }
            
            return result;
        } else if (treeA_1.length === 1) { 
            return true;
        } else {  
            treeA_1 = treeA_1.slice(1);
            treeB_1 = treeB_1.slice(1);
            for (var [k, v] of treeA_1.entries()) {
                if (Relation_compTree(v,treeB_1[k])) {

                } else {
                    return false;
                }
            }
        }
    } else {
       
        return false;
    }
    
    return true;
}

var object = {
    "type": "Relation",
    "sets": [
        {
            "type": "RelationSet",
            "border": {
                "top": {
                    "color": {
                        "weight": "translucentHard"
                    },
                    "width": 2
                },
                "bottom": {
                    "color": {
                        "weight": "translucentHard"
                    },
                    "width": 2
                },
                "right": {
                    "color": {
                        "weight": "translucentHard"
                    },
                    "width": 2
                },
                "left": {
                    "color": {
                        "weight": "translucentHard"
                    },
                    "width": 2
                },
                "radius": {
                    "topLeft": 1.5,
                    "topRight": 1.5,
                    "bottomRight": 1.5,
                    "bottomLeft": 1.5
                }
            },
            "align": {
                "hor": "right"
            },
            "elements": [
                {
                    "type": "Math",
                    "content": "4\\times 9",
                    "wrap": false,
                    "whiteSpaces": true
                },
                {
                    "type": "Math",
                    "content": "7\\times 6",
                    "wrap": false,
                    "whiteSpaces": true
                },
                {
                    "type": "Math",
                    "content": "3\\times 5",
                    "wrap": false,
                    "whiteSpaces": true
                },
                {
                    "type": "Math",
                    "content": "0\\times 6",
                    "wrap": false,
                    "whiteSpaces": true
                }
            ],
            "label": {
                "type": "Blank"
            }
        },
        {
            "type": "RelationSet",
            "border": {
                "top": {
                    "color": {
                        "weight": "translucentHard"
                    },
                    "width": 2
                },
                "bottom": {
                    "color": {
                        "weight": "translucentHard"
                    },
                    "width": 2
                },
                "right": {
                    "color": {
                        "weight": "translucentHard"
                    },
                    "width": 2
                },
                "left": {
                    "color": {
                        "weight": "translucentHard"
                    },
                    "width": 2
                },
                "radius": {
                    "topLeft": 1.5,
                    "topRight": 1.5,
                    "bottomRight": 1.5,
                    "bottomLeft": 1.5
                }
            },
            "align": {
                "hor": "left"
            },
            "elements": [
                {
                    "type": "Math",
                    "content": "6\\times 7",
                    "wrap": false,
                    "whiteSpaces": true
                },
                {
                    "type": "Math",
                    "content": "9\\times 4",
                    "wrap": false,
                    "whiteSpaces": true
                },
                {
                    "type": "Math",
                    "content": "6\\times 0",
                    "wrap": false,
                    "whiteSpaces": true
                },
                {
                    "type": "Math",
                    "content": "5\\times 3",
                    "wrap": false,
                    "whiteSpaces": true
                }
            ],
            "label": {
                "type": "Blank"
            }
        }
    ],
    "maps": [
        {
            "type": "RelationMap",
            "data": [
            
            ],
            "interaction": true,
            "arrow": true,
            "source": {
                "offset": 0.1,
                "size": 0.2,
                "color": {
                    "code": 0,
                    "weight": "opaqueHard"
                },
                "fillColor": {
                    "weight": "opaqueHard"
                }
            },
            "target": {
                "offset": 0.1,
                "size": 0.2,
                "color": {
                    "weight": "opaqueHard"
                },
                "fillColor": {
                    "code": 0,
                    "weight": "opaqueHard"
                }
            },
            "color": {
                "code": 0,
                "weight": "opaqueHard"
            },
            "label": {
                "type": "Blank"
            }
        }
    ],
    "locianOptions": {
        "answer": {
            "data": [
                [
                    {
                        "source": 0,
                        "target": 1
                    },
                    {
                        "source": 1,
                        "target": 0
                    },
                    {
                        "source": 2,
                        "target": 3
                    },
                    {
                        "source": 3,
                        "target": 2
                    }
                ]
            ]
        }
    }
}