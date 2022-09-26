package Cartesian2D

import (
	"math"
)

type Arc struct {
	center Coord
	start Coord
	angle float64
}





func (arc Arc) angle_end() float64 {
	return angle_polar(arc.angle_start()+arc.angle)
}

func (arc Arc) angle_start() float64 {
	return arc.start.vector_angle(arc.center)
}

func (arc Arc) center_on() Coord {
	radius := arc.center.distance(arc.start)
	angle := arc.center.vector_angle(arc.start)+arc.angle/2
	return Coord{radius*cos(angle),radius*sin(angle)}
}

func (arc Arc) end() Coord {
	return arc.start.rotation(arc.angle, arc.center)
}


func (arc Arc) interval_angle() Interval_angle {
	interval_angle := Interval_angle{}
	interval_angle.start = arc.center.vector_angle(arc.start)
	interval_angle.size = arc.angle
	return interval_angle
}

func (arc Arc) is_contained(arc_1 Arc) bool {
	return arc.center.is_equal(arc_1.center) == true && is_equal(arc.radius(), arc_1.radius()) == true && arc.interval_angle().is_contained(arc_1.interval_angle()) == true
}

func (arc Arc) is_overlap(arc_1 Arc) bool {
	return arc.center.is_equal(arc_1.center) == true && is_equal(arc.radius(), arc_1.radius()) == true && arc.interval_angle().is_overlap(arc_1.interval_angle()) == true
}

func (arc Arc) is_tangent(segment Segment) bool {
	a := segment.end.y-segment.start.y
	b := -(segment.end.x-segment.start.x)
	c_1 := -a*segment.start.x-b*segment.start.y
	c_2 := b*arc.start.x-a*arc.start.y
	intersection := Coord{}
	intersection.x = -(b*c_1+a*c_2)/(pow(a,2)+pow(b,2))
	intersection.y = (-a*c_1+b*c_2)/(pow(a,2)+pow(b,2))
	vector_intersection := intersection.subtract(arc.center)
	if is_equal(vector_intersection.norm(),arc.radius()) == true && is_between_angles(vector_intersection.angle(),arc.angle_start(),arc.angle_end()) {
		return true
	}
	return false
}

func (arc Arc) radius() float64 {
	return arc.center.distance(arc.start)
}

func (arc Arc) rotation(angle float64, coord ...Coord) Arc {
	center := Coord{0, 0}
	if len(coord) == 1 {
		center = coord[0]
	}
	var arc_rotation Arc 
	arc_rotation.angle = arc.angle
	arc_rotation.center = arc.center.rotation(angle, center)
	arc_rotation.start = arc.start.rotation(angle, center)
	return arc_rotation
}

func (arc Arc) translation(coord Coord) Arc {
	var arc_translation Arc
	arc_translation.angle = arc.angle
	arc_translation.center = arc.center.addition(coord)
	arc_translation.start = arc.start.addition(coord)
	return arc_translation
	
}

func (arc Arc) union(arc_1 Arc) Arc {
	union := Arc{}
	if arc.is_overlap(arc_1) == false {
		return union
	}
	interval_angle := arc.interval_angle()
	angle_start_1 := arc_1.angle_start()
	angle_end_1 := arc_1.angle_end()
	union.center = arc.center
	if interval_angle.is_containing(angle_start_1) == true {
		union.start = arc.start
		if interval_angle.is_containing(angle_end_1) == true {
			if arc.angle+arc_1.angle < 2*math.Pi {
				union.angle = arc.angle
			} else {
				union.angle = 2*math.Pi
			}
		} else {
			union.angle = arc.angle+angle_polar(angle_end_1-arc.angle_end())
		}
	} else {
		union.start = arc_1.start
		if interval_angle.is_containing(angle_end_1) == true {
			union.angle = min(2*math.Pi, angle_polar(arc.angle_end()-angle_end_1)+arc_1.angle)
		} else {
			union.angle = arc_1.angle
		}
	}
	return union
}