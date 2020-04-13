const field = document.getElementById('searchField');
const button = document.getElementById('searchButton');
const table = document.getElementById('beerTable');
const noData = document.getElementById('noData');
const searchInfo = document.getElementById('searchInfo');
const previous = document.getElementById('previous');
const next = document.getElementById('next');
const detailsWrapper = document.getElementById('detailsWrapper');

const state = {
    page: 1,
    currentBeer: ''
}

function handleData(data)  {
    table.innerHTML = '';
    noData.innerHTML = '';
    searchInfo.innerHTML = '';
    detailsWrapper.innerHTML = '';

    previous.disabled = true;
    next.disabled = true;
    
    if (data.length === 0) {
        noData.innerHTML = 'No matches found';
        return;
    } 
    
    searchInfo.innerHTML = `<h3>Results for "${state.currentBeer}"</h3>`;
    field.value = '';
    buildTable(data);

    if (data.length > 9) {
        next.disabled = false;
        if (state.page > 1)
            previous.disabled = false;
    } else {
        if (state.page > 1) {
            previous.disabled = false;
            next.disabled = true;
        }
    }
}

function showDetails(data) {
    detailsWrapper.innerHTML = '';
    const obj = data.pop();

    let title = document.createElement('p');
    title.innerHTML = `<strong>${obj['name']}</strong>`;
    detailsWrapper.appendChild(title)

    let description = document.createElement('p');
    let text = obj['description'] + 'Goes well with: '
    description.innerHTML = text;
    detailsWrapper.appendChild(description)

    let foods = document.createElement('ul');

    obj['food_pairing'].forEach(function(el) {
        let li = document.createElement('li');
        li.innerHTML = el;
        foods.appendChild(li);
    });

    detailsWrapper.appendChild(foods);
}

function buildTable(data) {
    const tbody = document.createElement('tbody');
    const thead = document.createElement('thead');
    
    thead.appendChild(buildHeaderRow());

    data.forEach(obj => {
        const row = buildDataRow(obj);
        tbody.appendChild(row);
    });

    table.appendChild(thead);
    table.appendChild(tbody);
}

function buildHeaderRow() {
    let row = document.createElement('tr');
    
    let name = document.createElement('th');
    row.appendChild(name);
    
    let abv = document.createElement('th');
    abv.innerHTML = '%';
    abv.classList.add('abv');
    row.appendChild(abv);

    let details = document.createElement('th');
    row.appendChild(details);

    return row;
}

function buildDataRow(obj) {
    let row = document.createElement('tr');
    row.setAttribute('id', obj['id']);
    
    let name = document.createElement('td');
    name.innerHTML = obj['name'];
    name.setAttribute('text-align', 'left')
    row.appendChild(name);
    
    let abv = document.createElement('td');
    abv.classList.add('abv');
    abv.innerHTML = obj['abv'];
    row.appendChild(abv);

    let details = document.createElement('td');
    
    let b = document.createElement('button');
    b.innerHTML = 'Details';
    b.classList.add('details');
    b.addEventListener('click', function (e) {
        getBeer(parseInt(obj['id']))
        .then(showDetails)
    });
    
    details.appendChild(b);
    row.appendChild(details);

    return row;
}

function getBeer(id) {
    return fetch(`/details/${id}`)
        .then(res => res.json());
}

function getBeers() {
    return fetch(`/search/${state.currentBeer}/${state.page}`)
        .then(res => res.json());
}

document.addEventListener('DOMContentLoaded', function(event) {
    field.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            state.currentBeer = field.value;
            
            getBeers().then(handleData);
        }        
    });
    
    button.addEventListener('click', function (e) {
        state.currentBeer = field.value;
        
        getBeers().then(handleData);
    });

    previous.addEventListener('click', function (e) {
        state.page -= 1;

        getBeers().then(handleData);
    });
    
    next.addEventListener('click', function (e) {
        state.page += 1;

        getBeers().then(handleData);
    });
})