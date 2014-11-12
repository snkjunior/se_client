game.server.mission.events.initMission = function(data) {
    if (!data.isSuccess) 
        return console.log("Ошибка авторизации");
    
    var result = game.initMission(data.data);
    if (!result) 
        return console.log("Ошибка при создании карты");
    
    game.server.sendMessage("mission", "initMissionResult", {isSuccess: 1});
};