(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

//global variables
window.onload = function () {
  var game = new Phaser.Game(288, 505, Phaser.AUTO, 'flappy-bird-reborn');

  // Game States
  game.state.add('boot', require('./states/boot'));
  game.state.add('gameover', require('./states/gameover'));
  game.state.add('menu', require('./states/menu'));
  game.state.add('play', require('./states/play'));
  game.state.add('playFinal', require('./states/playFinal'));
  game.state.add('preload', require('./states/preload'));
  

  game.state.start('boot');
};
},{"./states/boot":7,"./states/gameover":8,"./states/menu":9,"./states/play":10,"./states/playFinal":11,"./states/preload":12}],2:[function(require,module,exports){
'use strict';

var Bird = function(game, x, y, frame) {
  Phaser.Sprite.call(this, game, x, y, 'bird');
  this.anchor.setTo(0.5, 0.5);
  this.animations.add('flap');
  this.animations.play('flap', 12, true);

  this.game.physics.arcade.enableBody(this);
  this.body.allowGravity = false; 

  this.alive = false;

  this.flapSound = this.game.add.audio('flap');
};

Bird.prototype = Object.create(Phaser.Sprite.prototype);
Bird.prototype.constructor = Bird;

Bird.prototype.update = function() {
	if(this.angle < 90 && this.alive) {
    this.angle += 2.5;
  } 
};

Bird.prototype.flap = function() { 
  this.flapSound.play();
	this.body.velocity.y = -400; 
	this.game.add.tween(this).to({angle: -40}, 100).start();
};

module.exports = Bird;

},{}],3:[function(require,module,exports){
'use strict';

var Ground = function (game, x, y, width, height){
  Phaser.TileSprite.call(this, game, x, y, width, height,'ground');
  this.autoScroll(-200,0);

  this.game.physics.arcade.enableBody(this);
  this.body.allowGravity = false;
  this.body.immovable = true;
};

Ground.prototype = Object.create(Phaser.TileSprite.prototype);
Ground.prototype.constructor = Ground;

Ground.prototype.update = function() {
};

module.exports = Ground;

},{}],4:[function(require,module,exports){
'use strict';

var Pipe = function(game, x, y, frame) {
  Phaser.Sprite.call(this, game, x, y, 'pipe', frame);
  this.anchor.setTo(0.5, 0.5);
  this.game.physics.arcade.enableBody(this);

  this.body.allowGravity = false;
  this.body.immovable = true; 
  
};

Pipe.prototype = Object.create(Phaser.Sprite.prototype);
Pipe.prototype.constructor = Pipe;

Pipe.prototype.update = function() { 
};

module.exports = Pipe;

},{}],5:[function(require,module,exports){
'use strict';

var Pipe = require('./pipe');

var PipeGroup = function(game, parent) {

  Phaser.Group.call(this, game, parent);

  this.topPipe = new Pipe(this.game, 0, 0, 2);
  this.bottomPipe = new Pipe(this.game, 0, 440, 1);
  this.add(this.topPipe);
  this.add(this.bottomPipe);
  this.hasScored = false;

  this.setAll('body.velocity.x', -200);
};

PipeGroup.prototype = Object.create(Phaser.Group.prototype);
PipeGroup.prototype.constructor = PipeGroup;

 PipeGroup.prototype.update = function() { 
 	this.checkWorldBounds(); 
 };

PipeGroup.prototype.checkWorldBounds = function() {  
  if(!this.topPipe.inWorld) {
    this.exists = false;
  }
};

PipeGroup.prototype.reset = function(x, y) {
this.topPipe.reset(25,-50);
this.bottomPipe.reset(25,440);
this.x = x;
this.y = y;
this.setAll('body.velocity.x', -200);
this.hasScored = false;
this.exists = true;
}; 

module.exports = PipeGroup;

},{"./pipe":4}],6:[function(require,module,exports){
'use strict';
var Scoreboard = function(game) {
		var gameover;

		Phaser.Group.call(this, game);
		gameover = this.create(this.game.width / 2, 100, 'gameover');
		gameover.anchor.setTo(0.5, 0.5);
		this.scoreboard = this.create(this.game.width / 2, 200, 'scoreboard');
		this.scoreboard.anchor.setTo(0.5, 0.5);
		this.scoreText = this.game.add.bitmapText(this.scoreboard.width, 180, 'flappyfont', '', 18);
		this.add(this.scoreText);
		this.bestText = this.game.add.bitmapText(this.scoreboard.width, 230, 'flappyfont', '', 18);
		this.add(this.bestText);
		// add our start button with a callback
		this.startButton = this.game.add.button(this.game.width/2, 300, 'startButton', this.startClick, this);
		this.startButton.anchor.setTo(0.5,0.5);
		this.add(this.startButton);
		this.y = this.game.height;
		this.x = 0;
	};

	Scoreboard.prototype = Object.create(Phaser.Group.prototype);
	Scoreboard.prototype.constructor = Scoreboard;

	Scoreboard.prototype.show = function(score) {
		var coin, bestScore;
		this.scoreText.setText(score.toString());
		if(!!localStorage) {
		bestScore = localStorage.getItem('bestScore');
		if(!bestScore || bestScore < score) {
		bestScore = score;
		localStorage.setItem('bestScore', bestScore);
		}
		} else {
		bestScore = 'N/A';
		}
		this.bestText.setText(bestScore.toString());
		if(score >= 5 && score < 10)
		{
		coin = this.game.add.sprite(-65 , 7, 'medals', 1);
		} else if(score >= 10) {
		coin = this.game.add.sprite(-65 , 7, 'medals', 0);
		}
		this.game.add.tween(this).to({y: 0}, 1000, Phaser.Easing.Bounce.Out, true);
		if (coin) {
		coin.anchor.setTo(0.5, 0.5);
		this.scoreboard.addChild(coin);
		// Emitters have a center point and a width/height, which extends from their center point to the left/right and up/down
		var emitter = this.game.add.emitter(coin.x, coin.y, 400);
		this.scoreboard.addChild(emitter);
		emitter.width = coin.width*1.5;
		emitter.height = coin.height*1.5;
		// This emitter will have a width of 800px, so a particle can emit from anywhere in the range emitter.x += emitter.width / 2
		// emitter.width = 800;
		emitter.makeParticles('particle');
		// emitter.minParticleSpeed.set(0, 300);
		// emitter.maxParticleSpeed.set(0, 600);
		emitter.setRotation(-100, 100);
		emitter.setXSpeed(0,0);
		emitter.setYSpeed(0,0);
		emitter.minParticleScale = 0.5;
		emitter.maxParticleScale = 0.75;
		emitter.setAll('body.allowGravity', false);
		emitter.start(false, 1500, 1000);
		}
	};

Scoreboard.prototype.startClick = function() {
this.game.state.start('play');
};

Scoreboard.prototype.update = function() {
// write your prefab's specific update code here
};
module.exports = Scoreboard;
},{}],7:[function(require,module,exports){

'use strict';

function Boot() {
}

Boot.prototype = {
  preload: function() {
    this.load.image('preloader', 'assets/preloader.gif');
  },
  create: function() {
    this.game.input.maxPointers = 1;
    this.game.state.start('preload');
  }
};

module.exports = Boot;

},{}],8:[function(require,module,exports){

'use strict';
function GameOver() {}

GameOver.prototype = {
  preload: function () {

  },
  create: function () {
    var style = { font: '45px Arial', fill: '#ffffff', align: 'center'};
    this.titleText = this.game.add.text(this.game.world.centerX,100, 'Game Over!', style);
    this.titleText.anchor.setTo(0.5, 0.5);

    this.congratsText = this.game.add.text(this.game.world.centerX, 200, 'You Win!', { font: '32px Arial', fill: '#ffffff', align: 'center'});
    this.congratsText.anchor.setTo(0.5, 0.5);

    this.instructionText = this.game.add.text(this.game.world.centerX, 300, 'Click To Play Again', { font: '16px Arial', fill: '#ffffff', align: 'center'});
    this.instructionText.anchor.setTo(0.5, 0.5);
  },
  update: function () {
    if(this.game.input.activePointer.justPressed()) {
      this.game.state.start('play');
    }
  }
};
module.exports = GameOver;

},{}],9:[function(require,module,exports){
 'use strict';
function Menu() {}
Menu.prototype = {
preload: function() {
 
},
create: function() {
// add the background sprite
this.background = this.game.add.sprite(0,0,'background');
// add the ground sprite as a tile
// and start scrolling in the negative x direction
this.ground = this.game.add.tileSprite(0,400, 335,112,'ground');
this.ground.autoScroll(-200,0);
 
/** STEP 1 **/
// create a group to put the title assets in
// so they can be manipulated as a whole
this.titleGroup = this.game.add.group()
/** STEP 2 **/
// create the title sprite
// and add it to the group
this.title = this.add.sprite(0,0,'title');
this.titleGroup.add(this.title);
/** STEP 3 **/
// create the bird sprite
// and add it to the title group
this.bird = this.add.sprite(200,5,'bird');
this.titleGroup.add(this.bird);
/** STEP 4 **/
// add an animation to the bird
// and begin the animation
this.bird.animations.add('flap');
this.bird.animations.play('flap', 12, true);
/** STEP 5 **/
// Set the originating location of the group
this.titleGroup.x = 30;
this.titleGroup.y = 100;
 
/** STEP 6 **/
// create an oscillating animation tween for the group
this.game.add.tween(this.titleGroup).to({y:115}, 350, Phaser.Easing.Linear.NONE, true, 0, 1000, true);
 
// add our start button with a callback
this.startButton = this.game.add.button(this.game.width/2, 300, 'startButton', this.startClick, this);
this.startButton.anchor.setTo(0.5,0.5);
},
startClick: function() {
// start button click handler
// start the 'play' state
this.game.state.start('play');
}
};
module.exports = Menu; 
},{}],10:[function(require,module,exports){
  'use strict';
  var Bird = require('../prefabs/bird');
  var Ground = require('../prefabs/ground');
  var Pipe = require('../prefabs/pipe');
  var PipeGroup = require('../prefabs/pipeGroup');
  var Scoreboard = require('../prefabs/scoreboard');  

  function Play() {}
  Play.prototype = {
    create: function() {
      // start the phaser arcade physics engine
      this.game.physics.startSystem(Phaser.Physics.ARCADE);
        
      // give our world an initial gravity of 1200
      this.game.physics.arcade.gravity.y = 1200;
       
      // add the background sprite
      this.background = this.game.add.sprite(0,0,'background');
       
      // create and add a new Bird object
      this.bird = new Bird(this.game, 100, this.game.height/2);
      this.game.add.existing(this.bird);

      // create and add a group to hold our pipeGroup prefabs
      this.pipes = this.game.add.group();
       
      // create and add a new Ground object
      this.ground = new Ground(this.game, 0, 400, 335, 112);
      this.game.add.existing(this.ground);
       
      // add keyboard controls
      this.flapKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
      this.flapKey.onDown.addOnce(this.startGame, this);
      this.flapKey.onDown.add(this.bird.flap, this.bird);


      // add mouse/touch controls
      this.game.input.onDown.addOnce(this.startGame, this);
      this.game.input.onDown.add(this.bird.flap, this.bird);


      // keep the spacebar from propogating up to the browser     
      this.game.input.keyboard.addKeyCapture([Phaser.Keyboard.SPACEBAR]);
       
      this.instructionGroup = this.game.add.group();
      this.instructionGroup.add(this.game.add.sprite(this.game.width/2, 100,'getReady'));
      this.instructionGroup.add(this.game.add.sprite(this.game.width/2, 325,'instructions'));
      this.instructionGroup.setAll('anchor.x', 0.5);
      this.instructionGroup.setAll('anchor.y', 0.5);

      this.score = 0;
      this.scoreText = this.game.add.bitmapText(this.game.width/2, 10, 'flappyfont',this.score.toString(), 24);
      this.scoreText.visible = true;
      this.scoreSound = this.game.add.audio('score');

      this.pipeHitSound = this.game.add.audio('pipeHit');
      this.groundHitSound = this.game.add.audio('groundHit');
    },

    update: function() {
      this.game.physics.arcade.collide(this.bird, this.ground, this.deathHandler, null, this);

      this.pipes.forEach(function(pipeGroup) {
       this.checkScore(pipeGroup);
       this.game.physics.arcade.collide(this.bird, pipeGroup, this.deathHandler, null, this);
      }, this);
    },

    shutdown: function() {
    this.game.input.keyboard.removeKey(Phaser.Keyboard.SPACEBAR);
    this.bird.destroy();
    this.pipes.destroy();
    this.scoreboard.destroy();
    },

    startGame: function() {  
        this.bird.body.allowGravity = true;
        this.bird.alive = true;

        // add a timer
        this.pipeGenerator = this.game.time.events.loop(Phaser.Timer.SECOND * 1.25, this.generatePipes, this);
        this.pipeGenerator.timer.start();

        this.instructionGroup.destroy();
    },

    checkScore: function(pipeGroup) {  
      if(pipeGroup.exists && !pipeGroup.hasScored && pipeGroup.topPipe.world.x <= this.bird.world.x) {
        pipeGroup.hasScored = true;
        this.score++;
        this.scoreText.setText(this.score.toString());
        this.scoreSound.play();
      }
    },

  deathHandler: function() {
    // this.game.state.start('gameover');

    this.bird.alive = false;
    this.pipes.callAll('stop');
    this.pipeGenerator.timer.stop();
    this.ground.stopScroll();

    this.scoreboard = new Scoreboard(this.game);
    this.game.add.existing(this.scoreboard);
    this.scoreboard.show(this.score);
  },

  generatePipes: function() {
    var pipeY = this.game.rnd.integerInRange(-100, 100);
    var pipeGroup = this.pipes.getFirstExists(false);
    if(!pipeGroup) {
        pipeGroup = new PipeGroup(this.game, this.pipes);  
    }
    pipeGroup.reset(this.game.width, pipeY);
  }
};

module.exports = Play;
},{"../prefabs/bird":2,"../prefabs/ground":3,"../prefabs/pipe":4,"../prefabs/pipeGroup":5,"../prefabs/scoreboard":6}],11:[function(require,module,exports){

'use strict';
var Bird = require('../prefabs/bird');
var Ground = require('../prefabs/ground');
var Pipe = require('../prefabs/pipe');
var PipeGroup = require('../prefabs/pipeGroup');
var Scoreboard = require('../prefabs/scoreboard');

function Play() {
}
Play.prototype = {
  create: function() {
    // start the phaser arcade physics engine
    this.game.physics.startSystem(Phaser.Physics.ARCADE);


    // give our world an initial gravity of 1200
    this.game.physics.arcade.gravity.y = 1200;

    // add the background sprite
    this.background = this.game.add.sprite(0,0,'background');

    // create and add a group to hold our pipeGroup prefabs
    this.pipes = this.game.add.group();
    
    // create and add a new Bird object
    this.bird = new Bird(this.game, 100, this.game.height/2);
    this.game.add.existing(this.bird);
    
    

    // create and add a new Ground object
    this.ground = new Ground(this.game, 0, 400, 335, 112);
    this.game.add.existing(this.ground);
    

    // add keyboard controls
    this.flapKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    this.flapKey.onDown.addOnce(this.startGame, this);
    this.flapKey.onDown.add(this.bird.flap, this.bird);
    

    // add mouse/touch controls
    this.game.input.onDown.addOnce(this.startGame, this);
    this.game.input.onDown.add(this.bird.flap, this.bird);
    

    // keep the spacebar from propogating up to the browser
    this.game.input.keyboard.addKeyCapture([Phaser.Keyboard.SPACEBAR]);

    

    this.score = 0;
    this.scoreText = this.game.add.bitmapText(this.game.width/2, 10, 'flappyfont',this.score.toString(), 24);

    this.instructionGroup = this.game.add.group();
    this.instructionGroup.add(this.game.add.sprite(this.game.width/2, 100,'getReady'));
    this.instructionGroup.add(this.game.add.sprite(this.game.width/2, 325,'instructions'));
    this.instructionGroup.setAll('anchor.x', 0.5);
    this.instructionGroup.setAll('anchor.y', 0.5);

    this.pipeGenerator = null;

    this.gameover = false;

    this.pipeHitSound = this.game.add.audio('pipeHit');
    this.groundHitSound = this.game.add.audio('groundHit');
    this.scoreSound = this.game.add.audio('score');
    
  },
  update: function() {
    this.game.physics.arcade.collide(this.bird, this.ground, this.deathHandler, null, this);

    if(!this.gameover) {    
        this.pipes.forEach(function(pipeGroup) {
            this.checkScore(pipeGroup);
            this.game.physics.arcade.collide(this.bird, pipeGroup, this.deathHandler, null, this);
        }, this);
    }
    
  },
  shutdown: function() {
    this.game.input.keyboard.removeKey(Phaser.Keyboard.SPACEBAR);
    this.bird.destroy();
    this.pipes.destroy();
    this.scoreboard.destroy();
  },
  startGame: function() {
    if(!this.bird.alive && !this.gameover) {
        this.bird.body.allowGravity = true;
        this.bird.alive = true;
        // add a timer
        this.pipeGenerator = this.game.time.events.loop(Phaser.Timer.SECOND * 1.25, this.generatePipes, this);
        this.pipeGenerator.timer.start();

        this.instructionGroup.destroy();
    }
  },
  checkScore: function(pipeGroup) {
    if(pipeGroup.exists && !pipeGroup.hasScored && pipeGroup.topPipe.world.x <= this.bird.world.x) {
        pipeGroup.hasScored = true;
        this.score++;
        this.scoreText.setText(this.score.toString());
        this.scoreSound.play();
    }
  },
  deathHandler: function(bird, enemy) {
    if(enemy instanceof Ground && !this.bird.onGround) {
        this.groundHitSound.play();
        this.scoreboard = new Scoreboard(this.game);
        this.game.add.existing(this.scoreboard);
        this.scoreboard.show(this.score);
        this.bird.onGround = true;
    } else if (enemy instanceof Pipe){
        this.pipeHitSound.play();
    }

    if(!this.gameover) {
        this.gameover = true;
        this.bird.kill();
        this.pipes.callAll('stop');
        this.pipeGenerator.timer.stop();
        this.ground.stopScroll();
    }
    
  },
  generatePipes: function() {
    var pipeY = this.game.rnd.integerInRange(-100, 100);
    var pipeGroup = this.pipes.getFirstExists(false);
    if(!pipeGroup) {
        pipeGroup = new PipeGroup(this.game, this.pipes);  
    }
    pipeGroup.reset(this.game.width, pipeY);
    

  }
};

module.exports = Play;

},{"../prefabs/bird":2,"../prefabs/ground":3,"../prefabs/pipe":4,"../prefabs/pipeGroup":5,"../prefabs/scoreboard":6}],12:[function(require,module,exports){
'use strict';
  function Preload() {
    this.asset = null;
    this.ready = false;
  }

  Preload.prototype = {
    preload: function() {
    this.asset = this.add.sprite(this.width/2, this.height/2, 'preloader');
    this.asset.anchor.setTo(0.5, 0.5);

    this.load.bitmapFont('flappyfont', 'assets/fonts/flappyfont/flappyfont.png', 'assets/fonts/flappyfont/flappyfont.fnt');

    this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
    this.load.setPreloadSprite(this.asset);
    this.load.image('background', 'assets/back.png');
    this.load.image('ground', 'assets/ground.png');
    this.load.image('title', 'assets/title.png');
    this.load.image('startButton', 'assets/start-button.png');

    this.load.spritesheet('bird', 'assets/nicolas.png', 70, 51, 3);
    this.load.spritesheet('pipe', 'assets/pipes.png', 54,320, 2);

    this.load.image('instructions', 'assets/instructions.png');  
    this.load.image('getReady', 'assets/get-ready.png');

    this.load.audio('score', 'assets/score.wav');
    this.load.audio('flap', 'assets/flap.wav');
    this.load.audio('pipeHit', 'assets/pipe-hit.wav');
    this.load.audio('groundHit', 'assets/ground-hit.wav');

    this.load.image('scoreboard', 'assets/scoreboard.png');
    this.load.image('gameover', 'assets/gameover.png');
    this.load.spritesheet('medals', 'assets/medals.png', 44, 46, 2);
    this.load.image('particle', 'assets/particle.png');
    },
    
    create: function() {
      this.asset.cropEnabled = false;
    },
    update: function() {
      debugger
      if(!!this.ready) {
        this.game.state.start('play');
      }
    },
    onLoadComplete: function() {
      this.ready = true;
    }
  };

module.exports = Preload  
},{}]},{},[1])