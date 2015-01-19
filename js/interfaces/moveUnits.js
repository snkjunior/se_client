game.interfaces.moveUnits = {
    template: "",
    
    targetLocation: null,
    unitsInLocation: ko.observableArray([]),
    unitsToMove: ko.observableArray([]),
    
    selectUnitCountPopup: {
        total: 0,
        isShow: ko.observable(false),
        unitId: ko.observable(null),
        unitsInLocation: ko.observable(0),
        unitsToMove: ko.observable(0),
        show: function(unitId, unitsInLocation, unitsToMove) {
            var self = this;
            this.total = unitsInLocation + unitsToMove;
            this.unitId(unitId);
            this.unitsInLocation(unitsInLocation);
            this.unitsToMove(unitsToMove);
            this.isShow(true);
            $(".unitCountSlider").slider({
                min: 0,
                max: unitsInLocation + unitsToMove,
                value: unitsToMove,
                slide: function(event, ui) {
                    self.unitsToMove(ui.value);
                    self.unitsInLocation(self.total - ui.value);
                }
            });
        },
        hide: function() {
            this.isShow(false);
        }
    },
    
    init: function(callback, params) {
        this.targetLocation = params.targetLocation;
        this.unitsInLocation([]);
        this.unitsToMove([]);
        
        for (var unitId in params.unitsInLocation) {
            this.unitsInLocation().push({
                unitId: unitId,
                count: ko.observable(params.unitsInLocation[unitId])
            });
        }
        
        for (var unitId in params.unitsToMove) {
            this.unitsToMove().push({
                unitId: unitId,
                count: ko.observable(params.unitsToMove[unitId])
            });
        }
        
        callback();
    },
    
    onReady: function() {
        $('.unitList').jScrollPane();
    },
    
    clickOnUnit: function(unit) {
        var self = game.currentInterface;
        var unitId = unit.unitId;
        self.selectUnitCountPopup.show(unitId, self.getUnitCountById(unitId, self.unitsInLocation()), self.getUnitCountById(unitId, self.unitsToMove()));
    },
    
    clickApplyUnitsMove: function() {
        var self = game.currentInterface;
        
        var units = {};
        for (var i = 0; i < self.unitsToMove().length; i++) {
            units[self.unitsToMove()[i].unitId] = self.unitsToMove()[i].count();
        }
        
        console.log(units);
        
        game.mission.addAction("move", {
            units: units,
            endLocationId: self.targetLocation.x + "x" + self.targetLocation.y
        });
        console.log(1);
        game.mission.setMoveMode(false);
        game.mission.selectedLocation.showUnitsSprite();
        game.mission.updateButtonsVisible(game.mission.selectedLocation.getButtonsVisible());
        
        game.hideInterface();
    },
    
    clickCloseInterface: function() {
        game.hideInterface();
    },
    
    clickApplyUnitCount: function() {
        var self = game.currentInterface;
        
        self.updateUnitCount(self.selectUnitCountPopup.unitId(), self.unitsInLocation, self.selectUnitCountPopup.unitsInLocation());
        self.updateUnitCount(self.selectUnitCountPopup.unitId(), self.unitsToMove, self.selectUnitCountPopup.unitsToMove());
        
        self.selectUnitCountPopup.hide();
    },
    
    getUnitCountById: function(unitId, unitList) {
        for (var i = 0; i < unitList.length; i++) {
            if (unitList[i].unitId == unitId) {
                return unitList[i].count();
            }
        }
        return 0;
    },
    
    updateUnitCount: function(unitId, unitList, count) {
        var num = null;
        for (var i = 0; i < unitList().length; i++) {
            if (unitList()[i].unitId == unitId) {
                if (count == 0) {
                    unitList.splice(i, 1);
                    return;
                }
                num = i;
            }
        }
        
        if (count == 0) {
            return;
        }
        
        if (num != null) {
            unitList()[num].count(count);
        } 
        else {
            unitList.push({
                unitId: unitId,
                count: ko.observable(count)
            });            
        }
        
        console.log(1);
        unitList().sort(function(a, b) {
            if (a.unitId > b.unitId) {
                return 1;
            } 
            return -1;
        });
        
        unitList.valueHasMutated();
    }
};


