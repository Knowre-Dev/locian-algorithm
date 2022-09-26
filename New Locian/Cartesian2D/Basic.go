package Cartesian2D
import (
	"fmt"
	
	"math"

	"reflect"

	"strconv"
	"strings"
	
)

func main() {
	
}





func array_unique(array []float64) []float64 {
	var array_unique []float64
	for len(array) != 0 {
		is_overlap := false
		for _, element := range array_unique {
			if array[0] == element {
				is_overlap = true
				break
			}
		}
		if is_overlap == false {
			array_unique = append(array_unique, array[0])
		}
		array = array[1:] 
		
	}
	
	return array_unique
}

func array_sort(array []float64) []float64 {
	var array_sorted []float64
	for _, element := range array {
		key := 0
		for _, element_1 := range array {
			if element <= element_1 {
				key++
			}
		}
		array_sorted[key] = element
	}
	return array_sorted
}


















































func in_array(value interface{}, array interface{}) bool {
	var result bool
	switch array.(type) {
		case []interface{}: {
			for _, value_array := range array.([]interface{}) {
				if reflect.DeepEqual(value, value_array) {
					result = true
					return result
				}
			}
		}
		case []string: {
			for _, value_array := range array.([]string) {
				if reflect.DeepEqual(value, value_array) {
					result = true
					return result
				}
			}
		}
		case []int: {
			for _, value_array := range array.([]int) {
				if reflect.DeepEqual(value, value_array) {
					result = true
					return result
				}
			}
		}
		case []float64: {
			for _, value_array := range array.([]float64) {
				if reflect.DeepEqual(value, value_array) {
					result = true
					return result
				}
			}
		}
		case []map[string]interface{}: {
			for _, value_array := range array.([]float64) {
				if reflect.DeepEqual(value, value_array) {
					result = true
					return result
				}
			}
		}
	}
	result = false
	return result
		
}


func is_array(variable interface{}) bool {
	var result bool
	switch variable.(type) {
		case []interface{}, map[string]interface{}: {
			result = true
			return result
		}
	}
	result = false
	return result
}

func is_equal_object(variable_1 interface{}, variable_2 interface{}) bool {
	var result bool
	result = reflect.DeepEqual(variable_1, variable_2)
	return result
}

func is_null(object interface{}) bool {
	return reflect.ValueOf(object).IsNil()
}

func is_float(variable interface{}) bool {
	var result bool
	switch variable.(type) {
		case float64: {
			result = true
			return result
		}
		case string: {
			for _, v := range strings.Split(variable.(string),"") {
				if v == "." || v < "0" || v > "9" {
					result = false
					return result
				}
			}
		}
	}
	result = false
	return result
}







func is_nan(number interface{}) bool {
	return math.IsNaN(to_float(number))
}
















func key_parenthesis_end(expression string, key_parenthesis_start int) int {
	expression_array := strings.Split(expression,"")
	sum := 1
	for i := key_parenthesis_start+1; i < len(expression_array); i++ {
		if expression_array[i] == "(" {
			sum++
		} else if expression_array[i] == ")" {
			sum--
			if sum == 0 {
				return i
			}
		}
	}
	var result int
	return result
}





















	










func to_float(object interface{}) float64 {
	var result float64
	switch object.(type) {
		case string: {
			object_converted, _ := strconv.ParseFloat(object.(string), 64)
			result = object_converted
			return result
		}
		case float64: {
			result = object.(float64)
			return result
		}
		case int: {
			result = float64(object.(int))
			return result
		}
		case bool: {
			if object == true {
				result = 1.0
			} else {
				result = 0.0
			}
			return result
		} 
	}
	return result
}

func to_int(object interface{}) int {
	var result int
	result = to_int(to_float(object))
	return result
}




func to_string(object interface{}) string {
	var result string
	if reflect.ValueOf(object).Kind() == reflect.Func {
		result = reflect.ValueOf(object).String()
		return result
	}
	result = fmt.Sprintf("%v", object)
	return result
}










