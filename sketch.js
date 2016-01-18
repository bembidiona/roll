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
var cPlayer = "#FF0000";
var cUIBg = 100;

var oscilators = [];
var oscilatorsFreq = [];
var polyNum = 4; 

var uiWidth = 80;
var margen = 10;

var canvasWidth;
var canvasHeight;


function setup() {  	

	createCanvas(windowWidth, windowHeight);

	canvasWidth = windowWidth - uiWidth;
	canvasHeight = windowHeight;

	pg0 = createGraphics(canvasWidth, canvasHeight);
	pg1 = createGraphics(canvasWidth, canvasHeight);
	pg2 = createGraphics(canvasWidth, canvasHeight);

	pg1.background(cBg);
	pg1.stroke(210);
	for (var i=0; i < pg1.width; i+= 100){
		pg1.line(i, 0, i, canvasHeight);
	}
	pg1.stroke(150);
	for (var i=0; i < pg1.height; i+= 50){
		pg1.line(0, i, canvasWidth, i);
	} 

	pg0 = pg2 = pg1;

	pg1.strokeWeight(4);
	pg1.noFill();
	pg1.stroke(cLines)

	sliderX = createSlider(-600, 600, 200);
  	sliderX.position(margen, margen);
  	sliderX.style('width', '60px');

  	sliderR = createSlider(-200, 200, 0);
  	sliderR.position(margen, margen*3);
  	sliderR.style('width', '60px');


  	angleMode(DEGREES);

  

  	for (var i=0; i<polyNum; i++) {
    	oscilators.push(new Oscilador());
    	oscilatorsFreq[i] = 0;
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
	stroke(255,0,0);
	line(canvasWidth/2 + uiWidth,0,canvasWidth/2 + uiWidth,canvasHeight);
	stroke(cLines);
	//---

	//UI
	noStroke();
	fill(cUIBg);
	rect(0,0,uiWidth,windowHeight);

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

	console.log(oscilatorsFreq);
	
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
    this.osc.start();    


    /*this.start = function() {
    	if(!this.oscOn){
    		oscOn = true;
    		this.osc.amp(1, 0);
    	}
    }

    this.stop = function() {
    	if(this.oscOn){
    		oscOn = false;
    		this.osc.amp(0, 0);
    	}
    }*/
}

function Boton() {
    this.x;
    this.y;
    this.w;
    this.h;
    this.tipo;

    this.osc = new p5.TriOsc(220);
    this.osc.start();    


    this.display = function() {
    	
    }

}



