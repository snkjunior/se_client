var Map = (function(dx, dy) {
    var map = {
        scale: 1,
        dx: dx,
        dy: dy,
        locations: {},
        
        mapContainer: null
    };
    
    map.getWidth = function() {
        return 16 * this.scale + this.dx * 48 * this.scale;
    };
    
    map.getHeight = function() {
        return 32 * this.scale + this.dy * 64 * this.scale;
    };
    
    map.updateMapScale = function() {
        locationsContainer.scale.x = locationsContainer.scale.y = this.scale;
        
        if (map.getWidth() <= 1366) {
            locationsContainer.position.x = (1366 - map.getWidth()) / 2;
        }

        if (map.getHeight() <= 768) {
            locationsContainer.position.y = (768 - map.getHeight()) / 2;
        }
    };
    
    var mapContainer = new PIXI.DisplayObjectContainer();
    var locationsContainer = new PIXI.DisplayObjectContainer();
    
    for (var y = 0; y < map.dy; y++) {
        for (var x = 0; x < map.dx; x++) {
            var hex = new Hex(x, y, 0);
            map.locations[x + "x" + y] = hex;
            locationsContainer.addChild(hex.sprite);
        }
    }

    map.locations['1x4'].setOwner(1);
    map.locations['10x1'].setOwner(-1);

    map.updateMapScale();

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
        if (map.getWidth() <= 1366 && map.getHeight() <= 768) { 
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
            if (locationsContainer.position.x < 1366 - map.getWidth()) {
                locationsContainer.position.x = 1366 - map.getWidth();
            }
            if (locationsContainer.position.x > 0) {
                locationsContainer.position.x = 0;
            }

            if (map.getWidth() <= 1366) {
                locationsContainer.position.x = (1366 - map.getWidth()) / 2;
            }

            locationsContainer.position.y = locationsContainer.camera.y;
            if (locationsContainer.position.y < 768 - map.getHeight()) {
                locationsContainer.position.y = 768 - map.getHeight();
            }
            if (locationsContainer.position.y > 0) {
                locationsContainer.position.y = 0;
            }

            if (map.getHeight() <= 768) {
                locationsContainer.position.y = (768 - map.getHeight()) / 2;
            }
        }
    };
    
    mapContainer.addChild(locationsContainer);
    map.mapContainer = mapContainer;
    
    return map;
});


