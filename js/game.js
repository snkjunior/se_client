var game = {
    playerId: null,
    mPlayerId: null,
    gold: ko.observable(500),
    
    mission: null,
    pixi: {
        width: 800,
        height: 600,
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
        move: null,
        button_build: null,
        button_move: null,
        button_turn: null
    },
    img: {
        units: {
            1: null,
            2: null,
            3: null
        }
    },
    
    currentInterface: null,
    interfaces: {}
};

game.init = function(playerId) {
    this.initTemplates();
    this.initImages();
    
    this.playerId = playerId;
    this.server.init();
    this.initPixi();
    this.loadTextures();
    requestAnimFrame(game.animateFrame);
    
    var authKey = "asdzx197sdik1pz1";
    if (playerId == 2) {
        authKey = "asdzx197sdik1pz2";        
    }
    this.server.connectToMissionServer('127.0.0.11', 8000, 1, authKey);

//    this.showInterface('buildings', {});
};

game.initPixi = function() {
    this.pixi.renderer = PIXI.autoDetectRenderer(this.pixi.width, this.pixi.height, {view: document.getElementById("map_canvas")});
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

game.initImages = function() {
    for (var unitId in this.img.units) {
        if (typeof document.body == "undefined") 
            return;
        try {
            var div = document.createElement("div");
            var s = div.style;
                s.position = "absolute";
            s.top = s.left = 0;
            s.visibility = "hidden";
            document.body.appendChild(div);
            div.innerHTML = "<img src='img/units/"+unitId+".png' />";
            var lastImg = div.lastChild;
            lastImg.onload = function() { document.body.removeChild(document.body.lastChild); };
         }
         catch(e) {
            // Error. Do nothing.
        }
    }
}

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
        $("#interface").css("left", (game.pixi.width - $("#interface").children().width()) / 2 + "px");
        $("#interface").css("top", (game.pixi.height - $("#interface").children().height()) / 2 + "px");
        $("#interface_bg").show();
        $("#interface").show();
    }, params);
};

game.hideInterface = function() {
    $("#interface_bg").hide();
    $("#interface").hide();
    game.currentInterface = null;
    $("#interface").html('');
};

game.animateFrame = function() {
    requestAnimFrame(game.animateFrame);
    game.pixi.renderer.render(game.pixi.stage);
};
