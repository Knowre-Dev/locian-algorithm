package Cartesian2D

import (
	//"math"
)

type Asector struct {
	center Coord
	start Coord
	end Coord
	height float64
	
}


func (asector Asector) angle() float64 {
	return angle_polar(asector.angle_end()-asector.angle_start())
}

func (asector Asector) angle_end() float64 {
	return asector.center.vector_angle(asector.end)
}

func (asector Asector) angle_start() float64 {
	return asector.center.vector_angle(asector.start)
}

func (asector Asector) arc() Arc {
	var arc Arc
	arc.center = asector.center
	angle_start := asector.angle_start()
	arc.start = Coord{asector.height*cos(angle_start), asector.height*sin(angle_start)}
	arc.angle = asector.angle()
	return arc
}







func (asector Asector) interval_angle() Interval_angle {
	var interval_angle Interval_angle
	interval_angle.start = asector.center.vector_angle(asector.start)
	interval_angle.size = angle_polar(asector.end.angle()-asector.start.angle())
	return interval_angle
}

func (asector Asector) is_overlap(asector_1 Asector) bool {
	if asector.center.is_equal_approximately(asector_1.center) == true && asector.interval_angle().is_overlap(asector_1.interval_angle()) == true {
		return true
	}
	return false
}

func (asector Asector) rotation(angle float64, coord ...Coord) Asector {
	center := Coord{0, 0}
	if len(coord) == 1 {
		center = coord[0]
	}
	var angle_rotation Asector
	angle_rotation.center = asector.center.rotation(angle, center)
	angle_rotation.start = asector.start.rotation(angle, center)
	angle_rotation.end = asector.end.rotation(angle, center)
	return angle_rotation
}

func (asector Asector) translation(coord Coord) Asector {
	var angle_translation Asector
	angle_translation.center = asector.center.addition(coord)
	angle_translation.start = asector.start.addition(coord)
	angle_translation.end = asector.end.addition(coord)
	return angle_translation
}