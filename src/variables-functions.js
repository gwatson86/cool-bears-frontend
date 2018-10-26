hoomanName = '';
hooman = null;
centiseconds = 0;
setInt = null;
bears = [];
hoomen = [];
activities = [];
activeButton = null;

URL = 'http://localhost:3000';

function comparePhrase(inputPhrase, id) {
    return activities[index].phrase.replace(/BEAR/g, findBearName(id)) === inputPhrase;
}

function startTimer() {
    setInt = setInterval(increaseTime, 10); //timing in "centiseconds"
    function increaseTime() {
        let timer = document.getElementById('timer')
        centiseconds += 1;
        timer.innerText = `${(centiseconds/100).toFixed(2)}`;
    }
}

function stopTimer() {
    clearInterval(setInt);
}

function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}