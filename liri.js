//Node package for reading and writing files
var fs = require("fs");
//Node package Inquirer
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
      inquirer.prompt([
        {
          type: "confirm",
          name: "confirm",
          message: "Are you sure you want to read my tweets?",
          default: true
        }
      ]).then(function(tweet) {
        my_tweets(tweet.confirm);
      });
      break;
    case "spotify-this-song":
      inquirer.prompt([
        {
          type: "input",
          name: "name",
          message: "What is the name of the song."
        }
      ]).then(function(music) {
        spotify_this_song(music.name);
      });
      break;
    case "movie-this":
      inquirer.prompt([
        {
          type: "input",
          name: "name",
          message: "What is the name of the movie?"
        }
      ]).then(function(movie) {
        movie_this(movie.name);
      });
      break;
    case "do-what-it-says":
      do_what_it_says();
      break;
  }
});
//My Tweets Function
function my_tweets(_tweet){
  if(_tweet === true){
    log("my-tweets");
    var Twitter = require('twitter');

    var client = new Twitter({
      consumer_key: 'dfEHiweUzQicG0KxX91tiyYkE',
      consumer_secret: 'Om7T011lg0tV4K3KyrxY5swr68r9YwiqDraU42J2nFu9XzkhhH',
      access_token_key: '282661299-TSJY7PXcieereA7TfwgNuE8D5Ya4aMk7hsCbDbym',
      access_token_secret: 'UczFz6AGxHvqEdZWMp4n65EyCOrSF5PD1iAtTsj0J6B4u'
    });
     
    var params = {screen_name: 'tarciso loiola sousa'};
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
      if (!error) {
        for (var i = 0; i < tweets.length; i++) {
          print(i+1 +"=> "+ tweets[i].text);
        }
      }
    });
  }
};
//Spotify Function
function spotify_this_song(_music){
  
  var Spotify = require('node-spotify-api');

  var spotify = new Spotify({
    id: '4670ff7786ec4809a6a9dc14093332f7',
    secret: '6bf380396c0d4815ba30a6b2cef8fd22'
  });
  if (_music === '') {
    _music = 'The Sign';//**************************************
  }
  //Append music to the log.text
  log(_music);
  //Spotify to search for selected music
  spotify.search({ type: 'track', query: _music }, function(err, data) {
    //Throw an error if no music is found
    if (err) {
      return console.log('Error occurred: ' + err);
    }
    //Print all the required info about music
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
};
//Movie Function
function movie_this(_movie){
  
  var request = require("request");
  //Replace " " empty space in a string and change it for "+" to match search parameters
  _movie = _movie.replace(/\s+/g, '+');
  //Request https of the chosen movie
  request("http://www.omdbapi.com/?t="+_movie+"&y=&plot=short&apikey=40e9cece", function(error, response, body) {
    // If the request is successful (i.e. if the response status code is 200)
    if (!error && response.statusCode === 200) {
      //This condition checks if the movie is undefined or no user input is found.
      if (JSON.parse(body).Title === undefined) {
        movie_this("Mr.+Nobody");
      }
      else{
        ///Append movie to the log.text
        log(JSON.parse(body).Title);
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
      //Looping in a array of ratings looking for RottenTomatoes
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
};
//Do what liri says function
function do_what_it_says(){
  //Append do-what-it-says user option to the log.text
  log("do-what-it-says");
  //Using the `fs` Node package, LIRI will take the text inside of random.txt and then use it to call one of LIRI's commands.
  var fs = require("fs");

  // Running the readFile module that's inside of fs.
  // Stores the read information into the variable "data"
  fs.readFile("random.txt", "utf8", function(err, data) {
    var array = [];
    if (err) {
      return console.log(err);
    }

    // Break the string down by comma separation and store the contents into the output_random array.
    var output_random = data.split(",");
    //Randomly pick one function/option to run from output_random file
    var liri_chose = output_random[Math.floor(Math.random()*output_random.length)];
    //Condition to run function
    if(liri_chose === 'my-tweets'){
      print("Liri said: 'Read my tweets.'");
      my_tweets();
    }
    //Condition to run funcion
    else if(liri_chose === 'spotify-this-song'){
      //Read from a music file field with pre selected songs
      fs.readFile("spotify.txt", "utf8", function(err, data) {
        //Throw error if not meet condition
        if (err) {
          return console.log(err);
        }
        // Break the string down by comma separation and store the contents into the output_spotify array.
        var output_spotify = data.split(",");
        //Randomly pick one song to play from output_spotify file 
        var music = output_spotify[Math.floor(Math.random()*output_spotify.length)];
        print("Liri said: 'Listen to "+ music +"'");
        //Call function to play song chosen randomly
        spotify_this_song(music); 
      });
    }
    //Condition to run function
    else if(liri_chose === 'movie-this'){
      //Read from a movie file field with pre selected movies
      fs.readFile("movie.txt", "utf8", function(err, data) {
        //Throw error if not meet condition
        if (err) {
          return console.log(err);
        }
        // Break the string down by comma separation and store the contents into the output_movie array.
        var output_movie = data.split(",");
        //Randomly pick one movie to play from output_movie file 
        var movie = output_movie[Math.floor(Math.random()*output_movie.length)];
        print("Liri said: 'Watch "+ movie +"'");
        //Call function to play movie chosen randomly
        movie_this(movie);
      });
    }
  });
};
//Log.text 
function log(value) {
  // We will add the value to the log file.
  fs.appendFile("log.txt", ", " + value, function(err) {
    if (err) {
      return console.log(err);
    }
  });
}
//This is just a function that is used to console.log() objects, just to make it easier
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
