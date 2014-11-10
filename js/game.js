var game = {
    pixi: {
        stage: null,
        renderer: null
    }
};

game.init = function() {
    this.initPixi(1366, 768);
};

game.initPixi = function(widht, height) {
    this.pixi.renderer = PIXI.autoDetectRenderer(1366, 768);
};

