function fetchData(route) {
    fetch(`${URL}/${route}`)
    .then(response => response.json())
    .then(json => {
        return json;
    })
}

bears = fetchData(bears)