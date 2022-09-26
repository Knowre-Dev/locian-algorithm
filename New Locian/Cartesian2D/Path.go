package Cartesian2D

import (
	//"math"
)


type Path struct {
	vertices []Coord
	
}




func (path Path) edges() []Segment {
	vertices := append(path.vertices, path.vertices[0])
	var edges []Segment 
	for i := 0; i < len(vertices)-1; i++ {
		edges = append(edges, Segment{vertices[i], vertices[i+1]})
	}
	return edges 
	
}

