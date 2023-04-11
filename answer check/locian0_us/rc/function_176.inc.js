import {organizeAnswerObj} from '../rc/functions.js';

export function comparePartial(right = null, input = null) {
    var right_1 = JSON.parse(JSON.stringify(right));
    var input_1 = JSON.parse(JSON.stringify(input));
    //fb(right_1, 'right_Partial_ahjin');
    //fb(input_1, 'user_Partial_ahjin');

    return true;
}

export function Partial_getAnswer(object, answer, checktypeDefault) {
    var object_1 = JSON.parse(JSON.stringify(object));
    if (typeof object['elements'] != 'undefined') {  // classic
        organizeAnswerObj(object_1['elements'], answer, checktypeDefault);
    } else { // old
        organizeAnswerObj(object_1['object'], answer, checktypeDefault);
    }
    
    //fb(object, object_1['type'] + 'Aihua');
    
    return object_1;
}


var object = {
    "type": "Partial",
    "value": "3\\times \\frac{5}{8}= \\editable{}",
    "object": [
        {
            "type": "Input",
            "mode": "math",
            "value": "",
            "option": {
                "order": 0,
                "width": 2,
                "height": 2,
                "answerType": "0",
                "lacoType": "2",
                "whitelist": [],
                "blacklist": [],
                "grammar": "default_up"
            },
            "content": "\\frac{15}{8}",
            "size": {
                "width": 2
            }
        }
    ],
    "content": "3\\times \\frac{5}{8}= \\editable{}"
};






function json(expo = SINOD_EXPORT_TYPE_NEW) {
    var json;
    switch(expo) {
        case 0:
            json = {
                'type': 'Partial',
                'value': this.value,
                'object': this.elements 
            };
            break;
            
        case 1:
            var args = this.arguments;
            var color = Object.entries(
                {
                    'text': 'color' in args ? parent.getColorObject(this.color) : null,
                    'background': 'backgroundColor' in args ? parent.getColorObject(this.backgroundColor) : null
                }
            ).filter(
                ([k, v]) =>  ![null, undefined].includes(v)
            );
            var decoration = Object.entries(
                {
                    'underline': 'underline' in args ? this.underline : null,
                    'blod': 'bold' in args ? this.bold : null,
                    'italic': 'italic' in args ? this.italic : null
                }
            ).filter(
                ([k, v]) => ![null, undefined].includes(v)
            );
            var font = Object.entries(
                {
                    'color': color,
                    'size': 'size' in args ? this.size : null,
                    'decoration': decoration
                }
            ).filter(
                ([k, v]) => ![null, undefined, 0, '', '0'].includes(v)
            );
            var position = Object.entries(
                {
                    'top': 'position' in args ? this.position['top'] : null,
                    'left': 'position' in args ? this.position['left'] : null
                }
            ).filter(
                ([k, v]) => ![null, undefined].includes(v)
            );

            //return value
            json = Object.entries(
                {
                    'type': 'Partial',
                    'content': this.value + '',
                    'elements': this.elements,
                    'font': font,
                    'position': position
                }
            ).filter(
                ([k, v]) => ![null, undefined, 0, '', '0'].includes(v)
            );

            break;
    }

   
    return json;
}