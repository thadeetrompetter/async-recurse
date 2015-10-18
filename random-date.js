var week = 1000 * 60 * 60 * 24 * 7;

function lastWeek(){
    return new Date().getTime() - week;
}

function getOneWeek() {
    return new Date().getTime() - lastWeek();
}

function getRandomDayLastWeek(){
    return Math.floor(Math.random() * getOneWeek() + lastWeek());
}

module.exports = getRandomDayLastWeek;
