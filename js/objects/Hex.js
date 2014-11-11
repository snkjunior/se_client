var Hex = (function(x, y, owner) {
    var hex = {
        owner: owner,
        location: {
            x: x,
            y: y
        },
        sprite: null
    };

    hex.setOwner = function(owner) {
        this.owner = owner;
        this.sprite.setTexture(this.getTextureByOwner());
    };

    hex.getTextureByOwner = function() {
        if (this.owner == 0) {
            return game.textures.hex_neutral;
        }
        if (this.owner == -1) {
            return game.textures.hex_enemy;
        }
        return game.textures.hex_my;
    };

    var sprite = new PIXI.Sprite(hex.getTextureByOwner());
    sprite.interactive = true;   

    sprite.anchor.x = 0.5;
    sprite.anchor.y = 0.5;
    
    if (x % 2 == 0) {
        sprite.position.x = 32 + x * 48;
        sprite.position.y = 32 + y * 64;
    } else {
        sprite.position.x = 32 + x * 48;
        sprite.position.y = 64 + y * 64;
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

    hex.sprite = sprite;

    return hex;
});