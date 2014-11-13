var Hex = (function(locationId, locationInfo) {
    var hex = {
        x: parseInt(locationId.split("x")[0]),
        y: parseInt(locationId.split("x")[1]),
        
        resources: locationInfo.resources,
        resourceId: locationInfo.resourceId,
        buildingId: locationInfo.buildingId,
        ownerId: locationInfo.ownerId,
        units: locationInfo.units,
            
        sprite: null,
        buildingSprite: null,
        unitsSprite: null,
        moveSprite: null
    };

    hex.setOwner = function(ownerId) {
        this.ownerId = ownerId;
        this.sprite.setTexture(this.getTextureByOwner());
    };

    hex.getTextureByOwner = function() {
        if (this.ownerId == 0) {
            return game.textures.hex_neutral;
        }
        if (this.ownerId != game.mPlayerId) {
            return game.textures.hex_enemy;
        }
        return game.textures.hex_my;
    };
    
    hex.getButtonsVisible = function() {
        var buttonsVisible = {
            build: false,
            move: false
        };
        
        if (hex.ownerId == game.mPlayerId && hex.buildingId == null && hex.resourceId != null) {
            buttonsVisible.build = true;
        }
        
        if (Object.keys(hex.getNoActionUnits()).length != 0) {
            buttonsVisible.move = true;
        };
        
        return buttonsVisible;
    };
    
    hex.createMoveSprite = function() {
        var moveSprite = new PIXI.Sprite(game.textures.attack);
        moveSprite.anchor.set(0.5, 0.5);
        moveSprite.position.set(this.sprite.position.x, this.sprite.position.y);
        
        this.moveSprite = moveSprite;
    };
    
    hex.removeMoveSprite = function() {
        delete this.moveSprite;
    };
    
    hex.showUnitsSprite = function() {
        var noActionUnits = hex.getNoActionUnits();        
        if ((hex.ownerId == game.mPlayerId && Object.keys(noActionUnits).length != 0) || (hex.ownerId != game.mPlayerId && Object.keys(hex.units).length != 0))  {
            var unitsSprite = new PIXI.Sprite(game.textures.units);
            unitsSprite.anchor.x = 0.5;
            unitsSprite.anchor.y = 1;
            unitsSprite.position.x = sprite.position.x;
            unitsSprite.position.y = sprite.position.y + sprite.height / 2 - 10;
            hex.unitsSprite = unitsSprite;
            game.mission.addSpriteToLocationsContainer(hex.unitsSprite);
        } else {
            if (hex.unitsSprite) {
                game.mission.removeSpriteFromLocationsContainer(hex.unitsSprite);
                hex.unitsSprite = null;
            }
        }
    };
    
    hex.getNoActionUnits = function() {
        if (hex.ownerId != game.mPlayerId)
            return {};
        
        var actionUnits = {};
        if (game.mission.actions[hex.x + "x" + hex.y]) {
            if (game.mission.actions[hex.x + "x" + hex.y].move) {
                for (var i = 0; i < game.mission.actions[hex.x + "x" + hex.y].move.length; i++) {
                    var moveAction = game.mission.actions[hex.x + "x" + hex.y].move[i];
                    for (var unitId in moveAction.units) {
                        if (!actionUnits[unitId]) {
                            actionUnits[unitId] = 0;
                        }
                        actionUnits[unitId] += moveAction.units[unitId];
                    }
                }
            }
        }
        
        var noActionUnits = {};
        for (var unitId in hex.units[game.mPlayerId]) {
            if (actionUnits[unitId]) {
                noActionUnits[unitId] = hex.units[game.mPlayerId][unitId] - actionUnits[unitId];
            }
            else {
                noActionUnits[unitId] = hex.units[game.mPlayerId][unitId];
            }
            if (noActionUnits[unitId] == 0) {
                delete noActionUnits[unitId];
            }
        }
        
        return noActionUnits;
    };

    var sprite = new PIXI.Sprite(hex.getTextureByOwner());
    sprite.interactive = true;   

    sprite.anchor.x = 0.5;
    sprite.anchor.y = 0.5;
    
    if (hex.x % 2 == 0) {
        sprite.position.x = 32 + hex.x * 48;
        sprite.position.y = 32 + hex.y * 64;
    } else {
        sprite.position.x = 32 + hex.x * 48;
        sprite.position.y = 64 + hex.y * 64;
    }  
    
    sprite.hitArea = new PIXI.Circle(0, 0, 32);

    sprite.click = function(data) {
        if (hex.moveSprite != null) {
            game.mission.addAction("move", {
                units: game.mission.selectedLocation.units[game.mPlayerId],
                destination: {
                    x: hex.x,
                    y: hex.y
                }
            });
            alert("Войска выдвинулись в локацию ("+hex.x+";"+hex.y+").");
            game.mission.setMoveMode(false);
            game.mission.selectedLocation.showUnitsSprite();
            game.mission.updateButtonsVisible(game.mission.selectedLocation.getButtonsVisible());
            return;
        }
        
        game.mission.setMoveMode(false);
        if (game.mission.selectedLocation != null) {
            game.mission.selectedLocation.sprite.setTexture(game.mission.selectedLocation.getTextureByOwner());
            if (game.mission.selectedLocation == hex) {
                game.mission.hideButtons();
                delete game.mission.selectedLocation;
            } 
            else {
                game.mission.selectedLocation = hex;
                this.setTexture(game.textures.hex_selected);
                game.mission.updateButtonsVisible(hex.getButtonsVisible());
            }
        } 
        else {
            game.mission.selectedLocation = hex;
            this.setTexture(game.textures.hex_selected);
            game.mission.updateButtonsVisible(hex.getButtonsVisible());
        }
    };
    
    if (hex.buildingId) {
        var buildingSprite = new PIXI.Sprite(game.textures["building_" + hex.buildingId]);
        buildingSprite.anchor.x = 0.5;
        buildingSprite.anchor.y = 1;
        
        buildingSprite.position.x = sprite.position.x;
        buildingSprite.position.y = sprite.position.y + sprite.height / 2 - 32;
        
        hex.buildingSprite = buildingSprite;
    }
    
    hex.sprite = sprite;

    return hex;
});