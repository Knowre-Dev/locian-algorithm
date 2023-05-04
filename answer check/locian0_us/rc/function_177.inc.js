import {organizeAnswerObj} from '../rc/functions.js';

export function compareBox(right = null, input = null) {
    var right_1 = JSON.parse(JSON.stringify(right));
    var input_1 = JSON.parse(JSON.stringify(input));
    

    return true;
}

export function Box_getAnswer(object, answer, checktypeDefault) {
    var object_1 = JSON.parse(JSON.stringify(object));
    var checktypeDefault_1 = JSON.parse(JSON.stringify(checktypeDefault));
    if (typeof object_1['type'] == 'undefined' || object_1['type'] != 'Box') {
        return object_1;
    }
    for (var element of object_1['elements']) {
        organizeAnswerObj(element, answer, checktypeDefault_1);
    }
    
   
    
    return object_1;
}

var ogject = {
    "type": "Box",
    "elements": [
        {
            "type": "Cartesian2D",
            "grid": {
                "type": "Grid2D",
                "normal": {
                    "unit": {
                        "x": 0.5,
                        "y": 0.5
                    },
                    "offset": {
                        "x": [
                            
                        ],
                        "y": [
                            
                        ]
                    },
                    "color": {
                        "code": 1
                    }
                },
                "strong": {
                    "color": {
                        "code": -1
                    }
                },
                "labels": {
                    "unit": {
                        "x": 1,
                        "y": 1
                    },
                    "showZero": true,
                    "customLabels": {
                        "x": [
                            {
                                "type": "Math",
                                "content": "-\\frac{5\\pi }{2}",
                                "wrap": false,
                                "whiteSpaces": true,
                                "innerPadding": false
                            },
                            {
                                "type": "Math",
                                "content": "-2\\pi ",
                                "wrap": false,
                                "whiteSpaces": true,
                                "innerPadding": false
                            },
                            {
                                "type": "Math",
                                "content": "-\\frac{3\\pi }{2}",
                                "wrap": false,
                                "whiteSpaces": true,
                                "innerPadding": false
                            },
                            {
                                "type": "Math",
                                "content": "-\\pi ",
                                "wrap": false,
                                "whiteSpaces": true,
                                "innerPadding": false
                            },
                            {
                                "type": "Math",
                                "content": "-\\frac{\\pi }{2}",
                                "wrap": false,
                                "whiteSpaces": true,
                                "innerPadding": false
                            },
                            {
                                "type": "Math",
                                "content": "0",
                                "wrap": false,
                                "whiteSpaces": true,
                                "innerPadding": false
                            },
                            {
                                "type": "Math",
                                "content": "\\frac{\\pi }{2}",
                                "wrap": false,
                                "whiteSpaces": true,
                                "innerPadding": false
                            },
                            {
                                "type": "Math",
                                "content": "\\pi ",
                                "wrap": false,
                                "whiteSpaces": true,
                                "innerPadding": false
                            },
                            {
                                "type": "Math",
                                "content": "\\frac{3\\pi }{2}",
                                "wrap": false,
                                "whiteSpaces": true,
                                "innerPadding": false
                            },
                            {
                                "type": "Math",
                                "content": "2\\pi ",
                                "wrap": false,
                                "whiteSpaces": true,
                                "innerPadding": false
                            },
                            {
                                "type": "Math",
                                "content": "\\frac{5\\pi }{2}",
                                "wrap": false,
                                "whiteSpaces": true,
                                "innerPadding": false
                            }
                        ],
                        "y": [
                            {
                                "type": "Math",
                                "content": "-5",
                                "wrap": false,
                                "whiteSpaces": true,
                                "innerPadding": false
                            },
                            {
                                "type": "Math",
                                "content": "-4",
                                "wrap": false,
                                "whiteSpaces": true,
                                "innerPadding": false
                            },
                            {
                                "type": "Math",
                                "content": "-3",
                                "wrap": false,
                                "whiteSpaces": true,
                                "innerPadding": false
                            },
                            {
                                "type": "Math",
                                "content": "-2",
                                "wrap": false,
                                "whiteSpaces": true,
                                "innerPadding": false
                            },
                            {
                                "type": "Math",
                                "content": "-1",
                                "wrap": false,
                                "whiteSpaces": true,
                                "innerPadding": false
                            },
                            {
                                "type": "Math",
                                "content": "",
                                "wrap": false,
                                "whiteSpaces": true,
                                "innerPadding": false
                            },
                            {
                                "type": "Math",
                                "content": "1",
                                "wrap": false,
                                "whiteSpaces": true,
                                "innerPadding": false
                            },
                            {
                                "type": "Math",
                                "content": "2",
                                "wrap": false,
                                "whiteSpaces": true,
                                "innerPadding": false
                            },
                            {
                                "type": "Math",
                                "content": "3",
                                "wrap": false,
                                "whiteSpaces": true,
                                "innerPadding": false
                            },
                            {
                                "type": "Math",
                                "content": "4",
                                "wrap": false,
                                "whiteSpaces": true,
                                "innerPadding": false
                            },
                            {
                                "type": "Math",
                                "content": "5",
                                "wrap": false,
                                "whiteSpaces": true,
                                "innerPadding": false
                            }
                        ]
                    }
                }
            },
            "bounds": {
                "x": {
                    "min": -6,
                    "max": 6
                },
                "y": {
                    "min": -6,
                    "max": 6
                }
            },
            "axis": {
                "type": "Axis2D",
                "style": {
                    "x": {
                        "color": {
                            "code": 0
                        },
                        "arrow": {
                            "start": true,
                            "end": true
                        },
                        "offset": {
                            "start": false,
                            "end": false
                        }
                    },
                    "y": {
                        "color": {
                            "code": 0
                        },
                        "arrow": {
                            "start": true,
                            "end": true
                        },
                        "offset": {
                            "start": false,
                            "end": false
                        }
                    }
                },
                "labels": {
                    "x": {
                        "type": "Math",
                        "content": "\\theta ",
                        "wrap": false,
                        "whiteSpaces": true,
                        "innerPadding": false,
                        "font": {
                            "size": 1
                        },
                        "transform": {
                            "rotate": 0
                        }
                    },
                    "y": {
                        "type": "Math",
                        "content": "y",
                        "wrap": false,
                        "whiteSpaces": true,
                        "innerPadding": false,
                        "font": {
                            "size": 1
                        },
                        "transform": {
                            "rotate": 0
                        }
                    },
                    "origin": {
                        "type": "Math",
                        "content": ""
                    }
                }
            },
            "elements": [
                {
                    "type": "Curve2D",
                    "equation": "y=Math.sin(x)",
                    "pointSize": 1,
                    "style": {
                        "color": {
                            "code": 4,
                            "weight": "normalHard"
                        },
                        "dash": "dash",
                        "arrow": true
                    },
                    "domain": {
                        "visible": true
                    },
                    "interaction": {
                        "movable": "sine"
                    },
                    "coords": [
                        {
                            "x": 0,
                            "y": 0
                        },
                        {
                            "x": 1,
                            "y": 1
                        }
                    ],
                    "asymptotes": {
                    "style": {
                        "hor": [
                            {
                                "color": {
                                    "code": -1,
                                    "weight": "normalHard"
                                }
                            }
                        ],
                        "ver": [
                            {
                                "color": {
                                    "code": -1,
                                    "weight": "normalHard"
                                }
                            }
                        ]
                    }
                    },
                    "locianOptions": {
                        "check": false
                    }
                },
                {
                    "type": "Curve2D",
                    "equation": "y=3*Math.sin(x)",
                    "pointSize": 1,
                    "style": {
                        "color": {
                            "code": 3,
                            "weight": "normalHard"
                        },
                        "dash": "none",
                        "arrow": true
                    },
                    "domain": {
                        "visible": true
                    },
                    "interaction": {
                        "movable": "sine",
                        "selected": true,
                        "selectable": "single"
                    },
                    "coords": [
                        {
                            "x": 0,
                            "y": 0
                        },
                        {
                            "x": 1,
                            "y": 1
                        }
                    ],
                    "asymptotes": {
                        "style": {
                            "hor": [
                                {
                                    "color": {
                                    "code": -1,
                                    "weight": "normalHard"
                                    }
                                }
                            ],
                            "ver": [
                                {
                                    "color": {
                                    "code": -1,
                                    "weight": "normalHard"
                                    }
                                }
                            ]
                        }
                    },
                    "locianOptions": {
                        "check": true,
                        "answer": {
                            "type": "Curve2D",
                            "equation": "y=3*Math.sin(x)",
                            "pointSize": 1,
                            "style": {
                                "color": {
                                    "code": 3,
                                    "weight": "normalHard"
                                },
                                "dash": "none",
                                "arrow": true
                            },
                            "domain": {
                                "visible": true
                            },
                            "interaction": {
                                "movable": "sine"
                            },
                            "coords": [
                                {
                                    "x": 0,
                                    "y": 0
                                },
                                {
                                    "x": 1,
                                    "y": 3
                                }
                            ],
                            "asymptotes": {
                                "style": {
                                    "hor": [
                                        {
                                            "color": {
                                                "code": -1,
                                                "weight": "normalHard"
                                            }
                                        }
                                    ],
                                    "ver": [
                                        {
                                            "color": {
                                            "code": -1,
                                            "weight": "normalHard"
                                            }
                                        }
                                    ]
                                }
                            }
                        },
                        "checkType": "movable"
                    }
                }
            ],
            "size": 0.75
        }
    ],
    "align": {
      "hor": "right",
      "ver": "top"
    },
    "size": {
      "width": 1
    },
    "title": {
      "type": "Blank"
    }
}








