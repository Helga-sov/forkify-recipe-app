import { async } from 'regenerator-runtime';
import { API_URL, RES_PER_PAGE, KEY } from './config.js';
//import { getJSON, sendJSON } from './helpers.js';
import { AJAX } from './helpers.js';

// create state object and export it to use it then in the controller
export const state = {
  recipe: {},
  // store new array of objects
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
};

// create an async function which will be responsible for fetching the recipe data from our Forkify API.
// this function here is not going to return anything, it will change our state object which will contain the recipe and into which the controller will then grab and take the recipe out of there.

const createRecipeObject = function (data) {
  // destructuring data object, that contains some information about recipe
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    //So if recipe.key is a falsy value,so if it doesn't exist then nothing happens, destructuring here does nothing.
    // if this is some value, then the second part (object) of the operator is executed and returned.
    ...(recipe.key && { key: recipe.key }),
  };
};

export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}${id}?key=${KEY}`);
    state.recipe = createRecipeObject(data);

    if (state.bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
    console.log(state.recipe);
  } catch (err) {
    // Temporary error handling
    console.error(`${err} 💥💥💥`);
    throw err;
  }
};

// implement search functionality
export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;

    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);
    //console.log(data);

    //array of objects; create a new array which contains the new objects where the property names are different.
    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && { key: rec.key }),
      };
    });
    //  whenever we load some new search results the page will reset to 1;
    state.search.page = 1;
  } catch (err) {
    // throw the error again so that we will be able to use it in the controller.
    console.error(`${err} 💥💥💥`);
    throw err;
  }
};

// in this function we want to reach onto the state and then get the data for the page that is being requested
export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;

  // calculate these numbers dynamically, avoiding hard code
  const start = (page - 1) * RES_PER_PAGE; //0;
  const end = page * RES_PER_PAGE; // 9;
  //we will return a part of the array. for the first page we would like to return from the result 1 to result 10
  return state.search.results.slice(start, end);
};

// this function will reach into the state, and in particular into the recipe ingredients, and then change the quantity in each ingredient.
export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
    // newQt = oldQt * newServings / oldServings // 2 * 8 / 4 = 4
  });
  //we also need to update the servings in the state.
  state.recipe.servings = newServings;
};

// storing the bookmarks in localStorage
const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

// implementing bookmarking
export const addBookmark = function (recipe) {
  // Add bookmark to an array
  state.bookmarks.push(recipe);
  // mark current recipe as bookmark
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  persistBookmarks();
};

// remove a bookmark
export const deleteBookmark = function (id) {
  const index = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(index, 1);

  // mark current recipe as NOT bookmark
  if (id === state.recipe.id) state.recipe.bookmarked = false;

  persistBookmarks();
};

const init = function () {
  const storage = localStorage.getItem('bookmarks');
  // if there is storage, then we want to convert the string 'state.bookmarks' back to an object.
  if (storage) state.bookmarks = JSON.parse(storage);
};
init();
//console.log(state.bookmarks);

const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};
//clearBookmarks();

// create a function that will make request to the API.
export const uploadRecipe = async function (newRecipe) {
  try {
    // 1. take the raw input data and transform it into the same format as the data that we also get out of the API.
    //console.log(Object.entries(newRecipe));
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        //split the string into multiple parts, which will then return an array. then we will loop over that array and trim each of the elements.
        const ingArr = ing[1].split(',').map(el => el.trim());
        // const ingArr = ing[1].replaceAll(' ', '').split(',');
        if (ingArr.length !== 3)
          throw new Error('Wrong format! Please use the correct format :)');

        const [quantity, unit, description] = ingArr;
        return { quantity: quantity ? +quantity : null, unit, description };
      });

    // create the object that is ready to be uploaded
    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };
    //console.log(recipe);

    // create AJAX request
    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    //console.log(data);
    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};
