const express = require('express'),
    app = express(),
    axios = require('axios'),
    fs = require('fs'),
    stopword = require('is-stopword');

//Set path to serve static HTML content
app.use(express.static(__dirname + '/views'));
app.use(express.static(__dirname + '/public'));

//Function to check if search query is a stopword;
function checkStopword(word) {
    return stopword.isStopword(word);
}

//Function to read .csv file
function read(fileName) {
    return new Promise ((resolve, reject) => {
        fs.readFile(fileName, 'utf8', (err, data) => {
            err ? reject("File not found on server"):resolve(data);
        });
    })
}

//Parse file data and make request to Walmart API to get item data
function getProductDetails(itemIds, items) {
    return new Promise((resolve, reject) => {
        let dataArray = itemIds.split(",\n");
        let lastElement = dataArray[dataArray.length - 1];

        //remove comma from last element if it exists
        if(lastElement.charAt(lastElement.length - 1) === ',') {
            dataArray[dataArray.length - 1] = lastElement.slice(0, -1);
        }

        let url;
        let i = 0, j = 0;
        let len = dataArray.length;
        while(i < len) {
            url = "http://api.walmartlabs.com/v1/items?ids=" + dataArray.slice(i, i + 20).toString() + "&apiKey=kjybrqfdgp3u4yv2qzcnjndj&format=json";
            i += 20;
            axios.get(url)
            .then(response => {
                j++;
                items.push(...response.data.items);
                if(j === Math.ceil(len/20)) {
                    resolve(items);
                }
            })
            .catch("Problem with Walmart API");
        }
    })
}

//Get item ids for products related to search query
function getSearchResults(items) {
    return new Promise((resolve, reject) => {
        let ids = [];
        for(let i = 0; i < items.length; i++) {
            if(items[i].shortDescription.replace(/\W/g," ").toLowerCase().split(" ").indexOf(searchItem) != -1 || 
            items[i].longDescription.replace(/\W/g," ").toLowerCase().split(" ").indexOf(searchItem) != -1) {
                ids.push(items[i].itemId); 
            }
        }
        resolve(ids);
    })
}

app.get("/", (req, res) => {
    res.sendFile("index.html");
});

app.get("/search/:item", (req, res) => {
    searchItem = req.params.item;
    if(checkStopword(searchItem)) {
        res.send({message: "Please enter a valid item"});
    } else {
    /*Read file, 
    get list of JSONs for each of the ids in the file, 
    check if search item is in file,
    return array of search results
    */ 
        read('data_file.csv')
        .then(fileContent => getProductDetails(fileContent, []))
        .then(productDetailsList => getSearchResults(productDetailsList))
        .then(searchResults => res.status(200).send({item: searchItem, result: searchResults})) 
        .catch(err => {
            res.status(500).send({message: err})
        });
    }
});

app.get("*", (req, res) => {
    res.status(404).send({message: "Please enter the right url"});
});

app.listen(3000, "localhost", () => {
    console.log("Server running....");
});