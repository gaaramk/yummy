// Variables
let breakfastArray = [];
let miscellaneousArray = [];
let chickenArray = [];
let dessertArray = [];
let categoriesListArray = [];
let categoriesCardArray = [];
let recipePreparations = [];
let ingredients = [];
let measures = [];

// DOM Elements
let breakfast = document.getElementById("breakfast");
let miscellaneous = document.getElementById("miscellaneous");
let chicken = document.getElementById("chicken");
let dessert = document.getElementById("dessert");
let seeAll = document.getElementById("seeAll");
let categoriesRow = document.getElementById("categoriesRow");
let categoriesList = document.getElementById("categoriesList");
let listPreparation = document.getElementById("listPreparation");
let recipeImg = document.getElementById("recipeImg");
let tableBody = document.getElementById("tableBody");

// Fetch Wrapper Function
async function fetchData(url) {
  try {
    let response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch data:", error);
    return null;
  }
}

// Display Data Function
function displayData(array, row) {
  let cartona = ``;
  for (let i = 0; i < Math.min(array.length, 4); i++) {
    cartona += `
      <div class="col-md-3">
          <a href="recipe.html?id=${array[i].idMeal}">
            <div class="inner">
                <img src="${array[i].strMealThumb}" alt="${array[i].strMeal}" />
                <p class="p-1 rounded-3">${array[i].strMeal}</p>
            </div>
          </a>
      </div>
    `;
  }
  row.innerHTML += cartona;
}

// Fetch and Display Breakfast
async function getBreakfast() {
  let data = await fetchData(
    "https://www.themealdb.com/api/json/v1/1/filter.php?c=breakfast"
  );
  if (data) {
    breakfastArray = data.meals;
    displayData(breakfastArray, breakfast);
  }
}

// Fetch and Display Miscellaneous
async function getMiscellaneous() {
  let data = await fetchData(
    "https://www.themealdb.com/api/json/v1/1/filter.php?c=Miscellaneous"
  );
  if (data) {
    miscellaneousArray = data.meals;
    displayData(miscellaneousArray, miscellaneous);
  }
}

// Fetch and Display Chicken
async function getChicken() {
  let data = await fetchData(
    "https://www.themealdb.com/api/json/v1/1/filter.php?c=chicken"
  );
  if (data) {
    chickenArray = data.meals;
    displayData(chickenArray, chicken);
  }
}

// Fetch and Display Dessert
async function getDessert() {
  let data = await fetchData(
    "https://www.themealdb.com/api/json/v1/1/filter.php?c=dessert"
  );
  if (data) {
    dessertArray = data.meals;
    displayData(dessertArray, dessert);
  }
}

// Fetch and Display Categories List
async function getCategoriesList() {
  let data = await fetchData(
    "https://www.themealdb.com/api/json/v1/1/list.php?c=list"
  );
  if (data) {
    categoriesListArray = data.meals;
    let cartona = ``;
    categoriesListArray.forEach((category, index) => {
      cartona += `
        <li>
          <a href="#" class="categoryItem ${
            index === 0 ? "active" : ""
          }" data-category="${category.strCategory}">
            ${category.strCategory}
          </a>
        </li>
      `;
    });
    categoriesList.innerHTML = cartona;

    // Add Event Listeners for Categories
    categoriesList.addEventListener("click", (e) => {
      if (e.target.classList.contains("categoryItem")) {
        let category = e.target.dataset.category;
        setActiveCategory(e.target); // Set active class
        getCategoriesCard(category);
      }
    });

    // Check URL for a predefined category
    const urlParams = new URLSearchParams(window.location.search);
    const selectedCategory =
      urlParams.get("category") || categoriesListArray[0].strCategory; // Default to first category
    const categoryLink = [...document.querySelectorAll(".categoryItem")].find(
      (item) => item.dataset.category === selectedCategory
    );
    if (categoryLink) {
      setActiveCategory(categoryLink); // Set the active category from the URL
      getCategoriesCard(selectedCategory);
    }
  }
}

// Function to Set Active Class
function setActiveCategory(selectedElement) {
  const items = document.querySelectorAll(".categoryItem");
  items.forEach((item) => item.classList.remove("active")); // Remove active class from all
  selectedElement.classList.add("active"); // Add active class to the selected
}

// Fetch and Display Category Cards
async function getCategoriesCard(category) {
  let data = await fetchData(
    `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`
  );
  if (data) {
    categoriesCardArray = data.meals;
    let cartona = ``;
    for (let i = 0; i < categoriesCardArray.length; i++) {
      cartona += `
        <div class="col-md-3">
          <a href="recipe.html?id=${categoriesCardArray[i].idMeal}">
            <div class="inner">
              <img src="${categoriesCardArray[i].strMealThumb}" alt="${categoriesCardArray[i].strMeal}" />
              <p class="p-1 rounded-3">${categoriesCardArray[i].strMeal}</p>
            </div>
          </a>
        </div>
      `;
    }
    categoriesRow.innerHTML = cartona;
  } else {
    categoriesRow.innerHTML = "<p>No meals found for this category</p>";
  }
}

// Call Functions
getCategoriesCard("beef");

// Fetch and Display Recipe Details
async function getRecipeDetails(id) {
  let data = await fetchData(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
  );
  if (data && data.meals) {
    let recipe = data.meals[0];
    recipePreparations = recipe.strInstructions.split(".");
    ingredients = Array.from(
      { length: 20 },
      (_, i) => recipe[`strIngredient${i + 1}`]
    ).filter(Boolean);
    measures = Array.from(
      { length: 20 },
      (_, i) => recipe[`strMeasure${i + 1}`]
    ).filter(Boolean);

    disPlayTableData();
    displayRecipeData(recipe);
  }
}

// Display Table Data
function disPlayTableData() {
  let cartona = ``;
  for (let i = 0; i < ingredients.length; i++) {
    cartona += `
      <tr id="row-${i}">
        <td>
          <img src="./../../images/start-bg.jpg" alt="" />
          <span class="ingredient-text">${ingredients[i]}</span>
        </td>
        <td class="text-end pe-4">${measures[i]}</td>
        <td class="text-end pe-4">
          <input type="checkbox" name="recipe" class="recipe-check" />
        </td>
      </tr>
    `;
  }
  tableBody.innerHTML = cartona;

  // Add Event Listeners for Checkboxes
  let checkboxes = document.querySelectorAll(".recipe-check");
  checkboxes.forEach((checkbox, index) => {
    checkbox.addEventListener("change", () => toggleStrikeThrough(index));
  });
}

// Toggle Strike Through
function toggleStrikeThrough(index) {
  let row = document.getElementById(`row-${index}`);
  let checkbox = row.querySelector(".recipe-check");
  row.style.textDecoration = checkbox.checked ? "line-through" : "none";
  row.style.color = checkbox.checked ? "gray" : "white";
}

// Display Recipe Data
function displayRecipeData(recipe) {
  let cartona = ``;
  recipePreparations.forEach((preparation) => {
    if (preparation) {
      cartona += `<li>${preparation}</li>`;
    }
  });
  listPreparation.innerHTML = cartona;
  recipeImg.src = recipe.strMealThumb;
  recipeImg.alt = recipe.strMeal;
}

// Initialize Functions
getBreakfast();
getMiscellaneous();
getChicken();
getDessert();
getCategoriesList();

// Get Recipe Details Dynamically
const urlParams = new URLSearchParams(window.location.search);
const recipeId = urlParams.get("id");
if (recipeId) {
  getRecipeDetails(recipeId);
  getCategoriesCard(recipeId);
}

// search Page
const searchInput = document.getElementById("searchInput");
const searchSelect = document.getElementById("searchSelect");
const searchButton = document.getElementById("btnSearch");
const searchResult = document.getElementById("searchResult");

searchButton.addEventListener("click", () => {
  const searchQuery = searchInput.value;
  const searchType = searchSelect.value;

  if (searchType === "name") {
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchQuery}`)
      .then((response) => response.json())
      .then((data) => {
        const meals = data.meals;
        const cartona = meals
          .map(
            (meal) => `
    <div class="col-md-3">
      <a href="recipe.html?id=${meal.idMeal}">
        <div class="inner">
          <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
          <p class="p-1 rounded-3">${meal.strMeal}</p>
        </div>
      </a>
    </div>
  `
          )
          .join("");
        searchResult.innerHTML = cartona;
      })
      .catch((error) => console.error("Error fetching data:", error));
  } else if (searchType === "letter") {
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${searchQuery}`)
      .then((response) => response.json())
      .then((data) => {
        const meals = data.meals;
        const cartona = meals
          .map(
            (meal) => `
    <div class="col-md-3">
      <a href="recipe.html?id=${meal.idMeal}">
        <div class="inner">
          <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
          <p class="p-1 rounded-3">${meal.strMeal}</p>
        </div>
      </a>
    </div>
  `
          )
          .join("");
        searchResult.innerHTML = cartona;
      })
      .catch((error) => console.error("Error fetching data:", error));
  }
});

// search home page
const searchHomeInput = document.getElementById("searchHomeInput");
const searchHomeResult = document.getElementById("searchHomeResult");
const searchHomeResultTitle = document.getElementById("searchHomeResultTitle");

searchHomeInput.addEventListener("input", () => {
  const searchQuery = searchHomeInput.value;
  if (searchQuery !== "") {
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchQuery}`)
      .then((response) => response.json())
      .then((data) => {
        const meals = data.meals;
        const cartona = meals
          .map(
            (meal) => `
    <div class="col-md-3">
      <a href="recipe.html?id=${meal.idMeal}">
        <div class="inner">
          <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
          <p class="p-1 rounded-3">${meal.strMeal}</p>
        </div>
      </a>
    </div>
  `
          )
          .join("");
        searchHomeResult.innerHTML = cartona;
        searchHomeResultTitle.classList.remove("d-none");
        searchHomeResultTitle.innerHTML = `search result for "${searchQuery}"`;
      })
      .catch((error) => console.error("Error fetching data:", error));
  } else {
    searchHomeResult.innerHTML = ``;
    searchHomeResultTitle.classList.add("d-none");
    searchHomeResultTitle.innerHTML = ``;
  }
});
