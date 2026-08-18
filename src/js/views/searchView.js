class SearchView {
  _parentEl = document.querySelector('.search');

  getQuery() {
    const query = this._parentEl.querySelector('.search_field').value;
    this._clearInput();
    return query;
  }

  _clearInput() {
    const inputField = this._parentEl.querySelector('.search_field');

    inputField.value = '';
    
    inputField.blur();
  }

  addHandlerSearch(handler) {
    this._parentEl.addEventListener('submit', function (e) {
      e.preventDefault();
      handler();
    });
  }
}

export default new SearchView();
