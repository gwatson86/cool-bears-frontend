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