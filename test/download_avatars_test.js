var chai = require('chai');
var chaiFiles = require('chai-files');

chai.use(chaiFiles);

var expect = chai.expect
var file = chaiFiles.file
var dir = chaiFiles.dir

var downloadImageByURL = require("../download_avatars")

describe("Download image files test", function() {
  it("downloadImageByURL(avatar_url,filePath) should save that avatar in the given path", function() {
    var avatar_url = "https://avatars2.githubusercontent.com/u/2741?v=3&s=466"
    var filePath   = "avatars/kvirani.jpg"
    downloadImageByURL(avatar_url,filePath)
    expect(file(filePath)).to.exist;
  });
})
