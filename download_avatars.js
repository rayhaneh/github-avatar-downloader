// Required Modules
var request = require('request');
var fs      = require('fs');
var dotenv  = require('dotenv').config({path: './.env'});

// Initializing
console.log('Welcome to the GitHub Avatar Downloader!');

var GITHUB_USER   = process.env.GITHUB_USER;
var GITHUB_TOKEN  = process.env.GITHUB_TOKEN;

var dir = "./avatars/"

var repoOwner = process.argv[2];
var repoName  = process.argv[3];




// Check if two arguments are given to the program
if (process.argv.length !== 4 ){

  console.log('This program should be executed from the command line, in the following manner:');
  console.log('node download_avatars.js <repoOwner> <repoName>');

// Check if the .env file exists
} else if (!fs.existsSync('./.env')) {

  console.log("The .env file does not exist!")

// Check if the user and access token exist in the .env file
} else if (!GITHUB_TOKEN || !GITHUB_USER) {

  console.log("Either github username or github access code is not defined in the .env file")

// check if the the avatars directory exists if not create it
} else if (!fs.existsSync(dir)) {

  console.log('Directory  ${dir} has been created.')

// Otherwise run the code
} else {

  getRepoContributors(repoOwner, repoName, function(error, result) {
    if (!error) {
      result.forEach(function(userData) {
        var filePath = `${dir}${userData.login}.jpg`;
        downloadImageByURL(userData.avatar_url,filePath);
      })
    } else {
      console.log(error)
    }
  });

}








// A function to get the contributors of a given github repo
function getRepoContributors(repoOwner, repoName, cb) {

  var requestURL = `https://'${GITHUB_USER}:${GITHUB_TOKEN}@api.github.com/repos/${repoOwner}/${repoName}/contributors`;

  var options = {
    url: requestURL,
    headers: {
      'User-Agent': 'GitHub Avatar Downloader - Student Project'
    }
  };

  request(options, function (error, response, body) {
    var info = null;
    // Parse the response to info if the transfer was successful
    if (!error && response.statusCode === 200) {
      info = JSON.parse(body);

    // Check if the error was because the owner or the repo do not exist
    } else if (response.statusCode === 404) {

      error = 'The repo or owner does not exists (Status Code: 400)';

    // Check if the error was because the .env file contains incorrect credentials
    } else  if(reponse.statusCode === 401) {
      error = 'The .env file contains incorrect credentials';

    // For all cases of error
    } else {
      error = error + response.statusCode;
    }
    cb (error,info);
  });

}


// A function to download an image from a given URL
function downloadImageByURL(url, filePath) {
request.get(url)
       .on('error', function (err) {
         throw err;
       })
       .pipe(fs.createWriteStream(filePath))
       .on('finish',function () {
        console.log('Github avatar saved to ' + filePath);
       });

}
// Exporting the downloadImageByURL function for testing
module.exports = downloadImageByURL;










