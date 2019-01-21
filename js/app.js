var followersApp = {
    root: document.querySelector('.followers-app'),
    display: {},
    api: {
        baseUrl: 'https://api.github.com'
    },
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

    var userResultsEl = resultsEl.querySelector('.results__user');
    var userNoneEl = resultsEl.querySelector('.results__user-none');

    var userProfileEl = userResultsEl.querySelector('.profile');
    var userImg = userProfileEl.querySelector('.profile__img');
    var userName = userProfileEl.querySelector('.profile__name');
    var userRepos = userProfileEl.querySelector('.profile__repos');
    var userFollowers = userProfileEl.querySelector('.profile__followers');
    var userGithub = userProfileEl.querySelector('.profile__github-link');


    var ffResultsEl = resultsEl.querySelector('.results__ff');
    var ffNoneEl = resultsEl.querySelector('.results__ff-none');
    var ffLoader = resultsEl.querySelector('.results__ff-loader');
    var ffLoadMore = ffResultsEl.querySelector('.results__ff-more');
    var ffList = ffResultsEl.querySelector('.card__list');

    var fetchUser = function () {
    };

    searchInput.addEventListener('onkeypress', trimInput);
    searchAlertDismiss.addEventListener('click', function (e) {
        e.preventDefault();
        dismissSearchAlert();
    });

    function initSearch(fetchUserCb, fetchFollowersCb) {
        fetchUser = fetchUserCb;

        searchBtn.addEventListener('click', function (e) {
            e.preventDefault();
            fixSearch();

            if (!searchInput.value) {
                showSearchError('Please enter a username');
                resultsEl.style.display = 'block';
                return;
            }

            fetchUserCb(searchInput.value);
            onSearchStart();
        });

        ffLoadMore.addEventListener('click', function (e) {
            e.preventDefault();
            var url = ffLoadMore.getAttribute('data-url');
            fetchFollowersCb(url);
            onLoadMoreStart();
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
        dismissSearchAlert();
    }

    function onSearchEnd(user) {
        searchLoader.style.display = 'none';
        resultsEl.style.display = 'block';
        ffList.innerHTML = '';

        if (!user) {
            userResultsEl.style.display = 'none';
            userNoneEl.style.display = 'block';
            return;
        }

        userNoneEl.style.display = 'none';
        userResultsEl.style.display = 'block';
        populateUser(user);
    }

    function onFollowersLoadStart() {
        ffLoader.style.display = 'block';
        ffResultsEl.style.display = 'none';
        ffNoneEl.style.display = 'none';
    }

    function onFollowersLoadEnd(followers) {
        ffLoader.style.display = 'none';

        if (!followers.length) {
            ffResultsEl.style.display = 'none';
            ffNoneEl.style.display = 'block';
            return;
        }

        ffNoneEl.style.display = 'none';
        ffResultsEl.style.display = 'block';
        populateFollowers(followers);
    }

    function onLoadMoreStart() {
        ffLoadMore.textContent = '...fetching more followers';
        ffLoadMore.setAttribute('disabled', 'disabled');
    }

    function onLoadMoreEnd(followers) {
        ffLoadMore.textContent = 'Load More';
        ffLoadMore.removeAttribute('disabled');

        if (!followers.length) {
            return;
        }
        populateFollowers(followers);
    }

    function populateUser(user) {
        userImg.setAttribute('src', user.avatar_url);
        userName.innerHTML = user.name
            ? (user.name + ' <span class="profile__username">(' + user.login + ')</span>')
            : user.login;
        userRepos.textContent = user.public_repos.toLocaleString() + ' repo(s)';
        userFollowers.textContent = user.followers.toLocaleString() + ' follower(s) / Following ' + user.following.toLocaleString();
        userGithub.setAttribute('href', user.html_url);
    }

    function populateFollowers(followers) {
        followers.forEach(function (follower) {
            var item = document.createElement('li');
            item.classList.add('card__item');

            var profile = document.createElement('div');
            profile.classList.add('profile');

            var avatar = document.createElement('div');
            avatar.classList.add('profile__avatar');
            avatar.innerHTML = '<img class="profile__img" src="' + follower.avatar_url + '" alt="profile image">';

            var info = document.createElement('div');
            info.classList.add('profile__info');

            var name = document.createElement('div');
            name.classList.add('profile__name');
            name.textContent = follower.login;

            var githubLink = document.createElement('a');
            githubLink.classList.add('profile__github-link');
            githubLink.setAttribute('href', follower.html_url);
            githubLink.textContent = 'View on github';

            var profileLink = document.createElement('a');
            profileLink.classList.add('profile__github-link');
            profileLink.textContent = 'View profile';
            profileLink.addEventListener('click', function (e) {
                e.preventDefault();
                fetchUser(follower.login);
                onSearchStart();
            });

            info.appendChild(name);
            info.appendChild(profileLink);
            info.appendChild(githubLink);

            profile.appendChild(avatar);
            profile.appendChild(info);

            item.appendChild(profile);
            ffList.appendChild(item);
        });
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

    function hideLoadMore() {
        ffLoadMore.style.display = 'none';
    }

    function showLoadMore(url) {
        ffLoadMore.setAttribute('data-url', url);
        ffLoadMore.style.display = 'inline-block';
    }

    app.display.initSearch = initSearch;
    app.display.onSearchEnd = onSearchEnd;
    app.display.onFollowersLoadStart = onFollowersLoadStart;
    app.display.onFollowersLoadEnd = onFollowersLoadEnd;
    app.display.onLoadMoreEnd = onLoadMoreEnd;
    app.display.showSearchError = showSearchError;
    app.display.showSearchSuccess = showSearchSuccess;
    app.display.showLoadMore = showLoadMore;
    app.display.hideLoadMore = hideLoadMore;

})(followersApp);


(function api(app) {
    var lastResponse = {};

    function fetchUser(query, onUserFetch) {
        var url = app.api.baseUrl + '/users/' + query;
        fetch(url)
            .then(function (response) {
                lastResponse = response;
                return response.json()
            })
            .then(function (json) {
                if (lastResponse.status === 200) {
                    onUserFetch(null, json);
                    return;
                }
                onUserFetch(json);
            }).catch(function (err) {
            onUserFetch(err);
        });
    }

    function fetchFollowers(url, onFollowersFetch) {
        fetch(url)
            .then(function (response) {
                lastResponse = response;
                return response.json()
            })
            .then(function (json) {
                var links = getLinks(lastResponse.headers.get('link'));
                var nextUrl = links._next;
                console.log(links, nextUrl);
                if (lastResponse.status === 200) {
                    onFollowersFetch(null, json, nextUrl);
                    return;
                }
                onFollowersFetch(json);
            }).catch(function (err) {
            onFollowersFetch(err);
        });
    }

    function getLinks(responseLink) {
        var links = {};
        if (!responseLink) {
            return links;
        }

        responseLink.split(',').forEach(function (linkComp) {
            var url = linkComp.substring(linkComp.indexOf('<') + 1, linkComp.indexOf('>'));
            var rel = linkComp.substring(linkComp.indexOf('rel="') + 5).replace('"', '');
            links['_' + rel] = url;
        });

        return links;
    }

    app.api.fetchUser = fetchUser;
    app.api.fetchFollowers = fetchFollowers;

})(followersApp);


(function main(app) {

    app.display.initSearch(fetchUser, fetchMoreFollowers);

    function fetchUser(query) {
        app.api.fetchUser(query, onUserFetch);
    }

    function fetchMoreFollowers(url) {
        app.api.fetchFollowers(url, onMoreFollowersFetch);
    }

    function onUserFetch(err, user) {
        if (err) {
            app.display.showSearchError(err.message);
            app.display.onSearchEnd();
            return;
        }

        app.display.onSearchEnd(user);
        app.api.fetchFollowers(user.followers_url, onFollowersFetch);
    }

    function onFollowersFetch(err, followers, nextUrl) {
        if (err) {
            app.display.showSearchError(err.message);
            app.display.onFollowersLoadEnd();
            return;
        }

        app.display.onFollowersLoadEnd(followers);

        if (nextUrl) {
            app.display.showLoadMore(nextUrl);
        } else {
            app.display.hideLoadMore(nextUrl);
        }
    }

    function onMoreFollowersFetch(err, followers, nextUrl) {
        if (err) {
            return;
        }

        app.display.onLoadMoreEnd(followers);
        if (nextUrl) {
            app.display.showLoadMore(nextUrl);
        } else {
            app.display.hideLoadMore(nextUrl);
        }
    }

})(followersApp);