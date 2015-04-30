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
            move: false,
            build: false
        };
        
        if (hex.ownerId == game.mPlayerId && !hex.buildingId) {
            buttonsVisible.build = true;
        }
        
        if (Object.keys(hex.getNoActionUnits()).length != 0) {
            buttonsVisible.move = true;
        };
        
        return buttonsVisible;
    };
    
    hex.createMoveSprite = function() {
        var texture = game.textures.attack;
        if (hex.ownerId == game.playerId) {
            texture = game.textures.move;
        }
        
        var moveSprite = new PIXI.Sprite(texture);
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
        if (game.mission.actions.move[hex.x + "x" + hex.y]) {
            for (var endLocationId in game.mission.actions.move[hex.x + "x" + hex.y]) {
                var units = game.mission.actions.move[hex.x + "x" + hex.y][endLocationId];
                for (var unitId in units) {
                    if (!actionUnits[unitId]) {
                        actionUnits[unitId] = 0;
                    }
                    actionUnits[unitId] += units[unitId];
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
    
    hex.getActionUnits = function(x, y) {
        if (hex.ownerId != game.mPlayerId)
            return {};
        
        var actionUnits = {};
        if (game.mission.actions.move[hex.x + "x" + hex.y] && game.mission.actions.move[hex.x + "x" + hex.y][x + "x" + y]) {
            var units = game.mission.actions.move[hex.x + "x" + hex.y][x + "x" + y];
            for (var unitId in units) {
                if (!actionUnits[unitId]) {
                    actionUnits[unitId] = 0;
                }
                actionUnits[unitId] += units[unitId];
            }
        }
        
        return actionUnits;
    };
    
    hex.updateUnits = function(playerUnits) {
        for (var mPlayerId in playerUnits) {
            if (hex.units[mPlayerId] == null) {
                hex.units[mPlayerId] = {};
            }
            for (var unitId in playerUnits[mPlayerId]) {
                if (hex.units[mPlayerId][unitId] == null) {
                    hex.units[mPlayerId][unitId] = 0;
                }
                hex.units[mPlayerId][unitId] += playerUnits[mPlayerId][unitId];
                if (hex.units[mPlayerId][unitId] <= 0) {
                    delete hex.units[mPlayerId][unitId];
                }
            }
            
            if (Object.keys(hex.units[mPlayerId]).length == 0) {
                delete hex.units[mPlayerId];
            }
        }
        
        hex.showUnitsSprite();
    };
    
    hex.setOwner = function(newOwnerId) {
        hex.ownerId = newOwnerId;
        hex.sprite.setTexture(hex.getTextureByOwner());
    };

    var sprite = new PIXI.Sprite(hex.getTextureByOwner());
    sprite.interactive = true;   
    sprite.anchor.x = 0.5;
    sprite.anchor.y = 0.5;    
    sprite.hitArea = new PIXI.Circle(0, 0, 32);
    if (hex.x % 2 == 0) {
        sprite.position.x = 32 + hex.x * 48;
        sprite.position.y = 32 + hex.y * 64;
    } else {
        sprite.position.x = 32 + hex.x * 48;
        sprite.position.y = 64 + hex.y * 64;
    }  
    
    sprite.click = function(data) {
        if (hex.moveSprite != null) {
            game.showInterface('moveUnits', {
                unitsInLocation: game.mission.selectedLocation.getNoActionUnits(),
                unitsToMove: game.mission.selectedLocation.getActionUnits(hex.x, hex.y),
                targetLocation: hex
            });
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
    
    hex.sprite = sprite;
    
    if (hex.buildingId) {
        var buildingSprite = new PIXI.Sprite(game.textures["building_" + hex.buildingId]);
        buildingSprite.anchor.x = 0.5;
        buildingSprite.anchor.y = 1;
        
        buildingSprite.position.x = sprite.position.x;
        buildingSprite.position.y = sprite.position.y + sprite.height / 2 - 32;
        
        hex.buildingSprite = buildingSprite;
    }

    return hex;
});