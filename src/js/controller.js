import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

import 'regenerator-runtime/runtime';
import { render } from 'sass';
import 'core-js/stable';
import { async } from 'regenerator-runtime';
import normalizeWindowsPath from 'tar/lib/normalize-windows-path';

//console.log(icons);

// with Parcel we can do this.
if (module.hot) {
  module.hot.accept();
}

const controlRecipes = async function () {
  try {
    // id of a recipe without #
    const id = window.location.hash.slice(1);
    //console.log(id);
    //use guard clause to avoid err if url doesn't have the id
    if (!id) return;
    recipeView.renderSpinner();

    // 0) Update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());

    // 1) Updating bookmarks view
    bookmarksView.update(model.state.bookmarks);

    // 2) LOADING RECIPE
    await model.loadRecipe(id);

    //const { recipe } = model.state;

    // 3) RENDERING RECIPE
    // take the template from index.html and replace some data
    // call recipeView.render. then we pass in the data, which will be model.state.recipe. this render method will now accept this data. It will then store it into the object.
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
    console.error(err);
  }
};

// call loadSearchResults('pizza') function
const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();
    //console.log(resultsView);
    // 1) get search query
    const query = searchView.getQuery();
    if (!query) return;

    // 2) load search results
    await model.loadSearchResults(query);

    // 3) render results
    //console.log(model.state.search.results);
    //resultsView.render(model.state.search.results);
    resultsView.render(model.getSearchResultsPage());

    // 4) Render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

// create controller that will be executed whenever a click on one of the buttons happens.
const controlPagination = function (goToPage) {
  // 1) render NEW results
  resultsView.render(model.getSearchResultsPage(goToPage));
  //console.log(gotToPage);

  // 2) Render NEW pagination buttons
  paginationView.render(model.state.search);
};

// this controller will eventually be executed when the user clicks on one of these buttons to decrease, or to increase the number of servings
const controlServings = function (newServings) {
  // Update the recipe servings (in state)
  model.updateServings(newServings);
  // Update the recipe view
  //recipeView.render(model.state.recipe);
  //update method will only update text and attributes in the DOM. So without having to re-render the entire view
  recipeView.update(model.state.recipe);
};

// controller for bookmarks will be called when we click the bookmark button
const controlAddBookmark = function () {
  //console.log(model.state.recipe.bookmarked);
  // add a bookmark when the recipe is not yet bookmarked
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  // delete a bookmark when the recipe is bookmarked
  else model.deleteBookmark(model.state.recipe.id);
  //console.log(model.state.recipe);

  // Update recipe view
  recipeView.update(model.state.recipe);

  // render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  //console.log(newRecipe);
  try {
    // Show loading spinner
    addRecipeView.renderSpinner();

    // Upload new Recipe data
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    // Render recipe
    recipeView.render(model.state.recipe);

    // Success message
    addRecipeView.renderMessage();

    // render bookmark view
    bookmarksView.render(model.state.bookmarks);

    // change ID in URL
    // history - is the history API of the browsers. then on this history object, we can call the pushState method. And so this will basically allow us to change the URL without reloading the page. pushState takes three arguments: state, title and url
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    // using the history API, we could go back and forth just as if we were clicking the forward and back buttons in the browser.
    //window.history.back();

    // close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error('💥', err);
    addRecipeView.renderError(err.message);
  }
};

//the Publisher-Subscriber pattern
const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
