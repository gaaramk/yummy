// variables
let breakfastArray = [];
let miscellaneousArray = [];
let chickenArray = [];
let dessertArray = [];
let breakfast = document.getElementById("breakfast");
let miscellaneous = document.getElementById("miscellaneous");
let chicken = document.getElementById("chicken");
let dessert = document.getElementById("dessert");

// breakfast api
async function getBreakfast() {
  let response = await fetch(
    "https://www.themealdb.com/api/json/v1/1/filter.php?c=breakfast"
  );

  let data = await response.json();

  breakfastArray = data.meals;

  displayData(breakfastArray, breakfast);
}

// miscellaneous api
async function getMiscellaneous() {
  let response = await fetch(
    "https://www.themealdb.com/api/json/v1/1/filter.php?c=Miscellaneous"
  );

  let data = await response.json();

  miscellaneousArray = data.meals;

  displayData(miscellaneousArray, miscellaneous);
}

// chicken api
async function getChicken() {
  let response = await fetch(
    "https://www.themealdb.com/api/json/v1/1/filter.php?c=chicken"
  );

  let data = await response.json();

  chickenArray = data.meals;

  displayData(chickenArray, chicken);
}

// dessert api
async function getDessert() {
  let response = await fetch(
    "https://www.themealdb.com/api/json/v1/1/filter.php?c=dessert"
  );

  let data = await response.json();

  dessertArray = data.meals;

  displayData(dessertArray, dessert);
}

// display data
function displayData(Array, row) {
  let cartona = ``;
  for (let i = 0; i < 4; i++) {
    cartona += `
                      <div class="col-md-3">
                        <div class="inner">
                          <img src="${Array[i].strMealThumb}" alt="${Array[i].strMeal}" />
                          <p class="p-1 rounded-3">${Array[i].strMeal}</p>
                        </div>
                      </div>
                `;
  }

  row.innerHTML += cartona;
}

// call functions
getBreakfast();
getMiscellaneous();
getChicken();
getDessert();
