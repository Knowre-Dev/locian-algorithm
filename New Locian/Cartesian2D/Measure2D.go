package Cartesian2D

import (
	//"math"
)

type Measure2D struct {
	start Coord
	end Coord
	height float64
	color string
	marker string

	id float64
}




func (measure2d Measure2D) figure() Bezier {
	//actually parabola
	return Bezier{measure2d.start, measure2d.end, measure2d.height}
}

func (measure2d Measure2D) label(set_label2d Set_Label2D) Label2D {
	var label2d_not_found Label2D
	for _, label2d := range set_label2d.elements {
		if measure2d.id == label2d.id_object {
			return label2d
		}
	}
	return label2d_not_found
}


func (measure2d Measure2D) label_center(label2d Label2D) Coord {
	rectangle := label2d.figure()
	distance := 0.5
	var angle_segment float64
	if measure2d.height >= 0 {
		angle_segment = measure2d.start.vector_angle(measure2d.end)
	} else {
		angle_segment = measure2d.end.vector_angle(measure2d.start)
	}
	rectangle.angle = -angle_segment
	vector_center := rectangle.center_with_distance(distance).rotation(-angle_segment,Coord{0,0})
	return measure2d.figure().center().addition(vector_center)


	
	
	
	

}