package Cartesian2D

import (
	"math"
)

type Polygon struct {
	vertices []Coord//counterclockwise
}

func (polygon Polygon) center_between_halflines(center Coord, interval_angle Interval_angle, distance_min float64) Coord {
	centroid_vertices := polygon.centroid_vertices()
	vertices := []Coord{}
	for _, vertex := range polygon.vertices {
		vertices = append(vertices, vertex.subtraction(centroid_vertices).addition(center))
	}
	if interval_angle.size >= math.Pi {
		bounds_x := Interval{vertices[0].x, vertices[0].x}
		bounds_y := Interval{vertices[0].y, vertices[0].y}
		for i := 1; i < len(vertices); i++ {
			bounds_x.min = min(bounds_x.min, vertices[i].x)
			bounds_x.max = max(bounds_x.max, vertices[i].x)
			bounds_y.min = min(bounds_y.min, vertices[i].y)
			bounds_y.max = max(bounds_y.max, vertices[i].y)
		}
		angle_end := interval_angle.end()
		if 0 <= interval_angle.start && interval_angle.start <= math.Pi && 0 <= angle_end && angle_end <= math.Pi {
			radius := distance_min+bounds_y.length()/2
			angle := 3*math.Pi/2
			return Coord{radius*cos(angle), radius*sin(angle)}
		}
		if math.Pi <= interval_angle.start && interval_angle.start <= 2*math.Pi && math.Pi <= angle_end && angle_end <= 2*math.Pi {
			radius := distance_min+bounds_y.length()/2
			angle := math.Pi/2
			return Coord{radius*cos(angle), radius*sin(angle)}
		}
		if math.Pi <= interval_angle.start && interval_angle.start <= 3*math.Pi/2 && math.Pi/2 <= angle_end && angle_end <= math.Pi {
			radius := distance_min+bounds_x.length()/2
			angle := 0.0
			return Coord{radius*cos(angle), radius*sin(angle)}
		}
		if 0 <= interval_angle.start && interval_angle.start <= math.Pi/2 && 3*math.Pi/2 <= angle_end && angle_end <= 2*math.Pi {
			radius := distance_min+bounds_x.length()/2
			angle := math.Pi
			return Coord{radius*cos(angle), radius*sin(angle)}
		}
	}
	angle_rotation := angle_polar(math.Pi/2-interval_angle.start+interval_angle.size/2)
	center_rotation := Coord{0, 0}
	vertices_rotation := []Coord{}
	for _, vertex := range vertices {
		vertices_rotation = append(vertices_rotation, vertex.rotation(angle_rotation, center_rotation))
	}
	x_max := distance_min*sin(interval_angle.size/2)
	distance := distance_min
	for _, vertex := range vertices_rotation {
		if abs(vertex.x) <= x_max {
			distance = max(distance, -vertex.y+sqrt(pow(distance_min, 2)-pow(abs(vertex.x), 2)))
		} else {
			distance = max(distance, -vertex.y+abs(vertex.x)/tan(interval_angle.size/2) )
		}
	}
	return center.addition(Coord{distance*cos(-angle_rotation), distance*sin(-angle_rotation)})

}


func (polygon Polygon) centroid() Coord {
	centroid := Coord{0, 0}
	vertices := polygon.vertices
	vertices = append(vertices, vertices[0])
	sum_areas := 0.0
	i_max := len(polygon.vertices)
	for i := 0; i < i_max; i++ {
		area_triangle := vertices[i].x*vertices[i+1].y-vertices[i].y*vertices[i+1].x
		sum_areas += area_triangle
		centroid = vertices[i].addition(vertices[i+1]).multiplication_scalar(area_triangle)
	}
	area_polygon := sum_areas/2
	centroid = centroid.multiplication_scalar(1/6*area_polygon)
	return centroid

}



func (polygon Polygon) centroid_vertices() Coord {
	centroid_vertices := Coord{0, 0}
	for _, vertex := range polygon.vertices {
		centroid_vertices = centroid_vertices.addition(vertex)
	}
	centroid_vertices = centroid_vertices.multiplication_scalar(to_float(len(polygon.vertices)))
	return centroid_vertices
}


func (polygon Polygon) edges() []Segment {
	vertices := append(polygon.vertices,polygon.vertices[0])
	segments := []Segment{}
	for i := 0; i < len(polygon.vertices); i++ {
		segment := Segment{}
		segment.start = vertices[i]
		segment.end = vertices[i+1]
		segments = append(segments,segment)		
	}
	return segments
}



func (polygon Polygon) rotation(angle float64, coord ...Coord) Polygon {
	center := Coord{0, 0}	
	if len(coord) == 1 {
		center = coord[0]
	}
	var polygon_rotation Polygon
	for i := 0; i < len(polygon.vertices); i++ {
		polygon_rotation.vertices[i] = polygon.vertices[i].rotation(angle, center)
	}
	return polygon_rotation
}

func (polygon Polygon) translation(coord Coord) Polygon {
	var polygon_rotation Polygon
	for i := 0; i < len(polygon.vertices); i++ {
		polygon_rotation.vertices[i] = polygon.vertices[i].addition(coord)
	}
	return polygon_rotation
}