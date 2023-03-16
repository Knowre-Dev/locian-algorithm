

export function compareGeometry2D(right = null, input = null) {
    var right_1 = JSON.parse(JSON.stringify(right));
    var input_1 = JSON.parse(JSON.stringify(input));
    if (right_1['type'] === 'Geometry2D' && 
        input_1['type'] === 'Geometry2D') {
        //fb(right_1, 'right_Geometry2D_ahjin');
        //fb(input_1, 'user_Geometry2D_ahjin');
        
        var right_keys = Geometry2D_getInfo(right);
        var input_keys = Geometry2D_getInfo(input);
        //fb(right_keys, 'right_Geometry2D_getInfo_ahjin');
        //fb(input_keys, 'user_Geometry2D_getInfo_ahjin');
        
        if (right_keys.length !== input_keys.length) {
            return false;
        }
        right_keys.sort();
        input_keys.sort();
        
        return JSON.stringify(right_keys) === JSON.stringify(input_keys);
    }

    return false;
}

export function Geometry2D_getAnswer(object) {
    var object_1 = JSON.parse(JSON.stringify(object));
    //fb(object_1, object_1['type'] + 'Aihua');
    return object_1;
}

export function Geometry2D_getInfo(geoObj) {
    var geoObj_1 = JSON.parse(JSON.stringify(geoObj));
    var result = [];
    for (var [k, obj] of geoObj_1['object'].entries()) {
        if (typeof obj['selectable'] != 'undefined' && obj['selectable']) {
            if (typeof obj['selectedAnswer'] != 'undefined' && obj['selectedAnswer']) {
                result.push(k);
            } else if (typeof obj['selected'] != 'undefined' && obj['selected']) {
                result.push(k);
            }
        } 
    }
    return result;
}