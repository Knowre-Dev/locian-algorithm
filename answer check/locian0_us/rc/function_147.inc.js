


export function compareClock(right = null, input = null) {
    var right_1 = JSON.parse(JSON.stringify(right));
    var input_1 = JSON.parse(JSON.stringify(input));
    if (right_1['type'] === 'Clock' && input_1['type'] === 'Clock') {
        
        
        right_1 = Clock_getInfo(right_1);
        input_1 = Clock_getInfo(input_1);
        
        right_1 = right_1.join(':');
        input_1 = input_1.join(':');
        
        return right_1 === input_1;
    }

    return false;
}

export function Clock_getInfo(clockObj) {
    var clockObj_1 = JSON.parse(JSON.stringify(clockObj));
    var result = [];
    if (typeof clockObj_1['answer'] != 'undefined') {  // from right answer
        for (var [k, menu] of clockObj_1['menu'].entries()) {
            if (['hour', 'minute', 'second'].includes(menu)) { 
                result.push(clockObj_1['answer'][k]);
            }
        }
    } else {   // from student's answer
        for (var menu of clockObj_1['menu']) {
            if (['hour', 'minute', 'second'].includes(menu)) {
                result.push(clockObj_1[menu]);
            }
        }
    }
   
    return result;
}

export function Clock_getAnswer(object) {
    var object_1 = JSON.parse(JSON.stringify(object));
    
    return object_1;
}

var object = {
    "type": "Clock",
    "ratio": 1,
    "menu": [
        "hour",
        "minute",
        null
    ],
    "view": [
        true,
        true,
        false
    ],
    "hour": 0,
    "minute": 0,
    "second": 0,
    "style": {
        "number": {
            "fontSize": 24
        }
    },
    "answer": [
        4,
        30,
        null
    ]
}


