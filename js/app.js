var followersApp = {
    root: document.querySelector('.followers-app'),
    display: {},
    api: {},
    main: {}
};

(function display(app) {
    var searchEl = app.root.querySelector('.search');
    var searchInput = app.root.querySelector('.search__input');
    var searchBtn = app.root.querySelector('.search__btn');

    var searchLoader = app.root.querySelector('.search-loader');

    var searchAlert = app.root.querySelector('.alert--search');
    var searchAlertMessage = searchAlert.querySelector('.alert__message');
    var searchAlertDismiss = searchAlert.querySelector('.alert__dismiss');

    var resultsEl = app.root.querySelector('.results');

    searchInput.addEventListener('onkeypress', trimInput);
    searchAlertDismiss.addEventListener('click', function (e) {
        e.preventDefault();
        dismissSearchAlert();
    });

    function initSearch(callback) {
        searchBtn.addEventListener('click', function (e) {
            e.preventDefault();
            if (!searchInput.value) {
                showSearchError('Please enter a username');
                resultsEl.style.display = 'block';
                fixSearch();
                return;
            }

            callback(searchInput.value);
            onSearchStart();
        });
    }

    function trimInput(e) {
        return e.which !== 32;
    }

    function fixSearch() {
        searchEl.classList.add('search--fixed');
    }

    function onSearchStart() {
        searchLoader.style.display = 'block';
        resultsEl.style.display = 'none';
        fixSearch();
    }

    function showSearchError(message) {
        searchAlert.classList.remove('alert--success');
        searchAlert.classList.add('alert--danger');
        searchAlert.style.display = 'block';
        searchAlertMessage.textContent = message;
    }

    function showSearchSuccess(message) {
        searchAlert.classList.remove('alert--danger');
        searchAlert.classList.add('alert--success');
        searchAlert.style.display = 'block';
        searchAlertMessage.textContent = message;
    }

    function dismissSearchAlert() {
        searchAlert.style.display = 'none';
    }

    app.display.initSearch = initSearch;
    app.display.showSearchError = showSearchError;
    app.display.showSearchSuccess = showSearchSuccess;

})(followersApp);


(function api(app) {

})(followersApp);


(function main(app) {

    app.display.initSearch(function (query) {
        console.log(query);
    });


})(followersApp);