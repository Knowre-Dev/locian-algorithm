













export function compareDropzone(right = null, input = null) {
    var right_1 = JSON.parse(JSON.stringify(right));   
    var input_1 = JSON.parse(JSON.stringify(input));
    if (right_1['type'] === 'Dropzone' && input_1['type'] === 'Dropzone') {
        var right_answer = Dropzone_getInfo(right_1);
        var input_answer = Dropzone_getInfo(input_1);
        
        if (right_answer === false && input_answer === false) {
            return true;
        }
        if (right_answer === false || input_answer === false) {
            return false;
        }
        
        
        
        var result = Dropzone_compObjs(right_answer, input_answer);
        return result;
    }

    return false;
}

export function Dropzone_getAnswer(object) {
    var object_1 = JSON.parse(JSON.stringify(object));
    if (JSON.stringify(object_1) === '{}' || object_1['type'] != 'Dropzone') {
        return false;
    }
    if (typeof object_1['locianOptions']['check'] != 'undefined' && 
        object_1['locianOptions']['check']) {
    }
    
    return object_1;
}

// temperarily don't need this
export function Dropzone_sort_by_order(arr) {
    var arr_1 = JSON.parse(JSON.stringify(arr));
    var order = [];
    for (var e of arr_1) {
        if (typeof e['order'] != 'undefined') {
            order.push(e['order']);
        }
    }
    
    var result = new Object();
    var order_1 = []
    for (var v of order) {
        var is_unique = true;
        for (var v_1 of order_1) {
            if (JSON.stringify(v) == JSON.stringify(v_1)) {
                is_unique = false;
                break
            }
        }
        if (is_unique) {
            order_1.push(v);
        }
    }
    order = order_1;
    order.sort();
    
    if (order.length != 0) {
        for (var o of order) {
            result[o] = [];
            for (var e of arr) {
                if (JSON.stringify(o) === JSON.stringify(e['order'])) {
                    result[o].push(e);
                }
            }
        }
    } else {
        for (var e of arr_1) {
            result.push([e]);
        }
    }
    
    return result;
}

export function Dropzone_usort(a, b) {
    var a_1 = JSON.parse(JSON.stringify(a));
    var b_1 = JSON.parse(JSON.stringify(b));
    switch (a_1['type']) {
        case 'Image':
            return a_1['url'] > b_1['url'];
        
        case 'Math':
        case 'Text':
            return a_1['content'] > b_1['content'];
        
        case 'Box':
            var result = true;
            for (var [k, ea] of a_1['elements'].entries()) {
                result &= Dropzone_usort(ea, b_1['elements'][k]);
            }
            return result;
        
        case 'Clock':
            var result = true;
            result &= a_1['hour'] > b_1['hour'];
            result &= a_1['minute'] > b_1['minute'];
            result &= a_1['second'] > b_1['second'];
            return result;
    }
}

export function Dropzone_compObjs(right_answer, input_answer) {
    var right_answer_1 = JSON.parse(JSON.stringify(right_answer));
    var input_answer_1 = JSON.parse(JSON.stringify(input_answer));
    // ignore the color of the base ten blocks etc.
    // this is for easier comparing

    

    if (!right_answer_1['objs'] && !input_answer_1['objs']) {
        return true;
    }
    if (right_answer_1['objs'].length !== input_answer_1['objs'].length) {
        return false;
    }
    
    for (var [ko, obj] of right_answer_1['objs'].entries()) {
        var index = Dropzone_in_array(obj, right_answer_1['answerSet']);
        if (Number.isInteger(index)) {
            right_answer_1['objs'][ko] = right_answer_1['answerSet'][index][0];
        }
    } 
    
    for (var [ki, ibj] of input_answer_1['objs'].entries()) {
        var index = Dropzone_in_array(ibj, right_answer_1['answerSet'])
        if (Number.isInteger(index)) {
            input_answer_1['objs'][ki] = right_answer_1['answerSet'][index][0];
        }
    }
    
    var right_objs = right_answer_1['objs'];
    var input_objs = input_answer_1['objs'];
    right_objs.sort();
    input_objs.sort();
    right_objs.sort(Dropzone_usort);
    input_objs.sort(Dropzone_usort);
    
    for (var [k, robj] of right_objs.entries()) { // comparing
        if (Dropzone_sub_compObjs(robj, input_objs[k]) === false)
            return false;
    }
      
    return true;
}

export function Dropzone_sub_compObjs(a, b) {
    var a_1 = JSON.parse(JSON.stringify(a));
    var b_1 = JSON.parse(JSON.stringify(b));
    switch (a_1['type']) {
        case 'Image':
            return a_1['url'] === b_1['url'];
        
        case 'Math':
        case 'Text':
            return JSON.stringify(a_1['content']) === JSON.stringify(b_1['content']);
        
        case 'Box':
            for (var [k, ea] of a_1['elements'].entries()) {
                if (ea['type'] !== b_1['elements'][k]['type']) {
                    return false;
                }
                if (!Dropzone_sub_compObjs(ea, b_1['elements'][k])) {
                    return false;
                }
            }
            //return true; 
            return a_1['elements'].length === b_1['elements'].length;
        
        case 'Clock':
            if (a_1['hour'] !== b_1['hour']) {
                return false;
            }
            if (a_1['minute'] !== b_1['minute']) {
                return false;
            }
            if (a_1['second'] !== b_1['second']) {
                return false;
            }
            return true;
        
        default: 
            return true;
    }
}

export function Dropzone_in_array(obj, setArr) {
    var obj_1 = JSON.parse(JSON.stringify(obj));
    var setArr_1 = JSON.parse(JSON.stringify(setArr));
    switch (obj_1['type']) {
        case 'Image':
            for (var [k, set] of setArr_1.entries()) {
                for (var s of set) {
                    if (JSON.stringify(obj_1['url']) === JSON.stringify(s['url'])) {
                        return k;
                    }
                }
            }
            break;
        
        case 'Math':
        case 'Text':
            for (var [k, set] of setArr_1.entries()) {
                for (var s of set) {
                    if (JSON.stringify(obj['content']) === JSON.stringify(s['content'])) {
                        return k;
                    }
                }
            }
            break;
        
        default: 
            return false;
    }
}

export function Dropzone_getInfo(ddObj, order = null) {
    var ddObj_1 = JSON.parse(JSON.stringify(ddObj));
    
    if (typeof ddObj_1['locianOptions']['check'] != 'undefined' && 
        ddObj_1['locianOptions']['check']) {  
        var result = new Object();
        var elements = [];
        
        if (typeof ddObj_1['answer'] != 'undefined') {
            
            for (var ans of ddObj_1['answer']) {
                if (ans['type'] === 'Table') {
                    elements = elements.concat(Dropzone_getInfo_Table(ans));
                } else {
                    elements.push(ans);
                }
            }
            
            result = {
                'objs': elements,
                'answerSet': ddObj_1['answerSet']
            };
        } else {
            
            if (!ddObj_1['elements']) {  // from users
                for (var draggableObj of ddObj_1['elements']) {
                    if (draggableObj['elements'][0]['type'] === 'Table') {
                        elements = elements.concat(Dropzone_getInfo_Table(draggableObj['elements'][0]));
                    } else {
                        elements.push(draggableObj['elements'][0]);
                    }
                }
            }
            
            result = {
                'objs': elements,
                'answerSet': []
            };
        }
        
        if (typeof ddObj_1['locianOptions']['order'] != 'undefined') {
            result = {
                ...result, 
                ...{'order': ddObj_1['locianOptions']['order']}
            };
        } else if (order != null) {
            result = {
                ...result, 
                ...{'order': order + ''}
            };
        }
        
        return result;
    }
    
    return false;
}

export function Dropzone_getInfo_Table(table) {
    var table_1 = JSON.parse(JSON.stringify(table));
    var images = [];
    for (var row of table_1['cells']) {
        for (var cell of row) {
            for (var e of cell['elements']) {
                if (e['type'] === 'Image') {
                    images.push(e);
                } else if (e['type'] === 'Table') {
                    images = images.concat(Dropzone_getInfo_Table(e));
                }
            }
        }
    }
    
    return images;
}


var object = {
    "type": "Dropzone",
    "elements": [
        {
            "type": "DraggableObject",
            "elements": [
                {
                    "type": "Image",
                    "url": "https:\/\/contents.knowreapi.com\/us\/illust\/base_ten_ten.png"
                }
            ],
            "padding": {
                "top": 0.2,
                "bottom": 0.2,
                "left": 0.2,
                "right": 0.2
            }
        },
        { 
            "type": "DraggableObject",
            "elements": [
                {
                    "type": "Image",
                    "url": "https:\/\/contents.knowreapi.com\/us\/illust\/base_ten_ten.png"
                }
            ],
            "padding": {
                "top": 0.2,
                "bottom": 0.2,
                "left": 0.2,
                "right": 0.2
            }
        },
        {
            "type": "DraggableObject",
            "elements": [
                {
                    "type": "Image",
                    "url": "https:\/\/contents.knowreapi.com\/us\/illust\/base_ten_one.png"
                }
            ],
            "padding": {
                "top": 0.2,
                "bottom": 0.2,
                "left": 0.2,
                "right": 0.2
            }
        },
        {
            "type": "DraggableObject",
            "elements": [
                {
                    "type": "Image",
                    "url": "https:\/\/contents.knowreapi.com\/us\/illust\/base_ten_one.png"
                }
            ],
            "padding": {
                "top": 0.2,
                "bottom": 0.2,
                "left": 0.2,
                "right": 0.2
            }
        },
        {
            "type": "DraggableObject",
            "elements": [
                {
                    "type": "Image",
                    "url": "https:\/\/contents.knowreapi.com\/us\/illust\/base_ten_one.png"
                }
            ],
                "padding": {
                "top": 0.2,
                "bottom": 0.2,
                "left": 0.2,
                "right": 0.2
            }
        },
        {
            "type": "DraggableObject",
            "elements": [
                {
                    "type": "Image",
                    "url": "https:\/\/contents.knowreapi.com\/us\/illust\/base_ten_one.png"
                }
            ],
            "padding": {
                "top": 0.2,
                "bottom": 0.2,
                "left": 0.2,
                "right": 0.2
            }
        },
        {
            "type": "DraggableObject",
            "elements": [
                {
                    "type": "Image",
                    "url": "https:\/\/contents.knowreapi.com\/us\/illust\/base_ten_one.png"
                }
            ],
            "padding": {
                "top": 0.2,
                "bottom": 0.2,
                "left": 0.2,
                "right": 0.2
            }
        },
        {
            "type": "DraggableObject",
            "elements": [
                {
                    "type": "Image",
                    "url": "https:\/\/contents.knowreapi.com\/us\/illust\/base_ten_one.png"
                }
            ],
            "padding": {
                "top": 0.2,
                "bottom": 0.2,
                "left": 0.2,
                "right": 0.2
            }
        },
        {
            "type": "DraggableObject",
            "elements": [
                {
                    "type": "Image",
                    "url": "https:\/\/contents.knowreapi.com\/us\/illust\/base_ten_one.png"
                }
            ],
            "padding": {
                "top": 0.2,
                "bottom": 0.2,
                "left": 0.2,
                "right": 0.2
            }
        },
        {
            "type": "DraggableObject",
            "elements": [
                {
                    "type": "Image",
                    "url": "https:\/\/contents.knowreapi.com\/us\/illust\/base_ten_one.png"
                }
            ],
            "padding": {
                "top": 0.2,
                "bottom": 0.2,
                "left": 0.2,
                "right": 0.2
            }
        },
        {
            "type": "DraggableObject",
            "elements": [
                {
                    "type": "Image",
                    "url": "https:\/\/contents.knowreapi.com\/us\/illust\/base_ten_one.png"
                }
            ],
            "padding": {
                "top": 0.2,
                "bottom": 0.2,
                "left": 0.2,
                "right": 0.2
            }
        },
        {
            "type": "DraggableObject",
            "elements": [
                {
                    "type": "Image",
                    "url": "https:\/\/contents.knowreapi.com\/us\/illust\/base_ten_one.png"
                }
            ],
            "padding": {
                "top": 0.2,
                "bottom": 0.2,
                "left": 0.2,
                "right": 0.2
            }
        },
        {
            "type": "DraggableObject",
            "elements": [
                {
                    "type": "Image",
                    "url": "https:\/\/contents.knowreapi.com\/us\/illust\/base_ten_one.png"
                }
            ],
            "padding": {
                "top": 0.2,
                "bottom": 0.2,
                "left": 0.2,
                "right": 0.2
            }
        },
        {
            "type": "DraggableObject",
            "elements": [
                {
                    "type": "Image",
                    "url": "https:\/\/contents.knowreapi.com\/us\/illust\/base_ten_one.png"
                }
            ],
            "padding": {
                "top": 0.2,
                "bottom": 0.2,
                "left": 0.2,
                "right": 0.2
            }
        },
        {
            "type": "DraggableObject",
            "elements": [
                {
                    "type": "Image",
                    "url": "https:\/\/contents.knowreapi.com\/us\/illust\/base_ten_one.png"
                }
            ],
            "padding": {
                "top": 0.2,
                "bottom": 0.2,
                "left": 0.2,
                "right": 0.2
            }
        },
        {
            "type": "DraggableObject",
            "elements": [
            {
                "type": "Image",
                "url": "https:\/\/contents.knowreapi.com\/us\/illust\/base_ten_one.png"
            }
            ],
            "padding": {
                "top": 0.2,
                "bottom": 0.2,
                "left": 0.2,
                "right": 0.2
            }
        },
        {
            "type": "DraggableObject",
            "elements": [
                {
                    "type": "Image",
                    "url": "https:\/\/contents.knowreapi.com\/us\/illust\/base_ten_one.png"
                }
            ],
            "padding": {
                "top": 0.2,
                "bottom": 0.2,
                "left": 0.2,
                "right": 0.2
            }
        },
        {
            "type": "DraggableObject",
            "elements": [
                {
                    "type": "Image",
                    "url": "https:\/\/contents.knowreapi.com\/us\/illust\/base_ten_one.png"
                }
            ],
            "padding": {
                "top": 0.2,
                "bottom": 0.2,
                "left": 0.2,
                "right": 0.2
            }
        }
    ],
    "valid": [
      
    ],
    "count": 200,
    "remove": false,
    "copy": false,
    "align": "center",
    "verticalAlign": "bottom",
    "size": {
        "height": 6.2,
        "width": 1
    },
    "answer": [
        {
            "type": "Image",
            "url": "https:\/\/contents.knowreapi.com\/us\/illust\/base_ten_ten.png"
        },
        {
            "type": "Image",
            "url": "https:\/\/contents.knowreapi.com\/us\/illust\/base_ten_ten.png"
        },
        {
            "type": "Image",
            "url": "https:\/\/contents.knowreapi.com\/us\/illust\/base_ten_ten.png"
        },
        {
            "type": "Image",
            "url": "https:\/\/contents.knowreapi.com\/us\/illust\/base_ten_one.png"
        },
        {
            "type": "Image",
            "url": "https:\/\/contents.knowreapi.com\/us\/illust\/base_ten_one.png"
        },
        {
            "type": "Image",
            "url": "https:\/\/contents.knowreapi.com\/us\/illust\/base_ten_one.png"
        },
        {
            "type": "Image",
            "url": "https:\/\/contents.knowreapi.com\/us\/illust\/base_ten_one.png"
        },
        {
            "type": "Image",
            "url": "https:\/\/contents.knowreapi.com\/us\/illust\/base_ten_one.png"
        },
        {
            "type": "Image",
            "url": "https:\/\/contents.knowreapi.com\/us\/illust\/base_ten_one.png"
        }
    ],
    "locianOptions": {
    
    },
    "answerSet": [
        [
            {
                "type": "Image",
                "url": "https:\/\/contents.knowreapi.com\/us\/illust\/base_ten_ten.png"
            },
            {
                "type": "Image",
                "url": "https:\/\/contents.knowreapi.com\/us\/illust\/base_ten_ten_green.png"
            }
        ],
        [
            {
                "type": "Image",
                "url": "https:\/\/contents.knowreapi.com\/us\/illust\/base_ten_one.png"
            },
            {
                "type": "Image",
                "url": "https:\/\/contents.knowreapi.com\/us\/illust\/base_ten_one_green.png"
            }
        ]
    ]
}