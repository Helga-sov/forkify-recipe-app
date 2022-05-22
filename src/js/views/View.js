import icons from 'url:../../img/icons.svg';

// export the class itself, not any instance
export default class View {
  _data;

  /**
   * Render the received object to the DOM
   * @param {Object | Object[]} data The data to be rendered (e.g. recipe)
   * @param {boolean} [render=true] If false, create markup string instead of rendering to the DOM
   * @returns {undefined | string} A markup string is returned if render=false
   * @this {Object} View instance
   * @author Olga Sandu
   * @todo finish implementation
   */

  // add public render method
  render(data, render = true) {
    // check if data exists; if there is no data or if there is data, but that data is an array, and it is empty. So in both these cases, we want the error to be shown
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();

    this._data = data;
    //console.log(this._data);
    const markup = this._generateMarkup();

    if (!render) return markup;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  update(data) {
    // if (!data || (Array.isArray(data) && data.length === 0))
    //   return this.renderError();

    this._data = data;
    const newMarkup = this._generateMarkup();

    // this method will then convert the string newMarkup into real DOM Node objects. virtual DOM, that is not really living on the page but which lives in our memory
    const newDOM = document.createRange().createContextualFragment(newMarkup);
    // convert node list to an array
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    const curElements = Array.from(this._parentElement.querySelectorAll('*'));
    //console.log(newElements);
    //console.log(curElements);

    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];
      //console.log(curEl, newEl.isEqualNode(curEl));

      // UPDATES CHANGED TEXT
      //if !newEl.isEqualNode(curEl), so if they are different, then we want to change the text content of the current element to the text content of the new element. this condition makes it so that this code is only executed on elements that contain text directly
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        //console.log('💥💥', newEl.firstChild.nodeValue.trim());
        curEl.textContent = newEl.textContent;
      }
      // UPDATES CHANGED ATTRIBUTES
      //we only want to change the attributes when the new element is different from the old one or the current one
      if (!newEl.isEqualNode(curEl))
        //console.log(Array.from(newEl.attributes));
        //console.log(newEl.attributes);
        // convert newEl.attributes to an array and loop over it
        //replace all the attributes in the current element by the attributes coming from the new element
        Array.from(newEl.attributes).forEach(attr =>
          curEl.setAttribute(attr.name, attr.value)
        );
    });
  }

  _clear() {
    //console.log(this._parentElement);
    this._parentElement.innerHTML = '';
  }

  // add spinner
  renderSpinner = function () {
    const markup = `
      <div class="spinner">
        <svg>
          <use href="${icons}#icon-loader"></use>
        </svg>
      </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  };

  renderError(message = this._errorMessage) {
    const markup = `
    <div class="error">
      <div>
        <svg>
          <use href="${icons}_icon-alert-triangle"></use>
        </svg>
      </div>
      <p>${message}</p>
    </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderMessage(message = this._message) {
    const markup = `
    <div class="message">
      <div>
        <svg>
          <use href="${icons}#icon-smile"></use>
        </svg>
      </div>
      <p>${message}</p>
    </div>
        `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}
