import {organizeAnswerObj} from '../rc/functions.js';

export function compareTable(right = null, input = null) {
    var right_1 = JSON.parse(JSON.stringify(right));
    var input_1 = JSON.parse(JSON.stringify(input));
    
    return true;
}

export function Table_getAnswer(object, answer, checktypeDefault) {
    var object_1 = JSON.parse(JSON.stringify(object));
    var checktypeDefault_1 = JSON.parse(JSON.stringify(checktypeDefault));
    if (typeof object_1['type'] == 'undefined' || object_1['type'] != 'Table') {
        return object_1;
    }
    if (typeof object_1['locianOptions'] != 'undefined' && 
        typeof object_1['locianOptions']['type'] != 'undefined' && 
        object_1['locianOptions']['type'] === 'Stack' && 
        typeof object['locianOptions']['willAllow'] != 'undefined') {
        var willAllow = object_1['locianOptions']['willAllow'];
        
        var objArr = [];
        for (var eachRow of object_1['cells']) {
            for (var cell of eachRow) {
                if (cell['elements'][0]['type'] === 'Stack') {
                    objArr = objArr.concat(cell['elements']);
                } else {
                    organizeAnswerObj(cell['elements'], answer, checktypeDefault_1);
                }
            }
        }
        
        if (typeof answer['Stack'][0]['pattern'] != 'undefined') {
            objArr = answer['Stack'][0]['pattern'].concat(objArr);
        }
        
        var pattern = {
            'type': 'Stack',
            'pattern': objArr,
            'willAllow': willAllow
        };
        answer['Stack'] = [pattern];
    } else if (typeof object_1['locianOptions'] != 'undefined' && 
            typeof object_1['locianOptions']['type'] != 'undefined' && 
            object_1['locianOptions']['type'] == 'Stack' && 
            typeof object_1['locianOptions']['order'] != 'undefined' && 
            object_1['locianOptions']['order'] === true) {
        var objArr = [];
        for (var eachRow of object_1['cells']) {
            for (var cell of eachRow) {
                if (cell['elements'][0]['type'] === 'Stack') {
                    objArr = objArr.concat(cell['elements']);
                } else {
                    organizeAnswerObj(cell['elements'], answer, checktypeDefault_1);
                }
            }
        }
        
        var obj = {
            'type': 'Stack',
            'objs': objArr
        };
        answer['Stack'] = [obj];
    } else {
        for (var eachRow of object_1['cells']) {
            for (var cell of eachRow) {
                for (var element of cell['elements']) {
                    if (element['type'] == 'Shade') {
                        var objs = [];
                        if (typeof answer['Shade'][0]['objs'] != 'undefined') {
                            objs = answer['Shade'][0]['objs'];
                            objs.push(element);
                        } else {
                            objs = [element];
                        }
                        
                        var shade = {
                            'type': 'Shade',
                            'objs': objs
                        };
                        
                        answer['Shade'] = [shade];
                    } else {
                        organizeAnswerObj(element, answer, checktypeDefault_1);
                    }
                }
            }
        }
    }    
    
    return object_1;
}




//LP_Table
//this => table
function json(expo = SINOD_EXPORT_TYPE_NEW){
    var json = new Object();
    switch(expo) {
        case 0:
            json = {
                'type': 'Lattice',
                'value': this.cells
            };
            break;
            
        case 1:
            var margin = Object.entries(
                {
                    'top': this.margin['top'], 
                    'bottom': this.margin['bottom'], 
                    'left': this.margin['left'], 
                    'right': this.margin['right']
                }
            ).filter(
                ([k, v]) => typeof v != 'undefined'
            );

            var position = Object.entries(
                {
                    'top': this.position['top'],
                    'left': this.position['left']
                }
            ).filter(
                ([k, v]) => typeof v != 'undefined'
            );

            var size = Object.entries(
                {
                    'width': this.size['width'],
                    'height': this.size['height']
                }
            ).filter(
                ([k, v]) => typeof v != 'undefined'
            );

            //return value
            json = Object.entries(
                {
                    'type': 'Table',
                    'position': position,
                    'margin': margin ,
                    'cells': this.cells,
                    'display': this.display,
                    'size': size,
                    'dynamic': this.dynamic
                },
            ).filter(
                ([k, v]) =>  ![null, undefined, 0, '', '0'].includes(v)
            );
            break;
    }
}