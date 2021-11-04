var express = require('express');
var router = express.Router();
var fg = require("fast-glob")
var fs = require('fs');
var path = require('path');
var matter = require('gray-matter');
var readTime = require('reading-time');

/* GET articles. */
router.get('/', function (req, res, next) {
  const files = fg.sync(["*.md", "*.mdx"], { cwd: "../articles" });
  const filesData = files.map(file => {
    // return req.protocol + '://' + req.get('host') + req.originalUrl + file
    // return file;
    console.log(path.join(__dirname, '../../articles/' + file))
    const fileContents = fs.readFileSync(path.join(__dirname, '../../articles/', file), "utf8");
    const matterResult = matter(fileContents);

    console.log(matterResult);
    const data = matterResult.data;
    return {
      id: file.replace('.mdx', '').replace('.md', ''),
      title: data.title,
      file: file,
      url: req.protocol + '://' + req.get('host') + req.originalUrl + file,
      publisedAt: data.publisedAt,
      updatedAt: data.updatedAt,
      tags: data.tags,
      readingTime: readTime(matterResult.content),
      description: data.description,
      author: data.author,
      image: data.image,
      // content: matterResult.content,
    }
  });
  res.send(filesData);
});

module.exports = router;
