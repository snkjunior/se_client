var Hex = (function(locationId, locationInfo) {
    var hex = {
        x: locationId.split("x")[0],
        y: locationId.split("x")[1],
        
        resources: locationInfo.resources,
        resourceId: locationInfo.resourceId,
        buildingId: locationInfo.buildingId,
        owner: locationInfo.ownerId,
        units: locationInfo.units,
            
        sprite: null,
        buildingSprite: null,
        unitsSprite: null
    };

    hex.setOwner = function(owner) {
        this.owner = owner;
        this.sprite.setTexture(this.getTextureByOwner());
    };

    hex.getTextureByOwner = function() {
        if (this.owner == 0) {
            return game.textures.hex_neutral;
        }
        if (this.owner != game.mPlayerId) {
            return game.textures.hex_enemy;
        }
        return game.textures.hex_my;
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
        if (game.selectedLocation != null) {
            game.selectedLocation.sprite.setTexture(game.selectedLocation.getTextureByOwner());
            if (game.selectedLocation == hex) {
                delete game.selectedLocation;
            } 
            else {
                game.selectedLocation = hex;
                this.setTexture(game.textures.hex_selected);
            }
        } 
        else {
            game.selectedLocation = hex;
            this.setTexture(game.textures.hex_selected);
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
    
    if (Object.keys(hex.units).length != 0) {
        var unitsSprite = new PIXI.Sprite(game.textures.units);
        unitsSprite.anchor.x = 0.5;
        unitsSprite.anchor.y = 1;
        
        unitsSprite.position.x = sprite.position.x;
        unitsSprite.position.y = sprite.position.y + sprite.height / 2 - 10;
        
        hex.unitsSprite = unitsSprite;
    }

    hex.sprite = sprite;

    return hex;
});