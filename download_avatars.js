// Required Modules
var request = require('request');
var fs      = require('fs');
var dotenv  = require('dotenv').config({path: './.env'});

// Initializing
console.log('Welcome to the GitHub Avatar Downloader!');


// Check if the .env file exists
if (fs.existsSync('./.env')) {

  var GITHUB_USER   = process.env.GITHUB_USER;
  var GITHUB_TOKEN  = process.env.GITHUB_TOKEN;

  // Calling the getRepoContributors and making the command line arguments mandatory
  if (process.argv.length === 4 ){

    var repoOwner = process.argv[2];
    var repoName  = process.argv[3];

    getRepoContributors(repoOwner, repoName, function(error, result) {
      // Call downloadImageByURL if getRepoContributors did not pass any errors
      if (!error) {
        result.forEach(function(userData) {
          var dir = "./avatars/";
          // Check if the directory exists, if not make the directory
          if (fs.existsSync(dir)) {
            var filePath = `${dir}${userData.login}.jpg`;
            downloadImageByURL(userData.avatar_url,filePath);
          } else {
            fs.mkdirSync(dir);
          }
        })
      // Print out the error if the getRepoContributors function was not sucessful
      } else {
        console.log(`There was an error while getting the contributors of the ${repoName} repo: ${error}`)
      }
    })
  } else {
    console.log('This program should be executed from the command line, in the following manner:');
    console.log('node download_avatars.js <repoOwner> <repoName>');
  }
} else {
  console.log("The .env file does not exist!")
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
    if (!error && response.statusCode == 200) {
      info = JSON.parse(body);
    // Add status code to the error if there is an error or the staus code is not 200
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








