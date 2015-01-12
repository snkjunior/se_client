var game = {
    playerId: null,
    mPlayerId: null,
    mission: null,
    pixi: {
        renderer: null,
        stage: null
    },
    textures: {
        hex_neutral: null,
        hex_enemy: null,
        hex_my: null,
        hex_selected: null,
        building_1: null,
        units: null,
        attack: null,
        button_build: null,
        button_move: null,
        button_turn: null
    },
    
    currentInterface: null,
    interfaces: {}
};

game.init = function(playerId) {
    game.initTemplates();
    
//    this.playerId = playerId;
//    
//    this.server.init();
//    this.initPixi(1366, 768);
//    this.loadTextures();
//    requestAnimFrame(game.animateFrame);
//    
//    var authKey = "asdzx197sdik1pza";
//    if (playerId == 2) {
//        authKey = "asdzx197sdik1pz2";        
//    }
//    game.server.connectToMissionServer('127.0.0.11', 8000, 1, authKey);
//

    game.showInterface('moveUnits', {});
};

game.initPixi = function(widht, height) {
    this.pixi.renderer = PIXI.autoDetectRenderer(1366, 768, {view: document.getElementById("map_canvas")});
    $("#map_canvas").show();
    this.pixi.stage = new PIXI.Stage(0x222222, true);
};

game.loadTextures = function() {
    for (var textureName in this.textures) {
        this.textures[textureName] = PIXI.Texture.fromImage("img/"+textureName+".png");
    }
};

game.initMission = function(missionData) {
    for (var mPlayerId in missionData.playersMap) {
        if (missionData.playersMap[mPlayerId].playerId == this.playerId) {
            this.mPlayerId = mPlayerId;
        }
    }
    
    this.mission = new Mission(missionData);
    this.mission.init();
    this.pixi.stage.addChild(this.mission.mapContainer);
    
    return true;
};

game.initTemplates = function() {
    for (var name in this.interfaces) {
        $.ajax({
            url: "templates/" + name + ".html",
            async: false,
            cache: false,
            success: function(html) {
                game.interfaces[name].template = html;
            }
        });
    }
};

game.showInterface = function(interfaceName, params) {
    game.currentInterface = game.interfaces[interfaceName];
    $("#interface").html(game.currentInterface.template);
    game.currentInterface.init(function() {
        ko.renderTemplate('interface', game.currentInterface, {}, document.getElementById('interface'));
        if (game.currentInterface.onReady != null) {
            game.currentInterface.onReady();
        }
    }, params);
};

game.animateFrame = function() {
    requestAnimFrame(game.animateFrame);
    game.pixi.renderer.render(game.pixi.stage);
};
