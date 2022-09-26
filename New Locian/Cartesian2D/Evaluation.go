package Cartesian2D

import (
	
	"strconv"
)

func evaluation_constant(expression string) string {
	for expression[0:1] == "(" && expression[len(expression)-1:len(expression)] == ")" {
		return evaluation(expression[1:len(expression)-1])
	}
	var expression_evaluation string
	var constants map[string]string
	var real float64
	real, _ = strconv.ParseFloat("math.E",10)
	constants["math.E"] = to_string(real)
	real, _ = strconv.ParseFloat("math.Pi",10)
	constants["math.Pi"] = to_string(real)
	for i := 0; i < len(expression); i++ {
		for constant, value := range constants {
			if expression[i:i+len(constant)] == constant {
				expression_evaluation += value
				i = i+len(constant)-1
				break
			}
		}
	}
	return expression_evaluation
}

func evaluation(expression string) string {
	for expression[0:1] == "(" && expression[len(expression)-1:len(expression)] == ")" {
		return evaluation(expression[1:len(expression)-1])
	}
	expression = evaluation_constant(expression)

	var functions_one_input []string
	functions_one_input = append(functions_one_input, "abs")
	functions_one_input = append(functions_one_input, "acos")
	functions_one_input = append(functions_one_input, "asin")
	functions_one_input = append(functions_one_input, "atan")
	functions_one_input = append(functions_one_input, "ceil")
	functions_one_input = append(functions_one_input, "cos")
	functions_one_input = append(functions_one_input, "exp")
	functions_one_input = append(functions_one_input, "floor")
	functions_one_input = append(functions_one_input, "log")
	functions_one_input = append(functions_one_input, "sin")
	functions_one_input = append(functions_one_input, "sqrt")
	functions_one_input = append(functions_one_input, "tan")
	
	var functions_two_inputs []string
	functions_two_inputs = append(functions_two_inputs, "mod")
	functions_two_inputs = append(functions_two_inputs, "pow")
	operators := []string{"+","-","*","/"}
	numbers := []string{"0","1","2","3","4","5","6","7","8","9","."}
	var expression_evaluation string
	for i := 0; i < len(expression); i++ {
		if in_array(expression[i:i+1],operators) == true {
			expression_evaluation += expression[i:i+1]
		} else if expression[i:i+1] == "(" {
			key_end := key_parenthesis_end(expression, i)
			expression_evaluation += expression[i:i+1]
			expression_evaluation += evaluation(expression[i+1:key_end-1])
			expression_evaluation += expression[key_end:key_end+1]
			i = key_end
		} else if in_array(expression[i:i+1],numbers) == true {
			for j := i+1; i < len(expression); i++ {
				if in_array(expression[j],numbers) == false {
					expression_evaluation += expression[i:j]
					i = j-1
					break
				}
			}
		} else {
			for _, function := range functions_one_input {
				if expression[i:len(function)] == function {
					key_end := key_parenthesis_end(expression,i+len(function))
					input := to_float(evaluation(expression[i+len(function)+1:key_end]))
					switch function {
						case "abs": {
							expression_evaluation += to_string(abs(input))
						}
						case "acos": {
							expression_evaluation += to_string(acos(input))	
						}
						case "asin": {
							expression_evaluation += to_string(asin(input))
						}
						case "atan": {
							expression_evaluation += to_string(atan(input))		
						}
						case "ceil": {
							expression_evaluation += to_string(ceil(input))		
						}
						case "cos": {
							expression_evaluation += to_string(cos(input))		
						}
						case "exp": {
							expression_evaluation += to_string(exp(input))
						}
						case "floor": {
							expression_evaluation += to_string(floor(input))
						}
						case "log": {
							expression_evaluation += to_string(log(input))
						}
						case "sin": {
							expression_evaluation += to_string(sin(input))
						}
						case "sqrt": {
							expression_evaluation += to_string(sqrt(input))
						}
						case "tan": {
							expression_evaluation += to_string(tan(input))
						}	
						
					}
					i = key_end
				}
				for _, function := range functions_two_inputs {
					key_end := key_parenthesis_end(expression,i+len(function))
					sign := 0
					var input_1 float64
					var key_comma int
					for j := i+len(function)+1; j < len(expression); j++ {
						if expression[j:j+1] == "(" {
							sign++
						} else if expression[j:j+1] == "(" {
							sign--
						} else if expression[j:j+1] == "," && sign == 0 {
							key_comma = j
							input_1 = to_float(evaluation(expression[i+len(function):j-1]))
						}
					}
					input_2 := to_float(evaluation(expression[key_comma+1:key_end-1]))
					
					switch function {
						case "mod": {
							expression_evaluation += to_string(mod(input_1,input_2))
						}
						case "pow": {
							expression_evaluation += to_string(pow(input_1,input_2))
						}
						
						
					}
					i = key_end
				}
			}
		}

	}
	return evaluation_operator(expression_evaluation)

}

func evaluation_operator(expression string) string {
	for expression[0:1] == "(" && expression[len(expression)-1:len(expression)] == ")" {
		return evaluation(expression[1:len(expression)-1])
	}
	if expression[0:1] == "(" {
		key_end := key_parenthesis_end(expression,0)
		term_1 := evaluation_operator(expression[1:key_end])
		term_2 := evaluation_operator(expression[key_end+1:len(expression)])
		operator := expression[key_end+1:key_end+2]
		switch operator {
			case "+": {
				return to_string(to_float(term_1)+to_float(term_2))
			}
			case "-": {
				return to_string(to_float(term_1)-to_float(term_2))
			}
			case "*": {
				return to_string(to_float(term_1)*to_float(term_2))
			}
			case "/": {
				return to_string(to_float(term_1)/to_float(term_2))
			}
		}
		return expression
	}
	operators := []string{"+","-","*","/"}
	var operator string
	var key_operator int
	for i := 0; i < len(expression); i++ {
		if in_array(expression[i:i+1],operators) == true {
			key_operator = i
			operator = expression[i:i+1]
			break
		}
	}
	term_1 := evaluation_operator(expression[0:key_operator])
	term_2 := evaluation_operator(expression[key_operator+1:len(expression)])
	switch operator {
		case "+": {
			return to_string(to_float(term_1)+to_float(term_2))
		}
		case "-": {
			return to_string(to_float(term_1)-to_float(term_2))
		}
		case "*": {
			return to_string(to_float(term_1)*to_float(term_2))
		}
		case "/": {
			return to_string(to_float(term_1)/to_float(term_2))
		}
	}
	
	
	return expression
} 
