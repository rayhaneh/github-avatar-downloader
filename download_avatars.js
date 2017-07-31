// Required Modules
var request = require('request');
var fs      = require('fs');

// Initializing
var GITHUB_USER   = "rayhaneh";
var GITHUB_TOKEN  = "50b6098a754070bbc17f0bdc980689b70d3a6e82";

console.log('Welcome to the GitHub Avatar Downloader!');


// A function to get the contributors of a given github repo
function getRepoContributors(repoOwner, repoName, cb) {

  var requestURL = 'https://'+ GITHUB_USER + ':' + GITHUB_TOKEN + '@api.github.com/repos/' + repoOwner + '/' + repoName + '/contributors';

  var options = {
    url: requestURL,
    headers: {
      'User-Agent': 'GitHub Avatar Downloader - Student Project'
    }
  };

  request(options, function (error, response, body) {
    var info = null
    if (!error && response.statusCode == 200) {
      info = JSON.parse(body);
    }
    cb (error,info)
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
        console.log('Github avatar saved to ' + filePath)
       });

}
// Exporting the downloadImageByURL function for testing
module.exports = downloadImageByURL;


// Calling the getRepoContributors and making the command line arguments mandatory
if (process.argv.length >= 4 ){

  var repoOwner = process.argv[2];
  var repoName  = process.argv[3];

  getRepoContributors(repoOwner, repoName, function(error, result) {
    // Call downloadImageByURL if getRepoContributors did not pass any errors
    if (!error) {
      result.forEach(function(userData) {
        var filePath = `./avatars/${userData.login}.jpg`;
        downloadImageByURL(userData.avatar_url,filePath);
      })
    // Print out the error if the getRepoContributors function was not sucessful
    } else {
      console.log(`There was an error while getting the contributors of ${repoName} repo: ${error}`)
    }
  })
} else {
  console.log('This program should be executed from the command line, in the following manner:');
  console.log('node download_avatars.js <repoOwner> <repoName>');
}





