var appName = "r o l l "
var appVersion = "v0.2";

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

var helpShow = true;
var helpShowFirst = true;

var cBg;
var cLines;
var cPlayer;
var cGrid;
var cBorder;
var cOver;
var cSaw, cSine, cSquare, cTriangle;

var isRecording;

var oscilatorsFreq_saw = [];
var polyNum_saw; 
var oscilatorsFreq_sine = [];
var polyNum_sine;
var oscilatorsFreq_square = [];
var polyNum_square; 
var oscilatorsFreq_triangle = [];
var polyNum_triangle;


var uiWidth = 80;
var margen = 10;


var buttonSize = 40;
var buttons = [];
var sliders = [];

var isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;

var buttonsTypes = ["saw", "sine", "square", "triangle", "clear", "save", "record", "help", "stop"];
var btnImg_saw;
var btnImg_sine;
var btnImg_square;
var btnImg_triangle;
var btnImg_clear;
var btnImg_stop;
var btnImg_save;
var btnImg_help;
var btnImg_rtrain;
var btnImg_xtrain;
var btnImg_volume;
var btnImg_fullscreen;
var btnImg_record;
var sliderSize = 90;

var collisionPoints = [];

var pix;
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

var c;

window.addEventListener("contextmenu", function(e) { e.preventDefault(); })

var link;

var mixerTrack;

function setup() {  

	link = createA("http://www.jeremiasbabini.com","jeremias babini", "_blank");
	
	c1 = color(0,0,0);
	c2 = color(85,255,255);
	c3 = color(255,85,255);
	c4 = color(255,255,255);

	cSaw = color(85,255,255);
	cSine = color(1,255,1);
	cSquare = color(1,1,255);
	cTriangle = color(255,1,1);

	cBg = c1;
	cLines = cSaw;
	cPlayer = c3;
	cGrid = c3;
	cBorder = c3;
	cOver = c3;
	cButtons = c4;


	colorKey = green(cLines);

	c = createCanvas(windowWidth, windowHeight, false);	
	c.drop(gotFileHack); 

	windowWidth = windowWidth;
	windowHeight = windowHeight;

	createMiniCanvases();

	
  	angleMode(RADIANS);

  	btnImg_clear = loadImage("img/delete-forever.png");
	btnImg_stop = loadImage("img/pause.png");
	btnImg_save = loadImage("img/png.png");
	btnImg_record = loadImage("img/wav.png");		
	btnImg_help = loadImage("img/helpy.png");

	btnImg_rtrain = loadImage("img/cached.png");
	btnImg_xtrain = loadImage("img/code-tags.png");
	btnImg_volume = loadImage("img/volume-medium.png");
	btnImg_fullscreen = loadImage("img/fullscreen.png");

	btnImg_saw = loadImage("img/saw.png");
	btnImg_sine = loadImage("img/sine.png");
	btnImg_square = loadImage("img/square.png");	
	btnImg_triangle = loadImage("img/triangle.png");

  

  	

    for (var i=0; i < buttonsTypes.length; i++) {
    	if(i <= 6) buttons.push(new Boton(margen, i * (buttonSize + margen) + margen, buttonsTypes[i]));
    	else buttons.push(new Boton(margen, windowHeight - margen - buttonSize, buttonsTypes[i]));  	
    }
    buttons.push(new Boton(windowWidth - buttonSize - margen, margen, "fullscreen"));

    sliders.push(new Slider(margen, windowHeight - margen - buttonSize*2, false, "rtrain"));  	
    sliders.push(new Slider(margen + buttonSize, windowHeight - margen - buttonSize, true, "xtrain"));
    sliders.push(new Slider(windowWidth - margen - buttonSize, windowHeight - margen - buttonSize, false, "volume"));
     

    textFont('Consolas');

    ISaw = new Wad({
    	source : 'sawtooth'
    });

    ISine = new Wad({
    	source : 'sine'
    });
    ISquare = new Wad({
    	source : 'square'
    });

    ITriangle = new Wad({
    	source : 'triangle'    	
    });

    mixerTrack = new Wad.Poly({
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
	    },
		    recConfig : { // The Recorder configuration object. The only required property is 'workerPath'.
	        workerPath : '/lib/Recorderjs/recorderWorker.js' // The path to the Recorder.js web worker script.
	    }
	})
	mixerTrack.add(ISaw).add(ISine).add(ISquare).add(ITriangle);

    

    
}

function draw() {  


	background(cBg);
	cursor(CROSS);



	push();
	translate(windowWidth/2, windowHeight/2);
	rotate(trainR);
	translate(-windowWidth/2, -windowHeight/2);

	

	//grid	

	//blendMode(ADD);
	image(pg, -windowWidth + trainX, 0);
	image(pg, 0 + trainX, 0);
	image(pg, windowWidth + trainX, 0);
	//blendMode(NORMAL);

	
	var listenerImg = get(windowWidth/2 - 2, 0, 4, windowHeight);

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

	pop();

	//save
	if(savingScore){
		image(c, 0, 0,windowWidth, windowHeight);
		savingScore = false;
		save();	
	}	

	if (isDragging){

		if(currentTool == "paint" && mouseButton == LEFT){
			ellipseMode(CENTER);
			stroke(250);
			strokeWeight(1);
			noFill();
			ellipse(mouseX, mouseY, 10, 10);

			pg.strokeWeight(3.5);
			pg.noFill();
			pg.stroke(cLines)
		}
		else {
			ellipseMode(CENTER);
			stroke(250);
			strokeWeight(1);
			noFill();
			ellipse(mouseX, mouseY, 50, 50);

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
				nx = windowWidth - (nx + trainX) + (windowWidth/2 - trainX*-1)*2;				
				nx = windowWidth - nx;
				jumpTest = false;
				
			}	
        }		



        //pg.point(nx, ny);


		
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

	



	
	

	

	//----SOUND
	
	
	var pix;
	var safeWait = 0;

	var voiceNum_saw = 0;
	for (var i=0; i<polyNum_saw; i++) {
    	oscilatorsFreq_saw[i] = 0;
    }
    polyNum_saw = 0;

    var voiceNum_sine = 0;
	for (var i=0; i<polyNum_sine; i++) {
    	oscilatorsFreq_sine[i] = 0;
    }
    polyNum_sine = 0;

    var voiceNum_square = 0;
	for (var i=0; i<polyNum_square; i++) {
    	oscilatorsFreq_square[i] = 0;
    }
    polyNum_square = 0;

    var voiceNum_triangle = 0;
	for (var i=0; i<polyNum_triangle; i++) {
    	oscilatorsFreq_triangle[i] = 0;
    }
    polyNum_triangle = 0;

	for (var i = windowHeight; i > 0; i--){
		if(safeWait <= 0){
			pix = listenerImg.get(2,i-1);
			pixR = pix[0];
			pixG = pix[1];
			pixB = pix[2];

			if(pixR == 255 || pixG == 255 || pixB == 255){
				safeWait = 20; //safe				

				var f = windowHeight - i;
				oscFreq = ( 550 * f ) / windowHeight + 150;
				oscFreq = map(f, 0, windowHeight, 20, 500);
				
				if(checkColor(pixR, pixG, pixB, cSaw)){
					polyNum_saw++;
					oscilatorsFreq_saw[voiceNum_saw] = oscFreq;
					voiceNum_saw++;	
				}
				else if(checkColor(pixR, pixG, pixB, cSine)){
					polyNum_sine++;
					oscilatorsFreq_sine[voiceNum_sine] = oscFreq;
					voiceNum_sine++;	
				}
				else if(checkColor(pixR, pixG, pixB, cSquare)){
					polyNum_square++;
					oscilatorsFreq_square[voiceNum_square] = oscFreq;
					voiceNum_square++;	
				}
				else if(checkColor(pixR, pixG, pixB, cTriangle)){
					polyNum_triangle++;
					oscilatorsFreq_triangle[voiceNum_triangle] = oscFreq;
					voiceNum_triangle++;	
				}

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
 	
	for (var i = 0; i < polyNum_saw; i++){
		if(oscilatorsFreq_saw[i] == 0){
		}
		else {
			ISaw.play({
			    volume  : sliderV * 0.8,
			    wait    : 0,     // Time in seconds between calling play() and actually triggering the note.
			    loop    : true, // This overrides the value for loop on the constructor, if it was set. 
			    pitch   : oscilatorsFreq_saw[i],  // A4 is 440 hertz.
			    //label   : 'A',   // A label that identifies this note.
		        env     : {      // This is the ADSR envelope.
			        attack  : 0.1,  // Time in seconds from onset to peak volume.  Common values for oscillators may range from 0.05 to 0.3.
			        decay   : 0.0,  // Time in seconds from peak volume to sustain volume.
			        sustain : 1.0,  // Sustain volume level. This is a percent of the peak volume, so sensible values are between 0 and 1.
			        hold    : 0.1, // Time in seconds to maintain the sustain volume level. If this is not set to a lower value, oscillators must be manually stopped by calling their stop() method.
			        release : 0.4     // Time in seconds from the end of the hold period to zero volume, or from calling stop() to zero volume.
			    },
			    //panning : [1, -1, 10],
			    //filter  : {frequency : 900}
			    //delay   : {delayTime : .8}
			})		
		}
	}

	for (var i = 0; i < polyNum_sine; i++){
		if(oscilatorsFreq_sine[i] == 0){
		}
		else {
			ISine.play({
			    volume  : sliderV,
			    wait    : 0,     // Time in seconds between calling play() and actually triggering the note.
			    loop    : true, // This overrides the value for loop on the constructor, if it was set. 
			    pitch   : oscilatorsFreq_sine[i],  // A4 is 440 hertz.
		        env     : {      // This is the ADSR envelope.
			        attack  : 0.1,  // Time in seconds from onset to peak volume.  Common values for oscillators may range from 0.05 to 0.3.
			        decay   : 0.0,  // Time in seconds from peak volume to sustain volume.
			        sustain : 1.0,  // Sustain volume level. This is a percent of the peak volume, so sensible values are between 0 and 1.
			        hold    : 0.1, // Time in seconds to maintain the sustain volume level. If this is not set to a lower value, oscillators must be manually stopped by calling their stop() method.
			        release : 0.4     // Time in seconds from the end of the hold period to zero volume, or from calling stop() to zero volume.
			    },
			})		
		}
	}
	for (var i = 0; i < polyNum_square; i++){
		if(oscilatorsFreq_square[i] == 0){
		}
		else {
			ISquare.play({
			    volume  : sliderV * 0.6,
			    wait    : 0,     // Time in seconds between calling play() and actually triggering the note.
			    loop    : true, // This overrides the value for loop on the constructor, if it was set. 
			    pitch   : oscilatorsFreq_square[i] + 440,  // A4 is 440 hertz.
		        env     : {      // This is the ADSR envelope.
			        attack  : 0.1,  // Time in seconds from onset to peak volume.  Common values for oscillators may range from 0.05 to 0.3.
			        decay   : 0.0,  // Time in seconds from peak volume to sustain volume.
			        sustain : 1.0,  // Sustain volume level. This is a percent of the peak volume, so sensible values are between 0 and 1.
			        hold    : 0.1, // Time in seconds to maintain the sustain volume level. If this is not set to a lower value, oscillators must be manually stopped by calling their stop() method.
			        release : 0.4     // Time in seconds from the end of the hold period to zero volume, or from calling stop() to zero volume.
			    },
			})		
		}
	}
	for (var i = 0; i < polyNum_triangle; i++){
		if(oscilatorsFreq_triangle[i] == 0){
		}
		else {
			ITriangle.play({
			    volume  : sliderV * 0.7,
			    wait    : 0,     // Time in seconds between calling play() and actually triggering the note.
			    loop    : true, // This overrides the value for loop on the constructor, if it was set. 
			    pitch   : oscilatorsFreq_triangle[i] + 440,  // A4 is 440 hertz.
		        env     : {      // This is the ADSR envelope.
			        attack  : 0.1,  // Time in seconds from onset to peak volume.  Common values for oscillators may range from 0.05 to 0.3.
			        decay   : 0.0,  // Time in seconds from peak volume to sustain volume.
			        sustain : 1.0,  // Sustain volume level. This is a percent of the peak volume, so sensible values are between 0 and 1.
			        hold    : 0.1, // Time in seconds to maintain the sustain volume level. If this is not set to a lower value, oscillators must be manually stopped by calling their stop() method.
			        release : 0.4     // Time in seconds from the end of the hold period to zero volume, or from calling stop() to zero volume.
			    },
			})		
		}
	}
	//---------------------

	

    var glitch = get(0,0,windowWidth,windowHeight);
    if (voiceNum_saw == 0){
    	
    }
    else{
    	glitchOffset = voiceNum_saw * 0.9 + 0.5;

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

	//help
	if(helpShow){
    	var helpW = 390;
		var helpH = 228;
		var helpX = windowWidth/2 - helpW/2;
    	var helpY = windowHeight/2 - helpH/2;

    	textAlign(CENTER, CENTER);

    	stroke(cPlayer);
		fill(0);
		rect(helpX, helpY, helpW, helpH);

		var txt1 = 
		" ┌ - - - - - - - -  " + appName+" "+appVersion+"  - - - - - - - - ┐ "+"\n"+		
		" \n"+
		"WUT:\n"+
		"visual composer/performer for basic oscilators.\n"+
		"slightly inspired by the mythic UPIC by Xenakis.\n"+
		"tested on Chrome.\n"+
		" \n"+
		"HOW:\n"+		
		"left click 'n drag to paint different voices.\n"+
		"drag bottom-left sliders to give it swing.\n"+	
		"right click 'n drag to erase.\n"+				
		" \n"+		
		" └ - - - - - - -  " + "by jeremias babini" + "  - - - - - - - ┘ "
		;
		fill(cButtons);
		noStroke();
		text(txt1, helpX + helpW/2 +3, helpY + margen + 2, helpW - margen*2, helpX - margen*2);	

		link.position(helpX + helpW/2 - 40, helpY + helpH - 32);
		link.show();		
    }
    else {
    	link.hide();
    }
    ///------------------
	
	for (var i=0; i < buttons.length; i++) {
		if(i <= 3) buttons[i].setPosition(margen, i * (buttonSize + margen) + margen);
		else if(i <= 7) buttons[i].setPosition(windowWidth - buttonSize - margen, (i - 3)* (buttonSize + margen) + margen);
		else if (i == 8) buttons[i].setPosition(margen, windowHeight - margen - buttonSize); 
		else if (i == 9) buttons[i].setPosition(windowWidth - buttonSize - margen, margen);

    	buttons[i].display();    	    	 	
    }
    for (var i=0; i < sliders.length; i++) {
    	if(i == 0) sliders[i].setPosition(margen, windowHeight - margen - buttonSize*2);
    	else if(i == 1) sliders[i].setPosition(margen + buttonSize, windowHeight - margen - buttonSize);
    	else if(i == 2) sliders[i].setPosition(windowWidth - margen - buttonSize, windowHeight - margen - buttonSize);    	

    	sliders[i].display(); 
    }
	
}

function checkColor(_r, _g, _b, _color){
	_red = false;
	_green = false;
	_blue = false;

	changui = 10;

	if(abs(_r - red(_color)) < changui) _red = true;
	if(abs(_g - green(_color)) < changui) _green = true;
	if(abs(_b - blue(_color)) < changui) _blue = true;	

	if(_red && _green && _blue) return true;
	else return false;
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
	else if(mouseX < uiWidth + sliderSize + buttonSize && mouseY > windowHeight - buttonSize - margen) return true; //downslider
	else if(mouseX > windowWidth - buttonSize - margen && mouseY < (buttonSize + margen)*5) return true; //right buttons
	else if(mouseX > windowWidth - buttonSize - margen && mouseY > windowHeight - buttonSize*4 - margen*2) return true;
	else return false;
}

function mousePressed() {
	if(helpShowFirst) {		
		var helpW = 390;
		var helpH = 225;
		if (mouseX > windowWidth/2 - helpW/2 && mouseX < windowWidth/2 + helpW/2){
			if (mouseY > windowHeight/2 - helpH/2 && mouseY < windowHeight/2 + helpH/2){
				return;
			}
		}
		
		helpShowFirst = false;
		helpShow = false;
	}

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

    volumeExtra = 37;

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
	else if(this.tipo == "volume") this.icon = btnImg_volume;

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
	    	this.max = __y - sliderSize - volumeExtra;


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
		else if(this.tipo == "xtrain") sliderX = map(value, -10,10,10,-10);
		else if(this.tipo == "volume") sliderV = map(value, -2.5,4.55,0.001,1);		
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
	if(this.tipo == "xtrain") this.x -= sliderSize/6; 
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

    		if (this.tipo == "volume") line(this.x + this.w/2, this.min - sliderSize - volumeExtra, this.x + this.w/2, this.min + this.h);
    	}

    	if(this.checkMouse()) fill(cOver);
    	else fill(cBg);

    	rect(this.x, this.y, this.w, this.h);

    	image(this.icon, this.x + buttonSize/2 - this.icon.width/2, this.y + buttonSize/2 - this.icon.height/2);


    	if(helpShow){
    		textAlign(LEFT, CENTER);
    		noStroke();
	    	fill(cGrid);
	    	fix = 3;
	    	if(this.tipo == "rtrain") text("\n set rotation \n and traslation \n of the canvas", buttonSize + margen + 15, windowHeight - 120);
	    	//if(this.tipo == "rtrain") text("set rotation", this.x + buttonSize + margen, this.y + buttonSize/2 + fix);	    
	    	//else if(this.tipo == "xtrain") text("set translation", this.x + buttonSize + margen, this.y + buttonSize - 6);	    
			if(this.tipo == "volume") {textAlign(RIGHT, CENTER);; text("set volume", this.x, this.y + buttonSize/2 + fix);}
    	} 
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
    		if(mouseButton == LEFT){
	    		this.isBeingDragged = true;	

	    		if (this.isHorizontal) this.grabPoint = mouseX - this.x;
	    		else this.grabPoint = mouseY - this.y; 	
    		}
    		else {
	    		this.reset();
    		}
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

    if(this.tipo == "clear") this.icon = btnImg_clear;
	else if(this.tipo == "stop") this.icon = btnImg_stop;
	else if(this.tipo == "save") this.icon = btnImg_save;
	else if(this.tipo == "record") this.icon = btnImg_record;
	else if(this.tipo == "help") this.icon = btnImg_help;
	else if(this.tipo == "fullscreen") this.icon = btnImg_fullscreen;
	else if(this.tipo == "saw") this.icon = btnImg_saw;
	else if(this.tipo == "sine") this.icon = btnImg_sine;
	else if(this.tipo == "square") this.icon = btnImg_square;
	else if(this.tipo == "triangle") this.icon = btnImg_triangle;
	else this.icon = btnImg_fullscreen;
	     
	this.setPosition = function(__x , __y) {
		this.x = __x;
		this.y = __y;
	}

    this.display = function() {
    	stroke(cButtons);
    	strokeWeight(1);
    	
    	if(this.checkMouse()){
    		if(this.tipo == "saw") fill(cSaw);
		    else if(this.tipo == "sine") fill(cSine);
		    else if(this.tipo == "square") fill(cSquare);
			else if(this.tipo == "triangle") fill(cTriangle);
		    else fill(cOver);	
    	} 
    	else noFill();

    	rect(this.x, this.y, this.w, this.h);

    	image(this.icon, this.x + buttonSize/2 - this.icon.width/2, this.y + buttonSize/2 - this.icon.height/2);

    	if(this.tipo == "record"){
    		if(isRecording){
    			stroke(255,0,0);
    			rect(this.x, this.y, this.w, this.h);	
    		}    		
    	}

    	if(helpShow){
    		textAlign(LEFT, CENTER);
    		noStroke();
	    	fill(cGrid);
	    	fix = 3;
	    	if(this.tipo == "paint") text("paint voices", this.x + buttonSize + margen, this.y + buttonSize/2 + fix);
		    else if(this.tipo == "erase") text("erase tool", this.x + buttonSize + margen, this.y + buttonSize/2 +fix);		    
			else if(this.tipo == "stop") ;//text("paint", this.x + buttonSize + margen, this.y + buttonSize/2);
			else if(this.tipo == "saw") text("saw", this.x + buttonSize + margen, this.y + buttonSize/2 + fix);
			else if(this.tipo == "sine") text("sine", this.x + buttonSize + margen, this.y + buttonSize/2 + fix);
			else if(this.tipo == "square") text("square", this.x + buttonSize + margen, this.y + buttonSize/2 + fix);
			else if(this.tipo == "triangle") text("triangle", this.x + buttonSize + margen, this.y + buttonSize/2 + fix);
			
			textAlign(RIGHT, CENTER);
			if(this.tipo == "clear") text("new canvas", this.x, this.y + buttonSize/2+fix);
			else if(this.tipo == "save") text("\n save canvas\n [drop .png to load]", this.x, this.y + buttonSize/2 - 21);
			else if(this.tipo == "record") text("record/export audio", this.x, this.y + buttonSize/2 +fix);
			else if(this.tipo == "help") text("help/about", this.x, this.y + buttonSize/2+fix);
			else if(this.tipo == "fullscreen") text("go fullscreen", this.x, this.y + buttonSize/2+fix);
    	}    	
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
    		else if(this.tipo == "record"){
    			if(isRecording){
    				//stop and export
    				isRecording = false;
    				mixerTrack.rec.stop();
    				mixerTrack.rec.exportWAV(function(blob){  		 
				    	mixerTrack.rec.clear();
					    Recorder.forceDownload(blob, "roll-output.wav");	    
						}
					);
    			}
    			else{
    				//start recording
    				isRecording = true;
    				mixerTrack.rec.record();
    			}    			    			
    		}
    		else if(this.tipo == "help"){
    			helpShow = !helpShow;
    		}
    		else if(this.tipo == "fullscreen"){
    			toggleFullscreen();
    		}
    		else if(this.tipo == "saw") cLines = cSaw;
		    else if(this.tipo == "sine") cLines = cSine;
		    else if(this.tipo == "square") cLines = cSquare;
			else if(this.tipo == "triangle") cLines = cTriangle;
    		
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
function gotFileHack(file){
	fuckingFirefoxFile = file;
	if(isFirefox){
		setTimeout(function() {gotFile(fuckingFirefoxFile) ;}, 100);
		if(!imgExist) setTimeout(function() {gotFile(fuckingFirefoxFile) ;}, 200);
	}

	gotFile(file);	 
}

function windowResized() {	
	//createMiniCanvases();
	resizeCanvas(windowWidth, windowHeight);

	textFont('Consolas');
	
	for (var i=0; i < sliders.length; i++) {
		sliders[i].reset();    	
	}
	sliderX = 0;
	sliderR = 0;
	trainX = 0;
	trainR = 0; 
}

function keyPressed() {
  /*if (keyCode === LEFT_ARROW) {
    mixerTrack.rec.record();
    print("record");
  }
  else if (keyCode === RIGHT_ARROW) {
    mixerTrack.rec.stop();
    print("stop");
  }
  else if (keyCode === UP_ARROW) {
  	print("save");
  	mixerTrack.rec.exportWAV(function(blob){  		 
    	mixerTrack.rec.clear();
	    Recorder.forceDownload(blob, "filename.wav");	    
	});   
  }
  else if (keyCode === DOWN_ARROW) {
    cLines = cTriangle;
  }*/
}



