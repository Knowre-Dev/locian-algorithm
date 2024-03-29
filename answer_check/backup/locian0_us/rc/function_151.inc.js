


import {organizeAnswerObj} from '../rc/functions.js';

export function compareMultipleChoice(right = null, input = null) {
    var right_1 = JSON.parse(JSON.stringify(right));
    var input_1 = JSON.parse(JSON.stringify(input));
    if (right_1['type'] === 'MultipleChoice' && input_1['type'] === 'MultipleChoice') {
       
        var right_answer;
        if (Array.isArray(right_1['answer'])) {
            if (!right_1['answer']) {
                right_answer = [-1];
            } else {
                right_answer = right_1['answer'];
            }
        } else {
            right_answer = [right_1['answer']];
        }

        var input_answer;
        if (Array.isArray(input_1['answer'])) {
            if (!input_1['answer']) {
                input_answer = [-1];
            } else {
                input_answer = input_1['answer'];
            }
        } else {
            input_answer = [input_1['answer']];
        }
        
        right_answer.sort();
        input_answer.sort();
        return right_answer.join('') === input_answer.join('');
    }

    return false;
}

export function MultipleChoice_getAnswer(object, answer, checktypeDefault) {
    var object_1 = JSON.parse(JSON.stringify(object));
    var checktypeDefault_1 = JSON.parse(JSON.stringify(checktypeDefault));
    if (typeof object_1['type'] == 'undefined' || object_1['type'] != 'MultipleChoice') {
        return object_1;
    }
    var keys = object_1['answer'];
    if (!Array.isArray(keys)) {
        keys = [keys];
    }
    
    if (keys.length != 0) {
        for (var [k, choice] of object_1['choices'].entries()) {
            if (keys.includes(k.toString())) {
                organizeAnswerObj(choice, answer, checktypeDefault_1);
            }
        }
    }

    
    
    return object_1;
}

var object = {
    "type": "MultipleChoice",
    "choices": [
        {
            "type": "Text",
            "content": "red"
        },
        {
            "type": "Text",
            "content": "yellow"
        },
        {
            "type": "Text",
            "content": "blue"
        },
        {
            "type": "Text",
            "content": "pink"
        },
        {
            "type": "Text",
            "content": "purple"
        }
    ],
    "answer": [
        0,
        2
    ]
}