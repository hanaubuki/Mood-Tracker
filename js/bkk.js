let containerDiv = "bkkContainer";
let svg = null;


let bkkSketch = function(p) {

let spikeSlider;
let complexitySlider;
let noiseSlider;
let colourPicker;
let container;
let controls;
let canvas;
let spikeGrowth = 0.6;
let rot_target=0;
let rot_current=0;
let rot_ease=1;
let rot_speed = 1;
let rot_amount = 20;
let rotateCount = 0;
// to save the two canvases
let p2d;
let resized = false;

let debugCounter = 0


let spikeVal; 
let complexityVal;
let noiseVal;
let smoothVal;
let moveVal;
let colourVal;   

let lerpSlider;
let lerpMode = false;
let lerpSpike
let lerpComplexity
let lerpNoise
let lerpSmooth
let lerpMove
let lerpColour

let rotateDir=1;  


let maxVol = 0.9;
let pitch = 100;

let anim_changeList = [];
let anim_timeList = [];
let anim_pauseList = [];
let anim_on = false;
let fixed_display_on = false;
let anim_changing = true;
let anim_timer = 0;
let anim_time_next = 0;
let anim_phase = 0;


const defaultColour = "#f64f8cff"

let screenDim = 450
let bbkkSize = screenDim/3;
let minSpikeSize = bbkkSize/2.3;
let eyeHeight = bbkkSize/2.5;
let eyeWidth = eyeHeight*0.6;
let pupilSize = eyeHeight/3;
let eyeSpace = eyeWidth*0.5;

const maxSpikes = 14 / 2 ;
const minspikes = 4 / 2;
const maxNoise = 45


const minPitch = 100;
const maxPitch = 1280;
const freqScaleGradient = 0.3;
const minSmooth = 0.22;
const maxSmooth = 0.8;
const linCurveThreshold = 0.1;
const min_rot_speed = 0;
const max_rot_speed = 10;
const min_rot_amount = 60;
const max_rot_amount = 60;

p.postSetupCallback = null;
p.drawEyes = true;
p.drawOutline = true;


  //  We use a p5 svg renderer library, and two kinds of
  // Canvas. The secondre
  p.setup = function(){
    if(p.type==="SVG"){
      canvas = p.createCanvas(screenDim, screenDim, p.SVG);  
      // p.noLoop(); 
    } else {
      canvas = p.createCanvas(screenDim, screenDim, p.P2D);      
    }

    p.background(0);
    controls = document.getElementById('controls');
    spikeSlider = document.getElementById('spikiness');
    complexitySlider = document.getElementById('complexity');
    noiseSlider = document.getElementById('noise');
    smoothSlider = document.getElementById('smooth');
    moveSlider = document.getElementById('move_amount');
    colourPicker = document.getElementById('colourPicker');
    soundOn = document.getElementById("soundOn");
    // nameInput = document.getElementById("bkkname");
    moodInput = document.getElementById("bkkmood");


    // env = new p5.Envelope(0.1, 1, 1.5, 0);
    // env.setInput(osc);

    if(p.postSetupCallback!= null){
      p.postSetupCallback();
    }

  }


  p.draw = function(){

    if(resized){
    }
    // just a nice number that works
    // reseed every time so we always get the same noise
    p.noiseSeed(199)

    // animation
    if(anim_on){
      // # find smallest length of the three lists (in case of uneven lists)
      lengths = [anim_changeList.length, anim_timeList.length, anim_pauseList.length]
      let animPhaseCount = Math.min.apply(null, lengths)

      //  handle timer
      anim_timer +=1
      if(anim_timer >= anim_time_next){
        anim_timer = 0;
        if(!anim_changing){
          anim_phase+=1
        }
        anim_changing = !anim_changing;
      }
      //  wrap anim phase inside length of list
      if(anim_phase >= animPhaseCount){
        anim_phase=0;
      }

      // Get the details of the current change
      let framerate = 60;
      if(anim_changing == true){
        anim_time_next = anim_timeList[anim_phase] * framerate;
      } else {
        anim_time_next = anim_pauseList[anim_phase] * framerate;
      }
      let params_next = anim_changeList[anim_phase];
      let params_this;
      if(anim_phase>0){
         params_this = anim_changeList[anim_phase-1]
      } else {
        params_this = anim_changeList[animPhaseCount-1]
      }

      if(anim_changing){
        let ph =   anim_timer / anim_time_next;
        spikeVal =      p.lerp(params_this["spikiness"] , 
                               params_next["spikiness"], ph)
        complexityVal = p.lerp(params_this["count"] , 
                               params_next["count"], ph)
        noiseVal =      p.lerp(params_this["noise"] , 
                               params_next["noise"], ph)
        smoothVal =     p.lerp(params_this["smooth"] , 
                               params_next["smooth"], ph)
        moveVal =       p.lerp(params_this["move"] , 
                               params_next["move"], ph)   
                                     
        c1 = p.color(params_this["colour"])
        c2 = p.color(params_next["colour"])
        colourVal = p.lerpColor(c1,c2,ph) 
      }
    } else if(fixed_display_on){
      // do nothing

    } else if(lerpMode){
      spikeVal =      p.map(lerpSlider.value, 0, 255, lerpSpike[0], lerpSpike[1]);
      complexityVal = p.map(lerpSlider.value, 0, 255, lerpComplexity[0], lerpComplexity[1]);
      noiseVal =      p.map(lerpSlider.value, 0, 255, lerpNoise[0], lerpNoise[1]);
      smoothVal =     p.map(lerpSlider.value, 0, 255, lerpSmooth[0], lerpSmooth[1]);
      moveVal =       p.map(lerpSlider.value, 0, 255, lerpMove[0], lerpMove[1]);
      let c1 = p.color(lerpColour[0])
      let c2 = p.color(lerpColour[1])
      colourVal =     p.lerpColor(c1, c2,p.map(lerpSlider.value, 0, 255, 0, 1));

    }else {
      // Interactive operation - get control values
      spikeVal = spikeSlider.value
      complexityVal = complexitySlider.value
      noiseVal = noiseSlider.value
      smoothVal = smoothSlider.value
      moveVal = moveSlider.value
      colourVal = colourPicker.value
    }


    // Get Inputs
    let spikiness = p.map(spikeVal, 0, 255,0, minSpikeSize );
    let complexity = Math.floor(p.map(complexityVal, 0, 255, minspikes, maxSpikes)) * 2;
    nTemp = 1-p.map(noiseVal, 0,255, 0.0,1.0);
    let noise =(1-(nTemp*nTemp))*maxNoise;
    let smooth = p.map(smoothVal, 0, 255,0, 1);
    let rot = p.map(moveVal, 0, 255, 0, 1);

    rot *= rot;
    rot_speed = p.map(rot, 0, 1, min_rot_speed, max_rot_speed);
    rot_amount = p.map(rot, 0, 1, min_rot_amount, max_rot_amount);


    // Draw
    p.background(255);       
    p.push();
      p.fill(colourVal);
      //  Start at the centre of the screen
      p.translate(p.width * 0.5, p.height * 0.5);

      // Movement
      if(rot_target>rot_amount){
        rotateDir = -1;
        rotateCount++;
        envTriggered = false;
      } else if(rot_target< -rot_amount){
        rotateDir = 1;
        envTriggered = false;
      }
      rot_target += (rotateDir*rot_speed);
      rot_diff =  rot_target-rot_current;
      rot_current += (rot_diff * rot_ease);

      p.rotate(rot_current / 200.0);


      // you might want to change the width of the outline
      p.strokeWeight( p.drawOutline ? 0.5 : 0)

      bbkk(0, 0, bbkkSize-spikiness, bbkkSize+(spikiness*spikeGrowth), complexity,noise, smooth,false);
      
      // debug
      // p.stroke('purple'); // Change the color
      // p.strokeWeight(10); // Make the points 10 pixels in 
      // bbkk(0, 0, bbkkSize-spikiness, bbkkSize+spikiness, complexity,noise, smooth,true);

      //  EYES
      if(p.drawEyes){
        p.push()
          p.strokeWeight(2.5)
          p.fill("white")
          p.rotate(-0.1);        
          p.ellipse(-eyeSpace, -eyeSpace*0.99, eyeWidth, eyeHeight)
          p.fill("black")        
          p.ellipse(-eyeSpace, -eyeSpace*0.94, pupilSize*0.35, pupilSize)

          p.rotate(0.11);
          p.fill("white")        
          p.ellipse(eyeSpace, -eyeSpace*0.99, eyeWidth, eyeHeight)
          p.fill("black")     
          p.ellipse(eyeSpace, -eyeSpace*0.94, pupilSize*0.35, pupilSize)        
        p.pop()
      }

    p.pop();
  }



  function bbkk(x, y, radius1, radius2, npoints, noisiness, smoothness, debug, outline=true) {
    let angle = p.TWO_PI / npoints;
    let halfAngle = angle * 0.5;
    let controlAngle = angle * p.map(smoothness,0,1,0.15,0.25);
    let radiusMid = radius1+((radius2-radius1)*p.map(smoothness,0,1,0.4,0.8));

    if(debug==false){p.beginShape();}

    //  Guide point, before the curve
    if((smoothness>=linCurveThreshold)  ){
      let controlPoint1X = x + p.cos(p.TWO_PI-controlAngle) * radiusMid;
      let controlPoint1Y = mid2Y = y + p.sin(p.TWO_PI-controlAngle) * radiusMid;
      let controlPoint2X, controlPoint2Y, controlPoint3X, controlPoint3Y;
      p.curveVertex(controlPoint1X, controlPoint1Y);
    }         

    // for (let a = 0, j=0; a < p.TWO_PI; a += angle, j++) {
    for (let a = 0, j=0; j < npoints; a += angle, j++) {

      innerX = (x + p.cos(a) * radius1);
      innerY = (y + p.sin(a) * radius1);
      innerX += (p.noise(innerX,innerY) * noisiness) - noisiness/2;
      innerY += (p.noise(innerX,innerY+5) * noisiness) - noisiness/2;

      mid1X = x + p.cos((a + halfAngle) - controlAngle) * radiusMid;
      mid1Y = y + p.sin((a + halfAngle) - controlAngle) * radiusMid;

    if((smoothness>= linCurveThreshold) && a==0){
      controlPoint2X = innerX;
      controlPoint2Y = innerY;
      controlPoint3X = mid1X;
      controlPoint3Y = mid1Y;
    }

      outerX = x + p.cos(a + halfAngle) * radius2;
      outerY = y + p.sin(a + halfAngle) * radius2;
      outerX += (p.noise(outerX,outerY) * noisiness) - noisiness/2;
      outerY += (p.noise(outerX,outerY+5) * noisiness) - noisiness/2;

      mid2X = x + p.cos(a + controlAngle+halfAngle) * radiusMid;
      mid2Y = y + p.sin(a + controlAngle+halfAngle) * radiusMid;


      points = [[innerX, innerY], [mid1X,mid1Y], [outerX, outerY], [mid2X,mid2Y]]

      for(let i=0;i<4;i++){
        if(debug){
          p.text(i+j*4, points[i][0], points[i][1]);            
        }else {        
          if((smoothness<linCurveThreshold)  ){
            p.vertex(points[i][0], points[i][1]);              
          } else {
            p.curveVertex(points[i][0], points[i][1]);
          }            
        }
      }

    }
    // control point after the curve
    if((smoothness>=linCurveThreshold)  ){
      p.curveVertex(controlPoint2X, controlPoint2Y);
      p.curveVertex(controlPoint3X, controlPoint3Y);
      if(debug==false){p.endShape();}
    } else {      
    if(debug==false){p.endShape(p.CLOSE);}

    }

    
  }

  p.save_canvas = function() {
    p.draw();

  }





p.setBKKSize = function (size){
  screenDim = size;
  bbkkSize = screenDim/3;
  minSpikeSize = bbkkSize/2.3;
  eyeHeight = bbkkSize/2.5;
  eyeWidth = eyeHeight*0.6;
  pupilSize = eyeHeight/3;
  eyeSpace = eyeWidth*0.5
  resized = true;  
}



p.save_canvas_as_svg = function (){
  svg.save_canvas();
  svgData = document.getElementById(containerDiv).firstElementChild.innerHTML;
  return svgData;
}

p.set_form_update_event = function (callback){
  spikeSlider.addEventListener('mouseup', callback);
  complexitySlider.addEventListener('mouseup', callback);
  noiseSlider.addEventListener('mouseup', callback);
  smoothSlider.addEventListener('mouseup', callback);
  moveSlider.addEventListener('mouseup', callback);
  colourPicker.addEventListener('change', callback);
}


p.set_params = function (pSet){
  if (pSet){
    if('spikiness' in pSet){spikeSlider.value = pSet.spikiness;} 
    if("count" in pSet){ complexitySlider.value = pSet.count;}
    if('noise' in pSet){noiseSlider.value = pSet.noise;} 
    if("smooth" in pSet){ smoothSlider.value = pSet.smooth;}
    if("move" in pSet){ moveSlider.value = pSet.move;}
    if("colour" in pSet){ colourPicker.value = pSet.colour;}
  } else {
    console.log("no data returned")
  }
}


p.get_params = function (){
  let uData = {};
  uData['spikiness'] =spikeSlider.value ;
  uData["count"] = complexitySlider.value ;
  uData['noise'] = noiseSlider.value ;
  uData["smooth"] =  smoothSlider.value ;
  uData["move"] = moveSlider.value ;
  // uData["bkkName"] = nameInput.value ;
  uData["bkkMood"] = moodInput.value ;
  uData["colour"] = colourPicker.value;
  // colourPicker
  return uData;
}

p.stop_animation = function (){
  anim_on = false;
}

p.end = function (){
  // svg.remove()
}

// Each parameter is a list of the same length
// Points is a list of dicts for the parameters
// Have as many dicts as you want 
p.set_animation = function (paramList, timeList, pauseList){
  anim_changeList = paramList;
  anim_timeList = timeList;
  anim_pauseList = pauseList;
  anim_on = true;

  anim_time_next = anim_timeList[0]

}


p.set_fixed_params = function (params){
  fixed_display_on = true;
  lerpMode = false;
  anim_on = false;
  spikeVal =      params["spikiness"]
  complexityVal = params["count"]
  noiseVal =      params["noise"]
  smoothVal =     params["smooth"]
  moveVal =       params["move"]  
  colourVal =     params["colour"] 
}


p.set_lerp_mode = function (slider, params){
  lerpMode = true;
  anim_on = false;
  fixed_display_on = false;
  lerpSlider = document.getElementById(slider);
  lerpSpike =      params["spikiness"]
  lerpComplexity = params["count"]
  lerpNoise =      params["noise"]
  lerpSmooth =     params["smooth"]
  lerpMove =       params["move"]  
  lerpColour = params["colour"]
  lerpSlider.value = 0;

}

};


function runBKKExplore(afterSetup, draw_eyes=true, draw_outline=true){
  container = document.getElementById(containerDiv);
  svg = new p5(bkkSketch, container);
  svg.type = "SVG";
  svg.postSetupCallback = afterSetup;
  svg.drawEyes = draw_eyes;
  svg.drawOutline = draw_outline;
  return svg
};


function BKK(){
  this.runBKKExplore = runBKKExplore;
  // this.set_params = bkkSketch.set_params;
  // this.get_params = bkkSketch.get_params;
  // this.set_form_update_event = bkkSketch.set_form_update_event;
  // this.save_canvas = bkkSketch.save_canvas_as_svg;
  // this.stop_animation = bkkSketch.stop_animation;
  // this.start_animation = bkkSketch.set_animation;
  // this.set_fixed_params = bkkSketch.set_fixed_params;
  // this.setBKKSize = bkkSketch.setBKKSize;
  // this.set_lerp_mode = bkkSketch.set_lerp_mode;
  // this.end = bkkSketch.end;
};

