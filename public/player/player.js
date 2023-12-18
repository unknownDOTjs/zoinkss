var coords = [];



function addPlayer(self, playerInfo) {

  self.player = self.physics.add.sprite(playerInfo.x, playerInfo.y, 'player_image');
  self.player.setScale(1, 1);
  self.player.respawn = 0;
  self.player.respawnTime = 5000;
  self.player.isAlreadyDead = false;
  self.player.addedVelocty = 0;

  self.player.groundCheck = self.physics.add.sprite(self.player.x, self.player.y + 15, "")
  self.player.groundCheck.setScale(1.5, 1.2);
  self.player.groundCheck.alpha = 0;

  //shooting objects-----
  self.player.bullets = self.add.group({maxSize: 10});
  self.player.cursor = self.physics.add.sprite(self.player.x, self.player.y, "aim_image");
  self.player.cursor.setScale(0.6, 0.6);
  self.player.cursor.depth = 1000;

  self.player.gun = self.physics.add.sprite(self.player.x + self.player.width/2, self.player.y, "gun");
  self.player.gun.setScale(1, 1);
  self.player.gun.gunType = "pistol";
  self.player.gun.reloadTime = 1500;
  self.player.gun.alreadySetReloadTime = false;

  self.player.border = self.physics.add.sprite(config.width/2, config.height/2, "border");
  self.player.border.alpha = 0.3
  self.player.border.setScale(34, 16.7);
  self.player.border.setScrollFactor(0, 0);
  self.player.border.setImmovable();

  self.player.username = self.add.text(self.player.x, self.player.y - 40, username, { font: '3vh Arial', fill: '#FFF000'});
  self.player.usernameString = username;
  self.player.username.depth = 80;

  self.player.amountOfKills = 0;
  self.player.kills = self.add.text(20 + self.cameras.main.scrollX, 20 + self.cameras.main.scrollY, "kills: " + self.player.amountOfKills, { font: '600 3vh Arial', fill: '#FF0000'});
  self.player.kills.setScrollFactor(0, 0);
  self.player.kills.depth = 20;
  self.player.killSound = self.sound.add("killSoundAffect");
  self.player.hurtSound = self.sound.add("hurtSoundAffect");

  self.player.killNotification = self.add.text(self.cameras.main.scrollX + config.width/2, 50,  "You killed: ", { font: '600 3vh Arial', fill: '#FF0000'});
  self.player.killNotification.setScrollFactor(0, 0);
  self.player.killNotification.setOrigin(0.5, 0.5)
  self.player.killNotification.alpha = 0;
  self.player.killNotification.life = 0;
  self.player.killNotification.lifeSpan = 2000;
  self.player.killNotification.depth = 20;
  self.player.killNotification.playerKilled = "";

  self.player.amountOfUsers = 0;
  self.player.usersOnline = self.add.text(self.cameras.main.scrollX + 800, 20 + self.cameras.main.scrollY, "users online: " + self.player.amountOfUsers, { font: '600 3vh Arial', fill: '#000000'});
  self.player.usersOnline.setScrollFactor(0, 0);
  self.player.usersOnline.depth = 20;

  self.player.speedX = 400;
  self.player.speedY = 600;
  self.player.isFlipped = false;

  self.player.moveTimer = 0;
  self.player.reloadDisplay = self.add.rectangle(200, 200, self.player.moveTimer, 10, 0xFFFFFF);

  self.player.body.setGravityY(1100)


  self.shot = false;

  self.player.shotsLeft = 3;

  self.player.inventorySlot1 = self.physics.add.sprite(50 + self.cameras.main.scrollX, 80 + self.cameras.main.scrollY, "inventorySlot_image")
  self.player.inventorySlot1.setScrollFactor(0, 0);
  self.player.inventorySlot1.setImmovable();
  self.player.inventorySlot1.depth = 40;
  self.player.inventorySlot1.currentObject = self.physics.add.sprite(self.player.inventorySlot1.x, self.player.inventorySlot1.y, self.player.gun.texture.key);
  self.player.inventorySlot1.currentObject.depth = 41
  self.player.inventorySlot1.currentObject.setScrollFactor(0, 0);

  self.player.secondary = self.physics.add.sprite(self.player.x + self.player.width/2, self.player.y, "grenade");
  self.player.secondary.flipY = false;
  self.player.secondary.setScale(0.8, 0.8);
  self.player.secondary.reloadTime = 8000;
  self.player.secondary.time = 0;
  self.player.secondary.shotsLeft = 2;
  self.player.secondary.secondaryType = "grenade";
  //---
  self.player.secondaryWeapon = self.add.group();
  //--

  self.player.inventorySlot2 = self.physics.add.sprite(100 + self.cameras.main.scrollX, 80 + self.cameras.main.scrollY, "inventorySlot_image")
  self.player.inventorySlot2.setScrollFactor(0, 0);
  self.player.inventorySlot2.setImmovable();
  self.player.inventorySlot2.depth = 40;
  self.player.inventorySlot2.alpha = 0.7;
  self.player.inventorySlot2.currentObject = self.physics.add.sprite(self.player.inventorySlot2.x, self.player.inventorySlot2.y, self.player.secondary.texture.key);
  self.player.inventorySlot2.currentObject.depth = 41
  self.player.inventorySlot2.currentObject.setScrollFactor(0, 0)

  self.player.inventoryStatus = "primary";

  self.input.on('pointerdown', function(pointer){

    if (self.player.inventoryStatus == "primary"){

      if (self.player.alpha != 0 && self.player.shotsLeft > 0 && self.player.canSee){

        if (self.player.gun.gunType == "pistol"){
  
          const playerBullet = self.physics.add.sprite(self.player.x, self.player.y, "playerBullet_image");
          playerBullet.setScale(0.3, 0.3);
          playerBullet.speed = 1000;
          playerBullet.bulletType = "pistol";
          playerBullet.lifeSpan = 1500;
          playerBullet.life = 0;
          playerBullet.index = self.player.bullets.getLength();
    
          self.physics.moveToObject(playerBullet, self.player.cursor, playerBullet.speed);
    
    
          playerBullet.wallCollider = self.physics.add.overlap(playerBullet, self.walls, function(){
    
            self.physics.world.removeCollider(playerBullet.wallCollider);
            playerBullet.destroy(true);
            self.player.bullets.remove(playerBullet, true)
    
          })
          
          let angle = Phaser.Math.Angle.Between(playerBullet.x,playerBullet.y,self.player.cursor.x,self.player.cursor.y);
          playerBullet.setRotation(angle);
          self.player.bullets.add(playerBullet);
  
          self.socket.emit('shootBullet', playerBullet.x, playerBullet.y, playerBullet.body.velocity.x, playerBullet.body.velocity.y,
          self.player.gun, playerBullet.lifeSpan, angle, playerBullet.bulletType);
    
          if (mapType != "sandbox"){

            self.player.shotsLeft -= 1;

          }
  
        }
  
        if (self.player.gun.gunType == "shotgun"){
  
          for (i = 0; i < 3; i ++){
  
            const playerBullet = self.physics.add.sprite(self.player.x, self.player.y, "playerBullet_image");
            playerBullet.setScale(0.3, 0.3);
            playerBullet.speed = 1000;
            playerBullet.bulletType = "shotgun";
            playerBullet.lifeSpan = 350;
            playerBullet.life = 0;
            playerBullet.index = self.player.bullets.getLength();
      
            self.physics.moveToObject(playerBullet, self.player.cursor, playerBullet.speed);
      
      
            playerBullet.wallCollider = self.physics.add.overlap(playerBullet, self.walls, function(){
    
              self.physics.world.removeCollider(playerBullet.wallCollider);
              playerBullet.destroy(true);
              self.player.bullets.remove(playerBullet, true)
      
            })
  
            let angle = Phaser.Math.Angle.Between(playerBullet.x,playerBullet.y,self.player.cursor.x,self.player.cursor.y);
            playerBullet.setRotation(angle);
            self.player.bullets.add(playerBullet);
  
            if (self.player.gun.rotation >= -2.1 && self.player.gun.rotation <= -0.8 || self.player.gun.rotation <= 2.1 && self.player.gun.rotation >= 0.8){
  
              if (i == 1){
  
                playerBullet.body.velocity.x = playerBullet.body.velocity.x - 80;
    
              }
    
              if (i == 2){
    
                playerBullet.body.velocity.x = playerBullet.body.velocity.x + 80;
    
              }
              
            }
  
            else {
  
              if (i == 1){
  
                playerBullet.body.velocity.y = playerBullet.body.velocity.y - 80;
    
              }
    
              if (i == 2){
    
                playerBullet.body.velocity.y = playerBullet.body.velocity.y + 80;
    
              }
  
            }
  
            self.socket.emit('shootBullet', playerBullet.x, playerBullet.y, playerBullet.body.velocity.x, playerBullet.body.velocity.y,
            self.player.gun, playerBullet.lifeSpan, angle, playerBullet.bulletType);
      
            if (mapType != "sandbox"){

              self.player.shotsLeft -= 1;

            }
  
          }
  
        }
  
  
        if (self.player.gun.gunType == "sniper"){
  
          const playerBullet = self.physics.add.sprite(self.player.x, self.player.y, "playerBullet_image");
          playerBullet.setScale(0.3, 0.3);
          playerBullet.speed = 1550;
          playerBullet.bulletType = "sniper";
          playerBullet.lifeSpan = 2000;
          playerBullet.life = 0;
          playerBullet.index = self.player.bullets.getLength();
    
          self.physics.moveToObject(playerBullet, self.player.cursor, playerBullet.speed);
    
    
          playerBullet.wallCollider = self.physics.add.overlap(playerBullet, self.walls, function(){
    
            self.physics.world.removeCollider(playerBullet.wallCollider);
            playerBullet.destroy(true);
            self.player.bullets.remove(playerBullet, true)
    
          })
  
          let angle = Phaser.Math.Angle.Between(playerBullet.x,playerBullet.y,self.player.cursor.x,self.player.cursor.y);
          playerBullet.setRotation(angle);
          self.player.bullets.add(playerBullet);
      
          self.socket.emit('shootBullet', playerBullet.x, playerBullet.y, playerBullet.body.velocity.x, playerBullet.body.velocity.y,
          self.player.gun, playerBullet.lifeSpan, angle, playerBullet.bulletType);
    
          if (mapType != "sandbox"){

            self.player.shotsLeft -= 1;

          }
  
        }

        if (self.player.gun.gunType == "tracker"){
  
          const playerBullet = self.physics.add.sprite(self.player.x, self.player.y, "playerBullet_image");
          playerBullet.setScale(0.3, 0.3);
          playerBullet.speed = 650;
          playerBullet.bulletType = "tracker";
          playerBullet.trackTime = 0;
          playerBullet.index = self.player.bullets.getLength();
          playerBullet.trackSpan = 500;
          playerBullet.lifeSpan = 1500;
          playerBullet.life = 0;
          playerBullet.index = self.player.bullets.getLength();
    
          self.physics.moveToObject(playerBullet, self.player.cursor, playerBullet.speed);
    
    
          playerBullet.wallCollider = self.physics.add.overlap(playerBullet, self.walls, function(){
    
            self.physics.world.removeCollider(playerBullet.wallCollider);
            playerBullet.destroy(true);
            self.player.bullets.remove(playerBullet, true);
    
          })

          playerBullet.cursorCollider = self.physics.add.overlap(playerBullet, self.player.cursor, function(){

            playerBullet.trackSpan = 0;

          })
          
          let angle = Phaser.Math.Angle.Between(playerBullet.x,playerBullet.y,self.player.cursor.x,self.player.cursor.y);
          playerBullet.setRotation(angle);
          self.player.bullets.add(playerBullet);
  
          self.socket.emit('shootBullet', playerBullet.x, playerBullet.y, playerBullet.body.velocity.x, playerBullet.body.velocity.y,
          self.player.gun, playerBullet.lifeSpan, angle, playerBullet.bulletType);
    
          if (mapType != "sandbox"){

            self.player.shotsLeft -= 1;

          }
  
        }

  
      }

    }





    //secondary-----

    if (self.player.inventoryStatus == "secondary"){

      if (self.player.secondary.shotsLeft > 0 && self.player.alpha != 0 && self.player.canSee){

        if (self.player.secondary.secondaryType == "grenade"){

          const grenade = self.physics.add.sprite(self.player.x + self.player.width/2, self.player.y, "grenade")
          grenade.setScale(0.8, 0.8);
          grenade.speed = 800;
          grenade.lifeSpan = 1000;
          grenade.life = 0;
          grenade.type = "grenade";
          grenade.depth = 50;
          grenade.explosion_sound = self.sound.add("explosion_soundEffect");
  
          self.anims.create({
            key: "explosion_animation",
            frames: self.anims.generateFrameNumbers("explosion_spriteSheet"),
            frameRate: 17,
            repeat: 0,
          });
  
          grenade.body.setGravityY(800);
          grenade.body.bounce.x = 0.6;
          grenade.body.bounce.y = 0.6;
          grenade.isExploding = false;
          grenade.setFrictionX(10);
  
          //grenade.on('animationcomplete', grenade.destroy(true));
  
          grenade.wallCollider = self.physics.add.collider(grenade, self.walls);
          self.physics.add.overlap(grenade, self.otherPlayers, function(){

            grenade.life = grenade.lifeSpan + 20;

          })
  
          self.physics.moveToObject(grenade, self.player.cursor, grenade.speed);
  
          self.player.secondaryWeapon.add(grenade);
  
          self.socket.emit("secondaryShoot", grenade.x, grenade.y, grenade.body.velocity.x, grenade.body.velocity.y,
          self.player.secondary.secondaryType, grenade.lifeSpan)
  
          if (mapType != "sandbox"){
          self.player.secondary.shotsLeft -= 1;
          }
  
        }
        
      }

    }

  }, self);


    self.physics.add.overlap(self.pistolPickUp, self.player, function(){
      if (e_pressed && self.player.gun.gunType != "pistol"){ self.player.gun.gunType = "pistol"; self.player.shotsLeft = 3; self.player.gun.alreadySetReloadTime = false;}
  })

  self.physics.add.overlap(self.shotgunPickUp, self.player, function(){
    if (e_pressed && self.player.gun.gunType != "shotgun"){ self.player.gun.gunType = "shotgun"; self.player.shotsLeft = 3; self.player.gun.alreadySetReloadTime = false;}
  })

  self.physics.add.overlap(self.sniperPickup, self.player, function(){
    if (e_pressed && self.player.gun.gunType != "sniper"){ self.player.gun.gunType = "sniper"; self.player.shotsLeft = 2; self.player.gun.alreadySetReloadTime = false;}
  })

  self.physics.add.overlap(self.trackerPickup, self.player, function(){
    if (e_pressed && self.player.gun.gunType != "tracker"){ self.player.gun.gunType = "tracker"; self.player.shotsLeft = 2; self.player.gun.alreadySetReloadTime = false;}
  })

  create_scoreBoard(self, self.player);

  self.player.roundOver = self.add.text(self.cameras.main.scrollX + config.width/2, 170,  ['Round Over!', '', '(Please wait while we switch to the new map)'], { font: '600 3vh Arial', fill: '#FFFFFF'});
  self.player.roundOver.setScrollFactor(0, 0);
  self.player.roundOver.setOrigin(0.5, 0.5)
  self.player.roundOver.alpha = 0;
  self.player.roundOver.depth = 996;

  self.player.block = self.add.rectangle(self.cameras.main.scrollX + config.width/2, self.cameras.main.scrollY + config.height/2, 3000, 3000, 0x000000)
  self.player.block.depth = 995;
  self.player.block.alpha = 0;
  self.player.block.setScrollFactor(0, 0)
  self.player.canSee = true;


  
}







function clientLogic(self, delta){




  if (self.player){

    if (!self.player.canSee && self.player.block.alpha <= 1){

      self.player.block.alpha += 0.01;
      self.player.roundOver.alpha += 0.01;

    }

    if (self.player.canSee && self.player.block.alpha >= 0){

      self.player.block.alpha -= 0.01;
      self.player.roundOver.alpha -= 0.01

    }

    self.player.groundCheck.x = self.player.x;
    self.player.groundCheck.y = self.player.y + 15;

    if (self.player.killNotification.alpha > 0){

      let userKilledString = "You killed: " + self.player.killNotification.playerKilled;
      self.player.killNotification.setText(userKilledString);

      self.player.killNotification.life += 1 * delta;
      
      if (self.player.killNotification.life >= self.player.killNotification.lifeSpan){

        self.player.killNotification.life = 0;
        self.player.killNotification.alpha = 0;

      }

    }

    if (self.player.inventoryStatus == "primary"){

      self.player.gun.alpha = 1;
      self.player.secondary.alpha = 0;

    }

    else if (self.player.inventoryStatus == "secondary"){

      self.player.secondary.alpha = 1;
      self.player.gun.alpha = 0;

    }

    if (self.player.gun.gunType == "pistol"){

      self.player.gun.setTexture("gun")
      self.player.gun.setScale(1, 1);
      self.player.gun.reloadTime = 1500;

      if (!self.player.gun.alreadySetReloadTime){

        self.player.shotsLeft = 3;
        self.player.gun.reloadTime = 1500;
        self.player.moveTimer = 0;

        self.player.gun.alreadySetReloadTime = true;

      }

      self.cameras.main.setZoom(1);

    }

    if (self.player.gun.gunType == "shotgun"){

      self.player.gun.setTexture("shotgun")
      self.player.gun.setScale(2, 2);
      self.player.gun.reloadTime = 1000;

      if (!self.player.gun.alreadySetReloadTime){

        self.player.shotsLeft = 3;
        self.player.gun.reloadTime = 1700;
        self.player.moveTimer = 0;

        self.player.gun.alreadySetReloadTime = true;

      }
      
      self.cameras.main.setZoom(1);

    }

    if (self.player.gun.gunType == "sniper"){

      self.player.gun.setTexture("sniper")
      self.player.gun.setScale(2, 2);
      self.player.gun.reloadTime = 1700;

      if (!self.player.gun.alreadySetReloadTime){

        self.player.shotsLeft = 2;
        self.player.gun.reloadTime = 1700;
        self.player.moveTimer = 0;

        self.player.gun.alreadySetReloadTime = true;

      }

      self.cameras.main.setZoom(0.7);

    }

    if (self.player.gun.gunType == "tracker"){

      self.player.gun.setTexture("tracker")
      self.player.gun.setScale(1.2, 1.2);
      self.player.gun.reloadTime = 1500;

      if (!self.player.gun.alreadySetReloadTime){

        self.player.shotsLeft = 2;
        self.player.gun.reloadTime = 1500;
        self.player.moveTimer = 0;

        self.player.gun.alreadySetReloadTime = true;

      }

      self.cameras.main.setZoom(1);

    }

    let killString = "kills: " + self.player.amountOfKills;
    self.player.kills.setText(killString);

    self.socket.emit("playerKills", {username: username, kills: self.player.amountOfKills}, self.socket.id)

    let usersOnlineString = "users online: " + (self.otherPlayers.getLength() + 1);
    self.player.usersOnline.setText(usersOnlineString);
    
    self.player.bullets.getChildren().forEach(function (playerBullet) {

      playerBullet.life += 1 * delta;

      if (playerBullet.bulletType == "tracker" && playerBullet.life <= playerBullet.trackSpan){

        let angle = Phaser.Math.Angle.Between(playerBullet.x,playerBullet.y,self.player.cursor.x,self.player.cursor.y);
        playerBullet.setRotation(angle);
        self.physics.moveToObject(playerBullet, self.player.cursor, playerBullet.speed);

        self.socket.emit("trackerBulletVelocity", playerBullet.x, playerBullet.y, angle, playerBullet.body.velocity.x, playerBullet.body.velocity.y, playerBullet.index, self.socket.id);

      }

      if (playerBullet.life >= playerBullet.lifeSpan){

        if (playerBullet.bulletType == "tracker"){

          self.physics.world.removeCollider(playerBullet.cursorCollider)

        }

        self.physics.world.removeCollider(playerBullet.wallCollider);
        playerBullet.destroy(true);
        self.player.bullets.remove(playerBullet, true)

      }

    });


    self.otherPlayers.getChildren().forEach(function (otherPlayer) {

      otherPlayer.theirBullets.getChildren().forEach(function (otherPlayerBullet) {

        otherPlayerBullet.life += 1;

        if (otherPlayerBullet.life >= otherPlayerBullet.lifeSpan){

          self.physics.world.removeCollider(otherPlayerBullet.wallCollider);
          otherPlayerBullet.destroy(true);
          otherPlayer.theirBullets.remove(otherPlayerBullet, true)

        }

      });

      otherPlayer.secondaryWeapon.getChildren().forEach(function (secondary) {

        if (secondary.type == "grenade"){

          secondary.life += 1 * delta;
  
          if (secondary.life >= secondary.lifeSpan){
  
            secondary.setVelocityX(0);
            secondary.setVelocityY(0);

            if (!secondary.isExploding){

              //let volumeFromDisctance = Phaser.Math.Distance.Between(secondary.x, secondary.y, self.player.x, self.player.y);
              //let maxDistance = config.width / 2.5;
              //let newVolume = 1 - volumeFromDisctance / maxDistance;
              //newVolume = Math.max(newVolume, 0);
              secondary.explosion_sound.play();
              secondary.explosion_sound.setVolume(0.2)
              secondary.setScale(1.5, 1.5)

            }
  
            secondary.play("explosion_animation", true);
            secondary.on('animationcomplete', function(){
  
              self.physics.world.removeCollider(secondary.wallCollider);
              secondary.destroy(true);
              otherPlayer.secondaryWeapon.remove(secondary, true)
              
            });
  
            secondary.isExploding = true;
  
          }
  
        }

      });

    });



    self.player.secondaryWeapon.getChildren().forEach(function (secondary) {

      if (secondary.type == "grenade"){

        secondary.life += 1 * delta;

        if (secondary.life >= secondary.lifeSpan){

          secondary.setVelocityX(0);
          secondary.setVelocityY(0);

          secondary.setScale(3.9, 3.7)
          secondary.alpha = 0;

          if (!secondary.isExploding){

            secondary.explosion_container = self.physics.add.sprite(secondary.x, secondary.y, "");
            secondary.explosion_container.play("explosion_animation", true)
            secondary.explosion_container.depth = secondary.depth + 1;
            secondary.explosion_container.setScale(1.5,1.5)
            secondary.explosion_sound.setVolume(0.2)
            secondary.explosion_sound.play();

            if (mapType == "sandbox"){

              secondary.explosion_container.collider = self.physics.add.overlap(secondary, self.player, function(){

                self.player.alpha = 0;
  
              })

            }

          }
          
          secondary.explosion_container.on('animationcomplete', function(){

            self.physics.world.removeCollider(secondary.wallCollider);
            self.physics.world.removeCollider(secondary.explosion_container.collider)
            secondary.explosion_container.destroy(true)
            secondary.destroy();
            self.player.secondaryWeapon.remove(secondary, true)
            
          });

          secondary.isExploding = true;


        }

      }

    });


    if (self.player.secondary.shotsLeft <= 0){

      if (self.player.secondary.time <= self.player.secondary.reloadTime){

        self.player.secondary.time += 1 * delta;
  
      }

      if (self.player.secondary.time >= self.player.secondary.reloadTime){


        self.player.secondary.shotsLeft = 2;
        self.player.secondary.time = 0;

      }

    }



    self.player.reloadDisplay.width = self.player.moveTimer * 0.1;
    self.player.reloadDisplay.x = self.player.x - self.player.reloadDisplay.width/2;
    self.player.reloadDisplay.y = self.player.y - self.player.height/2 - 10;

    if (self.player.alpha == 0){

      if (!self.player.isAlreadyDead){

        self.player.hurtSound.play();
        self.player.isAlreadyDead = true;

      }

      self.player.y = -10000000;

        let playersAlive = 0;

        self.otherPlayers.getChildren().forEach(function (otherPlayer) {

          if (otherPlayer.y != -10000000){
            
            playersAlive ++;
            self.cameras.main.startFollow(otherPlayer);
            //self.cameras.main.setLerp(0.02);

          }

          /*if (playersAlive <= 1){

            self.player.alpha = 1;
            self.cameras.main.stopFollow();
            self.cameras.main.startFollow(self.player);
            self.cameras.main.setLerp(0.02);

            self.player.x = Math.floor(Math.random() * 700) + 50;
            self.player.y = 100;

          }*/

        });


        self.player.respawn += 1 * delta;

        if (self.player.respawn >= self.player.respawnTime){

          self.player.alpha = 1;
          self.player.y = 100;
          self.player.x = Math.floor(Math.random() * (1300 + 500 + 1) - 500);
          self.player.respawn = 0;

          self.cameras.main.startFollow(self.player);
          self.cameras.main.setLerp(0.02);

          self.socket.emit("selfPlayerRespawn", self.socket.id);
          self.player.secondary.shotsLeft = 2;
          self.player.gun.alreadySetReloadTime = false;
          self.player.isAlreadyDead = false;

        }
      
    }



    if (self.player.body.velocity.x < 0){

      self.player.flipX = true;
      self.player.isFlipped = true;

    }

    if (self.player.body.velocity.x > 0){

      self.player.flipX = false;
      self.player.isFlipped = false;

    }



    if (self.player.gun.x < self.player.cursor.x){

      self.player.gun.flipY = false;
      self.player.gun.x = self.player.x + self.player.width/2;
      self.player.gun.y = self.player.y;

    }

    if (self.player.gun.x > self.player.cursor.x){

      self.player.gun.flipY = true;
      self.player.gun.x = self.player.x - self.player.width/2;
      self.player.gun.y = self.player.y;

    }

    if (self.player.secondary.x < self.player.cursor.x){

      self.player.secondary.flipX = false;
      self.player.secondary.x = self.player.x + self.player.width/2;
      self.player.secondary.y = self.player.y;

    }

    if (self.player.secondary.x > self.player.cursor.x){

      self.player.secondary.flipX = true;
      self.player.secondary.x = self.player.x - self.player.width/2;
      self.player.secondary.y = self.player.y;

    }

    self.socket.emit("gunMovement", self.player.gun.x, self.player.gun.y, self.player.gun.rotation, self.player.gun.flipY, self.player.gun.gunType, self.player.inventoryStatus);

    let angle = Phaser.Math.Angle.Between(self.player.gun.x,self.player.gun.y,self.player.cursor.x,self.player.cursor.y);
    self.player.gun.setRotation(angle);




    self.player.username.x = self.player.x - self.player.username.width/2;
    self.player.username.y = self.player.y - 70;

    if (self.player.shotsLeft <= 0){

      self.player.moveTimer += 1 * delta;
      self.player.speedX = 280;

    }

    if (self.player.moveTimer >= self.player.gun.reloadTime){

      if (self.player.gun.gunType == "pistol"){

        self.player.shotsLeft = 3;
  
      }
  
      if (self.player.gun.gunType == "shotgun"){

        self.player.shotsLeft = 3;

      }

      if (self.player.gun.gunType == "sniper"){

        self.player.shotsLeft = 2;

      }

      if (self.player.gun.gunType == "tracker"){

        self.player.shotsLeft = 2;

      }
      
      self.player.speedX = 400;
      self.player.moveTimer = 0;

    }

    self.player.cursor.x = self.input.x + self.cameras.main.scrollX;
    self.player.cursor.y = self.input.y + self.cameras.main.scrollY;


    if (right_pressed){
      self.player.addedVelocty = Math.abs(self.player.addedVelocty);

      if (self.player.addedVelocty <= 300){

        self.player.setVelocityX(self.player.speedX + self.player.addedVelocty);

      }

      else{

        self.player.setVelocityX(self.player.speedX + 300);

      }
      
      if (self.player.addedVelocty >= 1){

        self.player.addedVelocty -= 3;

      }

    }


    else if (left_pressed){

      if (self.player.addedVelocty > 0){

        self.player.addedVelocty = self.player.addedVelocty * -1;

      }

      if (self.player.addedVelocty >= -300){

        self.player.setVelocityX(-self.player.speedX + self.player.addedVelocty);

      }

      else{

        self.player.setVelocityX(-self.player.speedX - 300);

      }

      if (self.player.addedVelocty <= -1){

        self.player.addedVelocty += 3;

      }

    }


    else{
      
      if (self.player.addedVelocty <= 300 || self.player.addedVelocty >= -300){

        self.player.setVelocityX(0);

      }

      if (self.player.addedVelocty <= -1){

        self.player.addedVelocty += 3;

      }

      if (self.player.addedVelocty >= 1){

        self.player.addedVelocty -= 3;

      }
      //self.player.addedVelocty = 0;
    }

    if (self.player.body.velocity.x <= self.player.speedX && self.player.body.velocity.x >= -self.player.speedX){

      self.player.addedVelocty = 0;

    }

    if (up_pressed && self.player.body.onFloor()){

      self.player.setVelocityY(-self.player.speedY);

    }


    else if (down_pressed){
      self.player.setVelocityY(self.player.speedY)
    }




    if (self.player.y >= config.height + 200){

      self.player.y = 200;
      self.player.x = config.width/2;
      
    }

    self.player.inventorySlot1.currentObject.setTexture(self.player.gun.texture.key)

    if (one_key_pressed){

      self.player.inventorySlot1.alpha = 1;
      self.player.inventorySlot1.currentObject.alpha = 1;
      self.player.inventorySlot2.alpha = 0.7;
      self.player.inventorySlot2.currentObject.alpha = 0.7;
      self.player.inventoryStatus = "primary";

    }
    
    if (two_key_pressed){

      self.player.inventorySlot2.alpha = 1;
      self.player.inventorySlot2.currentObject.alpha = 1;
      self.player.inventorySlot1.alpha = 0.7;
      self.player.inventorySlot1.currentObject.alpha = 0.7;
      self.player.inventoryStatus = "secondary";

    }


    // emit player movement
    var x = self.player.x;
    var y = self.player.y;
    var r = self.player.rotation;
    if (self.player.oldPosition && (x !== self.player.oldPosition.x || y !== self.player.oldPosition.y || r !== self.player.oldPosition.rotation)) {


    self.socket.emit('playerMovement', { x: self.player.x, y: self.player.y, rotation: self.player.rotation, playerIsFlipped: self.player.flipX });

    }
    // save old position data
    self.player.oldPosition = {
      x: self.player.x,
      y: self.player.y,
      rotation: self.player.rotation
    };


  }

  
}






function deleteSecondary(secondary){

  secondary.destroy(true)

}




