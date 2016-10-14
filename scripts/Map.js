// classe gérant le contenu et l'affichage de la carte
function Map(mapText, spriteMgr){
	
	
	this.spriteMgr = spriteMgr;
	
	var mapLines = mapText.split("\n");
	
	// hauteur de la carte
	// calculée dans la boucle pour ne pas de tenir d'une ligne vide en fin de fichier
	this.height = 0;
	
	// largeur de la carte
	this.width = mapWidth = mapLines[0].length;
	// contenu de la carte sous forme d'une matrice
	this.content = [];	
	var i, j;
	for(i=0; i<mapLines.length; i++){
		// ignore les lignes vides
		if(mapLines[i]){ 
			this.content[i] = mapLines[i].split("");
			this.height++;
		}
	}
	
	// coordonnée du héros
	this.heroCoords = [0,0];
}

// test si des coordonnées sont dans la carte
Map.prototype.isInBounds = function(x, y){
	return x >= 0  && x < this.width && y >=0 && y < this.height;
};

// renvois le contenu d'une case
Map.prototype.getTile = function(x, y){
	return this.content[y][x];
};

// fixe le contenu d'une case
Map.prototype.setTile = function(x, y, tile){
	return this.content[y][x] = tile;
};

// renvois toutes les cases adjacente à une case donnée
// le hors-carte et codé comme une case vide (espace)
Map.prototype.getAdjacents = function(x, y){
	var adjacents = [];
	var i=-1, j=-1;
	// les cases sont ajoutées dans cet ordre:
	// top-left, top, top-right, left, right, bottom-left, bottom, bottom-right
	for(i;i<2;i++){
		j=-1;
		for(j;j<2;j++){
			if(i===0 && j===0) continue;
			
			var test_x = x + j;
			var test_y = y + i;
			
			if(this.isInBounds(test_x, test_y) ){
				adjacents.push(this.getTile(test_x, test_y));
			}else{
				// le hors-carte et codé comme une case vide (espace)
				adjacents.push(" ");
			}
			
		}
	}
	return new AdjacentTiles(adjacents);
}


// rendu de la carte
Map.prototype.render = function(){
	
	for(i=0; i<this.height; i++){
		for(j=0; j<this.width; j++){
			var tileType = this.content[i][j];
			switch(tileType){
				// case eau
				case "~":	this.drawWater(j, i);
							break;
				// case terre
				case "#":	this.drawLand(j, i);
							break;
				// case pirate
				case "M":	this.drawHero(j, i);
							break;
				// case héros
				case "X":	this.drawPirate(j, i);
							break;
			}
		}
	}
}


// test si une case est un trou d'eau (une case d'eau entourée de case de terre)
Map.prototype.isWaterHole = function(x,y){
	return /^[# ]+$/.test(this.getAdjacents(x,y).content.join(""));
}

Map.prototype.drawWater = function(x, y){
	
	// obtenir l'entourage de la case pour déterminer son affichage
	var adjacents = this.getAdjacents(x,y);
	
				
	var isWaterTile = /[~MX ]/,
		isLandTile = /[# ]/;
	
	// un trou d'eau est une case d'eau entrourée de case terre
	if(this.isWaterHole(x,y)){

		this.spriteMgr.drawWaterHole(x,y);

	}else{

		this.spriteMgr.drawRandomWater(x,y);

	}
}

Map.prototype.drawLand = function(x, y){
		
	// obtenir l'entourage de la case pour déterminer son affichage
	var adjacents = this.getAdjacents(x,y);
	
	// une terre pleine n'est entourée que de terre	
	var plainLand = /^[# ]+$/.test(adjacents.content.join(""));
	
	if(!plainLand){
		// les trous d'eau ne sont pas vraiment des case oceanique
		// donc si une case de terre n'est bordée que de trou d'eau et de terrre
		// c'est une case de terre pleine
		var allWaterHoles = true;
		for(var i=0; i< adjacents.content.length; i++){
			if(/[~MX]/.test(adjacents.content[i])){
				var coords = adjacents.indexToCoords(i);
				if(!this.isWaterHole(x + coords[0], y + coords[1])){
					allWaterHoles = false;
					break;
				}
			}
		}
		plainLand = allWaterHoles;
	}
	
	// l'espace sert à prendre en compte les cases "hors carte"
	var isWaterTile = /[~MX ]/,
		isLandTile = /[# ]/;
	
	if(plainLand){ // plain land

		this.spriteMgr.drawPlainLand(x, y);

	}else{
		
		
		if( // inner corner top left
			isLandTile.test(adjacents.getRight()) 
			&& isWaterTile.test(adjacents.getBottomRight())
			&& !this.isWaterHole(x+1, y+1)
			&& isLandTile.test(adjacents.getBottom())
		){
			
			this.spriteMgr.drawInnerCornerTopLeft(x, y);
		
		}else if( // inner corner top right
			isLandTile.test(adjacents.getLeft()) 
			&& isWaterTile.test(adjacents.getBottomLeft())
			&& !this.isWaterHole(x-1, y+1)
			&& isLandTile.test(adjacents.getBottom())
		){
			
			this.spriteMgr.drawInnerCornerTopRight(x, y);
		
		}else if( // inner corner bottom right
			isLandTile.test(adjacents.getLeft()) 
			&& isWaterTile.test(adjacents.getTopLeft())
			&& !this.isWaterHole(x-1, y-1)
			&& isLandTile.test(adjacents.getTop())
		){
		
			this.spriteMgr.drawInnerCornerBottomRight(x, y);
		
		}else if( // inner corner bottom left
			isLandTile.test(adjacents.getRight()) 
			&& isWaterTile.test(adjacents.getTopRight())
			&& !this.isWaterHole(x+1, y-1)
			&& isLandTile.test(adjacents.getTop())
		){
		
			this.spriteMgr.drawInnerCornerBottomLeft(x, y);
		
		}
		
		
		else if( // shore left
			isWaterTile.test(adjacents.getRight())
			&& !this.isWaterHole(x+1,y)
			&& isLandTile.test(adjacents.getBottom())
			&& isLandTile.test(adjacents.getTop())
		){
		
			this.spriteMgr.drawShoreLeft(x, y);
		
		}else if( // shore left
			isWaterTile.test(adjacents.getLeft())
			&& !this.isWaterHole(x-1,y) 
			&& isLandTile.test(adjacents.getBottom())
			&& isLandTile.test(adjacents.getTop())
		){
		
			this.spriteMgr.drawShoreRight(x, y);
		
		}else if( // shore top 
			isWaterTile.test(adjacents.getBottom()) 
			&& !this.isWaterHole(x,y+1)
			&& isLandTile.test(adjacents.getLeft())
			&& isLandTile.test(adjacents.getRight())
		){
		
			this.spriteMgr.drawShoreTop(x, y);
		
		}else if( // shore bottom
			isWaterTile.test(adjacents.getTop()) 
			&& !this.isWaterHole(x,y-1)
			&& isLandTile.test(adjacents.getLeft())
			&& isLandTile.test(adjacents.getRight())
		){
		
			this.spriteMgr.drawShoreBottom(x, y);
		
		}
		
		
		else if( // outer corner top left
			isWaterTile.test(adjacents.getLeft()) 
			&& isWaterTile.test(adjacents.getTopLeft())
			&& isWaterTile.test(adjacents.getTop())
		){
		
			this.spriteMgr.drawOuterCornerTopLeft(x, y);
		
		}
		
		
		else if( // outer corner top right
			isWaterTile.test(adjacents.getRight()) 
			&& isWaterTile.test(adjacents.getTopRight())
			&& isWaterTile.test(adjacents.getTop())
		){
		
			this.spriteMgr.drawOuterCornerTopRight(x, y);
		
		}else if( // outer corner bottom right
			isWaterTile.test(adjacents.getRight()) 
			&& isWaterTile.test(adjacents.getBottomRight())
			&& isWaterTile.test(adjacents.getBottom())
		){
		
			this.spriteMgr.drawOuterCornerBottomRight(x, y);
		
		}else if( // outer corner bottom left
			isWaterTile.test(adjacents.getLeft()) 
			&& isWaterTile.test(adjacents.getBottomLeft())
			&& isWaterTile.test(adjacents.getBottom())
		){
		
			this.spriteMgr.drawOuterCornerBottomLeft(x, y);
		
		}
	
	}
	
}
Map.prototype.drawHero = function(x, y){
	// set/update hero position
	this.heroCoords = [x,y];
	// water beneath ship
	this.spriteMgr.drawRandomWater(x,y);
	this.spriteMgr.drawHeroShip(x,y);
}

Map.prototype.drawPirate = function(x, y){
	// water beneath ship
	this.spriteMgr.drawRandomWater(x,y);
	this.spriteMgr.drawPirateShip(x,y);
}


Map.prototype.moveHero = function(offset_x, offset_y){
	var target_x = this.heroCoords[0] + offset_x,
		target_y = this.heroCoords[1] + offset_y;
	// ne pas sortir de la carte
	if(!this.isInBounds(target_x, target_y)){ 
		return;
	}
	// ne se déplacer que sur l'eau
	if(this.getTile(target_x, target_y) !== "~"){
		console.log(this.getTile(target_x, target_y));
		return;
	}
	// modifier la carte
	this.setTile(this.heroCoords[0], this.heroCoords[1], "~");
	this.setTile(target_x, target_y, "M");
	// redessiner les cases de départ et de destination
	this.spriteMgr.drawRandomWater(this.heroCoords[0], this.heroCoords[1]);
	this.drawHero(target_x, target_y); // met à jour les coordonnées
}

