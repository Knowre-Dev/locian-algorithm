

import {Cart2D_organizeMathTree} from '../rc/function_184.inc.js';
import {Cart2D_evaluateOperation} from '../rc/function_184.inc.js';
import {Cart2D_compTree} from '../rc/function_184.inc.js';



// test 11 => because of line 623 of export function_184
// fixed this bug, but maybe causes other issues...
export function compareCart2D(right = null, input = null) {
	var right_1 = JSON.parse(JSON.stringify(right));
    var input_1 = JSON.parse(JSON.stringify(input));
    if (right_1['type'] === 'Cartesian2D' && input_1['type'] === 'Cartesian2D') {
        
        
        
        var rightObjs = Cart2D_getInfo(right_1);
        var inputObjs = Cart2D_getInfo(input_1);

        //console.log(JSON.stringify(rightObjs, null, 4));
		//console.log(JSON.stringify(inputObjs, null, 4));
       
        
        if (rightObjs === false || inputObjs === false) {
            return false;
		}
        if (!rightObjs || !inputObjs) {
            return false;
		}
        
        if (rightObjs[0]['type'] === 'region') {
            return compareCart2D_region(rightObjs[0],inputObjs[0]);
        }
        
        return compareCart2D_curve(rightObjs, inputObjs);
    }

    return false;
}

export function Cart2D_getInfo(cartObject) {
	var cartObject_1 = JSON.parse(JSON.stringify(cartObject));
	//console.log(JSON.stringify(cartObject_1, null, 4));
    if (typeof cartObject_1['type'] != 'undefined' &&
		cartObject_1['type'] === 'Cartesian2D') {
	
	} else {
		return false;
	}
	
    if (cartObject_1['checkFlag'] === false) {
        return false;
	}
	
	var objs = [];

	//var minX = cartObject_1['bound'][0][0];
	//var maxX = cartObject_1['bound'][0][1];
	for_1:
	for (var item of cartObject_1['object']) {
        if (item['type'] === 'Regio') {
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
                eqn.push({
                    "type": type,
                    "value": Cart2D_JStoLatex(v["eqn"]),
                    "dash": v['dash']
				});
            }
			objs.push({
				"type": "region",
				"eqn": eqn,
                "dataFill": item['dataFill']
			});
            continue;
        } else if(item['type'] === 'Input:Region' || 
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
            objs.push({
                "type": "region",
                "eqn": eqn,
                "dataFill": item['dataFill']
			});
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
			object["bound"] = item["bound"];
			object["endPoints"] = item["endPoint"];
		} else {
			object["bound"] = null;
			object["endPoints"] = null;
		}	
		objs.push(object);
	}	
	return objs;
}

export function Cart2D_JStoLatex(JS) {
    var replace = {
		' ': '', 
		'+ -': '-'
	};
	for (var [k, v] of replace.entries()) {
		JS = JS.replaceAll(k, v);
	}

	var regexp = new RegExp('\(\(([^\(\)]+)\)\\/\(([^\(\)]+)\)\)', 'g');
    var temp = match_all(JS, regexp);	
    for (var i = 0;  i < temp[0].length; i++) {
		JS = JS.replaceAll(
			temp[0][i],
			'\\frac{' + temp[1][i] + '}{' + temp[2][i] + '}'
		);
	}
	regexp = new RegExp('Math.pow\(([^\(\),]+),([^\(\),]+)\)', 'g');
    temp = match_all(JS, regexp)
    for (var i = 0; i < temp[0].length; i++) {
        JS = JS.replaceAll(
			temp[0][i], 
			'(' + temp[1][i] + ')^' + temp[2][i]
		);
	}
	regexp = new RegExp('Math.sqrt\(([^\(\)]+)\)', 'g');
    temp = match_all(JS, regexp);
    for (var i = 0; i < temp[0].length; i++) {
        JS = JS.replaceAll(
			temp[0][i], 
			'\\sqrt{' + temp[1][i] + '}'
		);
	}

    return JS;
}

export function compareCart2D_region(rightObjs, inputObjs) {
	var rightObjs_1 = JSON.parse(JSON.stringify(rightObjs));
    var inputObjs_1 = JSON.parse(JSON.stringify(inputObjs));
    if (rightObjs_1['eqn'].length !== inputObjs_1['eqn'].length || 
		rightObjs_1['dataFill'].length !== inputObjs_1['dataFill'].length) {
        return false;
	}
    var map = [];
    for (var [i, iobj] of inputObjs_1['eqn'].entries()) {
        if (iobj['type'] === 'curve') {
            if (iobj['dash'] === rightObjs_1['eqn'][i]['dash']) {
                delete rightObjs_1['eqn'][i];
                delete inputObjs_1['eqn'][i];
                map.push(i);
                continue;
            } else {
                return false;
			}
        } else {
			var eq
            if (iobj['type'] === 'ineq') {
                eq = iobj['value'];
            } else {
                eq = Cart2D_makeEq(iobj['type'], iobj['value']);
            }

            if (eq === false || eq === null) {
                return false;
            }
        }
        for (var [r, robj] of rightObjs_1['eqn'].entries()) {
            if (iobj['type'] !== robj['type'] || iobj['dash'] !== robj['dash']) {
                continue;
            }
            var doMatch = Cart2D_checkMath(robj['value'], eq);
            if (doMatch) {
                delete rightObjs_1['eqn'][r];
                delete inputObjs_1['eqn'][i];
                map.push(r);
                break;
            }
        }
    }
	inputObjs_1['eqn'] = inputObjs_1['eqn'].filter(Boolean);
	rightObjs_1['eqn'] = rightObjs_1['eqn'].filter(Boolean);
    if (inputObjs_1['eqn'].length !== 0 || rightObjs_1['eqn'].length !== 0) {
        return false;
    }

    var newDataFill = [];
    for (var data of rightObjs_1['dataFill']) {
        var newData = [];
        for (var v of map) {
            newData.push(data[v]);
        }
        newDataFill.push(newData);
    }
    for (var iData of inputObjs_1['dataFill']) {
        for (var [r, rData] of newDataFill.entries()) {
            if (JSON.stringify(rData) === JSON.stringify(iData)) {
                delete newDataFill[r];
                break;
            }
        }
    }

	newDataFill = newDataFill.filter(Boolean);
    if (newDataFill.length !== 0) {
        return false;
    }
    return true;
}

// copy and paste from checkmath.php 

export function Cart2D_makeEq(type, points) { // make latex string
	var points_1 = JSON.parse(JSON.stringify(points));
	if (!Array.isArray(points_1)) {
        return points_1;
    }
    var result;
    switch (type) {
        case 'lineCurve':
        case 'linear':
        	if (points_1.length !== 2) {
            	return false;
        	}

			var xDiff = points_1[0][0] - points_1[1][0];
			if (xDiff == 0) {
				result = 'x=' + points_1[0][0].toString();
				break;
			} else {
				var yDiff = points_1[0][1] - points_1[1][1];
				if (yDiff == 0) {
					result = 'y=' + points_1[0][1].toString();
					break;
				} else {
					var slope
					if (xDiff === 1) {
						slope = yDiff.toString(); 
					} else if (xDiff === -1) {
						slope = (-yDiff).toString();
					} else {
						slope = '\\frac{' + 
							yDiff.toString() + 
							'}{' + 
							xDiff.toString() + 
							'}';
					}
					result = 'y=' + 
						slope + 
						'(x-(' + 
						points_1[0][0].toString() + 
						'))+(' + 
						points_1[0][1].toString() + 
						')';
				}
			}
			break;

        case 'quadCurve':
        case 'quadratic':
			if (points_1.length !== 3) {
				return false;
			}

			var xDiff = points_1[1][0] - points_1[0][0];
			var yDiff = points_1[1][1] - points_1[0][1];
			if (xDiff == 0 || yDiff == 0) {
				return false;
			} else {
				var squareXDiff = xDiff * xDiff;
				var slope;
				if (squareXDiff === 1) {
					slope = yDiff.toString();
				} else {
					slope = '\\frac{' + 
					yDiff.toString() + 
					'}{' + 
					squareXDiff.toString() + 
					'}';
				}
				result = 'y=' + 
					slope + 
					'(x-(' + 
					points_1[0][0].toString() + 
					'))^2+(' + 
					points_1[0][1].toString() + 
					')';
			}
			break;

        case 'absCurve':
        case 'absolute':
			if (points_1.length !== 3) {
				return false;
			}

			var xDiff = points_1[1][0] - points_1[0][0];
			var yDiff = points_1[1][1] - points_1[0][1];
			if (xDiff == 0 || yDiff == 0) {
				return false;
			} else {
				var absXDiff = Math.abs(xDiff);
				var slope;
				if (xDiff == 1) {
					slope = yDiff.toString();
				} else {
					slope = '\\frac{' + 
						yDiff.toString() + 
						'}{' + 
						absXDiff.toString() + 
						'}';
				}
				result = 'y=' + 
					slope + 
					'\\left|x-(' + 
					points_1[0][0].toString() + 
					')\\right|+(' + 
					points_1[0][1].toString() + 
					')';
			}
			break;

        case 'expoCurve':
        case 'exponential':
			if (points_1.length !== 3) {
				return false;
			}
	
			var q = points_1[0][1];
			var yDiff1 = points_1[1][1] - q;
			var yDiff2 = points_1[2][1] - q;
			var xDiff = points_1[2][0] - points_1[1][0];

			if (xDiff == 0 || yDiff1 == 0 || yDiff2 == 0) {
				return false;
			} else {
				var a = '\\frac{(' + 
					yDiff1.toString() + 
					')^(\\frac{' + 
					points_1[2][0].toString() + 
					'}{' + 
					xDiff.toString() + 
					'})}{(' + 
					yDiff2.toString() + 
					')^(\\frac{' + 
					points_1[1][0].toString() + 
					'}{' + 
					xDiff.toString() + 
					'})}';
				var b = '(\\frac{' + 
					yDiff2.toString() + 
					'}{' + 
					yDiff1.toString() + 
					'})^(\\frac{1}{' + 
					xDiff.toString() + 
					'})';
				result = 'y=(' + 
					a + 
					')*(' + 
					b + 
					')^x+(' + 
					q.toString() +
					')';
			}
			break;

        case 'logCurve':
        case 'logarithmic':
			if (points_1.length !== 3) {
				return false;
			}
			
			var q = points_1[0][0];
			var xDiff1 = points_1[1][0] - q;
			var xDiff2 = points_1[2][0] - q;
			var yDiff = points_1[2][1] - points_1[1][1];

			if (yDiff == 0 || xDiff1 == 0 || xDiff2 == 0) {
				return false;
			} else {
				var a = '\\frac{(' + 
					xDiff1.toString() + 
					')^(\\frac{' + 
					points_1[2][1].toString() + 
					'}{' + 
					yDiff.toString() + 
					'})}{(' + 
					xDiff2.toString() + 
					')^(\\frac{' + 
					points_1[1][1].toString() + 
					'}{' + 
					yDiff.toString() + 
					'})}';
				b = '(\frac{' + 
					xDiff2.toString() + 
					'}{' + 
					xDiff1.toString() + 
					'})^(\\frac{1}{' + 
					yDiff.toString() + 
					'})';
				result = 'y=log_{' + 
					b + 
					'}{\\frac{x-' + 
					q.toString() + 
					'}{' + 
					a + 
					'}}';
			} 
			break;
	
        case 'sqrtCurve':
        case 'square_root':
			if (points_1.length !== 2) {
				return false;
			}

			var xDiff = points_1[1][0] - points_1[0][0];
			var yDiff = points_1[1][1] - points_1[0][1];
			if (xDiff == 0 || yDiff == 0) {
				return false;
			} else {
				var sign;
				if (yDiff > 0) {
					sign = '';
				} else {
					sign = '-';
				}

				var squareYDiff = yDiff * yDiff;
				var slope;
				if (xDiff == 1) {
					slope = squareYDiff.toString();
				} else if (xDiff == -1) {
					slope = (-squareYDiff).toString();
				} else {
					slope = '\\frac{' + 
						squareYDiff.toString() + 
						'}{' + 
						xDiff.toString() + 
						'}';
				}
				result = 'y=' + 
					sign + 
					'\\sqrt{' + 
					slope + 
					'(x-(' + 
					points_1[0][0].toString() + 
					'))}+(' + 
					points_1[0][1].toString() + 
					')';
			}
			break;

        case 'reciCurve':
        case 'rational':
			if (points_1.length !== 3) {
				return false;
			}

			var xDiff = points_1[1][0] - points_1[0][0];
			var yDiff = points_1[1][1] - points_1[0][1];
			if (xDiff == 0 || yDiff == 0) {
				return false;
			} else {
				var slope = (xDiff * yDiff).toString();
				result = 'y=\\frac{' + 
					slope + 
					'}{x-(' + 
					points_1[0][0].toString() + 
					')}+(' + 
					points_1[0][1].toString() + 
					')';
			}
			break;

        case 'sinCurve':
        case 'tanCurve':
			return false;
			
    }
    //echo result;
    return result;
}

export function compareCart2D_curve(rightObjs, inputObjs) {
	var rightObjs_1 = JSON.parse(JSON.stringify(rightObjs));
    var inputObjs_1 = JSON.parse(JSON.stringify(inputObjs));

 
    var rightObjsMap = Cart2D_organizeObjs(rightObjs_1);
	//console.log(JSON.stringify(rightObjsMap, null, 4));
	if (rightObjsMap === false) {
		return false;
	}
	var inputObjsMap = Cart2D_organizeObjs(inputObjs_1);
	//console.log(JSON.stringify(inputObjsMap, null, 4));
	if (inputObjsMap === false) {
		return false;
	}
      
    
    var matchedRightObjs = [];
	var matchedInputObjs = [];

	var remainPts_rightObjs = [];
	var remainPts_inputObjs = [];

	//get all types of objs from rightObjs and inputObjs
	var keys = Object.keys(rightObjsMap).concat(Object.keys(inputObjsMap));
	var ava_types = [];
	for (var key of keys) {
		var is_unique = true; 
		for (var v of ava_types) {
			if (JSON.stringify(key) == JSON.stringify(v)) {
				is_unique = false;
				break;
			}
		}
		if (is_unique) {
			ava_types.push(key);
		}
	} 
	
    for (var key of ava_types) {
		var type_rightObjs = [];
		var type_inputObjs = [];
		if (key in rightObjsMap) { 
            type_rightObjs = rightObjsMap[key];
		}
		if (key in  inputObjsMap) { 
            type_inputObjs = inputObjsMap[key];
		}
		if (key === 'point') {
			//if key is point, type_inputObjs would be [obj, obj, ...]
			//console.log(JSON.stringify(type_rightObjs, null, 4));
			//console.log(JSON.stringify(type_inputObjs, null, 4));
			var r_i = Cart2D_subtractPtsFromPts(type_rightObjs, type_inputObjs);
			var i_r = Cart2D_subtractPtsFromPts(type_inputObjs, type_rightObjs);
			remainPts_rightObjs = remainPts_rightObjs.concat(r_i);
			remainPts_inputObjs = remainPts_inputObjs.concat(i_r);
			//console.log(JSON.stringify(remainPts_rightObjs, null, 4));
			//console.log(JSON.stringify(remainPts_inputObjs, null, 4));
		} else {	
			//key is curve-type, type_inputObjs would be [(array of objs), (array of objs), ...]

			for (var rObjArr of type_rightObjs) {
				var doMatch = false;
				for (var [i, iObjArr] of type_inputObjs.entries()) {
					if (iObjArr == null) {
						continue;
					}
					
					var possiblePts = null;
					doMatch = compareCart2D_curveObjs(rObjArr, iObjArr, possiblePts);
					//console.log(JSON.stringify(rObjArr, null, 4));
					//console.log(JSON.stringify(iObjArr, null, 4));
					//console.log(doMatch);
					//console.log(possiblePts);
					if (doMatch) { //set the matched input answer to null	
                      	matchedRightObjs = matchedRightObjs.concat(rObjArr);
						matchedInputObjs = matchedInputObjs.concat(iObjArr);

						type_inputObjs[i] = null;
						break;	
					} else if (possiblePts != null) {
						var r_i = possiblePts['r_minus_i']; 
						var i_r = possiblePts['i_minus_r']; 
						if (r_i != null) {
							remainPts_rightObjs = remainPts_rightObjs.concat(r_i)
						};
						if (i_r != null) {
							remainPts_inputObjs = remainPts_inputObjs.concat(i_r);
						}
						type_inputObjs[i] = null;
						doMatch = true; //we assume this for further examination
						break;
                    } else {
                       
                    }
				}
				
				if(doMatch === false) {
					return false;
				}
			}
			
			//at this point, type_inputObjs should only have nulls
			//If not, it means type_inputObjs had extra objs that matched with 
			//none of the objs in type_rightObjs
			for (var iObjArr of type_inputObjs) {
				if (iObjArr != null) {
					return false;
				}
			}
		}		
	}

	// cancal out the points that macth
	var fn_intersect = function(pt1, pt2) { 
		return (pt1['type'] === pt2['type'] && 
			pt1['value'] === pt2['value'] && 
			pt1['isFill'] === pt2['isFill']) ? 0 : 1; 
	};
	var intersect = [];
	for (var v_1 of remainPts_rightObjs) {
		for (var v_2 of remainPts_inputObjs) {
			if (fn_intersect(v_1, v_2)) {
				intersect.push(v_1);
				break;
			}
		}
	}
	remainPts_rightObjs = Cart2D_subtractPtsFromPts(remainPts_rightObjs, intersect);
	remainPts_inputObjs = Cart2D_subtractPtsFromPts(remainPts_inputObjs, intersect);
	//console.log(JSON.stringify(remainPts_rightObjs, null, 4));
	//console.log(JSON.stringify(remainPts_inputObjs, null, 4));
	// unmatched points must exist in each other's graph. otw input is wrong
    remainPts_rightObjs = Cart2D_deletePointsOnGraphs(remainPts_rightObjs, matchedInputObjs);
	if (remainPts_rightObjs.length > 0) {
		return false;
	}
	remainPts_inputObjs = Cart2D_deletePointsOnGraphs(remainPts_inputObjs, matchedRightObjs);
	if (remainPts_inputObjs.length > 0) {
		return false;
	}
	return true;
}

// to be continued
export function Cart2D_organizeObjs(rawObjs) {
	var rawObjs_1 = JSON.parse(JSON.stringify(rawObjs));
	//filter out objs with isFill === false
	var fn = function(o) {
		if ("isFill" in o) {
			return o['isFill'];
		} else {
			return false;
		}
	};
	var objs = rawObjs.filter(fn);
	
	var done = Cart2D_add_mathTree2Objs(objs);
	if (done === false) {
		return false;
	}
	objs = Cart2D_trimDown(objs);
    return objs;
}

import {Relation_LatexToTree} from '../rc/function_144.inc.js';

export function Cart2D_add_mathTree2Objs(objs) {
	
	for (var [i, obj] of objs.entries()) {
		if (obj['type'] === 'point') {
			continue;
		}

		if (Array.isArray(obj['value'])) {//values are points
            var mathTree = Cart2D_makeEq(obj['type'], obj['value']);  // latex
			if (mathTree === false) {
				return false;
			}
		} else {//values are latex string
			mathTree = Relation_LatexToTree(obj['value']);
		}
		objs[i]['mathTree']= mathTree;
	}
	return true;
}

/* 
 * Trim down any dupliates or subset plane obj values 
 * that exist in an Input Answer Plane.
 * objs: an array of plane objs where one pobj looks like:
 * obj: ["type": -, "value": -, "isFill": -,
 *		   "bounded": -, "bound": -, "endPoints": -]
 * 
 * returns a map with type of obj as key and an array of 
 * the corresponding objs as value e.g.
 	["point": [obj, obj, obj, ...],
 	 "curve": [(array of equiv objs), (array of equiv objs), ...],
	]
 */
export function Cart2D_trimDown(objs) {
	var objs_1 = JSON.parse(JSON.stringify(objs));
	var map = new Object();
	var numObjs = 0;
  
    
	//map each obj by its type i.e. 'point', 'lineCurve' etc
	map['point'] = [];
	map['curve'] = [];
	for (var obj of objs_1) {
		var key = obj["type"];
		if (key === "point") {
			map['point'].push(obj);
		} else {
			map['curve'].push(obj);

		}
	}

	// Delete points on the curves
	if ("point" in map) {
		var me_pts = Cart2D_deletePointsOnGraphs(map["point"], map["curve"]);
		map["point"] = me_pts; 
	}
    

	// Combine any duplicate or subset graphs
	map["curve"] = Cart2D_combineGraphs(map["curve"]);
	return map;
}

/*
 * pointObjs: point obj array
 * curveObjs: graph obj array
 * return an array of point objs that do NOT belong to any of graphs in curveObjs 
 */
export function Cart2D_deletePointsOnGraphs(pointObjs, curveObjs) {
	var pointObjs_1 = JSON.parse(JSON.stringify(pointObjs));
	var curveObjs_1 = JSON.parse(JSON.stringify(curveObjs));  
	var result = [];
	for (var obj of pointObjs_1) {
		var belong2Graph = false;
		for (var eqnobj of curveObjs_1) {
			if (Cart2D_pointBelong2Bound(obj, eqnobj) && Cart2D_pointBelong2Eqn(obj, eqnobj)) {
				belong2Graph = true;
				break;
			}
		}

		if (!belong2Graph) {
			result.push(obj);
		}
	}

	return result;
}

/* 
 * check of the x-axis point of pointObj is within the 
 * boundary of the equation export function.
 */
export function Cart2D_pointBelong2Bound(pointObj, eqnObj) {
	var pointObj_1 = JSON.parse(JSON.stringify(pointObj));
	var eqnObj_1 = JSON.parse(JSON.stringify(eqnObj));
	if (eqnObj_1["bounded"] === false) {
		return true;
	}
	var x_pt = pointObj_1["value"][0];
	if (eqnObj_1["bound"][0] < x_pt && x_pt < eqnObj_1["bound"][1]) {
		return true;
	}

	if (eqnObj_1["bound"][0] === x_pt && eqnObj_1["endPoints"][0]) {
		return true;
	}
	if (eqnObj_1["bound"][1] === x_pt && eqnObj_1["endPoints"][1]) {
		return true;
	}

	return false;
}

/* 
 * both pointObj and eqnObj are in the format of obj:
 * obj: ["type": -, "value": -, "isFill": -,
 *		  "bounded": -, "bound": -, "endPoints": -]
 */
export function Cart2D_pointBelong2Eqn(pointObj, eqnObj) {
	var pointObj_1 = JSON.parse(JSON.stringify(pointObj));
	var eqnObj_1 = JSON.parse(JSON.stringify(eqnObj));
	
	var ptValues = pointObj_1['value'];
	var mathTree = eqnObj_1['mathTree'];
	var variableArr = {
		'x': ptValues[0], 
		'y': ptValues[1]
	};
	return Cart2D_identifyEqWithValue(mathTree, variableArr);
}

//import {Relation_LatexToTree} from '../rc/function_144.inc.js';

export function Cart2D_identifyEqWithValue(A, valueArr) {
	var A_1 = JSON.parse(JSON.stringify(A));
	var valueArr_1 = JSON.parse(JSON.stringify(valueArr));
	if (!Array.isArray(A_1))
		A_1 = Relation_LatexToTree(A_1);
 
	if (Array.isArray(A_1) && 
		['equation','inequality'].includes(A_1[0])) {
	
	} else {
		return false;
	}

	var evaluatedEq = Cart2D_evaluateExWithValue(A_1, valueArr_1);
	
    //if (valueArr['x'] === 3) print_r(evaluatedEq);
    // in the export function powComplex_inLocian(from evaluateEx_new), sin(2π) is not equal to 0, the result is -2.4492935982947E-16, so the export function Relation_compTree outputs false and that causes the right answer marked false.
    for (var [k1, arrEq] of evaluatedEq.entries()) {
        if (k1 > 0) {
            for (var [k2, value] of arrEq.entries()) {
                if (value.toString().indexOf('e')) {
                    evaluatedEq[k1][k2] = Math.round(value);
                }
            }
        }
    }
   
	if (evaluatedEq[0] === 'equation') { 
		// 150818 larwein - 점찍고 함수그린 경우 점이 함수에 포함되는지 계산 이상
		return (JSON.stringify(evaluatedEq[1]) == JSON.stringify(evaluatedEq[2]) || Cart2D_compTree(evaluatedEq[1],evaluatedEq[2]));	
	} else if (A_1[0] === 'inequality') {
		return false;
	}
}

export function Cart2D_evaluateExWithValue(A, valueArr) {
	var A_1 = JSON.parse(JSON.stringify(A));
	var valueArr_1 = JSON.parse(JSON.stringify(valueArr));
	if (!Array.isArray(A_1)) {
		return A_1;
	}
	
	var operator = A_1[0];
	var operandTree = A_1.slice(1);

	var operand = [];
	for (var each of operandTree) {
		operand.push(Cart2D_evaluateExWithValue(each, valueArr_1));
	}

	switch(operator) {
		case 'variable':
			if (valueArr_1[operand[0]] !== null) {
				return [valueArr_1[operand[0]], 0];
			}
			break;

		case 'equation':
		case 'neq':
		case 'ratio':
		case 'inequality':
			var result = [operator];
			for (var v of operand) {
				result.push(v);
			}
			return result;
		

		default:
			return Cart2D_evaluateOperation(operator,operand);
	}
}

/* 
 * takes an array of curve objs of one type
 * returns [(array of equiv objs), (array of equiv objs), ...]
 */
export function Cart2D_combineGraphs(curveObjs) {
	var curveObjs_1 = JSON.parse(JSON.stringify(curveObjs));
   
	//an array of arrays of examined objs
	var result = [];
	
	//group into arrays of equivalent objs
	for (var obj of curveObjs_1) {
		var newId = -1; 
		var newArr = null;
		for (var [i, resArr] of result.entries()) {
			//equivalent mathTree detected
            // math option
            if (Cart2D_checkMath(resArr[0]['mathTree'], obj['mathTree'])) {
				newId = i;
				newArr = resArr;
				newArr.push(obj);
				break;
            } 
		}

		if (newId < 0) {
			result.push([obj]);
		} else {
			result[newId] = newArr;
		}
	}
    

	//combine bounds for each array of equivalent objs
	for (var [i, resArr] of result.entries()) {
		result[i] = Cart2D_combineCurveObjBounds(resArr);	
	}

	return result;
}

export function Cart2D_combineCurveObjBounds(objArr) {
	var objArr_1 = JSON.parse(JSON.stringify(objArr));
    objArr_1.sort(Cart2D_cmpObjBounds);
        
	var result = [];
	for (var obj of objArr_1) {
		if (result.length === 0) {
			result.push(obj);
			continue;
		}
		var lastID = [...result.keys()][result.length - 1];
		var newCurveObj = Cart2D_combineTwoBounds(result[lastID], obj);

		if (newCurveObj != null) { //their bounds became one bound
			result[lastID] = newCurveObj;
		} else {
			result.push(obj);
		}
	}
	return result;
}

/* 
 * return -1 if o1's bound is bigger, 0 if same and 1 otw.
 * 
 * NOTE: By 'bigger', I am referring to the bound with 
 * smaller ['bound'][0], and if their ['bounded'][0] match, 
 * then bigger ['bound'][1]
 * e.g. [1,3] > [2,10], [-INF, 5] > [-3, 100],
 * [1,3] with [true, false] > [1,4] with [false, true]
 * 
 * Also, bounded === false is same thing as [-INF, INF]
 */
export function Cart2D_cmpObjBounds(o1, o2) {
	var o1_1 = JSON.parse(JSON.stringify(o1));
	var o2_1 = JSON.parse(JSON.stringify(o2));
	if (o1['bounded'] === o2['bounded'] && 
		JSON.stringify(o1_1['bound']) === JSON.stringify(o2_1['bound']) &&
		JSON.stringify(o1_1['endPoints']) === JSON.stringify(o2_1['endPoints'])) {
			return 0;
	}

	if ((o1_1['bounded'] && JSON.stringify(o1_1['bound']) === JSON.stringify([-Infinity, Infinity])) &&
		!o2_1['bounded']) {
		return 0;
	}
	if ((o2_1['bounded'] && JSON.stringify(o2_1['bound']) === JSON.stringify([-Infinity, Infinity]))
		&& !o1_1['bounded']) {
		return 0;
	}
    if (!o1_1['bounded']) {
		return -1;
	}
    if (!o2_1['bounded']) {
		return 1;
	}
    //both are bounded
    var b1 = o1_1['bound'];
    var b2 = o2_1['bound'];
    
    var e1 = o1_1['endPoints'];
    var e2 = o2_1['endPoints'];
    
    if (JSON.stringify(b1[0]) === JSON.stringify(b2[0])) {
        if (JSON.stringify(e1[0]) === JSON.stringify(e2[0])) {
            return b1[1] < b2[1] ? -1 : (e1[1] ? -1 : 1); 
        } else if (e1[0]) {
            return -1;
        } else {
            return 1;   
        }
    }
    
    return b1[0] < b2[0] ? -1 : 1;
}

/*
 * combines two bounds of graph objs
 * curveObj1 and curveObj2: 
 * ['type':, 'value':, 'isFill':, 'bounded':, 'bound':, 'endPoints':]
 * If two bounds cannot be combined e.g. (1,2) and (3,4), return null
 * ASSUME: curveObj1 has a bound that comes before curveObj2's
 */
export function Cart2D_combineTwoBounds(curveObj1, curveObj2) {
	var curveObj1_1 = JSON.parse(JSON.stringify(curveObj1));
	var curveObj2_1 = JSON.parse(JSON.stringify(curveObj2));
	var gb1 = curveObj1_1['bounded'];
	var gb2 = curveObj2_1['bounded'];
	if (gb1 === false) {
		return curveObj1_1;
	}
	if (gb2 === false) {
		return curveObj2_1;
	}

	//both graphs are bounded: modify curveObj1 by default
	var b1 = curveObj1_1['bound']; 
	var b2 = curveObj2_1['bound'];
	
	var e1 = curveObj1_1['endPoints']; 
	var e2 = curveObj2_1['endPoints'];

	//their bounds are mutually exclusive
	if (b1[1] < b2[0]) {
		return null;
	}
	//their bounds are diff by a point
	if (b1[1] === b2[0] && !e1[1] && !e2[0]) {
		return null;
	}
	var result = curveObj1_1;
	if (b1[0] === b2[0]) {
		result['endPoints'][0] = (e1[0] ? e1[0] : e2[0]);	
	} else {
		result['bound'][0] = (b1[0] < b2[0] ? b1[0] : b2[0]);
		result['endPoints'][0] = (b1[0] < b2[0] ? e1[0] : e2[0]);
	}

	if (b1[1] === b2[1]) {
		result['endPoints'][1] = (e1[1] ? e1[1] : e2[1]);	
	} else {
		result['bound'][1] = (b1[1] > b2[1] ? b1[1] : b2[1]);
		result['endPoints'][1] = (b1[1] > b2[1] ? e1[1] : e2[1]);
	}

	return result;
}

/* 
 * takes two arrays of point objs, P1, P2
 * P1 & P2: [[type:'point', value:, isFill:], ...]
 *
 * returns an array of points we get by P1 - P2;
 * ASSUME: their types are all 'point'
 */
export function Cart2D_subtractPtsFromPts(P1, P2) {
	var P1_1 = JSON.parse(JSON.stringify(P1));
	var P2_1 = JSON.parse(JSON.stringify(P2));
	var result = [];
	if (P1_1 == null) {
		return result;
	}
	for (var p of P1_1) {
		if (!P2_1.includes(p)) { //not found a match
			result.push(p);
		}
	}
	return result;
}

/* 
 * takes one plane obj from one Right Answer Plane
 * and another plane obj from one Input Answer Plane
 *
 * right, input:
  	[["type": -, "value": <str>|[(point(s))], "isFill": <boolean>,
	  "bounded": -, "bound": -, "endPoints": -, "mathTree":-],
	 ["type": -, "value": <str>|[(point(s))], "isFill": <boolean>,
	  "bounded": -, "bound": -, "endPoints": -, "mathTree":-],
	  ...
	]
 * i.e. an array of equiv curve objs. Thus right[0]['mathTree'] is 
 * equivalent to right[i]['mathTree'] for any i
 *
 * possiblePts: ['r_minus_i': [[type:point, value:, isFill:,], ...] | null,
 				  'i_minus_r': [[type:point, value:, isFill:,], ...] | null]
 * Points in 'r_minus_i' are those that exist in right curve objs but not input, 
 * vice versa.
 * 
 * returns true only when right and input are equivalent graphs with the 
 * identical bounds. false otw with no exception. However, if their bounds are 
 * differnt by point values, then we indicate this special case by setting 
 * possiblePts to those point values for further examination.
 * If their bounds are different by more than points, then possiblePts = null.
 *	
 * ASSUME: their types are all identical.
 */
export function compareCart2D_curveObjs(right, input, possiblePts = null) {
	var right_1 = JSON.parse(JSON.stringify(right));
	var input_1 = JSON.parse(JSON.stringify(input));
	if (right_1 == null || input_1 == null) {
		return false;
	}	
	//console.log(JSON.stringify(right_1[0]['mathTree'], null, 4));
	//console.log(JSON.stringify(input_1[0]['mathTree'], null, 4));
	//check their values(or mathTree) match
    var doMatch = Cart2D_checkMath(right_1[0]['mathTree'], input_1[0]['mathTree']);
	
	if (!doMatch) {
		return false; //curve eqns are not equivalent
	}
	//check their bounds match:
	//check if their bounds are identical
	if (right_1.length === input_1.length) {
		var identicalBounds = true;
		for (var [i, ro] of right_1.entries()) {
			if (Cart2D_cmpObjBounds(ro, input_1[i]) !== 0) {
				identicalBounds = false;
				break;
			}
		}
		if (identicalBounds) {
			return true;
		}
	}


	//check if their bounds' are only different by a point
	//if so, we will still return false but set boundArr to that point value
	//to indicate that the right and input are only different by a point
	var possiblePts = Cart2D_subtractCurves_getPoints(right_1, input_1);
	return false;
}

/*
 * takes two arrays of equiv curve objs
 * returns an array of points if their difference is only by points,
 * null otw.
 * ASSUME: bounds are sorted and mutually exclusive as we went thr trimDown
 */
export function Cart2D_subtractCurves_getPoints(objArr1, objArr2) {
	var objArr1_1 = JSON.parse(JSON.stringify(objArr1));
	var objArr2_1 = JSON.parse(JSON.stringify(objArr2));
	
	if (objArr1_1 == null || objArr2_1 == null || 
		objArr1_1.length === 0 || objArr2_1.length === 0) {
		return null;
	}
	//check their biggest and smallest bound value equal or diff
	var min1 = objArr1_1[0]; 
	var max1 = objArr1_1[[...objArr1_1.keys()][objArr1_1.length -1]];
	var min2 = objArr2_1[0]; 
	var max2 = objArr2_1[[...objArr2_1.keys()][objArr2_1.length -1]];
	if (min1['bounded'] !== min2['bounded']) {
		return null;
	}
	if (min1['bound'][0] !== min2['bound'][0]) {
		return null;
	}
	if (max1['bound'][1] !== max2['bound'][1]) {
		return null;
	}

	//check if their bounds are differnt by points
	var r_i = Cart2D_boundsDiffByPoints(objArr1_1, objArr2_1);
	var i_r = Cart2D_boundsDiffByPoints(objArr2_1, objArr1_1);

	if (r_i != null || i_r != null) {
		return {
			'r_minus_i': r_i, 
			'i_minus_r': i_r
		};
	}
	return null;
}

/* 
 * returns an array of point objs if their bounds are different
 * by point values and null otw. Points we return are those that 
 * exist in objArr1 but not in objArr2.
 * ASSUME: their bounds are sorted and all graphs are equivalent.
 */
export function Cart2D_boundsDiffByPoints(objArr1, objArr2) {
	var objArr1_1 = JSON.parse(JSON.stringify(objArr1));
	var objArr2_1 = JSON.parse(JSON.stringify(objArr2));
	points = array();
	mathTree = objArr1_1[0]['mathTree']; //this mathTree should be equi for all bounds 
	
	//check the minimum end points
	var o1 = objArr2_1[0];
	var o2 = objArr1_1[0];
	if (Number.isFinite(o1['bound'][0]) && !o1['endPoints'][0] && o2['endPoints'][0]) {
		var pt = Cart2D_createPointObj(mathTree, o1['bound'][0]);
		points.push(pt);
	}

	//check the maximum end points
	var o1 = objArr2_1[[...objArr2_1.keys()][objArr2_1.length - 1]];
	var o2 = objArr1_1[[...objArr1_1.keys()][objArr1_1.length - 1]];
	if (Number.isFinite(o1['bound'][1]) && !o1['endPoints'][1] && o2['endPoints'][1]) {
		var pt = Cart2D_createPointObj(mathTree, o1['bound'][1]);
		points.push(pt);
	}

	//check points in the middle
	for (var i = 0; i < objArr2_1.length - 1; i++) {
		o1 = objArr2_1[i];
		o2 = objArr2_1[i + 1];

		//ASSUME: both are bounded (otw, we will have only one obj)
		//and their endPoints are both false (otw, they would've been combined)
		if (o1['bound'][1] === o2['bound'][0]) {
			var pt = Cart2D_createPointObj(mathTree, o1['bound'][1]);
			for (var obj1 of objArr1_1) {
				if (Cart2D_pointBelong2Eqn(pt, obj1)) {
					points.push(pt);
					break;
				}
			}
		}
	}

	if (points.length === 0) {
		return null;
	}
	return points;
}

export function Cart2D_createPointObj(mathTree, x) {
	var mathTree_1 = JSON.parse(JSON.stringify(mathTree));
	var y = Cart2D_evaluateYValue(mathTree_1, x); 
	var pt = {
		'type': 'point', 
		'value': [x, y], 
		'isFill': true
	};
	return pt;
}

export function Cart2D_evaluateYValue(A, x) {
	var A_1 = JSON.parse(JSON.stringify(A));
	if (!Array.isArray(A_1)) {
		A_1 = Relation_LatexToTree(A_1);
	}
	if (Array.isArray(A_1)&& A[0] == 'equation') {

	} else {
		return false;
	}
	var y = Cart2D_evaluateExWithValue(A_1[2], {'x': x});

	return y[0];
}


import {Relation_compTree} from '../rc/function_169.inc.js';
// option => ["single", "eqeq", "simp", "simp", 0]
export function Cart2D_checkMath(right, input) {
	var right_1 = JSON.parse(JSON.stringify(right));
	var input_1 = JSON.parse(JSON.stringify(input));
    var treeRight;
	if (!Array.isArray(right_1)) {
        treeRight = Relation_LatexToTree(right_1);
    } else {
        treeRight = right_1;
    }

	var treeInput;
    if (!Array.isArray(input_1)) {
        treeInput = Relation_LatexToTree(input_1);
    } else {
        treeInput = input_1;
    }

	//console.log(JSON.stringify(treeRight, null, 4));
	//console.log(JSON.stringify(treeInput, null, 4));
	
    
    if (treeRight && treeInput) {
	
	} else {
		return false;
	}
    var orgRight = Cart2D_organizeMathTree(treeRight);
    var orgInput = Cart2D_organizeMathTree(treeInput);
	/*
	console.log(JSON.stringify(orgRight, null, 4));
	console.log(JSON.stringify(orgInput, null, 4));
	console.log('..........');
	*/
    if (orgRight && orgInput) {
        return Relation_compTree(orgRight, orgInput);
	} else {
        return false;
	}
}


var object = {
	"type": "Cartesian2D",
	"object": [
	  {
		"type": "Grid2D",
		"value": [
			[
				-2,
				-1.5,
				-1,
				-0.5,
				0,
				0.5,
				1,
				1.5,
				2,
				2.5,
				3,
				3.5,
				4,
				4.5,
				5,
				5.5,
				6,
				6.5,
				7,
				7.5,
				8,
				8.5,
				9,
				9.5,
				10
			],
			[
				-6,
				-5.5,
				-5,
				-4.5,
				-4,
				-3.5,
				-3,
				-2.5,
				-2,
				-1.5,
				-1,
				-0.5,
				0,
				0.5,
				1,
				1.5,
				2,
				2.5,
				3,
				3.5,
				4,
				4.5,
				5,
				5.5,
				6
			]
			]
		},
		{
			"type": "GridLabel2D",
			"value": [
			[
				[
					-1,
					{
						"type": "Static",
						"mode": "math",
						"value": "-1"
					}
				],
				[
					1,
					{
						"type": "Static",
						"mode": "math",
						"value": "1"
					}
				],
				[
					2,
					{
						"type": "Static",
						"mode": "math",
						"value": "2"
					}
				],
				[
					3,
					{
						"type": "Static",
						"mode": "math",
						"value": "3"
					}
				],
				[
					4,
					{
						"type": "Static",
						"mode": "math",
						"value": "4"
					}
				],
				[
					5,
					{
						"type": "Static",
						"mode": "math",
						"value": "5"
					}
				],
				[
					6,
					{
						"type": "Static",
						"mode": "math",
						"value": "6"
					}
				],
				[
					7,
					{
						"type": "Static",
						"mode": "math",
						"value": "7"
					}
				],
				[
					8,
					{
						"type": "Static",
						"mode": "math",
						"value": "8"
					}
				],
				[
					9,
					{
						"type": "Static",
						"mode": "math",
						"value": "9"
					}
				]
			],
			[
				[
					-5,
					{
						"type": "Static",
						"mode": "math",
						"value": "-5"
					}
				],
				[
					-4,
					{
						"type": "Static",
						"mode": "math",
						"value": "-4"
					}
				],
				[
					-3,
					{
						"type": "Static",
						"mode": "math",
						"value": "-3"
					}
				],
				[
					-2,
					{
						"type": "Static",
						"mode": "math",
						"value": "-2"
					}
				],
				[
					-1,
					{
						"type": "Static",
						"mode": "math",
						"value": "-1"
					}
				],
				[
					-0.42,
					{
						"type": "Static",
						"mode": "math",
						"value": "0"
					}
				],
				[
					1,
					{
						"type": "Static",
						"mode": "math",
						"value": "1"
					}
				],
				[
					2,
					{
						"type": "Static",
						"mode": "math",
						"value": "2"
					}
				],
				[
					3,
					{
						"type": "Static",
						"mode": "math",
						"value": "3"
					}
				],
				[
					4,
					{
						"type": "Static",
						"mode": "math",
						"value": "4"
					}
				],
				[
					5,
					{
						"type": "Static",
						"mode": "math",
						"value": "5"
					}
				]
			]
		],
		"option": {
		  	"offset": [
				[
					false,
					false
				],
				[
					false,
					false
				]
		  	],
			"gridLabel": [
				[
					-1,
					0,
					1,
					2,
					3,
					4,
					5,
					6,
					7,
					8,
					9
				],
				[
					-5,
					-4,
					-3,
					-2,
					-1,
					0,
					1,
					2,
					3,
					4,
					5
				]
			]
			}
		},
		{
			"type": "Axis2D",
			"value": [
				{
					"name": {
						"type": "Static",
						"mode": "math",
						"value": "x",
						"font": {
							"size": 1
						},
						"option": {
							"rotate": 0
						}
					},
					"visible": true
				},
				{
					"name": {
						"type": "Static",
						"mode": "math",
						"value": "y",
						"font": {
							"size": 1
						},
						"option": {
							"rotate": 0
						}
					},
					"visible": true
				}
			],
			"origin": false,
			"option": {
				"arrow": [
					[
						true,
						true
					],
					[
						true,
						true
					]
				],
				"offset": [
					[
						false,
						false
					],
					[
						false,
						false
					]
				]
			}
		},
	  	{
			"type": "Punctum",
			"input": false,
			"coord": [
				0.5,
				1
			],
			"isFill": true,
			"selected": false,
			"selectable": false,
			"movable": false,
			"color": 103
		},
		{
			"type": "Punctum",
			"input": false,
			"coord": [
				1,
				0
			],
			"isFill": true,
			"selected": false,
			"selectable": false,
			"movable": false,
			"color": 103
		},
		{
			"type": "Punctum",
			"input": false,
			"coord": [
				2,
				-1
			],
			"isFill": true,
			"selected": false,
			"selectable": false,
			"movable": false,
			"color": 103
		},
		{
			"type": "Punctum",
			"input": false,
			"coord": [
				4,
				-2
			],
			"isFill": true,
			"selected": false,
			"selectable": false,
			"movable": false,
			"color": 103
		},
		{
			"type": "Punctum",
			"input": false,
			"coord": [
				8,
				-3
			],
			"isFill": true,
			"selected": false,
			"selectable": false,
			"movable": false,
			"color": 103
		},
		{
			"type": "Objectum",
			"input": true,
			"mode": "Curve",
			"eqn": "y=-(Math.log(x)/Math.log(2))",
			"readex": "y=-(log[x,2,bln[T]])",
			"latex": "y=-\\log_{2}{x}",
			"bounded": false,
			"selected": false,
			"selectable": "single",
			"dashed": null,
			"color": 100,
			"eqnNew": "y=-(Math.log(x)/Math.log(2))",
			"eqnType": "Log",
			"RightAnswer": true
		}
	],
	"bound": [
		[
			-2,
			10
		],
		[
			-6,
			6
		]
	],
	"menu": [
	  
	],
	"menuOption": {
		"curveColor": [
			103
		],
		"pointColor": [
			103
		],
		"defaultPosition": "random",
		"bounded": false,
		"endPoint": [
			true,
			true
		],
		"bound": [
			-5,
			5
		]
	},
	"size": 1,
	"locianOptions": {
		"check": true,
		"answer": [
			{
				"type": "Curve2D",
				"equation": "y=-(Math.log(x)/Math.log(2))",
				"style": {
					"color": {
						"code": 3,
						"weight": "normalHard"
					},
					"dash": "none",
					"arrow": true
				},
				"domain": {
					"visible": true
				},
				"interaction": {
					"movable": "logarithmic",
					"selected": true
				}
			}
		]
	},
	"checkFlag": true
}