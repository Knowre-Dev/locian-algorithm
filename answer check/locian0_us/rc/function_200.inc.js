

export function compareShade(right = null, input = null) {
    var right_1 = JSON.parse(JSON.stringify(right));
    var input_1 = JSON.parse(JSON.stringify(input));
    //fb(right_1, 'right_Shade_ahjin');
    //fb(input_1, 'user_Shade_ahjin');
    
    var rightArr = Shade_getInfo(right_1);
    var inputArr = Shade_getInfo(input_1);
    
    var countRight = 0;
    for (var rShade of rightArr) {
        countRight += rShade['locianOptions']['selectedCells'].length;
    }
    
    var countInput = 0;
    for (var iShade of inputArr) {
        countInput += iShade['selectedCells'].length;
    }

    return countRight === countInput;
}

export function Shade_getAnswer(object, answer, checktypeDefault) {
    var object_1 = JSON.parse(JSON.stringify(object));
    //fb(object_1, object_1['type'] + 'Aihua');
    
    return object_1;
}

export function Shade_getInfo(object) {
    var object_1 = JSON.parse(JSON.stringify(object));
    var objArr = [];
    if (object_1['type'] == 'Shade') {
        if (typeof object_1['objs'] != 'undeinfed') {
            for (var shade of object_1['objs']) {
                if (typeof shade['locianOptions']['check'] != 'undefined' && shade['locianOptions']['check']) {
                    objArr.push(shade);
                }
            }
        } else {
            objArr.push(object);
        }
    }
    
    return objArr;
}
