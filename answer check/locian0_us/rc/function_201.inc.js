

export function compareImage2D(right = null, input = null) {
    var right_1 = JSON.parse(JSON.stringify(right));
    var input_1 = JSON.parse(JSON.stringify(input));
    //fb(right_1, 'right_Image2D_ahjin');
    //fb(input_1, 'user_Image2D_ahjin');
    
    var rightArr = Image2D_getInfo_right(right_1);
    var inputArr = Image2D_getInfo_input(input_1);
    
    var result = true;
    if (typeof rightArr['coords'] != 'undeinfed') {
        result &= rightArr['coords']['x'] == inputArr['coords']['x'] && 
        rightArr['coords']['y'] == inputArr['coords']['y'];
    }
    
    if (typeof rightArr['rotate'] != 'undefined') {
        result &= rightArr['rotate'] == inputArr['rotate'];
    }

    return result;
}

export function Image2D_getAnswer(object, answer, checktypeDefault) {
    var object_1 = JSON.parse(JSON.stringify(object));
    //fb(object_1, object_1['type'] + 'Aihua');
    
    return object_1;
}


export function Image2D_getInfo_right(right) {
    var right_1 = JSON.parse(JSON.stringify(right));
    var arr = new Object();
    if (typeof right_1['locianOptions']['check'] != 'undefined' && 
        right_1['locianOptions']['check']) {
        if (typeof right_1['locianOptions']['coords'] != 'undefined') {
            arr['coords'] = right_1['locianOptions']['coords'];
        }
        if (typeof right_1['locianOptions']['rotate'] != 'undefined') {
            arr['rotate'] = right_1['locianOptions']['rotate'];
        }
    }
    
    return arr;
}

export function Image2D_getInfo_input(input) {
    var input_1 = JSON.parse(JSON.stringify(input));
    return {
        'coords': input_1['coords'],
        'rotate': input_1['rotate']
    };
}