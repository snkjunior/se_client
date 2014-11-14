var Mission = (function(missionData) {
    var mission = {        
        width: missionData.info.width,
        height: missionData.info.height,
        locations: {},            
        
        players: missionData.info.players,
        playersMap: missionData.playersMap,

        selectedLocation: null,
        isMoveMode: false,
        
        scale: 1,
        locationsContainer: null,
        mapContainer: null,
        currentPlayerTurn: {
            mPlayerId: null,
            timer: {
                
            }
        },
        
        buttons: {
            build: null,
            move: null,
            turn: null
        },
        
        actions: {}
    };

    mission.addAction = function(type, info) {
        if (!mission.selectedLocation)
            return false;
        
        if (!mission.actions[mission.selectedLocation.x + "x" + mission.selectedLocation.y])
            mission.actions[mission.selectedLocation.x + "x" + mission.selectedLocation.y] = {};
        
        if (!mission.actions[mission.selectedLocation.x + "x" + mission.selectedLocation.y][type])
            mission.actions[mission.selectedLocation.x + "x" + mission.selectedLocation.y][type] = [];
        
        mission.actions[mission.selectedLocation.x + "x" + mission.selectedLocation.y][type].push(info);
    };

    mission.getMapPlayerId = function(playerId) {
        for (var mPlayerId in this.playersMap) {
            if (this.playersMap[mPlayerId].playerId == playerId)
                return mPlayerId;
        }
        return null;
    };

    mission.getWidth = function() {
        return 16 * this.scale + this.width * 48 * this.scale;
    };
    
    mission.getHeight = function() {
        return 32 * this.scale + this.height * 64 * this.scale;
    };
    
    mission.updateMapScale = function() {
        mission.locationsContainer.scale.x = mission.locationsContainer.scale.y = this.scale;
        
        if (mission.getWidth() <= 1366) {
            mission.locationsContainer.position.x = (1366 - mission.getWidth()) / 2;
        }

        if (mission.getHeight() <= 768) {
            mission.locationsContainer.position.y = (768 - mission.getHeight()) / 2;
        }
    };
    
    mission.hideButtons = function() {
        for (var buttonName in this.buttons) {
            this.buttons[buttonName].visible = false;
        }
    };
    
    mission.updateButtonsVisible = function(buttonsVisible) {
        var i = 0;
        for (var buttonName in buttonsVisible) {
            if (!this.buttons[buttonName])
                continue;
            
            this.buttons[buttonName].visible = buttonsVisible[buttonName];
            if (this.buttons[buttonName].visible) {
                this.buttons[buttonName].position.set(10, 10 + i * 50);
                i++;
            }
        }
    };
    
    mission.setMoveMode = function(isMoveMode) {
        mission.isMoveMode = !mission.isMoveMode;
        
        if (typeof isMoveMode != 'undefined') {
            mission.isMoveMode = isMoveMode;
        }
        
        if (mission.isMoveMode) {
            if (mission.selectedLocation != null) {
                var neighborHexes = mission.getNeighborHexes(mission.selectedLocation);
                for (var i = 0; i < neighborHexes.length; i++) {
                    neighborHexes[i].createMoveSprite();
                    mission.locationsContainer.addChild(neighborHexes[i].moveSprite);
                }
            }
        } else {
            if (mission.selectedLocation != null) {
                var neighborHexes = mission.getNeighborHexes(mission.selectedLocation);
                for (var i = 0; i < neighborHexes.length; i++) {                    
                    mission.locationsContainer.removeChild(neighborHexes[i].moveSprite);
                    neighborHexes[i].removeMoveSprite();
                }
            }
        }
    };
    
    mission.addSpriteToLocationsContainer = function(sprite) {
        mission.locationsContainer.addChild(sprite);
    };
    
    mission.removeSpriteFromLocationsContainer = function(sprite) {
        mission.locationsContainer.removeChild(sprite);
    };
    
    mission.getNeighborHexes = function(hex) {
        var neighborHexes = [];
        if (hex.x % 2 == 0) {
            if (mission.locations[(hex.x - 1) + "x" + (hex.y - 1)]) 
                neighborHexes.push(mission.locations[(hex.x - 1) + "x" + (hex.y - 1)]);
            if (mission.locations[hex.x + "x" + (hex.y - 1)]) 
                neighborHexes.push(mission.locations[hex.x + "x" + (hex.y - 1)]);
            if (mission.locations[(hex.x + 1) + "x" + (hex.y - 1)]) 
                neighborHexes.push(mission.locations[(hex.x + 1) + "x" + (hex.y - 1)]);
            if (mission.locations[(hex.x - 1) + "x" + hex.y]) 
                neighborHexes.push(mission.locations[(hex.x - 1) + "x" + hex.y]);
            if (mission.locations[(hex.x + 1) + "x" + hex.y]) 
                neighborHexes.push(mission.locations[(hex.x + 1) + "x" + hex.y]);
            if (mission.locations[hex.x + "x" + (hex.y + 1)]) 
                neighborHexes.push(mission.locations[hex.x + "x" + (hex.y + 1)]);
        } 
        else {
            if (mission.locations[hex.x + "x" + (hex.y - 1)]) 
                neighborHexes.push(mission.locations[hex.x + "x" + (hex.y - 1)]);
            if (mission.locations[(hex.x - 1) + "x" + hex.y]) 
                neighborHexes.push(mission.locations[(hex.x - 1) + "x" + hex.y]);
            if (mission.locations[(hex.x + 1) + "x" + hex.y]) 
                neighborHexes.push(mission.locations[(hex.x + 1) + "x" + hex.y]);
            if (mission.locations[(hex.x - 1) + "x" + (hex.y + 1)]) 
                neighborHexes.push(mission.locations[(hex.x - 1) + "x" + (hex.y + 1)]);
            if (mission.locations[hex.x + "x" + (hex.y + 1)]) 
                neighborHexes.push(mission.locations[hex.x + "x" + (hex.y + 1)]);
            if (mission.locations[(hex.x + 1) + "x" + (hex.y + 1)])
                neighborHexes.push(mission.locations[(hex.x + 1) + "x" + (hex.y + 1)]);
        }
        return neighborHexes;
    };
    
    mission.endTurn = function() {
        game.server.sendMessage("mission", "endTurn", mission.actions);
    };
    
    mission.init = function() {
        var mapContainer = new PIXI.DisplayObjectContainer();
        var locationsContainer = new PIXI.DisplayObjectContainer();
        mapContainer.addChild(locationsContainer);

        mission.mapContainer = mapContainer;
        mission.locationsContainer = locationsContainer;    
        
        for (var locationId in missionData.info.map) {
            var location = missionData.info.map[locationId];
            var hex = new Hex(locationId, location);
            mission.locations[locationId] = hex;
            locationsContainer.addChild(hex.sprite);
            if (hex.buildingId) {
                locationsContainer.addChild(hex.buildingSprite);
            }
            hex.showUnitsSprite();

        }

        mission.updateMapScale();

        locationsContainer.interactive = true;
        locationsContainer.buttonMode = true;
        locationsContainer.camera = {
            x: 0,
            y: 0,
            set: function(x, y) {
                this.x = x;
                this.y = y;
            },
            mouseLastPosition: {
                x: null,
                y: null,
                set: function(x, y) {
                    this.x = x;
                    this.y = y;
                }
            }
        };

        locationsContainer.mousedown = locationsContainer.touchstart = function(data) {
            if (mission.getWidth() <= 1366 && mission.getHeight() <= 768) { 
                return;
            }

            this.dragging = true;
            locationsContainer.camera.mouseLastPosition.set(data.getLocalPosition(mapContainer).x, data.getLocalPosition(mapContainer).y);
        };

        locationsContainer.mouseup = locationsContainer.touchend = function(data) {
            this.dragging = false;
        };

        locationsContainer.mousemove = locationsContainer.touchmove = function(data) {
            if(this.dragging) {
                var newPosition = data.getLocalPosition(mapContainer);

                locationsContainer.camera.x -= locationsContainer.camera.mouseLastPosition.x - newPosition.x;
                locationsContainer.camera.y -= locationsContainer.camera.mouseLastPosition.y - newPosition.y;

                locationsContainer.camera.mouseLastPosition.set(newPosition.x, newPosition.y);

                locationsContainer.position.x = locationsContainer.camera.x;
                if (locationsContainer.position.x < 1366 - mission.getWidth()) {
                    locationsContainer.position.x = 1366 - mission.getWidth();
                }
                if (locationsContainer.position.x > 0) {
                    locationsContainer.position.x = 0;
                }

                if (mission.getWidth() <= 1366) {
                    locationsContainer.position.x = (1366 - mission.getWidth()) / 2;
                }

                locationsContainer.position.y = locationsContainer.camera.y;
                if (locationsContainer.position.y < 768 - mission.getHeight()) {
                    locationsContainer.position.y = 768 - mission.getHeight();
                }
                if (locationsContainer.position.y > 0) {
                    locationsContainer.position.y = 0;
                }

                if (mission.getHeight() <= 768) {
                    locationsContainer.position.y = (768 - mission.getHeight()) / 2;
                }
            }
        };

        var buttonBuild = new PIXI.Sprite(game.textures.button_build);
        buttonBuild.position.set(10, 10);
        buttonBuild.interactive = true;
        buttonBuild.buttonMode = true;
        buttonBuild.visible = false;
        mission.buttons.build = buttonBuild;
        mapContainer.addChild(buttonBuild);

        var buttonMove = new PIXI.Sprite(game.textures.button_move);
        buttonMove.position.set(10, 70);
        buttonMove.interactive = true;
        buttonMove.buttonMode = true;
        buttonMove.visible = false;
        buttonMove.click = function() {
            mission.setMoveMode();
        };
        mission.buttons.move = buttonMove;
        mapContainer.addChild(buttonMove);
        
        var buttonTurn = new PIXI.Sprite(game.textures.button_turn);
        buttonTurn.position.set(10, 710);
        buttonTurn.interactive = true;
        buttonTurn.buttonMode = true;
        buttonTurn.click = function() {
            mission.endTurn();
        };
        mission.buttons.turn = buttonMove;
        mapContainer.addChild(buttonTurn);
    };
    
    return mission;
});


