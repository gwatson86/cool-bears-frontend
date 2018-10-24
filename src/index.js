hoomanName = '';
hooman = null;
centiseconds = 0;
setInt = null;
bears = [];
hoomen = [];
activities = [];

URL = 'http://localhost:3000';

document.addEventListener('DOMContentLoaded', () => {
    loginDiv = document.getElementById('login');
    bearsDiv = document.getElementById('bears');
    bearContainerDiv = document.getElementById('bear-container');
    bearActivityDiv = document.getElementById('bear-activity-container');
    timerDiv = document.getElementById('timer-div');
    fetchData('bears').then(b => bears = b).then(addEventListeners);
    fetchData('hoomen').then(h => hoomen = h);
    fetchData('activities').then(a => activities = a);
    renderLogin();
})

function addEventListeners() {
    document.addEventListener('click', (event) => {
        event.preventDefault();
    
        if (event.target.id === 'login-button') {
            name = document.getElementById('hooman-name').value
            hoomanName = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase() ;
    
            if (hoomanName.includes(' ')) {
                alert('Username cannot include spaces!');
                document.getElementById('hooman-name').value = '';
            } else if (hoomanName === '') {
                alert('Username cannot be blank!');
            } else {
                findOrCreateHooman(hoomanName);
                renderWelcome();
                renderBears(bears);
            }
        }
    
        if (event.target.id === 'logout-button') {
            hoomanName = '';
            renderLogin();
            bearsDiv.innerHTML = '';
            bearContainerDiv.innerHTML = '';
            bearActivityDiv.innerHTML = '';
            timerDiv.innerHTML = '';
        }
    
        if (event.target.className === 'bears-list') {
            let bearId = event.target.dataset.id;
            renderBearContainer(bearId);
            renderInstructions(bearId);
            index = 0;
            centiseconds = 0;
            stopTimer();
            renderTimer();
        }
        
        if (event.target.id === 'phrase-submit-button') {
            let bearId = event.target.dataset.id;
            let phraseInput = document.getElementById('phrase-input').value
            if (comparePhrase(phraseInput, bearId)) {
                index++;
                renderBearActivityContainer(bearId)
            } else {
                stopTimer();
                bearActivityDiv.innerHTML = `Oh no! You were eaten by ${findBearName(bearId)}!`
            }
        }
    
        if (event.target.id === 'play-button') {
            if (hooman.eaten) {
                alert("Dis hooman eat by bear. No play no mor.")
            } else {
                let bearId = event.target.dataset.id;
                renderBearActivityContainer(bearId);
                renderTimer();
            }
        }
    })
}

function fetchData(route) {
    return fetch(`${URL}/${route}`)
    .then(response => response.json())
    .then(json => {
        return json;
    })
}

function findOrCreateHooman(name) {
    let foundHooman = hoomen.find(hooman => {
        return hooman.name === name
    })

    if (foundHooman === undefined) {
        createNewHooman(name);
    } else {
        hooman = foundHooman;
    }
}

function renderLogin() {
    loginDiv.innerHTML = 
        `<form>
            <input id='hooman-name'>
            <button id='login-button'>Login</button>
        </form>`
}

function renderWelcome() {
    loginDiv.innerHTML = `Welcome, ${hoomanName}! <button id="logout-button">Logout</button>`
}

function renderBears(bears) {
    bears.forEach((bear) => {
        bearsDiv.innerHTML += `<p class="bears-list" data-id="${bear.id}">${bear.name}</p><hr>`
    })
}

function renderBearContainer(id) {
    const bear = bears.find(bear => {
        return bear.id === parseInt(id);
    })

    bearContainerDiv.innerHTML = 
        `<img src=${bear.image_url}>
        <p>Name: ${bear.name}</p>
        <p>Species: ${bear.species}</p>
        <p>Nationality: ${bear.nationality}</p>
        <p id='favorite-hooman'>Favorite Hooman: ${findHooman(bear.hooman_id)}</p>
        <p id='fastest-time'>Fastest Time: ${bear.top_time} s</p>`
}

function renderTimer() {
    let timer = document.getElementById('timer-div');
    timer.innerHTML = 
        `<h2>Timer</h2>
        <h2 id='timer'>${centiseconds}</h2>`
}

function createNewHooman(hoomanName) {
    fetch(`${URL}/hoomen`, {
        method: "POST",
        body: JSON.stringify({name: hoomanName}),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(response => {
        hooman = response;
    })
}

function findHooman(id) {
    let foundHooman = hoomen.find(hooman => {
        return hooman.id === id;
    })
    return foundHooman.name;
}

function renderInstructions(id) {
    bearActivityDiv.innerHTML = 
        `<p>Instructions</p>
        <p>Instruction paragraph.</p>
        <button id="play-button" data-id="${id}">Play!</button>`
}

function renderBearActivityContainer(id) {
    if (index < activities.length) {
        if (index === 0) {
            startTimer();
        }

        activity = activities[index]
        let specificBearPhrase = activity.phrase.replace("BEAR", findBearName(id))
        bearActivityDiv.innerHTML = 
            `<p>${activity.name}</p>
            <p>${specificBearPhrase}</p>
            <form>
                <input id="phrase-input">
                <button id="phrase-submit-button" data-id="${id}">Submit</button>
                
            </form>`
    } else {
        stopTimer();
        let seconds = centiseconds/100;
        bearActivityDiv.innerHTML = 
            `<p>Activities Completed!</p>
            <p>Your time: ${seconds} seconds</p>`
        compareAndSetTime(seconds, id);
    }
}

function findBearName(id) {
    let foundBear = bears.find(bear => {
        return bear.id === parseInt(id);
    })
    return foundBear.name;
}

function comparePhrase(inputPhrase, id) {
    return activities[index].phrase.replace("BEAR", findBearName(id)) === inputPhrase;
}

function startTimer() {
    setInt = setInterval(increaseTime, 10); //timing in "centiseconds"
    function increaseTime() {
        let timer = document.getElementById('timer')
        centiseconds += 1;
        timer.innerText = `${centiseconds}`;
    }
}

function stopTimer() {
    clearInterval(setInt);
}

function compareAndSetTime(seconds, id) {
    let bear = bears.find(bear => {
        return bear.id === parseInt(id);
    })

    if (bear.top_time > seconds) {
        let favoriteHooman = document.getElementById('favorite-hooman');
        let fastestTime = document.getElementById('fastest-time');
        favoriteHooman.innerText = `Favorite Hooman: ${hooman.name}`;
        fastestTime.innerText = `Fastest Time: ${seconds} s`;
        bear.hooman_id = hooman.id;
        bear.top_time = seconds;


        fetch(`${URL}/bears/${id}`, {
            method: 'PATCH',
            body: JSON.stringify({
                top_time: seconds,
                hooman_id: hooman.id
            }),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
    }
}