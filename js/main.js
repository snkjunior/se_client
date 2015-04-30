function main() {
    if (!$.cookie('playerId')) {
        var playerId = prompt("Введите ид игрока, под которым будете играть: 1 или 2");
        console.log(playerId);
        if (playerId == 1 || playerId == 2) {
            $.cookie('playerId', playerId, 60*60*24*30);
            game.init(playerId);
        } else {
            alert("Неверный игрок");
        }
    } else {
        game.init($.cookie('playerId'));
    }
}

