var WEBGL = true;

var appName = "ROLL"
var appVersion = "0.1";

var trainX = 0;
var trainR = 0;
var maxX = 20;
var maxR = 5;
var sliderX = 0;
var sliderR = 0;

var pointXOld;
var mouseYOld;

var firstNode = false;
var jumpTest = false;
var jumpTestOld = false;

var helpShow = false;

var cBg = 255;
var cLines = 0;
var cPlayer = "#8f0cff";
var cUIBg = 100;

var oscilators = [];
var oscilatorsFreq = [];
var polyNum = 4; 

var uiWidth = 80;
var margen = 10;

var canvasWidth;
var canvasHeight;

var buttonSize = 40;
var buttons = [];
var sliders = [];

if(WEBGL) var buttonsTypes = ["paint", "erase", "clear", "save", "help", "stop"];
else var buttonsTypes = ["paint", "erase", "clear", "save", "help", "stop"];
var btnImg_paint;
var btnImg_erase;
var btnImg_clear;
var btnImg_stop;
var btnImg_save;
var btnImg_help;
var btnImg_rtrain;
var btnImg_xtrain;
var sliderSize = 150;

var collisionPoints = [];


var currentTool = "paint";


var savingScore = false;

var loadedScore;


function setup() {  	

	var c
	if(WEBGL) c = createCanvas(windowWidth, windowHeight, "webgl");
	else c = createCanvas(windowWidth, windowHeight, "2d");
	c.drop(gotFile); 

	canvasWidth = windowWidth;
	canvasHeight = windowHeight;

	createMiniCanvases();

	
  	angleMode(DEGREES);

  	btnImg_paint = loadImage("img/brush.png");
	btnImg_erase = loadImage("img/eraser.png");
	btnImg_clear = loadImage("img/checkbox-blank.png");
	btnImg_stop = loadImage("img/stop.png");
	btnImg_save = loadImage("img/save.png");
	btnImg_stop = loadImage("img/stop.png");
	btnImg_save = loadImage("img/save.png");
	btnImg_help = loadImage("img/help.png");
	btnImg_rtrain = loadImage("img/cached.png");
	btnImg_xtrain = loadImage("img/code-tags.png");

  

  	for (var i=0; i<polyNum; i++) {
    	oscilators.push(new Oscilador());
    	oscilatorsFreq[i] = 0;
    }

    for (var i=0; i < buttonsTypes.length; i++) {
    	if(i <= 4) buttons.push(new Boton(margen, i * (buttonSize + margen) + margen, buttonsTypes[i]));
    	else buttons.push(new Boton(margen, windowHeight - margen - buttonSize, buttonsTypes[i]));  	
    }

    sliders.push(new Slider(margen, windowHeight - margen*2 - buttonSize*2, false, "rtrain"));  	
    sliders.push(new Slider(margen + buttonSize + margen, windowHeight - margen - buttonSize, true, "xtrain"));

}

function draw() {  
	background(cBg);

	pg0 = pg2 = pg1;

	push();
	translate(canvasWidth/2, canvasHeight/2);
	rotate(trainR);
	translate(-canvasWidth/2, -canvasHeight/2);

	image(pg0, -canvasWidth + trainX, 0);
	image(pg1, 0 + trainX, 0);
	image(pg2, canvasWidth + trainX, 0);

	
  	
	if (mouseIsPressed && !isOnUI()){

		var pointX;		

		if(mouseX > trainX){
			pointX = mouseX - trainX;
			jumpTest = true;
		}
		else {
			pointX = canvasWidth - trainX + mouseX;
			jumpTest = false;
		}

		if(currentTool == "paint"){
			pg1.strokeWeight(4);
			pg1.noFill();
			pg1.stroke(cLines)
		}
		else if(currentTool == "erase"){
			pg1.strokeWeight(50);
			pg1.noFill();
			pg1.stroke(cBg)
		}
		
		pg1.point(pointX, mouseY);

		if(firstNode){
			firstNode = false;
		}
		else if(jumpTest == jumpTestOld){
			pg1.line(pointX, mouseY, pointXOld, mouseYOld);
		}

		pointXOld = pointX;
		mouseYOld = mouseY;
		jumpTestOld = jumpTest;
	}
	
	if(sliderX > 0){
		if(trainX < canvasWidth) trainX += sliderX;
		else trainX = 0;
	}
	if (sliderX < 0){
		if(trainX > -canvasWidth) trainX += sliderX;
		else trainX = 0;
	}

	if(sliderR != 0){		
		trainR = trainR + sliderR;
	}

	



	
	pop();

	var listenerImg
	if(WEBGL) listenerImg = get(canvasWidth/2, 0, 4, canvasHeight);
	else listenerImg = get(canvasWidth/2 - 2, 0, 4, canvasHeight);

	//UI
	strokeWeight(2);
	stroke(cPlayer);
	line(canvasWidth/2,0,canvasWidth/2,canvasHeight);
	stroke(cLines);
	
	for (var i=0; i < buttons.length; i++) {
    	buttons[i].display();    	
    }
    for (var i=0; i < sliders.length; i++) {
    	sliders[i].display();    	
    }


    

	//----SOUND

	
	var pix;
	var safeWait = 0;
	var voiceNum = 0;

	for (var i=0; i<polyNum; i++) {
    	oscilatorsFreq[i] = 0;
    }

	for (var i = canvasHeight; i > 0; i--){
		if(safeWait <= 0){
			pix = listenerImg.get(2,i-1);

			if(pix[1] == 0){
				safeWait = 20; //safe

				var f = canvasHeight - i;
				oscFreq = ( 550 * f ) / canvasHeight + 150;
				
				oscilatorsFreq[voiceNum] = oscFreq;
				voiceNum++;

				var lol = 14;
				fill(0);
				noStroke();
				rect(windowWidth/2 - lol/2, i - lol/2, lol, lol);
				
			} 
		}
		else safeWait--;
		
	}

	for (var i = 0; i < polyNum; i++){
		oscilators[i].osc.freq(oscilatorsFreq[i]);
	}

	//help
	if(helpShow){
    	var helpW = 320;
		var helpH = 230;
		var helpX = windowWidth/2 - helpW/2;
    	var helpY = windowHeight/2 - helpH/2;

    	textAlign(CENTER, CENTER);

		fill(0);
		rect(helpX, helpY, helpW, helpH);


		var txt1 = 
		appName+" "+appVersion+"\n"+
		" \n"+
		"HOW TO:\n"+
		"click 'n drag to paint different voices.\n"+
		"use eraser if you fuck up.\n"+
		"use clear canvas if you really fuck up.\n"+
		"don't use save.\n"+
		"use sliders to give it swing.\n"+
		" \n"+
		"KNOWN BUGS:\n"+
		"save don´t work.\n"+
		"rotation of the canvas fucks up the paint accuracy.\n"+
		"it's meaningless.\n"+
		" ";
		fill(100);
		text(txt1, helpX + helpW/2, helpY + margen, helpW - margen*2, helpX - margen*2);
    }
	
	//save
	if(savingScore){
		image(pg1, 0, 0,windowWidth, windowHeight);
		savingScore = false;
		saveCanvas("score","png");	
	}
	
}

function createMiniCanvases() {
	pg0 = createGraphics(canvasWidth, canvasHeight);
	pg1 = createGraphics(canvasWidth, canvasHeight);
	pg2 = createGraphics(canvasWidth, canvasHeight);

	pg1.background(cBg);
	pg1.stroke(220);
	for (var i=0; i < pg1.width; i+= 80){
		pg1.line(i, 0, i, canvasHeight);
	}
	pg1.stroke(200);
	for (var i=0; i < pg1.height; i+= 40){
		pg1.line(0, i, canvasWidth, i);
	}
	pg0 = pg2 = pg1;
}

function isOnUI() {
	if (mouseX < uiWidth) return true;
	else if(mouseX < uiWidth + sliderSize + buttonSize && mouseY > windowHeight - buttonSize - margen) return true;
	else return false;
}

function mousePressed() {
  	if(isOnUI){
		for (var i=0; i < buttons.length; i++) {
	    	buttons[i].checkClick();    	
	    }
	    for (var i=0; i < sliders.length; i++) {
	    	sliders[i].checkClick();    	
	    }
	}
}

function mouseReleased() {
  firstNode = true;

    for (var i=0; i < sliders.length; i++) {
    	sliders[i].isBeingDragged = false;    	
    }
}

// Oscilator Class
function Oscilador() {
    this.osc;
    this.freq = 220;
    this.oscOn = false;

    this.osc = new p5.SqrOsc(220);
    this.osc.start();    
}

function Slider(_x, _y, _isHorizontal, _tipo) {
    this.x = _x;
    this.y = _y; 
    this.w = buttonSize;
    this.h = buttonSize;
    this.isHorizontal = _isHorizontal;
    this.tipo = _tipo;   
    this.icon;
    this.isBeingDragged = false;
    this.min;
    this.max;
    this.grabPoint;

    if(this.isHorizontal){
    	this.min = this.x; 
    	this.max = this.x + sliderSize;
    }
    else{
    	this.min = this.y; 
    	this.max = this.y - sliderSize;
    }

    if(this.tipo == "rtrain") this.icon = btnImg_rtrain;
	else if(this.tipo == "xtrain") this.icon = btnImg_xtrain;   

	

	this.setValue = function(){
	 	if(this.isHorizontal){
	 		sliderX = ((this.x-this.min) * maxX) / sliderSize;
    			
			if (sliderX < maxX/2) sliderX = (maxX - sliderX)*-1 + maxX/2;
			else if (sliderX > maxX/2) sliderX -= maxX/2;
			else sliderX = 0;
	 	}
	 	else{
	 		sliderR = ((this.y-this.min) * maxR) / sliderSize *-1;
    			
			if (sliderR < maxR/2) sliderR = (maxR - sliderR)*-1 + maxR/2;
			else if (sliderR > maxR/2) sliderR -= maxR/2;
			else sliderR = 0;
	 	}
	}


	this.reset = function(){
	 	if(this.isHorizontal){
	 		this.x = this.min + sliderSize/2;
	 		this.setValue();
	 	}
	 	else{
	 		this.y = this.min - sliderSize/2;
	 		this.setValue();
	 	}
	}

	this.reset();
	if(this.isHorizontal){
 		this.x = this.min + sliderSize/2 + sliderSize/6;
 		this.setValue();
 	}

	


    this.display = function() {

    	if(this.isBeingDragged){

    		if(this.isHorizontal){
    			this.x = mouseX - this.grabPoint;

    			if(this.x > this.max) this.x = this.max - 1;
    			else if (this.x < this.min) this.x = this.min;

    			this.setValue();
    			
    			
    		}
    		else{
    			this.y = mouseY - this.grabPoint;

    			if(this.y < this.max) this.y = this.max;
    			else if (this.y > this.min) this.y = this.min;
    			

    			this.setValue();

    		}
    	}

    	strokeWeight(5);
    	stroke(0);

    	if(this.isHorizontal){
    		line(this.min + this.w/2, this.y + this.h/2, this.min + this.w/2 + sliderSize, this.y + this.h/2);
    	}
    	else{
    		line(this.x + this.w/2, this.min + this.h/2, this.x + this.w/2, this.min + this.h/2 - sliderSize);	
    	}


    	noStroke()
    	fill(0, 10);
    	rect(this.x + 5, this.y + 5, this.w, this.h); 

    	if(this.checkMouse()) fill(255,0,0);
    	else fill(0);

    	rect(this.x, this.y, this.w, this.h);

    	image(this.icon, this.x + buttonSize/2 - this.icon.width/2, this.y + buttonSize/2 - this.icon.height/2);
    }

    this.checkMouse = function() {
    	if (this.x < mouseX && mouseX < this.x + this.w && this.y < mouseY && mouseY < this.y + this.h) return true;
    	else return false;    	
    }

    this.checkClick = function() {
    	if(this.checkMouse()){
    		 this.isBeingDragged = true;	

    		 if (this.isHorizontal) this.grabPoint = mouseX - this.x;
    		 else this.grabPoint = mouseY - this.y; 	
    	}	
    }

}

function Boton(_x, _y, _tipo) {
    this.x = _x;
    this.y = _y; 
    this.w = buttonSize;
    this.h = buttonSize;
    this.tipo = _tipo;   
    this.icon;

    if(this.tipo == "paint") this.icon = btnImg_paint;
    else if(this.tipo == "erase") this.icon = btnImg_erase;
    else if(this.tipo == "clear") this.icon = btnImg_clear;
	else if(this.tipo == "stop") this.icon = btnImg_stop;
	else if(this.tipo == "save") this.icon = btnImg_save;
	else if(this.tipo == "help") this.icon = btnImg_help;
	     


    this.display = function() {
    	noStroke()
    	fill(0, 10);
    	rect(this.x + 5, this.y + 5, this.w, this.h); 

    	if(this.checkMouse()) fill(255,0,0);
    	else fill(0);

    	rect(this.x, this.y, this.w, this.h);

    	image(this.icon, this.x + buttonSize/2 - this.icon.width/2, this.y + buttonSize/2 - this.icon.height/2);
    }

    this.checkMouse = function() {
    	if (this.x < mouseX && mouseX < this.x + this.w && this.y < mouseY && mouseY < this.y + this.h) return true;
    	else return false;    	
    }

    this.checkClick = function() {
    	if(this.checkMouse()){
    		if(this.tipo == "paint"){
    			currentTool = this.tipo;
    		}
    		else if(this.tipo == "erase"){
    			currentTool = this.tipo;
    		}
    		else if(this.tipo == "clear"){
    			createMiniCanvases();
    		}
    		else if(this.tipo == "stop"){

    			for (var i=0; i < sliders.length; i++) {
    				sliders[i].reset();    	
   				}
   				sliderX = 0;
   				sliderR = 0;
    			trainX = 0;
    			trainR = 0;
    		}
    		else if(this.tipo == "save"){
    			savingScore = true;    			
    		}
    		else if(this.tipo == "help"){
    			helpShow = !helpShow;
    		}
    		
    	}	
    }

}

function gotFile(file) {  	

	if (file.type === 'image') {    
		
		var imgDropped = createImg(file.data);		
		imgDropped.hide();

		var imgDroppedW = imgDropped.width;
		var imgDroppedH = imgDropped.height;				

		image(imgDropped, 0, 0, pg1.width, pg1.height);			
		img = get(0,0,imgDroppedW,imgDroppedH);
		
		pg1.image(img, 0, 0, pg1.width, pg1.height);

		pg0 = pg2 = pg1;

	} else {
		println('Not an image file!');
	}	
}





