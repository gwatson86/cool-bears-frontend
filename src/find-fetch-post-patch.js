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

function findHooman(id) {
    let foundHooman = hoomen.find(hooman => {
        return hooman.id === id;
    })
    return foundHooman.name;
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

function fetchData(route) {
    return fetch(`${URL}/${route}`)
    .then(response => response.json())
    .then(json => {
        return json;
    })
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