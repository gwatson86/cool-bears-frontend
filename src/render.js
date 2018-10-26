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

function renderTimer() {
    let timer = document.getElementById('timer-div');
    timer.innerHTML = 
        `<center><h3>Timer</h3>
        <h1 id='timer'>${(centiseconds/100).toFixed(2)}</h1></center>`
}