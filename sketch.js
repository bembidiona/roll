var WEBGL = false;
var polyNum = 4; 

var appName = "r o l l "
var appVersion = "v0.1";

var trainX = 0;
var trainR = 0;
var maxX = 20;
var maxR = 5;
var sliderX = 0;
var sliderR = 0;
var sliderV;

var pointXOld;
var mouseYOld;

var firstNode = false;
var jumpTest = false;
var jumpTestOld = false;

var helpShow = false;

var cBg;
var cLines;
var cPlayer;
var cGrid;
var cBorder;
var cOver;


var oscilators = [];
var oscilatorsFreq = [];


var uiWidth = 80;
var margen = 10;


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
var btnImg_volume;
var btnImg_fullscreen;
var sliderSize = 90;

var collisionPoints = [];


var currentTool = "paint";


var savingScore = false;

var loadedScore;

var isDragging;
var justWarped = true;


var vibrato = 0;
var vibratoSpeed = 5;
var vibratoAmplitude = 100;
var vibratoOffset = 2;

var colorKey;

window.addEventListener("contextmenu", function(e) { e.preventDefault(); })

function setup() {  
	
	noSmooth();	

	c1 = color(0,0,0);
	c2 = color(85,255,255);
	c3 = color(255,85,255);
	c4 = color(255,255,255);

	cBg = c1;
	cLines = c2;
	cPlayer = c3;
	cGrid = c3;
	cBorder = c3;
	cOver = c3;
	cButtons = c4;

	colorKey = green(cLines);

	var c = createCanvas(windowWidth, windowHeight, WEBGL);
	/*if(WEBGL) c = createCanvas(windowWidth, windowHeight, "webgl");
	else c = createCanvas(windowWidth, windowHeight, "2d");*/
	c.drop(gotFile); 

	windowWidth = windowWidth;
	windowHeight = windowHeight;

	createMiniCanvases();

	
  	angleMode(RADIANS);

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
	btnImg_volume = loadImage("img/save.png");
	btnImg_fullscreen = loadImage("img/volume-high.png");

  

  	for (var i=0; i<polyNum; i++) {
    	oscilators.push(new Oscilador());
    	oscilatorsFreq[i] = 0;
    }

    for (var i=0; i < buttonsTypes.length; i++) {
    	if(i <= 4) buttons.push(new Boton(margen, i * (buttonSize + margen) + margen, buttonsTypes[i]));
    	else buttons.push(new Boton(margen, windowHeight - margen - buttonSize, buttonsTypes[i]));  	
    }
    buttons.push(new Boton(windowWidth - buttonSize - margen, margen, "fullscreen"));

    sliders.push(new Slider(margen, windowHeight - margen - buttonSize*2, false, "rtrain"));  	
    sliders.push(new Slider(margen + buttonSize, windowHeight - margen - buttonSize, true, "xtrain"));
    sliders.push(new Slider(windowWidth - margen - buttonSize, windowHeight - margen - buttonSize, false, "volume"));
     

    textFont('Consolas');

    ISaw = new Wad({
    	source : 'sawtooth',
    	tuna   : {
	        Compressor : {
		        threshold: 0.5,    //-100 to 0
			    makeupGain: 1,     //0 and up
			    attack: 1,         //0 to 1000
			    release: 0,        //0 to 3000
			    ratio: 4,          //1 to 20
			    knee: 5,           //0 to 40
			    automakeup: true,  //true/false
			    bypass: 0
		    }
	    }
    });

    

    
}

function draw() {  
	background(cBg);
	cursor(CROSS);

	push();
	translate(windowWidth/2, windowHeight/2);
	rotate(trainR);
	translate(-windowWidth/2, -windowHeight/2);

	//grid
	strokeWeight(0.2);
	stroke(cGrid);
	gridW = windowWidth/16;
	gridH = windowHeight/16;
	for (var i=-windowWidth; i < windowWidth*2; i+= gridW){
		line(i+trainX, -windowHeight, i+trainX, windowHeight*3);
	}
	stroke(cGrid);
	for (var i=-windowHeight; i < windowHeight*2; i+= gridH){
		line(-windowWidth, i, windowWidth*3, i);
	}
	strokeWeight(1);
	noFill();
	line(-windowWidth,-1,windowWidth*3,-1);
	line(-windowWidth,windowHeight+1,windowWidth*3,windowHeight+1);
	line(-windowWidth+trainX,0,-windowWidth+trainX,windowHeight);
	line(-1+trainX,0,-1+trainX,windowHeight);
	line(windowWidth+1+trainX,0,windowWidth+1+trainX,windowHeight);
	//---

	image(pg, -windowWidth + trainX, 0);
	image(pg, 0 + trainX, 0);
	image(pg, windowWidth + trainX, 0);

	pop();

	

	if (isDragging){

		if(currentTool == "paint"){
			pg.strokeWeight(3.5);
			pg.noFill();
			pg.stroke(cLines)
		}
		else if(currentTool == "erase"){
			pg.strokeWeight(50);
			pg.noFill();
			pg.stroke(cBg)
		}


		
		x = mouseX;
		y = mouseY;
		cx = windowWidth/2;
		cy = windowHeight/2;
        cos = Math.cos(trainR);
        sin = Math.sin(trainR);

        nx = (cos * (x - cx)) + (sin * (y - cy)) + cx;
        ny = (cos * (y - cy)) - (sin * (x - cx)) + cy;        

        if(sliderX > 0){
        	if(mouseX > trainX){
				nx = nx - trainX;
				jumpTest = true;
			}
			else {
				nx = windowWidth - trainX + nx;
				jumpTest = false;
			}	
        }
        else{
        	
        	if(mouseX < windowWidth + trainX){     
        		   		
				nx = nx - trainX;
				jumpTest = true;
			}
			else {
				nx = windowWidth - (windowWidth - nx);				
				jumpTest = false;
			}	
        }		



        pg.point(nx, ny);


		
        //fill spaces with lines
        if(justWarped){
			jumpTestOld = jumpTest;
			justWarped = false;	
		}

		if(firstNode){
			firstNode = false;
		}
		else if(jumpTest == jumpTestOld){
			pg.line(nx, ny, pointXOld, mouseYOld);
		}
		else {
			if(nx > pointXOld) {				
				pg.line(nx, ny, pg.width, getMiddleY());
				pg.line(pointXOld, mouseYOld, 0, getMiddleY());
			}
			else {				
				pg.line(nx, ny, 0, getMiddleY());
				pg.line(pointXOld, mouseYOld, pg.width, getMiddleY());
			}
		}
		///--------------		

		pointXOld = nx;
		mouseYOld = ny;
		jumpTestOld = jumpTest;
	}
	
	if(sliderX > 0){
		if(trainX < windowWidth) trainX += sliderX;
		else {
			trainX = 0;

			justWarped = true;
		}
	}
	if (sliderX < 0){
		if(trainX > -windowWidth) trainX += sliderX;
		else {
			trainX = 0;
			justWarped = true;
		}
	}

	if(sliderR != 0){		
		trainR = trainR + sliderR*0.01;
	}

	



	
	

	var listenerImg
	if(WEBGL) listenerImg = get(windowWidth/2, 0, 4, windowHeight);
	else listenerImg = get(windowWidth/2 - 2, 0, 4, windowHeight);

	//----SOUND

	
	var pix;
	var safeWait = 0;
	var voiceNum = 0;

	for (var i=0; i<polyNum; i++) {
    	oscilatorsFreq[i] = 0;
    }

	for (var i = windowHeight; i > 0; i--){
		if(safeWait <= 0){
			pix = listenerImg.get(2,i-1);

			if(pix[1] == colorKey){
				safeWait = 20; //safe

				var f = windowHeight - i;
				oscFreq = ( 550 * f ) / windowHeight + 150;
				oscFreq = map(f, 0, windowHeight, 20, 500);
				
				oscilatorsFreq[voiceNum] = oscFreq;
				voiceNum++;

				var lol = 14;
				fill(cButtons);
				noStroke();
				rect(windowWidth/2 - lol/2, i - lol/2, lol, lol);
				
				stroke(cButtons);
				strokeWeight(2);
				for (var j = 0; j < 10; j++) {
					lol = random(40) + 30;
					line(windowWidth/2, i, windowWidth/2 + random(lol) - lol/2, i + random(lol) - lol/2);
				};
			} 
		}
		else safeWait--;
		
	}


	/*vibrato += 0.5;
	var seno = Math.sin(vibrato);
	var ampy = map(seno,-1,1, 0.2, 0.8);*/
	
	
	var w = map(mouseX, 0, width, 0, 1);
  	w = constrain(w, 0, 1);
 	
	for (var i = 0; i < polyNum; i++){
		if(oscilatorsFreq[i] == 0){
			//oscilators[i].osc.amp(0);
			//oscilators[i].osc.setVolume(0.5)
		}
		else {
			//oscilators[i].osc.freq(oscilatorsFreq[i]);
			//oscilators[i].osc.amp(0.8);



			ISaw.play({
			    volume  : sliderV,
			    wait    : 0,     // Time in seconds between calling play() and actually triggering the note.
			    loop    : true, // This overrides the value for loop on the constructor, if it was set. 
			    pitch   : oscilatorsFreq[i],  // A4 is 440 hertz.
			    label   : 'A',   // A label that identifies this note.
		        env     : {      // This is the ADSR envelope.
			        attack  : 0.1,  // Time in seconds from onset to peak volume.  Common values for oscillators may range from 0.05 to 0.3.
			        decay   : 0.0,  // Time in seconds from peak volume to sustain volume.
			        sustain : 1.0,  // Sustain volume level. This is a percent of the peak volume, so sensible values are between 0 and 1.
			        hold    : 0.1, // Time in seconds to maintain the sustain volume level. If this is not set to a lower value, oscillators must be manually stopped by calling their stop() method.
			        release : 0.2     // Time in seconds from the end of the hold period to zero volume, or from calling stop() to zero volume.
			    },
			    //panning : [1, -1, 10],
			    //filter  : {frequency : 900}
			    //delay   : {delayTime : .8}
			})
			
			
		}

		//oscilators[i].osc.width(w);
	}
	


    var glitch = get(0,0,windowWidth,windowHeight);
    if (voiceNum == 0){
    	
    }
    else{
    	glitchOffset = voiceNum * 0.9 + 0.5;

    	/*blendMode(ADD);
    	tint(255,0,0);
    	image(glitch, random(glitchOffset*2) - glitchOffset,random(glitchOffset*2) - glitchOffset);*/
    	


	    blendMode(EXCLUSION);
	    image(glitch, random(glitchOffset*2) - glitchOffset,random(glitchOffset*2) - glitchOffset);
	    blendMode(ADD);
	    image(glitch, random(glitchOffset*2) - glitchOffset,random(glitchOffset*2) - glitchOffset);	   
    }
    

    //----------
	//------UI
	//------------
	blendMode(NORMAL);
	strokeWeight(2);
	stroke(cPlayer);
	line(windowWidth/2,0,windowWidth/2,windowHeight);
	stroke(cLines);
	
	for (var i=0; i < buttons.length; i++) {
		if(i <= 4) buttons[i].setPosition(margen, i * (buttonSize + margen) + margen);
		else if (i == 5) buttons[i].setPosition(margen, windowHeight - margen - buttonSize); 
		else buttons[i].setPosition(windowWidth - buttonSize - margen, margen);

    	buttons[i].display();    	
    }
    for (var i=0; i < sliders.length; i++) {
    	if(i == 0) sliders[i].setPosition(margen, windowHeight - margen - buttonSize*2);
    	else if(i == 1) sliders[i].setPosition(margen + buttonSize, windowHeight - margen - buttonSize);
    	else if(i == 2) sliders[i].setPosition(windowWidth - margen - buttonSize, windowHeight - margen - buttonSize);    	

    	sliders[i].display();    	
    } 
    


	//help
	if(helpShow){
    	var helpW = 390;
		var helpH = 274;
		var helpX = windowWidth/2 - helpW/2;
    	var helpY = windowHeight/2 - helpH/2;

    	textAlign(CENTER, CENTER);

    	stroke(cPlayer);
		fill(0);
		rect(helpX, helpY, helpW, helpH);

		comidilla = "  - - - - - - -  ";
		var txt1 = 
		comidilla + appName+" "+appVersion+comidilla+"\n"+
		" \n"+
		"HOW TO:\n"+
		"click 'n drag to paint different voices.\n"+
		"use eraser if you fuck up.\n"+
		"use clear canvas if you really fuck up.\n"+		
		"floppy to save, drop images to load.\n"+
		"drag sliders to give it swing, right-click to reset.\n"+
		" \n"+
		"KNOWN BUGS & WORKAROUNDS:\n"+
		"rotation and negative translation can break the paint accuracy, pause to reset matrix.\n"+
		"in firefox, to load an image, you have to drop it twice.\n"+
		" \n"+
		comidilla + "by jeremias babini" +comidilla
		;
		fill(cButtons);
		noStroke();
		text(txt1, helpX + helpW/2 +3, helpY + margen + 2, helpW - margen*2, helpX - margen*2);		
    }
    ///------------------
    println(helpShow);
	
	//save
	if(savingScore){
		image(pg, 0, 0,windowWidth, windowHeight);
		savingScore = false;
		save();	
	}
	
}

function toggleFullscreen() {
	var fs = fullScreen();
    fullScreen(!fs);
}

function getMiddleY() {
	if(mouseY > mouseYOld){
		return mouseYOld + (mouseY - mouseYOld)/2;
	}
	else if (mouseY < mouseYOld){
		return mouseY + (mouseYOld - mouseY)/2;	
	} 
	else return mouseY;	
}

function createMiniCanvases() {
	pg = createGraphics(windowWidth, windowHeight);
}

function isOnUI() {
	if (mouseX < uiWidth) return true;
	else if(mouseX < uiWidth + sliderSize + buttonSize && mouseY > windowHeight - buttonSize - margen) return true;
	else if(mouseX > windowWidth - buttonSize - margen && mouseY < buttonSize + margen) return true;
	else if(mouseX > windowWidth - buttonSize - margen && mouseY > windowHeight - buttonSize*3 - margen*2) return true;
	else return false;
}

function mousePressed() {
  	if(isOnUI()){
		for (var i=0; i < buttons.length; i++) {
	    	buttons[i].checkClick();    	
	    }
	    for (var i=0; i < sliders.length; i++) {
	    	sliders[i].checkClick();    	
	    }
	}
	else isDragging = true;

	return false;
}

function mouseReleased() {
  firstNode = true;
  isDragging = false;

    for (var i=0; i < sliders.length; i++) {
    	sliders[i].isBeingDragged = false;    	
    }
}

// Oscilator Class
function Oscilador() {
    this.osc;
    this.freq = 220;
    this.oscOn = false;

    //this.osc = new p5.Pulse(220);
    //this.osc.start();    
    this.osc = new Wad({source : 'sawtooth'})
}

function Slider(_x, _y, _isHorizontal, _tipo) {
    this.x = _x;
    this.y = _y; 
    this.w = buttonSize-1;
    this.h = buttonSize-1;
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

	this.setPosition = function(__x , __y) {
		
		if(this.isHorizontal){
	    	this.min = __x; 
	    	this.max = __x + sliderSize;

	    	this.y = __y;
	    }
	    else{
	    	if(this.min > __y) this.y -= this.min - __y;
	    	else if(__y > this.min) this.y += __y - this.min;

	    	this.min = __y; 
	    	this.max = __y - sliderSize;


	    	this.x = __x;
	    }
	}
	

	this.setValue = function(){
	 	value = 0;

	 	if(this.isHorizontal){
	 		value = ((this.x-this.min) * maxX) / sliderSize;
    			
			if (value < maxX/2) value = (maxX - value)*-1 + maxX/2;
			else if (value > maxX/2) value -= maxX/2;
			else value = 0;
	 	}
	 	else{
	 		value = ((this.y-this.min) * maxR) / sliderSize *-1;
    			
			if (value < maxR/2) value = (maxR - value)*-1 + maxR/2;
			else if (value > maxR/2) value -= maxR/2;
			else value = 0;
	 	}

	 	if(this.tipo == "rtrain") sliderR = value;
		else if(this.tipo == "xtrain") sliderX = value;
		else if(this.tipo == "volume") sliderV = map(value, -10,10,0.001,1);
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
	this.setValue();

	


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

    	stroke(cButtons);
    	strokeWeight(1);

    	if(this.isHorizontal){
    		line(this.min, this.y + this.h/2, this.min + this.w + sliderSize, this.y + this.h/2);
    	}
    	else{
    		line(this.x + this.w/2, this.min - sliderSize, this.x + this.w/2, this.min + this.h);	
    	}

    	if(this.checkMouse()) fill(cOver);
    	else fill(cBg);

    	rect(this.x, this.y, this.w, this.h);

    	image(this.icon, this.x + buttonSize/2 - this.icon.width/2, this.y + buttonSize/2 - this.icon.height/2);
    }

    this.checkMouse = function() {
    	if (this.x < mouseX && mouseX < this.x + this.w && this.y < mouseY && mouseY < this.y + this.h){
    		cursor(HAND);
    		return true;
    	}
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
    this.w = buttonSize-1;
    this.h = buttonSize-1;
    this.tipo = _tipo;   
    this.icon;

    if(this.tipo == "paint") this.icon = btnImg_paint;
    else if(this.tipo == "erase") this.icon = btnImg_erase;
    else if(this.tipo == "clear") this.icon = btnImg_clear;
	else if(this.tipo == "stop") this.icon = btnImg_stop;
	else if(this.tipo == "save") this.icon = btnImg_save;
	else if(this.tipo == "help") this.icon = btnImg_help;
	else if(this.tipo == "fullscreen") this.icon = btnImg_fullscreen;
	     
	this.setPosition = function(__x , __y) {
		this.x = __x;
		this.y = __y;
	}

    this.display = function() {
    	stroke(cButtons);
    	strokeWeight(1);
    	
    	if(this.checkMouse()) fill(cOver);
    	else noFill();

    	rect(this.x, this.y, this.w, this.h);

    	image(this.icon, this.x + buttonSize/2 - this.icon.width/2, this.y + buttonSize/2 - this.icon.height/2);
    }

    this.checkMouse = function() {
    	if (this.x < mouseX && mouseX < this.x + this.w && this.y < mouseY && mouseY < this.y + this.h) {
    		cursor(HAND);
    		return true;
    	}
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
    			for (var i=0; i < sliders.length; i++) {
    				sliders[i].reset();    	
   				}
   				sliderX = 0;
   				sliderR = 0;
    			trainX = 0;
    			trainR = 0;    			
    		}
    		else if(this.tipo == "stop"){

    			for (var i=0; i < sliders.length; i++) {
    				sliders[i].reset();    	
   				}
   				sliderX = 0;
   				sliderR = 0;    			
    		}
    		else if(this.tipo == "save"){
    			savingScore = true;    			
    		}
    		else if(this.tipo == "help"){
    			helpShow = !helpShow;
    		}
    		else if(this.tipo == "fullscreen"){
    			toggleFullscreen();
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

		image(imgDropped, 0, 0, pg.width, pg.height);			
		img = get(0,0,imgDroppedW,imgDroppedH);
		
		pg.image(img, 0, 0, pg.width, pg.height);

	} else {
		println('Not an image file!');
	}	
}

function windowResized() {
	print("MOOOOOOOOOOOOOOOOOOOOOOOOOOOOVE");
	createMiniCanvases();
	resizeCanvas(windowWidth, windowHeight);
	
	for (var i=0; i < sliders.length; i++) {
		sliders[i].reset();    	
	}
	sliderX = 0;
	sliderR = 0;
	trainX = 0;
	trainR = 0; 

    
	

}





