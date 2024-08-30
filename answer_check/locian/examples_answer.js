// cartesian2d-selectable

{
    "result": false,
    "results": [
        false,
        null
    ],
    "requestURI": "",
    "answer": {
        "E": [],
        "M": [
            {
                "type": "Cartesian2D-Selectable",
                "selectedAnswer": false,
                "selected": false
            },
            {
                "type": "Cartesian2D-Selectable",
                "selectedAnswer": false,
                "selected": false
            },
            {
                "type": "Cartesian2D-Selectable",
                "selectedAnswer": false,
                "selected": false
            },
            {
                "type": "Cartesian2D-Selectable",
                "selectedAnswer": false,
                "selected": false
            },
            {
                "type": "Cartesian2D-Selectable",
                "selectedAnswer": true,
                "selected": false
            }
        ],
        "Stack": []
    },
    "inswer": {
        "E": [],
        "M": [
            {
                "type": "Cartesian2D-Selectable",
                "selectedAnswer": false,
                "selected": false
            },
            {
                "type": "Cartesian2D-Selectable",
                "selectedAnswer": false,
                "selected": false
            },
            {
                "type": "Cartesian2D-Selectable",
                "selectedAnswer": false,
                "selected": false
            },
            {
                "type": "Cartesian2D-Selectable",
                "selectedAnswer": false,
                "selected": false
            },
            {
                "type": "Cartesian2D-Selectable",
                "selectedAnswer": true,
                "selected": false
            }
        ],
        "Stack": []
    },
    "groupMedia": [
        null,
        null
    ],
    "module": 0
}

// chartgraph

{
    "result": false,
    "results": [
        false,
        null
    ],
    "requestURI": "",
    "answer": {
        "E": [],
        "M": [
            {
                "type": "ChartGraph",
                "graph": "Line",
                "data": [
                    [
                        {
                            "coord": 14
                        },
                        {
                            "coord": 7
                        },
                        {
                            "coord": 20
                        },
                        {
                            "coord": 13
                        },
                        {
                            "coord": 13.2
                        }
                    ]
                ],
                "barMarginRatio": 0.25,
                "showLabel": false,
                "legend": [],
                "style": [
                    {
                        "color": {
                            "code": 3,
                            "weight": "normalMedium"
                        },
                        "fill": true,
                        "dotPosition": "end",
                        "stroke": {
                            "width": 2,
                            "color": {
                                "code": 3,
                                "weight": "normalMedium"
                            },
                            "interaction": {
                                "opacity": 1
                            }
                        },
                        "dotColor": {
                            "code": 0,
                            "weight": "normalHard"
                        }
                    }
                ],
                "interaction": {
                    "selectable": false,
                    "movable": false
                },
                "isRenderLegendAsElement": false,
                "legendElementDriection": "right",
                "legendElements": []
            },
            {
                "type": "SingleChoice",
                "answer": [
                    2
                ]
            }
        ],
        "Stack": []
    },
    "inswer": {
        "E": [],
        "M": [
            {
                "type": "ChartGraph",
                "graph": "Line",
                "data": [
                    [
                        {
                            "coord": 14
                        },
                        {
                            "coord": 7
                        },
                        {
                            "coord": 20
                        },
                        {
                            "coord": 13
                        },
                        {
                            "coord": 13.2
                        }
                    ]
                ],
                "style": [
                    {
                        "color": {
                            "code": 3,
                            "weight": "normalMedium",
                            "opacity": 1,
                            "useOpacity": false
                        },
                        "fill": true,
                        "dotPosition": "end",
                        "stroke": {
                            "width": 2,
                            "color": {
                                "code": 3,
                                "weight": "normalMedium",
                                "opacity": 1,
                                "useOpacity": false
                            },
                            "interaction": {
                                "opacity": 1
                            }
                        },
                        "dotColor": {
                            "code": 0,
                            "weight": "normalHard"
                        },
                        "interaction": {
                            "opacity": 1
                        }
                    }
                ],
                "labels": [
                    []
                ]
            },
            {
                "type": "SingleChoice",
                "answer": -1
            }
        ],
        "Stack": []
    },
    "groupMedia": [
        null,
        null
    ],
    "module": 0
}


// curve2d

{
    "result": false,
    "results": [
        true,
        false
    ],
    "requestURI": "",
    "answer": {
        "E": [],
        "M": [],
        "Stack": [],
        "G": [
            {
                "type": "Curve2D",
                "equation": "y=4\/x",
                "style": {
                    "arrow": false,
                    "color": {
                        "code": -1,
                        "weight": "normalHard"
                    }
                },
                "asymptotes": {
                    "hor": [],
                    "ver": []
                },
                "domain": {
                    "mode": "arrow",
                    "x": [
                        {
                            "min": -5,
                            "max": 5
                        }
                    ],
                    "y": [
                        {
                            "min": -5,
                            "max": 5
                        }
                    ],
                    "endpoints": {
                        "left": "infinity",
                        "right": "infinity"
                    }
                },
                "coords": [
                    {
                        "x": 2,
                        "y": 1
                    },
                    {
                        "x": 4,
                        "y": -2
                    }
                ],
                "interaction": {
                    "movable": "rational",
                    "selectable": false,
                    "selected": false,
                    "domain": false,
                    "removable": false
                },
                "locianOptions": {
                    "check": true,
                    "equation": "y=4\/x",
                    "boundary": null,
                    "bounds": {
                        "x": {
                            "min": -5,
                            "max": 5
                        },
                        "y": {
                            "min": -5,
                            "max": 5
                        }
                    }
                }
            }
        ]
    },
    "inswer": {
        "E": [],
        "M": [],
        "Stack": [],
        "G": [
            {
                "type": "Curve2D",
                "equation": "y = -6 \/ (x - 2.0001) + 1",
                "interaction": {
                    "movable": "rational",
                    "selectable": "none",
                    "selected": false,
                    "domain": false,
                    "removable": false,
                    "dash": false
                },
                "coords": [
                    {
                        "x": 2,
                        "y": 1
                    },
                    {
                        "x": 4,
                        "y": -2
                    },
                    {
                        "x": 0,
                        "y": 4
                    }
                ],
                "domain": {
                    "mode": "arrow",
                    "x": [
                        {
                            "min": -5,
                            "max": 5
                        }
                    ],
                    "y": [
                        {
                            "min": -5,
                            "max": 5
                        }
                    ],
                    "endpoints": {
                        "left": "infinity",
                        "right": "infinity"
                    },
                    "visible": false
                },
                "style": {
                    "arrow": false,
                    "color": {
                        "code": -1,
                        "weight": "normalHard",
                        "opacity": 1,
                        "useOpacity": false
                    },
                    "arrowSize": 1,
                    "dash": "none"
                },
                "locianOptions": {
                    "check": true,
                    "equation": "y=4\/x",
                    "boundary": null,
                    "bounds": {
                        "x": {
                            "min": -5,
                            "max": 5
                        },
                        "y": {
                            "min": -5,
                            "max": 5
                        }
                    }
                }
            }
        ]
    },
    "groupMedia": [
        [
            {
                "type": "Curve2D",
                "equation": "y=4\/x",
                "style": {
                    "arrow": false,
                    "color": {
                        "code": -1,
                        "weight": "normalHard"
                    }
                },
                "asymptotes": {
                    "hor": [],
                    "ver": []
                },
                "domain": {
                    "mode": "arrow",
                    "x": [
                        {
                            "min": -5,
                            "max": 5
                        }
                    ],
                    "y": [
                        {
                            "min": -5,
                            "max": 5
                        }
                    ],
                    "endpoints": {
                        "left": "infinity",
                        "right": "infinity"
                    }
                },
                "coords": [
                    {
                        "x": 2,
                        "y": 1
                    },
                    {
                        "x": 4,
                        "y": -2
                    }
                ],
                "interaction": {
                    "movable": "rational",
                    "selectable": false,
                    "selected": false,
                    "domain": false,
                    "removable": false
                },
                "locianOptions": {
                    "check": true,
                    "equation": "y=4\/x",
                    "boundary": null,
                    "bounds": {
                        "x": {
                            "min": -5,
                            "max": 5
                        },
                        "y": {
                            "min": -5,
                            "max": 5
                        }
                    }
                }
            }
        ],
        [
            {
                "type": "Curve2D",
                "equation": "y = -6 \/ (x - 2.0001) + 1",
                "interaction": {
                    "movable": "rational",
                    "selectable": "none",
                    "selected": false,
                    "domain": false,
                    "removable": false,
                    "dash": false
                },
                "coords": [
                    {
                        "x": 2,
                        "y": 1
                    },
                    {
                        "x": 4,
                        "y": -2
                    },
                    {
                        "x": 0,
                        "y": 4
                    }
                ],
                "domain": {
                    "mode": "arrow",
                    "x": [
                        {
                            "min": -5,
                            "max": 5
                        }
                    ],
                    "y": [
                        {
                            "min": -5,
                            "max": 5
                        }
                    ],
                    "endpoints": {
                        "left": "infinity",
                        "right": "infinity"
                    },
                    "visible": false
                },
                "style": {
                    "arrow": false,
                    "color": {
                        "code": -1,
                        "weight": "normalHard",
                        "opacity": 1,
                        "useOpacity": false
                    },
                    "arrowSize": 1,
                    "dash": "none"
                },
                "locianOptions": {
                    "check": true,
                    "equation": "y=4\/x",
                    "boundary": null,
                    "bounds": {
                        "x": {
                            "min": -5,
                            "max": 5
                        },
                        "y": {
                            "min": -5,
                            "max": 5
                        }
                    }
                }
            }
        ]
    ],
    "module": 0
}


// curve2d

{
    "result": false,
    "results": [
        true,
        false
    ],
    "requestURI": "",
    "answer": {
        "E": [],
        "M": [],
        "Stack": [],
        "G": [
            {
                "type": "Curve2D",
                "equation": "y=Math.pow(x,2)",
                "style": {
                    "arrow": false,
                    "color": {
                        "code": 0,
                        "weight": "normalHard"
                    }
                },
                "asymptotes": {
                    "hor": [],
                    "ver": []
                },
                "domain": {
                    "mode": "arrow",
                    "x": [
                        {
                            "min": -7,
                            "max": 8
                        }
                    ],
                    "y": [
                        {
                            "min": -3,
                            "max": 10
                        }
                    ],
                    "endpoints": {
                        "left": "infinity",
                        "right": "infinity"
                    }
                },
                "coords": [
                    {
                        "x": 0,
                        "y": 0
                    },
                    {
                        "x": 1,
                        "y": 5
                    }
                ],
                "interaction": {
                    "movable": "quadratic",
                    "selectable": "single",
                    "selected": true,
                    "domain": false
                },
                "locianOptions": {
                    "check": true,
                    "equation": "y=Math.pow(x,2)",
                    "boundary": null,
                    "bounds": {
                        "x": {
                            "min": -7,
                            "max": 8
                        },
                        "y": {
                            "min": -3,
                            "max": 10
                        }
                    }
                }
            }
        ]
    },
    "inswer": {
        "E": [],
        "M": [],
        "Stack": [],
        "G": [
            {
                "type": "Curve2D",
                "equation": "y = 5 * Math.pow(x - 0, 2) + 0",
                "interaction": {
                    "movable": "quadratic",
                    "selectable": "single",
                    "selected": true,
                    "domain": false,
                    "removable": false,
                    "dash": false
                },
                "coords": [
                    {
                        "x": 0,
                        "y": 0
                    },
                    {
                        "x": 1,
                        "y": 5
                    },
                    {
                        "x": -1,
                        "y": 5
                    }
                ],
                "domain": {
                    "mode": "arrow",
                    "x": [
                        {
                            "min": -7,
                            "max": 8
                        }
                    ],
                    "y": [
                        {
                            "min": -3,
                            "max": 10
                        }
                    ],
                    "endpoints": {
                        "left": "infinity",
                        "right": "infinity"
                    },
                    "visible": false
                },
                "style": {
                    "arrow": false,
                    "color": {
                        "code": 0,
                        "weight": "normalHard",
                        "opacity": 1,
                        "useOpacity": false
                    },
                    "arrowSize": 1,
                    "dash": "none"
                },
                "locianOptions": {
                    "check": true,
                    "equation": "y=Math.pow(x,2)",
                    "boundary": null,
                    "bounds": {
                        "x": {
                            "min": -7,
                            "max": 8
                        },
                        "y": {
                            "min": -3,
                            "max": 10
                        }
                    }
                }
            }
        ]
    },
    "groupMedia": [
        [
            {
                "type": "Curve2D",
                "equation": "y=Math.pow(x,2)",
                "style": {
                    "arrow": false,
                    "color": {
                        "code": 0,
                        "weight": "normalHard"
                    }
                },
                "asymptotes": {
                    "hor": [],
                    "ver": []
                },
                "domain": {
                    "mode": "arrow",
                    "x": [
                        {
                            "min": -7,
                            "max": 8
                        }
                    ],
                    "y": [
                        {
                            "min": -3,
                            "max": 10
                        }
                    ],
                    "endpoints": {
                        "left": "infinity",
                        "right": "infinity"
                    }
                },
                "coords": [
                    {
                        "x": 0,
                        "y": 0
                    },
                    {
                        "x": 1,
                        "y": 5
                    }
                ],
                "interaction": {
                    "movable": "quadratic",
                    "selectable": "single",
                    "selected": true,
                    "domain": false
                },
                "locianOptions": {
                    "check": true,
                    "equation": "y=Math.pow(x,2)",
                    "boundary": null,
                    "bounds": {
                        "x": {
                            "min": -7,
                            "max": 8
                        },
                        "y": {
                            "min": -3,
                            "max": 10
                        }
                    }
                }
            }
        ],
        [
            {
                "type": "Curve2D",
                "equation": "y = 5 * Math.pow(x - 0, 2) + 0",
                "interaction": {
                    "movable": "quadratic",
                    "selectable": "single",
                    "selected": true,
                    "domain": false,
                    "removable": false,
                    "dash": false
                },
                "coords": [
                    {
                        "x": 0,
                        "y": 0
                    },
                    {
                        "x": 1,
                        "y": 5
                    },
                    {
                        "x": -1,
                        "y": 5
                    }
                ],
                "domain": {
                    "mode": "arrow",
                    "x": [
                        {
                            "min": -7,
                            "max": 8
                        }
                    ],
                    "y": [
                        {
                            "min": -3,
                            "max": 10
                        }
                    ],
                    "endpoints": {
                        "left": "infinity",
                        "right": "infinity"
                    },
                    "visible": false
                },
                "style": {
                    "arrow": false,
                    "color": {
                        "code": 0,
                        "weight": "normalHard",
                        "opacity": 1,
                        "useOpacity": false
                    },
                    "arrowSize": 1,
                    "dash": "none"
                },
                "locianOptions": {
                    "check": true,
                    "equation": "y=Math.pow(x,2)",
                    "boundary": null,
                    "bounds": {
                        "x": {
                            "min": -7,
                            "max": 8
                        },
                        "y": {
                            "min": -3,
                            "max": 10
                        }
                    }
                }
            }
        ]
    ],
    "module": 0
}

// dropzone

{
    "result": false,
    "results": [
        false,
        null
    ],
    "requestURI": "",
    "answer": {
        "E": [],
        "M": [
            {
                "type": "Dropzone",
                "answer": [
                    {
                        "type": "Math",
                        "content": "\\log_{\\frac{1}{3}}x",
                        "wrap": false,
                        "whiteSpaces": true,
                        "innerPadding": false,
                        "font": {
                            "color": {
                                "text": {
                                    "weight": "normalHard"
                                }
                            }
                        },
                        "option": {
                            "ds": "\\log{x}{\\frac{1}{3}}",
                            "classname": "Log"
                        }
                    }
                ]
            },
            {
                "type": "Dropzone",
                "answer": [
                    {
                        "type": "Math",
                        "content": "7^{x}",
                        "wrap": false,
                        "whiteSpaces": true,
                        "innerPadding": false,
                        "font": {
                            "color": {
                                "text": {
                                    "weight": "normalHard"
                                }
                            }
                        },
                        "option": {
                            "ds": "7^{x}",
                            "classname": "Exponential"
                        }
                    }
                ]
            }
        ],
        "Stack": []
    },
    "inswer": {
        "E": [],
        "M": [
            {
                "type": "Dropzone",
                "answer": [
                    {
                        "type": "Math",
                        "content": "\\log_{\\frac{1}{7}}x",
                        "wrap": false,
                        "whiteSpaces": true,
                        "innerPadding": false,
                        "font": {
                            "color": {
                                "text": {
                                    "weight": "normalHard",
                                    "code": 0,
                                    "opacity": 1,
                                    "useOpacity": false,
                                    "red": 0,
                                    "green": 0,
                                    "blue": 0,
                                    "useCustomColor": false
                                },
                                "background": {
                                    "code": -1,
                                    "weight": "opaqueWeak",
                                    "opacity": 1,
                                    "useOpacity": false
                                }
                            },
                            "size": 1,
                            "decoration": {
                                "underline": false,
                                "bold": false,
                                "italic": false,
                                "color": {
                                    "code": 0,
                                    "weight": "normalMedium",
                                    "opacity": 1,
                                    "useOpacity": false
                                }
                            }
                        },
                        "option": {
                            "ds": "\\log{x}{\\frac{1}{7}}",
                            "classname": "Log"
                        },
                        "category": "Basic",
                        "useUnderlineColor": false,
                        "display": "inline",
                        "align": {
                            "ver": "baseline"
                        },
                        "interaction": {
                            "selectable": false,
                            "selected": false
                        },
                        "border": {
                            "top": {
                                "width": 0,
                                "style": "solid",
                                "color": {
                                    "code": 0,
                                    "weight": "normalMedium",
                                    "opacity": 1,
                                    "useOpacity": false
                                }
                            },
                            "right": {
                                "width": 0,
                                "style": "solid",
                                "color": {
                                    "code": 0,
                                    "weight": "normalMedium",
                                    "opacity": 1,
                                    "useOpacity": false
                                }
                            },
                            "bottom": {
                                "width": 0,
                                "style": "solid",
                                "color": {
                                    "code": 0,
                                    "weight": "normalMedium",
                                    "opacity": 1,
                                    "useOpacity": false
                                }
                            },
                            "left": {
                                "width": 0,
                                "style": "solid",
                                "color": {
                                    "code": 0,
                                    "weight": "normalMedium",
                                    "opacity": 1,
                                    "useOpacity": false
                                }
                            },
                            "radius": {
                                "topLeft": 0,
                                "topRight": 0,
                                "bottomRight": 0,
                                "bottomLeft": 0
                            }
                        },
                        "padding": {
                            "top": 0,
                            "bottom": 0,
                            "left": 0,
                            "right": 0
                        },
                        "margin": {
                            "top": 0,
                            "bottom": 0,
                            "left": 0,
                            "right": 0
                        },
                        "position": {
                            "left": 0,
                            "top": 0
                        },
                        "transform": {
                            "rotate": 0,
                            "flip": {
                                "x": false,
                                "y": false
                            }
                        }
                    }
                ]
            },
            {
                "type": "Dropzone",
                "answer": []
            }
        ],
        "Stack": []
    },
    "groupMedia": [
        null,
        null
    ],
    "module": 0
}


// dropzone

{
    "result": false,
    "results": [
        false,
        null
    ],
    "requestURI": "",
    "answer": {
        "E": [],
        "M": [
            {
                "type": "Dropzone",
                "answer": [
                    {
                        "type": "Text",
                        "content": "모으면",
                        "whiteSpaces": true,
                        "font": {
                            "color": {
                                "text": {
                                    "weight": "normalHard"
                                }
                            }
                        }
                    }
                ]
            },
            {
                "type": "Dropzone",
                "answer": [
                    {
                        "type": "Math",
                        "content": 4,
                        "wrap": false,
                        "whiteSpaces": true,
                        "innerPadding": false,
                        "font": {
                            "color": {
                                "text": {
                                    "weight": "normalHard"
                                }
                            }
                        },
                        "option": {
                            "ds": 4,
                            "classname": "Natural"
                        }
                    }
                ]
            },
            {
                "type": "Dropzone",
                "answer": [
                    {
                        "type": "Math",
                        "content": 5,
                        "wrap": false,
                        "whiteSpaces": true,
                        "innerPadding": false,
                        "font": {
                            "color": {
                                "text": {
                                    "weight": "normalHard"
                                }
                            }
                        },
                        "option": {
                            "ds": 5,
                            "classname": "Natural"
                        }
                    }
                ]
            },
            {
                "type": "Dropzone",
                "answer": [
                    {
                        "type": "Math",
                        "content": 9,
                        "wrap": false,
                        "whiteSpaces": true,
                        "innerPadding": false,
                        "font": {
                            "color": {
                                "text": {
                                    "weight": "normalHard"
                                }
                            }
                        },
                        "option": {
                            "ds": 9,
                            "classname": "Natural"
                        }
                    }
                ]
            }
        ],
        "Stack": []
    },
    "inswer": {
        "E": [],
        "M": [
            {
                "type": "Dropzone",
                "answer": []
            },
            {
                "type": "Dropzone",
                "answer": []
            },
            {
                "type": "Dropzone",
                "answer": []
            },
            {
                "type": "Dropzone",
                "answer": []
            }
        ],
        "Stack": []
    },
    "groupMedia": [
        null,
        null
    ],
    "module": 0
}

// dropzone
{
    "result": false,
    "results": [
        false,
        null
    ],
    "requestURI": "",
    "answer": {
        "E": {
            "Input": [
                {
                    "value": 2,
                    "order": "A2",
                    "checktype": [
                        "laco",
                        58
                    ],
                    "answertype": 0,
                    "whitelist": [],
                    "blacklist": []
                }
            ]
        },
        "M": [
            {
                "type": "Dropzone",
                "answer": [
                    {
                        "type": "Image",
                        "url": "http:\/\/locian.knowreinc.com:43210\/KR_illust\/pug.png"
                    },
                    {
                        "type": "Image",
                        "url": "http:\/\/locian.knowreinc.com:43210\/KR_illust\/pug.png"
                    },
                    {
                        "type": "Image",
                        "url": "http:\/\/locian.knowreinc.com:43210\/KR_illust\/pug.png"
                    },
                    {
                        "type": "Image",
                        "url": "http:\/\/locian.knowreinc.com:43210\/KR_illust\/pug.png"
                    },
                    {
                        "type": "Image",
                        "url": "http:\/\/locian.knowreinc.com:43210\/KR_illust\/pug.png"
                    },
                    {
                        "type": "Image",
                        "url": "http:\/\/locian.knowreinc.com:43210\/KR_illust\/pug.png"
                    },
                    {
                        "type": "Image",
                        "url": "http:\/\/locian.knowreinc.com:43210\/KR_illust\/pug.png"
                    }
                ]
            }
        ],
        "Stack": []
    },
    "inswer": {
        "E": {
            "Input": [
                {
                    "value": "",
                    "order": "A2",
                    "checktype": [
                        "laco",
                        58
                    ],
                    "answertype": 0,
                    "whitelist": [],
                    "blacklist": []
                }
            ]
        },
        "M": [
            {
                "type": "Dropzone",
                "answer": []
            }
        ],
        "Stack": []
    },
    "groupMedia": [
        null,
        null
    ],
    "module": 0
}

// dropzone
{
    "result": false,
    "results": [
        false,
        null
    ],
    "requestURI": "",
    "answer": {
        "E": [],
        "M": [
            {
                "type": "Dropzone",
                "answer": [
                    {
                        "type": "Text",
                        "content": "여섯째",
                        "whiteSpaces": true,
                        "font": {
                            "color": {
                                "text": {
                                    "weight": "normalHard"
                                }
                            }
                        }
                    }
                ]
            },
            {
                "type": "Dropzone",
                "answer": [
                    {
                        "type": "Text",
                        "content": "다섯째",
                        "whiteSpaces": true,
                        "font": {
                            "color": {
                                "text": {
                                    "weight": "normalHard"
                                }
                            }
                        }
                    }
                ]
            },
            {
                "type": "Dropzone",
                "answer": [
                    {
                        "type": "Text",
                        "content": "셋째",
                        "whiteSpaces": true,
                        "font": {
                            "color": {
                                "text": {
                                    "weight": "normalHard"
                                }
                            }
                        }
                    }
                ]
            }
        ],
        "Stack": []
    },
    "inswer": {
        "E": [],
        "M": [
            {
                "type": "Dropzone",
                "answer": []
            },
            {
                "type": "Dropzone",
                "answer": []
            },
            {
                "type": "Dropzone",
                "answer": []
            }
        ],
        "Stack": []
    },
    "groupMedia": [
        null,
        null
    ],
    "module": 0
}



// Input
{
    "result" : false,
    "results" : [
        false,
        null
    ],
    "requestURI": "",
    "answer": {
        "E": {
            "Input": [
                {
                    "value": 6,
                    "order": "A2",
                    "checktype": [
                        "single",
                        "eqeq",
                        "simp",
                        "simp",
                        0
                    ],
                    "answertype": null,
                    "whitelist": null,
                    "blacklist": null
                }
            ]
        },
        "M": [],
        "Stack": []
    },
    "inswer": {
        "E": {
            "Input": [
                {
                    "value": 1,
                    "order": "A2",
                    "checktype": [
                        "single",
                        "eqeq",
                        "simp",
                        "simp",
                        0
                    ],
                    "answertype": null,
                    "whitelist": null,
                    "blacklist": null
                }
            ]
        },
        "M": [],
        "Stack": []
    },
    "groupMedia": [
        null,
        null
    ],
    "module": 0
}

// input - laco
{
    "result": false,
    "results": [
        false,
        null
    ],
    "requestURI": "",
    "answer": {
        "E": {
            "Input": [
                {
                    "value": 6,
                    "order": "A2",
                    "checktype": [
                        "laco",
                        58
                    ],
                    "answertype": 0,
                    "whitelist": [],
                    "blacklist": []
                }
            ]
        },
        "M": [],
        "Stack": []
    },
    "inswer": {
        "E": {
            "Input": [
                {
                    "value": 1,
                    "order": "A2",
                    "checktype": [
                        "laco",
                        58
                    ],
                    "answertype": 0,
                    "whitelist": [],
                    "blacklist": []
                }
            ]
        },
        "M": [],
        "Stack": []
    },
    "groupMedia": [
        null,
        null
    ],
    "module": 0
}


// input - ['single', 'eqeq', simp', 'simp']
{
    "result": false,
    "results": [
        false,
        null
    ],
    "requestURI": "",
    "answer": {
        "E": {
            "Input": [
                {
                    "value": 4,
                    "order": "A2",
                    "checktype": [
                        "single",
                        "eqeq",
                        "simp",
                        "simp",
                        0
                    ],
                    "answertype": null,
                    "whitelist": null,
                    "blacklist": null
                },
                {
                    "value": 5,
                    "order": "A2",
                    "checktype": [
                        "single",
                        "eqeq",
                        "simp",
                        "simp",
                        0
                    ],
                    "answertype": null,
                    "whitelist": null,
                    "blacklist": null
                },
                {
                    "value": 6,
                    "order": "A2",
                    "checktype": [
                        "single",
                        "eqeq",
                        "simp",
                        "simp",
                        0
                    ],
                    "answertype": null,
                    "whitelist": null,
                    "blacklist": null
                }
            ]
        },
        "M": [],
        "Stack": []
    },
    "inswer": {
        "E": {
            "Input": [
                {
                    "value": "",
                    "order": "A2",
                    "checktype": [
                        "single",
                        "eqeq",
                        "simp",
                        "simp",
                        0
                    ],
                    "answertype": null,
                    "whitelist": null,
                    "blacklist": null
                },
                {
                    "value": "",
                    "order": "A2",
                    "checktype": [
                        "single",
                        "eqeq",
                        "simp",
                        "simp",
                        0
                    ],
                    "answertype": null,
                    "whitelist": null,
                    "blacklist": null
                },
                {
                    "value": "",
                    "order": "A2",
                    "checktype": [
                        "single",
                        "eqeq",
                        "simp",
                        "simp",
                        0
                    ],
                    "answertype": null,
                    "whitelist": null,
                    "blacklist": null
                }
            ]
        },
        "M": [],
        "Stack": []
    },
    "groupMedia": [
        null,
        null
    ],
    "module": 0
}



// media - stack
{
    "result": false,
    "results": [
        false,
        null
    ],
    "requestURI": "",
    "answer": {
        "E": [],
        "M": [
            {
                "type": "Stack",
                "key": 8,
                "index": 0
            },
            {
                "type": "Stack",
                "key": 2,
                "index": 0
            },
            {
                "type": "Stack",
                "key": 6,
                "index": 1
            },
            {
                "type": "Stack",
                "key": 3,
                "index": 0
            },
            {
                "type": "Stack",
                "key": 1,
                "index": 0
            },
            {
                "type": "Stack",
                "key": 4,
                "index": 0
            },
            {
                "type": "Stack",
                "key": 7,
                "index": 0
            },
            {
                "type": "Stack",
                "key": 5,
                "index": 0
            },
            {
                "type": "Stack",
                "key": 9,
                "index": 0
            }
        ],
        "Stack": []
    },
    "inswer": {
        "E": [],
        "M": [
            {
                "type": "Stack",
                "key": 8,
                "index": 0
            },
            {
                "type": "Stack",
                "key": 2,
                "index": 0
            },
            {
                "type": "Stack",
                "key": 6,
                "index": 0
            },
            {
                "type": "Stack",
                "key": 3,
                "index": 0
            },
            {
                "type": "Stack",
                "key": 1,
                "index": 0
            },
            {
                "type": "Stack",
                "key": 4,
                "index": 0
            },
            {
                "type": "Stack",
                "key": 7,
                "index": 0
            },
            {
                "type": "Stack",
                "key": 5,
                "index": 1
            },
            {
                "type": "Stack",
                "key": 9,
                "index": 0
            }
        ],
        "Stack": []
    },
    "groupMedia": [
        null,
        null
    ],
    "module": 0
}

// multiplechoice

{
    "result": false,
    "results": [
        false,
        null
    ],
    "requestURI": "",
    "answer": {
        "E": [],
        "M": [
            {
                "type": "MultipleChoice",
                "answer": [
                    0,
                    3
                ]
            }
        ],
        "Stack": []
    },
    "inswer": {
        "E": [],
        "M": [
            {
                "type": "MultipleChoice",
                "answer": []
            }
        ],
        "Stack": []
    },
    "groupMedia": [
        null,
        null
    ],
    "module": 0
}


// multiplechoice

{
    "result": false,
    "results": [
        false,
        null
    ],
    "requestURI": "",
    "answer": {
        "E": [],
        "M": [
            {
                "type": "MultipleChoice",
                "answer": [
                    0,
                    1,
                    2
                ]
            }
        ],
        "Stack": []
    },
    "inswer": {
        "E": [],
        "M": [
            {
                "type": "MultipleChoice",
                "answer": []
            }
        ],
        "Stack": []
    },
    "groupMedia": [
        null,
        null
    ],
    "module": 0
}

// point1d

{
    "result": false,
    "results": [
        true,
        false
    ],
    "requestURI": "",
    "answer": {
        "E": [],
        "M": [],
        "Stack": [],
        "G": [
            {
                "type": "Point1D",
                "coord": 2.8,
                "fill": null,
                "answer": {
                    "coord": 4,
                    "fill": true
                }
            }
        ]
    },
    "inswer": {
        "E": [],
        "M": [],
        "Stack": [],
        "G": [
            {
                "type": "Point1D",
                "coord": 1,
                "fill": true,
                "answer": {
                    "coord": 4,
                    "fill": true
                }
            }
        ]
    },
    "groupMedia": [
        [
            {
                "type": "Point1D",
                "coord": 2.8,
                "fill": null,
                "answer": {
                    "coord": 4,
                    "fill": true
                }
            }
        ],
        [
            {
                "type": "Point1D",
                "coord": 1,
                "fill": true,
                "answer": {
                    "coord": 4,
                    "fill": true
                }
            }
        ]
    ],
    "module": 0
}


// point2d

{
    "result": false,
    "results": [
        true,
        false
    ],
    "requestURI": "",
    "answer": {
        "E": [],
        "M": [],
        "Stack": [],
        "G": [
            {
                "type": "Point2D",
                "coords": {
                    "x": null,
                    "y": null
                },
                "answer": {
                    "x": 2,
                    "y": -2
                }
            }
        ]
    },
    "inswer": {
        "E": [],
        "M": [],
        "Stack": [],
        "G": [
            {
                "type": "Point2D",
                "coords": {
                    "x": 0,
                    "y": 0
                },
                "answer": {
                    "x": 2,
                    "y": -2
                }
            }
        ]
    },
    "groupMedia": [
        [
            {
                "type": "Point2D",
                "coords": {
                    "x": null,
                    "y": null
                },
                "answer": {
                    "x": 2,
                    "y": -2
                }
            }
        ],
        [
            {
                "type": "Point2D",
                "coords": {
                    "x": 0,
                    "y": 0
                },
                "answer": {
                    "x": 2,
                    "y": -2
                }
            }
        ]
    ],
    "module": 0
}



// relation
{
    "result": false,
    "results": [
        false,
        null
    ],
    "requestURI": "",
    "answer": {
        "E": [],
        "M": [
            {
                "type": "Relation",
                "answer": [
                    "0-1",
                    "1-0",
                    "2-2"
                ]
            }
        ],
        "Stack": []
    },
    "inswer": {
        "E": [],
        "M": [
            {
                "type": "Relation",
                "answer": []
            }
        ],
        "Stack": []
    },
    "groupMedia": [
        null,
        null
    ],
    "module": 0
}





// selectbox

{
    "result": false,
    "results": [
        false,
        null
    ],
    "requestURI": "",
    "answer": {
        "E": {
            "Input": [
                {
                    "value": 6,
                    "order": "A2",
                    "checktype": [
                        "laco",
                        58
                    ],
                    "answertype": 0,
                    "whitelist": [],
                    "blacklist": []
                },
                {
                    "value": 7,
                    "order": "A3",
                    "checktype": [
                        "laco",
                        58
                    ],
                    "answertype": 0,
                    "whitelist": null,
                    "blacklist": null
                }
            ]
        },
        "M": [
            {
                "type": "SelectBox",
                "answer": 1
            },
            {
                "type": "SelectBox",
                "answer": 1
            }
        ],
        "Stack": {
            "1": [
                3,
                6
            ],
            "2": [
                2,
                7
            ]
        }
    },
    "inswer": {
        "E": {
            "Input": [
                {
                    "value": "",
                    "order": "A2",
                    "checktype": [
                        "laco",
                        58
                    ],
                    "answertype": 0,
                    "whitelist": [],
                    "blacklist": []
                },
                {
                    "value": "",
                    "order": "A3",
                    "checktype": [
                        "laco",
                        58
                    ],
                    "answertype": 0,
                    "whitelist": null,
                    "blacklist": null
                }
            ]
        },
        "M": [
            {
                "type": "SelectBox",
                "answer": ""
            },
            {
                "type": "SelectBox",
                "answer": ""
            }
        ],
        "Stack": {
            "1": [
                9
            ],
            "2": [
                9
            ]
        }
    },
    "groupMedia": [
        null,
        null
    ],
    "module": 0
}

















// selectbox

{
    "result": false,
    "results": [
        false,
        null
    ],
    "requestURI": "",
    "answer": {
        "E": {
            "Input": [
                {
                    "value": 6,
                    "order": "A2",
                    "checktype": [
                        "laco",
                        58
                    ],
                    "answertype": 0,
                    "whitelist": [],
                    "blacklist": []
                }
            ]
        },
        "M": [
            {
                "type": "SelectBox",
                "answer": 0
            },
            {
                "type": "SelectBox",
                "answer": 0
            }
        ],
        "Stack": []
    },
    "inswer": {
        "E": {
            "Input": [
                {
                    "value": 1,
                    "order": "A2",
                    "checktype": [
                        "laco",
                        58
                    ],
                    "answertype": 0,
                    "whitelist": [],
                    "blacklist": []
                }
            ]
        },
        "M": [
            {
                "type": "SelectBox",
                "answer": 0
            },
            {
                "type": "SelectBox",
                "answer": 0
            }
        ],
        "Stack": []
    },
    "groupMedia": [
        null,
        null
    ],
    "module": 0
}

// singlechoice
{
    "result": false,
    "results": [
        false,
        null
    ],
    "requestURI": "",
    "answer": {
        "E": [],
        "M": [
            {
                "type": "SingleChoice",
                "answer": [
                    0
                ]
            }
        ],
        "Stack": []
    },
    "inswer": {
        "E": [],
        "M": [
            {
                "type": "SingleChoice",
                "answer": -1
            }
        ],
        "Stack": []
    },
    "groupMedia": [
        null,
        null
    ],
    "module": 0
}


// whitelist

{
    "result": false,
    "results": [
        false,
        null
    ],
    "requestURI": "",
    "answer": {
        "E": {
            "Input": [
                {
                    "value": "ㅁㅂ",
                    "order": "A2",
                    "checktype": [
                        "laco",
                        59
                    ],
                    "whitelist": [
                        "ㅂㅁ"
                    ],
                    "blacklist": []
                },
                {
                    "value": "ㅅㅇ",
                    "order": "A2",
                    "checktype": [
                        "laco",
                        59
                    ],
                    "whitelist": [
                        "ㅇㅅ"
                    ],
                    "blacklist": null
                }
            ]
        },
        "M": [],
        "Stack": []
    },
    "inswer": {
        "E": {
            "Input": [
                {
                    "value": "",
                    "order": "A2",
                    "checktype": [
                        "laco",
                        59
                    ],
                    "whitelist": [
                        "ㅂㅁ"
                    ],
                    "blacklist": [],
                    "answertype": null
                },
                {
                    "value": "",
                    "order": "A2",
                    "checktype": [
                        "laco",
                        59
                    ],
                    "whitelist": [
                        "ㅇㅅ"
                    ],
                    "blacklist": null,
                    "answertype": null
                }
            ]
        },
        "M": [],
        "Stack": []
    },
    "groupMedia": [
        null,
        null
    ],
    "module": 0
}


