document.getElementById('movieForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const id = document.getElementById('movieId').value;
    const title = document.getElementById('title').value;
    const year = document.getElementById('year').value;
    const country = document.getElementById('country').value;
    const director = document.getElementById('director').value;
    const actors = document.getElementById('actors').value;
    const genre = document.getElementById('genre').value;
    const image = document.getElementById('image').files[0];

    const reader = new FileReader();
    reader.onloadend = function() {
        const movie = { id: id || Date.now().toString(), title, year, country, director, actors, genre, image: reader.result };

        if (id) {
            updateMovie(movie);
        } else {
            addMovieToList(movie);
            saveMovie(movie);
        }

        $('#movieModal').modal('hide');
        clearForm();
    };

    if (image) {
        reader.readAsDataURL(image);
    } else {
        const movie = { id: id || Date.now().toString(), title, year, country, director, actors, genre, image: '' };
        if (id) {
            updateMovie(movie);
        } else {
            addMovieToList(movie);
            saveMovie(movie);
        }

        $('#movieModal').modal('hide');
        clearForm();
    }
});

function addMovieToList(movie) {
    const movieList = document.getElementById('movieList');
    const card = document.createElement('div');
    card.className = 'movie-card col-md-4';
    card.innerHTML = `
        <img src="${movie.image || 'default-image.jpg'}" alt="${movie.title}" class="img-fluid mb-2">
        <h3>${movie.title}</h3>
        <p><strong>Рік випуску:</strong> ${movie.year}</p>
        <p><strong>Країна виробництва:</strong> ${movie.country}</p>
        <p><strong>Режисер:</strong> ${movie.director}</p>
        <p><strong>Актори:</strong> ${movie.actors}</p>
        <p><strong>Жанр:</strong> ${movie.genre}</p>
        <div class="d-flex justify-content-between">
            <button class="btn btn-edit" onclick="editMovie('${movie.id}')">Редагувати</button>
            <button class="btn btn-delete" onclick="removeMovie('${movie.id}')">Видалити</button>
        </div>
    `;
    movieList.appendChild(card);
}

function saveMovie(movie) {
    let movies = JSON.parse(localStorage.getItem('movies')) || [];
    movies.push(movie);
    localStorage.setItem('movies', JSON.stringify(movies));
}

function loadMovies() {
    let movies = JSON.parse(localStorage.getItem('movies')) || [];
    document.getElementById('movieList').innerHTML = '';
    movies.forEach(movie => addMovieToList(movie));
}

function updateMovie(movie) {
    let movies = JSON.parse(localStorage.getItem('movies')) || [];
    movies = movies.map(m => m.id === movie.id ? movie : m);
    localStorage.setItem('movies', JSON.stringify(movies));
    loadMovies();
}

function editMovie(id) {
    let movies = JSON.parse(localStorage.getItem('movies')) || [];
    const movie = movies.find(m => m.id === id);
    document.getElementById('movieId').value = movie.id;
    document.getElementById('title').value = movie.title;
    document.getElementById('year').value = movie.year;
    document.getElementById('country').value = movie.country;
    document.getElementById('director').value = movie.director;
    document.getElementById('actors').value = movie.actors;
    document.getElementById('genre').value = movie.genre;
    $('#movieModal').modal('show');
}

function removeMovie(id) {
    let movies = JSON.parse(localStorage.getItem('movies')) || [];
    movies = movies.filter(movie => movie.id !== id);
    localStorage.setItem('movies', JSON.stringify(movies));
    loadMovies();
}

function clearForm() {
    document.getElementById('movieForm').reset();
    document.getElementById('movieId').value = '';
}

function sortMovies() {
    const sortBy = document.getElementById('sortSelect').value;
    let movies = JSON.parse(localStorage.getItem('movies')) || [];
    if (sortBy === 'title') {
        movies.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'year') {
        movies.sort((a, b) => a.year - b.year);
    }
    document.getElementById('movieList').innerHTML = '';
    movies.forEach(movie => addMovieToList(movie));
}

function searchMovie() {
    const searchQuery = document.getElementById('searchInput').value.toLowerCase();
    let movies = JSON.parse(localStorage.getItem('movies')) || [];
    const filteredMovies = movies.filter(movie => movie.title.toLowerCase().includes(searchQuery));
    document.getElementById('movieList').innerHTML = '';
    filteredMovies.forEach(movie => addMovieToList(movie));
}

window.onload = loadMovies;
