const searchInput = document.querySelector('.searchInput');
const searchBtn = document.querySelector('.searchBtn');
const mealList = document.querySelector('.mealList');
const favBtn = document.querySelector('.favorites')

let favorites = []

// On écoute le bouton de recherche
searchBtn.addEventListener('click', () => {
    // On recup la valeur de l'input
    const searchedMeal = searchInput.value;
    const url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchedMeal}`;
    // On vide la liste des plats à chaque recherche
    mealList.innerHTML = ""

    // on fait notre requete pour recup les plats selon la recherche
    axios.get(url)
        .then(response => {
            // On recup nos resultats
            const meals = response.data.meals;

            // On boucle au niveau des repas
            meals.forEach(meal => {
                const type = "Add to"
                displayMeal(meal, type)
            })
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
});

// On écoute le bouton de favoris
favBtn.addEventListener('click', () => {
    // Récupérer nos Ids de repas depuis le local storage
    favorites = JSON.parse(localStorage.getItem('favorites'))
    showFavorites(favorites)
})

// Fonction pour afficher un plat (donc h2, image et le bouton)
function displayMeal(meal, type) {
    // On crée le html pour un plat
    const html = `
        <div class="mealDiv">
            <h2>${meal.strMeal}</h2>
            <img src=${meal.strMealThumb}>
            <button id=${meal.idMeal}>${type} favorites</button>
        </div>
    `
    // On met à jour le contenu html de notre liste de plats
    mealList.innerHTML += html;
    
    // Ajouter au tableau de favoris mes favs et enregistrer en local storage
    mealList.addEventListener('click', (e) => {
        if (e.target.id === meal.idMeal) {
            if (type === "Add to") {
                favorites.push(meal.idMeal)
                localStorage.setItem('favorites', JSON.stringify(favorites)) 
            } else if (type === "Delete from") {
                const index = favorites.indexOf(meal.idMeal)
                favorites.splice(index, 1)
                localStorage.setItem('favorites', JSON.stringify(favorites)) 
                showFavorites(favorites)
            }
        }
    })
}

// Fonction pour afficher les favoris 
function showFavorites(favorites) {
    mealList.innerHTML = ""

    // Pour chaque elemets de mon tableau favoris j'affiche les infos 
    favorites.forEach(favorite => {
        axios.get(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${favorite}`)
        .then(res => {
            const type = "Delete from"
            displayMeal(res.data.meals[0], type)
        })
        .catch(err => console.log(err))
    })
}