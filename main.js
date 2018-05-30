const {
  getArchEnemy,
  getFile,
  getFileMany,
  getSuperHeroes
} = require('./utils/index');

// blocking code
function blockingEcho(str) {
  const endTime = Date.now() + 3000;
  while (Date.now() < endTime) return str;
}

// unblocking code
function asyncEcho(str, cb) {
  setTimeout(() => {
    cb(null, str);
  }, 3000);
}

function fetchSuperHeroes(cb) {
  // as getSuperHeroes is a anonymous function it only needs (err and heros) as hero is the output of getSuperHeroes
  getSuperHeroes((err, heros) => {
    let capHero = heros.map(hero => hero.toUpperCase());
    cb(null, capHero);
  });
}

function fetchOpponents(cb) {
  let arr = [];
  let count = 0;
  // anonymous function so only takes an (error, hero) as 1 argument in brackets
  // retrieves superhero
  fetchSuperHeroes((error, heros) => {
    // runs all heros through forEach
    heros.forEach((hero, index) =>
      // apply getArchEmemy to each item that comes from fetchSuperHeros
      getArchEnemy(hero, (error, villain) => {
        // count for break
        ++count;
        arr[index] = { hero, villain };
        if (count === heros.length) {
          arr.sort((a, b) => {
            return a.hero.localeCompare(b.hero);
          });
          cb(null, arr);
        }
      })
    );
  });
}

function fetchContentOfFiles(fileNames, cb) {
  let arr = [];
  let count = 0;
  // include index in forEach parameters to use later and keep in position
  fileNames.forEach(function(fileName, index) {
    getFile(fileName, function(error, file) {
      arr[index] = file;
      ++count;
      if (count === fileNames.length) cb(null, arr);
    });
  });
}

function fetchFilesAndLog(array, cb) {
  let arr = [];
  let count = 0;
  // include index in forEach parameters to use later and keep in position
  array.forEach(function(files, index) {
    getFile(files, function(error, file) {
      arr[index] = file;
      // the start position for the below loop with only increase if something that isn't undefined
      // is found is position 0 and then 1 and so on
      for (let i = count; i < arr.length; i++) {
        if (typeof arr[count] !== 'undefined') {
          console.log(arr[count]);
          ++count;
        }

        if (count === array.length) cb(null, 'Complete');
      }
    });
  });
}
//below is the same as lowbar once function
function fetchFileWithSingleCall(fileName, cb) {
  let boo = false;
  getFileMany(fileName, function(error, file) {
    if (boo === false) {
      cb(null, file);
      boo = true;
    }
  });
}

module.exports = {
  blockingEcho,
  asyncEcho,
  fetchSuperHeroes,
  fetchOpponents,
  fetchContentOfFiles,
  fetchFilesAndLog,
  fetchFileWithSingleCall
};
