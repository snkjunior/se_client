var game = {
    playerId: 1,
    map: null,
    
    pixi: {
        renderer: null,
        stage: null
    },
    textures: {
        hex_neutral: null,
        hex_enemy: null,
        hex_my: null,
        hex_selected: null
    }
};

game.init = function() {
    //this.server.init();
    this.initPixi(1366, 768);
    this.loadTextures();
    this.initMap();
    
    var someHex = new PIXI.Sprite(this.textures.hex_my);
    
    requestAnimFrame(game.animateFrame);
};

game.initPixi = function(widht, height) {
    this.pixi.renderer = PIXI.autoDetectRenderer(1366, 768, {view: document.getElementById("map_canvas")});
    this.pixi.stage = new PIXI.Stage(0x222222, true);
};

game.loadTextures = function() {
    for (var textureName in this.textures) {
        this.textures[textureName] = PIXI.Texture.fromImage("img/"+textureName+".png");
    }
};

game.initMap = function(mapData) {
    this.map = new Map(12, 6);
    this.pixi.stage.addChild(this.map.mapContainer);
};

game.animateFrame = function() {
    requestAnimFrame(game.animateFrame);
    game.pixi.renderer.render(game.pixi.stage);
};
