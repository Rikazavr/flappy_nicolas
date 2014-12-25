  'use strict';
  var Bird = require('../prefabs/bird');
  var Ground = require('../prefabs/ground');
  var PipeGroup = require('../prefabs/pipeGroup');  

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
      this.flapKey.onDown.add(this.bird.flap, this.bird);
       
      // add mouse/touch controls
      this.game.input.onDown.add(this.bird.flap, this.bird);
       
      // keep the spacebar from propogating up to the browser
      this.game.input.keyboard.addKeyCapture([Phaser.Keyboard.SPACEBAR]);
       
      // add a timer
      this.pipeGenerator = this.game.time.events.loop(Phaser.Timer.SECOND * 1.25, this.generatePipes, this);
      this.pipeGenerator.timer.start(); 
    },

    update: function() {
      this.game.physics.arcade.collide(this.bird, this.ground);
    },

    generatePipes: function() {
    var pipeY = this.game.rnd.integerInRange(-100, 100);
    var pipeGroup = this.pipes.getFirstExists(false);
    if(!pipeGroup) {
        pipeGroup = new PipeGroup(this.game, this.pipes);
    }
    pipeGroup.reset(this.game.width, pipeY);
  }

    //  generatePipes: function() { 
    //  debugger; 
    //    var pipeY = this.game.rnd.integerInRange(-100, 100);
    //    var pipeGroup = new PipeGroup(this.game);
    //    pipeGroup.x = this.game.width;
    //    pipeGroup.y = pipeY;
    // }
};

module.exports = Play;