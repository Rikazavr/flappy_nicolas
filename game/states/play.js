  'use strict';
  var Bird = require('../prefabs/bird');

  function Play() {}
  Play.prototype = {
    create: function() {
      this.game.physics.startSystem(Phaser.Physics.ARCADE);
      //гравитация
      this.game.physics.arcade.gravity.y = 500;
      this.background = this.game.add.sprite(0,0,'background');
      // Create a new bird object
      this.bird = new Bird(this.game, 100, this.game.height/2);
      // and add it to the game
      this.game.add.existing(this.bird);
      //бэкгр
      this.ground = this.game.add.tileSprite(0,400, 335,112);
      this.game.add.existing(this.ground);
    },
    update: function() {
    },
  };

  module.exports = Play;