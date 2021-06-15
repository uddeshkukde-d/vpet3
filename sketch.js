//game objects 
var database;
var position;
var dog,  garden, washroom;
var currentTime;
var gameState;
//form
var feed,add
var foodobject
var Feedtime
var Lastfeed, foodStockImg, fs;

//load images
function preload(){
  dogimg1 = loadImage("images/dog1.png");
  dogimg2 = loadImage("images/HappyDog.png");
  garden=  loadImage("images/Garden.png");
  bedroom= loadImage("images/Bed Room.png");
  washroom= loadImage("images/Wash Room.png");
}

//setup
function setup() {
	createCanvas(700, 700);
  database = firebase.database();
  
  //food
  foodobject=new Food()

  //dogsprite
  dog = createSprite(550,250,10,10);
  dog.addImage(dogimg1)
  dog.scale=0.2
 
  //food Stock
  var foodS = database.ref('Food');
  foodS.on("value", readPosition, showError);

  //gameState
 var readState= database.ref('gameState');
 readState.on("value", function(data){
   gameState= data.val();
 })

  //buttons
  feed = createButton("FEED DRAGO MILK")
  feed.position(600,100)
  feed.mousePressed(FeedDog)
  add = createButton("ADD FOOD")
  add.position(400,100)
  add.mousePressed(addFood)
} 

//draw
function draw(){
 background(46,139,87);

 //display food
 foodobject.display()

 //timings
 currentTime= hour();
if(currentTime==(Lastfeed+1)){
  update("Playing");
foodobject.garden();
}

else if(currentTime==(Lastfeed+2)){
  update("Sleeping");
  foodobject.bedroom();
}

else if(currentTime>(Lastfeed+2) && currentTime<=(Lastfeed+4)){
  update("Bathing");
  foodobject.washroom();
}

else{
  update("Hungry")
  foodobject.display();
}

if(gameState !== "Hungry"){
  feed.hide();
  addFood.hide();
  dog.remove();
}

else{
  feed.show();
  add.show();
}
 //end 

 drawSprites();
  
 fill(255,255,254);
 textSize(15);

 //feedtime calculator
 fedtime=database.ref('FeedTime')
 fedtime.on("value",function(data){ Lastfeed=data.val(); });
 if(Lastfeed>=12){
   text("Last Fed :" + Lastfeed%12 + "PM", 150,100);
}

 else if(Lastfeed ===0 ){
   text("Last Fed : 12 AM" , 150,100)
 }

 else{
   text("Last Fed :" + Lastfeed + "AM", 150,100);
 }

drawSprites();
}

//functions for food stock reading
function readPosition(data){
  position = data.val();
  foodobject.updateFoodStock(position)
}

function showError(){
  console.log("Error");
}

//add food
function addFood(){
position++
database.ref('/').update({
  Food:position
})
}

//feeding dog
function FeedDog(){

dog.addImage(dogimg2)

foodobject.updateFoodStock(foodobject.getFoodStock()-1)
 database.ref('/').update({
   Food:foodobject.getFoodStock(),
   FeedTime:hour ()
 })
}

//update gameState
function update(state){
  database.ref('/').update({
    gameState:state
  })
}