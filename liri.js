// # liri-node-app
// 2. Make a .gitignore file and add the following lines to it. This will tell git not to track these files, and thus they 
// won't be committed to Github.

// ```
// node_modules
// .DS_Store
// ```

// 3. Make a JavaScript file named `keys.js`. **Do Not** add this file to the .gitignore. This would be a good thing to do 
// in the real world, but it makes grading this assignment a challenge.

// Inside keys.js your file will look like this:

// ```JavaScript
// console.log('this is loaded');

// var twitterKeys = {
//   consumer_key: '<input here>',
//   consumer_secret: '<input here>',
//   access_token_key: '<input here>',
//   access_token_secret: '<input here>',
// }

// module.exports = twitterKeys;
// ```

// 4. Get your Twitter API keys by following these steps:

//    * Step One: Visit <https://apps.twitter.com/app/new>
   
//    * Step Two: Fill out the form with dummy data. Type `http://google.com` in the Website input. Don't fill out the 
// Callback URL input. Then submit the form.
   
//    * Step Three: On the next screen, click the Keys and Access Tokens tab to get your consume key and secret. 
     
//      * Copy and paste them where the `<input here>` tags are inside your keys.js file.
   
//    * Step Four: At the bottom of the page, click the `Create my access token` button to get your access token 
// key and secret. 
     
//      * Copy the access token key and secret displayed at the bottom of the next screen. Paste them where the 
// `<input here>` tags are inside your keys.js file.

// 5. Make a file called `random.txt`.

//    * Inside of `random.txt` put the following in with no extra characters or white space:
     
//      * spotify-this-song,"I Want it That Way"

// 6. Make a JavaScript file named `liri.js`.

// 7. At the top of the `liri.js` file, write the code you need to grab the data from keys.js. Then store the keys in a variable.

// 8. Make it so liri.js can take in one of the following commands:
var inquirer = require("inquirer");
inquirer.prompt([
  {
    type: "list",
    name: "option",
    message: "Choose one of the following options.",
    choices: ["my-tweets", "spotify-this-song", "movie-this", "do-what-it-says"]
  }
]).then(function(user) {

  switch(user.option){
    case "my-tweets":
      my_tweets();
      break;
    case "spotify-this-song":
      spotify_this_song();
      break;
    case "movie-this":
      movie_this();
      break;
    case "do-what-it-says":
      do_what_it_says();
      break;
  }
});

function my_tweets(){
  inquirer.prompt([
  {
    type: "confirm",
    name: "confirm",
    message: "Are you sure you want to read my tweets?",
    default: true
  }
  ]).then(function(tweet) {
    if(tweet){
      var Twitter = require('twitter');
 
      var client = new Twitter({
        consumer_key: client.consumer_key,
        consumer_secret: client.consumer_secret,
        access_token_key: client.access_token_key,
        access_token_secret: client.access_token_secret
      });
       
      var params = {screen_name: 'nodejs'};
      client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (!error) {
          print(tweets[19]);
        }
      });
    }
  });
};

function spotify_this_song(){
  inquirer.prompt([
  {
    type: "input",
    name: "name",
    message: "What is the name of the song."
  }
  ]).then(function(music) {
    var Spotify = require('node-spotify-api');

    var spotify = new Spotify({
      id: '4670ff7786ec4809a6a9dc14093332f7',
      secret: '6bf380396c0d4815ba30a6b2cef8fd22'
    });
    getMusic(music.name)

    function getMusic(_music_name){
      if (_music_name === '') {
        _music_name = 'The Sign';//**************************************
      }
      spotify.search({ type: 'track', query: _music_name }, function(err, data) {
        if (err) {
          return console.log('Error occurred: ' + err);
        }
            //Artist(s)
            print("Artist: "+data.tracks.items[0].artists[0].name);
            //The song's name
            print("Song: "+data.tracks.items[0].name);
            //A preview link of the song from Spotify
            print("Spotify link: "+data.tracks.items[0].preview_url);
            //The album that the song is from
            print("Album: "+data.tracks.items[0].album.name);
            //If no song is provided then your program will default to "The Sign" by Ace of Base.
      });
    }
  });
};

function movie_this(){
  inquirer.prompt([
    {
      type: "input",
      name: "name",
      message: "What is the name of the movie?"
    }
  ]).then(function(movie) {
        var request = require("request");

        movie.name = movie.name.replace(/\s+/g, '+');
        getMovie(movie.name);

        function getMovie(_movie_name){
        //Request https of the chosen movie
        request("http://www.omdbapi.com/?t="+_movie_name+"&y=&plot=short&apikey=40e9cece", function(error, response, body) {
        // If the request is successful (i.e. if the response status code is 200)
        if (!error && response.statusCode === 200) {
          //This condition checks if the movie is undefined or no user input is found.
          if (JSON.parse(body).Title === undefined) {
            getMovie("Mr.+Nobody");
          }
          else{
            // Title of the movie.
            print("Movie: " + JSON.parse(body).Title);
            //Year the movie came out.
            print("Released: " + JSON.parse(body).Released);
            //IMDB Rating of the movie.
            print("IMDB Rating: " + JSON.parse(body).imdbRating);
            //Rotten Tomatoes Rating of the movie.
            var rating = checkForRating(JSON.parse(body).Ratings);
            print("Rotten Tomatoes Rating: " + rating);
            //Country where the movie was produced.
            print("Country: " + JSON.parse(body).Country);
            //Language of the movie.
            print("Language: " + JSON.parse(body).Language);
            //Plot of the movie.
            print("Plot: " + JSON.parse(body).Plot);
            //Actors in the movie.
            print("Actors: " + JSON.parse(body).Actors);
          }
          function checkForRating(ratings){
            //Loop through array Ratings searching SourceKey value of "Rotten Tomatoes"...
                for (var i = 0; i < ratings.length; i++) {
                  //If SourceKey is found...
                  if(ratings[i].Source === 'Rotten Tomatoes'){
                    //It will then get the value of the ValueKey and return to the caller.
                    var checked = ratings[i].Value;
                    return checked;
                  }
                }
          }
        }

      });
    }
  });
};

function do_what_it_says(){

  //    * Using the `fs` Node package, LIRI will take the text inside of random.txt and then use it to call one of 
  // LIRI's commands.
  var fs = require("fs");

  // Running the readFile module that's inside of fs.
  // Stores the read information into the variable "data"
  fs.readFile("random.txt", "utf8", function(err, data) {
    var array = [];
    if (err) {
      return console.log(err);
    }

    // Break the string down by comma separation and store the contents into the output array.
    var output_random = data.split(",");
    var liri_chose = output_random[Math.floor(Math.random()*output_random.length)];

    if(liri_chose === 'my-tweets'){
      print("Liri said: 'Read my tweets.'");
      my_tweets();
    }
    else if(liri_chose === 'spotify-this-song'){
      fs.readFile("spotify.txt", "utf8", function(err, data) {
        if (err) {
          return console.log(err);
        }
        var output_spotify = data.split(",");
        var music = output_spotify[Math.floor(Math.random()*output_spotify.length)];
        print("Liri said: 'Listen to "+ music +"'");
        getMusic(music); 
      });
    }
    else if(liri_chose === 'movie-this'){
      fs.readFile("movie.txt", "utf8", function(err, data) {
        if (err) {
          return console.log(err);
        }
        var output_movie = data.split(",");
        var movie = output_movie[Math.floor(Math.random()*output_movie.length)];
        print("Liri said: 'Watch "+ movie +"'");
        getMovie(movie);
      });
    }
  });
};

function print(object){
  console.log(object);
}
// for (var i = 0; i < data.tracks.items.length; i++) {
      // arr.push(data.tracks.items[0].artists[0].name); 
//     }
//     //Remove duplicate artists
//     let array = Array.from(new Set(arr));

// inquirer.prompt([
//   {
//     type: "list",
//     name: "option",
//     message: "I have found "+array.length+" different artists. Choose one.",
//     choices: [array]
//   }

// ]).then(function(_artist) {
//   print(_artist);
// });


//    * This will show your last 20 tweets and when they were created at in your terminal/bash window.

// * In addition to logging the data to your terminal/bash window, output the data to a .txt file called `log.txt`.

// * Make sure you append each command you run to the `log.txt` file. 

// * Do not overwrite your file each time you run a command.