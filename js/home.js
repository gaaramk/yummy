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
const homePage = document.getElementById("homePage");
const categoriesPage = document.getElementById("categoriesPage");
const recipePage = document.getElementById("recipePage");
const searchPage = document.getElementById("searchPage");
const navbar = document.getElementById("navbar");
const navItems = document.querySelectorAll("#navItem");
const menuIcon = document.getElementById("menuIcon");
const navigation = document.getElementById("navigation");
const searchHomeInput = document.getElementById("searchHomeInput");
const searchHomeResult = document.getElementById("searchHomeResult");
const searchHomeResultTitle = document.getElementById("searchHomeResultTitle");
const searchInput = document.getElementById("searchInput");
const searchSelect = document.getElementById("searchType");
const searchButton = document.getElementById("btnSearchPage");
const searchResult = document.getElementById("searchResultPage");
const links = document.querySelectorAll(".nav-link");
const activeLink = document.querySelector(".active");
const homeNav = document.getElementById("homeNav");
const searchNav = document.getElementById("searchNav");
const categoryNav = document.getElementById("categoriesNav");

// Fetch Wrapper Function
async function fetchData(url) {
  try {
    let response = await fetch(url);
    loading.classList.remove("d-none");

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch data:", error);
    return null;
  } finally {
    loading.classList.add("d-none");
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

// Get Recipe Details Dynamically
const urlParams = new URLSearchParams(window.location.search);
const recipeId = urlParams.get("id");
if (recipeId) {
  getCategoriesCard(recipeId);
}

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

// active nav
navItems.forEach((navItem) => {
  navItem.addEventListener("click", () => {
    navItems.forEach((item) => {
      item.classList.remove("active");
    });
    navItem.classList.add("active");
  });
});

// search
searchButton.addEventListener("click", () => {
  const searchQuery = searchInput.value.trim();
  const searchType = searchSelect.value;

  if (searchQuery === "") {
    searchResult.innerHTML = `
      <div class="col-md-12">
        <div class="inner">
          <img src="images/404.png" alt="Empty" />       
        </div>
      </div>
    `;
    return;
  } // تأكد من وجود إدخال

  fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?${
      searchType === "name" ? "s" : "f"
    }=${searchQuery}`
  )
    .then((response) => response.json())
    .then((data) => {
      const meals = data.meals || [];
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
      searchPage.classList.add("active"); // عرض الصفحة مع تفعيل النتائج
    })
    .catch((error) => console.error("Error fetching data:", error));
});

// categories
categoryNav.addEventListener("click", () => {
  homePage.classList.add("d-none");
  categoriesPage.classList.remove("d-none");
  searchPage.classList.add("d-none");
});

// home
homeNav.addEventListener("click", () => {
  homePage.classList.remove("d-none");
  categoriesPage.classList.add("d-none");
  searchPage.classList.add("d-none");
});

// search
searchNav.addEventListener("click", () => {
  homePage.classList.add("d-none");
  categoriesPage.classList.add("d-none");
  searchPage.classList.remove("d-none");
});

// add active class to the active link

links.forEach((link) => {
  link.addEventListener("click", () => {
    links.forEach((otherLink) => {
      otherLink.classList.remove("active");
    });
    link.classList.add("active");
  });
});

// menu icon
menuIcon.addEventListener("click", () => {
  navigation.classList.toggle("d-flex");
});

// see all
function seeAll(category, activeCategory) {
  categoriesPage.classList.remove("d-none");
  homePage.classList.add("d-none");
  searchPage.classList.add("d-none");
  getCategoriesCard(category);
  setActiveCategory(activeCategory);

  categoriesNav.classList.add("active");
  homeNav.classList.remove("active");
}

// Call Functions
getCategoriesCard("beef");
getBreakfast();
getMiscellaneous();
getChicken();
getDessert();
getCategoriesList();

const loading = document.getElementById("loading");
