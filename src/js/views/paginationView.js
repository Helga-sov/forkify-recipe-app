import View from './View';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerClick(handler) {
    // using event delegation because we have 2 buttons; adding event listener to the common parent
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      //console.log(btn);
      // check if a button was clicked
      if (!btn) return;

      // convert the value we get from the UI into a number
      const gotToPage = +btn.dataset.goto;
      //console.log(gotToPage);
      handler(gotToPage);
    });
  }

  _generateMarkup() {
    // compute how many pages we have
    const curPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    //console.log(numPages);

    // Page 1, and there are other pages
    if (curPage === 1 && numPages > 1) {
      // create data attribute on each of the buttons, which will contain the page that we want to go to. then in our code, we can read that data and make our application go to that exact page
      return `
        <button data-goto="${
          curPage + 1
        }" class="btn--inline pagination__btn--next">
          <span>Page ${curPage + 1}</span>
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>     
          </svg>
        </button>`;
    }

    // Last page (current page is the same as number of pages)
    if (curPage === numPages && numPages > 1) {
      return `
        <button data-goto="${
          curPage - 1
        }" class="btn--inline pagination__btn--prev">
          <svg class="search__icon">
          <use href="${icons}#icon-arrow-left"></use>
          </svg>
          <span>Page ${curPage - 1}</span>
        </button>`;
    }
    // Other page (current page is less than number of pages.)
    if (curPage < numPages) {
      return `
        <button data-goto="${
          curPage - 1
        }" class="btn--inline pagination__btn--prev">
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-left"></use>
          </svg>
          <span>Page ${curPage - 1}</span>
        </button>
        <button data-goto="${
          curPage + 1
        }" class="btn--inline pagination__btn--next">
          <span>Page ${curPage + 1}</span>
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>     
          </svg>
        </button>`;
    }
    // Page 1, and there are NO other pages
    return;
  }
}

export default new PaginationView();
