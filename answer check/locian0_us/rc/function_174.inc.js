import {organizeAnswerObj} from '../rc/functions.js';

export function compareGridChart(right = null, input = null) { 
    var right_1 = JSON.parse(JSON.stringify(right));
    var input_1 = JSON.parse(JSON.stringify(input));
    
    
    return true;
}

export function GridChart_getAnswer(object, answer, checktypeDefault) {
    var object_1 = JSON.parse(JSON.stringify(object));
    organizeAnswerObj(object_1['labels']['x']['values'], answer, checktypeDefault);
    organizeAnswerObj(object_1['labels']['y']['values'], answer, checktypeDefault);
    organizeAnswerObj(object_1['labels']['x']['customLabel'], answer, checktypeDefault);
    organizeAnswerObj(object_1['labels']['y']['customLabel'], answer, checktypeDefault);
    
    
    return object_1;
}