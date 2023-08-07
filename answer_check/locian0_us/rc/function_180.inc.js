import {organizeAnswerObj} from '../rc/functions.js';

export function compareSpan(right = null, input = null) {
    var right_1 = JSON.parse(JSON.stringify(right));
    var input_1 = JSON.parse(JSON.stringify(input));
    

    return true;
}

export function Span_getAnswer(object, answer, checktypeDefault) {
    var object_1 = JSON.parse(JSON.stringify(object));
    var checktypeDefault_1 = JSON.parse(JSON.stringify(checktypeDefault));
    if (typeof object_1['type'] == 'undefined' || object_1['type'] != 'Span') {
        return object_1;
    }
    organizeAnswerObj(object_1['value'], answer, checktypeDefault_1);
    
    
    return object_1;
}