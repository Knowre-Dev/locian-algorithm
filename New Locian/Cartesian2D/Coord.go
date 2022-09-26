package Cartesian2D

import (
	"math"
)

type Coord struct {
	x float64
	y float64
}



func (coord Coord) addition(coord_1 Coord) Coord {
    var coord_addition Coord
	coord_addition.x = coord.x+coord_1.x
	coord_addition.y = coord.y+coord_1.y 
    return coord_addition
}

func (coord Coord) affine_sum(t float64, coord_1 Coord) Coord {
	var coord_sum Coord
	coord_sum.x = t*coord.x+(1-t)*coord_1.x
	coord_sum.y = t*coord.x+(1-t)*coord_1.y
	return coord_sum
}

func (coord Coord) angle() float64 {
	return 	atan2_polar(coord.y,coord.x)
}

func (coord Coord) distance(coord_1 Coord) float64 {
	return math.Sqrt(math.Pow(coord.x-coord_1.x,2)+math.Pow(coord.y-coord_1.y,2))
}

func (coord Coord) distance_bezier(bezier Bezier) float64 {
	segment := Segment{bezier.start, bezier.end}
	if coord.is_contained(segment) == false {
		var distance float64
		return distance
	}
	t := sqrt(coord.distance(segment.start))/segment.length()
	return 4*abs(bezier.height)*t*(1-t)
}

func (coord Coord) inner_product(coord_1 Coord) float64 {
	return coord.x*coord_1.x+coord.y*coord_1.y
}

func (coord Coord) is_contained(object interface{}) bool {
	switch object.(type) {
		case Arc: {
			arc := object.(Arc)
			if coord.is_equal(arc.center) == false && is_equal(coord.distance(arc.center),arc.radius()) == true && is_between_angles(arc.center.vector_angle(coord),arc.angle_start(),arc.angle_end()) == true {
				return true
			}
			return false

		}
		case Rectangle: {
			rectangle := object.(Rectangle)
			coord_rotation := coord.rotation(-rectangle.angle,rectangle.center)
			if abs(coord_rotation.x-rectangle.center.x) <= rectangle.size.x/2 && abs(coord_rotation.y-rectangle.center.y) <= rectangle.size.y/2 {
				return true
			}
			return false
		}
		case Segment: {
			segment := object.(Segment)
			if coord.is_equal(segment.start) == true || coord.is_equal(segment.end) == true{
				return true
			}
			return is_equal_angle(coord.vector_angle(segment.start), -coord.vector_angle(segment.end))

		}
	}
	return false
}

func (coord Coord) is_contained_strictly(object interface{}) bool {
	switch object.(type) {
		case Arc: {
			arc := object.(Arc)
			angle := arc.center.vector_angle(coord)
			if coord.is_contained_strictly(arc) && angle != arc.angle_start() && angle != arc.angle_end() {
				return true
			}
			return false

		}
		case Rectangle: {
			rectangle := object.(Rectangle)
			coord_rotation := coord.rotation(-rectangle.angle,rectangle.center)
			if abs(coord_rotation.x-rectangle.center.x) < rectangle.size.x/2 && abs(coord_rotation.y-rectangle.center.y) < rectangle.size.y/2 {
				return true
			}
			return false
		}
		case Segment: {
			segment := object.(Segment)
			if coord.is_contained(segment) == true && coord.is_equal(segment.start) == false && coord.is_equal(segment.end) == false {
				return true
			}
			return false 
		}
	}
	return false
}


func (coord Coord) is_equal(coord_1 Coord) bool {
	if coord.x != coord_1.x || coord.y != coord_1.y {
		return false
	}
	return true
}

func (coord Coord) is_equal_approximately(coord_1 Coord) bool {
	if coord.distance(coord_1) < 0.01 {
		return true
	}
	return false
}

func (coord Coord) norm() float64 {
	return math.Sqrt(math.Pow(coord.x,2)+math.Pow(coord.y,2))

}

func (coord Coord) subtract(coord_1 Coord) Coord {
	coord_subtraction := Coord{}
	coord_subtraction.x = coord.x-coord_1.x
	coord_subtraction.y = coord.y-coord_1.y
	return coord_subtraction
}

func (coord Coord) rotation(angle float64, coord_1 ...Coord) Coord {
	center := Coord{0,0} 
	if len(coord_1) == 1 {
		center = coord_1[0]
	}
	coord_2 := coord.subtraction(center)
	coord_2.x = math.Cos(angle)*coord_2.x-math.Sin(angle)*coord_2.y
	coord_2.y = math.Sin(angle)*coord_2.x+math.Cos(angle)*coord_2.y
	return coord_2.addition(center)
	
}

func (coord Coord) subtraction(coord_1 Coord) Coord {
    var coord_subtraction Coord
	coord_subtraction.x = coord.x-coord_1.x
	coord_subtraction.y = coord.y-coord_1.y 
    return coord_subtraction
}

func (coord Coord) is_within(coord_1 Coord, radius float64) bool {
	if coord.distance(coord_1) <= radius {
		return true
	}
	return false
}

func (coord Coord) multiplication_entrywise(coord_1 Coord) Coord {
	var coord_multiplication Coord
	coord_multiplication.x = coord.x*coord_1.x
	coord_multiplication.y = coord.y*coord_1.y
	return coord_multiplication
}

func (coord Coord) multiplication_scalar(scalar float64) Coord {
	var coord_multiplication Coord
	coord_multiplication.x = scalar*coord.x
	coord_multiplication.y = scalar*coord.y
	return coord_multiplication
}

func (coord Coord) vector_angle(coord_1 Coord) float64 {
	coord_subtraction := coord.subtraction(coord_1)
	return atan2_polar(coord_subtraction.y, coord_subtraction.x)
}
