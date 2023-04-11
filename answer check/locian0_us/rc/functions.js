



import {Laco} from '../libs/common.inc.js';

/*****************************************
func:   organizeAnswerObj
role:	gather all answer objects from SINOD array, group them by type.
input:	<array-SINOD> answer part of a problem.
		<* array> array that answer objects are stored by type.
output:
*****************************************/

export function organizeAnswerObj(object, answer, checktypeDefault = null) {
    var object_1 = JSON.parse(JSON.stringify(object));
   
    var laco = new Laco();
    var lacoSinod = laco.getSinod();

	if (Array.isArray(object_1) && typeof object_1['type'] != 'undefined') {
        if ([...lacoSinod.keys()].includes(object_1['type'])) {
            var o = lacoSinod[object_1['type']][1](object_1, answer, checktypeDefault);
            if (o) {
                //fb([object_1, o], 'Laco Sinod Get - '.object_1['type']);
                answer[object_1['type']].push(o);
            }

        } else {
            switch(object_1['type']) {
                case 'Static':
                    return 0;

                case 'Chart':
                    if (typeof object_1['answer'] != 'undefined') {
                        for (var a of object_1['answer']) {
                            answer['ChartGraph'].push(a);
                        }
                    } else {
                        organizeAnswerObj(object_1['elements'], answer, checktypeDefault);
                    }
                    organizeAnswerObj(object_1['grid'], answer, checktypeDefault);
                    return;

                case 'GridChart':
                    organizeAnswerObj(object_1['labels']['x']['values'], answer, checktypeDefault);
                    organizeAnswerObj(object_1['labels']['y']['values'], answer, checktypeDefault);
                    organizeAnswerObj(object_1['labels']['x']['customLabel'], answer, checktypeDefault);
                    organizeAnswerObj(object_1['labels']['y']['customLabel'], answer, checktypeDefault);
                    return;

                case 'Dropzone':
                    //fb(object_1['locianOptions'], 'loption');
                    if (object_1['locianOptions']['check']) {
                        if (typeof object_1['answer'] != 'undefined') {
                            var temp = [];
                            for (var e of object_1['answer']) {
                                temp.push(e);
                            }
                            answer[object_1['type']].push(temp);
                            answer['DropzoneSet'].push(object_1['answerSet']);
                        } else {
                            var temp = [];
                            for (var e of object_1['elements']) {
                                temp.push(e['elements'][0]);
                            }
                            answer[object_1['type']].push(temp);
                        }
                    }
                    //fb(object, answer['Dropzone']);
                    return;

                case 'ChartGraph':
                    for (var d of object_1['data']) {
                        answer[object_1['type']].push(d);
                    }
                    return;

                case 'Clock':
                    if (typeof object_1['answer'] != 'undefined') {
                        var temp = [];
                        for (var [k, m] of object_1['menu'].entries()) {
                            if (['hour', 'minute', 'second'].includes(m)) {
                                temp.push(object_1['answer'][k]);
                            }
                        }
                        answer[object_1['type']].push(temp);
                    } else {
                        var temp = [];
                        for (var [k, m] of object_1['menu'].entries()) {
                            if (['hour', 'minute', 'second'].includes(m)) {
                                temp.push(object_1[m]);
                            }
                        }
                        answer[object_1['type']].push(temp);
                    }
                    return;

                case 'MultipleChoice':
                    var tempanswer = Array.isArray(object_1['answer']) ? ![null, undefined, 0, '', '0'].includes(object_1['answer']) ? object_1['answer'] : [-1] : object_1['answer'];
                    answer[object_1['type']].push(tempanswer);
                    for (var ta of tempanswer) {
                        organizeAnswerObj(object_1['choices'][ta], answer, checktypeDefault);
                    }
                    //fb(object_1, answer[object_1['type']]);
                    return;

                case 'SingleChoice':
                    var tempanswer = Array.isArray(object_1['answer']) ? typeof object_1['answer'][0] != 'undefined' ? object['answer'][0] : -1 : object['answer'];
                    answer[object_1['type']].push(tempanswer);
                    organizeAnswerObj(object_1['choices'][tempanswer], answer, checktypeDefault);
                    //fb(object_1, answer[object_1['type']]);
                    return;

                case 'SelectBox':
                    if (object_1['multiple']) {
                        answer[object_1['type']].push(
                            Array.isArray(object_1['answer']) ? ![null, undefined, 0, '', '0'].includes(object_1['answer']) ? object_1['answer'] : [-1] : object_1['answer']
                        );
                        //fb(object, answer[object['type']]);
                    } else {
                        answer[object_1['type']].push(
                            Array.isArray(object_1['answer']) ? typeof object_1['answer'][0] != 'undefined' ? object_1['answer'][0] : -1 : object_1['answer']
                        );
                        //fb(object, answer[object['type']]);
                    }
                    return;

                case 'Block':
                case 'Span':
                case 'Tree':
                case 'Grid':
                    organizeAnswerObj(object_1['value'],answer,checktypeDefault);
                    return 0;

                case 'Cases':
                    organizeAnswerObj(object_1['cases'], answer, checktypeDefault);
                    organizeAnswerObj(object_1['conditions'], answer, checktypeDefault);
                    return;

                case 'Box':
                case 'TitleBox':
                case 'TableCellBox':
                    organizeAnswerObj(object_1['elements'], answer, checktypeDefault);
                    return 0;

                case 'Table':
                    organizeAnswerObj(object_1['cells'], answer, checktypeDefault);
                    return 0;
                
                case 'Lattice':
                    if (object_1['value'][0][0]['object']['type'] === 'Select') {
                        _organizeAnswerObjFromSelectInLattice(object_1, answer, checktypeDefault);
                    } else if(object_1['value'][0][0]['type'] === 'Select')
                        _organizeAnswerObjFromSelectInLattice(object_1, answer, checktypeDefault);
                    else
                        organizeAnswerObj(object_1['value'], answer, checktypeDefault);
                    return 0;

                case 'Layer':
                    if (typeof object_1['elements'] != 'undefined') {
                        organizeAnswerObj(object_1['elements'], answer, checktypeDefault);
                    }   
                case 'Directional':
                    organizeAnswerObj(object_1['source'], answer, checktypeDefault);
                    organizeAnswerObj(object_1['target'], answer, checktypeDefault);
                    return 0;

                case 'MathInput':
                    //fb('mathinput');
                    if (typeof object_1['content'] != 'undefined') {
                        object_1['value'] = object_1['content'];
                    }
                    if (typeof object_1['answer'] != 'undefined') {
                        object_1['value'] = object_1['answer'];
                    }
                    if (typeof object_1['locianOptions'] != 'undefined') {
                        object_1['option'] = object_1['locianOptions'];
                    }
                    object_1['mode'] = 'math';

                case 'Input':
                    var order;
                    if (typeof object_1['option']['order'] != 'undefined') {
                        order = object_1['option']['order'];
                    } else if (typeof object_1['order'] != 'undefined') {
                        order = object_1['order'];
                    } else {
                        order = '0';
                    }

                    var objArray = {
                        'value': object_1['value'], 
                        'order': order
                    };

                    if (checktypeDefault !== null) {
                        if (typeof object_1['option']['checktype'] != 'undefined') {
                            objArray['checktype'] = object_1['option']['checktype'];    
                        } else if (typeof object_1['option']['answerType'] != 'undefined') { // 150322   larwein - post_process    
                            switch(object_1['option']['answerType']) {
                                case 99: 
                                    objArray['checktype'] = ['single', 'eq', 'simp', 'same', 0]; 
                                    break;
                                case 88: 
                                    objArray['checktype'] = ['single', 'ex', 'simp', 'simp', 0]; 
                                    break;
                                case 89: 
                                    objArray['checktype'] = ['single', 'ex', 'simp', 'simp', 0]; 
                                    break;
                                case 84: 
                                    objArray['checktype'] = ['single', 'ex', 'simp', 'simp', 30720]; 
                                    break;
                                case 87: 
                                    objArray['checktype'] = ['single', 'ex', 'simp', 'simp', 32]; 
                                    break;
                                case 85: 
                                    objArray['checktype'] = ['single', 'eq', 'simp', 'simp', 0]; 
                                    break;
                                case 86: 
                                    objArray['checktype'] = ['single', 'ex', 'fact', 'simp', 0]; 
                                    break;
                                default: 
                                    objArray['checktype'] = ['single', 'eqeq', 'simp', 'simp', 0]; 
                                    break;
                            }
                        } else {
                            objArray['checktype'] = checktypeDefault[object_1['mode']];
                        }

                    }

                    // 160531 larwein - laco
                    if (typeof object_1['option']['lacoType'] != 'undefined' && object_1['option']['lacoType']) {
                        objArray['checktype'] = ['laco', object_1['option']['lacoType']];
                    }
                    // 160617 larwein - whitelist
                    if (typeof object_1['option']['whitelist'] != 'undefined') {
                        objArray['whitelist'] = object_1['option']['whitelist'];
                    }

                    // 200805 larwein - white and black should be divided
                    if (typeof object_1['option']['blacklist'] != 'undefined') {
                        objArray['blacklist'] = object_1['option']['blacklist'];
                    }

                    answer[object_1['mode']].push(objArray);
                        
                    return 0;

                case 'Partial':
                    if (typeof object_1['elements']) {
                        organizeAnswerObj(object_1['elements'], answer, checktypeDefault);
                    } else {
                        organizeAnswerObj(object_1['object'], answer, checktypeDefault);
                    }
                    return 0;

                case 'Select':
                    if (typeof object_1['option']['order']) {
                        order = object_1['option']['order'];
                    }
                    if (typeof object_1['order'] != 'undefined') {
                        order = object_1['order'];
                    } else {
                        order = '0';
                    }
                    answer['select'].push(
                        {
                            'value': object_1['value'], 
                            'order': order
                        }
                    );
                    for (var v of object_1['value']) {
                        organizeAnswerObj(object_1['option'][v]);
                    }
                    return 0;

                case 'Relation':
                    _organizeAnswerObjFromRelation(object_1);
                    var objArray = {
                        'value': _organizeAnswerObjFromRelation(object_1)
                    };
                    if (typeof object_1['option']['order']) {
                        objArray['order'] = object_1['option']['order'];
                    }
                    if (typeof object_1['order'] != 'undefined') {
                        objArray['order'] = object_1['order'];
                    } else {
                        objArray['order'] = '0';
                    }
                    if (checktypeDefault != null) {
                        if (typeof object_1['option']['checktype'] != 'undefined') {
                            objArray['checktype'] = object_1['option']['checktype'];
                        } else {
                            objArray['checktype'] = checktypeDefault['relation'];
                        }
                    }        
                    answer['relation'].push(objArray);
                    return 0;


                case 'NumberLine':
                    if (false === object_1['checkFlag']) {
                        return 0;
                    }
                    var objArray = {
                        'value': _organizeAnswerObjFromNumberLine(object)
                    };
                    objArray['order'] = '0';
                    if (checktypeDefault != null) {
                        if (typeof object_1['option']['checktype'] != 'undefined') {
                            objArray['checktype'] = object_1['option']['checktype'];
                        } else {
                            objArray['checktype'] = checktypeDefault['cart2d'];
                        }
                    }

                    answer['cart2d'].push(objArray);
                    return 0;

                
                case 'CoordPlane':
                    if (false === object_1['checkFlag']) {
                        return 0;
                    }
                    var objArray = {
                        'value': _organizeAnswerObjFromCoordPlane(object_1)
                    };
                    objArray['order'] = 0;
                    answer['cart2d'].push(objArray);
                    return 0;
                    

                case 'MultiRegion2D':
                    organizeAnswerObj(object_1['regions'], answer, checktypeDefault);

                case 'Partition1D':
                case 'Point2D':
                case 'Region2D':
                    if (object_1['locianOptions']['check']) {
                        answer[object_1['type']].push(object_1);
                    }
                    return 0;

                case 'Curve2D':
                    if (
                        object_1['locianOptions']['check'] && 
                        object_1['equation'].indexOf('Math.sin') == -1 &&
                        object_1['equation'].indexOf('Math.cos') == -1 &&
                        object_1['equation'].indexOf('Math.tan') == -1
                    ) {
                        answer[object_1['type']].push(object_1);
                    }
                    return 0;

                case 'Cartesian1D':
                    organizeAnswerObj(object_1['elements'], answer, checktypeDefault);
                    return 0;

                case 'Cartesian2D':
                    // new Sinod Cartesian2D
                    if ('Grid2D' == object_1['grid']['type']) {
                        organizeAnswerObj(object_1['elements'], answer, checktypeDefault);
                        if (object_1['locianOptions']['elementsAdded']) {
                            answer[object_1['type']].push(
                                {
                                    'elements': object_1['elements'] ? object_1['elements'] : [],
                                    'answers': object_1['locianOptions']['elementsAdded']
                                }
                            );
                        }
                        break;
                    }

                    if (false === object_1['checkFlag']) {
                        return 0;
                    }
                    var objArray = {
                        'value': _organizeAnswerObjFromCartesian2D(object_1)
                    };

                    if (typeof object_1['option']['order'] != 'undefined') {
                        objArray['order'] = object_1['option']['order'];
                    }
                    if (typeof object_1['order'] != 'undefined') {
                        objArray['order'] = object_1['order'];
                    } else {
                        objArray['order'] = '0';
                    }

                    if (checktypeDefault != null) {
                        if (typeof object_1['option']['checktype'] != 'undefined') {
                            objArray['checktype'] = object_1['option']['checktype'];
                        } else {
                            objArray['checktype'] = checktypeDefault['cart2d'];
                        }
                    }        

                    answer['cart2d'].push(objArray);
                    return 0;

                    
                case 'Geometry2D':
                    var objArray = {
                        'value': _organizeAnswerObjFromGeometry2DSelect(object_1)
                    };
                    
                    if (typeof object_1['option']['order'] != 'undefined') {
                        objArray['order'] = object_1['option']['order'];
                    }
                    if (typeof object_1['order'] != 'undefined') {
                        objArray['order'] = object_1['order'];
                    } else {
                        objArray['order'] = '0';
                    }
                    answer['geo2dselect'].push(objArray);
                    return 0;

                default:
                    return 0;
            }
        }
	} else if (Array.isArray(object_1)) {
		for (var item of object_1) {
			organizeAnswerObj(item, answer, checktypeDefault);
        }
		return 0;
	} else {
		return 0;
    }
}

function _organizeAnswerObjFromGeometry2DSelect(geoObject) {
    var geoObject_1 = JSON.parse(JSON.stringify(geoObject));

    if (Array.isArray(geoObject_1) && geoObject_1['type'] === 'Geometry2D') {
    
    } else {
        return false;
    }
    var selected = [];
    for (var [k, eachGeoObject] of geoObject_1['object'].entries()) {
        if (typeof eachGeoObject['selectable'] != 'undefined'&& 
            eachGeoObject['selectable']) {
            if (typeof eachGeoObject['selectedAnswer'] != 'undefined') {
                if (eachGeoObject['selectedAnswer']) {
                    selected.push(k);
                }
            } else {
                if (eachGeoObject['selected']) {
                    selected.push(k);
                }
            }
        }
    }
    return selected;
}

function _organizeAnswerObjFromRelation(relationObject) {
    
    var relationObject_1 = JSON.parse(JSON.stringify(relationObject));
    if (Array.isArray(relationObject_1) && relationObject_1['type'] === 'Relation') {

    } else {
        return false;
    }


    var elementSets = [];
    for (var eachSetObject of relationObject_1['set']) {
        var eachElementSet = [];
        for (var [k, elementObject] of eachSetObject['element'].entries()) {
            if (elementObject['type'] === 'Input') {
                eachElementSet.push(
                    {
                        'type': elementObject['mode'],
                        'value': elementObject['value'],
                        'index': k
                    }
                );
            }
        }
        elementSets.push(eachElementSet);
    }

    var arrowSets = [];
    for (var eachRelationObject of relationObject_1['relation']) {
        var eachArrowSet = [];
        for (var arrowObject of eachRelationObject['value']) {
            eachArrowSet.push(
                [
                    arrowObject['source'],
                    arrowObject['target']
                ]
            );
        }
        arrowSets.push(eachArrowSet);
    }

    return {
        'set': elementSets,
        'arrow': arrowSets
    };
}

function _organizeAnswerObjFromNumberLine(nlineObject) {
    var nlineObject_1 = JSON.parse(JSON.stringify(nlineObject));
	if (Array.isArray(nlineObject_1) && nlineObject_1['type'] === 'NumberLine') {

    } else {
        return false;
    }

	var objs = [];
    
    for_1:
    for (var item of nlineObject_1['object']) {
        var object = new Object();
        switch(item['type']) {
            case 'Input:Point':
                var object = {
                    "type": "point",
                    "value": [item["coord"], 0],
                    "isFill": true
                };
                break;

            case 'Input:InEq':
                var lineEq;
                if (item['sign']) {
                    lineEq = 'y=x+(' + item['coord'] + ')';
                } else {
                    lineEq = 'y=-x+(' + item['coord'] + ')';
                }
                var eqn = [
                    {
                        "type": "ineq",
                        "value": lineEq,
                        "dash": item['pointFill']
                    }
                ];
                object = {
                    "type": "region",
                    "eqn": eqn,
                    "dataFill": [[item['sign']]]
                };
                break;

            case 'Input:CompInEq':
                var eqn = [];
                if (item['object'][0]['type'] === 'InEq') {
                    for (var [k, ineq] of item['object'].entries()) {
                        eqn.push(
                            {
                                "type": "ineq",
                                "value": 'y=x+'.k,
                                "dash": true
                            }
                        );
                    }
                } else {
                    for (var ineq of item['object']) {
                        var lineEq;
                        if (ineq['sign']) {
                            lineEq = 'y=x+(' + ineq['coord'] + ')';
                        } else {
                            lineEq = 'y=-x+(' + ineq['coord'] + ')';
                        }
                        eqn.push(
                            {
                                "type": "ineq",
                                "value": lineEq,
                                "dash": ineq['pointFill']
                            }
                        );
                    }
                }
                object = {
                    "type": "region",
                    "eqn": eqn,
                    "dataFill": item['dataFill']
                };
                break;

            default:
                continue for_1;
        }
        if (object['type'] !== 'point') {
            object["bounded"] = null;
            object["endPoints"] = null;
        }
        objs.push(object);
    }
	return {
		'textbox': [],
		'mathbox': [],
		'objs': objs
    };

}


function _organizeAnswerObjFromCoordPlane(cplaneObject) {
    var cplaneObject_1 = JSON.parse(JSON.stringify(cplaneObject));
	if (Array.isArray(cplaneObject_1) && cplaneObject_1['type'] === 'CoordPlane') {

    } else {
        return false;
    }

	var objs = [];
    var object = new Object();
    for_1:
    for (var item of cplaneObject_1['object']) {
        switch(item['type']) {
            case 'Input:Point':
                object = {
                    "type": "point",
                    "value": item["coord"],
                    "isFill": item["isFill"]
                };
                break;

            case 'Input:LineCurve':
                object = {
                    "type": "lineCurve",
                    "value": typeof item["coords"] != 'undefined' ? item["coords"] : JStoLatex(item["eqn"]),
                    "isfill": true,
                    "bounded": false
                };
                break;

            case 'Input:QuadCurve':
                object = {
                    "type": "quadCurve",
                    "value": typeof item["coords"] != 'undefinded' ? item["coords"] : JStoLatex(item["eqn"]),
                    "isfill": true,
                    "bounded": false
                };
                break;

            case 'Input:ExpoCurve':
                object = {
                    "type": "expoCurve",
                    "value": typeof item["coords"] != 'undefined' ? item["coords"] : JStoLatex(item["eqn"]),
                    "isfill": true,
                    "bounded": false
                };
                break;

            case 'Input:SqrtCurve':
                object = {
                    "type": "sqrtCurve",
                    "value": typeof item["coords"] != 'undefined' ? item["coords"] : JStoLatex(item["eqn"]),
                    "isfill": true,
                    "bounded": false
                };
                break;

            case 'Input:ReciCurve':
                object = {
                    "type": "reciCurve",
                    "value": typeof item["coords"] != 'undefined' ? item["coords"] : JStoLatex(item["eqn"]),
                    "isfill": true,
                    "bounded": false
                };
                break;
                /*
                case 'Input:Region':
                object = [
                ];
                break;
                */
                default:
                    continue for_1;
        }
        object["bounded"] = null;
        object["endPoints"] = null;
        objs.push(object);
    }
	return {
		'textbox': [],
		'mathbox': [],
		'objs': objs
    };
}

function _organizeAnswerObjFromCartesian2D(cartObject) {
    var cartObject_1 = JSON.parse(JSON.stringify(cartObject));
	if (Array.isArray(cartObject_1) && cartObject_1['type'] === 'Cartesian2D') {

    } else {
        return false;
    }
	var objs = [];

	var minX = cartObject_1['bound'][0][0];
	var maxX = cartObject['bound'][0][1];

    for_1:
	for (var item of cartObject_1['object']) {
        if (item['type'] === 'Regio') {
            var eqn = [];
            for (var [k, v] of item['eqn'].entries()) {
                switch(v['type']) {
                    case 'Curve':
                        type = 'curve';
                        break;

                    case 'Input:LineCurve':
                        type = 'lineCurve';
                        break;

                    case 'Input:QuadCurve':
                        type = 'quadCurve';
                        break;
                }
                eqn.push(
                    {
                        "type": type,
                        "value": JStoLatex(v["eqn"]),
                        "dash": v['dash']
                    }
                );
            }
			objs.push(
                {
				    "type": "region",
				    "eqn": eqn,
                    "dataFill": item['dataFill']
                }
            );
            continue;
        } else if (item['type'] === 'Input:Region' || 
            item['type'] === 'Input:Regio') {
            var eqn = [];
            for (var [k, v] of item['eqn'].entries()) {
                var type;
                switch(v['type']) {
                    case 'Curve':
                        type = 'curve';
                        break;

                    case 'Input:LineCurve':
                        type = 'lineCurve';
                        break;

                    case 'Input:QuadCurve':
                        type = 'quadCurve';
                        break;

                }
                eqn[k] = {
                    "type": type,
                    "value": v["coords"],
                    "dash": item['dashes'][k]
                };
            }
            objs.push(
                {
                    "type": "region",
                    "eqn": eqn,
                    "dataFill": item['dataFill']
                }
            )
            continue;
        }

        if (!item['input']) {
            continue;
        }
		switch(item['type']) {
            case 'Objectum':
                if (item['input']) {
                    object = {
                        "type": "curve",
                        "value": item["latex"],
                        "isFill": true,
                        "bounded": item["bounded"]
                    };
                } else {
                    continue for_1;
                }
                break;

			case 'Punctum':
                object = {
                    "type": "point",
                    "value": item["coord"],
                    "isFill": item["isFill"]
                };
                break;
		
			case 'Line':
                object = {
                    "type": "lineCurve",
                    "value": item["answerPoint"],
                    "isFill": true,
                    "bounded": item["bounded"]
                };
                break;

			case 'Quad':
                object = {
                    "type": "quadCurve",
                    "value": item["answerPoint"],
                    "isFill": true,
                    "bounded": item["bounded"]
                };
                break;

			case 'Expo':
                object = {
                    "type": "expoCurve",
                    "value": item["answerPoint"],
                    "isFill": true,
                    "bounded": item["bounded"]
                };
                break;

			case 'Abs':
                object = {
                    "type": "absCurve",
                    "value": item["answerPoint"],
                    "isFill": true,
                    "bounded": item["bounded"]
                };
                break;

			case 'Log':
                object = {
                    "type": "logCurve",
                    "value": item["answerPoint"],
                    "isFill": true,
                    "bounded": item["bounded"]
                };
                break;

			case 'Sqrt':
                object = {
                    "type": "sqrtCurve",
                    "value": item["answerPoint"],
                    "isFill": true,
                    "bounded": item["bounded"]
                };
                break;

			case 'Reci':
                object = {
                    "type": "reciCurve",
                    "value": item["answerPoint"],
                    "isFill": true,
                    "bounded": item["bounded"]
                };
                break;

			case 'Sin':
                object = {
                    "type": "sinCurve",
                    "value": item["answerPoint"],
                    "isFill": true,
                    "bounded": item["bounded"]
                };
                break;

			case 'Tan':
                object = {
                    "type": "tanCurve",
                    "value": item["answerPoint"],
                    "isFill": true,
                    "bounded": item["bounded"]
                };
                break;

			default:
			    continue for_1;
		}

		if (object["type"] == 'point') {

        } else if (object["bounded"] === true) {
        /*
			foreach(item["bound"] as k=>v)
			{
				if (v === minX) {item["bound"][k] = -INF; item["endPoint"][k] = true;}
				else if (v === maxX) {item["bound"][k] = INF; item["endPoint"][k] = true;}
			}
            */
			object["bound"] = item["bound"];
			object["endPoints"] = item["endPoint"];
		} else {
			object["bound"] = null;
			object["endPoints"] = null;
		}	
		objs.push(object);
	}	
	return {
		'textbox': [],
		'mathbox': [],
		'objs': objs
    };
}

import {match_all} from '../checkmath.js';

function JStoLatex(JS) {
    var temp = match_all(
        JS, 
        new RegExp(
            '\(\(([^\(\)]+)\)\\/\(([^\(\)]+)\)\)',
            'g'
        )
    );
    for (var i = 0; i < temp[0].length; i++) {
        JS = JS.replaceAll(
            temp[0][i], 
            '\\frac{'+ temp[1][i] + '}{' + temp[2][i] + '}'
        );
    }
    temp = match_all(
        JS, 
        new RegExp(
            'Math.pow\(([^\(\),]+),([^\(\),]+)\)',
            'g'
        )
    );
    for (var i = 0; i < temp[0].length; i++) {
        JS = JS.replaceAll(
            temp[0][i], 
            temp[1][i] = '^' + temp[2][i]
        );
    }
    temp = match_all(
        JS,
        new RegExp(
            'Math.sqrt\(([^\(\)]+)\)',
            'g'
        )
    );
    for (var i = 0; i < temp[0].length; i++) {
        JS = JS.replaceAll(
            temp[0][i], 
            '\\sqrt{' + temp[1][i] + '}'
        );
    }
    return JS;
}


export function _organizeAnswerObjFromSelectInLattice(object, answer,checktypeDefault) {
    var object_1 = JSON.parse(JSON.stringify(object));
    var selectValue = [];
    for (var [k, row] of object_1['value'].entries()) {
        if (row[0]['object']['type'] === 'Select' && 
            row[0]['object']['value'].length === 1) {
            selectValue.push(k);
            organizeAnswerObj(row[1]['object'],answer,checktypeDefault);
        } else if (row[0]['type'] === 'Select' && 
            row[0]['value'].length === 1) {
            selectValue.push(k);
            organizeAnswerObj(row[1],answer,checktypeDefault);
        }
    }
    answer['select'].push(
        {
            'value': selectValue, 
            'order': 0
        }
    );
}