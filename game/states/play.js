  'use strict';
  var Bird = require('../prefabs/bird');
  var Ground = require('../prefabs/ground');
  function Play() {}
  Play.prototype = {
    create: function() {
      this.game.physics.startSystem(Phaser.Physics.ARCADE);
      //гравитация
      this.game.physics.arcade.gravity.y = 1200;
      this.background = this.game.add.sprite(0,0,'background');
      // Create a new bird object
      this.bird = new Bird(this.game, 100, this.game.height/2);
      // and add it to the game
      this.game.add.existing(this.bird);

      this.ground = new Ground(this.game, 0, 400, 335, 112);
      this.game.add.existing(this.ground);

      // keep the spacebar from propogating up to the browser
      this.game.input.keyboard.addKeyCapture([Phaser.Keyboard.SPACEBAR]);
      // add keyboard controls
      var flapKey = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
      flapKey.onDown.add(this.bird.flap, this.bird);
      // add mouse/touch controls
      this.input.onDown.add(this.bird.flap, this.bird);
      // add a timer
      this.pipeGenerator = this.game.time.events.loop(Phaser.Timer.SECOND * 1.25, this.generatePipes, this);
      this.pipeGenerator.timer.start();
    },

    update: function() {
      this.game.physics.arcade.collide(this.bird, this.ground);
    },

    generatePipes: function() {  
    console.log('generating pipes!');
  },
};

  module.exports = Play;