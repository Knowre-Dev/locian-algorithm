package Cartesian2D
type Region2D struct {
	curves []Curve2D
	

	id float64

	
}


type Set_Region2D struct {
	elements map[float64]Region2D
	label map[float64]Region2D
	curve_label map[float64]Region2D
}

func (set_region2d Set_Region2D) sort() {

}

func (set_region2d Set_Region2D) update(region2d Region2D) {
	set_region2d.elements[region2d.id] = region2d
	set_region2d.label[region2d.id] = region2d
	set_region2d.curve_label[region2d.id] = region2d
}
