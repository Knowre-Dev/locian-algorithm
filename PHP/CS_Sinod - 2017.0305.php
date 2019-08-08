<?php

class CS_function 
{
	//Change CS color to old and new sinod
	/*
		Sinod colors
			old 
				"gray": 0, 100, 200
				"orange": 1, 101, 201
				"purple": 2, 102, 202
				"red": 3, 103, 203
				"blue": 4, 104, 204
			new
				"transparent": -1
				"black": 0
				"gray": 1
				"green": 2
				"red": 3
				"blue": 4
				"yellow": 5
				"violet": 6
				
				
	*/
	static public function color_conversion($color, $version) 
	{
		switch ($version) 
		{
			case "old": 
			{
				switch ($color) 
				{
					case "gray": $color_code = 0;
					case "orange": $color_code = 1;
					case "purple": $color_code = 2;
					case "red": $color_code = 3;
					case "blue": $color_code = 4;
				}
			}
			case "new":
			{
				switch ($color) 
				{
					case "transparent": $color_code = -1;
					case "black": $color_code = 0;
					case "gray": $color_code = 1;
					case "green": $color_code = 2;
					case "red": $color_code = 3;
					case "blue": $color_code = 4;
					case "yellow": $color_code = 5;
					case "violet": $color_code = 6;
				}
			}
		}
		return $color_code;
	}
	
	
	static public function curve_conversion($curve_CS, $version)
	{
		//$version = "old", "oldInput", "new"
		switch ($version)
		{
			case "old":
			{
				switch ($curve_CS)
				{
					case "linear": $curve = "Line";
					case "quadratic": $curve = "Quad";
					case "squareRoot": $curve = "Sqrt";
					case "exponential": $curve = "Expo";
					case "reciprocal": $curve = "Reci";
					case "logarithmic": $curve = "Log";
					case "absolute": $curve = "Abs";
					case "sine": $curve = "Sin";
					case "tangent": $curve = "Tan";
					case "hyperbola": $curve = "Hyperbola";
					case "ellipse": $curve = "Ellipse";
					case "circle": $curve = "Circle";
					case "implicit": $curve = "Implicit";
					case "curve": $curve = "Curve";
					case "point": $curve = "Point";
					
				}
			}
			case "oldInput":
			{
				switch ($curve_CS)
				{
					case "linear": $curve = "Linear";
					case "quadratic": $curve = "Quadratic";
					case "squareRoot": $curve = "Rational";
					case "exponential": $curve = "Exponential";
					case "reciprocal": $curve = "Radical";
				}
			}
			case "new":
			{
				switch ($curve_CS)
				{
					case "linear": $curve = "linear";
					case "quadratic": $curve = "quadratic";
					case "squareRoot": $curve = "square_root";
					case "exponential": $curve = "exponential";
					case "rational": $curve = "rational";
					case "logarithmic": $curve = "logarithmic";
					case "absolute": $curve = "absolute";
					case "sine": $curve = "sine";
					case "tangent": $curve = "tangent";
					case "inverseProportional": $curve = "inverse_proportional";
					case "cubic": $curve = "cubic";
					case "none": $curve = "none";
					
				}
			}
		}
		return $curve;
	}
	
	static public function direction_conversion($direction)
	{
		switch ($direction)
		{
			case "CM": $result = "center";
			case "NN": $result = "north";
			case "NE": $result = "northEast";
			case "NW": $result = "northWest";
			case "SS": $result = "south";
			case "SE": $result = "southEaxt";
			case "SW": $result = "southWest";
			case "EE": $result = "east";
			case "WW": $result = "west";
		}
		return $result;
	}
	
	
	static public function json_conversion($json_CS, $version)
	{
		switch ($version)
		{
			case "new":
			{
				$class_name = "CS_".$json_CS["type"]["new"];
				$object = new $class_name($json, "new");
				return $object->json_new();
			}
			case "old": 
			{
				$class_name = "CS_".$json_CS["type"]["old"];
				$object = new $class_name($json, "old");
				return $object->json_old();
			}
		}
	}
	
}
	

	
	


/*
CS sinod
"category": "Text"
"type: "Text"

[
	"type" => [
		"CS" => ,
		"new" => ,
		"old" =>
	],
	"mode" => [
		"old" => 
	],
	"layout" => [
		"position" => [
			"x" => ,
			"y" =>
		],
		"inline" => 
	],
	"font" => [
		"color" => [
			"text" => ,
			"background" => 
		],
		"sizes" => [
			type => value
		],
		"decoration" => [
			"bold" => ,
			"underline" => ,
		]
	],
	"content" =>
]

new sinod
"category": "Basic"
"type": "Text"
[
	"type" => "Text",
	"position" => [
		"left" => ,
		"top" =>
	],
	"font" => [
		"color" => [
			"text" => ,
			"background" =>
		],
		"size" => ,
		"decoration" => [
			"bold" => ,
			"underline" => ,
			"italic" => 
		]
	],
	"content" =>
]

old sinod
"type": "Static"
"mode": "text"
[
	"type" => "Static",
	"mode" => "text",
	"option" => [
		"inline" => ,
		"color" => ,
		"bgColor" => ,
		"font-size" => ,
		"size" => ,
		"bold" =>
	],
	"value" => 
]
*/
	
	
class CS_Text 
{
	public $json_CS;
	
	public function __construct($json_CS)
	{
		$this->json_CS = $json_CS;
	}
		
	
    public function json_new() 
	{
        
		$json_new = []
		
		$json_new["type"] = $this->json_CS["type"]["new"];
		
		$json_new["position"] = [];
		$json_new["position"]["left"] = $this->json_CS["layout"]["position"]["x"];
		$json_new["position"]["top"] = $this->json_CS["layout"]["position"]["y"];
		
		$json_new["font"] = []
		$json_new["font"]["color"] = [];
		$json_new["font"]["color"]["text"] = CS_function::color_conversion($this->json_CS["font"]["color"]["text"],"new");
		$json_new["font"]["background"] = CS_function::color_conversion($this->json_CS["font"]["color"]["background"],"new");
		$json_new["font"]["size" ]= $this->json["font"]["size"];
		$json_new["font"]["decoration"] = [];
		$json_new["font"]["decoration"]["bold"] = $this->json_CS["font"]["decoration"]["bold"];
		$json_new["font"]["decoration"]["underline"] = $this->json_CS["font"]["decoration"]["underline"];
		$json_new["font"]["decoration"]["italic"] = $this->json_CS["font"]["decoration"]["italic"];
		
		$json_new["content"] = $this->json_CS["content"];
		
		return $json_new;
    }
	
	
	
    
    public function json_old() 
	{
		
		$json_old = [];
		
		$json_old["type"] = $this->json_CS["type"]["old"];
		
		$json_old["mode"] = $this->json_CS["mode"]["old"];
		
		$json_old["option"] = [];
		$json_old["option"]["inline"] = $this->json_CS["layout"]["inline"];
		$json_old["option"]["color"] = CS_function::color_conversion($this->json_CS["font"]["color"]["text"],"old");
		$json_old["option"]["bgColor"] = CS_function::color_conversion($this->json_CS["font"]["color"]["background"],"old");
		$json_old["option"]["font-size"] = $this->json_CS["font"]["sizes"]["normal"];
		$json_old["option"]["size"] = $this->json_CS["font"]["sizes"]["Daekyo"];
		$json_old["option"]["bold"] = $this->json_CS["font"]["decoration"]["bold"];
	    
		$json_old["option"]["value"] = $this->json_CS["content"];
		
		return $json_old;
    }
    
    public function json($flag = false, $version = "old") 
	{
        
		switch($version) 
		{
			
            case "new" : $json = $this->json_new();
            case "old" : $json = $this->json_old();
        }
        
        return $flag ? $json : json_encode($json, 256);
    }
    
    public function __toString() {
        return "";
    }
}

/*
CS sinod
"category": "Text"
"type": "TextMath"

[
	"type" => [
		"CS" => ,
		"new" => ,
		"old" =>
	],
	"mode" => [
		"old" => 
	],
	"layout" => [
		"position" => [
			"x" => ,
			"y" =>
		],
		"inline" => 
	],
	"font" => [
		"color" => [
			"text" => ,
			"background" => 
		],
		"sizes" => [
			type => value
		],
		"decoration" => [
			"bold" => ,
			"underline" => ,
		]
	],
	"content" =>
]

new sinod
"category": "Basic"
"type": "Math"
[
	"type" => "Math",
	"content" => ,
	"font" => [
		"decoration" => [
			"underline" => ,
			"bold" => ,
			"italic" => 
		],
		"color" => [
			"text" => 
			"background" =>
		],
		"size" =>
	],
	"position" => [
		"left" => ,
		"top" =>
	]
]

old sinod
"type": "Static"
"mode": "math"
[
	"type" => "Static",
	"mode" => "math",
	"option" => [
		"color" => ,
		"bgColor" => ,
		"font-size" => ,
		"size" => ,
		"inline" =>
	]
]
*/
	
	
	
class CS_TextMath 
{
	public $json_CS;
	
	public function __construct($json_CS)
	{
		$this->json_CS = $json_CS;
	}
	
	
    public function json_new() 
	{
		
        $json_new = [];
		
		$json_new["type"] = $this->json_CS["type"]["new"];
		
        $json_new["position"] => [];
		$json_new["position"]["left"] = $this->json_CS["layout"]["position"]["x"];
		$json_new["position"]["top"] = $this->json_CS["layout"]["position"]["y"];
		
		$json_new["font"] = [];
		$json_new["font"]["color"] = [];
		$json_new["font"]["color"]["text"] = CS_function::color_conversion($this->json_CS["font"]["color"]["text"], "new");
		$json_new["font"]["color"]["background"] = CS_function::color_conversion($this->json_CS["font"]["color"]["background"], "new");
		$json_new["font"]["size"] = $this->json_CS["font"]["size"];
		$json_new["font"]["decoration"] = [];
		$json_new["font"]["decoration"]["bold"] = $this->json_CS["font"]["decoration"]["bold"];
		$json_new["font"]["decoration"]["underline"] = $this->json_CS["font"]["decoration"]["underline"];
		$json_new["font"]["decoration"]["italic"] = $this->json_CS["font"]["decoration"]["italic"];
		
		$json_new["content"] = $this->json_CS["content"];
        
		return $json_new;
    }
    
    public function json_old() 
	{
        
		$json_old = []
		
		$json_old["type"] = $this->json_CS["type"]["old"];
		
		$json_old["mode"] = $this->json_CS["mode"]["old"];
		
		$json_old["option"] = [];
		$json_old["option"]["inline"] = $this->json_CS["layout"]["inline"];
		$json_old["option"]["color"] = CS_function::color_conversion($this->json_CS["font"]["color"]["text"], "old");
		$json_old["option"]["bgColor"] = CS_function::color_conversion($this->json_CS["font"]["color"]["background"], "old");
		$json_old["option"]["font-size"] = $this->json_CS["font"]["sizes"]["normal"];
		$json_old["option"]["size"] = $this->json_CS["font"]["sizes"]["Daekyo"];
		$json_old["option"]["bold"] = $this->json_CS["font"]["decoration"]["bold"];
		
		$json_old["value"] = $this->json_CS["content"];
		
		return $json_old;
    }
    
    public function json($flag = false, $version = "old") 
	{
        switch($version) 
		{
            case "new" : $json = $this->json_new();
            case "old" : $json = $this->json_old();
        }
        
        return $flag ? $json : json_encode($json, 256);
    }
    
    public function __toString() 
	{
        return "";
    }
}



/*
CS sinod
"category": "Text"
"type": "TextSpecial"

[
	"type" => [
		"CS" => ,
		"new" => 
	],
	"font" => [
		"decoration" => [
			"underline" => ,
			"bold" => ,
			"italic" =>
		],
		"color" => [
			"text" => ,
			"background" =>
		],
		"size" =>
	],
	"layout" => [
		"position" => [
			"x" => ,
			"y" =>
		]
	],
	"content" => [
		"type" => ,
		"character" =>
	]
]


new sinod
"category": "Text"
"type": "SpecialText"
[
	"type" => "SpecialText",
	"font" => [
		"color" => [
			"text" => ,
			"background" =>
		],
		"size" => ,
		"decoration" => [
			"underline" => ,
			"bold" => ,
			"italic" => 
		]
	],
	"position" => [
		"left" => ,
		"top" => 
	],
	"style" => ,
	"content" =>
]
*/
	
	
	
class CS_TextSpecial 
{
	public $json_CS;
	
	public function __construct($json_CS)
	{
		$this->json_CS = $json_CS;
	}
	
    public function json_new() 
	{
        
		$json_new = [];
		
		$json_new["type"] = $this->json_CS["type"]["new"];
		
		$json_new["font"] = [];
		$json_new["font"]["color"] = [];
		$json_new["font"]["color"]["text"] = CS_function::color_conversion($this->json_CS["font"]["color"]["text"], "new");
		$json_new["font"]["color"]["background"] = CS_function::color_conversion($this->json_CS["font"]["color"]["background"], "new");
		$json_new["font"]["size"] = $this->json["font"]["size"];
		$json_new["font"]["decoration"] = [];
		$json_new["font"]["decoration"]["underline"] = $this->json_CS["font"]["decoration"]["underline"];
		$json_new["font"]["decoration"]["bold"] = $this->json_CS["font"]["decoration"]["bold"];
		$json_new["font"]["decoration"]["italic"] = $this->json_CS["font"]["decoration"]["italic"];
		
		$json_new["position"] = [];
		$json_new["position"]["left"] = $this->json_CS["layout"]["position"]["x"];
		$json_new["position"]["top"] = $this->json_CS["layout"]["position"]["y"];
		
		$json_new["style"] = $this->json_CS["content"]["type"];
		
		$json_new["content"] = $this->json_CS["content"]["character"];
		
		return $json_new;
    }
    
    public function json_old() 
	{
        
		$json_old = [];
		
		return $json_old;
    }
    
    public function json($flag = false, $version = "old") 
	{
        
		switch($version) 
		{
        
			case "new" : $json = $this->json_new();
            
			case "old" : $json = $this->json_old();
			
        }
        
        return $flag ? $json : json_encode($json, 256);
    }
    
    public function __toString() 
	{
        return "";
    }
}



/* 
CS sinod
"category": "Input"
"type": "InputText"

[
	"type" => [
		"CS" => ,
		"new" => ,
		"old" =>
	],
	"mode" => [
		"old" => 
	],
	"style" => [
		"autoResize" =>
	],
	"layout" => [
		"size" => [
			"x" => ,
			"y" => 
		]
	],
	"content" => [
		"order" => ,
		"text" =>
	]
]

new sinod
"category": "Basic"
"type": "TextInput"

[
	"type" => "TextInput",
	"autoResize" => ,
	"keypadGroups" => ,
	"size" => [
		"width" => ,
		"size" => 
	]
]


old sinod
"type": "Input"
"mode": "text"

[
	"type" => "Input",
	"mode" => "text",
	"option" => [
		"width" => ,
		"height" => ,
		"order" => ,
	],
	"value" =>
]	
	

*/
	
	
	
class CS_InputText
{
	public $json_CS;
	
	public function __construct($json_CS)
	{
		$this->json_CS = $json_CS;
	}
    
    public function json_new() 
	{
        
		$json_new = [];
		
		$json_new["type"] = $this->json_CS["type"]["new"];
		
		$json_new["autoResize"] = $this->json_CS["style"]["autoResize"];
		
		$json_new["size"] = [];
		$json_new["size"]["width"] = $this->json_CS["layout"]["size"]["x"];
		$json_new["size"]["height"] = $this->json_CS["layout"]["size"]["y"];
			
		
		return $json_new;
    }
    
    public function json_old() 
	{
        
		$json_old = [];
		
		$json_old["type"] = $this->json_CS["type"]["old"];
		
		$json_old["mode"] = $this->json_CS["mode"]["old"];

		$json_old["option"] = [];
		$json_old["option"]["width"] = $this->json_CS["layout"]["size"]["x"];
		$json_old["option"]["height"] = $this->json_CS["layout"]["size"]["y"];
		$json_old["option"]["order"] = $this->json_CS["content"]["order"];
	
		$json_old["value"] = $this->json_CS["content"]["text"];
		
		return $json_old;
    }
    
    public function json($flag = false, $version = "old") 
	{
        
		switch($version) 
		{
        
			case "new" : $json = $this->json_new();
            
			case "old" : $json = $this->json_old();
        }
        
        return $flag ? $json : json_encode($json, 256);
    }
    
    public function __toString() 
	{
        return "";
    }
}



/*
CS sinod
"category": "Basic"
"type": "InputMath"

[
	"type" => [
		"CS" => ,
		"new" => ,
		"old" =>
	],
	"mode" => [
		"old" => 
	],
	"style" => [
		"autoResize" =>
	],
	"layout" => [
		"keypadGroups => ,
		"size" => [
			"x" => ,
			"y" =>
		]
	]
	"content" => [
		"order" => ,
		"text" =>
	]
	
]


new sinod
"category": "Basic"
"type": "MathInput"

[
	"type" => "MathInput",
	"autoResize" => ,
	"keypadGroups" => ,
	"size" => [
		"width" => ,
		"height" =>
	]
]


old sinod
"type": "Input"
"mode": "math"

[
	"type" => "Input",
	"mode" => "math",
	"option" => [
		"width" => ,
		"height" => ,
		"order" =>
	],
	"value" =>
	
]

*/
	
	
	
class CS_InputMath
{
	public $json_CS;
	
	public function __construct($json_CS)
	{
		$this->json_CS = $json_CS;
	}
    
    public function json_new() 
	{
        
		$json_new = [];
		
		$json_new["type"] = $this->json_CS["type"]["new"];
		
		$json_new["autoResize"] = $this->json_CS["style"]["autoResize"];
		
		$json_new["keypadGroups"] = $this->json_CS["layout"]["keypadGroups"];
		
		$json_new["size"] = [];
		$json_new["size"]["width"] = $this->json_CS["layout"]["size"]["x"];
		$json_new["size"]["height"] = $this->json_CS["layout"]["size"]["y"];
		
		return $json_new;
    }
    
    public function json_old() 
	{
		
        $json_old = [];
		
		$json_old["type"] = $this->json_CS["type"]["old"];
		
		$json_old["option"] = [];
		$json_old["option"]["width"] = $this->json_CS["layout"]["size"]["x"];
		$json_old["option"]["height"] = $this->json_CS["layout"]["size"]["y"];
		$json_old["option"]["order"] = $this->json_CS["content"]["order"];
		
		$json_old["value"] = $this->json["content"]["text"];
		
		return $json_old;
    }
    
    public function json($flag = false, $version = "old") 
	{
        
		switch($version) 
		{
        
			case "new" : $json = $this->json_new();
            
			case "old" : $json = $this->json_old();
        }
        
        return $flag ? $json : json_encode($json, 256);
    }
    
    public function __toString() 
	{
        
		return "";
    }
}




/*
CS sinod
"category":	"Input"
"type": "InputPartial"

[
	"type" => [
		"CS" => ,
		"new" => ,
		"old" =>
	],
	"content" => [
		"text" => ,
		"inputs" => ,
	],
	"font" => [
		"color" => [
			"text" => ,
			"background" => 
		],
		"decoration" => [
			"underline" => ,
			"bold" => ,
			"italic" => 
		],
		"size" =>
	],
	"layout" => [
		"position" => [
			"x" => ,
			"y" => 
		]
	]
]


new sinod
"category": "Basic"
"type": "Partial"

[
	"content" => ,
	"elements" => ,
	"font" => [
		"color" => [
			"text" => ,
			"background" => 
		],
		"decoration" => [
			"underline" => ,
			"bold" => ,
			"italic" =>
		],
		"size" =>
	],
	"position" => [
		"left" => ,
		"top" =>
	]
]


old sinod
"type": Partial
[
	"value" => ,
	"object" =>
]
*/
	
	
	
class CS_InputPartial
{
	public $json_CS;
	
	public function __construct($json_CS)
	{
		$this->json_CS = $json_CS;
	}
    
    public function json_new() {
        
		$json_new = []
		
		$json_new["type"] = $this->json_CS["type"]["new"];

		$json_new["content"] = $this->json_CS["content"]["text"];
		
		$json_new["elements"] = [];
		foreach ($this->json_CS["content"]["inputs"] as $json_object)
		{
			$json_new["elements"][] = CS_function::json_conversion($json_object, "new");
			
		}
			
		
		$json_new["font"] = [];
		$json_new["font"]["color"] = [];
		$json_new["font"]["color"]["text"] = CS_function::color_conversion($this->json_CS["font"]["color"]["text"], "new");
		$json_new["font"]["color"]["background"] = CS_function::color_conversion($this->json_CS["font"]["color"]["background"], "new");
		$json_new["font"]["decoration"] = [];
		$json_new["font"]["decoration"]["underline"] = $this->json_CS["font"]["decoration"]["underline"];
		$json_new["font"]["decoration"]["bold"] = $this->json_CS["font"]["decoration"]["bold"];
		$json_new["font"]["decoration"]["italic"] = $this->json_CS["font"]["decoration"]["italic"];
		$json_new["font"]["size"] => $this->json_CS["font"]["size"];
		
		$json_new["position"] = [];
		$json_new["position"]["left"] = $this->json_CS["layout"]["x"];
		$json_new["position"]["top"] = $this->json_CS["layout"]["y"];
	
		return $json_new;
    }
    
    public function json_old() {
        
		$json_old = [];
		
		$json_old["type"] = $this->json_CS["type"]["old"];
		
		$json_old["value"] = $this->json_CS["content"]["text"];
		$json_old["object"] = [];
		foreach ($this->json_CS["content"]["inputs"] as $json_object)
		{
			$json_old["object"][] = CS_function::json_conversion($json_object, "old");
			
		}
		
		return $json_old;
    }
    
    public function json($flag = false, $version = "old") 
	{
        
		switch($version) 
		{
        
			case "new" : $json = $this->json_new();
            
			case "old" : $json = $this->json_old();
        }
        
        return $flag ? $json : json_encode($json, 256);
    }
    
    public function __toString() 
	{
        return "";
    }
}







/*
CS sinod
"category":	"Choice"
"type": "ChoiceSingle"

[
	"type" => [
		"CS" => ,
		"new" => ,
		"old" =>
	],
	"mode" => [
		"old" => 
	],
	"layout" => [
		"display" => ,
		"width" => ,
		"align" => ,
		"position" => [
			"x" => ,
			"y" => 
		],
		"size" => [
			"column" =>
		]
	],
	"choices" => [
		"numbering" => ,
		"object" =>
	]
]


new sinod
"category": "Basic"
"type": "SingleChoice"

[
	"display" => ,
	"width" => ,
	"position" => [
		"left" => ,
		"top" =>
	],
	"column" => ,
	"numbering" => ,
	"choices" =>
]


old sinod

"type": "Select"
"mode": "radio"

[
	"align" => ,
	"column" => ,
	"option" =>
]
*/
	
	
	
class CS_ChoiceSingle
{
	public $json_CS;
	
	public function __construct($json_CS)
	{
		$this->json_CS = $json_CS;
	}
    
    public function json_new() {
        
		$json_new = []
		
		$json_new["type"] = $this->json_CS["type"]["new"];
		
		$json_new["display"] = $this->json_CS["layout"]["display"];
		
		$json_new["width"] = $this->json_CS["layout"]["width"];
		
		$json_new["position"] = [];
		$json_new["position"]["left"] = $this->json_CS["layout"]["position"]["x"];
		$json_new["position"]["top"] = $this->json_CS["layout"]["position"]["y"];
		
		$json_new["column"] = $this->json_CS["layout"]["size"]["column"];
		
		$json_new["numbering"] = $this->json_CS["choices"]["numbering"];
		
		$json_new["choices"] = [];
		foreach ($this->json_CS["choices"]["object"] as $json_object)
		{
			$json_new["choices"][] = CS_function::json_conversion($json_object, "new");
			
			
		}
		
		
		return $json_new;
    }
    
    public function json_old() {
        
		$json_old = [];
		
		$json_old["type"] = $this->json_CS["type"]["old"];
		
		$json_old["mode"] = $this->json_CS["mode"]["old"];
		
		$json_old["align"] = $this->json_CS["layout"]["align"];
		
		$json_old["column"] = $this->json_CS["layout"]["size"]["column"];
		
		$json_old["option"] = [];
		foreach ($this->json_CS["choices"]["object"] as $json_object)
		{
			$json_old["option"] = CS_function::json_conversion($json_object, "old");
		
			
		}
		
		return $json_old;
    }
    
    public function json($flag = false, $version = "old") 
	{
        
		switch($version) 
		{
        
			case "new" : $json = $this->json_new();
            
			case "old" : $json = $this->json_old();
        }
        
        return $flag ? $json : json_encode($json, 256);
    }
    
    public function __toString() 
	{
        return "";
    }
}




/*
CS sinod
"category":	"Choice"
"type": "ChoiceMultiple"

[
	"type" => [
		"CS" => ,
		"new" => ,
		"old" =>
	],
	"mode" => [
		"old" => 
	],
	"layout" => [
		"display" => ,
		"width" => ,
		"align" => ,
		"position" => [
			"x" => ,
			"y" =>
		],
		"size" => [
			"column" =>
		]
	],
	"choices" => [
		"object" => ,
		"size" => ,
		"user" =>
	]
]


new sinod
"category": "Basic"
"type": "MultipleChoice"

[
	"type" => "MultipleChoice",
	"display" => ,
	"width" => ,
	"position" => [
		"left" => ,
		"top" =>
	],
	"column" => ,
	"choices" => ,
	"choiceLimit" =>
]


old sinod

"type": "Select"
"mode": "checkbox"

[
	"type" => "Select",
	"mode" => "radio",
	"align" => ,
	"column" => ,
	"option" => ,
	"size" => ,
	"value" =>
]
*/
	
	
	
class CS_ChoiceMultiple
{
	public $json_CS;
	
	public function __construct($json_CS)
	{
		$this->json_CS = $json_CS;
	}
    
    public function json_new() {
        
		$json_new = []
		
		$json_new["type"] = $this->json_CS["type"]["new"];
		
		$json_new["display"] = $this->json_CS["layout"]["display"];
		
		$json_new["width"] = $this->json_CS["layout"]["width"];
		
		$json_new["position"] = [];
		$json_new["position"]["left"] = $this->json_CS["layout"]["position"]["x"];
		$json_new["position"]["top"] = $this->json_CS["layout"]["position"]["y"];
		
		$json_new["column"] = $this->json_CS["layout"]["size"]["column"];
		
		$json_new["numbering"] = $this->json_CS["choices"]["numbering"];
		
		$json_new["choices"] = [];
		foreach ($this->json_CS["choices"]["object"] as $json_object)
		{
			$json_new["choices"][] = CS_function::json_conversion($json_object, "new");
			
			
		}
		
		$json_new["choiceLimit"] = $this->json_CS["choices"]["size"];
		
		return $json_new;
    }
    
    public function json_old() {
        
		$json_old = [];
		
		$json_old["type"] = $this->json_CS["type"]["old"];
		
		$json_old["mode"] = $this->json_CS["mode"]["old"];
		
		$json_old["align"] = $this->json_CS["layout"]["align"];
		
		$json_old["column"] = $this->json_CS["layout"]["size"]["column"];
		
		$json_old["option"] = [];
		foreach ($this->json_CS["choices"]["object"] as $json_object)
		{
			$json_old["option"][] = CS_function::json_conversion($json_object, "old");
		
			
		}
		
		$json_old["size"] = $this->json_CS["choices"]["size"];
		
		$json_old["value"] = $this->json_CS["choices"]["user"];
		
		return $json_old;
    }
    
    public function json($flag = false, $version = "old") 
	{
        
		switch($version) 
		{
        
			case "new" : $json = $this->json_new();
            
			case "old" : $json = $this->json_old();
        }
        
        return $flag ? $json : json_encode($json, 256);
    }
    
    public function __toString() 
	{
        return "";
    }
}





/*
CS sinod
"category":	"Choice"
"type": "ChoiceDropdown"

[
	"type" => [
		"CS" => ,
		"new" => ,
		"old" =>
	],
	"mode" => [
		"old" => 
	],
	"font" => [
		"color" => [
			"text" => ,
			"background" => 
		],
		"size" = > ,
		"decoration" => [
			"underline" => ,
			"bold" => ,
			"italic" => 
		]
	],
	"layout" => [
		"width" => ,
		"align" => ,
		"position" => [
			"x" => ,
			"y" =>
		],
		"columnSize" =>
	],
	"choices" => [
		"object" => ,
		"user" => ,
		"size" => [
			"right" =>
		]
	]
]


new sinod
"category": "Basic"
"type": "SelectBox"

[
	"font" => [
		"color" => [
			"text" => ,
			"background" => 
		],
		"size" => ,
		"decoration" => [
			"underline" => ,
			"bold" => ,
			"italic" =>
		]
	],
	"width" => ,
	"position" => [
		"left" => ,
		"top" => 
	],
	"choices" => 
]


old sinod

"type": "Select"
"mode": "dropdown"

[
	"type" => "Select",
	"mode" => "dropdown",
	"align" => ,
	"column" => ,
	"option" => ,
	"value" => ,
	"size" =>
]
*/
	
	
	
class CS_ChoiceDropdown
{
	public $json_CS;
	
	public function __construct($json_CS)
	{
		$this->json_CS = $json_CS;
	}
    
    public function json_new() {
        
		$json_new = []
		
		$json_new["type"] = $this->json_CS["type"]["new"];
		
		$json_new["font"] = [];
		$json_new["font"]["color"] = [];
		$json_new["font"]["color"]["text"] = CS_function::color_conversion($this->json_CS["font"]["color"]["text"], "new");
		$json_new["font"]["color"]["background"] = CS_function::color_conversion($this->json_CS["font"]["color"]["background"], "new");
		$json_new["font"]["size"] = $this->json_CS["font"]["size"];
		$json_new["font"]["decoration"] = [];
		$json_new["font"]["decoration"]["underline"] = $this->json_CS["font"]["decoration"]["underline"];
		$json_new["font"]["decoration"]["bold"] = $this->json_CS["font"]["decoration"]["bold"];
		$json_new["font"]["decoration"]["italic"] = $this->json_CS["font"]["decoration"]["italic"];
		
		$json_new["width"] = $this->json_CS["layout"]["width"];
		
		$json_new["position"] = [];
		$json_new["position"]["left"] = $this->json_CS["layout"]["position"]["x"];
		$json_new["position"]["top"] = $this->json_CS["layout"]["position"]["y"];
		
		$json_new["choices"] = [];
		foreach ($this->json_CS["choices"]["object"] as $json_object)
		{
			$json_new["choices"][] = CS_function::json_conversion($json_object, "new");
		
			
		}
		
		
		return $json_new;
    }
    
    public function json_old() {
        
		$json_old = [];
		
		$json_old["type"] = $this->json_CS["type"]["old"];
		
		$json_old["mode"] = $this->json_CS["mode"]["old"];
		
		$json_old["align"] = $this->json_CS["layout"]["align"];
		
		$json_old["column"] = $this->json_CS["layout"]["columnSize"];
		
		$json_old["option"] = [];
		foreach ($this->json_CS["choices"]["object"] as $json_object)
		{
			$json_old["option"][] = CS_function::json_conversion($json_object, "old");
		
		}
		
		$json_old["value"] = $this->json_CS["choices"]["user"];

		$json_old["size"] = $this->json_CS["size"]["right"];
		
		
		return $json_old;
    }
    
    public function json($flag = false, $version = "old") 
	{
        
		switch($version) 
		{
        
			case "new" : $json = $this->json_new();
            
			case "old" : $json = $this->json_old();
        }
        
        return $flag ? $json : json_encode($json, 256);
    }
    
    public function __toString() 
	{
        return "";
    }
}






/*
CS sinod
"category":	"Insert"
"type": "Blank"

[
	"type" => [
		"CS" => ,
		"new" => ,
		"old" =>
	],
	"mode" => [
		"old" => 
	]
]


new sinod
"category": "StandAlone"
"type": "Blank

[
	"type" => "Blank"
]


old sinod

"type": "Static"
"mode": "null"

[
	"type" => "Static",
	"mode" => "null",
	"value" => ,
	"option" => [
		"color" => ,
		"inline" => ,
		"bgColor" => ,
		"size" => ,
		"font-size" => ,
		"bold" =>
	]
]
*/
	
	
	
class CS_Blank
{
	public $json_CS;
	
	public function __construct($json_CS)
	{
		$this->json_CS = $json_CS;
	}
    
    public function json_new() {
        
		$json_new = []
		
		$json_new["type"] = $this->json_CS["type"]["new"];
		
		
		return $json_new;
    }
    
    public function json_old() {
        
		$json_old = [];
		
		$json_old["type"] = $this->json_CS["type"]["old"];
		
		$json_old["mode"] = $this->json_CS["mode"]["old"];
		
		
		return $json_old;
    }
    
    public function json($flag = false, $version = "old") 
	{
        
		switch($version) 
		{
        
			case "new" : $json = $this->json_new();
            
			case "old" : $json = $this->json_old();
        }
        
        return $flag ? $json : json_encode($json, 256);
    }
    
    public function __toString() 
	{
        return "";
    }
}






/*
CS sinod
"category":	"Insert"
"type": "Image"

[
	"type" => [
		"CS" => ,
		"new" => ,
		"old" =>
	],
	"mode" => [
		"old" => 
	],
	"layout" => [
		"position" => [
			"x" => ,
			"y" => 
		],
		"align" =>
	],
	"mode" => ,
	"url" =>
]


new sinod
"category": "StandAlone"
"type": "Image"

[
	"type" => "Image",
	"position" => [
		"left" => ,
		"top" =>
	],
	"align" => ,
	"url" =>
]


old sinod

"type": "Static"
"mode": "illust" or "svg"

[
	"type" => "Static",
	"mode" => "illust" or "svg"
	"value" => ,
	"option" => [
		"color" => ,
		"inline" => ,
		"bgColor" => ,
		"size" => ,
		"font-size" => ,
		"bold" =>
	]
]
*/
	
	
	
class CS_Image
{
	public $json_CS;
	
	public function __construct($json_CS)
	{
		$this->json_CS = $json_CS;
	}
    
    public function json_new() 
	{
        
		$json_new = []
		
		$json_new["type"] = $this->json_CS["type"]["new"];
		
		$json_new["position"] = [];
		$json_new["position"]["left"] = $this->json_CS["layout"]["position"]["x"];
		$json_new["position"]["right"] = $this->json_CS["layout"]["position"]["x"];
		
		$json_new["align"] = $this->json_CS["layout"]["align"];
		
		$json_new["url"] = $this->json_CS["url"];
		
		
		return $json_new;
    }
    
    public function json_old() 
	{
        
		$json_old = [];
		
		$json_old["type"] = $this->json_CS["type"]["old"];
		
		$json_old["mode"] = $this->json_CS["mode"]["old"];
		
		
		return $json_old;
    }
    
    public function json($flag = false, $version = "old") 
	{
        
		switch($version) 
		{
        
			case "new" : $json = $this->json_new();
            
			case "old" : $json = $this->json_old();
        }
        
        return $flag ? $json : json_encode($json, 256);
    }
    
    public function __toString() 
	{
        return "";
    }
}





/*
CS sinod
"category":	"Insert"
"type": "LineBreak"

[
	"type" => [
		"CS" => ,
		"new" => ,
		"old" =>
	],
	"mode" => [
		"old" => 
	],
	"height" => 
]


new sinod
"category": "StandAlone"
"type": "LineBreak"

[
	"type" => "LineBreak"
	"height" =>
]


old sinod

"type": "Static"
"mode": "newline"

[
	"type" => "Static",
	"mode" => "newline",
	"value" => ,
	"option" => [
		"color" => ,
		"inline" => ,
		"bgColor" => ,
		"size" => ,
		"font-size" => ,
		"bold" =>
	]
]
*/
	
	
	
class CS_LineBreak
{
	public $json_CS;
	
	public function __construct($json_CS)
	{
		$this->json_CS = $json_CS;
	}
    
    public function json_new() 
	{
        
		$json_new = []
		
		$json_new["type"] = $this->json_CS["type"]["new"];
		
		$json_new["height"] = $this->json_CS["height"];
		
		return $json_new;
    }
    
    public function json_old() 
	{
        
		$json_old = [];
		
		$json_old["type"] = $this->json_CS["type"]["old"];
		
		$json_old["mode"] = $this->json_CS["mode"]["old"];
		
		
		
		return $json_old;
    }
    
    public function json($flag = false, $version = "old") 
	{
        
		switch($version) 
		{
        
			case "new" : $json = $this->json_new();
            
			case "old" : $json = $this->json_old();
        }
        
        return $flag ? $json : json_encode($json, 256);
    }
    
    public function __toString() 
	{
        return "";
    }
}







/*
CS sinod
"category":	"Cartesian1D"
"type": "Cartesian1D"

[
	"type" => [
		"CS" => ,
		"new" => ,
		"old" =>
	],
	"axis" => ,
	"grid" => ,
	"elements" => [
		"align" => ,
		"object" =>
	],
	"layout" => [
		"size" => ,
		"bounds" => [
			"min" => ,
			"max" =>
		],
		"position" => [
			"x" => ,
			"y" =>
		],
		"margin" => [
			"top" => ,
			"bottom" => ,
			"left" => ,
			"right" =>
		],
		"ratio" => ,
		"display" => 
	],
	"font" => [
		"color" => [
			"text" => ,
			"background" =>
		],
		"size" => ,
		"decoration" => [
			"underline" => ,
			"bold" => ,
			"italic" =>
		]
	],
	"interaction" => [
		"zoom" => ,
		"pan" =>
	]
		
]


new sinod
"category": "Cartesian1D"
"type": "Cartesian1D"

[
	"type" => "Cartesian1D",
	"axis" => ,
	"grid" => ,
	"elmAlign" => ,
	"elements" => ,
	"size" => ,
	"bounds" => [
		"min" => ,
		"max" => ,
	],
	"position" => [
		"left" => ,
		"top" =>
	],
	"margin" => [
		"top" => ,
		"bottom" => ,
		"left" => ,
		"right" =>
	],
	"ratio" => ,
	"display" =>
	"font" => [
		"color" => [
			"text" => ,
			"background" => 
		],
		"size" => ,
		"decoration" => [
			"underline" => ,
			"bold" => ,
			"italic" =>
		]
	],
	"interaction" => [
		"zooming" => ,
		"panning" =>
	]
	
	
]


old sinod

"type": "NumberLine"

[
	"object" => ,
	"size" => ,
	"bound" =>
]
*/
	
	
	
class CS_Cartesian1D
{
	public $json_CS;
	
	public function __construct($json_CS)
	{
		$this->json_CS = $json_CS;
	}
    
    public function json_new() 
	{
        
		$json_new = []
		
		$json_new["type"] = $this->json_CS["type"]["new"];
		
		$json_new["axis"] = CS_function::json_conversion($this->json_CS["axis"], "new");
		
		$json_new["grid"] = CS_function::json_conversion($this->json_CS["grid"], "new");
		
		$json_new["elmAlign"] = $this->json_CS["elements"]["align"];
		
		$json_new["elements"] = [];
		foreach ($this->json_CS["elements"]["object"] as $json_object)
		{
			$json_new["elements"][] = CS_function::json_conversion($json_object, "new");
			
			
		}
		
		$json_new["size"] = $this->json_CS["layout"]["size"];
		
		$json_new["bounds"] = [];
		$json_new["bounds"]["min"] = $this->json_CS["layout"]["bounds"]["min"];
		$json_new["bounds"]["max"] = $this->json_CS["layout"]["bounds"]["max"];
		
		$json_new["position"] = [];
		$json_new["position"]["left"] = $this->json_CS["layout"]["position"]["x"];
		$json_new["position"]["top"] = $this->json_CS["layout"]["position"]["y"];
		
		$json_new["margin"] = [];
		$json_new["margin"]["top"] = $this->json_CS["layout"]["margin"]["top"];
		$json_new["margin"]["bottom"] = $this->json_CS["layout"]["margin"]["bottom"];
		$json_new["margin"]["left"] = $this->json_CS["layout"]["margin"]["left"];
		$json_new["margin"]["right"] = $this->json_CS["layout"]["margin"]["right"];
		
		$json_new["ratio"] = $this->json_CS["layout"]["ratio"];
		
		$json_new["display"] = $this->json_CS["layout"]["display"];
		
		$json_new["font"] = [];
		$json_new["font"]["color"] = [];
		$json_new["font"]["color"]["text"] = $this->json_CS["font"]["color"]["text"];
		$json_new["font"]["color"]["background"] = $this->json_CS["font"]["color"]["background"];
		
		$json_new["interaction"] = [];
		$json_new["interaction"]["zooming"] = $this->json_CS["interaction"]["zoom"];
		$json_new["interaction"]["panning"] = $this->json_CS["interaction"]["pan"];
		
		return $json_new;
    }
    
    public function json_old() 
	{
        
		$json_old = [];
		
		$json_old["type"] = $this->json_CS["type"]["old"];
		
		$json_old["object"] = [];
		foreach ($this->json_CS["elements"]["object"] as $json_object)
		{
			$json_old["object"][] = CS_function::json_conversion($json_object, "old");
		
		}
		
		$json_old["size"] = $this->json_CS["layout"]["size"];
		
		$json_old["bound"] = [];
		$json_old["bound"][0] = $this->json_CS["layout"]["bounds"]["min"];
		$json_old["bound"][1] = $this->json_CS["layout"]["bounds"]["max"];
		
		
		return $json_old;
    }
    
    public function json($flag = false, $version = "old") 
	{
        
		switch($version) 
		{
        
			case "new" : $json = $this->json_new();
            
			case "old" : $json = $this->json_old();
        }
        
        return $flag ? $json : json_encode($json, 256);
    }
    
    public function __toString() 
	{
        return "";
    }
}




/*
CS sinod
"category":	"Cartesian1D"
"type": "Axis1D"

[
	
	"type" => [
		"CS" => ,
		"new" => ,
		"old" =>
	],
	"label" => ,
	"style" => [
		"visible" => ,
		"arrow" => [
			"min" => ,
			"max" =>
		],
		"color" =>
	]
]


new sinod
"category": "Cartesian1D"
"type": "Axis1D"

[
	"type" => "Axis1D",
	"label" => ,
	"style" => [
		"visibility" => ,
		"arrow" => [
			"min" => ,
			"max" =>
		],
		"color" =>
	]
	
	
]


old sinod

"type": "Axis1D"

[
	"type" => "Axis1D",
	"value" => [
		"name" => ,
		"visible" => ,
		"arrowType" =>
	]
]
*/
	
	
	
class CS_Axis1D
{
	ppublic $json_CS;
	
	public function __construct($json_CS)
	{
		$this->json_CS = $json_CS;
	}
    
    public function json_new() 
	{
        
		$json_new = []
		
		$json_new["type"] = $this->json_CS["type"]["new"];
		
		$json_new["label"] = CS_function::json_conversion($this->json_CS["label"], "new");
		
		$json_new["style"] = [];
		$json_new["style"]["visibility"] = $this->json_CS["style"]["visible"];
		$json_new["style"]["arrow"] = [];
		$json_new["style"]["arrow"]["min"] = $this->json_CS["style"]["arrow"]["min"];
		$json_new["style"]["arrow"]["max"] = $this->json_CS["style"]["arrow"]["max"];
		$json_new["style"]["color"] = $this->json_CS["style"]["color"];
		
		return $json_new;
    }
    
    public function json_old() 
	{
        
		$json_old = [];
		
		$json_old["type"] = $this->json_CS["type"]["old"];
		
		$json_old["value"] = [];
		$json_old["value"]["name"] = CS_function::json_conversion($this->json_CS["label"], "old");
		
		
		return $json_old;
    }
    
    public function json($flag = false, $version = "old") 
	{
        
		switch($version) 
		{
        
			case "new" : $json = $this->json_new();
            
			case "old" : $json = $this->json_old();
        }
        
        return $flag ? $json : json_encode($json, 256);
    }
    
    public function __toString() 
	{
        return "";
    }
}









/*
CS sinod
"category":	"Cartesian1D"
"type": "Grid1D"

[
	"type" => [
		"CS" => ,
		"new" => ,
		"old" =>
	],
	"mode" => ,
	"line" => [
		"free" => [[
			"coordinates" => ,
			"position" => ,
			"height" => 
		],
		"regular" => [
			"thin" => [
				"increment" => ,
				"initial" =>
			],
			"thick" => [
				"increment" => ,
				"initial" =>
			]
		]
	],
	"geometry" => [
		"position" => ,
		"height" =>
	],
	"style" => [
		"color" => [
			"line" => [
				"thin" => ,
				"thick" =>
			],
			"label" =>
		]
	],
	"label" => [
		"value" => [
			"regular" => [
				"initial" => 
				"increment" =>
			],
			"free" => [[
				"label" => [[
					"position" => ,
					"value" =>
				]],
				"geometry" => [
					"height" => ,
					"position" => 
				],
				"style" => [
					"arrow" => [
						"visible" => ,
						"color" => 
					],
					"dash" => 
				]
			]]
		],
		"style" => [
			"arrow" => [
				"visible" => ,
				"color" =>
			],
			"dash" =>
		],
		"geometry" => [
			"height" => ,
			"position" =>
		]
	]
	
]


new sinod
"category": "Cartesian1D"
"type": "Grid1D"

[
	"type" => "Grid1D",
	"noarmal" => [
		"unit" => ,
		"init" => ,
		"color" =>
	],
	"strong" => [
		"unit" => ,
		"init" => ,
		"color" =>
	],
	"label" => [
		"color" => ,
		"init" => ,
		"unit" =>
	]
	
	
]


old sinod

"type": "Grid1D" or "GridLabel1D"

[
	"type" => "Grid1D",
	"value" => [[
		"value" => ,
		"mode" => ,
		"height" =>
	]]
	
]

[
	"type" => "GridLabel1D",
	"value" => [[
		"value" => ,
		"arrow" => ,
		"arrowColor" => ,
		"dash" => ,
		"heght" => ,
		"mode" =>
	]]
		
]
*/
	
	
	
class CS_Grid1D
{
	public $json_CS;
	
	public function __construct($json_CS)
	{
		$this->json_CS = $json_CS;
	}
    
    public function json_new() 
	{
        
		$json_new = []
		
		$json_new["type"] = $this->json_CS["type"]["new"];
		
		$json_new["normal"] = [];
		$json_new["normal"]["unit"] = $this->json_CS["line"]["regular"]["thin"]["increment"];
		$json_new["normal"]["init"] = $this->json_CS["line"]["regular"]["thin"]["initial"];
		$json_new["normal"]["color"] = $this->json_CS["style"]["color"]["line"]["thin"];
		
		$json_new["strong"] = [];
		$json_new["strong"]["unit"] = $this->json_CS["line"]["regular"]["thick"]["increment"];
		$json_new["strong"]["init"] = $this->json_CS["line"]["regular"]["thick"]["initial"];
		$json_new["strong"]["color"] = $this->json_CS["style"]["color"]["line"]["thick"];
		
		$json_new["label"]["unit"] = $this->json_CS["label"]["value"]["regular"]["increment"];
		$json_new["label"]["init"] = $this->json_CS["label"]["value"]["regular"]["initial"];
		$json_new["label"]["color"] = $this->json_CS["style"]["color"]["label"];
		
		return $json_new;
    }
    
    public function json_old() 
	{
        $json_old = [];
		
		$json_old["type"] = $this->json_CS["type"]["old"];
		
		switch ($this->json_CS["type"]["old"])
		{
			case "Grid1D":
			{
				
				
				$json_old["value"] = [];
				foreach ($this->json_CS["line"]["free"] as $json_object)
				{
					$value = [];
					$value["value"] = $json_object["coordinates"];
					$value["mode"] = $json_object["position"];
					$value["height"] = $json_object["height"];
					$json_old["value"][] = $value;
					
				}
			}
			case "GridLabel1D":
			{
				
				
				$json_old["value"] = [];
				foreach ($this->json_CS["label"]["free"] as $json_object)
				{
					$value = [];
					$value["value"] = [];
					foreach ($json_object["label"] as $label)
					{
						$value["value"][0] = $label["position"];
						$value["value"][1] = CS_function::json_conversion($label["value"], "old");
					}
					$value["height"] = $json_object["geometry"]["height"];
					$value["mode"] = $json_object["geometry"]["position"];
					$value["arrow"] = $json_object["style"]["arrow"]["visible"];
					$value["arrowColor"] = $json_object["style"]["arrow"]["color"];
					$value["dash"] = $json_object["style"]["dash"];
					$json_old["value"][] = $value;
				}
			}
		}
		
		
		return $json_old;
    }
    
    public function json($flag = false, $version = "old") 
	{
        
		switch($version) 
		{
        
			case "new" : $json = $this->json_new();
            
			case "old" : $json = $this->json_old();
        }
        
        return $flag ? $json : json_encode($json, 256);
    }
    
    public function __toString() 
	{
        return "";
    }
}






/*
CS sinod
"category":	"Cartesian1D"
"type": "Label1D"

[
	"type" => [
		"CS" => ,
		"new" => ,
		"old" =>
	],
	"style" => [
		"arrow" => [
			"color" => ,
		],
		"dash" =>
	],
	"geometry" => [
		"height" => ,
		"coordinate" =>
	],
	"label" =>
	
]


new sinod
"category": "Cartesian1D"
"type": "Label1D"

[
	"type" => "Label1D",
	"arrowColor" => ,
	"dash" => ,
	"height" => ,
	"coord" => ,
	"label" =>
	
	
]


old sinod



*/
	
	
	
class CS_Label1D
{
	public $json_CS;
	
	public function __construct($json_CS)
	{
		$this->json_CS = $json_CS;
	}
    
    public function json_new() 
	{
        
		$json_new = []
		
		$json_new["type"] = $this->json_CS["type"]["new"];
		
		$json_new["arrowColor"] = $this->json_CS["style"]["arrow"]["color"];
		
		$json_new["dash"] = $this->json_CS["style"]["dash"];
		
		$json_new["height"] = $this->json_CS["geometry"]["height"];
		
		$json_new["coord"] = $this->json_CS["geometry"]["coordinate"];
		
		$json_new["label"] = CS_function::json_conversion($this->json_CS["label"], "new");
		
		
		
		return $json_new;
    }
    
    public function json_old() 
	{
        $json_old = [];
		
		
		
		
		return $json_old;
    }
    
    public function json($flag = false, $version = "old") 
	{
        
		switch($version) 
		{
        
			case "new" : $json = $this->json_new();
            
			case "old" : $json = $this->json_old();
        }
        
        return $flag ? $json : json_encode($json, 256);
    }
    
    public function __toString() 
	{
        return "";
    }
}




/*
CS sinod
"category":	"Cartesian1D"
"type": "Point1D"

[
	"type" => [
		"CS" => ,
		"new" => ,
		"old" =>
	],
	"mode" => ,
	"style" => [
		"visible" => ,
		"color" => ,
		"filled" =>
	],
	"geometry" => [
		"coordinate" => 
	],
	"interaction => [
		"selected" => ,
		"movable" =>
	],
	"label" => [
		"value" => ,
		"direction" =>
	]
	
]


new sinod
"category": "Cartesian1D"
"type": "Point1D"

[
	"type" => [
		"CS" => ,
		"new" => ,
		"old" =>
	],
	"style" => [
		"color" => ,
		"fill" =>
	],
	"coord" => ,
	"interaction" => [
		"selected" => ,
		"movable" =>
	]
	
]


old sinod

"type": "Point" or "Input:Point"

[
	"type" => "Point" or "Input:Point",
	"isVisible" => ,
	"color" => ,
	"isFill" => ,
	"coord" => ,
	"label" => ,
	"labelSign" =>
]

*/
	
	
	
class CS_Point1D
{
	public $json_CS;
	
	public function __construct($json_CS)
	{
		$this->json_CS = $json_CS;
	}
    
    public function json_new() 
	{
        
		$json_new = []
		
		$json_new["type"] = $this->json_CS["type"]["new"];
		
		$json_new["style"] = [];
		$json_new["style"]["color"] = $this->json_CS["style"]["color"];
		$json_new["style"]["fill"] = $this->json_CS["style"]["filled"];
		
		$json_new["coord"] = $this->json_CS["geometry"]["coordinate"];
		
		$json_new["interaction"] = [];
		$json_new["interaction"]["selected"] = $this->json_CS["interaction"]["selected"];
		$json_new["interaction"]["movable"] = $this->json_CS["interaction"]["movable"];
		
		return $json_new;
    }
    
    public function json_old() 
	{
        $json_old = [];
		
		$json_old["type"] = $this->json_CS["type"]["old"];
		
		$json_old["isVisible"] = $this->json_CS["style"]["visible"];
		
		$json_old["color"] = $this->json_CS["style"]["color"];
		
		$json_old["isFill"] = $this->json_CS["style"]["filled"];
		
		$json_old["coord"] = $this->json_CS["geometry"]["coordinate"];
		
		$json_old["label"] = CS_function::json_conversion($this->json_CS["label"]["value"], "old");
		
		$json_old["labelSign"] = $this->json_CS["label"]["direction"];
		
		
		
		
		return $json_old;
    }
    
    public function json($flag = false, $version = "old") 
	{
        
		switch($version) 
		{
        
			case "new" : $json = $this->json_new();
            
			case "old" : $json = $this->json_old();
        }
        
        return $flag ? $json : json_encode($json, 256);
    }
    
    public function __toString() 
	{
        return "";
    }
}




/*
CS sinod
"category":	"Cartesian1D"
"type": "InEq1D"

[
	"type" => [
		"CS" => ,
		"new" => ,
		"old" =>
	],
	"mode" => ,
	"interaction" => [
		"selected" => ,
		"movable" =>
	],
	"style" => [
		"height" => ,
		"color" => ,
		"filled" => ,
		"arrow" =>
	],
	"geometry" => [
		"coordinate" => ,
		"inequality" => 
	],
	"label" => [
		"value" => ,
		"direction" =>
	]
	
]


new sinod
"category": "Cartesian1D"
"type": "InEq1D"

[
	"type" => "InEq1D",
	"interaction" => [
		"selected" => ,
		"movable" =>
	],
	"style" => [
		"height" => ,
		"color" => ,
		"fill" =>
	],
	"coord" => ,
	"inequality" =>
	
]


old sinod

"type": "InEq" or "Input:InEq"

[
	"type" => "InEq" or "Input:InEq",
	"color" => ,
	"isFill" => ,
	"arrowType" => ,
	"coord" => ,
	"pointFill" => ,
	"sign" => ,
	"label" => ,
	"labelSign" =>
]

*/
	
	
	
class CS_InEq1D
{
	public $json_CS;
	
	public function __construct($json_CS)
	{
		$this->json_CS = $json_CS;
	}
    
    public function json_new() 
	{
        
		$json_new = []
		
		$json_new["type"] = $this->json_CS["type"]["new"];
		
		$json_new["interaction"] = [];
		$json_new["interaction"]["selected"] = $this->json_CS["interaction"]["selected"];
		$json_new["interaction"]["movable"] = $this->json_CS["interaction"]["movable"];
		
		$json_new["style"]["height"] = $this->json_CS["style"]["height"];
		$json_new["style"]["color"] = $this->json_CS["style"]["color"];
		$json_new["style"]["fill"] = $this->json_CS["style"]["filled"];
		
		$json_new["coord"] = $this->json_CS["geometry"]["coordinate"];
		$json_new["inequality"] = $this->json_CS["geometry"]["inequality"];
		
		return $json_new;
    }
    
    public function json_old() 
	{
        $json_old = [];
		
		$json_old["type"] = $this->json_CS["type"]["old"];
		
		$json_old["color"] = $this->json_CS["style"]["color"];
		
		$json_old["isFill"] = $this->json_CS["style"]["filled"];
		
		switch ($this->json_CS["style"]["arrow"])
		{
			case "true": $json_old["arrowType"] = "filled";
			
			case "false": $json_old["arrowType"] = "empty";
		}
		
		$json_old["coord"] = $this->json_CS["geometry"]["coordinate"];
		
		switch ($this->json_CS["geometry"]["inequality"])
		{
			case "<": 
			{
				$json_old["pointFill"] = "false";
				$json_old["sign"] = "false";
			}
			case ">":
			{
				$json_old["pointFill"] = "false";
				$json_old["sign"] = "true";
				
			}
			case "<=":
			{
				$json_old["pointFill"] = "true";
				$json_old["sign"] = "false";
			}
			case ">=":
			{
				$json_old["pointFill"] = "true";
				$json_old["sign"] = "true";
			}
		}
		
		$json_old["label"] = CS_function::json_conversion($this->json_CS["label"]["value"], "old");
		
		
		
		return $json_old;
    }
    
    public function json($flag = false, $version = "old") 
	{
        
		switch($version) 
		{
        
			case "new" : $json = $this->json_new();
            
			case "old" : $json = $this->json_old();
        }
        
        return $flag ? $json : json_encode($json, 256);
    }
    
    public function __toString() 
	{
        return "";
    }
}



/*
CS sinod
"category":	"Cartesian1D"
"type": "CompInEq1D"

[
	"type" => [
		"CS" => ,
		"new" => ,
		"old" =>
	],
	"mode" => "CompInEq" or "Input:CompInEq",
	"geometry" => [
		"inequalities" => ,
		"fills" => [[
			"<" => ,
			">" =>
		]]
	],
	"style" => [
		"filled" => ,
		"color" => ,
		"height" => [
			"initial" => ,
			"increment" =>
		]
	],
	"interaction" => [
		"interactive" => 
	]
		
	
]


new sinod
"category": "Cartesian1D"
"type": "CompInEq1D"

[
	"type" => "CompInEq1D",
	"inEqs" => ,
	"fill" => [[
	]],
	"style" => [
		"color" => ,
		"height" => [
			"init" => ,
			"unit" => 
		]
	],
	"interaction" => 
]


old sinod

"type": "CompInEq" or "Input:CompInEq"

[
	"type" => "CompInEq" or "Input:CompInEq",
	"object" => [[
	]],
	"dataFill" => [[
	]],
	"isFill" => ,
	"color" =>
]

*/
	
	
	
class CS_CompInEq1D
{
	public $json_CS;
	
	public function __construct($json_CS)
	{
		$this->json_CS = $json_CS;
	}
    
    public function json_new() 
	{
        
		$json_new = [];
		
		$json_new["type"] = $this->json_CS["type"]["new"];
		
		$json_new["inEqs"] = [];
		foreach ($this->json_CS["geometry"]["inequalities"] as $json_object)
		{
			$json_new["inEqs"][] = CS_function::json_conversion($json_object, "new");
			
		}
		
		$json_new["fill"] = [];
		foreach ($this->json_CS["geometry"]["fills"] as $json_object)
		{
			$json_new["fill"][] = [$json_object["<"],$json_object[">"]];
		}
		
		$json_new["style"]["color"] = CS_function::color_conversion($this->json_CS["style"]["color"],"new");
		$json_new["style"]["height"] = [];
		$json_new["style"]["height"]["init"] = $this->json_CS["style"]["height"]["initial"];
		$json_new["style"]["height"]["unit"] = $this->json_CS["style"]["height"]["increment"];
		
		$json_new["interaction"] = $this->json_CS["interaction"]["interactive"];
		
		return $json_new;
    }
    
    public function json_old() 
	{
        $json_old = [];
		
		$json_old["type"] = $this->json_CS["type"]["old"];
		
		$json_old["object"] = [];
		foreach ($this->json_CS["geometry"]["inequalities"] as $json_object)
		{
			$json_old["object"][] = CS_function::json_conversion($json_object, "old");
			
		}
		
		$json_old["dataFill"] = [];
		foreach ($this->json_CS["geometry"]["fills"] as $json_object)
		{
			$json_old["dataFill"][] = [$json_object["<"],$json_object[">"]];
		}
		
		$json_old["isFill"] = $this->json_CS["style"]["filled"];
		
		$json_old["color"] = CS_function::color_conversion($this->json_CS["style"]["color"],"old");
		
		return $json_old;
    }
    
    public function json($flag = false, $version = "old") 
	{
        
		switch($version) 
		{
        
			case "new" : $json = $this->json_new();
            
			case "old" : $json = $this->json_old();
        }
        
        return $flag ? $json : json_encode($json, 256);
    }
    
    public function __toString() 
	{
        return "";
    }
}



/*
CS sinod
"category":	"Cartesian1D"
"type": "Range1D"

[
	"type" => [
		"CS" => ,
		"new" => ,
		"old" =>
	],
	"geometry" => [
		"coordinate" => [
			"start" => ,
			"end" =>
		],
		"height" =>
	],
	"style" => [
		"arrow" => [
			"start" => ,
			"end" =>
		],
		"dash" => ,
		"color" => ,
		"marker" => 
	],
	"label" => [
		"value" => ,
		"direction" =>
	]
]


new sinod
"category": "Cartesian1D"
"type": "Range1D"

[
	"type" => "Range1D",
	"coords" => [
		"start" => ,
		"end" =>
	],
	"height" => ,
	"style" => [
		"arrow" => [
			"start" => ,
			"end" =>
		],
		"dash" => ,
		"color" => ,
		"marker" => 
	]
]


old sinod

"type": "Range"

[
	"type" => "Range",
	"source" => [
		"coord" => 
	],
	"target" => [
		"coord" => 
	],
	"height" => ,
	"sign" => ,
	"source" => [
		"arrow" => 
	],
	"target" => [
		"arrow" => 
	],
	"dash" => ,
	"label" => ,
	"labelSign" =>
]

*/
	
	
	
class CS_Range1D
{
	public $json_CS;
	
	public function __construct($json_CS)
	{
		$this->json_CS = $json_CS;
	}
    
    public function json_new() 
	{
        
		$json_new = []
		
		$json_new["type"] = $this->json_CS["type"]["new"];
		
		$json_new["coords"] = [];
		$json_new["coords"]["start"] = $this->json_CS["geometry"]["coordinate"]["start"];
		$json_new["coords"]["end"] = $this->json_CS["geometry"]["coordinate"]["end"];
		
		$json_new["height"] = $this->json_CS["geometry"]["height"];
		
		$json_new["style"] = [];
		$json_new["style"]["arrow"] = [];
		$json_new["style"]["arrow"]["start"] = $this->json_CS["style"]["arrow"]["start"];
		$json_new["style"]["arrow"]["end"] = $this->json_CS["style"]["arrow"]["end"];
		$json_new["style"]["dash"] = $this->json_CS["style"]["dash"];
		$json_new["style"]["color"] = CS_function::color_conversion($this->json_CS["style"]["color"],"new");
		$json_new["style"]["marker"] = $this->json_CS["style"]["marker"];
		
		
		return $json_new;
    }
    
    public function json_old() 
	{
        $json_old = [];
		
		$json_old["type"] = $this->json_CS["type"]["old"];
		
		$json_old["source"] = [];
		$json_old["source"]["coord"] = $this->json_CS["geometry"]["coordinate"]["start"];
		$json_old["source"]["arrow"] = $this->json_CS["style"]["arrow"]["start"];
		$json_old["target"] = [];
		$json_old["target"]["coord"] = $this->json_CS["geometry"]["coordinate"]["end"];
		$json_old["target"]["arrow"] = $this->json_CS["style"]["arrow"]["end"];
		
		$json_old["height"] = abs($this->json_CS["geometry"]["height"]);
			
		if ($this->json_CS["geometry"]["height"] >= 0)
		{
			$json_old["sign"] = true;
		}
		else 
		{
			$json_old["sign"] = false;
		}
		
		$json_old["dash"] = $this->json_CS["dash"];
		
		$json_old["label"] = CS_function::json_conversion($this->json_CS["label"]["value"], "new");
				
		$json_old["labelSign"] = $this->json_CS["label"]["direction"];
		
		
		return $json_old;
    }
    
    public function json($flag = false, $version = "old") 
	{
        
		switch($version) 
		{
        
			case "new" : $json = $this->json_new();
            
			case "old" : $json = $this->json_old();
        }
        
        return $flag ? $json : json_encode($json, 256);
    }
    
    public function __toString() 
	{
        return "";
    }
}



/*
CS sinod
"category":	"Cartesian1D"
"type": "Segment1D"

[
	"type" => [
		"CS" => ,
		"new" => ,
		"old" =>
	],
	"typeOld" => ,
	"geometry" => [
		"coordinates" => [
			"positions" => [],
			"start" => ,
			"end" =>
		],
		"height" => 
	],
	"style" => [
		"dash" => ,
		"arrow" => [
			"start" => ,
			"end" =>
		],
		"color" => ,
		"marker" => ,
		"handle" => [
			"visible" => ,
			"dashed" =>
		]
	],
	"label" => [
		"value" => ,
		"direction" =>
	]
]


new sinod
"category": "Cartesian1D"
"type": "Segment1D"

[
	"type" => "Segment1D",
	"coordinates" => [
		"start" => ,
		"end" =>
	],
	"height" => ,
	"style" => [
		"dash" => ,
		"arrow" => [
			"start" => ,
			"end" =>
		],
		"color" => ,
		"marker" => ,
		"handle" => ,
		"handleDash" => 
	]
]


old sinod

"type": "Arrow" or "Input:Interval" or "Interval"

[
	"type" => "Arrow",
	"source" => [
		"coord" => ,
		"arrow" =>
	],
	"target" => [
		"coord" => ,
		"arrow" =>
	],
	"height" => ,
	"sign" => ,
	"dash" => ,
	"label" => ,
	"labelSign" =>
]

[
	"type" => "Input:Interval" or "Interval",
	"position" => []
]

*/
	
	
	
class CS_Segment1D
{
	public $json_CS;
	
	public function __construct($json_CS)
	{
		$this->json_CS = $json_CS;
	}
    
    public function json_new() 
	{
        $json_new = [];
		
		$json_new["type"] = $this->json_CS["type"]["new"];
		
		$json_new["coords"] = [];
		$json_new["coords"]["start"] = $this->json_CS["geometry"]["coordinates"]["start"];
		$json_new["coords"]["end"] = $this->json_CS["geometry"]["coordinates"]["end"];
		
		$json_new["height"] = $this->json_CS["geometry"]["height"];
		
		$json_new["style"]["dash"] = $this->json_CS["style"]["dash"];
		$json_new["style"]["arrow"] = [];
		$json_new["style"]["arrow"]["start"] = $this->json_CS["style"]["arrow"]["start"];
		$json_new["style"]["arrow"]["end"] = $this->json_CS["style"]["arrow"]["end"];
		$json_new["style"]["color"] = CS_function::color_conversion($this->json_CS["style"]["color"],"new");
		$json_new["style"]["marker"] = $this->json_CS["style"]["marker"];
		$json_new["style"]["handle"] = $this->json_CS["style"]["handle"]["visible"];
		$json_new["style"]["handleDash"] = $this->json_CS["style"]["handle"]["dashed"];
		
		return $json_new;
    }
    
    public function json_old() 
	{
        $json_old = [];
		
		$json_old["type"] = $this->json_CS["type"]["old"];
		
		if ($this->json_CS["type"]["old"] == "Arrow")
		{
			$json_old["source"] = [];
			$json_old["source"]["coord"] = $this->json_CS["geometry"]["coordinates"]["start"];
			$json_old["source"]["arrow"] = $this->json_CS["style"]["arrow"]["start"];
			
			$json_old["target"] = [];
			$json_old["target"]["coord"] = $this->json_CS["geometry"]["coordinates"]["end"];
			$json_old["target"]["arrow"] = $this->json_CS["style"]["arrow"]["end"];
			
			$json_old["height"] = abs($this->json_CS["geometry"]["height"]);
			
			if ($this->json_CS["geometry"]["height"] >= 0)
			{
				$json_old["sign"] = true;
			}
			else 
			{
				$json_old["sign"] = false;
			}
			
			$json_old["dash"] = $this->json_CS["style"]["dash"];
		}
		else
		{
			$json_old["position"] = $this->json_CS["geometry"]["coordinates"]["positions"];
		}
		
		
		
		return $json_old;
    }
    
    public function json($flag = false, $version = "old") 
	{
        
		switch($version) 
		{
        
			case "new" : $json = $this->json_new();
            
			case "old" : $json = $this->json_old();
        }
        
        return $flag ? $json : json_encode($json, 256);
    }
    
    public function __toString() 
	{
        return "";
    }
}




/*
CS sinod
"category":	"Cartesian2D"
"type": "Cartesian2D"

[
	"type" => [
		"CS" => ,
		"new" => ,
		"old" =>
	],
	"typeOld" => ,
	"axis" => ,
	"grid" => ,
	"elements" => [
		"object" => [
			"value" => [],
			"align" =>
		],
		"curves" => [
			"object" => ,
			"style" => [
				"color" => [
					"curve" => [],
					"point" => []
				],
				"defaultPosition" => ,
				"arrow" => ,
				"endPoints" => [
					"min" => ,
					"max" =>
				],
				"bounded" =>
			],
			"layout" => [
				"bounds" => [
					"min" => ,
					"max" =>
				]
			]
		]
	],
	"layout" => [
		"bounds" => [
			"x" => [
				"min" => ,
				"max" =>
			],
			"y" => [
				"min" => ,
				"max" =>
			]
		],
		"size" => ,
		"rotation" => [
			"type" => ,
			"value" =>
		],
		"ratio" => ,
		"flip" => [
			"x" => ,
			"y" =>
		],
		"position" => [
			"x" => ,
			"y" => ,
		],
		"margin" => [
			"top" => ,
			"bottom" => ,
			"left" => ,
			"right" =>
		],
		"display" =>
	],
	"font" => [
		"color" => [
			"text" => ,
			"background" =>
		],
		"size" => ,
		"decoration" => [
			"underline" => ,
			"bold" => ,
			"italic" => 
		]
	],
	"interaction" => [
		"zoom" => ,
		"pan" => ,
		"rotation" =>
	],
	"menu" =>
]


new sinod
"category": "Cartesian2D"
"type": "Cartesian2D"

[
	"type" => "Cartesian2D",
	"axis" => ,
	"grid" => ,
	"elements => [],
	"elmAlign" => ,
	"bounds" => [
		"x" => [
			"min" => ,
			"max" =>
		],
		"y" => [
			"min" => ,
			"max" => 
		]
	],
	"size" => ,
	"rotation" => ,
	"ratio" => ,
	"flip" => [
		"x" => ,
		"y" =>
	],
	"position" => [
		"left" => ,
		"right" =>
	],
	"margin" => [
		"top" => ,
		"bottom" => ,
		"left" => ,
		"right" => 
	],
	"display" => ,
	"font" => [
		"color" => [
			"text" => ,
			"background" => 
		],
		"size" => ,
		"decoration" => [
			"underline" => ,
			"bold" => ,
			"italic" =>
		]
	],
	"interaction" => [
		"zooming" => ,
		"panning" => ,
		"rotation" =>
	],
	"menu" =>
]


old sinod

"type": "Cartesian2D" or "CoordPlane" or "Geometry2D"

[
	"type" => "Cartesian2D",
	"object" => [],
	"menu" => [],
	"menuOption" => [
		"curveColor" => [],
		"pointColor" => [],
		"defaultPosition" => ,
		"arrow" => ,
		"endPoint" => []
		"bounded" =>
		"bound" =>
	]
	"bound" => [[],[]],
	"size" =>
	
]

[
	"type" => "CoordPlane",
	"object" => [],
	"bound" => [[],[]]
	"size" =>
]

[
	"type" => "Geometry2D",
	"object" => []
]

*/
	
	
	
class CS_Cartesian2D
{
	public $json_CS;
	
	public function __construct($json_CS)
	{
		$this->json_CS = $json_CS;
	}
    
    public function json_new() 
	{
        $json_new = [];
		
		$json_new["type"] = $this->json_CS["type"]["new"];
		
		$json_new["axis"] = CS_function::json_conversion($this->json_CS["axis"], "new");
				
		$json_new["grid"] = CS_function::json_conversion($this->json_CS["grid"], "new");
		
		$json_new["elements"] = [];
		foreach ($this->json_CS["elements"]["object"] ["value"] as $json_object)
		{
			$json_new["elements"][] = CS_function::json_conversion($json_object, "new");
		}
		
		$json_new["elmAlign"] = $this->json_CS["elements"]["align"];
		
		$json_new["bounds"] = [];
		$json_new["bounds"]["x"] = [];
		$json_new["bounds"]["x"]["min"] = $this->json_CS["layout"]["bounds"]["x"]["min"];
		$json_new["bounds"]["x"]["max"] = $this->json_CS["layout"]["bounds"]["x"]["max"];
		$json_new["bounds"]["y"] = [];
		$json_new["bounds"]["y"]["min"] = $this->json_CS["layout"]["bounds"]["y"]["min"];
		$json_new["bounds"]["y"]["max"] = $this->json_CS["layout"]["bounds"]["y"]["max"];
		
		$json_new["size"] = $this->json_CS["layout"]["size"];
		
		$json_new["rotation"] = $this->json_CS["rotation"]["value"];
		
		$json_new["flip"] = [];
		$json_new["flip"]["x"] = $this->json_CS["layout"]["flip"]["x"];
		$json_new["flip"]["y"] = $this->json_CS["layout"]["flip"]["y"];
		
		$json_new["position"] = [];
		$json_new["position"]["left"] = $this->json_CS["layout"]["position"]["x"];
		$json_new["position"]["top"] = $this->json_CS["layout"]["position"]["y"];
		
		$json_new["margin"] = [];
		$json_new["margin"]["top"] = $this->json_CS["layout"]["margin"]["top"];
		$json_new["margin"]["bottom"] = $this->json_CS["layout"]["margin"]["bottom"];
		$json_new["margin"]["left"] = $this->json_CS["layout"]["margin"]["left"];
		$json_new["margin"]["right"] = $this->json_CS["layout"]["margin"]["right"];
		
		$json_new["display"] = $this->json_CS["layout"]["display"];
		
		$json_new["font"] = [];
		$json_new["font"]["color"] = [];
		$json_new["font"]["color"]["text"] = $this->json_CS["font"]["color"]["text"];
		$json_new["font"]["color"]["text"] = $this->json_CS["font"]["color"]["background"];
		$json_new["font"]["size"] = $this->json_CS["font"]["size"];
		$json_new["font"]["decoration"] = [];
		$json_new["font"]["decoration"]["underline"] = $this->json_CS["font"]["decoration"]["underline"];
		$json_new["font"]["decoration"]["bold"] = $this->json_CS["font"]["decoration"]["bold"];
		$json_new["font"]["decoration"]["italic"] = $this->json_CS["font"]["decoration"]["italic"];
		
		$json_new["interaction"] = [];
		$json_new["interaction"]["zooming"] = $this->json_CS["interaction"]["zoom"];
		$json_new["interaction"]["panning"] = $this->json_CS["interaction"]["pan"];
		$json_new["interaction"]["rotation"] = $this->json_CS["interaction"]["rotation"];
		
		$json_new["menu"] = $this->json_CS["menu"];
		
		
		return $json_new;
    }
    
    public function json_old() 
	{
        $json_old = [];
		
		$json_old["type"] = $this->json_CS["type"]["old"];
		switch ($this->json_CS["type"]["Old"])
		{
			case "Cartesian2D":
			{
				$json_old["object"] = [];
				foreach ($this->json_CS["elements"]["object"]["value"] as $json_object)
				{
					$json_old["object"][] = CS_function::json_conversion($json_object, "old");
				}
								
				$json_old["menu"] = $this->json_CS["curves"]["object"];
				
				$json_old["menuOption"] = [];
				$json_old["menuOption"]["curveColor"] = [];
				foreach ($this->json_CS["curves"]["style"]["color"]["curve"] as $json_object)
				{
					$json_old["menuOption"]["curveColor"][] = CS_function::color_conversion($json_object,"old");
				}
				$json_old["menuOption"]["pointColor"] = [];
				foreach ($this->json_CS["curves"]["style"]["color"]["point"] as $json_object)
				{
					$json_old["menuOption"]["pointColor"][] = CS_function::color_conversion($json_object,"old");
				}
				$json_old["menuOption"]["defaultPosition"] = $this->json_CS["curves"]["style"]["defaultPosition"];
				$json_old["menuOption"]["arrow"] = $this->json_CS["curves"]["style"]["arrow"];
				$json_old["menuOption"]["endPoint"] = [];
				$json_old["menuOption"]["endPoint"][0] = $this->json_CS["curves"]["style"]["endPoints"]["min"];
				$json_old["menuOption"]["endPoint"][1] = $this->json_CS["curves"]["style"]["endPoints"]["max"];
				$json_old["menuOption"]["bounded"] = $this->json_CS["curves"]["style"]["bonded"];
				$json_old["menuOption"]["bound"] = [];
				$json_old["menuOption"]["bound"][0] = $this->json_CS["curves"]["layout"]["bounds"]["min"];
				$json_old["menuOption"]["bound"][1] = $this->json_CS["curves"]["layout"]["bounds"]["max"];
				
				$json_old["bound"] = [[],[]];
				$json_old["bound"][0][0] = $this->json_CS["layout"]["bounds"]["x"]["min"];
				$json_old["bound"][0][1] = $this->json_CS["layout"]["bounds"]["x"]["max"];
				$json_old["bound"][1][0] = $this->json_CS["layout"]["bounds"]["y"]["min"];
				$json_old["bound"][1][1] = $this->json_CS["layout"]["bounds"]["y"]["max"];
				
				$json_old["size"] = $this->json_CS["layout"]["size"];
				
				
			}
			case "CoordPlane":
			{
				$json_old["object"] = [];
				foreach ($this->json_CS["elements"]["object"] as $json_object)
				{
					$json_old["object"][] = CS_function::json_conversion($json_object, "old");
				}
				
				$json_old["bound"] = [[],[]];
				$json_old["bound"][0][0] = $this->json_CS["layout"]["bounds"]["x"]["min"];
				$json_old["bound"][0][1] = $this->json_CS["layout"]["bounds"]["x"]["max"];
				$json_old["bound"][1][0] = $this->json_CS["layout"]["bounds"]["y"]["min"];
				$json_old["bound"][1][1] = $this->json_CS["layout"]["bounds"]["y"]["max"];
				
				$json_old["size"] = $this->json_CS["layout"]["size"];
			}
			case "Geometry2D":
			{
				$json_old["object"] = [];
				foreach ($this->json_CS["elements"]["object"] as $json_object)
				{
					$json_old["object"][] = CS_function::json_conversion($json_object, "old");
				}
				
				$json_old["window"] = [[],[]];
				$json_old["window"][0][0] = $this->json_CS["layout"]["bounds"]["x"]["min"];
				$json_old["window"][0][1] = $this->json_CS["layout"]["bounds"]["x"]["max"];
				$json_old["window"][1][0] = $this->json_CS["layout"]["bounds"]["y"]["min"];
				$json_old["window"][1][1] = $this->json_CS["layout"]["bounds"]["y"]["max"];
				
				$json_old["size"] = $this->json_CS["layout"]["size"];
				$json_old["rotate"] = $this->json_CS["layout"]["rotation"]["value"];
			}
		}
		
		
		
		
		return $json_old;
    }
    
    public function json($flag = false, $version = "old") 
	{
        
		switch($version) 
		{
        
			case "new" : $json = $this->json_new();
            
			case "old" : $json = $this->json_old();
        }
        
        return $flag ? $json : json_encode($json, 256);
    }
    
    public function __toString() 
	{
        return "";
    }
}






/*
CS sinod
"category":	"Cartesian2D"
"type": "Axis2D"

[
	"type" => [
		"CS" => ,
		"new" => ,
		"old" =>
	],
	"label" => [
		"origin" => ,
		"x" => ,
		"y" =>
	],
	"style" => [
		"visible" => [
			"x" => ,
			"y" =>
		],
		"arrow" => [
			"x" => [
				"min" => ,
				"max" =>
			],
			"y" => [
				"min" => ,
				"max" =>
			]
		],
		"color" =>
	]
]


new sinod
"category": "Cartesian2D"
"type": "Axis2D"

[
	"type" => "Axis2D",
	"labels => [
		"origin" => ,
		"hor" => ,
		"ver" =>
	],
	"style" => [
		"hor" => [
			"visibility" => ,
			"minArrow" => ,
			"maxArrow" =>
		],			
		"ver" => [
			"visibility" => ,
			"minArrow" => ,
			"maxArrow" =>
		]		
	],
	"color" =>
]


old sinod

"type": "Axis2D"

[
	"type" => "Axis2D",
	"origin" => ,
	"value" => [
		[
			"name" => ,
			"visible" =>
		],
		[	
			"name" => ,
			"visible" =>
		]
	]
	
]

*/
	
	
	
class CS_Axis2D
{
	public $json_CS;
	
	public function __construct($json_CS)
	{
		$this->json_CS = $json_CS;
	}
    
    public function json_new() 
	{
        $json_new = [];
		
		$json_new["type"] = $this->json_CS["type"]["new"];
		
		$json_new["label"] = [];
		$json_new["label"]["origin"] = $this->json_CS["label"]["origin"];
		$json_new["label"]["hor"] = CS_function::json_conversion($this->json_CS["label"]["x"], "new");
		$json_new["label"]["ver"] = CS_function::json_conversion($this->json_CS["label"]["y"], "new");
		
		$json_new["style"] = [];
		$json_new["style"]["hor"] = [];
		$json_new["style"]["hor"]["visibility"] = $this->json_CS["style"]["visible"]["x"];
		$json_new["style"]["hor"]["minArrow"] = $this->json_CS["style"]["arrow"]["x"]["min"];
		$json_new["style"]["hor"]["maxArrow"] = $this->json_CS["style"]["arrow"]["x"]["max"];
		$json_new["style"]["ver"] = [];
		$json_new["style"]["ver"]["visibility"] = $this->json_CS["style"]["visible"]["y"];
		$json_new["style"]["ver"]["minArrow"] = $this->json_CS["style"]["arrow"]["y"]["min"];
		$json_new["style"]["ver"]["maxArrow"] = $this->json_CS["style"]["arrow"]["y"]["max"];
		
		$json_new["color"] = CS_function::color_conversion($this->json_CS["style"]["color"],"new");
		
		return $json_new;
    }
    
    public function json_old() 
	{
        $json_old = [];
		
		$json_old["type"] = $this->json_CS["type"]["old"];
		
		$json_old["origin"] = $this->json_CS["label"]["origin"];
		
		$json_old["value"] = [[],[]];
		$json_old["value"][0]["name"] = CS_function::json_conversion($this->json_CS["label"]["x"],"old");
		$json_old["value"][0]["vibile"] = $this->json_CS["style"]["visible"]["x"];
		$json_old["value"][1]["name"] = CS_function::json_conversion($this->json_CS["label"]["y"],"old");
		$json_old["value"][1]["vibile"] = $this->json_CS["style"]["visible"]["y"];
				
		return $json_old;
    }
    
    public function json($flag = false, $version = "old") 
	{
        
		switch($version) 
		{
        
			case "new" : $json = $this->json_new();
            
			case "old" : $json = $this->json_old();
        }
        
        return $flag ? $json : json_encode($json, 256);
    }
    
    public function __toString() 
	{
        return "";
    }
}




/*
CS sinod
"category":	"Cartesian2D"
"type": "Grid2D"

[
	"type" => [
		"CS" => ,
		"new" => ,
		"old" =>
	],
	"typeOld" => ,
	"line" => [
		"free" => [
			"x" => [],
			"y" => []
		],
		"regular" => [
			"x" => [
				"thin" => [
					"initial" => ,
					"increment" =>
				],
				"thick" => [
					"initial" => ,
					"increment" =>
				]
			],
			"y" => [
				"thin" => [
					"initial" => ,
					"increment" =>
				],
				"thick" => [
					"initial" => ,
					"increment" =>
				]
			]
		]
	],
	"style" => [
		"color" => [
			"line" => [
				"thin" => ,
				"thick" =>
			],
			"label" =>
		]
	],
	"label" => [
		"regular" => [
			"x" => [
				"thin" => [
					"initial" => ,
					"increment" =>
				],
				"thick" => [
					"initial" => ,
					"increment" =>
				]
			],
			"y" => [
				"thin" => [
					"initial" => ,
					"increment" =>
				],
				"thick" => [
					"initial" => ,
					"increment" =>
				]
			]
		],	
		"free" => [
			"x" => [[
				"position" => ,
				"label" =>
			]],
			"y" => [[
				"position" => ,
				"label" =>
			]]
		]
	],
	"layout" => [
		"bounds" => [
			"x" => [
				"min" => ,
				"max" =>
			],
			"y" => [
				"min" => ,
				"max" =>
			]
		],
		"size" => 
	]

]


new sinod
"category": "Cartesian2D"
"type": "Grid2D"

[
	"type" => [
		"CS" => ,
		"new" => ,
		"old" =>
	],
	"normal" => [
		"init" => [
			"x" => ,
			"y" =>
		],
		"unit" => [
			"x" => ,
			"y" =>
		],
		"color" =>
	],
	"strong" => [
		"init" => [
			"x" => ,
			"y" =>
		],
		"unit" => [
			"x" => ,
			"y" =>
		],
		"color" =>
	],
	"label" => [
		"init" => [
			"x" => ,
			"y" =>
		],
		"unit" => [
			"x" => ,
			"y" =>
		],
		"color" =>
	],
	"showZero" =>
]


old sinod

"type": "Grid2D" or "GridLabel2D"

[
	"type" => "Grid2D"
	"value" => [[],[]]
	
]

[
	"type" => "GridLabel2D",
	"value" => [[],[]],
	"bound" => [[],[]],
	"size"
]

*/
	
	
	
class CS_Grid2D
{
	public $json_CS;
	
	public function __construct($json_CS)
	{
		$this->json_CS = $json_CS;
	}
    
    public function json_new() 
	{
        $json_new = [];
		
		$json_new["type"] = $this->json_CS["type"]["new"];
		
		$json_new["normal"] = [];
		$json_new["normal"]["init"] = [];
		$json_new["normal"]["init"]["x"] = $this->json_CS["line"]["regular"]["x"]["thin"]["initial"];
		$json_new["normal"]["init"]["y"] = $this->json_CS["line"]["regular"]["y"]["thin"]["initial"];
		$json_new["normal"]["unit"] = [];
		$json_new["normal"]["unit"]["x"] = $this->json_CS["line"]["regular"]["x"]["thin"]["increment"];
		$json_new["normal"]["unit"]["y"] = $this->json_CS["line"]["regular"]["y"]["thin"]["increment"];
		$json_new["normal"]["color"] = $this->json_CS["style"]["color"]["line"]["thin"];
		
		$json_new["strong"] = [];
		$json_new["strong"]["init"] = [];
		$json_new["strong"]["init"]["x"] = $this->json_CS["line"]["regular"]["x"]["thick"]["initial"];
		$json_new["strong"]["init"]["y"] = $this->json_CS["line"]["regular"]["y"]["thick"]["initial"];
		$json_new["strong"]["unit"] = [];
		$json_new["strong"]["unit"]["x"] = $this->json_CS["line"]["regular"]["x"]["thick"]["increment"];
		$json_new["strong"]["unit"]["y"] = $this->json_CS["line"]["regular"]["y"]["thick"]["increment"];
		$json_new["strong"]["color"] = $this->json_CS["style"]["color"]["line"]["thick"];
		
		$json_new["label"] = [];
		$json_new["label"]["init"] = [];
		$json_new["label"]["init"]["x"] = $this->json_CS["label"]["regular"]["x"]["initial"];
		$json_new["label"]["init"]["y"] = $this->json_CS["label"]["regular"]["y"]["initial"];
		$json_new["label"]["unit"] = [];
		$json_new["label"]["unit"]["x"] = $this->json_CS["label"]["regular"]["x"]["increment"];
		$json_new["label"]["unit"]["y"] = $this->json_CS["label"]["regular"]["y"]["increment"];
		$json_new["label"]["color"] = $this->json_CS["style"]["color"]["label"];
		
		$json_new["showZero"] = $this->json_CS["label"]["regular"]["origin"];
		
		return $json_new;
    }
    
    public function json_old() 
	{
        $json_old = [];
		
		$json_old["type"] = $this->json_CS["type"]["old"];
		
		switch ($this->json_CS["type"]["old"])
		{
			case "Grid2D":
			{
				$json_old["value"] = [];
				$json_old["value"][0] = $this->json_CS["line"]["free"]["x"];
				$json_old["value"][1] = $this->json_CS["line"]["free"]["y"];
			}
			case "GridLabel2D":
			{
				$json_old["value"] = [[],[]];
				foreach ($this->json_CS["label"]["free"]["x"] as $json_object)
				{
					$label = [];
					$label[0] = $json_object[0];
					$label[1] = CS_function::json_conversion($json_object[1],"new");
					$json_old["value"][0][] = $label;
				}
				foreach ($this->json_CS["label"]["free"]["y"] as $json_object)
				{
					$label = [];
					$label[0] = $json_object[0];
					$label[1] = CS_function::json_conversion($json_object[1],"new");
					$json_old["value"][1][] = $label;
				}
				
				$json_old["bound"] = [[],[]];
				$json_old["bound"][0] = [$this->json_CS["bounds"]["x"]["min"],$this->json_CS["bounds"]["x"]["max"]];
				$json_old["bound"][1] = [$this->json_CS["bounds"]["y"]["min"],$this->json_CS["bounds"]["y"]["max"]];
				
				$json_old["size"] = $this->json_CS["layout"]["size"];
			}
		}
		
		return $json_old;
    }
    
    public function json($flag = false, $version = "old") 
	{
        
		switch($version) 
		{
        
			case "new" : $json = $this->json_new();
            
			case "old" : $json = $this->json_old();
        }
        
        return $flag ? $json : json_encode($json, 256);
    }
    
    public function __toString() 
	{
        return "";
    }
}




/*
CS sinod
"category":	"Cartesian2D"
"type": "Angle2D"

[
	"type" => [
		"CS" => ,
		"new" => ,
		"old" =>
	],
	"geometry" => [
		"coordinates" => [
			"center" => [
				"x" => ,
				"y" =>
			],
			"start" => [
				"x" => ,
				"y" =>
			],
			"end" => [
				"x" => ,
				"y" =>
			]
		],
		"height" =>
	],
	"interaction" => [
		"interactive" => ,
		"selectable" => ,
		"selected" => ,
	],
	"style" => [
		"visible" => ,
		"color" => ,
		"filled" => ,
		"curve" => ,
		"right" => ,
		"dash" => ,
		"arrow" => [
			"start" => ,
			"end" => 
		],
		"marker" => [
			"type" => ,
			"height" =>
		]
	],
	"label" => [
		"value" => ,
		"direction" =>
	]

]


new sinod
"category": "Cartesian2D"
"type": "Angle2D"

[
	"type" => "Angle2D",
	"coordinates" => [
		"center" => [
			"x" => ,
			"y" =>
		],
		"start" => [
			"x" => ,
			"y" =>
		],
		"end" => [
			"x" => ,
			"y" =>
		]
	],
	"interaction" => [
		"interactive" => ,
		"selected" =>
	],
	"style" => [
		"height" => ,
		"color" => ,
		"fill" => ,
		"curve" => ,
		"rightAngle" => ,
		"dash" => ,
		"arrow" => [
			"start" => ,
			"end" => 
		],
		"marker" => ,
		"markerHeight" => 
	]
		
]


old sinod

"type": "AngleGeo2D"

[
	"vertex" => [],
	"source" => [],
	"target" => [],
	"height" => ,
	"selectable" => ,
	"selected" => ,
	"visible" => ,
	"color" => ,
	"isFill" =>
	"label" => ,
	"labelSign" =>
	
]

*/
	
	
	
class CS_Angle2D
{
	public $json_CS;
	
	public function __construct($json_CS)
	{
		$this->json_CS = $json_CS;
	}
    
    public function json_new() 
	{
        $json_new = [];
		
		$json_new["type"] = $this->json_CS["type"]["new"];
		
		$json_new["coords"] = [];
		$json_new["coords"]["center"] = [];
		$json_new["coords"]["center"]["x"] = $this->json_CS["geometry"]["coordinates"]["center"]["x"];
		$json_new["coords"]["center"]["y"] = $this->json_CS["geometry"]["coordinates"]["center"]["y"];
		$json_new["coords"]["start"]["x"] = $this->json_CS["geometry"]["coordinates"]["start"]["x"];
		$json_new["coords"]["start"]["y"] = $this->json_CS["geometry"]["coordinates"]["start"]["y"];
		$json_new["coords"]["end"]["x"] = $this->json_CS["geometry"]["coordinates"]["end"]["x"];
		$json_new["coords"]["end"]["y"] = $this->json_CS["geometry"]["coordinates"]["end"]["y"];
		
		$json_new["interactoin"] = [];
		$json_new["interaction"]["interactive"] = $this->json_CS["interaction"]["interactive"];
		$json_new["interaction"]["selected"] = $this->json_CS["interaction"]["selected"];
		
		$json_new["style"] = [];
		$json_new["style"]["height"] = $this->json_CS["geometry"]["height"];
		$json_new["style"]["color"] = CS_function::color_conversion($this->json_CS["color"],"new");
		$json_new["style"]["fill"] = $this->json_CS["style"]["filled"];
		$json_new["style"]["curve"] = $this->json_CS["style"]["curve"];
		$json_new["style"]["rightAngle"] = $this->json_CS["style"]["right"];
		$json_new["style"]["dash"] = $this->json_CS["style"]["dash"];
		$json_new["style"]["arrow"] = [];
		$json_new["style"]["arrow"]["start"] = $this->json_CS["style"]["arrow"]["start"];
		$json_new["style"]["arrow"]["end"] = $this->json_CS["style"]["arrow"]["end"];
		$json_new["style"]["marker"] = $this->json_CS["style"]["marker"]["type"];
		$json_new["style"]["markerHeight"] = $this->json_CS["style"]["marker"]["height"];
		
		
		return $json_new;
    }
    
    public function json_old() 
	{
        $json_old = [];
		
		$json_old["type"] = $this->json_CS["type"]["old"];
		
		$json_old["vertex"] = [];
		$json_old["vertex"][0] = $this->json_CS["geometry"]["coordinates"]["center"]["x"];
		$json_old["vertex"][1] = $this->json_CS["geometry"]["coordinates"]["center"]["y"];
		
		$json_old["source"] = [];
		$json_old["source"][0] = $this->json_CS["geometry"]["coordinates"]["start"]["x"];
		$json_old["source"][1] = $this->json_CS["geometry"]["coordinates"]["start"]["y"];
		
		$json_old["target"] = [];
		$json_old["target"][0] = $this->json_CS["geometry"]["coordinates"]["end"]["x"];
		$json_old["target"][1] = $this->json_CS["geometry"]["coordinates"]["end"]["y"];
		
		$json_old["height"] = $this->json_CS["geometry"]["height"];
		
		$json_old["selectable"] = $this->json_CS["interaction"]["selectable"];
		
		$json_old["selected"] = $this->json_CS["interaction"]["selected"];
		
		$json_old["visible"] = $this->json_CS["style"]["visible"];
		
		$json_old["color"] = CS_function::color_conversion($this->json_CS["style"]["color"],"new");
		
		$json_old["isFill"] = $this->json_CS["style"]["filled"];
		
		$this_old["label"] = CS_function::json_conversion($this->json_CS["label"],"old");
		
		$this->old["labelSign"] = CS_function::direction_conversion($this->json_CS["label"]["direction"]);
		
		
		
		
		
		
		return $json_old;
    }
    
    public function json($flag = false, $version = "old") 
	{
        
		switch($version) 
		{
        
			case "new" : $json = $this->json_new();
            
			case "old" : $json = $this->json_old();
        }
        
        return $flag ? $json : json_encode($json, 256);
    }
    
    public function __toString() 
	{
        return "";
    }
}




/*
CS sinod
"category":	"Cartesian2D"
"type": "Arc2D"

[
	"type" => [
		"CS" => ,
		"new" => ,
		"old" =>
	],
	"measure" => [
		"geometry" => [
			"height" =>
		],
		"style" => [
			"visible" => ,
			"color" => ,
			"marker" =>
		],
		"label" => [
			"value" => ,
			"direction" =>
		],
		"object" => 
	],
	"interaction" => [
		"interactive" => ,
		"selectable" => ,
		"selected" => 
	],
	"style" => [
		"visible" => ,
		"color" => ,
		"dash" => ,
		"marker" => [
			"right" => ,
			"center" => ,
			"left" => 
		],
		"arrow" => [
			"start" => ,
			"end" =>
		]
	],
	"geometry" => [
		"coordinates" => [
			"center" => [
				"x" => ,
				"y" =>
			],
			"start" => [
				"x" => ,
				"y" =>
			]
		],
		"angle" =>
	],
	"label" => [
		"value" => ,
		"direction" => 
	]

]


new sinod
"category": "Cartesian2D"
"type": "Arc2D"

[
	"type" => "Arc2D",
	"measure" => ,
	"interaction" => [
		"interactive" => ,
		"selected" =>
	],
	"style" => [
		"color" => ,
		"dash" => ,
		"marker1" => ,
		"marker2" => ,
		"marker3" =>
		"arrow" => [
			"start" => ,
			"end" =>
		]
	],
	"coordinates" => [
		"center" => [
			"x" => ,
			"y" =>
		],
		"start" => [
			"x" => ,
			"y" =>
		]
	],
	"angle" =>
]


old sinod

"type": "ArcGeo2D"

[
	"type" => "ArcGeo2D",
	"measure" => [
		"height" => ,
		"visible" => ,
		"color" => ,
		"tickLabel" => ,
		"label" => ,
		"labelSign" =>
	],
	"selectable" => ,
	"selected" => ,
	"visible" => ,
	"color" => ,
	"tickLabel" => ,
	"center" => [
		"x" => ,
		"y" =>
	],
	"pointStart" => [
		"x" => ,
		"y" =>
	],
	"angle" => ,
	"label" => ,
	"labelSign" =>
]

*/
	
	
	
class CS_Arc2D
{
	public $json_CS;
	
	public function __construct($json_CS)
	{
		$this->json_CS = $json_CS;
	}
    
    public function json_new() 
	{
        $json_new = [];
		
		$json_new["type"] = $this->json_CS["type"]["new"];
		
		$json_new["measure"] = CS_function::json_conversion($this->json_CS["measure"],"new");
		
		$json_new["interaction"] = [];
		$json_new["interaction"]["interactive"] = $this->json_CS["interaction"]["interactive"];
		$json_new["interaction"]["selected"] = $this->json_CS["interaction"]["selected"];
		
		$json_new["style"] = [];
		$json_new["style"]["color"] = $this->json_CS["style"]["color"];
		$json_new["style"]["dash"] = $this->json_CS["style"]["dash"];
		$json_new["style"]["marker1"] = $this->json_CS["style"]["marker"]["right"];
		$json_new["style"]["marker2"] = $this->json_CS["style"]["marker"]["center"];
		$json_new["style"]["marker3"] = $this->json_CS["style"]["marker"]["left"];
		$json_new["style"]["arrow"] = [];
		$json_new["style"]["arrow"]["start"] = $this->json_CS["style"]["arrow"]["start"];
		$json_new["style"]["arrow"]["end"] = $this->json_CS["style"]["arrow"]["end"];
		
		$json_new["coords"] = [];
		$json_new["coords"]["center"] = [];
		$json_new["coords"]["center"]["x"] = $this->json_CS["geometry"]["coordinates"]["center"]["x"];
		$json_new["coords"]["center"]["y"] = $this->json_CS["geometry"]["coordinates"]["center"]["y"];
		$json_new["coords"]["start"] = [];
		$json_new["coords"]["start"]["x"] = $this->json_CS["geometry"]["coordinates"]["start"]["x"];
		$json_new["coords"]["start"]["y"] = $this->json_CS["geometry"]["coordinates"]["start"]["y"];
		$json_new["coords"]["end"] = [];
		$json_new["coords"]["end"]["x"] = $this->json_CS["geometry"]["coordinates"]["end"]["x"];
		$json_new["coords"]["end"]["y"] = $this->json_CS["geometry"]["coordinates"]["end"]["y"];
		
		$json_new["angle"] = $this->json_CS["geometry"]["angle"];
		
		return $json_new;
    }
    
    public function json_old() 
	{
        $json_old = [];
		
		$json_old["type"] = $this->json_CS["type"]["old"];
		
		$json_old["measure"] = [];
		$json_old["measure"]["height"] = $this->json_CS["measure"]["geometry"]["height"];
		$json_old["measure"]["visible"] = $this->json_CS["measure"]["style"]["visible"];
		$json_old["measure"]["color"] = CS_function::color_conversion($this->json_CS["measure"]["style"]["color"],"old");
		$json_old["measure"]["tickLabel"] = $this->json_CS["measure"]["style"]["marker"];
		$json_old["measure"]["label"] = CS_function::json_conversion($this->json_CS["measure"]["label"]["value"],"old");
		$json_old["measure"]["labelSign"] = CS_function::direction_conversion($this->json_CS["measure"]["label"]["direction"]);
		
		$json_old["selectable"] = $this->json_CS["interaction"]["selectable"];
		
		$json_old["selected"] = $this->json_CS["interaction"]["selected"];
		
		$json_old["visible"] = $this->json_CS["style"]["visible"];
		
		$json_old["color"] = CS_function::color_conversion($this->json_CS["style"]["color"],"old");
		
		$json_old["dash"] = $this->json_CS["style"]["dash"];
		
		$json_old["tickLabel"] = $this->json_CS["style"]["marker"]["center"];
		
		$json_old["center"] = [];
		$json_old["center"][0] = $this->json_CS["geometry"]["coordinates"]["center"]["x"];
		$json_old["center"][1] = $this->json_CS["geometry"]["coordinates"]["center"]["y"];
		
		$json_old["pointStart"] = [];
		$json_old["pointStart"][0] = $this->json_CS["geometry"]["coordinates"]["start"]["x"];
		$json_old["pointStart"][1] = $this->json_CS["geometry"]["coordinates"]["start"]["y"];
		
		$json_old["angle"] = $this->json_CS["geometry"]["angle"];
		
		
		$json_old["label"] = CS_function::json_conversion($this->json_CS["label"]["value"],"old");
		$json_old["labelSign"] = CS_function::direction_conversion($this->json_CS["label"]["direction"]);
		
		
		return $json_old;
    }
    
    public function json($flag = false, $version = "old") 
	{
        
		switch($version) 
		{
        
			case "new" : $json = $this->json_new();
            
			case "old" : $json = $this->json_old();
        }
        
        return $flag ? $json : json_encode($json, 256);
    }
    
    public function __toString() 
	{
        return "";
    }
}




/*
CS sinod
"category":	"Cartesian2D"
"type": "Curve2D"

[
	"type" => [
		"CS" => ,
		"new" => ,
		"old" =>
	],
	"typeOld" => ,
	"style" => [
		"dash" => ,
		"color" => ,
		"defaultPosition" => ,
		"arrow" => ,
		"endPoints" => [
			"min" => ,
			"max" =>
		],
		"bounded" =>
	],
	"layout" => [
		"bounds" => [
			"x" => [
				"min" => ,
				"max" =>
			],
			"y" => [
				"min" => ,
				"max" =>
			]
		]
	],
	"interaction" => [
		"bounds" => ,
		"removable" => ,
		"interactive" => ,
		"selectable" => ,
		"selected" =>
	],
	"geometry" => [
		"type" => ,
		"equation" => ,
		"points" => [[
			"x" => ,
			"y" =>
		]]
	]
]


new sinod
"category": "Cartesian2D"
"type": "Curve2D"

[
	"style" => [
		"dash" => ,
		"color" =>
	],
	"domain" => [
		"x" => [
			"min" => ,
			"max" =>
		],
		"y" => [
			"min" => ,
			"max" =>
		]
	],
	"interaction" => [
		"domain" => ,
		"removable" => ,
		"selectable" => ,
		"movable-mode" =>
	],
	"equation" => ,
	"points" => [[
		"x" => ,
		"y" =>
	]]
	
]


old sinod

"type": "Curve"
		"Input:LineCurve"
		"Input:QuadCurve"
		"Input:ExpoCurve"
		"Input:ReciCurve"
		"Input:SqrtCurve"
		"Objectum"



[
	"type" => "Curve",
	"dash" => ,
	"color" => ,
	"eqn" => 
]

[
	"type" => "Input:*Curve",
	"dash" => ,
	"eqnType" => ,
	"eqn" =>
]

[
	"type" => "Objectum",
	"dashed" => ,
	"arrow" => ,
	"endPoint" => ,
	"bounded" => ,
	"bounds" => [ , ],
	"input" => ,
	"selected" => ,
	"mode" => ,
	"eqnCoord" => ,
]

*/
	
	
	
class CS_Curve2D
{
	public $json_CS;
	
	public function __construct($json_CS)
	{
		$this->json_CS = $json_CS;
	}
    
    public function json_new() 
	{
        $json_new = [];
		
		$json_new["type"] = $this->json_CS["type"]["new"];
		
		$json_new["style"] = [];
		$json_new["style"]["dash"] = $this->json_CS["style"]["dash"];
		$json_new["style"]["color"] = $this->json_CS["style"]["dash"];
		
		$json_new["domain"] = [];
		$json_new["domain"]["x"] = [];
		$json_new["domain"]["x"]["min"] = $this->json_CS["layout"]["bounds"]["x"]["min"];
		$json_new["domain"]["x"]["max"] = $this->json_CS["layout"]["bounds"]["x"]["max"];
		$json_new["domain"]["y"] = [];
		$json_new["domain"]["y"]["min"] = $this->json_CS["layout"]["bounds"]["y"]["min"];
		$json_new["domain"]["y"]["max"] = $this->json_CS["layout"]["bounds"]["y"]["max"];
		
		$json_new["interaction"] = [];
		$json_new["interaction"]["domain"] = $this->json_CS["interaction"]["bounds"];
		$json_new["interaction"]["removable"] = $this->json_CS["interaction"]["removable"];
		$json_new["interaction"]["selectable"] = $this->json_CS["interaction"]["selectable"];
		$json_new["interaction"]["movable-mode"] = CS_function::curve_conversion($this->json_CS["geometry"]["type"],"new");
		
		$json_new["equation"] = $this->json_CS["geometry"]["equation"];
		$json_new["points"] = [];
		foreach ($this->json_CS["geometry"]["points"] as $json_object)
		{
			$value = [];
			$value["x"] = $json_object["x"];
			$value["y"] = $json_object["y"];
			$json_new["points"][] = $value;
		}
		
		return $json_new;
    }
    
    public function json_old() 
	{
        $json_old = [];
		
		$json_old["type"] = $this->json_CS["type"]["old"];
		
		switch ($this->json_CS["type"]["old"])
		{
			case "Curve":
			{
				$json_old["dash"] = $this->json_CS["style"]["dash"];
				
				$json_old["color"] = CS_function::color_conversion($this->json_CS["color"],"old");
				
				$json_old["eqn"] = $this->json_CS["geometry"]["equation"];
			}
			case "Input:LineCurve":
			case "Input:QuadCurve":
			case "Input:ExpoCurve":
			case "Input:ReciCurve":
			case "Input:SqrtCurve":
			{
				$json_old["dash"] = $this->json_CS["style"]["dash"];
				
				$json_old["color"] = CS_function::color_conversion($this->json_CS["color"],"old");
				
				$json_old["eqnType"] = CS_function::curve_conversion($this->json_CS["geometry"]["type"],"oldInput");
				
				$json_old["eqn"] = $this->json_CS["geometry"]["equation"];
			}
			case "Objectum":
			{
				$json_old["dashed"] = $this->json_CS["style"]["dash"];
				
				$json_old["color"] = CS_function::color_conversion($this->json_CS["color"],"old");
				
				$json_old["arrow"] = $this->json_CS["style"]["arrow"];
				
				$json_old["endPoint"] = [];
				$json_old["endPoint"][0] = $this->json_CS["style"]["endPoints"]["min"];
				$json_old["endPoint"][1] = $this->json_CS["style"]["endPoints"]["max"];
				
				$json_old["bounded"] = $this->json_CS["style"]["bounded"];
				
				$json_old["bound"] = [];
				$json_old["bound"][0] = $this->json_CS["layout"]["bounds"]["x"]["min"];
				$json_old["bound"][1] = $this->json_CS["layout"]["bounds"]["x"]["max"];
				
				$json_old["input"] = $this->json_CS["interaction"]["interactive"];
				$json_old["selected"] = $this->json_CS["interaction"]["selected"];
				$json_old["mode"] = CS_function::curve_conversion($this->json_CS["geometry"]["type"],"old");
				
				$json_old["eqn"] = $this->json_CS["geometry"]["equation"];
				
				$json_old["eqnCoord"] = [];
				foreach ($this->json_CS["geometry"]["points"] as $json_object)
				{
					$value = [];
					$value[0] = $json_object["x"];
					$value[1] = $json_object["y"];
				}
			}
		}
		return $json_old;
    }
    
    public function json($flag = false, $version = "old") 
	{
        
		switch($version) 
		{
        
			case "new" : $json = $this->json_new();
            
			case "old" : $json = $this->json_old();
        }
        
        return $flag ? $json : json_encode($json, 256);
    }
    
    public function __toString() 
	{
        return "";
    }
}



/*
CS sinod
"category":	"Cartesian2D"
"type": "Face2D"

[
	"type" => [
		"CS" => ,
		"new" => ,
		"old" =>
	],
	"geometry" => [
		"coordinates" => [[
			"x" => ,
			"y" =>
		]]
	],
	"style" => [
		"color" => 
	],
	"interaction" => [
		"selected" => ,
		"selectable" => ,
		"movable" => ,
		"interactive" +.
	]
]


new sinod
"category": "Cartesian2D"
"type": "Face2D"

[
	"type" => "Face2D",
	"coordinates" => [[
		"x" => ,
		"y" =>
	]],
	"style" => [
		"color" => 
	],
	"interaction" => [
		"selected" => ,
		"selectable" => ,
		"movable" => ,
		"interactive" +.
	]
	
]


old sinod

"type": "FaceGeo2D"


[
	"type" => "FaceGeo2D",
	"coordinates" => [],
	"color" => ,
	"selected" => ,
	"selectable" =>
]

*/
	
	
	
class CS_Face2D
{
	public $json_CS;
	
	public function __construct($json_CS)
	{
		$this->json_CS = $json_CS;
	}
    
    public function json_new() 
	{
        $json_new = [];
		
		$json_new["type"] = $this->json_CS["type"]["new"];
		
		$json_new["coords"] = [];
		foreach ($this->json["geometry"]["coordinates"] as $json_object)
		{
			$value = [];
			$value["x"] = $json_object["x"];
			$value["y"] = $json_object["y"];\
			$json_new["coords"][] = $value;
			
		}
		
		$json_new["style"]["color"] = $this->json_CS["style"]["color"];
		
		$json_new["interaction"] = [];
		$json_new["interaction"]["selected"] = $this->json_CS["interaction"]["selected"];
		$json_new["interaction"]["selectable"] = $this->json_CS["interaction"]["selectable"];
		$json_new["interaction"]["movable"] = $this->json_CS["interaction"]["movable"];
		$json_new["interaction"]["interactive"] = $this->json_CS["interaction"]["interactive"];
		
		return $json_new;
    }
    
    public function json_old() 
	{
        $json_old = [];
		
		$json_old["type"] = $this->json_CS["type"]["old"];
				
		$json_old["coords"] = [];
		foreach ($this->json_CS["geometry"]["coordinates"] as $json_object)
		{
			$value = [];
			$value[0] = $json_object["x"];
			$value[1] = $json_object["y"];
			$json_old["coords"][] = $value;
		}
		
		$json_old["color"] = CS_function::color_conversion($this->json_CS["style"]["color"],"old");
		
		$json_old["interaction"] = [];
		$json_old["interaction"]["selected"] = $this->json_CS["interaction"]["selected"];
		$json_old["interaction"]["selectable"] = $this->json_CS["interaction"]["selectable"];
		
		return $json_old;
    }
    
    public function json($flag = false, $version = "old") 
	{
        
		switch($version) 
		{
        
			case "new" : $json = $this->json_new();
            
			case "old" : $json = $this->json_old();
        }
        
        return $flag ? $json : json_encode($json, 256);
    }
    
    public function __toString() 
	{
        return "";
    }
}



/*
CS sinod
"category":	"Cartesian2D"
"type": "Label2D"

[
	"type" => [
		"CS" => ,
		"new" => ,
		"old" =>
	],
	"option" => ,
	"interaction" => [
		"interactive" =>
	],
	"geometry" => [
		"coordinates" => [
			"label" => [
				"x" => ,
				"y" =>
			],
			"target" => [
				"x" => ,
				"y" =>
			]
		]
	],
	"style" => [
		"dash" => ,
		"color" => [
			"arrow" =>
		]
	]
	"label" => [
		"value" => ,
		"direction" =>
	]
	
]


new sinod
"category": "Cartesian2D"
"type": "Label2D"

[
	"type" => "Label2D",
	"coordinates" => [
		"x" => ,
		"y" =>
	],
	"target" => [
		"x" => ,
		"y" =>
	],
	"dash" => ,
	"arrowColor" => ,
	"label" => 
	
]


old sinod

"type": "Label2D"


[
	"type" => "Label2D",
	"option" => ,
	"input" => ,
	"coord" => ,
	"label" => ,
	"labelSign" =>
]

*/
	
	
	
class CS_Label2D
{
	public $json_CS;
	
	public function __construct($json_CS)
	{
		$this->json_CS = $json_CS;
	}
    
    public function json_new() 
	{
        $json_new = [];
		
		$json_new["type"] = $this->json_CS["type"]["new"];
		
		$json_new["coords"] = [];
		$json_new["coords"]["x"] = $this->json_CS["geometry"]["coordinates"]["label"]["x"];
		$json_new["coords"]["y"] = $this->json_CS["geometry"]["coordinates"]["label"]["y"];
		
		$json_new["target"] = [];
		$json_new["target"]["x"] = $this->json_CS["geometry"]["coordinates"]["target"]["x"];
		$json_new["target"]["y"] = $this->json_CS["geometry"]["coordinates"]["target"]["y"];
		
		$json_new["dash"] = $this->json_CS["style"]["dash"];
		
		$json_new["arrowColor"] = $this->json_CS["style"]["color"]["arrow"];
		
		$json_new["label"] = CS_function::json_conversion($this->json_CS["label"]["value"],"new");
		
		
		
		return $json_new;
    }
    
    public function json_old() 
	{
        $json_old = [];
		
		$json_old["type"] = $this->json_CS["type"]["old"];
		
		$json_old["option"] = $this->json_CS["option"];
		
		$json_old["input"] = $this->json_CS["interaction"]["interactive"];
		
		$json_old["coord"] = [];
		$json_old["coord"][0] = $this->json_CS["geometry"]["coordinates"]["label"]["x"];
		$json_old["coord"][1] = $this->json_CS["geometry"]["coordinates"]["label"]["y"];
		
		$json_old["label"] = CS_function::json_conversion($this->json_CS["label"]["value"],"old");
		
		$json_old["labelSign"] = CS_function::direction_conversion($this->json_CS["label"]["direction"])
		
		return $json_old;
    }
    
    public function json($flag = false, $version = "old") 
	{
        
		switch($version) 
		{
        
			case "new" : $json = $this->json_new();
            
			case "old" : $json = $this->json_old();
        }
        
        return $flag ? $json : json_encode($json, 256);
    }
    
    public function __toString() 
	{
        return "";
    }
}



/*
CS sinod
"category":	"Cartesian2D"
"type": "Measure2D"

[
	"type" => [
		"CS" => ,
		"new" => ,
		"old" =>
	],
	"style" => [
		"dash" => ,
		"arrow" => [
			"start" => ,
			"end" =>
		],
		"marker" => ,
		"color" => ,
		"visible" =>
	],
	"geometry" => [
		"height" => ,
		"coordinates" => [
			"start" => [
				"x" => ,
				"y" =>
			],
			"end" => [
				"x" => ,
				"y" =>
			]
		]
	],
	"label" => [
		"value" => ,
		"direction" =>
	]
	
]


new sinod
"category": "Cartesian2D"
"type": "Measure2D"

[
	"type" => "Measure2D",
	"style" => [
		"dash" => ,
		"arrow" => [
			"start" => ,
			"end" =>
		],
		"marker" => ,
		"color" => ,
		"height" =>
	]
	
]


old sinod

"type": "MeasureGeo2D"


[
	"type" => "MeasureGeo2D",
	"tickLabel" => ,
	"color" => ,
	"visible" => ,
	"source" => [
		"coord" => [ , ]
	],
	"target" => [
		"coord" => [ , ]
	],
	"label" => ,
	"labelSign" =>
]

*/
	
	
	
class CS_Measure2D
{
	public $json_CS;
	
	public function __construct($json_CS)
	{
		$this->json_CS = $json_CS;
	}
    
    public function json_new() 
	{
        $json_new = [];
		
		$json_new["type"] = $this->json_CS["type"]["new"];
		
		$json_new["style"] = [];
		$json_new["style"]["dash"] = $this->json_CS["style"]["dash"];
		$json_new["style"]["arrow"] = [];
		$json_new["style"]["arrow"]["start"] = $this->json_CS["style"]["arrow"]["start"];
		$json_new["style"]["arrow"]["end"] = $this->json_CS["style"]["arrow"]["end"];
		$json_new["style"]["marker"] = $this->json_CS["style"]["marker"];
		$json_new["style"]["color"] = CS_function::color_conversion($this->json_CS["style"]["color"],"new");
		$json_new["style"]["height"] = $this->json_CS["geometry"]["height"];
		
		
		
		return $json_new;
    }
    
    public function json_old() 
	{
        $json_old = [];
		
		$json_old["type"] = $this->json_CS["type"]["old"];
		
		$json_old["tickLabel"] = $this->json_CS["style"]["marker"];
		
		$json_old["color"] = CS_function::color_conversion($this->json_CS["style"]["color"],"old");
		
		$json_old["visible"] = $this->json_CS["style"]["visible"];
		
		$json_old["height"] = $this->json_CS["geometry"]["height"];
		
		$json_old["source"] = [];
		$json_old["source"][0] = $this->json_CS["geometry"]["coordinates"]["start"]["x"];
		$json_old["source"][1] = $this->json_CS["geometry"]["coordinates"]["start"]["y"];
		
		$json_old["target"] = [];
		$json_old["target"][0] = $this->json_CS["geometry"]["coordinates"]["end"]["x"];
		$json_old["target"][1] = $this->json_CS["geometry"]["coordinates"]["end"]["y"];
		
		$json_old["label"] = CS_function::json_conversion($this->json_CS["label"]["value"],"new");
		
		$json_old["labelSign"] = CS_function::direction_conversion($this->json_CS["label"]["direction"]);
		
		return $json_old;
    }
    
    public function json($flag = false, $version = "old") 
	{
        
		switch($version) 
		{
        
			case "new" : $json = $this->json_new();
            
			case "old" : $json = $this->json_old();
        }
        
        return $flag ? $json : json_encode($json, 256);
    }
    
    public function __toString() 
	{
        return "";
    }
}












/*
CS sinod
"category":	"Cartesian2D"
"type": "MeasureArc2D"

[
	"type" => [
		"CS" => ,
		"new" => ,
		"old" =>
	],
	"label" => [
		"value" => ,
		"direction" =>
	],
	"interaction" => [
		"selectable" => ,
		"movable" =>
	],
	"style" => [
		"dash" => ,
		"arrow" => [
			"start" => ,
			"end" =>
		],
		"marker" => ,
		"handle" => [
			"visible" => ,
			"dash" =>
		],
		"color" => ,
		"visible" => 
	],
	"geometry" => [
		"height" => ,
		"coordinates" => [
			"center" => [
				"x" => ,
				"y" =>
			],
			"start" => [
				"x" => ,
				"y" =>
			]
		],
		"angle" => [
			"type" => ,
			"value" =>
		]
	]
]


new sinod
"category": "Cartesian2D"
"type": "MeasureArc2D"

[
	"type" => "MeasureArc2D",
	"interaction" => [
		"selectable" => ,
		"movable" =>
	],
	"style" => [
		"dash" => ,
		"arrow" => [
			"start" => ,
			"end" =>
		],
		"marker" => ,
		"handle" => ,
		"handleDash" => ,
		"color" => ,
		"height" =>
	],
	
]


old sinod

"type": "MeasureArcGeo2D"


[
	"type" => "MeasureArcGeo2D",
	"label" => ,
	"labelSign" => ,
	"color" => ,
	"visible" => ,
	"height" => ,
	"center" => [ , ],
	"pointStart" => [ , ],
	"angle" =>
]

*/
	
	
	
class CS_MeasureArc2D
{
	public $json_CS;
	
	public function __construct($json_CS)
	{
		$this->json_CS = $json_CS;
	}
    
    public function json_new() 
	{
        $json_new = [];
		
		$json_new["type"] = $this->json_CS["type"]["new"];
		
		$json_new["interaction"] = [];
		$json_new["interaction"]["selectable"] = $this->json_CS["interaction"]["selectable"];
		$json_new["interaction"]["movable"] = $this->json_CS["interaction"]["movable"];
		
		$json_new["style"] = [];
		$json_new["style"]["dash"] = $this->json_CS["style"]["dash"];
		$json_new["style"]["arrow"] = [];
		$json_new["style"]["arrow"]["start"] = $this->json_CS["style"]["arrow"]["start"];
		$json_new["style"]["arrow"]["end"] = $this->json_CS["style"]["arrow"]["end"];
		$json_new["style"]["marker"] = $this->json_CS["style"]["marker"];
		$json_new["style"]["handle"] = $this->json_CS["style"]["handle"]["visible"];
		$json_new["style"]["handleDash"] = $this->json_CS["style"]["handle"]["dash"];
		$json_new["style"]["color"] = CS_function::color_conversion($this->json_CS["style"]["color"],"new");
		$json_new["style"]["height"] = $this->json_CS["style"]["height"];
		
		
		return $json_new;
    }
    
    public function json_old() 
	{
        $json_old = [];
		
		$json_old["type"] = $this->json_CS["type"]["old"];
		
		$json_old["label"] = CS_function::json_conversion($this->json_CS["label"]["value"],"old");
		
		$json_old["labelSign"] = CS_function::direction_conversion($this->json_CS["label"]["direction"],"old");
		
		$json_old["color"] = CS_function::color_conversion($this->json_CS["style"]["color"],"old");
		
		$json_old["visible"] = $this->json_CS["style"]["visible"];
		
		$json_old["height"] = $this->json_CS["geometry"]["height"];
		
		$json_old["center"] = [];
		$json_old["center"][0] = $this->json_CS["geometry"]["center"]["x"];
		$json_old["center"][1] = $this->json_CS["geometry"]["center"]["y"];
		
		$json_old["pointStart"] = [];
		$json_old["pointStart"][0] = $this->json_CS["geometry"]["start"]["x"];
		$json_old["pointStart"][1] = $this->json_CS["geometry"]["start"]["y"];
		
		$json_old["angle"] = $this->json_CS["geometry"]["angle"]["value"];
		
		return $json_old;
    }
    
    public function json($flag = false, $version = "old") 
	{
        
		switch($version) 
		{
        
			case "new" : $json = $this->json_new();
            
			case "old" : $json = $this->json_old();
        }
        
        return $flag ? $json : json_encode($json, 256);
    }
    
    public function __toString() 
	{
        return "";
    }
}



/*
CS sinod
"category":	"Cartesian2D"
"type": "Point2D"

[
	"type" => [
		"CS" => ,
		"new" => ,
		"old" =>
	],
	"typeOld" => ,
	"geometry" => [
		"coordinates" => [
			"x" => ,
			"y" =>
		]
	],
	"style" => [
		"filled" => ,
		"color" => ,
		"visible" =>
	],
	"interaction" => [
		"movable" => ,
		"selectable" => ,
		"selected" => ,
		"removable" =>
	],
	"label" => [
		"value" => ,
		"direction" =>
	]
]


new sinod
"category": "Cartesian2D"
"type": "Point2D"

[
	"type" => "Point2D",
	"coord" => [
		"x" => ,
		"y" =>
	],
	"style" => [
		"fill" => ,
		"color" =>
	],
	"interaction" => [
		"movable" => ,
		"selectable" => ,
		"selected" => ,
		"removable" =>
	]
	
]


old sinod

"type": "Input:Point"
		"Point"
		"PointGeo2D"
		"Punctum"
[
	"type" => "Input:point" or "Point",
	"coord" => [ , ],
	"isFill" => ,
	"color" => ,
	"isVisible" => ,
	"label" => ,
	"labelSign" =>
]

[
	"type" => "PointGeo2D",
	"coord" => [ , ],
	"isFill" => ,
	"color" => ,
	"visible" => ,
	"label" => ,
	"labelSign" =>
]

[
	"type" => "Punctum",
	"coord" => [ , ],
	"isFill" => ,
	"color" => ,
	"selected" => 
]

*/
	
	
	
class CS_Point2D
{
	public $json_CS;
	
	public function __construct($json_CS)
	{
		$this->json_CS = $json_CS;
	}
    
    public function json_new() 
	{
        $json_new = [];
		
		$json_new["type"] = $this->json_CS["type"]["new"];
		
		$json_new["coord"] = [];
		$json_new["coord"]["x"] = $this->json_CS["geometry"]["coordinates"]["x"];
		$json_new["coord"]["y"] = $this->json_CS["geometry"]["coordinates"]["y"];
		
		$json_new["style"]["fill"] = $this->json_CS["style"]["filled"];
		$json_new["style"]["color"] = CS_function::color_conversion($this->json_CS["style"]["color"],"new");
		
		$json_new["interaction"] = [];
		$json_new["interaction"]["movable"] = $this->json_CS["interaction"]["movable"];
		$json_new["interaction"]["selectable"] = $this->json_CS["interaction"]["selectable"];
		$json_new["interaction"]["selected"] = $this->json_CS["interaction"]["selected"];
		$json_new["interaction"]["removable"] = $this->json_CS["interaction"]["removable"];
		
		
		return $json_new;
    }
    
    public function json_old() 
	{
        $json_old = [];
		
		$json_old["type"] = $this->json_CS["type"]["old"];
		
		switch ($this->json_CS["type"]["old"])
		{
			case "Input:Point":
			case "Point":
			{
				$json_old["coord"] = [];
				$json_old["coord"][0] = $this->json_CS["geometry"]["coordinates"]["x"];
				$json_old["coord"][1] = $this->json_CS["geometry"]["coordinates"]["y"];
				
				$json_old["isFill"] = $this->json_CS["style"]["filled"];
				
				$json_old["color"] = CS_function::color_conversion($this->json_CS["style"]["color"],"old");
				
				$json_old["isVisible"] = $this->json_CS["style"]["visible"];
				
				$json_old["label"] = CS_function::json_conversion($this->json_CS["label"]["value"],"old");
				
				$json_old["labelSign"] = CS_function::direction_conversion($this->json_CS["label"]["direction"]);
			}
			case "PointGeo2D":
			{
				$json_old["coord"] = [];
				$json_old["coord"][0] = $this->json_CS["geometry"]["coordinates"]["x"];
				$json_old["coord"][1] = $this->json_CS["geometry"]["coordinates"]["y"];
				
				$json_old["isFill"] = $this->json_CS["style"]["filled"];
				
				$json_old["color"] = CS_function::color_conversion($this->json_CS["style"]["color"],"old");
				
				$json_old["visible"] = $this->json_CS["style"]["visible"];
			}
			case "Punctum":
			{
				$json_old["coord"] = [];
				$json_old["coord"][0] = $this->json_CS["geometry"]["coordinates"]["x"];
				$json_old["coord"][1] = $this->json_CS["geometry"]["coordinates"]["y"];
				
				$json_old["isFill"] = $this->json_CS["style"]["filled"];
				
				$json_old["color"] = CS_function::color_conversion($this->json_CS["style"]["color"],"old");
				
				$json_old["selected"] = $this->json_CS["style"]["selected"];
			}
		}
		
		return $json_old;
    }
    
    public function json($flag = false, $version = "old") 
	{
        
		switch($version) 
		{
        
			case "new" : $json = $this->json_new();
            
			case "old" : $json = $this->json_old();
        }
        
        return $flag ? $json : json_encode($json, 256);
    }
    
    public function __toString() 
	{
        return "";
    }
}



/*
CS sinod
"category":	"Cartesian2D"
"type": "Region2D"

[
	"type" => [
		"CS" => ,
		"new" => ,
		"old" =>
	],
	"typeOld" => ,
	"geometry" => [
		"curves" => [],
		"fills => [[
			"<" => ,
			">" => 
		]]
	],
	"style" => [
		"color" => ,
	],
	"interaction" => [
		"selectable" =>
	]
]


new sinod
"category": "Cartesian2D"
"type": "Region2D"

[
	"type" => "Region2D",
	"curves" => [],
	"fill" => [[ , ]],
	"style" => [
		"color" => 
	]],
	"interaction" => [
		"selectable" => 
	]
	
]


old sinod

"type": "Input:Region"
		"Region"
	
[
	"type" => "Input:Region" or "Region",
	"eqn" => ,
	"datafill" => [ , ],
	"color" =>
]

*/
	
	
	
class CS_Region2D
{
	public $json_CS;
	
	public function __construct($json_CS)
	{
		$this->json_CS = $json_CS;
	}
    
    public function json_new() 
	{
        $json_new = [];
		
		$json_new["type"] = $this->json_CS["type"]["new"];
		
		$json_new["curves"] = [];
		foreach ($this->json_CS["geometry"]["curves"] as $json_object)
		{
			$json_new["curves"][] = CS_function::json_conversion($json_object,"new");
		}
		
		$json_new["fill"] = [];
		foreach ($this->json_CS["geometry"]["fills"] as $json_object)
		{
			$value = [];
			$value[0] = $json_object["<"];
			$value[1] = $json_object[">"];
			$json_new["fill"][] = $value;
		}
		
		$json_new["style"]["color"] = CS_function::color_conversion($this->json_CS["style"]["color"],"new");
		
		$json_new["interaction"]["interactive"] = $this->json_CS["interaction"]["selectable"];
		
		
		return $json_new;
    }
    
    public function json_old() 
	{
        $json_old = [];
		
		$json_old["type"] = $this->json_CS["type"]["old"];
		
		$json_old["eqn"] = [];
		foreach ($this->json_CS["geometry"]["curves"] as $json_object)
		{
			$json_old["eqn"][] = CS_function::json_conversion($json_object,"old");
		}
		
		$json_old["dataFill"] = [];
		foreach ($this->json_CS["geometry"]["fills"] as $json_object)
		{
			$value = [];
			$value[0] = $json_object["<"];
			$value[1] = $json_object[">"];
			
			$json_old["dataFill"][] = $value;
		}
		
		$json_old["color"] = CS_function::color_conversion($this->json_CS["stlye"]["color"],"old");
		
		return $json_old;
    }
    
    public function json($flag = false, $version = "old") 
	{
        
		switch($version) 
		{
        
			case "new" : $json = $this->json_new();
            
			case "old" : $json = $this->json_old();
        }
        
        return $flag ? $json : json_encode($json, 256);
    }
    
    public function __toString() 
	{
        return "";
    }
}




/*
CS sinod
"category":	"Cartesian2D"
"type": "Segment2D"

[
	"type" => [
		"CS" => ,
		"new" => ,
		"old" =>
	],
	"typeOld" => ,
	"geometry" => [
		"coordinates" => [
			"start" => [
				"x" => ,
				"y" =>
			],
			"end" => [
				"x" => ,
				"y" =>
			]
		]
	],
	"style" => [
		"color" => ,
		"dash" => ,
		"arrow" => [
			"start" => ,
			"end" =>
		],
		"marker" => [
			"right" => ,
			"center" => ,
			"left" =>
		]
	],
	"interaction" => [
		"interactive" => ,
		"selected" => ,
		"selectable" =>
	],
	"label" => [
		"value" => ,
		"direction" =>
	],
	"measure" => [
		"object" => ,
		"geometry" => [
			"height" =>
		],
		"style" => [
			"visible" => ,
			"color" => ,
			"marker" =>
		],
		"label" => [
			"value" => ,
			"direction" =>
		]
	]
]


new sinod
"category": "Cartesian2D"
"type": "Segment2D"

[
	"coordinates" => [
		"start" => [
			"x" => ,
			"y" =>
		],
		"end" => [
			"x" => ,
			"y" =>
		]
	],
	"style" => [
		"color" => ,
		"dash" => ,
		"arrow" => [
			"start" => ,
			"end" =>
		],
		"marker1" => ,
		"marker2" => ,
		"marker3" =>
	],
	"interaction" => [
		"interactive" => ,
		"selected" =>
	],
	"measure" =>
]
	
]


old sinod

"type": "LineSegGeo2D"
		"Segment"
	
[
	"type" => "LineSegGeo2D"
	"Source" => [
		"coord" => [ , ],
		"arrow" => 
	],
	"target" => [
		"coord" => [ , ],
		"arrow" =>
	],
	"color" => ,
	"dash" => 
	"tickLabel" => ,
	"selected" => ,
	"selectable" => ,
	"label" => ,
	"labelSign" => ,
	"measure" => [
		"height" => ,
		"visible" => ,
		"color" => ,
		"tickLabel" => ,
		"label" => ,
		"labelSign" =>
	]
	
	
]

[
	"type" => "Segment"
	"Source" => [
		"coord" => [ , ]
	],
	"target" => [
		"coord" => [ , ]
	],
	"color" => ,
	"dash" =>
	
]

*/
	
	
	
class CS_Segment2D
{
	public $json_CS;
	
	public function __construct($json_CS)
	{
		$this->json_CS = $json_CS;
	}
    
    public function json_new() 
	{
        $json_new = [];
		
		$json_new["type"] = $this->json_CS["type"]["new"];
		
		$json_new["coords"] = [];
		$json_new["coords"]["start"] = [];
		$json_new["coords"]["start"]["x"] = $this->json_CS["geometry"]["coordinates"]["start"]["x"];
		$json_new["coords"]["start"]["y"] = $this->json_CS["geometry"]["coordinates"]["start"]["y"];
		$json_new["coords"]["end"] = [];
		$json_new["coords"]["end"]["x"] = $this->json_CS["geometry"]["coordinates"]["end"]["x"];
		$json_new["coords"]["end"]["y"] = $this->json_CS["geometry"]["coordinates"]["end"]["y"];
		
		$json_new["style"]["color"] = $this->json_CS["style"]["color"];
		$json_new["style"]["dash"] = $this->json_CS["style"]["dash"];
		$json_new["style"]["arrow"] = [];
		$json_new["style"]["arrow"]["start"] = $this->json_CS["style"]["arrow"]["start"];
		$json_new["style"]["arrow"]["end"] = $this->json_CS["style"]["arrow"]["end"];
		$json_new["style"]["marker1"] = $this->json_CS["style"]["marker"]["right"];
		$json_new["style"]["marker2"] = $this->json_CS["style"]["marker"]["center"];
		$json_new["style"]["marker3"] = $this->json_CS["style"]["marker"]["left"];
		
		$json_new["interaction"] = [];
		$json_new["interaction"]["interactive"] = $this->json_CS["interaction"]["interactive"];
		$json_new["interaction"]["selected"] = $this->json_CS["interaction"]["selected"];
		
		$json_new["measure"] = CS_function::json_conversion($this->json_CS["measure"],"new");
		
		return $json_new;
    }
    
    public function json_old() 
	{
        $json_old = [];
		
		$json_old["type"] = $this->json_CS["type"]["old"];
		
		switch ($this->json_CS["type"]["old")
		{
			case "LineSegGeo2D":
			{
				$json_old["source"] = [];
				$json_old["source"]["arrow"] = $this->json_CS["style"]["arrow"]["start"];
				$json_old["source"]["coord"] = [];
				$json_old["source"]["coord"][0] = $this->json_CS["geometry"]["coordinates"]["start"]["x"];
				$json_old["source"]["coord"][1] = $this->json_CS["geometry"]["coordinates"]["start"]["y"];
				
				$json_old["target"] = [];
				$json_old["target"]["arrow"] = $this->json_CS["style"]["arrow"]["end"];
				$json_old["target"]["coord"] = [];
				$json_old["target"]["coord"][0] = $this->json_CS["geometry"]["coordinates"]["end"]["x"];
				$json_old["target"]["coord"][1] = $this->json_CS["geometry"]["coordinates"]["end"]["y"];
				
				$json_old["color"] = CS_function::color_conversion($this->json_CS["style"]["color"],"old");
				
				$json_old["dash"] = $this->json_CS["style"]["dash"];
				
				$json_old["tickLabel"] = $this->json_CS["style"]["marker"]["center"];
				
				$json_old["selected"] = $this->json_CS["interaction"]["selected"];
				
				$json_old["selectable"] = $this->json_CS["interaction"]["selectable"];
				
				$json_old["label"] = CS_function::json_conversion($this->json_CS["label"]["value"],"old");
				
				$json_old["labelSign"] = CS_function::direction_conversion($this->json_CS["label"]["direction"]);
				
				$json_old["measure"] = [];
				$json_old["measure"]["height"] = $this->json_CS["measure"]["geometry"]["height"];
				$json_old["measure"]["visible"] = $this->json_CS["measure"]["style"]["visible"];
				$json_old["measure"]["color"] = CS_function::color_conversion($this->json_CS["measure"]["style"]["color"],"old");
				$json_old["measure"]["tickLabel"] = $this->json_CS["measure"]["style"]["marker"];
				$json_old["measure"]["label"] = CS_function::json_conversion($this->json_CS["measure"]["label"]["value"],"old");
				$json_old["measure"]["labelSign"] = CS_function::direction_conversion($this->json_CS["measure"]["label"]["direction"]);
				
			}
			case "Segment":
			{
				$json_old["source"] = [];
				$json_old["source"]["arrow"] = $this->json_CS["style"]["arrow"]["start"];
				$json_old["source"]["coord"] = [];
				$json_old["source"]["coord"][0] = $this->json_CS["geometry"]["coordinates"]["start"]["x"];
				$json_old["source"]["coord"][1] = $this->json_CS["geometry"]["coordinates"]["start"]["y"];
				
				$json_old["target"] = [];
				$json_old["target"]["arrow"] = $this->json_CS["style"]["arrow"]["end"];
				$json_old["target"]["coord"] = [];
				$json_old["target"]["coord"][0] = $this->json_CS["geometry"]["coordinates"]["end"]["x"];
				$json_old["target"]["coord"][1] = $this->json_CS["geometry"]["coordinates"]["end"]["y"];
				
				$json_old["color"] = CS_function::color_conversion($this->json_CS["style"]["color"],"old");
				
				$json_old["dash"] = $this->json_CS["style"]["dash"];
				
				
			}
		}
		
		return $json_old;
    }
    
    public function json($flag = false, $version = "old") 
	{
        
		switch($version) 
		{
        
			case "new" : $json = $this->json_new();
            
			case "old" : $json = $this->json_old();
        }
        
        return $flag ? $json : json_encode($json, 256);
    }
    
    public function __toString() 
	{
        return "";
    }
}

/*
CS sinod
"category":	"Cartesian2D"
"type": "Path2D"

[
	"type" => [
		"CS" => ,
		"new" => ,
		"old" =>
	],
	"geometry" => [
		"coordinates" => [[
			"x" => ,
			"y" =>
		]]
	],
	"style" => [
		"color" => ,
		"cash" => ,
		"arrow" => [
			"start" => ,
			"end" => 
		]
	],
	"interaction" => [
		"interactive" => ,
		"selected" => 
	]
]


new sinod
"category": "Cartesian2D"
"type": "Path2D"

[
	"type" => "Path2D",
	"coordinates" => [[
		"x" => ,
		"y" =>
	],
	"style" => [
		"color" => ,
		"dash" => ,
		"arrow" => [
			"start" => ,
			"end" => 
		]
	],
	"interaction" => [
		"interactive" => ,
		"selected" => 
	]
	
]


old sinod



*/
	
	
	
class CS_Path2D
{
	public $json_CS;
	
	public function __construct($json_CS)
	{
		$this->json_CS = $json_CS;
	}
    
    public function json_new() 
	{
        $json_new = [];
		
		$json_new["type"] = $this->json_CS["type"]["new"];
		
		$json_new["coords"] = [];
		foreach ($this->json_CS["geometry"]["coordinates"] as $json_object)
		{
			$value = [];
			$value["x"] = $json_object["x"];
			$value["y"] = $json_object["y"];
			$json_new["coords"][] = $value;
		}
		
		$json_new["style"] = [];
		$json_new["style"]["color"] = CS_function::color_conversion($this->json_CS["style"]["color"],"new");
		$json_new["style"]["dash"] = $this->json_CS["style"]["dash"];
		$json_new["style"]["arrow"] = [];
		$json_new["style"]["arrow"]["start"] = $this->json_CS["style"]["arrow"]["start"];
		$json_new["style"]["arrow"]["end"] = $this->json_CS["style"]["arrow"]["end"];
		
		$json_new["interaction"] = [];
		$json_new["interaction"]["interactive"] = $this->json_CS["interaction"]["interactive"];
		$json_new["interaction"]["selected"] = $this->json_CS["interaction"]["selected"];
		
		
		
		return $json_new;
    }
    
    public function json_old() 
	{
        $json_old = [];
		
		
		
		return $json_old;
    }
    
    public function json($flag = false, $version = "old") 
	{
        
		switch($version) 
		{
        
			case "new" : $json = $this->json_new();
            
			case "old" : $json = $this->json_old();
        }
        
        return $flag ? $json : json_encode($json, 256);
    }
    
    public function __toString() 
	{
        return "";
    }
}




/*
CS sinod
"category":	"Cartesian3D"
"type": "Cartesian3D"

[
	"type" => [
		"CS" => ,
		"new" => ,
		"old" =>
	],
	"elements" => [
		"object" => ,
		"align" => 
	],
	"layout" => [
		"size" => ,
		"axis" => ,
		"rotation" => [
			"xy" => [
				"type" => ,
				"value" =>
			],
			"z" => [
				"type" => ,
				"value" =>
			]
		],
		"distance" => ,
		"prespective" => ,
		"ratio" => ,
		"position" => [
			"x" => ,
			"y" =>
		],
		"margin" => [
			"top" => ,
			"bottom" => ,
			"left" => ,
			"right" =>
		],
		"display" => 
	],
	"interaction" => [
		"zoom" => ,
		"pan" => ,
		"rotation" =>
	]
]


new sinod
"category": "Cartesian3D"
"type": "Cartesian3D"

[
	"type" => "Cartesian3D",
	"elements" => [],
	"elmAlign" => ,
	"size" => ,
	"axis" => ,
	"rotation" => [
		"xy" => ,
		"z" =>
	],
	"distance" => ,
	"perspective" => ,
	"ratio" => ,
	"position" => [
		"left" => ,
		"top" => 
	],
	"margin" => [
		"top" => ,
		"bottom" => ,
		"left" => ,
		"rigth" =>
	],
	"interaction" => [
		"zooming" => ,
		"panning" => ,
		"rotation" =>
	]
	
]


old sinod


"tyep": "Geometry3D"
[
	"type" => "Geometry3D",
	"object" => [],
	"size" => ,
	"axis" => ,
	"rot" => [ , ],
	"dist" => ,
	"perspective" =>
]


*/
	
	
	
class CS_Cartesian3D
{
	public $json_CS;
	
	public function __construct($json_CS)
	{
		$this->json_CS = $json_CS;
	}
    
    public function json_new() 
	{
        $json_new = [];
		
		$json_new["type"] = $this->json_CS["type"]["new"];
		
		$json_new["elements" = [];
		foreach ($this->json_CS["elements"]["object"] as $json_object)
		{
			$json_new["elements"][] = CS_function::json_conversion($json_object,"new");
			
		}
		
		$json_new["elmAlign"] = $this->json_CS["elements"]["align"];
		
		$json_new["size"] = $this->json_CS["layout"]["size"];
		
		$json_new["axis"] = $this->json_CS["layout"]["axis"];
		
		$json_new["rotation"] = [];
		$json_new["rotation"]["xy"] = $this->json_CS["layout"]["rotation"]["xy"]["value"];
		$json_new["rotation"]["z"] = $this->json_CS["layout"]["rotation"]["z"]["value"];
		
		$json_new["distance"] = $this->json_CS["layout"]["distance"];
		
		$json_new["perspective"] = $this->json_CS["layout"]["perspective"];
		
		$json_new["ratio"] = $this->json_CS["layout"]["ratio"];
		
		$json_new["position"] = [];
		$json_new["position"]["left"] = $this->json_CS["layout"]["position"]["x"];
		$json_new["position"]["top"] = $this->json_CS["layout"]["position"]["y"];
		
		$json_new["margin"] = [];
		$json_new["margin"]["top"] = $this->json_CS["layout"]["margin"]["top"];
		$json_new["margin"]["bottom"] = $this->json_CS["layout"]["margin"]["bottom"];
		$json_new["margin"]["left"] = $this->json_CS["layout"]["margin"]["left"];
		$json_new["margin"]["right"] = $this->json_CS["layout"]["margin"]["right"];
		
		$json_new["display"] = $this->json_CS["layout"]["display"];
		
		$json_new["interaction"] = [];
		$json_new["interaction"]["zooming"] = $this->json_CS["interaction"]["zoom"];
		$json_new["interaction"]["panning"] = $this->json_CS["interaction"]["pan"];
		$json_new["interaction"]["rotation"] = $this->json_CS["interaction"]["rotation"];
		
		
		return $json_new;
    }
    
    public function json_old() 
	{
        $json_old = [];
		
		$json_old["type"] = $this->json_CS["type"]["old"];
		
		$json_old["object"] = [];
		foreach ($ghis->json_CS["elements"]["object"] as $json_object)
		{
			$json_old["object"][] = CS_function::json_conversion($json_object,"old");
			
		}
		
		$json_old["size"] = $this->json_CS["layout"]["size"];
		
		$json_old["axis"] = $this->json_CS["layout"]["axis"];
		
		$json_old["rot"] = [];
		$json_old["rot"][0] = $this->json_CS["layout"]["rotation"]["xy"]["value"];
		$json_old["rot"][1] = $this->json_CS["layout"]["rotation"]["z"]["value"];
		
		$json_old["dist"] = $this->json_CS["layout"]["distance"];
		
		$json_old["perspective"] = $this->json_CS["layout"]["perspective"];
		
		
		
		return $json_old;
    }
    
    public function json($flag = false, $version = "old") 
	{
        
		switch($version) 
		{
        
			case "new" : $json = $this->json_new();
            
			case "old" : $json = $this->json_old();
        }
        
        return $flag ? $json : json_encode($json, 256);
    }
    
    public function __toString() 
	{
        return "";
    }
}






/*
CS sinod
"category":	"Cartesian3D"
"type": "Arc3D"

[
	"type" => [
		"CS" => ,
		"new" => ,
		"old" =>
	],
	"geometry" => [
		"segmentsNumber" => ,
		"angle" => [
			"type" => ,
			"value" =>
		],
		"coordinates" => [
			"center" => [
				"x" => ,
				"y" => ,
				"z" =>
			],
			"start" => [
				"x" => ,
				"y" => ,
				"z" =>
			],
			"normal" => [
				"x" => ,
				"y" => ,
				"z" => 
			]
		]
	],
	"style" => [
		"color" => ,
		"dash" => ,
		"visible" => ,
		"targetArrow" => ,
		"decoLayer" => ,
		"marker" =>
	],
	"interaction" => [
		"selectable" => ,
		"selected" => 
	],
	"label" => [
		"value" => ,
		"direction" =>
	]
]


new sinod
"category": "Cartesian3D"
"type": "Arc3D"

[
	"type" => "Arc3D",
	"segmentT" => ,
	"angle" => ,
	"center" => [
		"x" => ,
		"y" => ,
		"z" =>
	],
	"start" => [
		"x" => ,
		"y" => ,
		"z" =>
	],
	"style" => [
		"color" =>
	]
	
]


old sinod


"tyep": "ArcGeo3D"
[
	"type" => "ArcGeo3D",
	"angle" => ,
	"pointCenter" => [ , , ,],
	"pointStart" => [
		"coord" => [ , , ]
	],
	"normalVector" => [ , , ],
	"color" => ,
	"dash" => ,
	"visible" => ,
	"targetArrow" => ,
	"decoLayer" => ,
	"tickLabel" => ,
	"selectable" => ,
	"selected" => ,
	"label" => ,
	"labelSign" =>
]


*/
	
	
	
class CS_Arc3D
{
	public $json_CS;
	
	public function __construct($json_CS)
	{
		$this->json_CS = $json_CS;
	}
    
    public function json_new() 
	{
        $json_new = [];
		
		$json_new["type"] = $this->json_CS["type"]["new"];
		
		$json_new["segmentT"] = $this->json_CS["geometry"]["segmentsNumber"];
		
		$json_new["angle"] = $this->json_CS["geometry"]["angle"]["value"];
		
		$json_new["center"] = [];
		$json_new["center"]["x"] = $this->json_CS["geometry"]["coordinates"]["center"]["x"];
		$json_new["center"]["y"] = $this->json_CS["geometry"]["coordinates"]["center"]["y"];
		$json_new["center"]["z"] = $this->json_CS["geometry"]["coordinates"]["center"]["z"];
		
		$json_new["start"] = [];
		$json_new["start"]["x"] = $this->json_CS["geometry"]["coordinates"]["start"]["x"];
		$json_new["start"]["y"] = $this->json_CS["geometry"]["coordinates"]["start"]["y"];
		$json_new["start"]["z"] = $this->json_CS["geometry"]["coordinates"]["start"]["z"];
		
		$json_new["style"] = [];
		$json_new["style"]["color"] = CS_function::color_conversion($this->json_CS["style"]["color"],"new");
		
		
		
		return $json_new;
    }
    
    public function json_old() 
	{
        $json_old = [];
		
		$json_old["type"] = $this->json_CS["type"]["old"];
		
		$json_old["angle"] = $this->json_CS["geometry"]["angle"]["value"];
		
		$json_old["pointCenter"] = [];
		$json_old["pointCenter"][0] = $this->json_CS["geometry"]["coordinates"]["center"]["x"];
		$json_old["pointCenter"][1] = $this->json_CS["geometry"]["coordinates"]["center"]["y"];
		$json_old["pointCenter"][2] = $this->json_CS["geometry"]["coordinates"]["center"]["z"];
		
		$json_old["pointStart"] = [];
		$json_old["pointStart"][0] = $this->json_CS["geometry"]["coordinates"]["start"]["x"];
		$json_old["pointStart"][1] = $this->json_CS["geometry"]["coordinates"]["start"]["y"];
		$json_old["pointStart"][2] = $this->json_CS["geometry"]["coordinates"]["start"]["z"];
		
		$json_old["color"] = CS_function::color_conversion($this->json_CS["style"]["color"],"old");
		
		$json_old["dash"] = $this->json_CS["style"]["dash"];
		
		$json_old["visible"] = $this->json_CS["style"]["visible"];
		
		$json_old["targetArrow"] = $this->json_CS["style"]["targetArrow"];
		
		$json_old["decoLayer"] = $this->json_CS["style"]["decoLayer"];
		
		$json_old["tickLabel"] = $this->json_CS["style"]["marker"];
		
		$json_old["selectable"] = $this->json_CS["interaction"]["selectable"];
		
		$json_old["selected"] = $this->json_CS["interaction"]["selected"];
		
		$json_old["label"] = CS_function::json_conversion($this->json_CS["label"]["value"],"old");
		
		$json_old["labelSign"] = CS_function::direction_conversion($this->json_CS["label"]["direction"]);
		
		
		
		
		return $json_old;
    }
    
    public function json($flag = false, $version = "old") 
	{
        
		switch($version) 
		{
        
			case "new" : $json = $this->json_new();
            
			case "old" : $json = $this->json_old();
        }
        
        return $flag ? $json : json_encode($json, 256);
    }
    
    public function __toString() 
	{
        return "";
    }
}




/*
CS sinod
"category":	"Cartesian3D"
"type": "Label3D"

[
	"type" => [
		"CS" => ,
		"new" => ,
		"old" =>
	],
	"label" => ,
	"geometry" => [
		"coordinates" => [
			"x" => ,
			"y" => ,
			"z" =>
		]
	]
]


new sinod
"category": "Cartesian3D"
"type": "Label3D"

[
	"type" => "Label3D",
	"label" => ,
	"coordinates" => [
		"x" => ,
		"y" => ,
		"z" =>
	]
	
]


old sinod





*/
	
	
	
class CS_Label3D
{
	public $json_CS;
	
	public function __construct($json_CS)
	{
		$this->json_CS = $json_CS;
	}
    
    public function json_new() 
	{
        $json_new = [];
		
		$json_new["type"] = $this->json_CS["type"]["new"];
		
		$json_new["label"] = CS_function::json_conversion($this->json_CS["label"],"old");
		
		$json_new["coords"] = [];
		$json_new["coords"]["x"] = $this->json_CS["geometry"]["coordinates"]["x"];
		$json_new["coords"]["y"] = $this->json_CS["geometry"]["coordinates"]["y"];
		$json_new["coords"]["z"] = $this->json_CS["geometry"]["coordinates"]["z"];
		
		
		return $json_new;
    }
    
    public function json_old() 
	{
        $json_old = [];
		
		
		
		
		
		return $json_old;
    }
    
    public function json($flag = false, $version = "old") 
	{
        
		switch($version) 
		{
        
			case "new" : $json = $this->json_new();
            
			case "old" : $json = $this->json_old();
        }
        
        return $flag ? $json : json_encode($json, 256);
    }
    
    public function __toString() 
	{
        return "";
    }
}



/*
CS sinod
"category":	"Cartesian3D"
"type": "Point3D"

[
	"type" => [
		"CS" => ,
		"new" => ,
		"old" =>
	],
	"geometry" => [
		"coordinates" => [
			"x" => ,
			"y" => ,
			"z" =>
		]
	],
	"style" => [
		"color" => ,
		"decoLayer" => 
	],
	"interaction" => [
		"selectable" => ,
		"selected" =>
	],
	"label" => [
		"value" => ,
		"direction" => 
	]
]


new sinod
"category": "Cartesian3D"
"type": "Point3D"

[
	"type" => "Point3D,
	"coordinates" => [
		"x" => ,
		"y" => ,
		"z" =>
	],
	"style" => [
		"color" => 
	]
	
]


old sinod

"type": "PointGeo3D"

[
	"type" => "PointGeo3D",
	"coord" => [ , , ],
	"color" => ,
	"decoLayer" => ,
	"selectable" => ,
	"selected" => ,
	"label" => ,
	"labelSign" =>
]



*/
	
	
	
class CS_Point3D
{
	public $json_CS;
	
	public function __construct($json_CS)
	{
		$this->json_CS = $json_CS;
	}
    
    public function json_new() 
	{
        $json_new = [];
		
		$json_new["type"] = $this->json_CS["type"]["new"];
		
		$json_new["coords"] = [];
		$json_new["coords"]["x"] = $this->json_CS["geometry"]["coordinates"]["x"];
		$json_new["coords"]["y"] = $this->json_CS["geometry"]["coordinates"]["y"];
		$json_new["coords"]["z"] = $this->json_CS["geometry"]["coordinates"]["z"];
		
		$json_new["style"] = [];
		$json_new["style"]["color"] = CS_function::color_conversion($this->json_CS["style"]["color"],"new");
		
		
		return $json_new;
    }
    
    public function json_old() 
	{
        $json_old = [];
		
		$json_old["type"] = $this->json_CS["type"]["old"];
		
		$json_old["coord"] = [];
		$json_old["coord"][0] = $this->json_CS["geometry"]["coordinates"]["x"];
		$json_old["coord"][1] = $this->json_CS["geometry"]["coordinates"]["y"];
		$json_old["coord"][2] = $this->json_CS["geometry"]["coordinates"]["z"];
		
		$json_old["color"] = CS_function::color_conversion($this->json_CS["style"]["color"],"old");
		
		$json_old["decoLayer"] = $this->json_CS["style"]["decoLayer"];
		
		$json_old["selectable"] = $this->json_CS["interaction"]["selectable"];
		
		$json_old["selected"] = $this->json_CS["interaction"]["selected"];
		
		$json_old["label"] = CS_function::json_conversion($this->json_CS["label"]["value"],"old");
		
		$json_old["labelSign"] = CS_function::direction_conversion($this->json_CS["label"]["direction"]);
		
		
		
		return $json_old;
    }
    
    public function json($flag = false, $version = "old") 
	{
        
		switch($version) 
		{
        
			case "new" : $json = $this->json_new();
            
			case "old" : $json = $this->json_old();
        }
        
        return $flag ? $json : json_encode($json, 256);
    }
    
    public function __toString() 
	{
        return "";
    }
}







/*
CS sinod
"category":	"Cartesian3D"
"type": "Sphere3D"

[
	"type" => [
		"CS" => ,
		"new" => ,
		"old" =>
	],
	"object" => [
		"type" => 
	],
	"geometry" => [
		"center" => [
			"x" => ,
			"y" => ,
			"z" =>
		],
		"radius" =>
	],
	"style" => [
		"color" => ,
		"visible" =>
	],
	"interaction" => [
		"selectable" => ,
		"selected" =>
	]
]


new sinod
"category": "Cartesian3D"
"type": "SpinningSphere"

[
	"type" => "SpinningSphere"
	
]


old sinod

"type": "SphereGeo3D"

[
	"type" => "SphereGeo3D",
	"center" => [ , , ],
	"radius" => ,
	"color" => ,
	"visible" => ,
	"selectable" => ,
	"selected" =>
]



*/
	
	
	
class CS_Sphere3D
{
	public $json_CS;
	
	public function __construct($json_CS)
	{
		$this->json_CS = $json_CS;
	}
    
    public function json_new() 
	{
        $json_new = [];
		
		$json_new["type"] = $this->json_CS["type"]["new"];
		
		return $json_new;
    }
    
    public function json_old() 
	{
        $json_old = [];
		
		$json_old["type"] = $this->json_CS["type"]["old"];
		
		$json_old["center"] = [];
		$json_old["center"][0] = $this->json_CS["geometry"]["center"]["x"];
		$json_old["center"][1] = $this->json_CS["geometry"]["center"]["y"];
		$json_old["center"][2] = $this->json_CS["geometry"]["center"]["z"];
		
		$json_old["radius"] = $this->json_CS["geometry"]["radius"];
		
		$json_old["color"] = CS_function::color_conversion($this->json_CS["style"]["color"],"old");
		
		$json_old["visible"] = $this->json_CS["style"]["visible"];
		
		$json_old["selectable"] = $this->json_CS["interaction"]["selectable"];
		
		$json_old["selected"] = $this->json_CS["interaction"]["selected"];
		
		return $json_old;
    }
    
    public function json($flag = false, $version = "old") 
	{
        
		switch($version) 
		{
        
			case "new" : $json = $this->json_new();
            
			case "old" : $json = $this->json_old();
        }
        
        return $flag ? $json : json_encode($json, 256);
    }
    
    public function __toString() 
	{
        return "";
    }
}



/*
CS sinod
"category":	"Cartesian3D"
"type": "Revolve3D"

[
	"type" => [
		"CS" => ,
		"new" => ,
		"old" =>
	],
	"geometry" => [
		"coordinates" => [[
			"x" => ,
			"y" => ,
			"z"
		]]
	],
	"style" => [
		"color" => ,
		"visible" =>
	],
	"axis" => [
		"label" => [
			"x" => ,
			"y" => ,
			"z" =>
		]
	],
	"interaction" => [
		"selectable" => ,
		"selected" => 
	]
]


new sinod
"category": "Cartesian3D"
"type": "SpinningTeapot"

[
	"type" => "SpinningTeapot"
	
]


old sinod

"type": "RevolveGeo3D"

[
	"type" => "RevolveGeo3D",
	"coordinates" => [ , , ],
	"color" => ,
	"visible" => ,
	"axis" => [ , , ],
	"selectable" => ,
	"selected" => 
]



*/
	
	
	
class CS_Revolve3D
{
	public $json_CS;
	
	public function __construct($json_CS)
	{
		$this->json_CS = $json_CS;
	}
    
    public function json_new() 
	{
        $json_new = [];
		
		$json_new["type"] = $this->json_CS["type"]["new"];
		
		return $json_new;
    }
    
    public function json_old() 
	{
        $json_old = [];
		
		$json_old["type"] = $this->json_CS["type"]["old"];
		
		$json_old["coords"] = [];
		foreach $($this->json_CS["geometry"]["coordinates"] as $json_object)
		{
			$value = [];
			$value[0] = $json_object["x"];
			$value[1] = $json_object["y"];
			$value[2] = $json_object["z"];
			
			$json_old["coords"][] = $value;
		}
		
		$json_old["color"] = CS_function::color_conversion($this->json_CS["style"]["color"],"old");
		
		$json_old["visible"] = $this->json_CS["style"]["visible"];
		
		$json_old["axis"] = [];
		$json_old["axis"][0] = $this->json_CS["axis"]["label"]["x"];
		$json_old["axis"][1] = $this->json_CS["axis"]["label"]["y"];
		$json_old["axis"][2] = $this->json_CS["axis"]["label"]["z"];
		
		$json_old["selectable"] = $this->json_CS["interaction"]["selectable"];
		$json_old["selected"] = $this->json_CS["interaction"]["selected"];
		
		return $json_old;
    }
    
    public function json($flag = false, $version = "old") 
	{
        
		switch($version) 
		{
        
			case "new" : $json = $this->json_new();
            
			case "old" : $json = $this->json_old();
        }
        
        return $flag ? $json : json_encode($json, 256);
    }
    
    public function __toString() 
	{
        return "";
    }
}


/*
CS sinod
"category":	"Cartesian3D"
"type": "Path3D"

[
	"type" => [
		"CS" => ,
		"new" => ,
		"old" =>
	],
	"geometry" => [
		"coordinates" => [[
			"x" => ,
			"y" => ,
			"z" =>
		]]
	],
	"style" => [
		"color" => 
	]

]


new sinod
"category": "Cartesian3D"
"type": "Path3D"

[
	"type" => "Path3D",
	"coordinates" => [[
		"x" => ,
		"y" => ,
		"z" =>
	]],
	"style" => [
		"color" =>
	]
		
	
]


old sinod





*/
	
	
	
class CS_Revolve3D
{
	public $json_CS;
	
	public function __construct($json_CS)
	{
		$this->json_CS = $json_CS;
	}
    
    public function json_new() 
	{
        $json_new = [];
		
		$json_new["type"] = $this->json_CS["type"]["new"];
		
		$json_new["coords"] = [];
		foreach ($this->json_CS["geometry"]["coordinates"] as $json_object)
		{
			$value = [];
			$value["x"] = $json_object["x"];
			$value["y"] = $json_object["y"];
			$value["z"] = $json_object["z"];
			
			$json_new["coords"][] = $value;
		}
		
		$json_new["style"] = [];
		$json_new["style"]["color"] = CS_function::color_conversion($this->json_CS["style"]["color"],"new");
		
		return $json_new;
    }
    
    public function json_old() 
	{
        $json_old = [];
		
		
		
		return $json_old;
    }
    
    public function json($flag = false, $version = "old") 
	{
        
		switch($version) 
		{
        
			case "new" : $json = $this->json_new();
            
			case "old" : $json = $this->json_old();
        }
        
        return $flag ? $json : json_encode($json, 256);
    }
    
    public function __toString() 
	{
        return "";
    }
}



/*
CS sinod
"category":	"Cartesian3D"
"type": "PolyhedronRegular3D"

[
	"type" => [
		"CS" => ,
		"new" => ,
		"old" =>
	],
	"geometry" => [
		"faces" => [],
		"type" =>
	],
	"layout" => [
		"skeleton" => ,
		"size" => [
			"x" => ,
			"y" => ,
			"z" =>
		],
		"rotation" => [
			"yaw" => [
				"type" => ,
				"value" => 
			],
			"pitch" => [
				"type" => ,
				"value" =>
			]
		],
		"distance" =>
	]
]


new sinod
"category": "Cartesian3D"
"type": "Polyhedron3D"

[
	"type" => "Polyhedron3D",
	"faceNo" => [],
	"faceCount" => ,
	"wire" => ,
	"xSize" => ,
	"ySize" => ,
	"zSize" => ,
	"yaw" => ,
	"pitch" => ,
	"zoom" =>
	
]


old sinod





*/
	
	
	
class CS_Revolve3D
{
	public $json_CS;
	
	public function __construct($json_CS)
	{
		$this->json_CS = $json_CS;
	}
    
    public function json_new() 
	{
        $json_new = [];
		
		$json_new["type"] = $this->json_CS["type"]["new"];
		
		$json_new["faceNo"] = $this->json_CS["geometry"]["faces"];
		
		switch ($this->json_CS["geometry"] as $json_object)
		{
			case "tetrahedron": $json_new["faceCount"] = "4";
			case "hexahedron": $json_new["faceCount"] = "6";
			case "octahedron": $json_new["faceCount"] = "8";
			case "dodecahedron": $json_new["faceCount"] = "12";
			case "Icosahedron": $json_new["faceCount"] = "20";
		}
		
		$json_new["wire"] = $this->json_CS["layout"]["skeleton"];
		
		$json_new["xSize"] = $this->json_CS["layout"]["size"]["x"];
		
		$json_new["ySize"] = $this->json_CS["layout"]["size"]["y"];
		
		$json_new["zSize"] = $this->json_CS["layout"]["size"]["z"];
		
		$json_new["yaw"] = $this->json_CS["layout"]["rotation"]["yaw"]["value"];
		
		$json_new["pitch"] = $this->json_CS["layout"]["rotation"]["pitch"]["value"];
		
		$json_new["zoom"] = $this->json_CS["layout"]["distance"];
		
		return $json_new;
    }
    
    public function json_old() 
	{
        $json_old = [];
		
		
		
		return $json_old;
    }
    
    public function json($flag = false, $version = "old") 
	{
        
		switch($version) 
		{
        
			case "new" : $json = $this->json_new();
            
			case "old" : $json = $this->json_old();
        }
        
        return $flag ? $json : json_encode($json, 256);
    }
    
    public function __toString() 
	{
        return "";
    }
}







/*
CS sinod
"category":	"Cartesian3D"
"type": "Face3D"

[
	"type" => "Face3D",
	"geometry" => [
		"coordinates" => [[
			"x" => ,
			"y" =>
		]],
		"holes" => [[[
			"x" => ,
			"y" =>
		]]]
	]
	
]


new sinod



old sinod

"type": "FaceGeo3D"

[
	"type" => "FaceGeo3D",
	"coordinates" => [[
	]],
	"holes" => [[[
	]]]
]


*/
	
	
	
class CS_Face3D
{
	public $json_CS;
	
	public function __construct($json_CS)
	{
		$this->json_CS = $json_CS;
	}
    
    public function json_new() 
	{
        $json_new = [];
		
		
		
		return $json_new;
    }
    
    public function json_old() 
	{
        $json_old = [];
		
		$json_old["type"] = $this->json_CS["type"]["old"];
		
		$json_old["coords"] = [];
		foreach ($this->json_CS["geometry"]["coordinates"] as $json_object)
		{
			$value = [];
			$value[0] = $json_object["x"];
			$value[1] = $json_object["y"];
			$json_old["coords"][] = $value;
		}
		
		$json_old["holes"] = [];
		foreach ($this->json_CS["geometry"]["holes"] as $json_object_1)
		{
			$value_1 = [];
			foreach ($json_object_1 as $json_object_2)
			{
				$value_2 = [];
				$value_2[0] = $json_object_2["x"];
				$value_2[1] = $json_object_2["y"];
				$value_1[] = $value_2;
			}
			$json_old["holes"][] = $value_1;
		}
		
		return $json_old;
    }
    
    public function json($flag = false, $version = "old") 
	{
        
		switch($version) 
		{
        
			case "new" : $json = $this->json_new();
            
			case "old" : $json = $this->json_old();
        }
        
        return $flag ? $json : json_encode($json, 256);
    }
    
    public function __toString() 
	{
        return "";
    }
}




/*
CS sinod
"category":	"Cartesian3D"
"type": "Angle3D"

[
	"type" => [
		"CS" => ,
		"new" => ,
		"old" =>
	],
	"geometry" => [
		"coordinates" => [
			"center" => [
				"x" => ,
				"y" => ,
				"z" =>
			],
			"start" => [
				"x" => ,
				"y" => ,
				"z" =>
			],
			"end" => [
				"x" => ,
				"y" => ,
				"z" =>
			]
		],
		"height" =>
	],
	"style" => [
		"color" => ,
		"filled" => ,
		"visible" => ,
		"decoLayer" => ,
		"marker" =>
	],
	"interaction" => [
		"selectable" => ,
		"selected" =>
	],
	"label" => [
		"value" => ,
		"direction" =>
	]
	
]


new sinod



old sinod

"type": "AngleGeo3D"

[
	"type" => "AngleGeo3D",
	"vertex" => [ , , ],
	"source" => [ , , ],
	"target" => [ , , ],
	"height" => ,
	"color" => ,
	"isFill" => ,
	"decoLayer" => ,
	"tickLabel" => ,
	"selectable" => ,
	"selected" => ,
	"label" => ,
	"labelSign" =>
]


*/
	
	
	
class CS_Angle3D
{
	public $json_CS;
	
	public function __construct($json_CS)
	{
		$this->json_CS = $json_CS;
	}
    
    public function json_new() 
	{
        $json_new = [];
		
		
		
		return $json_new;
    }
    
    public function json_old() 
	{
        $json_old = [];
		
		$json_old["type"] = $this->json_CS["type"]["old"];
		
		$json_old["vertex"] = [];
		$json_old["vertex"][0] = $this->json_CS["geometry"]["coordinates"]["center"]["x"];
		$json_old["vertex"][1] = $this->json_CS["geometry"]["coordinates"]["center"]["y"];
		$json_old["vertex"][2] = $this->json_CS["geometry"]["coordinates"]["center"]["z"];
		
		$json_old["source"] = [];
		$json_old["source"][0] = $this->json_CS["geometry"]["coordinates"]["start"]["x"];
		$json_old["source"][1] = $this->json_CS["geometry"]["coordinates"]["start"]["y"];
		$json_old["source"][2] = $this->json_CS["geometry"]["coordinates"]["start"]["z"];
		
		$json_old["target"] = [];
		$json_old["target"][0] = $this->json_CS["geometry"]["coordinates"]["end"]["x"];
		$json_old["target"][1] = $this->json_CS["geometry"]["coordinates"]["end"]["y"];
		$json_old["target"][2] = $this->json_CS["geometry"]["coordinates"]["end"]["z"];
		
		$json_old["height"] = $this->json_CS["geometry"]["height"];
		
		$json_old["color"] = CS_function::color_conversion($this->json_CS["style"]["color"],"old");
		
		$json_old["isFill"] = $this->json_CS["style"]["filled"];
		
		$json_old["visible"] = $this->json_CS["style"]["visible"];
		
		$json_old["decoLayer"] = $this->json_CS["style"]["decoLayer"];
		
		$json_old["tickLabel"] = $this->json_CS["style"]["marker"];
		
		$json_old["selectable"] = $this->json_CS["interaction"]["selectable"];
		
		$json_old["selected"] = $this->json_CS["interaction"]["selected"];
		
		$json_old["label"] = CS_function::json_conversion($this->json_CS["label"]["value"],"old");
		
		$json_old["labelSign"] = CS_function::direction_conversion($this->json_CS["label"]["direction"]);
		
		
		
		
		return $json_old;
    }
    
    public function json($flag = false, $version = "old") 
	{
        
		switch($version) 
		{
        
			case "new" : $json = $this->json_new();
            
			case "old" : $json = $this->json_old();
        }
        
        return $flag ? $json : json_encode($json, 256);
    }
    
    public function __toString() 
	{
        return "";
    }
}



/*
CS sinod
"category":	"Cartesian3D"
"type": "Equation3D"

[
	"type" => [
		"CS" => ,
		"new" => ,
		"old" =>
	],
	"layout" => [
		"bounds" => [
			"x" => [
				"min" => ,
				"max" =>
			],
			"y" => [
				"min" => ,
				"max" =>
			]
		]
	],
	"style" => [
		"color" => 
	]
	
]


new sinod



old sinod

"type": "Equation3D"

[
	"type" => "Equation3D",
	"eq" => ,
	"xBounds" => [ , ],
	"yBounds" => [ , ],
	"color" =>
]


*/
	
	
	
class CS_Angle3D
{
	public $json_CS;
	
	public function __construct($json_CS)
	{
		$this->json_CS = $json_CS;
	}
    
    public function json_new() 
	{
        $json_new = [];
		
		
		
		
		return $json_new;
    }
    
    public function json_old() 
	{
        $json_old = [];
		
		$json_old["type"] = $this->json_CS["type"]["old"];
		
		$json_old["eq"] = $this->json_CS["equation"];
		
		$json_old["xBounds"] = [];
		$json_old["xBounds"][0] = $this->json_CS["layout"]["bounds"]["x"]["min"];
		$json_old["xBounds"][1] = $this->json_CS["layout"]["bounds"]["x"]["max"];
		
		$json_old["yBounds"] = [];
		$json_old["yBounds"][0] = $this->json_CS["layout"]["bounds"]["y"]["min"];
		$json_old["yBounds"][1] = $this->json_CS["layout"]["bounds"]["y"]["max"];
		
		$json_old["color"] = $this->json_CS["style"]["color"];
		
		return $json_old;
    }
    
    public function json($flag = false, $version = "old") 
	{
        
		switch($version) 
		{
        
			case "new" : $json = $this->json_new();
            
			case "old" : $json = $this->json_old();
        }
        
        return $flag ? $json : json_encode($json, 256);
    }
    
    public function __toString() 
	{
        return "";
    }
}



/*
CS sinod
"category":	"Chart"
"type": "Chart"

[
	"type" => [
		"CS" => ,
		"new" => ,
		"old" =>
	],
	"typeOld" => ,
	"elements" => [],
	"layout" => [
		"size" => ,
		"bounds" => [
			"x" => ,
			"y" =>
		],
		"ratio" => 
		"fixedWidth" => ,
		"position" => [
			"x" => ,
			"y" => 
		],
		"margin" => [
			"top" => ,
			"bottom" => ,
			"left" => ,
			"right" =>
		],
		"display" =>
	],
	"axis" => [
		"break" => [
			"x" => ,
			"y" =>
		],
		"label" => [
			"x" => ,
			"y" =>
		]
	],
	"grid" =>
	
]


new sinod

"category": "Chart"
"type": "Chart"

[
	"elements" => [],
	"size" => ,
	"bounds" => [
		"x" => ,
		"y" =>
	],
	"ratio" => ,
	"fixedWidth" => ,
	"position" => [
		"left" => ,
		"top" => 
	],
	"margin" => [
		"top" => ,
		"bottom" => ,
		"left" => ,
		"right" =>
	],
	"display" => ,
	"xBreakCoord" => ,
	"yBreakCoord" => ,
	"xLabel" => ,
	"yLabel" => ,
	"grid" =>
]




old sinod

"type": "Statistics2D" or "BreakStats2D" or "XTitleStats2D" or "YTitleStats2D"

[
	"type" => "Statistics2D",
	"objects" => [],
	"size" => ,
	"bounds" => [ , ]
]

[
	"type" => "BreakStats2D",
	"axis" => "x" or "y"
	"location" =>
	
]

[
	"type" => "XTitleStats2D",
	"value" => 
]

[
	"type" => "YTitleStats2D",
	"value" =>

*/
	
	
	
class CS_Chart
{
	public $json_CS;
	
	public function __construct($json_CS)
	{
		$this->json_CS = $json_CS;
	}
    
    public function json_new() 
	{
        $json_new = [];
		
		$json_new["type"] = $this->json_CS["type"]["new"];
		
		$json_new["elements"] = [];
		foreach ($this->json_CS["elements"] as $json_object)
		{
			$json_new["elements"][] = CS_function:json_conversion($json_object,"new");
		}
		
		$json_new["size"] = $this->json_CS["layout"]["size"];
		
		$json_new["bounds"] = [];
		$json_new["bounds"]["x"] = $this->json_CS["layout"]["bounds"]["x"];
		$json_new["bounds"]["y"] = $this->json_CS["layout"]["bounds"]["y"];
		
		$json_new["ratio"] = $this->json_CS["layout"]["ratio"];
		
		$json_new["fixedWidth"] = $this->json_CS["layout"]["fixedWidth"];
		
		$json_new["position"] = [];
		$json_new["position"]["left"] = $this->json_CS["position"]["x"];
		$json_new["position"]["right"] = $this->json_CS["position"]["y"];
		
		$json_new["margin"] = [];
		$json_new["margin"]["top"] = $this->json_CS["margin"]["top"];
		$json_new["margin"]["bottom"] = $this->json_CS["margin"]["bottom"];
		$json_new["margin"]["left"] = $this->json_CS["marign"]["left"];
		$json_new["margin"]["right"] = $this->json_CS["margin"]["right"];
		
		$json_new["display"] = $this->json_CS["layout"]["display"];
		
		$json_new["xBreakCoord"] = $this->json_CS["axis"]["break"]["x"];
		
		$json_new["yBreakCoord"] = $this->json_CS["axis"]["break"]["y"];
		
		$json_new["xLabel"] = CS_function::json_conversion($this->json_CS["axis"]["label"]["x"],"new");
		
		$json_new["yLabel"] = CS_function::json_conversion($this->json_CS["axis"]["label"]["y"],"new");
		
		$json_new["grid"] = CS_function::json_conversion($this->json_CS["grid"],"new");
		
		return $json_new;
    }
    
    public function json_old() 
	{
        $json_old = [];
		
		$json_old["type"] = $this->json_CS["type"]["old"];
		
		switch ($this->json_CS["typed"]["old"])
		{
			case "Statistics2D":
			{
				$json_old["objects"] = [];
				foreach ($this->json_CS["elements"] as $json_object)
				{
					$json_old["objects"][] = CS_function::json_conversion($json_object,"old");
				}
				
				$json_old["size"] = $this->json_CS["layout"]["size"];
				
				$json_old["bounds"] = [];
				$json_old["bounds"][0] = $this->json_CS["bounds"]["x"];
				$json_old["bounds"][1] = $this->json_CS["bounds"]["y"];
			}
			case "BreakStats2D":
			{
				if ($this->json_CS["axis"]["break"]["x"])
				{
					$json_old["axis"] = "x";
					$json_old["location"] = $this->json_CS["break"]["x"];
				}
				else if ($this->json_CS["axis"]["break"]["y"])
				{
					$json_old["axis"] = "y";
					$json_old["location"] = $this->json_CS["break"]["y"];
				}
			}
			case "XTitleStats2D":
			{
				$json_old["value"] = CS_function::json_conversion($this->json_CS["axis"]["label"]["x"],"old");
			}
			case "YTitleStats2D":
			{
				$json_old["value"] = CS_function::json_conversion($this->json_CS["axis"]["label"]["y"],"old");
			}
		}
		
		return $json_old;
    }
    
    public function json($flag = false, $version = "old") 
	{
        
		switch($version) 
		{
        
			case "new" : $json = $this->json_new();
            
			case "old" : $json = $this->json_old();
        }
        
        return $flag ? $json : json_encode($json, 256);
    }
    
    public function __toString() 
	{
        return "";
    }
}






/*
CS sinod
"category":	"Chart"
"type": "ChartGrid"

[
	"type" => [
		"CS" => ,
		"new" => ,
		"old" =>
	],
	"typeOld" => ,
	"label" => [
		"free" => [
			"x" => [
				"middle" => ,
				"visible" => ,
				"value" =>[[
					"position" => ,
					"label" =>
				]]
			],
			"y" => [[
				"position" => ,
				"label" => 
			]],
		"regular" => [
			"x" => [
				"initial" => ,
				"increment" =>
			],
			"y" => [
				"initial" => ,
				"increment" =>
			],
			"origin" =>
		]
		
	],
	"line" => [
		"free" => [
			"x" => [],
			"y" => []
		],
		"regular" => [
			"x" => [
				"thin" => [
					"initial" => ,
					"increment" =>
				],
				"thick" => [
					"initial" => ,
					"increment" =>
				]
			],
			"y" => [
				"thin" => [
					"initial" => ,
					"increment" =>
				],
				"thick" => [
					"initial" => ,
					"increment" =>
				]
			]
		]
	],
	"style" => [
		"color" => [
			"line" => [
				"thick" => ,
				"thin" => 
			],
			"label" =>
		]
	]
			
]


new sinod

"category": "Chart"
"type": "GridChart"

[
	"type" => "GridChart",
	"label" => [
		"showMiddle" => ,
		"useLabelX" => ,
		"labelX" = [];,
		"init" => [
			"x" => ,
			"y" =>
		],
		"unit" => [
			"x" => ,
			"y" =>
		],
		"showZero" => ,
		"color" =>
	],
	"normal" => [
		"init" => [
			"x" => ,
			"y" => ,
			"color" =>
		],
		"unit" => [
			"x" => ,
			"y" => ,
			"color" =>
		]
	]
]




old sinod

"type": "GridLabel2D" or "GridStats2D"

[
	"type" => "GridLabel2D",
	"value" => [[[],[]],[[],[]]]
]

[
	"type" => "GridStats2D",
	"value" => [[],[]]
]

*/
	
	
	
class CS_ChartGrid
{
	public $json_CS;
	
	public function __construct($json_CS)
	{
		$this->json_CS = $json_CS;
	}
    
    public function json_new() 
	{
        $json_new = [];
		
		$json_new["type"] = $this->json_CS["type"]["new"];
		
		$json_new["label"] = [];
		$json_new["label"]["showMiddle"] = $this->json_CS["label"]["free"]["x"]["middle"];
		$json_new["label"]["useLabelX"] = $this->json_CS["label"]["free"]["x"]["visible"];
		$json_new["label"]["labelX"] = [];
		foreach ($this->json_CS["free"]["x"] as $json_object)
		{
			$json_new["label"]["labelX"][] = $json_object["label"]["content"];
		}
		$json_new["label"]["init"] = [];
		$json_new["label"]["init"]["x"] = $this->json_CS["label"]["regular"]["x"]["initial"];
		$json_new["label"]["init"]["y"] = $this->json_CS["label"]["regular"]["y"]["initial"];
		$json_new["label"]["unit"] = [];
		$json_new["label"]["unit"]["x"] = $this->json_CS["label"]["regular"]["x"]["increment"];
		$json_new["label"]["unit"]["y"] = $this->json_CS["label"]["regular"]["y"]["increment"];
		$json_new["label"]["showZero"] = $this->json_CS["label"]["regular"]["origin"];
		$json_new["label"]["color"] = $this->json_CS["style"]["color"]["label"];
		
		$json_new["normal"] = [];
		$json_new["normal"]["init"] = [];
		$json_new["normal"]["init"]["x"] = $this->json_CS["line"]["regular"]["x"]["thin"]["initial"];
		$json_new["normal"]["init"]["y"] = $this->json_CS["line"]["regular"]["y"]["thin"]["initial"];
		$json_new["normal"]["unit"] = [];
		$json_new["normal"]["unit"]["x"] = $this->json_CS["line"]["regular"]["x"]["thin"]["increment"];
		$json_new["normal"]["unit"]["y"] = $this->json_CS["line"]["regular"]["y"]["thin"]["increment"];
		$json_new["normal"]["color"] = $this->json_CS["style"]["color"]["line"]["thin"];
		
		$json_new["strong"] = [];
		$json_new["strong"]["init"] = [];
		$json_new["strong"]["init"]["x"] = $this->json_CS["line"]["regular"]["x"]["thick"]["initial"];
		$json_new["strong"]["init"]["y"] = $this->json_CS["line"]["regular"]["y"]["thick"]["initial"];
		$json_new["strong"]["unit"] = [];
		$json_new["strong"]["unit"]["x"] = $this->json_CS["line"]["regular"]["x"]["thick"]["increment"];
		$json_new["strong"]["unit"]["y"] = $this->json_CS["line"]["regular"]["y"]["thick"]["increment"];
		$json_new["strong"]["color"] = $this->json_CS["style"]["color"]["line"]["thick"];
		
		
		
		return $json_new;
    }
    
    public function json_old() 
	{
        $json_old = [];
		
		$json_old["type"] = $this->json_CS["type"]["old"];
		switch ($this->json_CS["type"]["old"])
		{
			case "GridLabel2D":
			{
				$json_old["value"] = [[],[]];
				foreach ($this->json_CS["label"]["free"]["x"]["value"] as $json_object)
				{
					$value = [];
					$value[0] = $json_object["position"];
					$value[1] = CS_function::json_conversion($json_object["label"],"old");
					$json_old["value"][0][] = $value;
				}
				foreach ($this->json_CS["label"]["free"]["y"]["value"] as $json_object)
				{
					$value = [];
					$value[0] = $json_object["position"];
					$value[1] = CS_function::json_conversion($json_object["label"],"old");
					$json_old["value"][1][] = $value;
				}
			}
			case "GridStsts2D":
			{
				$json_old["value"] = [];
				$json_old["value"][0] = $this->json_CS["line"]["free"]["x"];
				$json_old["value"][1] = $this->json_CS["line"]["free"]["y"];
			}
		}
		
		return $json_old;
    }
    
    public function json($flag = false, $version = "old") 
	{
        
		switch($version) 
		{
        
			case "new" : $json = $this->json_new();
            
			case "old" : $json = $this->json_old();
        }
        
        return $flag ? $json : json_encode($json, 256);
    }
    
    public function __toString() 
	{
        return "";
    }
}




/*
CS sinod
"category":	"Chart"
"type": "ChartBar"

[
	"type" => [
		"CS" => ,
		"new" => ,
		"old" =>
	],
	"typeOld" => ,
	"interaction" => [
		"selectable" => ,
		"movable" =>
	],
	"data" => [],
	"style" => [
		"color" => [
			"fill" => 
			"stroke" =>
		],
		"histogram" =>
	]
			
]


new sinod

"category": "Chart"
"type": "BarChart"

[
	"type" => "BarChart",
	"interaction" => [
		"selectable" => ,
		"movable" =>
	],
	"data" => [],
	"style" => [
		"color" => ,
		"histogram" =>
	]
]




old sinod

"type": "BarChsrtStats2D" or "Input:HistogramStats2D" or "HistogramStats2D"

[
	"type" => "BarChsrtStats2D" or "Input:HistogramStats2D" or "HistogramStats2D",
	"dataset" => [],
	"fillColor" => ,
	"strokeColor" =>
]

*/
	
	
	
class CS_ChartBar
{
	public $json_CS;
	
	public function __construct($json_CS)
	{
		$this->json_CS = $json_CS;
	}
    
    public function json_new() 
	{
        $json_new = [];
		
		$json_new["type"] = $this->json_CS["type"]["new"];
		
		$json_new["interaction"] = [];
		$json_new["interaction"]["selectable"] = $this->json_CS["interaction"]["selectable"];
		$json_new["interaction"]["movable"] = $this->json_CS["interaction"]["movable"];
		
		$json_new["data"] = [];
		foreach ($this->json_CS["data"] as $json_object)
		{
			$value = [];
			$value["coord"] = $json_object;
			$json_new["data"][] = $value;
		}
		
		$json_new["style"] = [];
		$json_new["style"]["color"] = CS_function::color_conversion($this->json_CS["style"]["color"]["stroke"],"new");
		$json_new["style"]["showAsHistogram"] = $this->json_CS["style"]["histogram"];
		
		
		return $json_new;
    }
    
    public function json_old() 
	{
        $json_old = [];
		
		$json_old["type"] = $this->json_CS["type"]["old"];
		
		$json_old["dataset"] = $this->json_CS["data"];
		
		$json_old["fillColor"] = CS_function::color_conversion($this->json_CS["style"]["color"]["fill"],"old");
		
		$json_old["strokeColor"] = CS_function::color_conversion($this->json_CS["style"]["color"]["stroke"],"old");
		
		
		
		return $json_old;
    }
    
    public function json($flag = false, $version = "old") 
	{
        
		switch($version) 
		{
        
			case "new" : $json = $this->json_new();
            
			case "old" : $json = $this->json_old();
        }
        
        return $flag ? $json : json_encode($json, 256);
    }
    
    public function __toString() 
	{
        return "";
    }
}




/*
CS sinod
"category":	"Chart"
"type": "ChartLine"

[
	"type" => [
		"CS" => ,
		"new" => ,
		"old" =>
	],
	"typeOld" => ,
	"data" => [],
	"style" => [
		"color" => ,
		"middle" =>
	],
	"interaaction" => [
		"selectable" => ,
		"selected" =>
	]
]


new sinod

"category": "Chart"
"type": "LineChart"

[
	"type" => "LineChart",
	"data" => [[
		"coord" => 
	]],
	"style" => [
		"color" => ,
		"graphMiddle" =>
	],
	"interaction" => [
		"selectable" => ,
		"movable" =>
	]
]




old sinod

"type": "Input:LineChartStats2D" or "LineChartStats2D"

[
	"type" => "Input:LineChartStats2D" or "LineChartStats2D",
	"dataset" => [],
	"strokeColor" =>
]

*/
	
	
	
class CS_ChartLine
{
	public $json_CS;
	
	public function __construct($json_CS)
	{
		$this->json_CS = $json_CS;
	}
    
    public function json_new() 
	{
        $json_new = [];
		
		$json_new["type"] = $this->json_CS["type"]["new"];
		
		$json_new["data"] = [];
		foreach ($this->json_CS["data"] as $json_object)
		{
			$value = [];
			$value["coord"] = $json_object;
			$json_new["data"][] = $value;
		}
		
		$json_new["style"] = [];
		$json_new["style"]["color"] = $this->json_CS["style"]["color"];
		$json_new["style"]["graphMiddle"] = $this->json_CS["style"]["middle"];
		
		$json_new["interaction"] = [];
		$json_new["interaction"]["selectable"] = $this->json_CS["interaction"]["selectable"];
		$json_new["interaction"]["movable"] = $this->json_CS["interaction"]["movable"];
		
		return $json_new;
    }
    
    public function json_old() 
	{
        $json_old = [];
		
		$json_old["type"] = $this->json_CS["type"]["old"];
		
		$json_old["dataset"] = $this->json_CS["data"];
		
		$json_old["strokeColor"] = $this->json_CS["style"]["color"];
		
		
		
		return $json_old;
    }
    
    public function json($flag = false, $version = "old") 
	{
        
		switch($version) 
		{
        
			case "new" : $json = $this->json_new();
            
			case "old" : $json = $this->json_old();
        }
        
        return $flag ? $json : json_encode($json, 256);
    }
    
    public function __toString() 
	{
        return "";
    }
}



/*
CS sinod
"category":	"Chart"
"type": "ChartGraph"

[
	"type" => [
		"CS" => ,
		"new" => ,
		"old" =>
	],
	"data" => [],
	"typeGraph" =>
	"style" => [
		"color" => ,
		"middle" =>
	],
	"interaction" => [
		"selectable" => ,
		"movable" =>
	]
]


new sinod

"category": "Chart"
"type": "ChartGraph"

[
	"type" => "ChartGraph",
	"data" => [],
	"graph" => ,
	"style" => [
		"color" => ,
		"fill" => ,
		"graphMiddle" =>
	],
	"interaction" => [
		"selectable" => ,
		"movable" => ,
		"adjust" =>
	]
]




old sinod



*/
	
	
	
class CS_ChartGraph
{
	public $json_CS;
	
	public function __construct($json_CS)
	{
		$this->json_CS = $json_CS;
	}
    
    public function json_new() 
	{
        $json_new = [];
		
		$json_new["type"] = $this->json_CS["type"]["new"];
		
		$json_new["graph"] = $this->json_CS["typeGraph"];
		
		$json_new["style"] = [];
		$json_new["style"]["color"] = CS_function::color_conversion($this->json_CS["style"]["color"],"new");
		$json_new["style"]["fill"] = $this->json_CS["style"]["filled"];
		$json_new["style"]["graphMiddle"] = $this->json_CS["style"]["middle"];
		
		$json_new["interaction"] = [];
		$json_new["interaction"]["selectable"] = $this->json_CS["interaction"]["selectable"];
		$json_new["interaction"]["movable"] = $this->json_CS["interaction"]["movable"];
		$json_new["interaction"]["useAdjust"] = $this->json_CS["interaction"]["adjust"];
		
		return $json_new;
    }
    
    public function json_old() 
	{
        $json_old = [];
		
		
		
		
		return $json_old;
    }
    
    public function json($flag = false, $version = "old") 
	{
        
		switch($version) 
		{
        
			case "new" : $json = $this->json_new();
            
			case "old" : $json = $this->json_old();
        }
        
        return $flag ? $json : json_encode($json, 256);
    }
    
    public function __toString() 
	{
        return "";
    }
}





/*
CS sinod
"category":	"Draggable"
"type": "DraggableDropZone"

[
	"type" => [
		"CS" => ,
		"new" => ,
		"old" =>
	],
	"elements" => []
]


new sinod

"category":	"Draggable"
"type": "DraggableDropZone"

[
	"type" => "DraggableDropZone",
	"elements" => []
]




old sinod



*/
	
	
	
class CS_DraggableDropZone
{
	public $json_CS;
	
	public function __construct($json_CS)
	{
		$this->json_CS = $json_CS;
	}
    
    public function json_new() 
	{
        $json_new = [];
		
		$json_new["type"] = $this->json_CS["type"]["new"];
		
		$json_new["elements"] = [];
		foreach ($this->json_CS["elements"] as $json_object)
		{
			$json_new["elements"][] = CS_function::json_conversion($json_object,"old");
		}
		
		return $json_new;
    }
    
    public function json_old() 
	{
        $json_old = [];
		
		
		
		
		return $json_old;
    }
    
    public function json($flag = false, $version = "old") 
	{
        
		switch($version) 
		{
        
			case "new" : $json = $this->json_new();
            
			case "old" : $json = $this->json_old();
        }
        
        return $flag ? $json : json_encode($json, 256);
    }
    
    public function __toString() 
	{
        return "";
    }
}



/*
CS sinod
"category":	"Draggable"
"type": "DraggableObject"

[
	"type" => [
		"CS" => ,
		"new" => ,
		"old" =>
	],
	"elements" => [],
	"interaction" => [
		"draggable" => 
	],
	"style" => [
		"copy" =>
	]
]


new sinod

"category":	"Draggable"
"type": "DraggableObject"

[
	"type" => "DraggableObject",
	"elements" => [],
	"isDraggable" => ,
	"copy" =>
]




old sinod



*/
	
	
	
class CS_DraggableObject
{
	public $json_CS;
	
	public function __construct($json_CS)
	{
		$this->json_CS = $json_CS;
	}
    
    public function json_new() 
	{
        $json_new = [];
		
		$json_new["type"] = $this->json_CS["type"]["new"];
		
		$json_new["elements"] = [];
		foreach ($this->json_CS["elements"] as $json_object)
		{
			$json_new["elements"][] = CS_function::json_conversion($json_object,"new");
		}
		
		$json_new["isDraggable"] = $this->json_CS["interaction"]["draggable"];
		
		$json_new ["copy"] = $this->json_CS["style"]["copy"];
		
		return $json_new;
    }
    
    public function json_old() 
	{
        $json_old = [];
		
		
		
		
		return $json_old;
    }
    
    public function json($flag = false, $version = "old") 
	{
        
		switch($version) 
		{
        
			case "new" : $json = $this->json_new();
            
			case "old" : $json = $this->json_old();
        }
        
        return $flag ? $json : json_encode($json, 256);
    }
    
    public function __toString() 
	{
        return "";
    }
}







/*
CS sinod
"category":	"Layout"
"type": "BoxTitle"

[
	"type" => [
		"CS" => ,
		"new" => ,
		"old" =>
	],
	"elements" => [
		"object" => ,
		"align" => [
			"x" => ,
			"y" =>
		]
	],
	"title" => [
		"string" => ,
		"object" => []
	],
	"layout" => [
		"size" => [
			"x" => ,
			"y" =>
		],
		"border" => [
			"width" => ,
			"visible" => ,
			"color" =>
		],
		"position" => [
			"x" => ,
			"y" =>
		],
		"margin" => [
			"top" => ,
			"bottom" => ,
			"left" => ,
			"right" =>
		],
		"display" => ,
		"mode" =>
	]
]


new sinod

"category":	"Basic"
"type": "TitleBox"

[
	"type" => "TitleBox",
	"elements" => [],
	"align" => [
		"hor" => ,
		"ver" =>
	],
	"title" => ,
	"size" => [
		"width" => ,
		"height" =>
	],
	"border" => [
		"width" => ,
		"color" => 
	],
	"position" => [
		"left" => ,
		"top" =>
	],
	"margin" => [
		"top" => ,
		"bottom" => ,
		"left" => ,
		"right" =>
	],
	"display" =>
]




old sinod
"type": "Block"

[
	"value" => [],
	"option" => [
		"textAlign" => ,
		"title" => ,
		"width" => ,
		"border" => ,
		"align" => ,
		"mode" =>
	]
]

*/
	
	
	
class CS_BoxTitle
{
	public $json_CS;
	
	public function __construct($json_CS)
	{
		$this->json_CS = $json_CS;
	}
    
    public function json_new() 
	{
        $json_new = [];
		
		$json_new["type"] = $this->json_CS["type"]["new"];
		
		$json_new["elements"] = [];
		foreach ($this->json_CS["elements"]["object"] as $json_object)
		{
			$json_new["elements"][] = CS_function::json_conversion($json_object,"new");
		}
		
		$json_new["align"] = [];
		$json_new["align"]["hor"] = $this->json_CS["elements"]["align"]["x"];
		$json_new["align"]["ver"] = $this->json_CS["elements"]["align"]["y"];
		
		$json_new["title"] = [];
		foreach ($this->json_CS["title"]["object"] as $json_object)
		{
			$json_new["title"][] = CS_function::json_conversion($json_object,"new");
		}
		
		$json_new["size"] = [];
		$json_new["size"]["width"] = $json_new["layout"]["size"]["x"];
		$json_new["size"]["height"] = $json_new["layout"]["size"]["y"];
		
		$json_new["border"] = [];
		$json_new["border"]["width"] = $this->json_CS["layout"]["border"]["width"];
		$json_new["border"]["color"] = CS_function::color_conversion($this->json_CS["layout"]["border"]["color"],"new");
		
		$json_new["position"] = [];
		$json_new["position"]["left"] = $this->json_CS["layout"]["position"]["x"];
		$json_new["position"]["top"] = $this->json_CS["layout"]["position"]["y"];
		
		$json_new["margin"] = [];
		$json_new["margin"]["top"] = $this->json_CS["layout"]["margin"]["top"];
		$json_new["margin"]["bottom"] = $this->json_CS["layout"]["margin"]["bottom"];
		$json_new["margin"]["left"] = $this->json_CS["layout"]["margin"]["left"];
		$json_new["margin"]["right"] = $this->json_CS["layout"]["margin"]["right"];
		
		$json_new["display"] = $this->json_CS["layout"]["display"];
		
		return $json_new;
    }
    
    public function json_old() 
	{
        $json_old = [];
		
		$json_old["type"] = $this->json_CS["type"]["old"];
		
		$json_old["value"] = [];
		foreach ($this->json_CS["elements"]["object"] as $json_object)
		{
			$json_old["value"][] = CS_function::json_conversion($json_object,"old");
		}
		
		$json_old["option"] = [];
		$json_old["option"]["title"] = $this->json_CS["title"]["string"];
		$json_old["option"]["width"] = $this->json_CS["layout"]["size"]["x"];
		$json_old["option"]["border"] = $this->json_CS["layout"]["border"]["visible"];
	    $json_old["option"]["align"] = $this->json_CS["layout"]["align"];
		$json_old["option"]["mode"] = $this->json_CS["layout"]["mode"];
		
		return $json_old;
    }
    
    public function json($flag = false, $version = "old") 
	{
        
		switch($version) 
		{
        
			case "new" : $json = $this->json_new();
            
			case "old" : $json = $this->json_old();
        }
        
        return $flag ? $json : json_encode($json, 256);
    }
    
    public function __toString() 
	{
        return "";
    }
}




/*
CS sinod
"category":	"Layout"
"type": "Box"

[
	"type" => [
		"CS" => ,
		"new" => ,
		"old" =>
	],
	"layout" => [
		"position" => [
			"x" => ,
			"y" =>
		],
		"border" => [
			"top" => [
				"width" => ,
				"type" => ,
				"color" =>
			],
			"bottom" => [
				"width" => ,
				"type" => ,
				"color" =>
			],
			"left" => [
				"width" => ,
				"type" => ,
				"color" =>
			],
			"right" => [
				"width" => ,
				"type" => ,
				"color" =>
			]
		],
		"size" => [
			"x" => ,
			"y" =>
		],
		"margin" => [
			"top" => ,
			"bottom" => ,
			"left" => ,
			"right" =>
		],
		"display" => ,
		"align" =>
	],
	"elements" => []
	
]


new sinod

"category":	"Layout"
"type": "Box"

[
	"type" => "Box",
	"position" => [
		"left" => ,
		"top" =>
	],
	"border" => [
		"top" => [
			"width" => ,
			"style" => ,
			"color" =>
		],
		"bottom" => [
			"width" => ,
			"style" => ,
			"color" =>
		],
		"left" => [
			"width" => ,
			"style" => ,
			"color" =>
		],
		"right" => [
			"width" => ,
			"style" => ,
			"color" =>
		]
	],
	"size" => [
		"width" => ,
		"height" => 
	],
	"margin" => [
		"top" => ,
		"bottom" => ,
		"left" => ,
		"rigth" =>
	],
	"display" => ,
	"align" => ,
	"elements" => []
]




old sinod
"type": "Span"


[
	"type" => "Span",
	"display" => 
]

*/
	
	
	
class CS_Box
{
	public $json_CS;
	
	public function __construct($json_CS)
	{
		$this->json_CS = $json_CS;
	}
    
    public function json_new() 
	{
        $json_new = [];
		
		$json_new["type"] = $this->json_CS["type"]["new"];
		
		$json_new["position"] = [];
		$json_new["position"]["left"] = $this->json_CS["position"]["x"];
		$json_new["position"]["top"] = $this->json_CS["position"]["y"];
		
		$json_new["border"] = [];
		$json_new["border"]["top"] = [];
		$json_new["border"]["top"]["width"] = $this->json_CS["layout"]["border"]["top"]["width"];
		$json_new["border"]["top"]["style"] = $this->json_CS["layout"]["border"]["top"]["type"];
		$json_new["border"]["top"]["color"] = CS_function::color_conversion($this->json_CS["layout"]["border"]["top"]["color"],"new");
		$json_new["border"]["bottom"] = [];
		$json_new["border"]["bottom"]["width"] = $this->json_CS["layout"]["border"]["bottom"]["width"];
		$json_new["border"]["bottom"]["style"] = $this->json_CS["layout"]["border"]["bottom"]["type"];
		$json_new["border"]["bottom"]["color"] = CS_function::color_conersion($this->json_CS["layout"]["border"]["bottom"]["color"],"new");
		$json_new["border"]["left"] = [];
		$json_new["border"]["left"]["width"] = $this->json_CS["layout"]["border"]["left"]["width"];
		$json_new["border"]["left"]["style"] = $this->json_CS["layout"]["border"]["left"]["type"];
		$json_new["border"]["left"]["color"] = CS_function::color_conersion($this->json_CS["layout"]["border"]["left"]["color"],"new");
		$json_new["border"]["right"] = [];
		$json_new["border"]["right"]["width"] = $this->json_CS["layout"]["border"]["right"]["width"];
		$json_new["border"]["right"]["style"] = $this->json_CS["layout"]["border"]["right"]["type"];
		$json_new["border"]["right"]["color"] = CS_function::color_conersion($this->json_CS["layout"]["border"]["right"]["color"],"new");
		
		$json_new["size"] = [];
		$json_new["size"]["width"] = $this->json_CS["layout"]["size"]["x"];
		$json_new["size"]["height"] = $this->json_CS["layout"]["size"]["y"];
		
		$json_new["margin"] = [];
		$json_new["margin"]["top"] = $this->json_CS["layout"]["margin"]["top"];
		$json_new["margin"]["bottom"] = $this->json_CS["layout"]["margin"]["bottom"];
		$json_new["margin"]["left"] = $this->json_CS["layout"]["margin"]["left"];
		$json_new["margin"]["right"] = $this->json_CS["layout"]["margin"]["right"];
		
		$json_new["display"] = $this->json_CS["layout"]["display"];
		
		$json_new["align"] = $this->json_CS["layout"]["align"];
		
		$json_new["elements"] = [];
		foreach ($this->json_CS["elements"] as $json_object)
		{
			$json_new["elements"][] = CS_function::json_conversion($json_object,"new");
		}
		
		return $json_new;
    }
    
    public function json_old() 
	{
        $json_old = [];
		
		$json_old["type"] = $this->json_CS["type"]["old"];
		
		$json_old["display"] = $this->json_CS["layout"]["display"];
		
		return $json_old;
    }
    
    public function json($flag = false, $version = "old") 
	{
        
		switch($version) 
		{
        
			case "new" : $json = $this->json_new();
            
			case "old" : $json = $this->json_old();
        }
        
        return $flag ? $json : json_encode($json, 256);
    }
    
    public function __toString() 
	{
        return "";
    }
}




/*
CS sinod
"category":	"Layout"
"type": "Layer"

[
	"type" => [
		"CS" => ,
		"new" => ,
		"old" =>
	],
	"layout" => [
		"display" => ,
		"size" => [
			"x" => ,
			"y" =>
		],
		"position" => [
			"x" => ,
			"y" =>
		],
		"margin" => [
			"top" => ,
			"bottom" => ,
			"left" => ,
			"right" =>
		]
	],
	"elements" => [
		"source" => [
			"position" => [
				"x" => ,
				"y" =>
			],
			"object" =>
		],
		"target" => [[
			"position" => [
				"x" => ,
				"y" =>
			],
			"size" => ,
			"direction" => ,
			"object" =>
		],
		"object" => ,
		"align" => 
	]
	"typeOld" =>
]


new sinod

"category":	"Layout"
"type": "Layer"

[
	"display" => ,
	"size" => [
		"width" => ,
		"height" => 
	],
	"position" => [
		"left" => ,
		"top" =>
	],
	"margin" => [
		"top" => ,
		"bottom" => ,
		"left" => ,
		"right" =>
	],
	"elements" => [];
	"elmAlign" =>
]




old sinod
"type": "Directional" or "Layer"


[
	"type" => "Directional",
	"source" => ,
	"target" => [[
		"size" => ,
		"mode" => ,
		"object" =>
	]]
]

[
	"type" => "Layer",
	"source" => [
		"object" => ,
		"left" => ,
		"top" =>
	],
	"target" => [[
		"object" => ,
		"left" => ,
		"top" =>
	]]
]

*/
	
	
	
class CS_Box
{
	public $json_CS;
	
	public function __construct($json_CS)
	{
		$this->json_CS = $json_CS;
	}
    
    public function json_new() 
	{
        $json_new = [];
		
		$json_new["type"] = $this->json_CS["type"]["new"];
		
		$json_new["display"] = $this->json_CS["layout"]["display"];
		
		$json_new["size"] = [];
		$json_new["size"]["width"] = $this->json_CS["layout"]["size"]["x"];
		$json_new["size"]["height"] = $this->json_CS["layout"]["size"]["y"];
		
		$json_new["position"] = [];
		$json_new["position"]["left"] = $this->json_CS["layout"]["position"]["x"];
		$json_new["position"]["top"] = $this->json_CS["layout"]["position"]["y"];
		
		$json_new["margin"] = [];
		$json_new["margin"]["top"] = $this->json_CS["layout"]["margin"]["top"];
		$json_new["margin"]["bottom"] = $this->json_CS["layout"]["margin"]["bottom"];
		$json_new["margin"]["left"] = $this->json_CS["layout"]["margin"]["left"];
		$json_new["margin"]["rigth"] = $this->json_CS["layout"]["margin"]["right"];
		
		$json_new["elements"] = [];
		foreach ($this->json_CS["elements"]["object"] as $json_object)
		{
			$json_new["elements"][] = CS_function::json_conversion($json_object,"new");
		}
		
		$json_new["elmAlign"] = $this->json_CS["elements"]["align"];
		
		return $json_new;
    }
    
    public function json_old() 
	{
        $json_old = [];
		
		$json_old["type"] = $this->json_CS["type"]["old"];
		
		switch ($this->json_CS["type"]["old"])
		{
			case "Directional":
			{
				$json_old["source"] = CS_function::json_conversion($this->json_CS["elements"]["source"]["object"],"old");
				
				
				$json_old["target"] = [];
				foreach ($this->json_CS["elements"]["target"] as $json_object)
				{
					$value = [];
					$value["size"] = $json_object["size"];
					$value["mode"] = CS_function::direction_conversion($json_object["direction"];
					$value["object"] = CS_function::json_conversion($json_object["object"],"old");
					$json_old["target"][] = $value;
				}
			}
			case "Layer":
			{
				$json_old["source"] = [];
				$json_old["source"]["left"] = $this->json_CS["elements"]["source"]["position"]["x"];
				$json_old["source"]["top"] = $this->json_CS["elements"]["source"]["position"]["y"];
				$json_old["source"]["object"] = CS_function::json_conversion($this->json_CS["elements"]["source"]["object"],"old");
				
				$json_old["target"] = [];
				foreach ($this->json_CS["elements"]["target"] as $json_object)
				{
					$value = [];
					$value["left"] = $json_object["position"]["x"];
					$value["right"] = $json_object["position"]["y"];
					$value["object"] = CS_function::json_conversion($json_object["object"],"old");
					$json_old["target"][] = $value;
				}
			}
		}
		
		
		return $json_old;
    }
    
    public function json($flag = false, $version = "old") 
	{
        
		switch($version) 
		{
        
			case "new" : $json = $this->json_new();
            
			case "old" : $json = $this->json_old();
        }
        
        return $flag ? $json : json_encode($json, 256);
    }
    
    public function __toString() 
	{
        return "";
    }
}






/*
CS sinod
"category":	"Table"
"type": "Table"

[
	"type" => [
		"CS" => ,
		"new" => ,
		"old" =>
	],
	"typeOld" => ,
	"interaction" => [
		"interactive" =>
	],
	"rows" => [[]];
	"layout" => [
		"position" => [
			"x" => ,
			"y" =>
		],
		"margin" => [
			"top" => ,
			"bottom" => ,
			"left" => ,
			"right" =>
		],
		"display" => ,
		"size" => [
			"x" => ,
			"y" =>
		]
	]
	
]


new sinod

"category":	"Table"
"type": "Table"

[
	"type" => "Table",
	"cells" => [],
	"position" => [
		"left" => ,
		"top" =>
	],
	"margin" => [
		"top" => ,
		"bottom" => ,
		"left" => ,
		"right" =>
	],
	"display" => ,
	"size" => [
		"width" => ,
		"height" =>
	]
]




old sinod
"type": "Grid" or "Lattice"


[
	"type" => "Grid",
	"mode" => ,
	"value" = [[
		"cell" => ,
		"object" =>
	]]
]


[
	"type" => "Lattice",
	"value" => [[
		"object" => ,
		"option" => [
			"textAlign" => ,
			"verticalAlign" => ,
			"preset" => [
				"position" => ,
				"width" => ,
				"style" =>
			],
			"paddingTop" => ,
			"paddingBottom" => ,
			"paddingLeft" => ,
			"paddingRight" => ,
			"width" => ,
			"height" => ,
			"rowspan" => ,
			"colspan" => ,
			"background" =>
		]
	]]

*/
	
	
	
class CS_Table
{
	public $json_CS;
	
	public function __construct($json_CS)
	{
		$this->json_CS = $json_CS;
	}
    
    public function json_new() 
	{
        $json_new = [];
		
		$json_new["type"] = $this->json_CS["type"]["new"];
		
		$json_new["cells"] = [];
		foreach ($this->json_CS["rows"] as $json_object)
		{
			$json_new["cells"][] = CS_function::json_conversion($json_object,"new");
		}
		
		$json_new["position"] = [];
		$json_new["position"]["left"] = $this->json_CS["layout"]["position"]["x"];
		$json_new["position"]["top"] = $this->json_CS["layout"]["position"]["y"];
		
		$json_new["margin"] = [];
		$json_new["margin"]["top"] = $this->json_CS["layout"]["margin"]["top"];
		$json_new["margin"]["bottom"] = $this->json_CS["layout"]["margin"]["bottom"];
		$json_new["margin"]["left"] = $this->json_CS["layout"]["margin"]["left"];
		$json_new["margin"]["right"] = $this->json_CS["layout"]["margin"]["right"];
		
		$json_new["display"] = $this->json_CS["layout"]["display"];
		
		$json_new["size"] = [];
		$json_new["size"]["width"] = $this->json_CS["layout"]["size"]["x"];
		$json_new["size"]["height"] = $this->json_CS["layout"]["size"]["y"];
		
		return $json_new;
    }
    
    public function json_old() 
	{
        $json_old = [];
		
		$json_old["type"] = $this->json_CS["type"]["old"];
		
		switch ($this->json_CS["typeOld"])
		{
			case "Grid":
			{
				if ($this->json_CS["interaction"]["interactive"])
				{
					$json_old["mode"] = "Input";
				}
				else 
				{
					$json_old["mode"] = "Static";
				}
				
				$json_old["value"] = [];
				foreach ($this->json_CS["rows"] as $json_object)
				{
					$value = [];
					foreach ($json_object["elements"] as $json_object_1)
					{
						$value["cell"] = CS_function::color_conversion($json_object_1["color"],"new");
						
						$value["object"] = CS_function::json_conversion($json_object_1["object"],"new");
					}
										
					$json_old["value"][] = $value;
					
				}
				
			}
			case "Lattice":
			{
				$json_old["value"] = [];
				foreach ($this->json_CS["rows"] as $json_object)
				{
					$value = [];
					foreach ($json_object["elements"] as $json_object_1)
					{
						$value["object"] = CS_function::json_conversion($json_object_1["object"],"new");
						
						$value["option"] = [];
						
						$value["option"]["textAlign"] = $json_object_1["layout"]["align"]["x"];
						
						$value["option"]["verticalAlign"] = $json_object_1["layout"]["align"]["x"];
						
						$value["option"]["preset"] = [];
						$value["option"]["preset"][] = "top-".$json_object_1["layout"]["border"]["top"]["width"]["value"]."-".$json_objet_1["laytou"]["border"]["top"]["type"];
						$value["option"]["preset"][] = "bottom-".$json_object_1["layout"]["border"]["bottom"]["width"]["value"]."-".$json_objet_1["laytou"]["border"]["bottom"]["type"];
						$value["option"]["preset"][] = "left-".$json_object_1["layout"]["border"]["left"]["width"]["value"]."-".$json_objet_1["laytou"]["border"]["left"]["type"];
						$value["option"]["preset"][] = "right-".$json_object_1["layout"]["border"]["right"]["width"]["value"]."-".$json_objet_1["laytou"]["border"]["right"]["type"];
						
						$value["option"]["paddingTop"] = $json_object_1["layout"]["margin"]["top"];
						$value["option"]["paddingBottom"] = $json_object_1["layout"]["margin"]["bottom"];
						$value["option"]["paddingLeft"] = $json_object_1["layout"]["margin"]["left"];
						$value["option"]["paddingRight"] = $json_object_1["layout"]["margin"]["right"];
						
						$value["option"]["width"] = $json_object_1["layout"]["size"]["x"];
						$value["option"]["height"] = $json_object_1["layout"]["size"]["y"];
						
						$value["option"]["rowspan"] = $json_object_1["layout"]["span"]["row"];
						$value["option"]["colspan"] = $json_object_1["layout"]["span"]["column"];
						
						$value["option"]["background"] = CS_function::color_conversion($json_object_1["style"]["color"]["background"],"old");
					}
				}
			}
		}
		
		return $json_old;
    }
    
    public function json($flag = false, $version = "old") 
	{
        
		switch($version) 
		{
        
			case "new" : $json = $this->json_new();
            
			case "old" : $json = $this->json_old();
        }
        
        return $flag ? $json : json_encode($json, 256);
    }
    
    public function __toString() 
	{
        return "";
    }
}




/*
CS sinod
"category":	"Table"
"type": "TableRow"

[
	"type" => [
		"CS" => ,
		"new" => ,
		"old" =>
	],
	"elements" => [[
		"color" => ,
		"object" => 
	]],
	"layout" => [
		"align" => [
			"x" => ,
			"y" =>
		],
		"border" => [
			"top" => [
				"width" => [
					"value" => ,
					"type" =>
				],
				"type" => ,
				"color" =>
			],
			"bottom" => [
				"width" => [
					"value" => ,
					"type" =>
				],
				"type" => ,
				"color" =>
			],
			"left" => [
				"width" => [
					"value" => ,
					"type" =>
				],
				"type" => ,
				"color" =>
			],
			"right" => [
				"width" => [
					"value" => ,
					"type" =>
				],
				"type" => ,
				"color" =>
			]
		],
		"margin" => [
			"top" => ,
			"bottom" => ,
			"left" => ,
			"right" =>
		],
		"size" => [
			"x" => ,
			"y" =>
		],
		"position" => [
			"x" => ,
			"y" =>
		],
		"span" => [
			"row" => ,
			"column" =>
		]
	],
	"style" => [
		"color" => [
			"background" =>
		]
	]
]


new sinod

"category":	"Table"
"type": "TableCellBox"

[
	"type" => "TableCellBox",
	"elements" => [],
	"align" => [
		"hor" => ,
		"ver" => 
	],
	"border" => [
		"top" => [
			"width" => ,
			"style" => ,
			"color" =>
		],
		"bottom" => [
			"width" => ,
			"style" => ,
			"color" =>
		],
		"left" => [
			"width" => ,
			"style" => ,
			"color" =>
		],
		"right" => [
			"width" => ,
			"style" => ,
			"color" =>
		],
	],
	"margin" => [
		"top" => ,
		"bottom" => ,
		"left" => ,
		"right" =>
	],
	"size" => [
		"width" => ,
		"height" =>
	],
	"position" => [
		"left" => ,
		"top" => 
	],
	"rowspan" => ,
	"colspan" => ,
	"background" =>
]




*/
	
	
	
class CS_TableRow
{
	public $json_CS;
	
	public function __construct($json_CS)
	{
		$this->json_CS = $json_CS;
	}
    
    public function json_new() 
	{
        $json_new = [];
		
		$json_new["type"] = $this->json_CS["type"]["new"];
		
		$json_new["elements"] = [];
		foreach ($this->json_CS["elements"] as $json_object)
		{
			$json_new["elements"][] = CS_function::json_conversion($json_object["object"],"new");
		}
		
		$json_new["align"] = [];
		$json_new["align"]["hor"] = $this->json_CS["layout"]["align"]["x"];
		$json_new["align"]["ver"] = $this->json_CS["layout"]["align"]["y"];
		
		$json_new["border"] = [];
		$json_new["border"]["top"] = [];
		$json_new["border"]["top"]["width"] = $this->json_CS["layout"]["border"]["top"]["width"]["value"];
		$json_new["border"]["top"]["style"] = $this->json_CS["layout"]["border"]["top"]["type"];
		$json_new["border"]["top"]["color"] = CS_function::color_conversion($this->json_CS["layout"]["border"]["top"]["color"],"new");
		$json_new["border"]["bottom"] = [];
		$json_new["border"]["bottom"]["width"] = $this->json_CS["layout"]["border"]["bottom"]["width"]["value"];
		$json_new["border"]["bottom"]["style"] = $this->json_CS["layout"]["border"]["bottom"]["type"];
		$json_new["border"]["bottom"]["color"] = CS_function::color_conversion($this->json_CS["layout"]["border"]["bottom"]["color"],"new");
		$json_new["border"]["left"] = [];
		$json_new["border"]["left"]["width"] = $this->json_CS["layout"]["border"]["left"]["width"]["value"];
		$json_new["border"]["left"]["style"] = $this->json_CS["layout"]["border"]["left"]["type"];
		$json_new["border"]["left"]["color"] = CS_function::color_conversion($this->json_CS["layout"]["border"]["left"]["color"],"new");
		$json_new["border"]["right"] = [];
		$json_new["border"]["right"]["width"] = $this->json_CS["layout"]["border"]["right"]["width"]["value"];
		$json_new["border"]["right"]["style"] = $this->json_CS["layout"]["border"]["right"]["type"];
		$json_new["border"]["right"]["color"] = CS_function::color_conversion($this->json_CS["layout"]["border"]["right"]["color"],"new");
		
		$json_new["margin"] = [];
		$json_new["margin"]["top"] = $this->json_CS["layout"]["margin"]["top"];
		$json_new["margin"]["bottom"] = $this->json_CS["layout"]["margin"]["bottom"];
		$json_new["margin"]["left"] = $this->json_CS["layout"]["margin"]["left"];
		$jaon_new["margin"]["right"] = $this->json_CS["layout"]["margin"]["right"];
		
		$json_new["size"] = [];
		$json_new["size"]["width"] = $this->json_CS["layout"]["size"]["x"];
		$json_new["size"]["height"] = $this->json_CS["layout"]["size"]["y"];
		
		$json_new["position"] = [];
		$json_new["position"]["left"] = $this->json_CS["layout"]["position"]["x"];
		$json_new["position"]["top"] = $this->json_CS["layout"]["position"]["y"];
		
		$json_new["rowspan"] = $this->json_CS["layout"]["span"]["row"];
		
		$json_new["colspan"] = $this->json_CS["layout"]["span"]["column"];
		
		$json_new["background"] = [];
		$json_new["background"]["color"] = $this->json_CS["style"]["color"]["background"];
		
		return $json_new;
    }
    
    public function json_old() 
	{
        $json_old = [];
		
		
		
		
		return $json_old;
    }
    
    public function json($flag = false, $version = "old") 
	{
        
		switch($version) 
		{
        
			case "new" : $json = $this->json_new();
            
			case "old" : $json = $this->json_old();
        }
        
        return $flag ? $json : json_encode($json, 256);
    }
    
    public function __toString() 
	{
        return "";
    }
}



/*
CS sinod
"category":	"Relation"
"type": "Relation"

[
	"type" => [
		"CS" => ,
		"new" => ,
		"old" =>
	],
	"font" => [
		"color" => [
			"text" => ,
			"background" => 
		],
		"size" => ,
		"decoration" => [
			"underline" => ,
			"bold" => ,
			"italic" =>
		]
	],
	"layout" => [
		"position" => [
			"x" => ,
			"y" =>
		],
		"margin" => [
			"top" => ,
			"bottom" => ,
			"left" => ,
			"right" =>
		],
		"ratio" => ,
		"display" => ,
		"size" => ,
		"border" =>
	],
	"interaction" => [
		"interactive" => 
	],
	"sets" => [
		"object" => [],
		"label" => [
			"visible" => 
		]
	],
	"maps" => [
		"object" => [],
		"label" => [
			"visible" =>
		]
	]
]


new sinod

"category":	"Relation"
"type": "Relation"

[
	"type" => "Relation",
	"font" => [
		"color" => [
			"text" => ,
			"background" =>
		],
		"size" => ,
		"decoration" => [
			"underline" => ,
			"bold" => ,
			"italic" =>
		]
	],
	"position" => [
		"left" => ,
		"right" =>
	],
	"margin" => [
		"top" => ,
		"bottom" => ,
		"left" => ,
		"right" =>
	],
	"ratio" => ,
	"display" => ,
	"size" => ,
	"interaction" => ,
	"sets" => [],
	"maps" => []
]


old sinod

"type": "Relation"

[
	"type" => "Relation",
	"height" => ,
	"input" => ,
	"option" => [
		"border" => ,
		"setName" => ,
		"relationName" =>
	],
	"relation" => [[
		"value => [
			"arrow" => [ , ],
			"color" => ,
			"source" => ,
			"target" =>
		],
		"name" => ,
		"flow" =>
	]],
	"set" => [[
		"width" => ,
		"name" => ,
		"element" => 
	]]
]

*/
	
	
	
class CS_Relation
{
	public $json_CS;
	
	public function __construct($json_CS)
	{
		$this->json_CS = $json_CS;
	}
    
    public function json_new() 
	{
        $json_new = [];
		
		$json_new["type"] = $this->json_CS["type"]["new"];
		
		$json_new["font"] = [];
		$json_new["font"]["color"] = [];
		$json_new["font"]["color"]["text"] = CS_function::color_conversion($this->json_CS["font"]["color"]["text"],"new");
		$json_new["font"]["color"]["background"] = CS_function::color_conversion($this->json_CS["font"]["color"]["background"],"new");
	    $json_new["font"]["size"] = $this->json_CS["font"]["size"];
		$json_new["font"]["decoration"] = [];
		$json_new["font"]["decoration"]["underline"] = $this->json_CS["font"]["decoration"]["underline"];
		$json_new["font"]["deocration"]["bold"] = $this->json_CS["font"]["decoration"]["bold"];
		$json_new["font"]["decoration"]["italic"] = $this->json_CS["font"]["decoration"]["italic"];
		
		$json_new["position"] = [];
		$json_new["position"]["left"] = $this->json_CS["layout"]["position"]["x"];
		$json_new["position"]["top"] = $this->json_CS["layout"]["position"]["y"];
		
		$json_new["margin"] = [];
		$json_new["margin"]["top"] = $this->json_CS["layout"]["margin"]["top"];
		$json_new["margin"]["bottom"] = $this->json_CS["layout"]["margin"]["bottom"];
		$json_new["margin"]["left"] = $this->json_CS["layout"]["margin"]["left"];
		$json_new["margin"]["right"] = $this->json_CS["layout"]["margin"]["right"];
		
		$json_new["ratio"] = $this->json_CS["layout"]["ratio"];
		
		$json_new["display"] = $this->json_CS["layout"]["display"];
		
		$json_new["size"] = $this->json_CS["layout"]["size"];
		
		$json_new["interaction"] = $this->json_CS["interaction"]["interactive"];
		
		$json_new["sets"] = [];
		foreach ($this->json_CS["sets"]["object"] as $json_object)
		{
			$json_new["sets"][] = CS_function::json_conversion($json_object,"new");
		}
		
		$json_new["maps"][] = CS_function::json_conversion($json_object,"new")
		foreach ($this->json_CS["maps"]["object"] as $json_object)
		{
			$json_new["maps"][] = CS_function::json_conversion($json_object,"new");
		}
	
		
		return $json_new;
    }
    
    public function json_old() 
	{
        $json_old = [];
		
		$json_old["type"] = $this->json_CS["type"]["old"];
		
		$json_old["height"] = $this->json_CS["layout"]["size"];
		
		$json_old["option"] = [];
		$json_old["option"]["border"] = $this->json_CS["layout"]["border"];
		$json_old["option"]["setName"] = $this->json_CS["sets"]["label"]["visible"];
		$json_old["option"]["relationName"] = $this->json_CS["maps"]["label"]["visible"];
		
		$json_old["set"] = [];
		foreach ($this->json_CS["sets"]["object"] as $json_object)
		{
			$value = [];
			$value["width"] = $json_object["layout"]["width"];
			$value["name"] = CS_function:json_conversion($json_object["label"],"old");
			$value["element"] = CS_function::json_conversion($json_object["object"],"old");
			
			
			$json_old["set"][] = $value;
			
		}
		
		$json_old["map"] = [];
		foreach ($this->json_CS["maps"]["object"] as $json_object)
		{
			$value = [];
			
			$value["value"] = [];
			$value["value"]["arrow"] = [];
			$value["value"]["arrow"][0] = $json_object["style"]["arrow"]["start"];
			$value["value"]["arrow"][1] = $json_object["style"]["arrow"]["end"];
			$value["value"]["color"] = CS_function::color_conversion($json_object["style"]["color"],"old");
			$value["value"]["source"] = $json_object["relation"]["start"];
			$value["value"]["target"] = $json_object["relation"]["end"];
			
			$value["name"] = CS_fuction::json_conversion($json_object["label"],"old");
			
			$value["flow"] = $json_object["layout"]["direction"];
			
			
		}
		
		
		return $json_old;
    }
    
    public function json($flag = false, $version = "old") 
	{
        
		switch($version) 
		{
        
			case "new" : $json = $this->json_new();
            
			case "old" : $json = $this->json_old();
        }
        
        return $flag ? $json : json_encode($json, 256);
    }
    
    public function __toString() 
	{
        return "";
    }
}




/*
CS sinod
"category":	"Relation"
"type": "RelationMap"

[
	"type" => [
		"CS" => ,
		"new" => ,
		"old" =>
	],
	"interaction" => [
		"interactive" => 
	],
	"style" => [
		"arrow" => [
			"visible" => 
		]
	],	
	"data" => [[
		"style" => [
			"arrow" => [
				"start" => ,
				"end" => 
			],
			"color" => 
		],
		"relation" => [
			"start" => ,
			"end" =>
		],
		"label" => ,
		"layout" => [
			"direction" => 
		]
	]],
	"layout" => [
		"direction" => 
	]
		
]


new sinod

"category":	"Relation"
"type": "RelationMap"

[
	"type" => "RelationMap",
	"interaction" => ,
	"arrow" => ,
	"data" => [[
		"source" => ,
		"target" =>
	]],
	"name" => [],
	"flow" => 
]


old sinod



*/
	
	
	
class CS_RelationMap
{
	public $json_CS;
	
	public function __construct($json_CS)
	{
		$this->json_CS = $json_CS;
	}
    
    public function json_new() 
	{
        $json_new = [];
		
		$json_new["type"] = $this->json_CS["type"]["new"];
		
		$json_new["arrow"] = $this->json_CS["style"]["arrow"]["visible"];
		
		$json_new["data"] = [];
		$json_new["name"] = [];
		foreach ($this->json_CS["data"] as $json_object)
		{
			$value = [];
			$value["source"] = $json_object["relation"]["start"];
			$value["target"] = $json_object["relation"]["end"];
			$json_new["data"][] = $value;
			
			$json_new["name"] = CS_function::json_conversion($json_object,"new")
			
			
			
			
		}
		
		
		
		$json_new["flow"] = $this->json_CS["layout"]["direction"];
		
		return $json_new;
    }
    
    public function json_old() 
	{
        $json_old = [];
		
		
		
		
		return $json_old;
    }
    
    public function json($flag = false, $version = "old") 
	{
        
		switch($version) 
		{
        
			case "new" : $json = $this->json_new();
            
			case "old" : $json = $this->json_old();
        }
        
        return $flag ? $json : json_encode($json, 256);
    }
    
    public function __toString() 
	{
        return "";
    }
}


/*
CS sinod
"category":	"Relation"
"type": "RelationSet"

[
	"type" => [
		"CS" => ,
		"new" => ,
		"old" =>
	],
	"layout" => [
		"border" => [
			"type" => ,
			"color" => ,
			"width" =>
		],
		"width" =>
	],
	"data" => [[
		"label" => ,
		"object" => 
	]]
	
]


new sinod

"category":	"Relation"
"type": "RelationSet"

[
	"type" => "RelationSet",
	"border" => [
		"style" => ,
		"color" => ,
		"width" => 
	],
	"width" => ,
	"name" => [],
	"elements" => []
]


old sinod



*/
	
	
	
class CS_RelationSet
{
	public $json_CS;
	
	public function __construct($json_CS)
	{
		$this->json_CS = $json_CS;
	}
    
    public function json_new() 
	{
        $json_new = [];
		
		$json_new["type"] = $this->json_CS["type"]["new"];
		
		$json_new["border"] = [];
		$json_new["border"]["style"] = $this->json_CS["layout"]["border"]["type"];
		$json_new["border"]["color"] = CS_function::color_conversion($this->json_CS["layout"]["border"]["color"],"new");
		$json_new["border"]["width"] = $this->json_CS["layout"]["border"]["width"];
		
		$json_new["width"] = $this->json_CS["layout"]["width"];
		
		$json_new["name"] = [];
		$json_new["elements"] = [];
		foreach ($this->json_CS["data"] as $$json_object)
		{
			$json_new["name"][] = CS_function::json_conversion($json_object["label"],"new");
			$json_new["elements"][] = CS_function::json_conversion($json_object["object"],"new");
		}
		
		
		
		return $json_new;
    }
    
    public function json_old() 
	{
        $json_old = [];
		
		
		
		
		return $json_old;
    }
    
    public function json($flag = false, $version = "old") 
	{
        
		switch($version) 
		{
        
			case "new" : $json = $this->json_new();
            
			case "old" : $json = $this->json_old();
        }
        
        return $flag ? $json : json_encode($json, 256);
    }
    
    public function __toString() 
	{
        return "";
    }
}




/*
CS sinod
"category":	"Tree"
"type": "Tree"

[
	"type" => [
		"CS" => ,
		"new" => ,
		"old" =>
	],
	"data" => [[]];
	"elements" => ,
	"nodes" => [],
	"titles" => [
		"edge" => [],
		"node" => []
	],
	"layout" => [
		"position" => [
			"x" => ,
			"y" =>
		],
		"size" => ,
		"ratio" => ,
		"direction" => ,
		"display" =>
	]
	
]


new sinod

"category":	"Tree"
"type": "Tree"

[
	"type" => "Tree",
	"elements" => ,
	"nodes" => [],
	"edgeTitles" => [],
	"nodeTitles" => [],
	"position" => [
		"left" => ,
		"top" =>
	],
	"size" => ,
	"ratio" => ,
	"flow" => ,
	"display" =>
	
]


old sinod

"type": "Tree"

[
	"type" => "Tree",
	"value" => [[]]
]

*/
	
	
	
class CS_Tree
{
	public $json_CS;
	
	public function __construct($json_CS)
	{
		$this->json_CS = $json_CS;
	}
    
    public function json_new() 
	{
        $json_new = [];
		
		$json_new["type"] = $this->json_CS["type"]["new"];
		
		$json_new["elements"] = $this->json_CS["elements"];
		
		$json_new["nodes"] = [];
		foreach($this->json_CS["nodes"] as $json_object)
		{
			$json_new["nodes"][] = CS_function::json_conversion($json_object,"new");
		}
		
		$json_new["edgeTitles"] = [];
		foreach($this->json_CS["titles"]["edge"] as $json_object)
		{
			$json_new["edgeTitles"][] = CS_function::json_conversion($json_object,"new");
		}
		
		$json_new["nodeTitles"] = [];
		foreach($this->json_CS["titles"]["node"] as $json_object)
		{
			$json_new["nodeTitles"][] = CS_function::json_conversion($json_object,"new");
		}	
		
		$json_new["position"] = [];
		$json_new["position"]["left"] = $this->json_CS["layout"]["position"]["x"];
		$json_new["position"]["right"] = $this->json_CS["layout"]["position"]["y"];
		
		$json_new["size"] = $this->json_CS["layout"]["size"];
		
		$json_new["ratio"] = $this->json_CS["layout"]["ratio"];
		
		$json_new["flow"] = $this->json_CS["layout"]["direction"];
		
		$json_new["display"] = $this->json_CS["layout"]["display"];
		
		return $json_new;
    }
    
    public function json_old() 
	{
        $json_old = [];
		
		$json_old["type"] = $this->json_CS["type"]["old"];
		
		$json_old["value"] = [];
		foreach ($this->json_CS["data"] as $json_object)
		{
			$value = [];
			foreach ($json_object as $json_object_1)
			{
				$value[] = CS_function::json_conversion($json_object_1,"old");
			}
			$json_old["value"][] = $value;
		}
		
		
		return $json_old;
    }
    
    public function json($flag = false, $version = "old") 
	{
        
		switch($version) 
		{
        
			case "new" : $json = $this->json_new();
            
			case "old" : $json = $this->json_old();
        }
        
        return $flag ? $json : json_encode($json, 256);
    }
    
    public function __toString() 
	{
        return "";
    }
}



/*
CS sinod
"category":	"Tree"
"type": "TreeNode"

[
	"type" => [
		"CS" => ,
		"new" => ,
		"old" =>
	],
	"label" => [
		"node" => ,
		"edge" =>
	],
	"children" => [],
	"style" => [
		"color" => ,
		"visible" => [
			"edge" => 
		],
		"border" => [
			"type" => ,
			"color" =>
		]
	]
	
]


new sinod

"category":	"Tree"
"type": "TreeNode"

[
	"type" => "TreeNode",
	"content" => ,
	"label" => ,
	"children" => [],
	"style" => [
		"color" => ,
		"lineVisible" => ,
		"border" => [
			"style" => ,
			"color" =>
		]
	]
	
]


old sinod



*/
	
	
	
class CS_TreeNode
{
	public $json_CS;
	
	public function __construct($json_CS)
	{
		$this->json_CS = $json_CS;
	}
    
    public function json_new() 
	{
        $json_new = [];
		
		$json_new["type"] = $this->json_CS["type"]["new"];
		
		$json_new["content"] = CS_function::json_conversion($this->json_CS["label"]["node"],"new");
		
		$json_new["label"] = CS_function::json_conversion($this->json_CS["label"]["edge"],"new");
		
		$json_new["children"] = [];
		foreach ($this->json_CS["children"] as $json_object)
		{
			$json_new["children"][] = CS_function::json_conversion($json_object,"new");
			
		}
		
		$json_new["style"] = [];
		$json_new["style"]["color"] = CS_function::color_conversion($this->json_CS["style"]["color"],"new");
		$json_new["style"]["lineVisible"] = $this->json_CS["style"]["visible"]["edge"];
		$json_new["style"]["border"] = [];
		$json_new["style"]["border"]["style"] = $this->json_CS["style"]["border"]["type"];
		$json_new["style"]["border"]["color"] = CS_function::color_conversion($this->json_CS["style"]["border"]["color"],"new");
		
		
		return $json_new;
    }
    
    public function json_old() 
	{
        $json_old = [];
		
		
		
		return $json_old;
    }
    
    public function json($flag = false, $version = "old") 
	{
        
		switch($version) 
		{
        
			case "new" : $json = $this->json_new();
            
			case "old" : $json = $this->json_old();
        }
        
        return $flag ? $json : json_encode($json, 256);
    }
    
    public function __toString() 
	{
        return "";
    }
}