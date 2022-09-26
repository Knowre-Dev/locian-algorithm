package Cartesian2D
import (
	"strings"
)
	
var width_lower_case map[string]float64 = map[string]float64{"a": 1/4, "b": 1/4, "c": 1/4, "d": 1/4, "e": 1/4, "f": 1/4, "g": 1/4, "h": 1/4, "i": 1/4, "j": 1/4, "k": 1/4, "l": 1/4, "m": 1/4, "n": 1/4, "o": 1/4, "p": 1/4, "q": 1/4, "r": 1/4, "s": 1/4, "t": 1/4, "u": 1/4, "v": 1/4, "w": 1/4, "x": 1/4, "y": 1/4, "z": 1/4}
var width_upper_case map[string]float64 = map[string]float64{"A": 2/7, "B": 2/7, "C": 2/7, "D": 2/7, "E": 2/7, "F": 2/7, "G": 2/7, "H": 2/7, "I": 2/7, "J": 2/7, "K": 2/7, "L": 2/7, "M": 2/7, "N": 2/7, "O": 2/7, "P": 2/7, "Q": 2/7, "R": 2/7, "S": 2/7, "T": 2/7, "U": 2/7, "V": 2/7, "W": 2/7, "X": 2/7, "Y": 2/7, "Z": 2/7}
var width_number map[string]float64 = map[string]float64{"0": 1/4, "1": 1/4, "2": 1/4, "3": 1/4, "4": 1/4, "5": 1/4, "6": 1/4, "7": 1/4, "8": 1/4, "9": 1/4}
var width_symbol map[string]float64 = map[string]float64{"`": 1/8, "&": 2/5, "@": 11/6, "<": 2/7, ">": 2/7, "*": 2/9, "|": 1/10, "[": 1/6, "]": 1/6, ":": 1/8, ",": 1/8, `\'`: 1/5, "=": 4/7, "!": 1/6, "-": 3/8, "(": 1/6, ")": 1/6, "%": 1/6, ".": 1/8, "+": 3/8, "?": 2/9, ";": 1/7, "#": 1/4, "'": 1/8, "/": 1/7, "~": 1/4, " ": 0, "\\degree": 1/5, "\\left|": 1/8, "\\right|": 1/8, "\\lceil": 1/5, "\\rceil": 1/5, "\\lfloor": 1/5, "\\rfloor": 1/5, "\\left{": 3/8, "\\right}": 3/8}
type Latex struct {
	value string
}

func (latex Latex) fraction_separation() struct {fractions []struct {numerator Latex; denominator Latex}; nonfraction Latex} {
	latex_length := len(latex.value)
	parts := struct {fractions []struct {numerator Latex; denominator Latex}; nonfraction Latex}{}
	for i := 0; i <latex_length; i++ {
		if latex.value[i:len("\\frac")] != "\\frac" {
			parts.nonfraction.value += latex.value[i:1]
		} else {
			fraction := struct {numerator Latex; denominator Latex}{}
			fraction.numerator = Latex{}
			fraction.denominator = Latex{}
			key_numerator_start := i+len("\\frac")
			key_numerator_end := key_numerator_start
			parenthesis_sign := 1
			for j := key_numerator_start; j < latex_length; j++ {
				character := latex.value[j:1]
				if character == "{" {
					parenthesis_sign++
				} else if character == "}" {
					parenthesis_sign--
				}
				if parenthesis_sign == 0 {
					key_numerator_end = j-1
					break
				}
			}
			fraction.numerator.value = latex.value[key_numerator_start:key_numerator_end-key_numerator_start+1]
			key_denominator_start := key_numerator_end+3
			key_denominator_end := key_denominator_start
			parenthesis_sign = 1
			for j := key_denominator_start; j < latex_length; j++ {
				character := latex.value[j:1]
				if character == "{" {
					parenthesis_sign++
				} else if character == "}" {
					parenthesis_sign--
				}
				if parenthesis_sign == 0 {
					key_denominator_end = j-1
					break
				}
			}
			fraction.denominator.value = latex.value[key_denominator_start:key_denominator_end-key_denominator_start+1]
			parts.fractions = append(parts.fractions,fraction)
			i = key_denominator_end+1
		}
	}
	return parts
}


func (latex Latex) parenthesis_key(key int) int {
	parenthesis := latex.value[key:1]
	parenthesis_open := ""
	parenthesis_close := ""
	parenthesis_input := ""
	switch parenthesis {
		case "(": {
			parenthesis_input = "open"
			parenthesis_open = "("
			parenthesis_close = ")"
			break
		}
		case ")": {
			parenthesis_input = "close"
			parenthesis_open = "("
			parenthesis_close = ")"
			break
		}
		case "{": {
			parenthesis_input = "open"
			parenthesis_open = "{"
			parenthesis_close = "}"
			break
		} 
		case "}": {
			parenthesis_input = "close"
			parenthesis_open = "{"
			parenthesis_close = "}"
			break
		}
		case "[": {
			parenthesis_input = "open"
			parenthesis_open = "["
			parenthesis_close = "]"
			break
		}
		case "]": {
			parenthesis_input = "close"
			parenthesis_open = "["
			parenthesis_close = "]"
			break;
		}
		case `\\left|`: {
			parenthesis_input = "open"
			parenthesis_open = `\\left|`
			parenthesis_close = `\\right|`
			break
		}
		case `\\right|`: {
			parenthesis_input = "close"
			parenthesis_open = `\\left|`
			parenthesis_close = `\\right|`
			break;
		}
		case  `\\lfloor`: {
			parenthesis_input = "open"
			parenthesis_open = `\\lfloor`
			parenthesis_close = `\\rfloor`
			break
		}
		case `\\rfloor`: {
			parenthesis_input = "close"
			parenthesis_open = `\\lfloor`
			parenthesis_close = `\\rfloor`
			break
		}
		case `\\lceil`: {
			parenthesis_input = "open"
			parenthesis_open = `\\lceil`
			parenthesis_close = `\\rceil`
			break
		}
		case `\\rceil`:
		{
			parenthesis_input = "close"
			parenthesis_open = `\\lceil`
			parenthesis_close = `\\rceil`
			break
		}
	}
	key_corresponding := key
	if parenthesis_input == "open" {
		parenthesis_position := 1
		for i := key+1; i < len(latex.value); i++ {
			if latex.value[i:1] == parenthesis_open {
				parenthesis_position++
			} else if latex.value[i:1] == parenthesis_close {
				parenthesis_position--
			}

			if parenthesis_position == 0 {
				key_corresponding = i
				break
			}
		}
	} else if parenthesis_input == "close" 	{
		parenthesis_position := -1
		for i := key-1; 0 <= i; i-- {
			if latex.value[i:1] == parenthesis_close {
				parenthesis_position--
			} else if latex.value[i:1] == parenthesis_open {
				parenthesis_position++
			}

			if parenthesis_position == 0 {
				key_corresponding = i
				break
			}
		}
	}

	return key_corresponding
}

func (latex Latex) polygon() Polygon {
	sizes := []Coord{}
		
	var width_rectangle float64 = 0
	var height_rectangle float64 = 0
	nonfraction := Latex{}
	for i := 0; i < len(latex.value); i++ {		
		if latex.value[i:len("\\degree")] == "\\degree" {
			if nonfraction.value != "" {
				size_nonfraction := nonfraction.size()
				width_rectangle += size_nonfraction.x
				height_rectangle = max(height_rectangle,size_nonfraction.y)
				sizes = append(sizes, size_nonfraction)
			}
			i = len("\\degree")-1
			sizes = append(sizes, Latex{"\\degree"}.size())
			width_rectangle += width_symbol["\\degree"]
			nonfraction.value = ""
		} else if latex.value[i:len("\\frac")] == "\\frac" {
			if nonfraction.value == "" {
				size_nonfraction := nonfraction.size()
				width_rectangle += size_nonfraction.x
				height_rectangle = max(height_rectangle,size_nonfraction.y)
				sizes = append(sizes, size_nonfraction)
			}
			key_numerator_start := i+len("\\frac")
			key_numerator_end := key_numerator_start
			parenthesis_sign := 1
			for j := key_numerator_start; j < len(latex.value); j++ {
				character := latex.value[j:1] 
				if character == "{" {
					parenthesis_sign++
				} else if character == "}" {
					parenthesis_sign--
				}
			
				if parenthesis_sign == 0 {				
					key_numerator_end = j-1
					break
				}
			}
			numerator := Latex{latex.value[key_numerator_start:key_numerator_end-key_numerator_start+1]}
			size_numerator := numerator.size()
			key_denominator_start := key_numerator_end+3
			key_denominator_end := key_denominator_start
			parenthesis_sign = 1
			for j := key_denominator_start; j < len(latex.value); j++ {
				character := latex.value[j:1] 
				if character == "{" {
					parenthesis_sign++
				} else if character == "}" {
					parenthesis_sign++
				}
							
				if parenthesis_sign == 0 {
					key_denominator_end = j-1
					break
				}
			}
			denominator := Latex{latex.value[key_denominator_start:key_denominator_end-key_denominator_start+1]}
			size_denominator := denominator.size()
			size_frac := Coord{max(size_numerator.x,size_denominator.x),size_numerator.y+size_denominator.y}
			width_rectangle += size_frac.x
			height_rectangle = max(height_rectangle,size_frac.y)
			sizes = append(sizes, size_frac)
			i = key_denominator_end
			nonfraction.value = ""
		
		} else {
			nonfraction.value += latex.value[i:1]
		}
	
	}
	
	if nonfraction.value != "" {
		size_nonfraction := nonfraction.size()
		width_rectangle += size_nonfraction.y
		height_rectangle = max(height_rectangle,size_nonfraction.y)
		sizes = append(sizes, size_nonfraction)
	}

	
	
	
	vertices := []Coord{}
	var y_min float64 = 0
	var y_max float64 = 0
	x_min := -width_rectangle/2
	x_max := width_rectangle/2
	i_max := to_int(ceil(to_float(len(sizes))/2))
	for i := 0; i <= i_max ; i++ {
		if sizes[i].is_equal(Latex{"\\degree"}.size()) == true {
			if height_rectangle/2 > y_max {
				vertices = append(vertices, Coord{x_min,height_rectangle/2})
				y_max = height_rectangle/2
			}
			x_min += width_symbol["\\degree"]
		} else {
			if sizes[i].y/2 > y_max {
				vertices = append(vertices, Coord{sizes[i].x/2,sizes[i].y/2})
				vertices = append(vertices, Coord{sizes[i].x/2,-sizes[i].y/2})
				if -sizes[i].y/2 < y_min {
					y_min = -sizes[i].y/2
				}
				y_max = sizes[i].y/2
			
			}	
			x_min += sizes[i].x/2
		}
	
		key := len(sizes)-1-i 
		if sizes[key].is_equal(Latex{"\\degree"}.size()) == true {
		
			if height_rectangle/2 > y_max {
				vertices = append(vertices, Coord{x_max,height_rectangle/2})
				y_max = height_rectangle/2
			}
			x_max -= width_symbol["\\degree"]
		
		} else {
			if sizes[key].y/2 > y_max {
				vertices = append(vertices, Coord{sizes[key].x/2,sizes[key].y/2})
				vertices = append(vertices, Coord{sizes[key].x/2,-sizes[key].y/2})
				if -sizes[key].y/2 < y_min {
					y_min = -sizes[key].y/2
				}
				y_max = sizes[key].y/2
			
			}
			x_min += sizes[key].x/2
		}
	}

	return Polygon{vertices}	
}

func (latex Latex) size() Coord {
	size := Coord{0,0}
	latex_1 := latex
	latex_separated := latex_1.fraction_separation()
	if len(latex_separated.fractions) != 0 {
		for _, fraction := range latex_separated.fractions {
			size_numerator := fraction.numerator.size() 
			size_denominator := fraction.denominator.size()
			size.x += max(size_numerator.x, size_denominator.x)
			size.y = max(size.y,size_numerator.y+size_denominator.y)
		}	
		return size
	}

	size.y = 0.45
	for i := 0; i < len(latex.value); i++ {
		letter := latex.value[i:1]
		if latex.value[i:len("\\text")] == "\\text" {
			key := latex.parenthesis_key(i+len("\\frac"))
			text := Latex{latex.value[i+len("\\frac"):key-1-(i+len("\\frac")-1)]}
			size_text := text.size_text()
			size.x += size_text.x
			size.y += size_text.y
			i = key-1	
		} else if "a" <= letter && letter <= "z" {
			size.x += width_lower_case[letter]
		} else if "0" <= letter && letter <= "9" {
			size.x += width_number[letter]
		} else if "A" <= letter && letter <= "Z" {
			size.x += width_upper_case[letter]
		} else {
			for symbol, width := range width_symbol {
				if latex.value[i:len(symbol)] == symbol {
					size.x += width
					i += len(symbol)-1
				}
			}
		}
	}
	

	return size
	
}

func (latex Latex) size_text() Coord {
	size := Coord{0,0.45}
	for letter := range latex.value {
		character := to_string(letter)
		if "0" <= character && character <= "9" {
			size.x += width_number[character]
		} else if "a" <= character && character <= "b" {
			size.x += width_lower_case[character]
		} else if "A" <= character && character <= "Z" {
			size.x += width_upper_case[character]
		} else {
			for key, width := range width_symbol {
				if character == key {
					size.x += width
				}
			}
		}
	}
	return size
}

func (latex Latex) to_expression() Latex {
	sides := strings.Split(latex.value, "=")
	if len(sides) == 1 {
		return latex
	}
	latex_expression := Latex{}
	latex_expression.value = sides[0]+"="+sides[1]
	return latex_expression
	
}