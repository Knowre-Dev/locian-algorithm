package Cartesian2D

type Label2D struct {
	center Coord
	value string
	
	id float64
	id_object float64
	type_object string
}





func (label2d Label2D) figure() Rectangle {
	rectangle := Rectangle{}
	rectangle.center = label2d.center
	rectangle.size = Latex{label2d.value}.size()
	rectangle.angle = 0.0
	return rectangle
}




func (label2d Label2D) size() Coord {
	return Latex{label2d.value}.size()

}



type Set_Label2D struct {
	elements map[float64]Label2D
	vertices []Coord
}


func (set_label2d Set_Label2D) update(label2d Label2D) {
	set_label2d.elements[label2d.id] = label2d
	
}
