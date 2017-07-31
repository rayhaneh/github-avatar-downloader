var request = require('request');
var fs      = require('fs');

console.log('Welcome to the GitHub Avatar Downloader!');

var GITHUB_USER = "rayhaneh";
var GITHUB_TOKEN = "50b6098a754070bbc17f0bdc980689b70d3a6e82";




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







getRepoContributors(process.argv[2], process.argv[3], function(error, result) {
  if (!error){
    result.forEach(function (userData){
      var filePath = userData.avatar_url.split("/")[4].split("?")[0] + '.jpg';
      downloadImageByURL(userData.avatar_url,filePath)
    })
  } else {
    console.log(error)
  }
});

