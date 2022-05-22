import * as model from './model.js';
import 'regenerator-runtime/runtime';
import { render } from 'sass';
import icons from 'url:../img/icons.svg'; //Parcel 2
import 'core-js/stable';

//console.log(icons);

const recipeContainer = document.querySelector('.recipe');

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////
// add spinner
const renderSpinner = function (parentEl) {
  const markup = `
  <div class="spinner">
          <svg>
            <use href="${icons}#icon-loader"></use>
          </svg>
        </div>`;
  parentEl.innerHTML = '';
  parentEl.insertAdjacentHTML('afterbegin', markup);
};

const showRecipe = async function () {
  try {
    // id of a recipe without #
    const id = window.location.hash.slice(1);
    console.log(id);
    //use guard clause to avoid err if url doesn't have the id
    if (!id) return;
    // 1) LOADING RECIPE
    renderSpinner(recipeContainer);
    const res = await fetch(
      //'https://forkify-api.herokuapp.com/api/v2/recipes/5ed6604591c37cdc054bc990'
      //replace the hard-coded id
      `https://forkify-api.herokuapp.com/api/v2/recipes/${id}`
    );
    // if the fetch function is unsuccessful, then we get a nice message from API which we can use when throwing a new error
    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message} ${res.status}`);
    // do this: import 'regenerator-runtime/runtime'; to avoid errors.
    //console.log(res, data);
    // destructuring data object, that contains some information about recipe
    let { recipe } = data.data;
    recipe = {
      id: recipe.id,
      title: recipe.title,
      publisher: recipe.publisher,
      sourceUrl: recipe.source_url,
      image: recipe.image_url,
      servings: recipe.servings,
      cookingTime: recipe.cooking_time,
      ingredients: recipe.ingredients,
    };
    console.log(recipe);

    // RENDERING RECIPE
    // take the template from index.html and replace some data

    //we will need to loop over the ingredients array. And for each of them, we should then create this kind of markup here. the expression needs to return a string of HTML. so we use map method and join it.
    const markup = `
        <figure class="recipe__fig">
          <img src="${recipe.image}" alt="${
      recipe.title
    }" class="recipe__img" crossorigin/>
          <h1 class="recipe__title">
            <span>${recipe.title}</span>
          </h1>
        </figure>

        <div class="recipe__details">
          <div class="recipe__info">
            <svg class="recipe__info-icon">
              <use href="${icons}#icon-clock"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--minutes">${
              recipe.cookingTime
            }</span>
            <span class="recipe__info-text">minutes</span>
          </div>
          <div class="recipe__info">
            <svg class="recipe__info-icon">
              <use href="${icons}#icon-users"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--people">${
              recipe.servings
            }</span>
            <span class="recipe__info-text">servings</span>

            <div class="recipe__info-buttons">
              <button class="btn--tiny btn--increase-servings">
                <svg>
                  <use href="${icons}#icon-minus-circle"></use>
                </svg>
              </button>
              <button class="btn--tiny btn--increase-servings">
                <svg>
                  <use href="${icons}#icon-plus-circle"></use>
                </svg>
              </button>
            </div>
          </div>

          <div class="recipe__user-generated">
            <svg>
              <use href="${icons}#icon-user"></use>
            </svg>
          </div>
          <button class="btn--round">
            <svg class="">
              <use href="${icons}#icon-bookmark-fill"></use>
            </svg>
          </button>
        </div>

        <div class="recipe__ingredients">
          <h2 class="heading--2">Recipe ingredients</h2>
          <ul class="recipe__ingredient-list">
    
    ${recipe.ingredients
      .map(ing => {
        return `
      <li class="recipe__ingredient">
          <svg class="recipe__icon">
            <use href="${icons}#icon-check"></use>
          </svg>
          <div class="${ing.quantity}">1000</div>
          <div class="recipe__description">
            <span class="${ing.unit}">g</span>
            ${ing.description}
          </div>
      </li>`;
      })
      // transform the array of strings into one big string
      .join('')};
            
           
        <div class="recipe__directions">
          <h2 class="heading--2">How to cook it</h2>
          <p class="recipe__directions-text">
            This recipe was carefully designed and tested by
            <span class="recipe__publisher">${
              recipe.publisher
            }</span>. Please check out
            directions at their website.
          </p>
          <a
            class="btn--small recipe__btn"
            href="${recipe.sourceUrl}"
            target="_blank"
          >
            <span>Directions</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </a>
        </div>`;

    //before we insert any new markup we need to get rid of the markup that is already there
    recipeContainer.innerHTML = '';
    // we need to insert this HTML into our DOM. for that, we can use the insert adjacentHTML method and we need to do that on the parent element. in our case, recipeContainer
    // 'afterbegin' as a first child
    recipeContainer.insertAdjacentHTML('afterbegin', markup);
  } catch (err) {
    alert(err);
    //console.error(err);
  }
};
//showRecipe();

// listen to event, and URL bar keeps changing (ids of 2 different recipes)

// create an array of events, loop over it and listen to the events
['hashchange', 'load'].forEach(ev => window.addEventListener(ev, showRecipe));

//window.addEventListener('hashchange', showRecipe);
//window.addEventListener('load', showRecipe);
