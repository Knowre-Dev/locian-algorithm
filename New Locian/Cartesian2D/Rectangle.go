package Cartesian2D
import (
	"math"
	"sort"
)

type Rectangle struct {
	center Coord
	size Coord
	angle float64
}

func (rectangle Rectangle) center_with_distance(distance float64) Coord {
	var length_right float64
	var length_left float64
	if (0 <= rectangle.angle && rectangle.angle < math.Pi/2) || (math.Pi <= rectangle.angle && rectangle.angle < 3*math.Pi/2) {
		length_right = rectangle.size.x
		length_left = rectangle.size.y
	} else {
		length_right = rectangle.size.y
		length_left = rectangle.size.x
	}
	angle_right := mod(rectangle.angle, math.Pi/2)
	angle_left := math.Pi/2-angle_right
	vector_right := Coord{length_right*cos(angle_right), length_right*sin(angle_right)}
	vector_left := Coord{-length_left*cos(angle_left), length_left*sin(angle_left)}
	
	radius_center := sqrt(pow(length_right,2)+pow(length_left,2))/2
	angle_center := angle_right+atan2_polar(length_left,length_right)
	vector_center := Coord{radius_center*cos(angle_center),radius_center*sin(angle_center)} 
	var coord_min Coord
	coord_min.y = distance
	coord_min.x = -((vector_right.x+vector_left.x)*coord_min.y+vector_right.x*vector_left.y+vector_left.x*vector_right.y)/(2*coord_min.y+vector_right.y+vector_left.y)
	angle_min := atan2_polar(coord_min.y, coord_min.x)
	if angle_right <= angle_min && angle_min <= math.Pi-angle_left {
		return coord_min.addition(vector_center)
	}

	if angle_left <= angle_right {
		coord_min.x = -vector_left.x/(2*coord_min.y+vector_left.y)
	} else {
		coord_min.x = -vector_right.x/(2*coord_min.y+vector_right.y)
	}

	return coord_min.addition(vector_center)

}

func (rectangle Rectangle) center_between_halflines(center Coord, interval_angle Interval_angle, distance_min float64) Coord {
	if interval_angle.size >= math.Pi {
		angle_end := interval_angle.end()
		if 0 <= interval_angle.start && interval_angle.start <= math.Pi && 0 <= angle_end && angle_end <= math.Pi {
			radius := distance_min+rectangle.size.y/2
			angle := 3*math.Pi/2
			return Coord{radius*cos(angle), radius*sin(angle)}
		}
		if math.Pi <= interval_angle.start && interval_angle.start <= 2*math.Pi && math.Pi <= angle_end && angle_end <= 2*math.Pi {
			radius := distance_min+rectangle.size.y/2
			angle := math.Pi/2
			return Coord{radius*cos(angle), radius*sin(angle)}
		}
		if math.Pi <= interval_angle.start && interval_angle.start <= 3*math.Pi/2 && math.Pi/2 <= angle_end && angle_end <= math.Pi {
			radius := distance_min+rectangle.size.x/2
			angle := 0
			return Coord{radius*cos(angle), radius*sin(angle)}
		}
		if 0 <= interval_angle.start && interval_angle.start <= math.Pi/2 && 3*math.Pi/2 <= angle_end && angle_end <= 2*math.Pi {
			radius := distance_min+rectangle.size.x/2
			angle := math.Pi
			return Coord{radius*cos(angle), radius*sin(angle)}
		}
	}
	angle_center := angle_polar(interval_angle.start+interval_angle.size/2)
	angle_diagonal := rectangle.size.angle()
	diagonal := rectangle.size.norm()
	var angle_diagonal_rotation float64
	size := Coord{}
	if angle_inclusion(angle_center, 0) <= angle_diagonal || angle_inclusion(angle_center, math.Pi) <= angle_diagonal {
		size = rectangle.size
		angle_diagonal_rotation = angle_diagonal
	} else {
		size = Coord{rectangle.size.y, rectangle.size.x}
		angle_diagonal_rotation = math.Pi/2-angle_diagonal
	}

	angles_vertex := []float64{}
	angles_vertex = append(angles_vertex, angle_polar(angle_diagonal_rotation-angle_center))
	angles_vertex = append(angles_vertex, angle_polar(math.Pi-angle_diagonal_rotation-angle_center))
	angles_vertex = append(angles_vertex, angle_polar(math.Pi+angle_diagonal_rotation-angle_center))
	angles_vertex = append(angles_vertex, angle_polar(2*math.Pi-angle_diagonal_rotation-angle_center))
	
	sort.Float64s(angles_vertex)
	angle_0 := math.Pi/2-min(angle_inclusion(math.Pi, (angles_vertex[0]+angles_vertex[1])/2), angle_inclusion(math.Pi, (angles_vertex[2]+angles_vertex[3])/2))
	distance_0 := distance_min+size.x/2
	var distance_1 float64
	if distance_0*tan(angle_0) <= size.y/2 {
		distance_1 = distance_0/cos(angle_0)
	} else {
		angle_1 := math.Pi/2
		for _, angle := range angles_vertex {
			angle_1 = min(angle_1, angle_inclusion(math.Pi, angle))
		}
		distance_1 = diagonal/2*cos(angle_1)+sqrt(pow(distance_min, 2)-pow(diagonal/2*sin(angle_1), 2))
	}
	distances := []float64{distance_1}
	if interval_angle.size < math.Pi {
		for i := 0; i < 4; i++ {
			distances = append(distances, abs(diagonal/2*sin(angles_vertex[i]))/tan(interval_angle.size/2))
		}
	}
	radius := max(distances)
	return Coord{radius*cos(angle_center), radius*sin(angle_center)}
}

func (rectangle Rectangle) diagonal() float64 {
	return sqrt(pow(rectangle.size.x, 2)+pow(rectangle.size.y, 2))
}

func (rectangle Rectangle) is_contained(rectangle_1 Rectangle) bool {
	vertices := rectangle.vertices()
	for _, vertex := range vertices {
		if vertex.is_contained(rectangle_1) == false {
			return false
		}
	}
	return true

}

func (rectangle Rectangle) is_overlap(rectangle_1 Rectangle) bool {
	//center := Coord{0.0, 0.0}
	rectangle_rotated := rectangle.rotation(0.0)
	angle := angle_polar(rectangle_1.angle-rectangle.angle)
	//rectangle_1_rotated := rectangle_1.rotation(angle)
	var bounds Bounds
	bounds.x.min = rectangle_rotated.center.x-rectangle_rotated.size.x/2
	bounds.x.max = rectangle_rotated.center.x+rectangle_rotated.size.x/2
	bounds.y.min = rectangle_rotated.center.y-rectangle_rotated.size.y/2
	bounds.y.max = rectangle_rotated.center.y+rectangle_rotated.size.y/2
	
	vertex_00 := Coord{rectangle_1.center.x-rectangle_1.size.x/2, rectangle_1.center.y-rectangle_1.size.y/2}.rotation(angle)
	vertex_01 := Coord{rectangle_1.center.x-rectangle_1.size.x/2, rectangle_1.center.y+rectangle_1.size.y/2}.rotation(angle)
	vertex_10 := Coord{rectangle_1.center.x+rectangle_1.size.x/2, rectangle_1.center.y-rectangle_1.size.y/2}.rotation(angle)
	vertex_11 := Coord{rectangle_1.center.x+rectangle_1.size.x/2, rectangle_1.center.y+rectangle_1.size.y/2}.rotation(angle)

	

	a_0 := vertex_10.y-vertex_00.y
	b_0 := -(vertex_10.x-vertex_00.x)
	c_00 := a_0*vertex_00.x+b_0*vertex_00.y
	c_01 := a_0*vertex_01.x+b_0*vertex_01.y 
	if c_00 > c_01 {
		a_0 = -a_0
		b_0 = -b_0
		c_00 = -c_00
		c_01 = -c_01
	}
	interval_00 := Interval{c_00, c_01}
	
	var interval_01 Interval
	interval_01.min = min(a_0*bounds.x.min+b_0*bounds.y.min, a_0*bounds.x.min+b_0*bounds.y.max, a_0*bounds.x.max+b_0*bounds.y.min, a_0*bounds.x.max+b_0*bounds.y.max) 
	interval_01.max = max(a_0*bounds.x.min+b_0*bounds.y.min, a_0*bounds.x.min+b_0*bounds.y.max, a_0*bounds.x.max+b_0*bounds.y.min, a_0*bounds.x.max+b_0*bounds.y.max)
	if interval_00.is_overlap(interval_01) == false {
		return false
	}


	a_1 := vertex_01.y-vertex_00.y
	b_1 := -(vertex_01.x-vertex_00.x)
	c_10 := a_1*vertex_10.x+b_1*vertex_10.y
	c_11 := a_1*vertex_11.x+b_1*vertex_11.y

	if c_10 > c_11 {
		a_1 = -a_1
		b_1 = -b_1
		c_10 = -c_10
		c_11 = -c_11
	}

	interval_10 := Interval{c_10, c_11}
	
	var interval_11 Interval
	interval_11.min = min(a_1*bounds.x.min+b_1*bounds.y.min, a_1*bounds.x.min+b_1*bounds.y.max, a_1*bounds.x.max+b_1*bounds.y.min, a_1*bounds.x.max+b_1*bounds.y.max) 
	interval_11.max = max(a_1*bounds.x.min+b_1*bounds.y.min, a_1*bounds.x.min+b_1*bounds.y.max, a_1*bounds.x.max+b_1*bounds.y.min, a_1*bounds.x.max+b_1*bounds.y.max)

	if interval_10.is_overlap(interval_11) == false {
		return false 
	}
	return true


}

func (rectangle Rectangle) polygon() Polygon {
	polygon := Polygon{}
	polygon.vertices = rectangle.vertices()
	return polygon
}

func (rectangle Rectangle) rotation(angle float64, coord ...Coord) Rectangle {
	center := Coord{0, 0}
	if len(coord) == 1 {
		center = coord[0]
	}
	var rectangle_rotation Rectangle
	rectangle_rotation.center = rectangle.center.rotation(angle, center)
	rectangle_rotation.size = rectangle.size
	rectangle_rotation.angle = angle_polar(rectangle.angle+angle)
	return rectangle_rotation
}

func (rectangle Rectangle) translation(coord Coord) Rectangle {
	var rectangle_translation Rectangle
	rectangle_translation.center = rectangle.center.addition(coord)
	rectangle_translation.size = rectangle.size
	rectangle_translation.angle = rectangle.angle
	return rectangle_translation
}

func (rectangle Rectangle) vertices() []Coord {
	var vertices []Coord
	radius := rectangle.diagonal()/2
	angle := math.Pi-atan2_polar(rectangle.size.y, rectangle.size.x)
	var vector Coord
	for i := 0; i <= 1; i++ {
		for j := 0; j <= 1; j++ { 
			angle_vector := (to_float(i)+1/2)*math.Pi+pow(-1,j)*angle
			vector = Coord{radius*cos(angle_vector), radius*sin(angle_vector)}
			vertices = append(vertices, rectangle.center.addition(vector))
		}
	}
	return vertices
}


type Set_Rectangle struct {
	elements []Rectangle
	
}


