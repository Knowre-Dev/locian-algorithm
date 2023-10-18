
import {organizeAnswerObj} from '../rc/functions.js';

export function compareTrig(right = null, input = null) {
    var right_1 = JSON.parse(JSON.stringify(right));
    var input_1 = JSON.parse(JSON.stringify(input));
    if (right_1['type'] === 'Trig' && input_1['type'] === 'Trig') {
      
        
        var right_data = Trig_getInfo(right_1);
        var input_data = Trig_getInfo(input_1);
     
        if (right_data.length === 0) { 
            return true;
        }
        if (right_data.length !== input_data.length) {
            return false;
        }
      
        for (var r of right_data) {
            for (var i of input_data) {
                if (typeof r['base'] != 'undefined') {
                    if (typeof r['base']['degree'] != 'undefined') {
                        if (r['base']['degree'] !== i['base']['degree']) {
                            return false;
                        }
                    }
                    if (typeof r['base']['selected'] != 'undefined') {
                        if (r['base']['selected'] !== i['base']['selected']) {
                            return false;
                        }
                    }
                }
                
                if (typeof r['needle'] != 'undeinfed') {
                    if (typeof r['needle']['degree'] != 'undefined') {
                        if (r['needle']['degree'] !== i['needle']['degree']) {
                            return false;
                        }
                    }
                    if (typeof r['needle']['selected'] != 'undefined') {
                        if (r['needle']['selected'] !== i['needle']['selected']) {
                            return false;
                        }
                    }
                }
            }
        }
    }

    return true;
}

export function Trig_getAnswer(object, answer, checktypeDefault) {
    var object_1 = JSON.parse(JSON.stringify(object));
    var checktypeDefault_1 = JSON.parse(JSON.stringify(checktypeDefault));
    if (typeof object_1['type'] == 'undefined' || object_1['type'] != 'Trig') {
        return object_1;
    }
    
     for (var e of object_1['needles']) {
        if (typeof e['degreeContent'] != 'undefined' && e['degreeContent'].length > 0) {
            organizeAnswerObj(e['degreeContent']['element'], answer, checktypeDefault_1);
        } else if (typeof e['radianContent'] != 'undefined' && e['radianContent'].length > 0) {
            organizeAnswerObj(e['radianContent']['element'], answer, checktypeDefault_1);
        } else if (typeof e['contents'] != 'undefined') {
            for (var ee of e['contents']) {
                organizeAnswerObj(ee, answer, checktypeDefault_1);
            }
        }
    }
    
    return object_1;
}

export function Trig_getInfo(object) {
    var object_1 = JSON.parse(JSON.stringify(object));
    var result = [];
    for (var TrigNeedle of object_1['needles']) {
        
        if (typeof TrigNeedle['locianOptions'] != 'undefined' && 
            typeof TrigNeedle['locianOptions']['check'] != 'undefined' && 
            TrigNeedle['locianOptions']['check']) {
            var arr = new Object();
            if (typeof TrigNeedle['needle'] != 'undefined') { // user input
                arr['base'] = TrigNeedle['base'];
                arr['needle'] = TrigNeedle['needle'];
            } else {  // right answer
                if (typeof TrigNeedle['locianOptions']['base'] != 'undefined') {
                    var base = TrigNeedle['locianOptions']['base'];
                    if (typeof base['degree'] != 'undefined') {
                        arr['base'] = new Object();
                        arr['base']['degree'] = base['degree'];
                    }
                    
                    if (typeof base['selected'] != 'undefined') {
                        arr['base'] = new Object();
                        arr['base']['selected'] = base['selected'];
                    }
                }
                
                if (typeof TrigNeedle['locianOptions']['needle'] != 'undefined') {
                    var needle = TrigNeedle['locianOptions']['needle'];
                    if (typeof needle['degree'] != 'undefined') {
                        arr['needle'] = new Object();
                        arr['needle']['degree'] = needle['degree'];
                    }
                    
                    if (typeof needle['selected'] != 'undefined') {
                        arr['needle'] = new Object();
                        arr['needle']['selected'] = needle['selected'];
                    } 
                } 
            }
            
            result.push(arr);
        }
    }
    
    return result;
}

var object = {
    "type": "Trig",
    "radius": 1,
    "needles": [
        {
            "type": "TrigNeedle",
            "degree": 0,
            "style": {
                "stroke-width": 0,
                "color": {
                    "code": 0
                }
            },
            "pointer": {
                "pointerType": "point",
                "style": {
                    "color": {
                        "code": 1,
                        "weight": "normalMedium"
                    }
                }
            }
        },
        {
            "type": "TrigNeedle",
            "degree": 10,
            "style": {
                "stroke-width": 0,
                "color": {
                    "code": 0
                }
            },
            "pointer": {
                "pointerType": "point",
                "style": {
                    "color": {
                        "code": 1,
                        "weight": "normalMedium"
                    }
                }
            }
        },
        {
            "type": "TrigNeedle",
            "degree": 20,
            "style": {
                "stroke-width": 0,
                "color": {
                    "code": 0
                }
            },
            "pointer": {
                "pointerType": "point",
                "style": {
                    "color": {
                        "code": 1,
                        "weight": "normalMedium"
                    }
                }
            }
        },
        {
            "type": "TrigNeedle",
            "degree": 30,
            "style": {
                "stroke-width": 0,
                "color": {
                    "code": 0
                }
            },
            "pointer": {
                "pointerType": "point",
                "style": {
                    "color": {
                        "code": 1,
                        "weight": "normalMedium"
                    }
                }
            }
        },
        {
            "type": "TrigNeedle",
            "degree": 40,
            "style": {
                "stroke-width": 0,
                "color": {
                    "code": 0
                }
            },
            "pointer": {
                "pointerType": "point",
                "style": {
                    "color": {
                        "code": 1,
                        "weight": "normalMedium"
                    }
                }
            }
        },
        {
            "type": "TrigNeedle",
            "degree": 50,
            "style": {
                "stroke-width": 0,
                "color": {
                    "code": 0
                }
            },
            "pointer": {
                "pointerType": "point",
                "style": {
                    "color": {
                        "code": 1,
                        "weight": "normalMedium"
                    }
                }
            }
        },
        {
            "type": "TrigNeedle",
            "degree": 60,
            "style": {
                "stroke-width": 0,
                "color": {
                    "code": 0
                }
            },
            "pointer": {
                "pointerType": "point",
                "style": {
                    "color": {
                        "code": 1,
                        "weight": "normalMedium"
                    }
                }
            }
        },
        {
            "type": "TrigNeedle",
            "degree": 70,
            "style": {
                "stroke-width": 0,
                "color": {
                    "code": 0
                }
            },
            "pointer": {
                "pointerType": "point",
                "style": {
                    "color": {
                        "code": 1,
                        "weight": "normalMedium"
                    }
                }
            }
        },
        {
            "type": "TrigNeedle",
            "degree": 80,
            "style": {
                "stroke-width": 0,
                "color": {
                    "code": 0
                }
            },
            "pointer": {
                "pointerType": "point",
                "style": {
                    "color": {
                        "code": 1,
                    "weight": "normalMedium"
                    }
                }
            }
        },
        {
            "type": "TrigNeedle",
            "degree": 90,
            "style": {
                "stroke-width": 0,
                "color": {
                    "code": 0
                }
            },
            "pointer": {
                "pointerType": "point",
                "style": {
                    "color": {
                        "code": 1,
                        "weight": "normalMedium"
                    }
                }
            }
        },
        {
            "type": "TrigNeedle",
            "degree": 100,
            "style": {
                "stroke-width": 0,
                "color": {
                    "code": 0
                }
            },
            "pointer": {
                "pointerType": "point",
                "style": {
                    "color": {
                    "code": 1,
                    "weight": "normalMedium"
                    }
                }
            }
        },
        {
            "type": "TrigNeedle",
            "degree": 110,
            "style": {
                "stroke-width": 0,
                "color": {
                    "code": 0
                }
            },
            "pointer": {
                "pointerType": "point",
                "style": {
                    "color": {
                        "code": 1,
                        "weight": "normalMedium"
                    }
                }
            }
        },
        {
            "type": "TrigNeedle",
            "degree": 120,
            "style": {
                "stroke-width": 0,
                "color": {
                    "code": 0
                }
            },
            "pointer": {
                "pointerType": "point",
                "style": {
                    "color": {
                        "code": 1,
                        "weight": "normalMedium"
                    }
                }
            }
        },
        {
            "type": "TrigNeedle",
            "degree": 130,
            "style": {
                "stroke-width": 0,
                "color": {
                    "code": 0
                }
            },
            "pointer": {
                "pointerType": "point",
                "style": {
                    "color": {
                        "code": 1,
                        "weight": "normalMedium"
                    }
                }
            }
        },
        {
            "type": "TrigNeedle",
            "degree": 140,
            "style": {
                "stroke-width": 0,
                "color": {
                    "code": 0
                }
            },
            "pointer": {
                "pointerType": "point",
                "style": {
                    "color": {
                        "code": 1,
                        "weight": "normalMedium"
                    }
                }
            }
        },
        {
            "type": "TrigNeedle",
            "degree": 150,
            "style": {
                "stroke-width": 0,
                "color": {
                    "code": 0
                }
            },
            "pointer": {
                "pointerType": "point",
                "style": {
                    "color": {
                        "code": 1,
                        "weight": "normalMedium"
                    }
                }
            }
        },
        {
            "type": "TrigNeedle",
            "degree": 160,
            "style": {
                "stroke-width": 0,
                "color": {
                    "code": 0
                }
            },
            "pointer": {
                "pointerType": "point",
                "style": {
                    "color": {
                        "code": 1,
                        "weight": "normalMedium"
                    }
                }
            }
        },
        {
            "type": "TrigNeedle",
            "degree": 170,
            "style": {
                "stroke-width": 0,
                "color": {
                    "code": 0
                }
            },
            "pointer": {
                "pointerType": "point",
                "style": {
                    "color": {
                        "code": 1,
                        "weight": "normalMedium"
                    }
                }
            }
        },
        {
            "type": "TrigNeedle",
            "degree": 180,
            "style": {
                "stroke-width": 0,
                "color": {
                    "code": 0
                }
            },
            "pointer": {
                "pointerType": "point",
                "style": {
                    "color": {
                        "code": 1,
                        "weight": "normalMedium"
                    }
                }
            }
        },
        {
            "type": "TrigNeedle",
            "degree": 190,
            "style": {
                "stroke-width": 0,
                "color": {
                    "code": 0
                }
            },
            "pointer": {
                "pointerType": "point",
                "style": {
                    "color": {
                        "code": 1,
                        "weight": "normalMedium"
                    }
                }
            }
        },
        {
            "type": "TrigNeedle",
            "degree": 200,
            "style": {
                "stroke-width": 0,
                "color": {
                    "code": 0
                }
            },
            "pointer": {
                "pointerType": "point",
                "style": {
                    "color": {
                        "code": 1,
                        "weight": "normalMedium"
                    }
                }
            }
        },
        {
            "type": "TrigNeedle",
            "degree": 210,
            "style": {
                "stroke-width": 0,
                "color": {
                    "code": 0
                }
            },
            "pointer": {
                "pointerType": "point",
                "style": {
                    "color": {
                        "code": 1,
                        "weight": "normalMedium"
                    }
                }
            }
        },
        {
            "type": "TrigNeedle",
            "degree": 220,
            "style": {
                "stroke-width": 0,
                "color": {
                    "code": 0
                }
            },
            "pointer": {
                "pointerType": "point",
                "style": {
                    "color": {
                        "code": 1,
                        "weight": "normalMedium"
                    }
                }
            }
        },
        {
            "type": "TrigNeedle",
            "degree": 230,
            "style": {
                "stroke-width": 0,
                "color": {
                    "code": 0
                }
            },
            "pointer": {
                "pointerType": "point",
                "style": {
                    "color": {
                        "code": 1,
                        "weight": "normalMedium"
                    }
                }
            }
        },
        {
            "type": "TrigNeedle",
            "degree": 240,
            "style": {
                "stroke-width": 0,
                "color": {
                    "code": 0
                }
            },
            "pointer": {
                "pointerType": "point",
                "style": {
                    "color": {
                        "code": 1,
                        "weight": "normalMedium"
                    }
                }
            }
        },
        {
            "type": "TrigNeedle",
            "degree": 250,
            "style": {
                "stroke-width": 0,
                "color": {
                    "code": 0
                }
            },
            "pointer": {
                "pointerType": "point",
                "style": {
                    "color": {
                        "code": 1,
                        "weight": "normalMedium"
                    }
                }
            }
        },
        {
            "type": "TrigNeedle",
            "degree": 260,
            "style": {
                "stroke-width": 0,
                "color": {
                    "code": 0
                }
            },
            "pointer": {
                "pointerType": "point",
                "style": {
                    "color": {
                        "code": 1,
                        "weight": "normalMedium"
                    }
                }
            }
        },
        {
            "type": "TrigNeedle",
            "degree": 270,
            "style": {
                "stroke-width": 0,
                "color": {
                    "code": 0
                }
            },
            "pointer": {
                "pointerType": "point",
                "style": {
                    "color": {
                        "code": 1,
                        "weight": "normalMedium"
                    }
                }
            }
        },
        {
            "type": "TrigNeedle",
            "degree": 280,
            "style": {
                "stroke-width": 0,
                "color": {
                    "code": 0
                }
            },
            "pointer": {
                "pointerType": "point",
                "style": {
                    "color": {
                        "code": 1,
                        "weight": "normalMedium"
                    }
                }
            }
        },
        {
            "type": "TrigNeedle",
            "degree": 290,
            "style": {
                "stroke-width": 0,
                "color": {
                    "code": 0
                }
            },
            "pointer": {
                "pointerType": "point",
                "style": {
                    "color": {
                        "code": 1,
                        "weight": "normalMedium"
                    }
                }
            }
        },
        {
            "type": "TrigNeedle",
            "degree": 300,
            "style": {
                "stroke-width": 0,
                "color": {
                    "code": 0
                }
            },
            "pointer": {
                "pointerType": "point",
                "style": {
                    "color": {
                        "code": 1,
                        "weight": "normalMedium"
                    }
                }
            }
        },
        {
            "type": "TrigNeedle",
            "degree": 310,
            "style": {
                "stroke-width": 0,
                "color": {
                    "code": 0
                }
            },
            "pointer": {
                "pointerType": "point",
                "style": {
                    "color": {
                        "code": 1,
                        "weight": "normalMedium"
                    }
                }
            }
        },
        {
            "type": "TrigNeedle",
            "degree": 320,
            "style": {
                "stroke-width": 0,
                "color": {
                    "code": 0
                }
            },
            "pointer": {
                "pointerType": "point",
                "style": {
                    "color": {
                        "code": 1,
                        "weight": "normalMedium"
                    }
                }
            }
        },
        {
            "type": "TrigNeedle",
            "degree": 330,
            "style": {
            "stroke-width": 0,
            "color": {
                "code": 0
            }
            },
            "pointer": {
                "pointerType": "point",
                "style": {
                    "color": {
                        "code": 1,
                        "weight": "normalMedium"
                    }
                }
            }
        },
        {
            "type": "TrigNeedle",
            "degree": 340,
            "style": {
                "stroke-width": 0,
                "color": {
                    "code": 0
                }
            },
            "pointer": {
                "pointerType": "point",
                "style": {
                    "color": {
                        "code": 1,
                        "weight": "normalMedium"
                    }
                }
            }
        },
        {
            "type": "TrigNeedle",
            "degree": 350,
            "style": {
                "stroke-width": 0,
                "color": {
                    "code": 0
                }
            },
            "pointer": {
                "pointerType": "point",
                "style": {
                    "color": {
                        "code": 1,
                        "weight": "normalMedium"
                    }
                }
            }
        },
        {
            "type": "TrigNeedle",
            "degree": 360,
            "style": {
                "stroke-width": 0,
                "color": {
                    "code": 0
                }
            },
            "pointer": {
                "pointerType": "point",
                "style": {
                    "color": {
                        "code": 1,
                        "weight": "normalMedium"
                    }
                }
            }
        },
        {
            "type": "TrigNeedle",
            "degree": 0,
            "style": {
                "stroke-width": 0,
                "color": {
                    "code": 0
                }
            },
            "pointer": {
                "pointerType": "point",
                "style": {
                    "color": {
                        "code": 0,
                        "weight": "normalMedium"
                    }
                }
            }
        },
        {
            "type": "TrigNeedle",
            "degree": 3,
            "style": {
                "stroke-width": 2.5,
                "color": {
                    "code": -1
                }
            },
            "degreeContent": {
                "element": {
                    "type": "Math",
                    "content": "0\\degree",
                    "font": {
                        "color": {
                            "text": {
                                "code": 0
                            }
                        }
                    }
                },
                "offset": 1.1
            },
            "radianContent": [
            
            ],
            "coordContent": [
            
            ]
        },
        {
            "type": "TrigNeedle",
            "degree": 30,
            "style": {
                "stroke-width": 0,
                "color": {
                    "code": 0
                }
            },
            "pointer": {
                "pointerType": "point",
                "style": {
                    "color": {
                        "code": 0,
                        "weight": "normalMedium"
                    }
                }
            }
        },
        {
            "type": "TrigNeedle",
            "degree": 27,
            "style": {
                "stroke-width": 2.5,
                "color": {
                    "code": -1
                }
            },
            "degreeContent": {
                "element": {
                    "type": "Math",
                    "content": "30\\degree",
                    "font": {
                        "color": {
                            "text": {
                                "code": 0
                            }
                        }
                    }
                },
                "offset": 1.1
            },
            "radianContent": [
            
            ],
            "coordContent": [
            
            ]
        },
        {
            "type": "TrigNeedle",
            "degree": 60,
            "style": {
                "stroke-width": 0,
                "color": {
                    "code": 0
                }
            },
            "pointer": {
                "pointerType": "point",
                "style": {
                    "color": {
                        "code": 0,
                        "weight": "normalMedium"
                    }
                }
            }
        },
        {
            "type": "TrigNeedle",
            "degree": 65,
            "style": {
                "stroke-width": 2.5,
                "color": {
                    "code": -1
                }
            },
            "degreeContent": {
                "element": {
                    "type": "Math",
                    "content": "60\\degree",
                    "font": {
                        "color": {
                            "text": {
                                "code": 0
                            }
                        }
                    }
                },
                "offset": 1.1
            },
            "radianContent": [
            
            ],
            "coordContent": [
            
            ]
        },
        {
            "type": "TrigNeedle",
            "degree": 90,
            "style": {
                "stroke-width": 0,
                "color": {
                    "code": 0
                }
            },
            "pointer": {
                "pointerType": "point",
                "style": {
                    "color": {
                        "code": 0,
                        "weight": "normalMedium"
                    }
                }
            }
        },
        {
            "type": "TrigNeedle",
            "degree": 87,
            "style": {
                "stroke-width": 2.5,
                "color": {
                    "code": -1
                }
            },
            "degreeContent": {
                "element": {
                    "type": "Math",
                    "content": "90\\degree",
                    "font": {
                        "color": {
                            "text": {
                                "code": 0
                            }
                        }
                    }
                },
                "offset": 1.1
            },
            "radianContent": [
            
            ],
            "coordContent": [
            
            ]
        },
        {
            "type": "TrigNeedle",
            "degree": 120,
            "style": {
                "stroke-width": 0,
                "color": {
                    "code": 0
                }
            },
            "pointer": {
                "pointerType": "point",
                "style": {
                    "color": {
                        "code": 0,
                        "weight": "normalMedium"
                    }
                }
            }
        },  
        {
            "type": "TrigNeedle",
            "degree": 115,
            "style": {
                "stroke-width": 2.5,
                "color": {
                    "code": -1
                }
            },
                "degreeContent": {
                "element": {
                    "type": "Math",
                    "content": "120\\degree",
                    "font": {
                        "color": {
                            "text": {
                                "code": 0
                            }
                        }
                    }
                },
                "offset": 1.1
            },
            "radianContent": [
            
            ],
            "coordContent": [
            
            ]
        },
        {
            "type": "TrigNeedle",
            "degree": 150,
            "style": {
                "stroke-width": 0,
                "color": {
                    "code": 0
                }
            },
            "pointer": {
                "pointerType": "point",
                "style": {
                    "color": {
                        "code": 0,
                        "weight": "normalMedium"
                    }
                }
            }
        },
        {
            "type": "TrigNeedle",
            "degree": 155,
            "style": {
                "stroke-width": 2.5,
                "color": {
                    "code": -1
                }
            },
            "degreeContent": {
            "element": {
                "type": "Math",
                "content": "150\\degree",
                "font": {
                    "color": {
                        "text": {
                            "code": 0
                        }
                    }
                }
            },
            "offset": 1.1
            },
            "radianContent": [
            
            ],
            "coordContent": [
            
            ]
        },
        { 
            "type": "TrigNeedle",
            "degree": 180,
            "style": {
                "stroke-width": 0,
                "color": {
                    "code": 0
                }
            },
            "pointer": {
                "pointerType": "point",
                "style": {
                    "color": {
                        "code": 0,
                        "weight": "normalMedium"
                    }
                }
            }
        },
        {
            "type": "TrigNeedle",
            "degree": 177,
            "style": {
                "stroke-width": 2.5,
                "color": {
                    "code": -1
                }
            },
            "degreeContent": {
                "element": {
                    "type": "Math",
                    "content": "180\\degree",
                    "font": {
                        "color": {
                            "text": {
                                "code": 0
                            }
                        }
                    }
                },
                "offset": 1.1
            },
            "radianContent": [
            
            ],
            "coordContent": [
            
            ]
        },
        {
            "type": "TrigNeedle",
            "degree": 210,
            "style": {
                "stroke-width": 0,
                "color": {
                    "code": 0
                }
            },
            "pointer": {
                "pointerType": "point",
                "style": {
                    "color": {
                        "code": 0,
                        "weight": "normalMedium"
                    }
                }
            }
        },
        {
            "type": "TrigNeedle",
            "degree": 197,
            "style": {
                "stroke-width": 2.5,
                "color": {
                    "code": -1
                }
            },
            "degreeContent": {
            "element": {
                "type": "Math",
                "content": "210\\degree",
                "font": {
                    "color": {
                        "text": {
                            "code": 0
                        }
                    }
                }
            },
            "offset": 1.1
            },
            "radianContent": [
            
            ],
            "coordContent": [
            
            ]
        },
        {
            "type": "TrigNeedle",
            "degree": 240,
            "style": {
                "stroke-width": 0,
                "color": {
                    "code": 0
                }
            },
            "pointer": {
                "pointerType": "point",
                "style": {
                    "color": {
                        "code": 0,
                        "weight": "normalMedium"
                    }
                }
            }
        },
        {
            "type": "TrigNeedle",
            "degree": 245,
            "style": {
                "stroke-width": 2.5,
                "color": {
                    "code": -1
                }
            },
            "degreeContent": {
                "element": {
                    "type": "Math",
                    "content": "240\\degree",
                    "font": {
                        "color": {
                            "text": {
                                "code": 0
                            }
                        }
                    }
                },
                "offset": 1.1
            },
            "radianContent": [
            
            ],
            "coordContent": [
            
            ]
        },
        {
            "type": "TrigNeedle",
            "degree": 270,
            "style": {
                "stroke-width": 0,
                "color": {
                    "code": 0
                }
            },
            "pointer": {
                "pointerType": "point",
                "style": {
                    "color": {
                        "code": 0,
                        "weight": "normalMedium"
                    }
                }
            }
        },
        {
            "type": "TrigNeedle",
            "degree": 273,
            "style": {
                "stroke-width": 2.5,
                "color": {
                    "code": -1
                }
            },
            "degreeContent": {
                "element": {
                    "type": "Math",
                    "content": "270\\degree",
                    "font": {
                        "color": {
                            "text": {
                                "code": 0
                            }
                        }
                    }
                },
                "offset": 1.1
            },
            "radianContent": [
            
            ],
            "coordContent": [
            
            ]
        },
        {
            "type": "TrigNeedle",
            "degree": 300,
            "style": {
                "stroke-width": 0,
                "color": {
                    "code": 0
                }
            },
            "pointer": {
                "pointerType": "point",
                "style": {
                    "color": {
                        "code": 0,
                        "weight": "normalMedium"
                    }
                }
            }
        },
        {
            "type": "TrigNeedle",
            "degree": 300,
            "style": {
                "stroke-width": 2.5,
                "color": {
                    "code": -1
                }
            },
            "degreeContent": {
                "element": {
                    "type": "Math",
                    "content": "300\\degree",
                    "font": {
                        "color": {
                            "text": {
                                "code": 0
                            }
                        }
                    }
                },
                "offset": 1.1
            },
            "radianContent": [
            
            ],
            "coordContent": [
            
            ]
        },
        {
            "type": "TrigNeedle",
            "degree": 330,
            "style": {
                "stroke-width": 0,
                "color": {
                    "code": 0
                }
            },
            "pointer": {
                "pointerType": "point",
                "style": {
                    "color": {
                        "code": 0,
                    "weight": "normalMedium"
                    }
                }
            }
        },
        {
            "type": "TrigNeedle",
            "degree": 340,
            "style": {
                "stroke-width": 2.5,
                "color": {
                    "code": -1
                }
            },
            "degreeContent": {
                "element": {
                    "type": "Math",
                    "content": "330\\degree",
                    "font": {
                        "color": {
                            "text": {
                                "code": 0
                            }
                        }
                    }
                },
                "offset": 1.1
            },
            "radianContent": [
            
            ],
            "coordContent": [
            
            ]
        },
        {
            "type": "TrigNeedle",
            "degree": 360,
            "style": {
                "stroke-width": 0,
                "color": {
                    "code": 0
                }
            },
            "pointer": {
                "pointerType": "point",
                "style": {
                    "color": {
                        "code": 0,
                        "weight": "normalMedium"
                    }
                }
            }
        },
        {
            "type": "TrigNeedle",
            "degree": 357,
            "style": {
                "stroke-width": 2.5,
                "color": {
                    "code": -1
                }
            },
            "degreeContent": {
                "element": {
                    "type": "Math",
                    "content": "360\\degree",
                    "font": {
                        "color": {
                            "text": {
                                "code": 0
                            }
                        }
                    }
                },
                "offset": 1.1
            },
            "radianContent": [
            
            ],
            "coordContent": [
            
            ]
        },
        {
            "type": "TrigNeedle",
            "style": {
                "stroke-width": 2.5,
                "color": {
                    "code": 1
                }
            },
            "degree": 0,
            "pointer": {
                "pointerType": "arrow"
            },
            "base": {
                "pointerType": "arrow",
                "degree": 0,
                "style": {
                    "color": {
                        "code": 0,
                        "weight": "normalMedium"
                    }
                }
            },
            "interaction": {
                "movable": true
            },
            "locianOptions": {
                "check": true,
                "needle": {
                    "degree": 250
                }
            }
        }
    ],
    "step": 10,
    "degree": {
        "start": 0,
        "end": 360
    }
}