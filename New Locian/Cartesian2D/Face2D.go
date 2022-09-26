package Cartesian2D

type Face2D struct {
	vertices []Coord//counterclockwise
	id float64
	
}




func (face2d Face2D) label(set_label2d Set_Label2D) Label2D {
	var label2d_not_found Label2D
	for _, label2d := range set_label2d.elements {
		if face2d.id == label2d.id_object {
			return label2d
		}
	}
	return label2d_not_found
}

func (face2d Face2D) label_center(label2d Label2D) Coord {
	return face2d.figure().centroid_vertices()

}

func (face2d Face2D) figure() Polygon {
	var polygon Polygon
	polygon.vertices = face2d.vertices
	return polygon
}



type Set_Face2D struct {
	elements map[float64]Face2D
	label map[float64]Face2D
}

func (set_face2d Set_Face2D) setup_label(set_label2d Set_Label2D) Set_Label2D {
	for _, face2d := range set_face2d.label {
		label2d := face2d.label(set_label2d)
		label2d.center = face2d.label_center(label2d)
		set_label2d.update(label2d)
	
	}
	return set_label2d
}

func (set_face2d Set_Face2D) sort(set_label2d Set_Label2D) {
	for _, face2d := range set_face2d.elements {
		if is_null(face2d.label) == false {
			set_face2d.label[face2d.id] = face2d
		}
	}

}

func (set_face2d Set_Face2D) update(face2d Face2D) {
	set_face2d.elements[face2d.id] = face2d
	set_face2d.label[face2d.id] = face2d
}