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

        if (event.target.className === 'favorite-hoomen') {
            if (activeButton)
                activeButton.classList.remove("highlighted")
            activeButton = event.target
            activeButton.classList.add("highlighted")
            renderChart();
        }
    
        if (event.target.className === 'bears-list') {
            if (activeButton)
                activeButton.classList.remove("highlighted")
            activeButton = event.target
            activeButton.classList.add("highlighted")

            let bearId = event.target.dataset.id;
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
                bearActivityDiv.innerHTML = `Oh no! You were eaten by ${findBearName(bearId)}!`
                hooman.eaten = true;
                updateEatenStatus(hooman.id);
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
    bearsDiv.innerHTML += 
        `<div class="favorite-hoomen" data-id="0">Favorite Hoomen</div><hr>`

    bears.forEach((bear) => {
        bearsDiv.innerHTML += `<div class="bears-list" data-id="${bear.id}"><img class="bears-thumbnail" src="${bear.image_url}"> ${bear.name}</div>`
    })   
}

function renderBearContainer(id) {
    const bear = bears.find(bear => {
        return bear.id === parseInt(id);
    })

    bearContainerDiv.innerHTML = 
        `<img src=${bear.image_url}>
        <h3>${bear.name}</h3>
        <p><img class="icon" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAkFBMVEX///8AAAD5+fn09PT8/Pzn5+fk5OT29vbw8PBxcXHs7OylpaXW1tb6+vrb29uwsLAjIyOQkJDOzs4vLy9JSUm2trY9PT2GhoZXV1e5ubmenp7GxsbAwMAeHh41NTUrKytsbGx3d3eAgIAUFBQ8PDxNTU0VFRVdXV2hoaFERESUlJSLi4tkZGQ0NDQLCwtaWlqWtvijAAARj0lEQVR4nM1d6UIqOwyWTQYYAVkEWYRBccOD7/92VzZJ0qRNZzr1fv/OYZx02jRJs/XmJg+qg/fNR/+5snz5zmaDaq536OjMsu+XZeW5/7F5L5EOQdKbVjC+Z+0S6LRn34TOtJeUQIfidrOvMMi6gel0M45MJbsNTIei2WLpHic45Dq2KZtc0WoGpGOgJ9I9oBOMTsdKpxeMDkV1bSVcqWwbQeg0tg4665JkTnvlIFypLEPsxu7SSWdVhmS76TrpHjAoTGegohNasP3gVkW4UlkUpDNX0gkuU2usjgg/uzpO+cG+FujLLvjQUq6sikjz6lBN5yPYtx0xMSn0X7br6QMjfbYF6DBSdPUwXW9f+uYPm2Bfd8Ps/n+79O70U3c2oj/m11eGvh3Nzkx/l+6e6I/FpdoV5OX7Xh3+On8gpPOqqyrZ7C9z+Gu9R37+l/t7DBATI6vTBz7xAxPuJY10vhj3Ou+d3ngxT1nbYIdf80l/r2f4gXBGFH7vO/PEAE8vEuVJt3ffMiXIsHXf66KzAlZIe44J3/E7Qn0g3h1j9pkUPXN/+e9qOnszvg3ibZb+8vQ9+iVl6YzRM6EsVCRK7oWHkDBaHfm42vt2G2A/pt537/iRdSSX5wIdNA2jMB+IlPCb+BjaRD8cNnDZ6RDrOZmjnUgH8UQY420GXymfHupwq319alYPYvn5Bf41lMVxA/7VLMgXwknLLM/hLVIM/GY/YQOek1nKA8gitR0Am77LJuPVZvm1wYNBrFPIFXZbkDHtcsJukEHJF+LMvQDvM3Qwgvbg44b9CPapflIHKGjslmCDDjQ37CsDhW4IUQNnzC6c68G+0DALEaD6snOVDlDFWg/WqUXS7F+mWWc+H6Td2246mM872fTlWX58yRs0Z0DrTjJAfAA0+d7GPe/GOC/4+kw5z1E7RSoQgzN+L2gA6S5bBnpALrWsoWTB3HdtZ6lq9174uy+ZU+EahuBSaHeL+7DBcuhyYuW2M9IJ+8evIsPAfRjiAAW1hWTLdzk/1cPYLjCuqI/pGfqAvTSfcM5DaAs4Y2v+kZQO7gdT6XDAY84FKgQOWLsf8UICabJ7alEx0Pf3oQwYZxO7QlX4RJBwG4zicWz6aAzsNd/u6Lwab3pkHoNMOs1FiAJKu2fzZ9ML38prDtfM2B3DC3AeQqhD8gmGnjJNNW7etTD5wZCoyC0WxqFYRRuEbO2Ecta02M5IqMR5Je9DHod+oDAbOuT3EcXmCxkQ60j0Aj2DvaCzYoKcOSH0/QE1RHEILTBqyYRwflHH9xr81v6HfgoWnckwyasmpo6LMNuCyq6rS4NEpmw+FT+0CcnNmXFoTDFUTE94b3ND/j9MUP0Imjnwen8kSkJu4eKyZK2OzpPbe2q+hnPq33BRr1H2SKY0hAF1AbEDN4+ZOYIiUTwTihh3yFiXKpofOM7N2J4YQVnmxpVSUwlzqkCwJwsFFGsXZHFn9IbofYoP7VFQj7o1dSCMO5/AxjcB5fYvbM7JElbwgIHoHSuHoDilbPA0CNpCwtlDSfQ438YPtqXkfJ3Bx5fKyvnkdZQtLhUCM9PpFMJnyWNn0NqXImIwkjFNTi6PaRIynd/jGGnQP2ijuS1vCUnUflfm/rMRDp1CB9GEhMI4ZXSA59AylxDPZcAcKBeQ5V9u8jxS+yFPL3bAbRj2DGMCquBy2QWgDjVxEd+hBtC/+BDe+uUB/fz7UqsfftCECiOSrkBnxS/5sZp+PIlFHsMoavAzoQAo30SbezysVJY6+X5wwKxEPyS0v2PpC+gFliTp2XW9ch+rGudsMSnIAo3Tp9xj9oOC5K+Typ09+CsspTQhmKCce8xegCpK2IZAYbqOjoAJFQHRsivXToCpT4KlD2IPrggfiMQIMQ+Y5OEXWM4LRRgdTHvfrsNg2uyafwTOaHllaxDQohHc3CDS+eL4QmA9tPhHoAO8eGhLA5hvKjwCltnlZszcCwTofRcYtx7QUhQeAfnCLtlwVQbDO+ERQC9QYrcDQB0yYf0TfoWp2wv3K0zFkwMIM7/kHLMfQD73UHwoPWkxjZl1MgKf5KORimBIgLC+LWd43nl/1IXZq4/vHZsaADnBfa+R5gUI48XZ+MDztYxCEKxh2cffE7ax1xDo6LKc3RhAZa6iEBzGJgimNI6kAdpiH4UgOOXHYRqYtRSFIKAXJlPPBZigUEbckAKe1oLW/oqAboXSAnkAMGmhpMgoAfTvlR3pOmAcmR72eIdPUDCRAXqRvN6AYgzZBv3PEcgdAPTTvvyAVxsoizgmDWab8h0n0IkRY1Mc8B6VJlROcUQp9tGGykMWUYVJwXGciaSm2Ue6tW8Hj73Hwa3P5oWSexgr9oQ2oppN093oIjP2o516YnLRKgyUqKhj05RmqX3ovhFVbcYKPd3c1GAJgmr3k9YgR6gS7aGJuCwzJ4IA1rZodBSfoaaZGyhnBI9xKUBV2wpPO99kSnG6RFlmcYIWZ8AhuyWclEfpPHshqR3nuH0BSqd1LyJTeFfR8DdKTI6Q0QaAcpXcrRv4XgROrsPFOmXnRBCgSgS3njJr0jR5Khl8PM7x/gq8tdy6rYZGe5gVt+jHRRexLLZfoEXUdKFLHlsfJwG1/2g9KjJRmqhMLfYS0loopapKGo3bRkOZZ4MLSiNmXl6AWwWEDz/jhOtoKW0QeF+F9rqRsqBopwoIUigUtqMoqV6LZ3Mj4L4dy5A7JcE2giV7rlSQKudhOJVMmnzSaudoaBCD+iHUJxr109F14RlGw5ZhoF7QRpPFP+JSpt/HcwifdJcpr4oRHzHBNsQtLvRYKz1O/J5AKLks2gRAKHOM5SkFqEp9r0ZFxMKt1I79OaKP5gypv1Oh+baU4sbJ2QOwFndP89k3XWsz19gaw9GcNPM3cNqZ/ZVB2lzqgTUFN7adlGnIo26WGtL3xtUYqMXIjt8/Ez1f3bJtMzvYkRwreHgE+qLXmuRqmo41dlzzkb+QZP7zEzLAI2oM3Iv1SJgzRA7zni3sO7K9yHhX4/NRWhlTGQlIU5wTsRKj+fwFDzPJlktnYleB0fk4gWzwaBoD+9l+BYCt6cLz230vbSdJrVlt1pKk3e19fpm9y6749f7+jb8NnXyBEE8VVzcsh4puw0Ow6EgtxclntUzrHW0ClA8bqGgEhikV6KIE4gPrirtRjRExiJDGiJJ96RBvY/eNQjasDF9/NbbGYDQFGZG1zYsDM8YSiq0xkKbgc4SrHfW1Owj7Dp8TQAyokqHc+AuhLYkFD6J7IK7GQAccm4Moneiv/fmRINZ+vEhjlJwmjH3t9umsDrTKY+O4vDGmxkDMp9gSg5l8zd95SWaKEaPNX2oxMBJrz0oHcNprjTiOHY7WPaX3seoS4KGANYVPQK3e6M5nn5NNtl6vs83k833RbfiEk1CorUSNodAUZQEZUqWdMf7CRLwAa4yyiiCQpliXREQCinmXdMbw0RThgd2X5SSAofN4/Lg6EgKl1AggTbH38xWGQB15gkrQGE1EIE7lPwbSGMGvsCTN4SxmRXe+yJ+z0F3MLX+MDKrgGgMnCIma4vZopD3kjFscd/pUlGFY1IXWGDpNMXdOgQW/HyAKyjI1BvZpS7N8zZbME7O9moTSHsMmR1iNodMUQKD7iyIgq8VmSUgYBNUYOPIiPQXTav2zziELiqcWNI6AGgNlBMtVjlAn+9/WC9lEXESczhcuRQnFvkTmqEGN6R/PhLJMjtqj7RJMYyjPFMiL6F/OipZHzFovxzjWaQq0hHmKPeGfy4tYhsbAmkJUtOhWMtulYhI6qheUoTGU3if4VK5uik0dE4TXGDpNgVcg521IuldUilNCQPdHWQQIcuRnu1kv9UkKTdLebJchNhCfxRqjeA0r0hSyluOq07abhYZ+dbHhnKry6iCNUbhKATsPZINacOG/Zi4bPM2EoLAcKgyrMXSaoiFf1VhZ2uTdnE/EOOJLFNsojlEwVwprCiFxJHFck/shfePcesHDj80ibGV8WC2mMVCyh6ApFBHRL06B1ywLf4Fg2yCNUaiHG9YUrBu+6Qq9nGAWqnHlbCamrGbFt9YWcRqhF7GaQn3LMa3gy7R/yDIh1hj5PxAtIduy0CNmP4Wao6pb+SNYTkU5H/kXEakATuxzRegiXq6Cqk0LKqzgUseRxsidg4KiIWvmAUsmNIf+Rd7ULDqCA3cgRhojb5QIBakZwc0lvf7geSVldv07yar6E//zcrgSbrJhPhFdj5rTsEHFR8xxmruR5WuWNpJaM2l0xxsmdejUhZDZg/1s3G0kzVrSSGecEmGkHFTCw3zWKTqJmUtoFtmveli0p2Yy+GGizKVf42B3s2fagKZ9k9h/1gCukVmt3aR76YUR623j6tSFeb9ZizGV5lQU9U29CN+drwcYnGszm4eOXbA+BmTP7en1z0+ClKB6yHRPwqnKF+yDPGZwASli3YtJFXfWIorKmximo4VjxkwoOqc7AAp0zJbVeGn6tmTuzPKBtl4FbbwPjHjXHRhDvkaqthfgA++HXZTJho+9DOwOHz2MIzFYgnxZRECp0Vwy7AR39huQLAPX7iHFspQM0Dr5qvfA6+kX4iV0Rwv5ijR3c25c0U0XEbw1n90GXkCddmgXKuxevOYXKALVyPYntyHVgUbJtw+hbYElCRKkqigTd62oypjM4F9gjVtclk7E0SBbRec0NE0x3aAS+U/g0TRfjAZyCDJtUWMcpdFrlkUr0xKR+Y/4Gi5vvhMiciRCOYbsLm2hIV1ELV8hrxP0haB5zudSRJYn1FyQfdXsQRpd6NtoSNSgCmKsVhUgG0C7DX65vgAfH6b0uZuQv4HaQxyWt90gEoBXqyFh/9cJFH3zCb9B1fS7J+pOD4sGdWQY/s4T3IYeMgzHBzxyiiCb/p5xMvgyx102FmCDcn3+X8VNOizQyzzGBGf0IjPx2bpAJzf0nsroJKzhFveRYVCa+gQboGY/WbI1Eg3weBkFjZntmmSkPi/LJYIPIDNTpT7MQlFSw685GUBz0Mukh6LGi6+AOHiqD3bUH1fs7hmmQ8sy71UFcP962SCAJ/eMA69gxxi709erBglKDK8mL/YIQOEbA63tIf4HX7j2eRMPWxTTawvk5lJbkMM/f85EzVJK6CVpoHb1kjSW6u+HIOnedYs/0Oc90P/q5d+Uyb+FasUnx+l9ND6cKB+NL7fCCZjNPpcYxUNi4Mh0TqsNwprk4Y2mEEnLbXl7LL7AQbvQXXdrG65A20OU4awHD2HKCfP9powaxNqYUUz6tcA+U737j9mG03FpNZbJ4LM1Qj1J1BYFHah6apCd/TpqfXqlBOYDNKGX2ugr3cjaHYyaRsRq6Y2iv8q71Y0Gdq9KQYEkaYwLtI6AySxKs8bMS1HyN1zCECaaDuhgrDJPOK2tctWgs02e7PF8aHuPlGtbo1kR7GWN2PE6QyN115NiT+IFbrlRRzMT7xIWynROB72UhujMoMChgKjF1TgTwxFg40JrJzgsS8QqlXWowauQ4JFaA1DyBzo+kRikkfvOk+yDqWxn8HfMXCCLx+QbPxn3Ag8z+24peLzq1M9DP3gtnKNSYiI8Re87T6NlbPKWuYAzM/eEc+ia6WJhm9qrYHLfhnxjbWwcnA/OOeOEsqRHhbbZnOgPOiWbmW0/2H6m58He3Y6/zAPl82EO2mYS6f6rd3vWqrX0k8lNiXnVEwDbX285fHhbb5/4LOCTRuMdL/2n0frtg0++dWfelIO61JpawkUaMbECK7Z/crvFEYqaEICr8lPXMBzxV3c/HMHsRQkoQTP16Mr3R3vwAnU/zyG2CRJ1v7r4lwQR6Ip7Ki1jKymXX+lDKBONb/cwWeetrTLvArnRSVQ8ujbVhvfJVJ0s/j9YwDPebd9o6UDPGC9X7GPb2lbUx4Ju/Dex+8cak3/8H47G8VtROdCdGR+52qRuXV1Pzeqa7ewPDG0NmoPOZLpa7vfLp23rfV7TmiL12vy9tX06/OFqOukMgsZc/gOhbOPRlFzd1gAAAABJRU5ErkJggg==">: ${bear.species}</p>
        <p><img class="icon" src="https://cdn1.iconfinder.com/data/icons/all-purpose/39/Globe-512.png">: ${bear.nationality}</p>
        <p id='favorite-hooman'><img class="icon" src="https://upload.wikimedia.org/wikipedia/commons/1/1e/Heart-SG2001-transparent.png">: ${findHooman(bear.hooman_id)}</p>
        <p id='fastest-time'><img class="icon" src="https://banner2.kisspng.com/20180403/hhq/kisspng-power-symbol-computer-icons-time-5ac30c32df3819.6284962915227320829143.jpg">: ${bear.top_time} s</p>`
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
    if (index < activities.length) {
        if (index === 0) {
            startTimer();
        }

        activity = activities[index]
        let specificBearPhrase = activity.phrase.replace("BEAR", findBearName(id))
        bearActivityDiv.innerHTML = 
            `<h3>${activity.name}</h3>
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
        timer.innerText = `${centiseconds/100}`;
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

function renderChart() {
    
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
        `<div><h3>Favorite Hoomen</h3></div>
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