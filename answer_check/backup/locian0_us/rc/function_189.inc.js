



import {organizeAnswerObj} from '../rc/functions.js';

export function compareDotPlot1D(right = null, input = null) {
    var right_1 = JSON.parse(JSON.stringify(right));
    var input_1 = JSON.parse(JSON.stringify(input));
    if (right_1['type'] === 'DotPlot1D' && input_1['type'] === 'DotPlot1D') {
      
        var right_data = DotPlot1D_getInfo(right_1, true);
        var input_data = DotPlot1D_getInfo(input_1, false);
    
        if (right_data === false && input_data === false) {
            return true;
        }
        if (right_data === false || input_data === false) {
            return false;
        }
        
        if (right_data['interaction'] === 'range') {
            if (JSON.stringify(right_data['coord']) !== JSON.stringify(input_data['coord'])) {
                return false;
            }
            var counttrue = 0;
            for (var dot of input_data['dots']) {
                if (dot['selected']) {
                    counttrue++;
                } else {
                    break;
                }
            }
            if (right_data['dots'] !== counttrue) {
                return false;
            }
        }
    }

    return true;
}

export function DotPlot1D_getAnswer(object, answer, checktypeDefault) {
    var checktypeDefault_1 = JSON.parse(JSON.stringify(checktypeDefault));
    var object_1 = JSON.parse(JSON.stringify(object));
    if (typeof object_1['type'] == 'undefined' || object_1['type'] != 'DotPlot1D') {
        return object_1;
    }
    if (typeof object_1['stacks'] != 'undefined') {
        for (var stack of object_1['stacks']) {
            organizeAnswerObj(stack, answer, checktypeDefault_1);
        }
    }
    

    
    return object_1;
}

export function DotPlot1D_getInfo(object, answer = true) {
    var object_1 = JSON.parse(JSON.stringify(object));
    if (typeof object_1['locianOptions'] != 'undefined' && 
        typeof object_1['locianOptions']['check'] == 'undefined' || 
        !object_1['locianOptions']['check']) {
        return false;
    }
    if (answer) { 
        return object_1['locianOptions']['answer']; 
    }
    return object_1;
}

var object = {
    "type": "DotPlot1D",
    "coord": -3,
    "count": 10,
    "start": 0.5,
    "style": {
        "size": 0.4,
        "color": {
            "code": 1
        }
    },
    "locianOptions": {
        "check": true,
        "answer": {
            "interaction": "range",
            "coord": -3,
            "dots": 3
        }
    },
    "interaction": "range"
}