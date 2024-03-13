// APP de Recherche par plats à l'aide de l'API de themealdb.com ou Free Meal API.

// On va coder une barre de recherhce qui nous permettra de rechercher des plats via leur nom ou leurs composants.

// On veut afficher les résulatats dans une liste sous la rbarre de recherche.

// On va pouvoir liker un plat et que celui-ci soit enregistré en local storage.

// On doit aussi pouvoir afficher les plats favoris après avoir cliqué sur le bouton de favoris (toujours depuis le local storage)

const searchInput = document.querySelector('.searchInput');
const searchBtn = document.querySelector('.searchBtn');
const mealList = document.querySelector('.mealList');

const mealDiv = document.createElement('div');
mealDiv.classList.add('mealDiv')

searchBtn.addEventListener('click', () => {
    const searchedMeal = searchInput.value;
    const url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchedMeal}`;
    axios.get(url)
        .then(response => {

            mealDiv.style.display = 'grid';

            const UserInput = response.data.meals;
            console.log(UserInput);

            UserInput.forEach(meal => {
                // Create elements for meal name and image
                const mealName = document.createElement('h2');
                const mealImg = document.createElement('img');

                // Set content for meal name and image
                mealName.textContent = meal.strMeal;
                mealImg.src = meal.strMealThumb;

                // Append meal name and image to mealList
                mealList.appendChild(mealDiv);
                mealDiv.appendChild(mealName);
                mealDiv.appendChild(mealImg);
            })
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
});
