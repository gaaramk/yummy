// Variables
let breakfastArray = [];
let miscellaneousArray = [];
let chickenArray = [];
let dessertArray = [];
let categoriesListArray = [];
let categoriesCardArray = [];

// DOM Elements
let breakfast = document.getElementById("breakfast");
let miscellaneous = document.getElementById("miscellaneous");
let chicken = document.getElementById("chicken");
let dessert = document.getElementById("dessert");
const homeContent = document.getElementById("homeContents");
let categoriesRow = document.getElementById("categoriesRow");
let categoriesList = document.getElementById("categoriesList");
const startPage = document.getElementById("startPage");
const homePage = document.getElementById("homePage");
const categoriesPage = document.getElementById("categoriesPage");
const recipePage = document.getElementById("recipePage");
const searchPage = document.getElementById("searchPage");

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
          <a href="pages/recipe.html?id=${array[i].idMeal}">
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
          }" data-category="${category.strCategory}"
          
            id="${category.strCategory}">
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
        console.log(e.target);
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
          <a href="pages/recipe.html?id=${categoriesCardArray[i].idMeal}">
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
getBreakfast();
getMiscellaneous();
getChicken();
getDessert();
getCategoriesList();

// Get Recipe Details Dynamically
const urlParams = new URLSearchParams(window.location.search);
const recipeId = urlParams.get("id");
if (recipeId) {
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

// search
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

// navbar
const navbar = document.getElementById("navbar");
const navItems = document.querySelectorAll("#navItem");

// Scroll Event
let lastScrollPosition = 0;
window.addEventListener("scroll", () => {
  const currentScrollPosition = window.scrollY;
  if (currentScrollPosition > lastScrollPosition) {
    navbar.style.top = "-100px";
  } else {
    navbar.style.top = "0";
  }
  lastScrollPosition = currentScrollPosition;
});

// Click Event
navItems.forEach((navItem) => {
  navItem.addEventListener("click", () => {
    navItems.forEach((item) => {
      item.classList.remove("active");
    });
    navItem.classList.add("active");
  });
});

navbar.addEventListener("click", (e) => {
  switch (e.target.id) {
    case "homeNav":
      startPage.classList.add("d-none");
      homePage.classList.remove("d-none");
      categoriesPage.classList.add("d-none");
      recipePage.classList.add("d-none");
      searchPage.classList.add("d-none");
      break;
    case "categoriesNav":
      startPage.classList.add("d-none");
      homePage.classList.add("d-none");
      categoriesPage.classList.remove("d-none");
      recipePage.classList.add("d-none");
      searchPage.classList.add("d-none");
      break;
    case "addRecipesNav":
      startPage.classList.add("d-none");
      homePage.classList.add("d-none");
      categoriesPage.classList.add("d-none");
      recipePage.classList.add("d-none");
      searchPage.classList.add("d-none");
      break;

    case "searchNav":
      startPage.classList.add("d-none");
      homePage.classList.add("d-none");
      categoriesPage.classList.add("d-none");
      recipePage.classList.add("d-none");
      searchPage.classList.remove("d-none");
      break;

    case "myRecipesNav":
      startPage.classList.add("d-none");
      homePage.classList.add("d-none");
      categoriesPage.classList.add("d-none");
      recipePage.classList.add("d-none");
      searchPage.classList.add("d-none");
      break;

    case "myFavoritesNav":
      startPage.classList.add("d-none");
      homePage.classList.add("d-none");
      categoriesPage.classList.add("d-none");
      recipePage.classList.add("d-none");
      searchPage.classList.add("d-none");
      break;
    default:
      break;
  }
});

homeContent.addEventListener("click", (e) => {
  switch (e.target.id) {
    case "btnSeeBreak":
      startPage.classList.add("d-none");
      homePage.classList.add("d-none");
      categoriesPage.classList.remove("d-none");
      recipePage.classList.add("d-none");
      searchPage.classList.add("d-none");
      getCategoriesCard("Breakfast");
      setActiveCategory(document.getElementById("Breakfast"));
      navItems.forEach((item) => {
        item.classList.remove("active");
      });
      navItems[1].classList.add("active");
      break;

    case "btnSeeMisc":
      startPage.classList.add("d-none");
      homePage.classList.add("d-none");
      categoriesPage.classList.remove("d-none");
      recipePage.classList.add("d-none");
      searchPage.classList.add("d-none");
      getCategoriesCard("miscellaneous");
      setActiveCategory(document.getElementById("Miscellaneous"));
      navItems.forEach((item) => {
        item.classList.remove("active");
      });
      navItems[1].classList.add("active");
      break;

    case "btnSeeChicken":
      startPage.classList.add("d-none");
      homePage.classList.add("d-none");
      categoriesPage.classList.remove("d-none");
      recipePage.classList.add("d-none");
      searchPage.classList.add("d-none");
      getCategoriesCard("chicken");
      setActiveCategory(document.getElementById("Chicken"));
      navItems.forEach((item) => {
        item.classList.remove("active");
      });
      navItems[1].classList.add("active");
      break;

    case "btnSeeDessert":
      startPage.classList.add("d-none");
      homePage.classList.add("d-none");
      categoriesPage.classList.remove("d-none");
      recipePage.classList.add("d-none");
      searchPage.classList.add("d-none");
      getCategoriesCard("dessert");
      setActiveCategory(document.getElementById("Dessert"));
      navItems.forEach((item) => {
        item.classList.remove("active");
      });
      navItems[1].classList.add("active");
      break;

    case "other":
      startPage.classList.add("d-none");
      homePage.classList.add("d-none");
      categoriesPage.classList.remove("d-none");
      recipePage.classList.add("d-none");
      searchPage.classList.add("d-none");
      getCategoriesCard("other");
      navItems.forEach((item) => {
        item.classList.remove("active");
      });
      navItems[1].classList.add("active");
      break;

    default:
      break;
  }
});
