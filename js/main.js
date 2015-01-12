function main() {
    //var playerId = prompt("Введите ид игрока, под которым будете играть: 1 или 2");
    var playerId = 1;
    console.log(playerId);
    if (playerId == 1 || playerId == 2) {
        game.init(playerId);
    } else {
        alert("Неверный игрок");
    }
}

