import {organizeAnswerObj} from '../rc/functions.js';

export function compareBlock(right = null, input = null) {
    var right_1 = JSON.parse(JSON.stringify(right));
    var input_1 = JSON.parse(JSON.stringify(input));
   
    return true;
}

export function Block_getAnswer(object, answer, checktypeDefault) {
    var object_1 = JSON.parse(JSON.stringify(object));
    var checktypeDefault_1 = JSON.parse(JSON.stringify(checktypeDefault));
    if (typeof object_1['type'] == 'undefined' || object_1['type'] != 'Block') {
        return object_1;
    }
    organizeAnswerObj(object_1['value'], answer, checktypeDefault_1);
   
    
    return object_1;
}

//this => block
function getObject() {
    var option = new Object();
    if (typeof this.width != 'undefined') { 
        option['width'] = this.width; 
    }
    option['align'] = this.align;
    option['textAlign'] = this.textAlign;
    option['border'] = this.border;
    option['mode'] = this.mode;
    if (typeof this.title != 'undefined') {
        option['title'] = this.title;
    }
    option['vertAlign'] = this.vertAlign;
    var result = {
        'type': 'Block',
        'value': this.data,
        'option': option
};
    return result;
}