package Cartesian2D

import (
	
	
	"math"
	
	
	
)

func abs(number interface{}) float64 {
	return math.Abs(to_float(number))

}

func acos(number interface{}) float64 {
	return math.Acos(to_float(number))
}

func asin(number interface{}) float64 {
	return math.Asin(to_float(number))
}

func atan(number interface{}) float64 {
	return math.Atan(to_float(number))

}


/*
	1. Function
		Compute inclucded angle of two angles
	2. Input
		$angle_1: angle of line_1
		$angle_2: angle of line_2
	3. Output
		Included angle
	*/

func angle_inclusion(angle_1 interface{}, angle_2 interface{}) float64 {
	angle_inclusion := angle_polar(to_float(angle_1)-to_float(angle_2))
	if angle_inclusion <= math.Pi {
		return angle_inclusion
	}
	return 2*math.Pi-angle_inclusion
}

/*
1. 기능
	각을 polar coordinate의 각으로 변환
2. 입력
	angle
3. 출력
	polar coordinate의 각으로 변형된 각
*/
func angle_polar(angle interface{}) float64 {
	return  to_float(angle)-2*math.Pi*math.Floor(to_float(angle)/(2*math.Pi))
}

/*
1. 기능
	atan2(number)를 계산해서 polar각으로 변환
2. 입력
	number
3. 출력
	number의 polar angle
*/
func atan2_polar(y interface{}, x interface{}) float64 {
	return angle_polar(math.Atan2(to_float(y),to_float(x)))
}

func atan2(y interface{}, x interface{}) float64 {
	return math.Atan2(to_float(y), to_float(x))
}


func ceil(number interface{}) float64 {
	return math.Ceil(to_float(number))
}

func cos(number interface{}) float64 {
	return math.Cos(to_float(number))
	
}


func coord_polar(radius float64, angle float64) Coord {
	return Coord{radius*cos(angle), radius*sin(angle)}
}

func deg2rad(degree interface{}) float64 {
	return angle_polar(to_float(degree)*math.Pi/180)
}



func exp(number interface{}) float64 {
	return math.Exp(to_float(number))

}

func floor(number interface{}) float64 {
	return math.Floor(to_float(number))

}

func inf() float64 {
	var result float64
	result = math.Inf(1)
	return result
}

/*
1. Function
	To check if an angle is between two angles
2. Input
	$angle: angle
	$start_angle: start angle
	$end_angle: end angle
3. Output
	true: between angles
	false: not bewteen angles
*/
func is_between_angles(angle interface{}, start_angle interface{}, end_angle interface{}) bool {
	if angle_polar(to_float(angle)-to_float(start_angle)) <= angle_polar(to_float(end_angle)-to_float(start_angle)) {
		return true
	}
	return false
}

func is_equal(number_1 interface{}, number_2 interface{}) bool {
	return abs(to_float(number_1) - to_float(number_2)) <= 0.01
}

/*
1. 기능
	두 angle이 근사적으로 일치하는지 판별
2. 입력
	$angle_1: angle
	$angle_2: angle
3. 출력
	true: 근사치 내
	false: 근사치 밖
*/
func is_equal_angle(angle_1 interface{}, angle_2 interface{}) bool {
	if abs(angle_polar(to_float(angle_1)-to_float(angle_2))) < deg2rad(1) {
		return true
	}

	return false
}



func log(number interface{}) float64 {
	return math.Log(to_float(number))
}

func log10(number interface{}) float64 {
	return math.Log10(to_float(number))

}



func max(numbers ...interface{}) float64 {
	max := to_float(numbers[0])
	for i := 1; i < len(numbers); i++ {
		i_float := to_float(numbers[i])
		if max < i_float {
			max = i_float
		}
	}
	return max
		
}



func min(numbers ...interface{}) float64 {
	min := to_float(numbers[0])
	for i := 1; i < len(numbers); i++ {
		i_float := to_float(numbers[i])
		if min > i_float {
			min = i_float
		}
	}
	return min

}	


/*
1. Function
	mod 계산
2. Input
	$a: real
	$b: positive real
3. Output
	$c: $a == $c (mod $b)
*/
func mod(a float64, b float64) float64 {
	c := math.Mod(a,b)
	if c < 0 {
		c += b
	}

	return c
}

func pow(base interface{}, exp interface{}) float64 {
	return math.Pow(to_float(base), to_float(exp))
	
}

func solutions_quadratic(a float64, b float64, c float64) []float64 {
	D := pow(a, 2)-4*a*c
	if D == 0.0 {
		return []float64{b/(2*a)}
	}
	if D > 0 {
		return []float64{(-b+D)/(2*a), (-b-D)/(2*a)}
	}
	var solutions []float64
	return solutions
}

func sin(number interface{}) float64 {
	return math.Sin(to_float(number))

}

func sqrt(number interface{}) float64 {
	return math.Sqrt(to_float(number))

}

func sign(number float64) float64 {
	if number < 0.0 {
		return -1.0
	}
	if number == 0.0 {
		return 0.0
	}
	return 1.0

}

func sign_angle(angle float64) float64 {
	return mod(angle,math.Pi)*sign(math.Pi-angle)
}

func tan(number interface{}) float64 {
	return math.Tan(to_float(number))

}













