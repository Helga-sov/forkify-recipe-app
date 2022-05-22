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

// 2. create async function around fetch to use await
// const showRecipe = async function () {
//   try {
//     const res = await fetch('https://forkify-api.herokuapp.com/api/v2/recipes/5ed6604591c37cdc054bc886');
// 1. make an AJAX request to API using fetch()
//fetch(https://forkify-api.herokuapp.com/api/v2/recipes/5ed6604591c37cdc054bc886);
// convert result to json format
// } catch (err) {
//     alert(err);
//   }
// };
//using the fetch function here will return a promise. And so, since we are in an async function, we can then await that promise. So basically we will stop the code execution here at this point, but that's not a problem because this is an async function anyway, which only runs in the background. So we are not blocking our main thread of execution here

// format that data a little bit nicer. So basically I want to create a new object based on this object which has some better variable names.

//
//
//
//
//
/////////////////////////////////////////////////////////////////
//MVC ARCHITECTURE (Model View Controller)
// refactoring code for MVC
// inside src folder, js folder create file model.js that will be the module in which we write our entire model
// create folder views inside js folder. create recipeView.js
//
//
//
//
//
////

/////////////////////////////////////////////////////////////////
// Many real world applications have two special modules that are completely independent of the rest of the architecture. And these are a module for the project configuration and also a module for some general helper functions that are gonna be useful across the entire project.

// create a new file - config.js - where we basically put all the variables that should be constants and should be reused across the project.
// And the goal of having this file with all these variables is that it will allow us to easily configure or project by simply changing some of the data that is here in this configuration file.

// The only variables that we do want here are the ones that are responsible for kind of defining some important data about the application itself.(e.g. API url) this URL here, we will actually reuse in multiple places across this project, for example, for getting search data, and also for uploading a recipe to the server.
//
// create some helper functions inside helper.js.
//And the goal of this file or of this module is to contain a couple of functions that we reuse over and over in our project.

////////////////////////////////////////////////////////////////////the Publisher-Subscriber Design pattern. And by the way, design patterns in programming are basically just standard solutions to certain kinds of problems. So in the publisher-Subscriber pattern we have a publisher which is some code that knows when to react

//

//

//

//

//

//

//

/////////////////////////////////////////////////////////////////
// Nu inteleg de ce in aplicatia MAIB nu se arata ce comisionul a fost retinut ? De ce MAIB prin actiunea sa ma duce in eroare, in timp ce o alta banca prezinta informatia completa, cu indicarea comisionului retinut.
