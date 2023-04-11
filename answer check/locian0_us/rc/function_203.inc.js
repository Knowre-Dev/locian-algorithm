import {organizeAnswerObj} from '../rc/functions.js';

export function compareCircleGraph(right = null, input = null) {
    return true;
}

function CircleGraph_getAnswer(object, answer, checktypeDefault) {
    var object_1 = JSON.parse(JSON.stringify(object));
    organizeAnswerObj(object_1['labels'], answer, checktypeDefault);
    organizeAnswerObj(object_1['legend']['elements'], answer, checktypeDefault);
    
    return object_1;
}