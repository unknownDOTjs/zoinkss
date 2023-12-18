





function tellServer(self){

  self.socket.on("comfirmedClient", function(){


    self.socket.on('currentPlayers', function (players) {

      Object.keys(players).forEach(function (id) {
  
        if (players[id].playerId === self.socket.id) {
          addPlayer(self, players[id]);
        } else {
          addOtherPlayers(self, players[id]);
        }
      
      });
  
  
      self.otherPlayers.getChildren().forEach(function (otherPlayer) {
  
        self.physics.add.overlap(otherPlayer, self.player.bullets, function(){
    
          if (otherPlayer.alpha != 0 && !otherPlayer.isDead){
    
            self.socket.emit("clientHitOtherPlayer", otherPlayer.playerId);
            self.player.killSound.play();
            self.player.amountOfKills += 1;
  
            //self.socket.emit("updateClientKills", )
            otherPlayer.isDead = true;
  
            otherPlayer.alpha = 0;
  
            self.player.killNotification.alpha = 1;
            self.player.killNotification.playerKilled = otherPlayer.theirUsername;
    
          }
      
        })
  
        self.physics.add.overlap(otherPlayer, self.player.secondaryWeapon, function(){
  
          if (otherPlayer.alpha !== 0 && !otherPlayer.isDead){
    
            self.socket.emit("clientHitOtherPlayer", otherPlayer.playerId);
            self.player.killSound.play();
            self.player.amountOfKills += 1;
            otherPlayer.alpha = 0;

            otherPlayer.isDead = true;
  
            self.player.killNotification.alpha = 1;
            self.player.killNotification.playerKilled = otherPlayer.theirUsername;
    
          }
          
        })
    
      });
  
  
    });
  
    self.socket.on('newPlayer', function (playerInfo) {
      addOtherPlayers(self, playerInfo);
  
      self.otherPlayers.getChildren().forEach(function (otherPlayer) {
  
        self.physics.add.overlap(otherPlayer, self.player.bullets, function(){
    
          if (otherPlayer.alpha != 0 && !otherPlayer.isDead){
    
            self.socket.emit("clientHitOtherPlayer", otherPlayer.playerId);
            self.player.killSound.play();
            self.player.amountOfKills += 1;
            otherPlayer.alpha = 0;

            otherPlayer.isDead = true;
            
            self.player.killNotification.alpha = 1;
            self.player.killNotification.playerKilled = otherPlayer.theirUsername;
  
          }
      
        })
  
        self.physics.add.overlap(otherPlayer, self.player.secondaryWeapon, function(){
  
          if (otherPlayer.alpha !== 0 && !otherPlayer.isDead){
    
            self.socket.emit("clientHitOtherPlayer", otherPlayer.playerId);
            self.player.killSound.play();
            self.player.amountOfKills += 1;
            otherPlayer.alpha = 0;

            otherPlayer.isDead = true;
  
            self.player.killNotification.alpha = 1;
            self.player.killNotification.playerKilled = otherPlayer.theirUsername;
    
          }
          
        })
        
    
      });
      
    });
  
    self.socket.on('disconnected', function (playerId) {
      self.otherPlayers.getChildren().forEach(function (otherPlayer) {
        if (playerId === otherPlayer.playerId) {
          otherPlayer.theirBullets.clear(true);
          otherPlayer.theirBullets.destroy(true);
          otherPlayer.username.destroy(true);
          otherPlayer.gun.destroy(true);
          otherPlayer.destroy(true);
        }
      });
  
    });
  
    
    self.socket.on("active_users", function(amountOfUsersSERVER){
  
      self.player.amountOfUsers = amountOfUsersSERVER;
  
    });
  
    self.socket.on("recieveLeaderBoard", function(sentLeaderBoard){
  
      self.scoreBoard.content = [
        'Leaderboard:',
        sentLeaderBoard
      ];
        
      self.scoreBoard.setText(self.scoreBoard.content);
  
    })
  
    self.socket.on('playerMoved', function (playerInfo) {
      self.otherPlayers.getChildren().forEach(function (otherPlayer) {
        if (playerInfo.playerId === otherPlayer.playerId) {
          
          if (playerInfo.playerIsDead){

            otherPlayer.alpha = 0;

          }

          else{

            otherPlayer.alpha = 1;

          }
          
          otherPlayer.setRotation(playerInfo.rotation);
          otherPlayer.setPosition(playerInfo.x, playerInfo.y);
          //console.log(playerInfo.x);
          //console.log(playerInfo.y)
          //otherPlayer.x += (otherPlayer.x - playerInfo.x);
          //otherPlayer.y += (otherPlayer.y - playerInfo.y);
  
          //otherPlayer.username = playerInfo.username;
  
          otherPlayer.theirUsername = playerInfo.playerUsername;
  
          otherPlayer.username.x = otherPlayer.x - otherPlayer.username.width/2;
          otherPlayer.username.y = otherPlayer.y - 70;
  
          otherPlayer.flipX = playerInfo.playerIsFlipped;
  
        }
      });
  
    });
  
  
    self.socket.on("otherGun", function(gunX, gunY, gunRotation, flipY, gunType, inventoryStatus, otherPlayerId){
  
  
      self.otherPlayers.getChildren().forEach(function (otherPlayer) {
        if (otherPlayerId === otherPlayer.playerId) {
  
          otherPlayer.gun.x = gunX;
          otherPlayer.gun.y = gunY;
  
          if (inventoryStatus == "primary"){
  
            otherPlayer.gun.flipY = flipY;
  
            if (gunType == "pistol"){
  
              otherPlayer.gun.setTexture("gun");
              otherPlayer.gun.setScale(1, 1);
    
            }
    
            if (gunType == "shotgun"){
    
              otherPlayer.gun.setTexture("shotgun");
              otherPlayer.gun.setScale(2, 2);
    
            }
    
    
            if (gunType == "sniper"){
    
              otherPlayer.gun.setTexture("sniper");
              otherPlayer.gun.setScale(2, 2);
    
            }
  
            if (gunType == "tracker"){
    
              otherPlayer.gun.setTexture("tracker");
              otherPlayer.gun.setScale(1.2, 1.2);
    
            }
    
            otherPlayer.gun.setRotation(gunRotation)
  
          }
  
          if (inventoryStatus == "secondary"){
  
            otherPlayer.gun.setTexture("grenade");
            otherPlayer.gun.setScale(0.8, 0.8);
            otherPlayer.gun.flipY = false;
            otherPlayer.gun.setRotation(0);
  
          }        
  
        }
      });
  
    })
  
    self.socket.on('otherPlayerShoot', function(playerId, bulletX, bulletY,  bulletVelocityX, bulletVelocityY, gun, bulletLifeSpan, angle, bulletType){
  
      self.otherPlayers.getChildren().forEach(function (otherPlayer) {
        if (playerId === otherPlayer.playerId) {
  
          
          const otherPlayerBullet = self.physics.add.sprite(bulletX, bulletY, "otherPlayerBullet_image");
          otherPlayerBullet.setScale(0.3, 0.3);
          otherPlayerBullet.index = otherPlayer.theirBullets.getLength();
          otherPlayerBullet.lifeSpan = bulletLifeSpan + 30;
          //console.log(bulletLifeSpan)
          otherPlayerBullet.life = 0;
          otherPlayerBullet.setRotation(angle)
  
          otherPlayerBullet.wallCollider =  self.physics.add.overlap(otherPlayerBullet, self.walls, function(){
  
            self.physics.world.removeCollider(otherPlayerBullet.wallCollider);
            otherPlayerBullet.destroy(true);
            otherPlayer.theirBullets.remove(otherPlayerBullet, true);
            
          })
  
          otherPlayerBullet.bulletType = bulletType;
  
          if (bulletType == "tracker"){
  
            otherPlayerBullet.trackTime = 0;
            otherPlayerBullet.trackSpan = 500;
            otherPlayerBullet.cursorTargetX;
            otherPlayerBullet.cursorTargetY;
            otherPlayerBullet.index = otherPlayer.theirBullets.getLength();
  
          }
  
          otherPlayerBullet.setVelocityX(bulletVelocityX);
          otherPlayerBullet.setVelocityY(bulletVelocityY);
          otherPlayer.theirBullets.add(otherPlayerBullet);
  
  
        }
  
      });
      
    });
    
  
    self.socket.on("othertrackerBulletVelocity", function(x, y, angle, velocityX, velocityY, index, playerId){
  
      self.otherPlayers.getChildren().forEach(function (otherPlayer) {
        if (playerId === otherPlayer.playerId) {
  
          otherPlayer.theirBullets.getChildren().forEach(function (otherPlayerBullet) {
  
            if (otherPlayerBullet.bulletType == "tracker" && otherPlayerBullet.index == index){
  
              otherPlayerBullet.x = x;
              otherPlayerBullet.y = y;
  
              otherPlayerBullet.setRotation(angle);
  
              otherPlayerBullet.setVelocityX(velocityX);
              otherPlayerBullet.setVelocityY(velocityY);
  
            }
    
          });
  
        }
  
      });
  
    })
  
  
    self.socket.on("otherSecondaryShoot", function(otherPlayerId, secondaryX, secondaryY, secondaryVelX, secondaryVelY,
      secondaryType, secondaryLifeSpan){
  
      self.otherPlayers.getChildren().forEach(function (otherPlayer) {
        if (otherPlayerId === otherPlayer.playerId) {
  
          if (secondaryType == "grenade"){
  
            const otherGrenade = self.physics.add.sprite(secondaryX, secondaryY, "grenade")
            otherGrenade.setScale(0.8, 0.8);
            otherGrenade.lifeSpan = secondaryLifeSpan;
            otherGrenade.life = 0;
            otherGrenade.type = "grenade";
            otherGrenade.depth = 50;
            otherGrenade.isExploding = false;
            otherGrenade.explosion_sound = self.sound.add("explosion_soundEffect")
  
            self.anims.create({
              key: "explosion_animation",
              frames: self.anims.generateFrameNumbers("explosion_spriteSheet"),
              frameRate: 17,
              repeat: 0,
            });
    
            otherGrenade.body.setGravityY(800);
            otherGrenade.body.bounce.x = 0.6;
            otherGrenade.body.bounce.y = 0.6;
            otherGrenade.setFrictionX(10);
    
            //otherGrenade.on('animationcomplete', otherGrenade.destroy(true));
    
            self.physics.add.collider(otherGrenade, self.walls);
            self.physics.add.overlap(otherGrenade, self.player, function(){
  
              otherGrenade.life = otherGrenade.lifeSpan + 20;
  
            })
  
            self.otherPlayers.getChildren().forEach(function (otherPlayer) {
              if (otherPlayerId !== otherPlayer.playerId) {
        
                
                self.physics.add.overlap(otherGrenade, otherPlayer, function(){
  
                  otherGrenade.life = otherGrenade.lifeSpan + 20;
      
                })
        
              }
            });
  
            otherGrenade.setVelocityX(secondaryVelX);
            otherGrenade.setVelocityY(secondaryVelY);
            otherPlayer.secondaryWeapon.add(otherGrenade);
  
          }
  
        }
      });
  
    })
  
    self.socket.on("serversListOfDeadPlayers", function(listOfDead){

      self.otherPlayers.getChildren().forEach(function (otherPlayer) {

        for (i = 0; i < listOfDead.length; i++){

          if (otherPlayer.playerId === listOfDead[i]) {

            if (otherPlayer.playerIsDead){
  
              otherPlayer.alpha = 0;
              otherPlayer.isDead = true;
              otherPlayer.y = -10000000;
  
            }
  
            otherPlayer.alpha = 0;
            self.socket.emit("serverSideElimination", otherPlayerId);
    
          }

          else{

            otherPlayer.isDead = false;

          }

        }

      });

    })
  
    self.socket.on("aClientHitSomeone", (otherPlayerObject, otherPlayerId, clientId) =>{
  
      if (otherPlayerId == self.socket.id){
  
        self.player.alpha = 0;
  
      }
  
      if (otherPlayerId != clientId){
  
        self.otherPlayers.getChildren().forEach(function (otherPlayer) {
          if (otherPlayerId === otherPlayer.playerId) {

            if (otherPlayerObject.playerIsDead){
  
              otherPlayer.alpha = 0;
              otherPlayer.y = -10000000;
  
            }

            otherPlayer.alpha = 0;
            self.socket.emit("serverSideElimination", otherPlayerId);
    
          }
        });
  
      }
  
    })
  
  
    self.socket.on("aClientRespawned", (otherPlayerId)=>{
  
      self.otherPlayers.getChildren().forEach(function (otherPlayer) {
        if (otherPlayerId === otherPlayer.playerId) {
  
          
          otherPlayer.alpha = 1;
          otherPlayer.isDead = false;
  
        }
      });
  
    })
  
    
  
    self.socket.on("returnUsername", (theirUsername, theirId) => {
  
      self.otherPlayers.getChildren().forEach(function (otherPlayer) {
        if (theirId === otherPlayer.playerId) {
  
          otherPlayer.username.setText(theirUsername);
  
        }
      });
  
    })
  
  
    self.socket.on("updateWalls", (wallX, wallY, wallSpeed, index, isVertical, resetPos)=>{
  
      isInSync = true;
  
      if (resetPos){
  
        self.walls.getChildren()[index].x = wallX;
        self.walls.getChildren()[index].y = wallY;
  
      }
  
      if (isVertical){
  
        self.walls.getChildren()[index].setVelocityY(wallSpeed);
  
      }
  
      else if (!isVertical){
  
        self.walls.getChildren()[index].setVelocityX(wallSpeed);
  
      }
  
    })
  
    self.socket.on("serverCurrentMap", function(currentMap, canSee){
  
      if (self.currentMap != currentMap){
        self.currentMap = currentMap;
  
        alreadyMadeWalls = false;
        self.socket.emit("clientHasRecievedMapData")
  
      }
  
      self.player.canSee = canSee;
    })
  
    self.socket.on("hasChangedMap", function(){
  
      self.player.amountOfKills = 0;
      self.player.y = Math.floor(Math.random() * 100) - 200;
      self.player.x = Math.floor(Math.random() * (1300 + 500 + 1) - 500);
      self.player.canSee = true;
      
    })
  

  })

}