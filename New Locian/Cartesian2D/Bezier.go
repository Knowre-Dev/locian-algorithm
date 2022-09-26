package Cartesian2D

import (
	"math"
)
type Bezier struct {
	start Coord
	end Coord
	height float64
}

func (bezier Bezier) angle_start() float64 {
	angle := bezier.start.vector_angle(bezier.end)
	length := bezier.start.distance(bezier.end)/2
	return angle_polar(angle+atan2_polar(2*bezier.height,length))
	
}

func (bezier Bezier) angle_end() float64 {
	angle := bezier.end.vector_angle(bezier.start)
	length := bezier.end.distance(bezier.start)/2
	return angle_polar(angle-atan2_polar(2*bezier.height,length))
}

func (bezier Bezier) center() Coord {
	center_segment := bezier.start.addition(bezier.end).multiplication_scalar(1/2)
	angle := angle_polar(bezier.start.vector_angle(bezier.end)+sign(bezier.height)*math.Pi/2)
	vector := Coord{bezier.height*cos(angle), bezier.height*sin(angle)}
	return center_segment.addition(vector)
}



func (bezier Bezier) rotation(angle float64, coord ...Coord) Bezier {
	center := Coord{0, 0}
	if len(coord) == 1 {
		center = coord[1]
	}
	var bezier_rotation Bezier
	bezier_rotation.start = bezier.start.rotation(angle, center)
	bezier_rotation.end = bezier.end.rotation(angle, center)
	bezier_rotation.height = bezier.height
	return bezier_rotation
	
}

func (bezier Bezier) translation(coord Coord) Bezier {
	var bezier_translation Bezier
	bezier_translation.start = bezier.start.addition(coord)
	bezier_translation.end = bezier.end.addition(coord)
	bezier_translation.height = bezier.height
	return bezier_translation
	
}