hoomanName = '';
hooman = null;
centiseconds = 0;
setInt = null;
bears = [];
hoomen = [];
activities = [];
activeButton = null;

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

        if (event.target.id === 'favorite-hoomen') {
            if (activeButton)
            activeButton.classList.remove("highlighted")
            activeButton = event.target
            activeButton.classList.add("highlighted")
            renderFavoriteHoomenChart();
        }

        if (event.target.id === 'hangriest-bears') {
            if (activeButton)
            activeButton.classList.remove("highlighted")
            activeButton = event.target
            activeButton.classList.add("highlighted")
            renderHangriestBearsChart();
        }
    
        if (event.target.className === 'bears-list' || event.target.className === 'bears-list highlighted') {
            
            if (activeButton) {
                activeButton.classList.remove("highlighted");
            }
            activeButton = event.target;
            activeButton.classList.add("highlighted");
            let bearId = activeButton.dataset.id;
            renderBearContainer(bearId);
            renderInstructions(bearId);
            index = 0;
            centiseconds = 0;
            stopTimer();
            let timer = document.getElementById('timer-div');
            timer.innerHTML = '';
        }

        if (event.target.className === 'bears-thumbnail') {
            if (activeButton) {
                activeButton.classList.remove("highlighted");
            }
            activeButton = event.target.parentNode;
            activeButton.classList.add("highlighted");
            let bearId = activeButton.dataset.id;
            renderBearContainer(bearId);
            renderInstructions(bearId);
            index = 0;
            centiseconds = 0;
            stopTimer();
            let timer = document.getElementById('timer-div');
            timer.innerHTML = '';
        }
        
        if (event.target.id === 'phrase-submit-button') {
            let bearId = event.target.dataset.id;
            let phraseInput = document.getElementById('phrase-input').value
            if (comparePhrase(phraseInput, bearId)) {
                index++;
                renderBearActivityContainer(bearId)
            } else {
                stopTimer();
                bearActivityDiv.innerHTML = 
                    `<h3>Oh no! You screwed it up and now ${findBearName(bearId)} ate you!</h3>
                    <h4>Correct answer: ${activities[index].phrase.replace(/BEAR/g, findBearName(bearId))}</h4>
                    <h4>Your answer: &emsp; &emsp; ${phraseInput}</h4>`
                bearContainerDiv.children[0].src = `../cool-bears-backend/app/assets/images/${findBear(bearId).eaten_image}`
                hooman.eaten = true;
                hooman.eaten_by = findBearName(bearId);
                updateEatenStatus(hooman.id);
                updateEatenByStatus(hooman.id, bearId);
            }
        }
    
        if (event.target.id === 'play-button') {
            if (hooman.eaten) {
                alert(`Dis hooman eat by ${hooman.eaten_by}. No play no mor.`)
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
    bearsDiv.innerHTML += 
        `<div id="favorite-hoomen">Favorite Hoomen</div>
        <div id="hangriest-bears">Hangriest Bears</div><hr>`

    bears.forEach((bear) => {
        bearsDiv.innerHTML += `<div class="bears-list" data-id="${bear.id}"><img class="bears-thumbnail" src="../cool-bears-backend/app/assets/images/${bear.image_url}"> ${bear.name}</div>`
    })   
}

function renderBearContainer(id) {
    const bear = findBear(id);

    bearContainerDiv.innerHTML = 
        `<img src="../cool-bears-backend/app/assets/images/${bear.image_url}">
        <h3>${bear.name}</h3>
        <p><img class="icon" src="../cool-bears-backend/app/assets/images/bear-icon.png">: ${bear.species}</p>
        <p><img class="icon" src="../cool-bears-backend/app/assets/images/globe-icon.png">: ${bear.nationality}</p>
        <p id='favorite-hooman'><img class="icon" src="../cool-bears-backend/app/assets/images/heart-icon.png">: ${findHooman(bear.hooman_id)}</p>
        <p id='fastest-time'><img class="icon" src="../cool-bears-backend/app/assets/images/time-icon.jpg">: ${bear.top_time} s</p>`
}

function renderTimer() {
    let timer = document.getElementById('timer-div');
    timer.innerHTML = 
        `<center><h3>Timer</h3>
        <h1 id='timer'>${(centiseconds/100).toFixed(2)}</h1></center>`
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
        hoomen.push(hooman);
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
        `<h3>Want to be ${findBearName(id)}'s favorite Hooman?</h3>
        <p>Play with ${findBearName(id)}, a dangerous wild animal! What could possibly go wrong?</p>
        <p>${findBearName(id)} is very particular about playtime. 
        Make sure you type each command exactly as shown!</p>
        Click 'Play!' to begin and the timer will start.</p>
        <button id="play-button" data-id="${id}">Play!</button>`
}

function renderBearActivityContainer(id) {
    console.log("renderding activity container")
    if (index < id) {
        if (index === 0) {
            shuffle(activities);
            startTimer();
        }

        activity = activities[index];
        let specificBearPhrase = activity.phrase.replace(/BEAR/g, findBearName(id))
        bearActivityDiv.innerHTML = 
            `<h3>${activity.name}</h3>
            <p class="noselect">${specificBearPhrase}</p>
            <form id="phrase-form">
                <input size="40px" autofocus="autofocus" id="phrase-input"><br><br>
                <button id="phrase-submit-button" data-id="${id}">Submit</button>
            </form>`
        document.getElementById('phrase-input').focus();
    } else {
        stopTimer();
        let seconds = centiseconds/100;
        bearActivityDiv.innerHTML = 
            `<center><h3>Activities Completed!</h3></center>
            <center><p>Your time: ${seconds} seconds</p></center>`
        compareAndSetTime(seconds, id);
    }
}

function findBearName(id) {
    let foundBear = bears.find(bear => {
        return bear.id === parseInt(id);
    })
    return foundBear.name;
}

function findBear(id) {
    let foundBear = bears.find(bear => {
        return bear.id === parseInt(id);
    })
    return foundBear;
}

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

function compareAndSetTime(seconds, id) {
    let bear = bears.find(bear => {
        return bear.id === parseInt(id);
    })

    if (bear.top_time > seconds) {
        let favoriteHooman = document.getElementById('favorite-hooman');
        let fastestTime = document.getElementById('fastest-time');
        favoriteHooman.innerHTML = `<img class="icon" src="../cool-bears-backend/app/assets/images/heart-icon.png">: ${hooman.name}`;
        fastestTime.innerHTML = `<img class="icon" src="../cool-bears-backend/app/assets/images/time-icon.jpg">: ${seconds} s`;
        bearActivityDiv.innerHTML += `<p>Your foolish frolicking with ${bear.name} was fast enough to fortify you as ${bear.name}'s favorite friend! Congratulations!</p>
                                      <p>You beat the previous time by ${(bear.top_time - seconds).toFixed(2)} seconds!`
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
    } else {
        bearActivityDiv.innerHTML += `<p>You were too slow by ${(seconds - bear.top_time).toFixed(2)} seconds!</p>
                                      <p>Next time, play with ${bear.name} faster and more recklessly!`
    }
}

function updateEatenStatus(id) {
    fetch(`${URL}/hoomen/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({eaten: true}),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
}

function updateEatenByStatus(id, bearId) {
    let data = {eaten_by: findBearName(bearId)}
    fetch(`${URL}/hoomen/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
}

function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function renderFavoriteHoomenChart() {
    
    const favoriteHoomen = {}
    bears.forEach((bear) => {
        if (Object.keys(favoriteHoomen).includes(bear.hooman_id.toString())) {
            favoriteHoomen[bear.hooman_id] = favoriteHoomen[bear.hooman_id] + 1;
        } else {
            favoriteHoomen[bear.hooman_id] = 1;
        }
    })

    favoriteHoomenNames = Object.keys(favoriteHoomen).map(id => {

        let foundHooman = hoomen.find(hooman => {
            return parseInt(hooman.id) === parseInt(id);
        })

        return foundHooman.name
    })

    bearActivityDiv.innerHTML = '';
    timerDiv.innerHTML = '';
    bearContainerDiv.innerHTML = 
        `<div><center><h3>Favorite Hoomen</h3></center></div>
        <canvas id="chart" width="450" height="300"></canvas>`;

    var myChart = new Chart(document.getElementById('chart'), {
        type: 'bar',
        data: {
            labels: favoriteHoomenNames,
            datasets: [{
                label: 'Bears',
                data: Object.values(favoriteHoomen),
                backgroundColor:
                    'rgba(75, 96, 85, 0.25)',
                borderColor:
                    'rgba(75, 96, 85, 1)',
                borderWidth: 2
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero:true,
                        fixedStepSize: 1,
                        fontSize: 10,
                    },
                    scaleLabel: {
                      display: true,
                      labelString: 'Bears',
                      fontSize: 20
                    }
                }],

                xAxes: [{
                    ticks: {
                        fontSize: 10
                    },
                  scaleLabel: {
                    display: true,
                    labelString: 'Hooman',
                    fontSize: 20
                  }
                }]
            },
            responsive: false,
            maintainAspectRatio: true
        }
    });
}

function renderHangriestBearsChart() {
    
    const hangriestBears = {}
    hoomen.forEach((hooman) => {
        if (hooman.eaten_by !== "") {
            if (Object.keys(hangriestBears).includes(hooman.eaten_by)) {
                hangriestBears[hooman.eaten_by] = hangriestBears[hooman.eaten_by] + 1;
            } else {
                hangriestBears[hooman.eaten_by] = 1;
            }
        }
    })

    bearActivityDiv.innerHTML = '';
    timerDiv.innerHTML = '';
    bearContainerDiv.innerHTML = 
        `<div><center><h3>Hangriest Bears</h3></center></div>
        <canvas id="chart" width="450" height="300"></canvas>`;

    var myChart = new Chart(document.getElementById('chart'), {
        type: 'bar',
        data: {
            labels: Object.keys(hangriestBears),
            datasets: [{
                label: 'Hoomen Eaten',
                data: Object.values(hangriestBears),
                backgroundColor:
                    'rgba(75, 96, 85, 0.25)',
                borderColor:
                    'rgba(75, 96, 85, 1)',
                borderWidth: 2
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero:true,
                        fixedStepSize: 1,
                        fontSize: 10,
                    },
                    scaleLabel: {
                      display: true,
                      labelString: 'Hoomen Eaten',
                      fontSize: 20
                    }
                }],

                xAxes: [{
                    ticks: {
                        fontSize: 10
                    },
                  scaleLabel: {
                    display: true,
                    labelString: 'Bear',
                    fontSize: 20
                  }
                }]
            },
            responsive: false,
            maintainAspectRatio: true
        }
    });
}