var Mission = (function(missionData) {
    var mission = {        
        mPlayerId: null,
        
        width: missionData.info.width,
        height: missionData.info.height,
        locations: {},            
        
        players: missionData.info.players,
        playersMap: missionData.playersMap,
        
        scale: 1,
        mapContainer: null
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
        locationsContainer.scale.x = locationsContainer.scale.y = this.scale;
        
        if (mission.getWidth() <= 1366) {
            locationsContainer.position.x = (1366 - mission.getWidth()) / 2;
        }

        if (mission.getHeight() <= 768) {
            locationsContainer.position.y = (768 - mission.getHeight()) / 2;
        }
    };
    
    var mapContainer = new PIXI.DisplayObjectContainer();
    var locationsContainer = new PIXI.DisplayObjectContainer();
    
    for (var locationId in missionData.info.map) {
        var location = missionData.info.map[locationId];
        var hex = new Hex(locationId, location);
        mission.locations[locationId] = hex;
        locationsContainer.addChild(hex.sprite);
        if (hex.buildingSprite != null) {
            locationsContainer.addChild(hex.buildingSprite);
        }
        if (hex.unitsSprite != null) {
            locationsContainer.addChild(hex.unitsSprite);
        }
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
    
    mapContainer.addChild(locationsContainer);
    mission.mapContainer = mapContainer;
    
    return mission;
});


