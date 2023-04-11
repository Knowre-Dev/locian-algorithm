import {organizeAnswerObj} from '../rc/functions.js';

export function compareLayer(right = null, input = null) {
    var right_1 = JSON.parse(JSON.stringify(right));
    var input_1 = JSON.parse(JSON.stringify(input));
    //fb(right_1, 'right_Layer_ahjin');
    //fb(input_1, 'user_Layer_ahjin');

    return true;
}

export function Layer_getAnswer(object, answer, checktypeDefault) {
    var object_1 = JSON.parse(JSON.stringify(object));
    if (typeof object_1['elements'] != 'undefined') {
        for (var element of object_1['elements']) {
            if (element['type'] == 'Shade') {
                var objs;
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
                organizeAnswerObj(element, answer, checktypeDefault);
            }
        }
    } else if (typeof object_1['target'] != 'undefined') {
        organizeAnswerObj(object_1['target'][0]['object'], answer, checktypeDefault);
    }
    
    //fb(object_1, object_1['type'] + 'Aihua');
    return object_1;
}

//this => layer

function json(expo = SINOD_EXPORT_TYPE_NEW) {
    var json;
    switch(expo) {
        case 0:
            json = {
                'type': 'Layer',
                'source': this.background,
                'target': this.elements
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
                ([k, v]) => ![null, undefined].includes(v)
            );

            var position = Object.entries(
                {
                    'top': this.position['top'],
                    'left': this.position['left']
                }   
            ).filter(
                ([k, v]) => ![null, undefined].includes(v)
            );

            var size = Object.entries(
                {
                    'width': this.size['width'],
                    'height': this.size['height']
                }
            ).filter(
                ([k, v]) => ![null, undefined].includes(v)
            );

            //return value
            json = Object.entries(
                {
                    'type': 'Layer',
                    'position': position,
                    'margin': margin ,
                    'source': this.background,
                    'elements': this.elements,
                    'display': this.display,
                    'size': size
                }
            ).filter(
                ([k, v]) => ![null, undefined, 0, '', '0'].includes(v)
            );
            break;
    }
    return json;
}