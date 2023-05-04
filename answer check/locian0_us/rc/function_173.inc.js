import {organizeAnswerObj} from '../rc/functions.js';

export function compareChart(right = null, input = null) {
    var right_1 = JSON.parse(JSON.stringify(right));
    var input_1 = JSON.parse(JSON.stringify(input));
    
    
    return true;
}




export function Chart_getAnswer(object, answer, checktypeDefault) {
    var object_1 = JSON.parse(JSON.stringify(object));
    var checktypeDefault_1 = JSON.parse(JSON.stringify(checktypeDefault));
    if (typeof object_1['type'] == 'undefined' || object_1['type'] != 'Chart') {
        return object_1;
    }
    if (typeof object_1['answer'] != 'undefined') {
        for (var a of object_1['answer']) {
            answer['ChartGraph'].push(a);
        }
    } else {
        organizeAnswerObj(object_1['elements'], answer, checktypeDefault_1);
    }
    organizeAnswerObj(object_1['grid'], answer, checktypeDefault_1);
    
   
    return object_1;
}