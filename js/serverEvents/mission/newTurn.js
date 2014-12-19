game.server.mission.events.newTurn = function(data) {
    var turnResult = data.data;
    console.log(turnResult);
    for (var locationId in turnResult.changedLocationOwner) {
        game.mission.locations[locationId].setOwner(turnResult.changedLocationOwner[locationId]);
    }
    for (var locationId in turnResult.changedLocationUnits) {
        game.mission.locations[locationId].updateUnits(turnResult.changedLocationUnits[locationId]);
    }
};