function SpriteManager(img, tile_width, tile_height, ctx){
	// canvas 2d context
	this.ctx = ctx;
	// l'image
	this.sprites = img;
	// largeur et hauteur d'un sprite
	this.tile_width = tile_width;
	this.tile_height = tile_height;
	
}

// fonction générique pour afficher un sprite

SpriteManager.prototype.draw = function(map_x, map_y, sprite_x, sprite_y){
	this.ctx.drawImage(
		this.sprites, 
		sprite_x*this.tile_width, sprite_y*this.tile_height, 
		this.tile_width, this.tile_height,
		map_x*this.tile_width, map_y*this.tile_height, 
		this.tile_width, this.tile_height 
	);
}

// fonctions d'affichage d'un sprite donnée

// terre pleine
SpriteManager.prototype.drawPlainLand = function(map_x, map_y){
	this.draw(map_x, map_y, 0, 0);
}

// trou d'eau
SpriteManager.prototype.drawWaterHole = function(map_x, map_y){
	this.draw(map_x, map_y, 0, 1);
}


// coin externe

SpriteManager.prototype.drawOuterCornerTopLeft = function(map_x, map_y){
	this.draw(map_x, map_y, 1, 0);
}

SpriteManager.prototype.drawOuterCornerTopRight = function(map_x, map_y){
	this.draw(map_x, map_y, 2, 0);
}

SpriteManager.prototype.drawOuterCornerBottomLeft = function(map_x, map_y){
	this.draw(map_x, map_y, 1, 1);
}

SpriteManager.prototype.drawOuterCornerBottomRight = function(map_x, map_y){
	this.draw(map_x, map_y, 2, 1);
}


// coins internes

SpriteManager.prototype.drawInnerCornerTopLeft = function(map_x, map_y){
	this.draw(map_x, map_y, 0, 2);
}

SpriteManager.prototype.drawInnerCornerTopRight = function(map_x, map_y){
	this.draw(map_x, map_y, 2, 2);
}

SpriteManager.prototype.drawInnerCornerBottomLeft = function(map_x, map_y){
	this.draw(map_x, map_y, 0, 4);
}

SpriteManager.prototype.drawInnerCornerBottomRight = function(map_x, map_y){
	this.draw(map_x, map_y, 2, 4);
}

SpriteManager.prototype.drawShoreTop = function(map_x, map_y){
	this.draw(map_x, map_y, 1, 2);
}

// plages

SpriteManager.prototype.drawShoreRight = function(map_x, map_y){
	this.draw(map_x, map_y, 2, 3);
}

SpriteManager.prototype.drawShoreBottom = function(map_x, map_y){
	this.draw(map_x, map_y, 1, 4);
}

SpriteManager.prototype.drawShoreLeft = function(map_x, map_y){
	this.draw(map_x, map_y, 0, 3);
}


// le héros
SpriteManager.prototype.drawHeroShip = function(map_x, map_y){
	this.draw(map_x, map_y, 3, 0);
}

// les pirates
SpriteManager.prototype.drawPirateShip = function(map_x, map_y){
	this.draw(map_x, map_y, 3, 1);
}

// las cases d'eau sont tirée au hazard parmis quatre affichage possible
// pour varier le rendu
SpriteManager.prototype.drawRandomWater = function(map_x, map_y){
	var dice = Math.floor(Math.random()*4)
	if(dice == 3){
		this.draw(map_x, map_y, 1, 3);
	}else{
		this.draw(map_x, map_y, dice, 5);
	}
}
