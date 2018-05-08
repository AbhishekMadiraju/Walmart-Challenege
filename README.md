Walmart Challenge

A product search API which takes a list of product ids and returns all ids for products matching a query string in the product description.

Prerequisites

- Install nodeJs
- Web Browser or curl

Project Setup

Run npm install to install all modules from packages.json. Following modules were used:

Axios - Promise based HTTP client for the browser and node.js
Express - Fast, unopinionated, minimalist web framework for node
fs - File System API
is-stopword - To check for stopwords

To start the server, type node index.json on the command line.

Walmart Product API

Used the Walmart Product API with the following url:

http://api.walmartlabs.com/v1/items?ids=&apiKey=kjybrqfdgp3u4yv2qzcnjndj&format=json

This would take upto 20 items in a single call which helps reduce the number of API calls made in case we have a large number of product ids.

Usage

Once the server is running, access the index page using 

http://localhost:3000/

This would return index.html which contains a description of how to use the search API and a search area which would return the results for a given search query.

To make use of the search API, use the following url

http://localhost:3000/search/:item

The item can be any product you are searching for like backpack, mattress, etc. If the item is a stopword (is, a, and, then, etc.) then the client recieves a message to include a proper item name.

API Results

The API response would contain a JSON with the item name and an array of appropriate product ids. The array would be empty if no matching products were found.

If a stop word is used as the item name in the url, then the client would get a JSON response containing a message to enter a proper item name.

In case of a non existing route or an internal server errors, the client recieves a response with status code 500 and a JSON which contains a message with the appropriate error.

Testing

Tested the program with a list of upto 100 product ids.

Tested with non existent routes to get appropriate responses.

Tested with unavailable file to check for appropriate error message.

Known Issues

The Walmart API has a set ratelimit. No issues were experienced with this till now, but it might cause issues if the rate limit is reached.