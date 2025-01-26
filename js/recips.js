document.addEventListener("DOMContentLoaded", function () {
  let tbody = document.getElementById("tbody");
  let listPreparation = document.getElementById("listPreparation");
  let recipeHero = document.getElementById("recipeHero");
  let recipeImg = document.getElementById("recipeImg");

  let bar = document.getElementById("navbar");

  let recipePreparations = [];
  let ingredients = [];
  let measures = [];

  const urlParams = new URLSearchParams(window.location.search);
  const recipeId = urlParams.get("id");
  if (recipeId) {
    getRecipeDetails(recipeId);
  }

  async function getRecipeDetails(id) {
    try {
      let data = await fetch(
        `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
      );
      data = await data.json();
      console.log(data);

      if (data.meals && data.meals.length > 0) {
        let recipe = data.meals[0];

        for (let i = 1; i <= 20; i++) {
          let ingredient = recipe[`strIngredient${i}`];
          let measure = recipe[`strMeasure${i}`];
          if (ingredient && ingredient.trim() !== "") {
            ingredients.push(ingredient);
            measures.push(measure || "");
          }
        }

        // إعداد الخطوات
        recipePreparations = recipe.strInstructions
          ? recipe.strInstructions.split(".").map((step) => step.trim())
          : [];

        disPlayTableData();
        displayRecipeData(recipe);
        displayRicipeHero(recipe);
      } else {
        console.error("No meals found!");
      }
    } catch (error) {
      console.error("Error fetching recipe details:", error);
    }
  }

  function disPlayTableData() {
    let cartona = ``;
    for (let i = 0; i < ingredients.length; i++) {
      cartona += `
          <tr id="row-${i}">
            <td>${i + 1}</td>
            <td>${ingredients[i]}</td>
            <td>${measures[i]}</td>
            <td><input type="checkbox" class="recipe-check" onclick="toggleStrikeThrough(${i})"></td>
          </tr>
        `;
    }
    tbody.innerHTML = cartona;
  } 

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

  function displayRicipeHero(recipe) {
    let cartona = `
        <div class="container w-100 h-100 text-center d-flex flex-column justify-content-center align-items-center">
          <h1>${recipe.strMeal}</h1>
          <p class="w-50 pb-5 pt-3">
            lorem ipsum dolor sit amet consectetur adipisicing elit. Natus
            reiciendis quidem molestias aliquam? Sint, repellat. Sint, repellat. 
            Sint, repellat.lorem ipsum dolor sit amet consectetur adipisicing elit. Natus 
          </p>
          <div>
            <button class="btnAddToRecipes">add to recipes</button>
          </div>
        </div>
      `;
    recipeHero.innerHTML = cartona;
  }

  // Scroll Event
  let lastScrollPosition = 0;
  bar.style.color = "#000";
  window.addEventListener("scroll", () => {
    const currentScrollPosition = window.scrollY;
    if (currentScrollPosition > lastScrollPosition) {
      bar.style.top = "-100px";
    } else {
      bar.style.top = "0";
    }
    lastScrollPosition = currentScrollPosition;

    if (window.scrollY < 600) {
      bar.style.color = "#000";
    } else {
      bar.style.color = "#fff";
    }
  });
});
