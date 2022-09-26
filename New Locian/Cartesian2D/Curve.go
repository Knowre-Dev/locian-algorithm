package Cartesian2D

import (
	"strings"
)

type Curve struct {
	equation string
	domain Bounds
}

func (curve Curve) expression() string {
	var left string
	for i := 0; i < len(curve.equation); i++ {
		if curve.equation[i:i+1] == "=" {
			return left+"-("+curve.equation[i+1:len(curve.equation)]+")"
		} 
		left += curve.equation[i:i+1]
	}
	return curve.equation
}


func (curve Curve) coords() []Coord {
	unit := 0.01
	expression := curve.expression()
	var bounds Bounds
	bounds.x = Interval{ceil(curve.domain.x.min), floor(curve.domain.x.max)}
	bounds.y = Interval{ceil(curve.domain.y.min), floor(curve.domain.y.max)}
	var coords []Coord
	number_x := to_int(bounds.x.length()/unit)
	number_y := to_int(bounds.y.length()/unit)
	for i := 0; i <number_x; i++ {
		for j := 0; j < number_y; j++ {
			x := bounds.x.min+to_float(i)*unit
			y := bounds.y.min+to_float(j)*unit
			curve_xy := to_float(evaluation(strings.ReplaceAll(strings.ReplaceAll(expression,"x",to_string(x)),"y",to_string(y))))
			if abs(curve_xy) < unit {
				coords = append(coords, Coord{x, y})
			}
		}
	}
	return coords
	
}

func (curve Curve) is_overlap(rectangle Rectangle) bool {
	coords := curve.coords()
	for _, coord := range coords {
		if coord.is_contained(rectangle) {
			return true
		}
	}
	return false
}

func (curve Curve) rotation(angle float64, coord ...Coord) Curve {
	center := Coord{0, 0}
	if len(coord) == 1 {
		center = coord[0]
	}
	x := to_string(cos(angle))+"*(x-"+to_string(center.x)+")-"+to_string(sin(angle))+"*(y-"+to_string(center.y)+")+"+to_string(center.x)
	y := to_string(sin(angle))+"*(x-"+to_string(center.x)+")+"+to_string(cos(angle))+"*(y-"+to_string(center.y)+")"+to_string(center.y)
	curve.equation = strings.ReplaceAll(strings.ReplaceAll(curve.equation,"x",x),"y",y)
	return curve
}

func (curve Curve) translation(coord Coord) Curve {
	x := "x+"+to_string(coord.x)
	y := "y+"+to_string(coord.y)
	curve.equation = strings.ReplaceAll(strings.ReplaceAll(curve.equation,"x",x),"y",y)
	return curve
}