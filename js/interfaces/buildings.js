game.interfaces.buildings = {
    template: "",
    
    currentTab: ko.observable(),
    tabs: ["all", "economic", "war"],
    
    selectedBuilding: ko.observable(null),
    showBuildings: ko.observableArray([]),
    buildings: [],
        
    init: function(callback, params) {
        this.buildings = [
            {
                id: 2,
                type: "economic",
                name: "Ферма",
                params: [
                    {
                        description: "+60 золота"
                    },
                    {
                        description: "+10 еды"
                    }
                ],
                price: [
                    {
                        name: 1,
                        value: 400
                    }
                ]
            },
            {
                id: 1,
                type: "economic",
                name: "Лесопилка",
                params: [
                    {
                        description: "+80 золота"
                    },
                    {
                        description: "+10 дерева"
                    }
                ],
                price: [
                    {
                        name: 1,
                        value: 500
                    }
                ]
            },
            {
                id: 3,
                type: "war",
                name: "Кузница",
                params: [
                    {
                        description: "+50 золота"
                    },
                    {
                        description: "+2 сила пехоты"
                    }
                ],
                price: [
                    {
                        id: 1,
                        value: 500
                    }
                ]
            },
            {
                id: 4,
                type: "war",
                name: "Форт",
                params: [
                    {
                        description: "найм ополченцев"
                    },
                    {
                        description: "+5 сила войск при защите"
                    }
                ],
                price: [
                    {
                        id: 1,
                        value: 600
                    }
                ]
            }
        ];
        
        this.clickOnTab("all");
        
        callback();
    },
    
    onReady: function() {
        this.updateScroll();
    },
    
    updateScroll: function() {
        $('.buildingsList').jScrollPane();
    },
    
    clickOnTab: function(tab) {
        var self = game.interfaces.buildings;
        self.currentTab(tab);
        self.showBuildings([]);
        for (var i = 0; i < self.buildings.length; i++) {
            if (self.currentTab() == 'all' || self.currentTab() == self.buildings[i].type) {
                self.showBuildings.push(self.buildings[i]);
            } else if (self.selectedBuilding() != null && self.buildings[i].id == self.selectedBuilding().id) {
                self.selectedBuilding(null);
            }
        }
        self.updateScroll();
    },
    
    clickOnBuilding: function(building) {
        var self = game.interfaces.buildings;
        console.log(1);
        if (game.gold() >= building.price[0].value) {
            console.log(2);
            if (self.selectedBuilding() == building) {
                self.selectedBuilding(null);
            }
            else {
                self.selectedBuilding(building);
            }
        }
    },
            
    clickStartBuilding: function() {

    },
    
    clickCloseInterface: function() {
        game.hideInterface();
    }
};


