var trainX = 0;
var speedX = 5;
var trainR = 0;
var speedR = 5;
var sliderX;
var sliderR;

var pointXOld;
var mouseYOld;

var firstNode = false;
var jumpTest = false;
var jumpTestOld = false;



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
var buttonsTypes = ["paint", "erase", "clear", "stop", "save", "load"];
var btnImg_paint;
var btnImg_erase;
var btnImg_clear;
var btnImg_stop;
var btnImg_save;
var btnImg_load;

var currentTool = "paint";


function setup() {  	

	createCanvas(windowWidth, windowHeight, "webgl");

	canvasWidth = windowWidth - uiWidth;
	canvasHeight = windowHeight;

	createMiniCanvases();

	sliderX = createSlider(-600, 600, 200);
  	sliderX.position(margen, margen);
  	sliderX.style('width', '60px');

  	sliderR = createSlider(-200, 200, 0);
  	sliderR.position(margen, margen*3);
  	sliderR.style('width', '60px');

  	angleMode(DEGREES);

  	btnImg_paint = loadImage("img/brush.png");
	btnImg_erase = loadImage("img/erase.png");
	btnImg_clear = loadImage("img/clear.png");
	btnImg_stop = loadImage("img/stop.png");
	btnImg_save = loadImage("img/save.png");
	btnImg_load = loadImage("img/brush.png");

  

  	for (var i=0; i<polyNum; i++) {
    	oscilators.push(new Oscilador());
    	oscilatorsFreq[i] = 0;
    }

    for (var i=0; i < buttonsTypes.length; i++) {
    	buttons.push(new Boton(margen, i * (buttonSize + margen) + 200, buttonsTypes[i]));    	
    }
}

function draw() {  
	background(cBg);

	pg0 = pg2 = pg1;


	translate(canvasWidth/2, canvasHeight/2);
	rotate(trainR);
	translate(-canvasWidth/2, -canvasHeight/2);

	image(pg0, -canvasWidth + trainX, 0);
	image(pg1, 0 + trainX, 0);
	image(pg2, canvasWidth + trainX, 0);

	
  	
	if (mouseIsPressed && mouseX > uiWidth){

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
	
	if(sliderX.value() > 0){
		if(trainX < canvasWidth) trainX += speedX;
		else trainX = 0;
	}
	if (sliderX.value() < 0){
		if(trainX > -canvasWidth) trainX += speedX;
		else trainX = 0;
	}

	if(sliderR.value() != 0){		
		trainR = trainR + sliderR.value()*0.01;
	}

	translate(canvasWidth/2, canvasHeight/2);
	rotate(-trainR);
	translate(-canvasWidth/2, -canvasHeight/2);	

	speedX = sliderX.value() * 0.01;

	//draw line
	strokeWeight(2);
	stroke(cPlayer);
	line(canvasWidth/2 + uiWidth,0,canvasWidth/2 + uiWidth,canvasHeight);
	stroke(cLines);
	//---

	//UI
	/*noStroke();
	fill(255);
	rect(0,0,uiWidth,windowHeight);*/

	for (var i=0; i < buttons.length; i++) {
    	buttons[i].display();    	
    }

	//----SOUND

	var listenerImg = get(canvasWidth/2 + uiWidth + 4, 0, 3, canvasHeight);
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
				safeWait = 40; //safe

				var f = canvasHeight - i;
				oscFreq = ( 550 * f ) / canvasHeight + 150;
				
				oscilatorsFreq[voiceNum] = oscFreq;
				voiceNum++;
				
			} 
		}
		else safeWait--;
		
	}

	for (var i = 0; i < polyNum; i++){
		oscilators[i].osc.freq(oscilatorsFreq[i]);

		/*if(oscilatorsFreq[i] == 0){
			oscilators[i].osc.amp(1, 0);
		}
		else{
			oscilators[i].osc.amp(1, 0);
		}*/
	}
	
	
}

function createMiniCanvases() {
	pg0 = createGraphics(canvasWidth, canvasHeight);
	pg1 = createGraphics(canvasWidth, canvasHeight);
	pg2 = createGraphics(canvasWidth, canvasHeight);

	pg1.background(cBg);
	pg1.stroke(220);
	for (var i=0; i < pg1.width; i+= 100){
		pg1.line(i, 0, i, canvasHeight);
	}
	pg1.stroke(200);
	for (var i=0; i < pg1.height; i+= 50){
		pg1.line(0, i, canvasWidth, i);
	}
	pg0 = pg2 = pg1;
}

function mousePressed() {
  	if(mouseX < uiWidth){
		for (var i=0; i < buttons.length; i++) {
	    	buttons[i].checkClick();    	
	    }
	}
}

function mouseReleased() {
  firstNode = true;
}

// Oscilator Class
function Oscilador() {
    this.osc;
    this.freq = 220;
    this.oscOn = false;

    this.osc = new p5.SqrOsc(220);
    this.osc.stop();    
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
    else if(this.tipo == "load") this.icon = btnImg_load;


    this.display = function() {
    	noStroke()
    	fill(0, 30);
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
    			sliderX.value(0);
    			sliderR.value(0);
    			trainX = 0;
    			trainR = 0;
    		}
    		else if(this.tipo == "save"){
    			saveCanvas("score","png");
    		}
    	}	
    }

}



