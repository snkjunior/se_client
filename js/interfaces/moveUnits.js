game.interfaces.moveUnits = {
    template: "",
    
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
        this.unitsInLocation([
            {unitId: 1, count: ko.observable(100)},
            {unitId: 2, count: ko.observable(30)},
            {unitId: 3, count: ko.observable(6)}
        ]);
        this.unitsToMove([
            {unitId: 1, count: ko.observable(10)}
        ]);
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


