// helper pour gérer les case adjacentes à une case donnée
// afin d'en dertérminer le rendu exact

function AdjacentTiles(adjacents){
	// un tableau de case adjacente à une case donnée
	// les cases doivent être dans cet ordre:
	// top-left, top, top-right, left, right, bottom-left, bottom, bottom-right
	this.content = adjacents;

}


// utilité pour clarifier à quoi correspondent les index

AdjacentTiles.prototype.getTopLeft = function(){
	return this.content[0];
}

AdjacentTiles.prototype.getTop = function(){
	return this.content[1];
}

AdjacentTiles.prototype.getTopRight = function(){
	return this.content[2];
}

AdjacentTiles.prototype.getLeft = function(){
	return this.content[3];
}

AdjacentTiles.prototype.getRight = function(){
	return this.content[4];
}

AdjacentTiles.prototype.getBottomLeft = function(){
	return this.content[5];
}

AdjacentTiles.prototype.getBottom = function(){
	return this.content[6];
}

AdjacentTiles.prototype.getBottomRight = function(){
	return this.content[7];
}

// traduction d'un index dans le tableau
// en offsets x et y par rapport à la case centrale de ces cases adjacentes
AdjacentTiles.prototype.indexToCoords = function(i){
	var coords = [
		[-1,-1],
		[0,-1],
		[1,-1],
		[-1,0],
		[1,0],
		[-1,1],
		[0,1],
		[1,1]
	];
	return coords[i];
}

