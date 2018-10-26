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