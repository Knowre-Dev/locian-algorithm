
var box = {
    "type": "Box",
    "elements": [
        {
            "type": "Dropzone",
            "elements": [
                {
                    "type": "DraggableObject",
                    "elements": [
                        { 
                            "type": "Math",
                            "content": "-3dr^{2}",
                            "wrap": false,
                            "whiteSpaces": true,
                            "innerPadding": false,
                            "font": {
                                "color": {
                                    "text": {
                                        "code": 0
                                    }
                                }
                            }
                        }
                    ],
                    "isDraggable": false, 
                    "padding" : {
                        "top" : 0.25,
                        "bottom": 0.25,
                        "left" : 0.75,
                        "right" : 0.75
                    }
                }
            ],
            "valid": [ 
                {
                    "type": "DraggableObject",
                    "elements": [
                        {
                            "type": "Math",
                            "content": "-3dr^{2}",
                            "wrap": false,
                            "whiteSpaces": true,
                            "innerPadding": false, 
                            "font": {
                                "color": { 
                                    "text": {
                                        "code": 0
                                    }
                                }
                            }
                        }
                    ]
                }
            ],
            "count": 10,
            "remove": false,
            "copy": false,
            "align": "center",
            "verticalAlign": "top",
            "size": {
                "height": 8
            },
            "answer": [

            ],
            "locianOptions": {
                "check": false
            },
            "useElementPosition": false,
            "elementPosition": "left",
            "useSelection": false
        }
    ],
    "border": {
        "left": {
            "width": 1
        },
        "right": {
            "width": 1
        },
        "top": {
            "width": 1
        },
        "bottom": {
            "width": 1
        }
    },
    "title": {
        "type": "Text",
        "content": "Monomials"
    }
}


var connect = {
    "type": "Connect",
    "size": 0.7,
    "dots": [
        {
            "type": "Dot",
            "coords": {
                "point": {
                    "x": -2,
                    "y": -7
                }
            },
            "size": 0.35,
            "style": {
                "color": {
                    "code": 0
                }
            }
        },
        {
            "type": "Dot",
            "coords": {
                "point": {
                    "x": -8,
                    "y": -2
                }
            },
            "size": 0.35,
            "style": {
                "color": {
                    "code": 0
                }
            }
        },
        {
            "type": "Dot",
            "coords": {
                "point": {
                    "x": 0,
                    "y": 7
                }
            },
            "size": 0.35,
            "style": {
                "color": {
                    "code": 0
                }
            }
        },
        {
            "type": "Dot",
            "coords": {
                "point": {
                    "x": 7,
                    "y": 1
                }
            },
            "size": 0.35,
            "style": {
                "color": {
                    "code": 0
                }
            }
        },
        {
            "type": "Dot",
            "coords": {
                "point": {
                    "x": 7,
                    "y": -7
                }
            },
            "size": 0.35,
            "style": {
                "color": {
                    "code": 0
                }
            }
        }
    ],
    "labels": [
        {
            "type": "Label",
            "coords": {
                "point": {
                    "x": -2.67,
                    "y": -7.67
                }
            },
            "label": {
                "type": "Text",
                "content": "R"
            }
        },
        {
            "type": "Label",
            "coords": {
                "point": {
                    "x": -8.67,
                    "y": -2.67
                }
            },
            "label": {
                "type": "Text",
                "content": "S"
            }
        },
        {
            "type": "Label",
            "coords": {
                "point": {
                    "x": 0.67,
                    "y": 7.67
                }
            },
            "label": {
                "type": "Text",
                "content": "T"
            }
        },
        {
            "type": "Label",
            "coords": {
                "point": {
                    "x": 7.67,
                    "y": 1.67
                }
            },
            "label": {
                "type": "Text",
                "content": "U"
            }
        },
        {
            "type": "Label",
            "coords": {
                "point": {
                    "x": 7.67,
                    "y": -7.67
                }
            },
            "label": {
                "type": "Text",
                "content": "V"
            }
        }
    ],
    "lines": [
        {
            "source": 0,
            "target": 1
        },
        {
            "source": 1,
            "target": 2
        },
        {
            "source": 2,
            "target": 3
        },
        {
            "source": 3,
            "target": 4
        },
        {
            "source": 4,
            "target": 0
        },
        {
            "source": 0,
            "target": 2,
            "color": {
                "code": 3,
                "weight": "normalMedium"
            },
            "dash": true
        },
        {
            "source": 0,
            "target": 3,
            "color": {
                "code": 3,
                "weight": "normalMedium"
            },
            "dash": true
        }
    ],
    "arrow": false,
    "dotStyle": {
        "lineLimit": {
            "source": 1,
            "target": 1
        }
    },
    "sameDotStyle": false, 
    "display": "inline-block"
}

var draggableObject = {
    "type": "DraggableObject",
    "elements": [
        { 
            "type": "Math",
            "content": "-3dr^{2}",
            "wrap": false,
            "whiteSpaces": true,
            "innerPadding": false,
            "font": {
                "color": {
                    "text": {
                        "code": 0
                    }
                }
            }
        }
    ],
    "isDraggable": false, 
    "padding" : {
        "top" : 0.25,
        "bottom": 0.25,
        "left" : 0.75,
        "right" : 0.75
    }
} 


var dropzone = {
    "type": "Dropzone",
    "elements": [
        {
            "type": "DraggableObject",
            "elements": [
                { 
                    "type": "Math",
                    "content": "-3dr^{2}",
                    "wrap": false,
                    "whiteSpaces": true,
                    "innerPadding": false,
                    "font": {
                        "color": {
                            "text": {
                                "code": 0
                            }
                        }
                    }
                }
            ],
            "isDraggable": false, 
            "padding" : {
                "top" : 0.25,
                "bottom": 0.25,
                "left" : 0.75,
                "right" : 0.75
            }
        }
    ],
    "valid": [ 
        {
            "type": "DraggableObject",
            "elements": [
                {
                    "type": "Math",
                    "content": "-3dr^{2}",
                    "wrap": false,
                    "whiteSpaces": true,
                    "innerPadding": false, 
                    "font": {
                        "color": { 
                            "text": {
                                "code": 0
                            }
                        }
                    }
                }
            ]
        }
    ],
    "count": 10,
    "remove": false,
    "copy": false,
    "align": "center",
    "verticalAlign": "top",
    "size": {
        "height": 8
    },
    "answer": [

    ],
    "locianOptions": {
        "check": false
    },
    "useElementPosition": false,
    "elementPosition": "left",
    "useSelection": false
}



var label = {
    "type": "Label",
    "coords": {
        "point": {
            "x": 5,
            "y": 7
        }
    },
    "label": {
        "type": "Math",
        "content": "655",
        "wrap": false,
        "whiteSpaces": true,
        "innerPadding": false,
        "font": {
            "color": {
                "text": {
                    "code": 0
                }
            }
        }
    }
}







var lattice = {
    "type": "Lattice",
    "value": [
        [ 
            {
                "object": {
                    "type": "Block", 
                    "value": [
                        {
                            "type": "Static",
                            "mode": "text",
                            "value": "The new picture frame is "
                        },
                        {
                            "type": "Static",
                            "mode": "math",
                            "value": "845\\text{ }\\text{cm}^2",
                            "option": {
                                "color": 0
                            }
                        },
                        {
                            "type": "Static",
                            "mode": "text",
                            "value": " smaller."
                        }
                    ],
                    "option": {
                        "align": "center", 
                        "textAlign": "left",
                        "border": false,
                        "mode": "normal"
                    }
                },
                "option": {
                    "background": 0,
                    "preset": [],
                    "textAlign": "left",
                    "verticalAlign": "middle",
                    "paddingLeft": 20
                }
            }
        ]
    ],
    "newsinod": {
        "type": "Table",
        "size": {
            "width": 1
        },
        "cells": [
            [
                { 
                    "type": "TableCellBox",
                    "elements": [
                        {
                            "type": "Text",
                            "content": "The new picture frame is "
                        },
                        {
                            "type": "Math",
                            "content": "845\\text{ }\\text{cm}^2"
                        },
                        {
                            "type": "Text",
                            "content": " smaller."
                        }
                        ],
                    "size": {
                        "width": 1,
                        "height": -1
                    },
                    "border": [],
                    "padding": {
                        "top": 0,
                        "bottom": 0,
                        "left": 0.9375,
                        "right": 0
                    },
                    "rowspan": 1,
                    "colspan": 1,
                    "align": {
                        "hor": "left",
                        "ver": "middle"
                    },
                    "background": {
                        "color": -1
                    }
                }
            ]
        ],
        "dynamic": false
    }
}



var layer = {
    "type": "Layer",
    "source": {
        "type": "Math",
        "content": "28",
        "wrap": false,
        "whiteSpaces": true,
        "innerPadding": false,
        "font": {
            "color": {
                "text": {
                    "code": 0
                }
            }
        }
    },
    "elements": [
        {
            "type": "Image",
            "url": "https:\/\/contents.knowreapi.com\/us\/illust\/slash_2.svg",
            "position": []
        }
    ],
    "display": "inline",
    "elementsAlign": {
        "ver": "middle"
    }
}

var partial = {
    "type": "Partial",
    "value": "3\\times \\frac{5}{8}= \\editable{}",
    "object": [
        {
            "type": "Input",
            "mode": "math",
            "value": "",
            "option": {
                "order": 0,
                "width": 2,
                "height": 2,
                "answerType": "0",
                "lacoType": "2",
                "whitelist": [],
                "blacklist": [],
                "grammar": "default_up"
            },
            "content": "\\frac{15}{8}",
            "size": {
                "width": 2
            }
        }
    ],
    "content": "3\\times \\frac{5}{8}= \\editable{}"
}



var partition1d = {
    "type": "Partition1D",
    "points": [
        {
            "type": "Point1D",
            "coord": -6,
            "style": {
                "fill": false
            }
        },
        {
            "type": "Point1D",
            "coord": -2,
            "style": {
                "fill": false
            }
        }
    ],
    "fill": [
        1
    ],
    "style": {
        "fillColor": {
            "code": 3
        }
    },
    "interaction": {
        "selectable": false
    }
}


var table = {"type":"Table","cells":[[{"type":"TableCellBox","elements":[{"type":"Blank"}],"align":{"hor":"center","ver":"baseline"},"color":{"code":-1}},{"type":"TableCellBox","elements":[{"type":"Math","content":"-3+3x=4x-1","wrap":false,"whiteSpaces":true,"innerPadding":false}],"align":{"hor":"left","ver":"baseline"},"color":{"code":-1}}],[{"type":"TableCellBox","elements":[{"type":"Math","content":"\\implies","wrap":false,"whiteSpaces":true,"innerPadding":false}],"align":{"hor":"center","ver":"baseline"},"color":{"code":-1}},{"type":"TableCellBox","elements":[{"type":"Math","content":"-3+3\\left(-2\\right)=4\\left(-2\\right)-1","wrap":false,"whiteSpaces":true,"innerPadding":false}],"align":{"hor":"left","ver":"baseline"},"color":{"code":-1}}],[{"type":"TableCellBox","elements":[{"type":"Math","content":"\\implies","wrap":false,"whiteSpaces":true,"innerPadding":false}],"align":{"hor":"center","ver":"baseline"},"color":{"code":-1}},{"type":"TableCellBox","elements":[{"type":"Math","content":"-9=-9","wrap":false,"whiteSpaces":true,"innerPadding":false}],"align":{"hor":"left","ver":"baseline"},"color":{"code":-1}}]],"size":{"width":0},"dynamic":true}


var tree = {
    "type": "Tree",
    "nodes": [
        {
            "type": "TreeNode",
            "content": {
                "type": "Math",
                "content": "132",
                "wrap": false, 
                "whiteSpaces": true,
                "innerPadding": false
            },
            "children": [
                { 
                    "type": "TreeNode",
                    "content": {
                        "type": "Math",
                        "content": "4",
                        "wrap": false,
                        "whiteSpaces": true,
                        "innerPadding": false
                    },
                    "children": [
                        {
                            "type": "TreeNode",
                            "content": {
                                "type": "Math",
                                "content": "2",
                                "wrap": false,
                                "whiteSpaces": true,
                                "innerPadding": false
                            },
                            "children": [],
                            "style": {
                                "lineVisible": true
                            },
                            "border": {
                                "top": {
                                    "width": 0
                                },
                                "right": {
                                    "width": 0
                                },
                                "bottom": {
                                    "width": 0
                                }, 
                                "left": {
                                    "width": 0
                                }
                            }
                        },
                        {
                            "type": "TreeNode",
                            "content": {
                                "type": "Math",
                                "content": "2",
                                "wrap": false,
                                "whiteSpaces": true,
                                "innerPadding": 
                                false
                            },
                            "children": [],
                            "border":
                            {
                                "top": {
                                    "width": 0 
                                },
                                "right": {
                                    "width": 0
                                },
                                "bottom": {
                                    "width": 0
                                },
                                "left": {
                                    "width": 0
                                }
                            }
                        }
                    ],
                    "style": {
                        "lineVisible": true
                    },
                    "border": {
                        "top": {
                            "width": 0
                        },
                        "right": {
                            "width": 0
                        },
                        "bottom": {
                            "width": 0
                        },
                        "left" :
                        {
                            "width": 0
                        }
                    }
                },
                {
                    "type": "TreeNode",
                    "content": {
                        "type": "Math",
                        "content": "33",
                        "wrap": false,
                        "whiteSpaces": true,
                        "innerPadding": false
                    },
                    "children": [
                        { 
                            "type": "TreeNode",
                            "content":
                            {
                                "type": "Math",
                                "content": "3",
                                "wrap": false,
                                "whiteSpaces": true,
                                "innerPadding": false
                            },
                            "children": [],
                            "style": {
                                "lineVisible": true
                            },
                            "border": {
                                "top": { 
                                    "width": 0
                                },
                                "right": {
                                    "width": 0
                                },
                                "bottom": {
                                    "width": 0
                                },
                                "left": {
                                    "width": 0
                                }
                            }
                        },
                        {
                            "type": "TreeNode",
                            "content": {
                                "type": "Math",
                                "content": "11",
                                "wrap": false,
                                "whiteSpaces": true,
                                "innerPadding": false
                            },
                            "children": [],
                            "border": {
                                "top": {
                                    "width": 0
                                },
                                "right": {
                                    "width": 0
                                },
                                "bottom": {
                                    "width": 0
                                },
                                "left": {
                                    "width": 0
                                }
                            }
                        }
                    ],
                    "border": {
                        "top": {
                            "width":
                            0
                        },
                        "right": {
                            "width": 0
                        },
                        "bottom": {
                            "width": 0
                        },
                        "left": {
                            "width": 0
                        }
                    }
                }
            ],
            "style": {
                "lineVisible": false
            },
            "border": {
                "top": {
                    "width": 0
                },
                "right": {
                    "width": 0
                },
                "bottom": {
                    "width": 0
                },
                "left": {
                    "width": 0
                }
            }
        }
    ]
}



var trig = {
    "type": "Trig",
    "radius": 1,
    "needles": [
        {
            "type": "TrigNeedle",
            "degree": 0,
            "style": {
                "stroke-width": 0,
                "color": {
                    "code": 0,
                    "weight": "normalMedium"
                }
            },
            "pointer": {
                "pointerType": "point"
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
                "offset": 0.8
            },
            "radianContent": [],
            "coordContent": []
        },
        {
            "type": "TrigNeedle",
            "degree": 30,
            "style": {
                "stroke-width": 0,
                "color": {
                    "code": 0,
                    "weight": "normalMedium"
                }
            },
            "pointer": {
                "pointerType": "point"
            }
        },
        {
            "type": "TrigNeedle",
            "degree": 30,
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
                "offset": 0.8
            },
            "radianContent": [],
            "coordContent": []
        },
        {
            "type": "TrigNeedle",
            "degree": 45,
            "style": {
                "stroke-width": 0,
                "color": {
                    "code": 0,
                    "weight": "normalMedium"
                }
            },
            "pointer": {
                "pointerType": "point"
            }
        },
        {
            "type": "TrigNeedle",
            "degree": 45,
            "style": {
                "stroke-width": 2.5,
                "color": {
                    "code": -1
                }
            },
            "degreeContent": {
                "element": {
                    "type": "Math",
                    "content": "45\\degree",
                    "font": {
                        "color": {
                            "text": {
                                "code": 0
                            }
                        }
                    }
                },
                "offset": 0.8
            },
            "radianContent": [],
            "coordContent": []
        },
        {
            "type": "TrigNeedle",
            "degree": 60,
            "style": {
                "stroke-width": 0,
                "color": {
                    "code": 0,
                    "weight": "normalMedium"
                }
            },
            "pointer": {
                "pointerType": "point"
            }
        },
        {
            "type": "TrigNeedle",
            "degree": 60,
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
                "offset": 0.8
            },
            "radianContent": [],
            "coordContent": []
        },
        {
            "type": "TrigNeedle",
            "degree": 90,
            "style": {
                "stroke-width": 0,
                "color": {
                    "code": 0,
                    "weight": "normalMedium"
                }
            },
            "pointer": {
                "pointerType": "point"
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
                "offset": 0.8
            },
            "radianContent": [],
            "coordContent": []
        },
        {
            "type": "TrigNeedle",
            "degree": 30,
            "style": {
                "stroke-width": 0,
                "color": {
                    "code": 0,
                    "weight": "normalMedium"
                }
            },
            "pointer": {
                "pointerType": "point"
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
            "degreeContent": [],
            "radianContent": [],
            "coordContent": {
                "element": {
                    "type": "Math",
                    "content": "\\left(\\frac{\\sqrt{3}}{2}, \\space \\frac{1}{2}\\right)",
                    "font": {
                        "color": {
                            "text": {
                                "code":
                                    0
                            }
                        }
                    }
                },
                "offset": 1.1
            }
        },
        {
            "type": "TrigNeedle",
            "degree": 45,
            "style": {
                "stroke-width": 0,
                "color": {
                    "code": 0,
                    "weight": "normalMedium"
                }
            },
            "pointer": {
                "pointerType": "point"
            }
        },
        {
            "type": "TrigNeedle",
            "degree": 45,
            "style": {
                "stroke-width": 2.5,
                "color": {
                    "code": -1
                }
            },
            "degreeContent": [],
            "radianContent": [],
            "coordContent": {
                "element": {
                    "type": "Math",
                    "content": "\\left(\\frac{\\sqrt{2}}{2}, \\space \\frac{\\sqrt{2}}{2}\\right)",
                    "font": {
                        "color": {
                            "text": {
                                "code": 0
                            }
                        }
                    }
                },
                "offset": 1.1
            }
        },
        {
            "type": "TrigNeedle",
            "degree": 60,
            "style": {
                "stroke-width": 0,
                "color": {
                    "code": 0,
                    "weight": "normalMedium"
                }
            },
            "pointer": {
                "pointerType": "point"
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
            "degreeContent": [],
            "radianContent": [],
            "coordContent": {
                "element": {
                    "type": "Math",
                    "content": "\\left(\\frac{1}{2}, \\space \\frac{\\sqrt{3}}{2}\\right)",
                    "font": {
                        "color": {
                            "text": {
                                "code": 0
                            }
                        }
                    }
                },
                "offset": 1.15
            }
        },
        {
            "type": "TrigNeedle",
            "degree": 0,
            "style": {
                "stroke-width": 0,
                "color": {
                    "code": 0,
                    "weight": "normalMedium"
                }
            },
            "pointer": {
                "pointerType": "point"
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
            "degreeContent": [],
            "radianContent": [],
            "coordContent": {
                "element": {
                    "type": "Math",
                    "content": "\\left(1, \\space 0\\right)",
                    "font": {
                        "color": {
                            "text": {
                                "code": 0
                            }
                        }
                    }
                },
                "offset": 1.1
            }
        },
        {
            "type": "TrigNeedle",
            "degree": 90,
            "style": {
                "stroke-width": 0,
                "color": {
                    "code": 0,
                    "weight": "normalMedium"
                }
            },
            "pointer": {
                "pointerType": "point"
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
            "degreeContent": [],
            "radianContent": [],
            "coordContent": {
                "element": {
                    "type": "Math",
                    "content": "\\left(0, \\space 1\\right)",
                    "font": {
                        "color": {
                            "text": {
                                "code": 0
                            }
                        }
                    }
                },
                "offset": 1.1
            }
        }
    ],
    "step": 1,
    "degree": {
        "start": 0,
        "end": 360
    }
}




var object = {
    "type": "Relation",
    "input": true,
    "height": "short",
    "set": [
      {
        "name": {
          "type": "Static",
          "mode": "null"
        },
        "element": [
          {
            "type": "Static",
            "mode": "math",
            "value": "3\\times 4"
          },
          {
            "type": "Static",
            "mode": "math",
            "value": "2\\times 6"
          },
          {
            "type": "Static",
            "mode": "math",
            "value": "2\\times 4"
          }
        ],
        "width": 210
      },
      {
        "name": {
          "type": "Static",
          "mode": "null"
        },
        "element": [
          {
            "type": "Static",
            "mode": "math",
            "value": "4\\times 2"
          },
          {
            "type": "Static",
            "mode": "math",
            "value": "4\\times 3"
          },
          {
            "type": "Static",
            "mode": "math",
            "value": "6\\times 2"
          }
        ],
        "width": 210
      }
    ],
    "relation": [
      {
        "name": {
          "type": "Static",
          "mode": "null"
        },
        "value": [
          {
            "source": 0,
            "target": 1,
            "color": 1,
            "arrow": [
              false,
              true
            ]
          },
          {
            "source": 1,
            "target": 2,
            "color": 1,
            "arrow": [
              false,
              true
            ]
          },
          {
            "source": 2,
            "target": 0,
            "color": 1,
            "arrow": [
              false,
              true
            ]
          }
        ],
        "width": 100
      }
    ],
    "option": {
      "border": true,
      "setName": false,
      "relationName": false
    }
  }