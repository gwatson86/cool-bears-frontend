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