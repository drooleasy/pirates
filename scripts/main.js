document.addEventListener("DOMContentLoaded", function(){

	var tile_height = 32,
		tile_width = 32;

	
	var board = document.getElementById("board"),
		ctx = board.getContext("2d");


	// charger les sprites
	var sprites = new Image();
	sprites.onload = function(){
		preloader();
	}
	sprites.src="./assets/sprites.png";
	
	
	
	// charger la map
	var mapText  = null;
	var req = new XMLHttpRequest();
	req.open('GET', './assets/map.txt', true);
	req.onreadystatechange = function () {
		if (req.readyState == 4) {
			if(req.status == 200){
				mapText = req.responseText;
				preloader();
			}else{
				console.log("error loading map");
			}
		}
	};
	req.send(null);
	
	// conteur pour déclencher le jeu quand les assets sont toute chargées
	var assetsToLoad = 2;
	function preloader(){
		assetsToLoad--;
		if(assetsToLoad === 0) main();
	}
	
	function main(){
		
		
		var spriteMgr = new SpriteManager(sprites, tile_width, tile_height, ctx);
		var map = new Map(mapText, spriteMgr);
		
		// redimensionne le canvas selon la taille de la carte
		board.width = (map.width+1) * tile_width;
		board.height = (map.height+1) * tile_height;
		
		// affichage de la carte
		map.render();
		
		// gestion du clavier
		document.addEventListener('keydown', function(e){
			e = e || window.event;
			// autoriser les mouvement en diagonale
			var offset_x = 0,
				offset_y = 0;
			if(e.keyCode == '37'){ // left arrow 
				offset_x -= 1;
			}
			if(e.keyCode == '38'){ // up arrow
				offset_y -= 1;
			}
			if(e.keyCode == '39'){ // right arrow
				offset_x += 1;
			}
			if(e.keyCode == '40'){ // down arrow
				offset_y += 1;
			}
			map.moveHero(offset_x, offset_y);
		})	
		
	}
		
})
