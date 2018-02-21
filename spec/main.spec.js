const {expect} = require('chai');
const sinon = require('sinon');
const {
    blockingEcho,
    asyncEcho,
    fetchSuperHeroes,
    fetchOpponents,
    fetchFilesAndLog,
    fetchContentOfFiles,
    fetchFileWithSingleCall,
    fetchPizzas,
    fetchLocalPizzaShopInfo
} = require('../main');


describe('blockingEcho', function () {
    it('should be a function', function () {
        expect(blockingEcho).to.be.a('function');
    });
    it('should return input', function () {
        this.timeout(5000);
        expect(blockingEcho('woo')).to.equal('woo');
    });
});


describe('asyncEcho', function () {
    it('should be a function', function () {
        expect(asyncEcho).to.be.a('function');
    });
    it('should return input', function (done) {
        this.timeout(5000);
        const str = 'woo';
        const cb = function (err, res) {
            expect(res).to.equal(str);
            done();
        };
        asyncEcho(str, cb);
    });
});


describe('fetchSuperHeroes', function () {
    it('should be a function', function () {
        expect(fetchSuperHeroes).to.be.a('function');
    });
    it('should invoke the callback with no error', function (done) {
        fetchSuperHeroes(function (err) {
            expect(err).to.be.null;
            done();
        });
    });
    it('should invoke the callback with an array of 7 heroes', function (done) {
        fetchSuperHeroes(function (err, heroes) {
            expect(heroes).to.be.an('array');
            expect(heroes.length).to.equal(7);
            done();
        });
    });
    it('should invoke the callback with an array of capitalised heroes', function (done) {
        fetchSuperHeroes(function (err, heroes) {
            expect(heroes[0]).to.equal(heroes[0].toUpperCase());
            done();
        });
    });
});


describe('fetchOpponents', () => {
    it('should be a function', function () {
        expect(fetchOpponents).to.be.a('function');
    });
    it('should return an array', function (done) {
        fetchOpponents(function (err, pairs) {
            expect(pairs).to.be.an('array');
            done();
        });
    }).timeout(4000);
    it('should return array of hero villain objects', function (done) {
        fetchOpponents(function (err, pairs) {
            expect(pairs[0].hasOwnProperty('hero')).to.equal(true);
            expect(pairs[0].hasOwnProperty('villain')).to.equal(true);
            done();
        });
    }).timeout(4000);
    it('should return array of objects sorted alphabetically by hero names', function (done) {
        fetchOpponents(function (err, pairs) {
            expect(pairs).to.eql([
            { hero: 'BATMAN', villain: 'THE JOKER' },
            { hero: 'CAPTAIN AMERICA', villain: 'RED SKULL' },
            { hero: 'SPIDERMAN', villain: 'GREEN GOBLIN' },
            { hero: 'SUPERMAN', villain: 'LEX LUTHOR' },
            { hero: 'THE FLASH', villain: 'ZOOM' },
            { hero: 'THOR', villain: 'LOKI' },
            { hero: 'WOLVERINE', villain: 'SABRETOOTH' }]
          );
            done();
        });
    }).timeout(4000);
});


describe('fetchContentOfFiles', function () {
    it('exists', function () {
        expect(fetchContentOfFiles).to.be.a('function');
    });
    it('should return a response for each file', function (done) {
        let fileNames = [1, 2, 3, 4, 5];
        function cb(err, files) {
            expect(files.length).to.equal(fileNames.length);
            done();
        }
        fetchContentOfFiles(fileNames, cb);
    });
    it('should invoke callback with filenames in order', function (done) {

        let fileNames = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        function cb(err, files) {
            expect(files.length).to.equal(fileNames.length);
            fileNames.forEach(function (name, i) {
                expect(files[i]).to.equal(`File contents of ${name}`);
            });
            done();
        }
        fetchContentOfFiles(fileNames, cb);
    });
});


describe('fetchFilesAndLog', function () {
    it('should be a function', function () {        
        expect(fetchFilesAndLog).to.be.a('function');
    });
    it('should log each file', function (done) {
        let spy = sinon.spy(console,'log');
        const fileNames = [1, 2, 3, 4, 5, 6, 7];
        fetchFilesAndLog(fileNames, function () {
            expect(spy.callCount).to.equal(7);
            fileNames.forEach((fileName) => {
                expect(spy.calledWith(`File contents of ${fileName}`)).to.be.true;
            });
            done();
        });
    }).timeout(6000);
});


describe('fetchFileWithSingleCall', function () {
    it('exists', function () {
        expect(fetchFileWithSingleCall).to.be.a('function');
    });
    it('responds with file name', function () {
        const fileName = 'TOP SECRET';
        function cb(err, file) {
            expect(file).to.equal(`File contents of ${fileName}`);
        }
        fetchFileWithSingleCall(fileName, cb);
    });
    it('The call back should only be called once', function (done) {
        const fileName = 'DO NOT OPEN';
        let counter = 0;
        function cb() {
            counter++;
        }
        fetchFileWithSingleCall(fileName, cb);
        setTimeout(function () {
            expect(counter).to.equal(1);
            done();
        }, 2000);
    }).timeout(3000);
});


describe('fetchPizzas', function () {
    it('exists', function () {
        expect(fetchPizzas).to.be.a('function');
    });
    it('responds with an array of objects', function (done) {
        const pizzaIds = [1, 2, 3, 4];
        function cb(err, pizzas) {
            pizzas.forEach(function (pizza) {
                expect(pizza).to.be.an('object');
            });
            done();
        }
        fetchPizzas(pizzaIds, cb);
    });
    it('responds with an array of the correct pizza objects ', function (done) {
        const pizzaIds = [1, 2, 3, 4];
        function cb(err, pizzas) {
            expect(pizzas[0]).to.eql({ id: 1, name: 'Margarita', ingredients: ['cheese', 'tomato'] });
            done();
        }
        fetchPizzas(pizzaIds, cb);
    });
});


describe('fetchLocalPizzaShopInfo', function () {
    it('exists', function () {
        expect(fetchLocalPizzaShopInfo).to.be.a('function');
    });
    it('should return an array of objects', function (done) {
        function cb(err, pizzaShops) {
            pizzaShops.forEach(function (shop) {
                expect(shop).to.be.an('object');
            });
            done();
        }
        fetchLocalPizzaShopInfo(cb);
    }).timeout(7000);
    it('Should filter out those shops which don\'t deliver', function (done) {
        function cb(err, pizzaShops) {
            expect(pizzaShops.length).to.equal(4);
            done();
        }
        fetchLocalPizzaShopInfo(cb);
    }).timeout(7000);
    it('should respond with the correct list of shops', function (done) {
        const pizzaShops = [
            { id: 1, name: 'Anat\'s Amazing Pizza', deliver: true },
            { id: 3, name: 'Mitch\'s Marvelous Pizza', deliver: true },
            { id: 4, name: 'Haz\'s Hungry Pizza', deliver: true },
            { id: 5, name: 'Sam\'s Special Pizza', deliver: true }
        ];

        function cb(err, pizzaShops) {
            expect(pizzaShops[0].pizzas).to.eql([
                {
                  "id": 1,
                  "name": "Margarita",
                  "ingredients": [
                    "cheese",
                    "tomato"
                  ]
                },
                {
                  "id": 2,
                  "name": "Meat Feast",
                  "ingredients": [
                    "cheese",
                    "tomato",
                    "Ham",
                    "Bacon",
                    "Beef"
                  ]
                },
                {
                  "id": 4,
                  "name": "Hawaian",
                  "ingredients": [
                    "cheese",
                    "tomato",
                    "Ham",
                    "Pineapple"
                  ]
                }
              ]);
            done();
        }
        fetchLocalPizzaShopInfo(cb);
    }).timeout(7000);
});
