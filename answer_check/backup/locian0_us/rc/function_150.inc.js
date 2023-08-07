

import {organizeAnswerObj} from '../rc/functions.js';

export function compareSingleChoice(right = null, input = null) {
    var right_1 = JSON.parse(JSON.stringify(right));
    var input_1 = JSON.parse(JSON.stringify(input));
    if (right_1['type'] === 'SingleChoice' && input_1['type'] === 'SingleChoice') {
       
        
        var right_answer;
        if (Array.isArray(right_1['answer'])) {
            if (typeof right_1['answer'][0] != 'undefined') {
                right_answer = right_1['answer'][0];
            } else
                right_answer = -1;
        } else {
            right_answer = right_1['answer'];
        }
        
        var input_answer;
        if (Array.isArray(input_1['answer'])) {
            if (typeof input_1['answer'][0] != 'undefined') { 
                input_answer = input_1['answer'][0];
            } else {
                input_answer = -1;
            }
        } else {
            input_answer = input_1['answer'];
        }
        
        return JSON.stringify(right_answer) === JSON.stringify(input_answer);
    }

    return false;
}

export function SingleChoice_getAnswer(object, answer, checktypeDefault) {
    var object_1 = JSON.parse(JSON.stringify(object));
    var checktypeDefault_1 = JSON.parse(JSON.stringify(checktypeDefault));
    if (typeof object_1['type'] == 'undefined' || object_1['type'] != 'SingleChoice') {
        return object_1;
    }
    // 내부의 요소가 다른 오브젝트 유형으로 정답 체크 필요할 때, 
    // 정답 전체의 레퍼런스를 받아서 organizeAnswerObj() 로 넘길 것

    var tempanswer = Array.isArray(object_1['answer']) ? typeof object_1['answer'][0] != 'undefined' ? parseInt(object_1['answer'][0]) : -1 : parseInt(object_1['answer']);
    organizeAnswerObj(object_1['choices'][tempanswer], answer, checktypeDefault_1);

    
    
    return object_1;
}

var object = {
    "type": "SingleChoice",
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
        2
    ]
}