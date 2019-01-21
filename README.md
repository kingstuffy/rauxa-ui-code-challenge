# Rauxa-FE-Code-Challenge

* [Summary](#summary)
* [Project Structure](#structure)
* [Requirements](#requirements)
* [Starting The App](#starting-the-app)

## Summary

###GitHub Followers
Create a service that allows for a user to search for a GitHub username. 
On a successful search return, display the user's GitHub handle, follower count, 
and a list of the user's followers (just the avatar is fine). 
Since some users (e.g. mrdoob, holman, etc.) have many thousands of followers, GitHub only returns a portion of the followers with each request. 
Create a "load more" button that, when clicked, fetches the next payload of followers. 
This button should persist until there are no more pages of followers to fetch.


## Project Structure
* The application makes use of the Github User api to get the user details and followers.
* The requests to the Github API are made using `fetch` with a polyfill support for older browsers
* The app is hosted on s3 as a static site

## Requirements
* A modern browser with Javascript support.


## Starting The App
* To run the app, open the file `index.html` in a modern web browser with javascript support
* Demo: [Rauxa-FE-Code-Challenge](http://rauxa-fe.s3-website-us-west-2.amazonaws.com)
