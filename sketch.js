var trainX = 0;
var speedX = 5;
var sliderX;
var sliderR;

var pointXOld;
var mouseYOld;

var firstNode = false;
var jumpTest = false;
var jumpTestOld = false;

var W;
var H;

var cBg = 255;
var cLines = 0;
var cPlayer = "#FF0000";

var oscilators = [];
var oscilatorsFreq = [];
var polyNum = 5; 


function setup() {  	

	createCanvas(windowWidth, windowHeight);

	pg0 = createGraphics(windowWidth, windowHeight);
	pg1 = createGraphics(windowWidth, windowHeight);
	pg2 = createGraphics(windowWidth, windowHeight);

	pg1.background(cBg);
	//pg1.rect(0,0,windowWidth,windowHeight);
	pg0 = pg2 = pg1;

	pg1.strokeWeight(5);
	noFill();
	stroke(cLines)

	sliderX = createSlider(-6, 6, 0);
  	sliderX.position(10, 10);
  	sliderX.style('width', '80px');

  	sliderR = createSlider(-180, 180, 0);
  	sliderR.position(10, 30);
  	sliderR.style('width', '80px');


  	angleMode(DEGREES);

  

  	for (var i=0; i<polyNum; i++) {
    	oscilators.push(new Oscilador());
    	oscilatorsFreq[i] = 0;
    }
}

function draw() {  
	background(cBg);

	pg0 = pg2 = pg1;


	translate(windowWidth/2, windowHeight/2);
	rotate(sliderR.value());
	translate(-windowWidth/2, -windowHeight/2);

	image(pg0, -windowWidth + trainX, 0);
	image(pg1, 0 + trainX, 0);
	image(pg2, windowWidth + trainX, 0);	
  	
	if (mouseIsPressed){

		var pointX;		

		if(mouseX > trainX){
			pointX = mouseX - trainX;
			jumpTest = true;
		}
		else {
			pointX = windowWidth - trainX + mouseX;
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
		if(trainX < windowWidth) trainX += speedX;
		else trainX = 0;
	}
	if (sliderX.value() < 0){
		if(trainX > -windowWidth) trainX += speedX;
		else trainX = 0;
	}

	translate(windowWidth/2, windowHeight/2);
	rotate(-sliderR.value());
	translate(-windowWidth/2, -windowHeight/2);

	

	speedX = sliderX.value();

	//draw line
	stroke(255,0,0);
	line(windowWidth/2,0,windowWidth/2,windowHeight);
	stroke(cLines);
	//---

	//----SOUND

	var listenerImg = get(windowWidth/2 + 10, 0, 5, windowHeight);
	var pix;
	var safeWait = 0;
	var voiceNum = 0;

	for (var i=0; i<polyNum; i++) {
    	oscilatorsFreq[i] = 0;
    }

	for (var i = windowHeight; i > 0; i--){
		if(safeWait <= 0){
			pix = listenerImg.get(2,i);

			if(pix[1] == 0){
				safeWait = 100; //safe

				var f = windowHeight - i;
				oscFreq = ( 550 * f ) / windowHeight + 150;
				
				oscilatorsFreq[voiceNum] = oscFreq;
				voiceNum++;
				
			} 
		}
		else safeWait--;
		
	}

	for (var i = 0; i < polyNum; i++){
		oscilators[i].osc.freq(oscilatorsFreq[i]);

		console.log(i);
	}

	
	//oscilators[0].osc.freq(oscilatorsFreq[i]);
}

function mouseReleased() {
  firstNode = true;
}

// Oscilator Class
function Oscilador() {
    this.osc;
    this.freq = 220;
    this.oscOn = false;

    this.osc = new p5.SinOsc(220);
    this.osc.start();    
}



