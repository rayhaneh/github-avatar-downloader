// Required Modules
var request = require('request');
var fs      = require('fs');
var dotenv  = require('dotenv').config({path: '.env'});
var getRepoContributors = require('./getRepoContributors');

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





// Exporting function for testing and using in the recommand.js
module.exports = {
  downloadImageByURL : downloadImageByURL,
}









