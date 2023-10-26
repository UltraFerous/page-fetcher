const request = require('request');
const fs = require('fs');

const args = process.argv;
const words = args.slice(2);

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

request(`${words[0]}`, (error, response, body) => {
  if (error) {
    console.log('Error:', error); // Print the error if one occurred
    process.exit(1);
  }

  checkFile(function() {
    writeFile(body, function() {
      writeOutput(body);
    });
  });

  // console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
});

const checkFile = function(callback) {
  fs.writeFile(`${words[1]}.html`, "", { flag: "wx" }, function(err) {
    if (err) {
      rl.question('This file already exists, are you sure you want to proceed? (Type Y) ', (answer) => {
        if (answer.toLowerCase() === 'y') {
          console.log(`Proceeding!`);
          rl.close();
          return callback();
        }
        else {
          process.exit(1);
        }
      });
    }
    else {
      return callback();
    }
  });
};

const writeFile = function(content, callback) {
  fs.writeFile(`./${words[1]}.html`, content, err => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
  });
  return callback();
};

const writeOutput = function(content) {
  console.log("Downloaded and saved", content.length, "bytes to", `./${words[1]}.html.`);
};

