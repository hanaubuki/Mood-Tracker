// circumplex.js


// CIRCUMPLEX CONTROLS
let circumplexSketch = function(p) {

  const textHeight = 12;
  const circlePad = 20;
  const dotPad = 5;
  const dotsize = 3;
  const arrowPad = 6;
  const xSize = 3
  let centreX = 0;
  let centreY = 0;
  let clickedX = 0;
  let clickedY = 0;
  let relClickX = -999;
  let relClickY = -999;
  let canvasX = 500;
  let canvasY = 500;


  let emotionList = [ "AROUSAL",
                   "POSITIVE", 
                   "LOW AROUSAL",
                   "NEGATIVE"
                   ]

   p._circ_callback;

  // var clickedX = 0;
  // var clickedY = 0;
  var clicked = false;
  let radius;
  let dotRadius;


  function drawText(cx, cy, radius, dotRadius){
    p.textSize(textHeight);
    p.noFill()
    p.stroke(200);
    p.strokeWeight(3);
    //  draw the square around the outside
    p.square(cx-dotRadius,cy-dotRadius, dotRadius*2);

    // Draw the descriptions (overkill now that there are just 4)
    npoints = emotionList.length;
    let angle = p.TWO_PI / npoints;
    for (let a = -p.PI/2, j=0; j < npoints; a += angle, j++) {
      x = (cx + p.cos(a) * radius);
      y = (cy + p.sin(a) * radius);
      dotx = (cx + p.cos(a) * dotRadius);
      doty = (cy + p.sin(a) * dotRadius);
      xoff = 0;
      yoff = 0

      if(j==0 | j==2){
        xoff = -p.textWidth(emotionList[j])/2
        if(j==2){
          yoff = textHeight
        }
      } else if (j==1 | j==3) {
          yoff = p.textWidth(emotionList[j]) / 2 ;
          if(j==1){
            xoff = textHeight*0.75 
          }          
      }
      p.push();
        p.translate(x+xoff, y+yoff);
        if(j==1 || j==3){
          p.rotate(p.radians(270));
        }
        // Draw the letter to the screen
        p.color(0,0,0)
        p.stroke(0)      
        p.strokeWeight(1);
        p.text(emotionList[j], 0,0);
      p.pop();
      p.fill(0,0,0);
      p.circle(dotx,doty,dotsize)
    }

    // Draw the axes
    p.noFill();
    p.strokeWeight(3);
    p.stroke(200)

    minx = centreX-(dotRadius-arrowPad)
    maxx = centreX+(dotRadius-arrowPad)
    miny = centreY-(dotRadius-arrowPad)
    maxy = centreY+(dotRadius-arrowPad)

    p.line(minx, centreY, maxx, centreY);
    p.line(centreX, miny, centreX, maxy);    

    // axis labels
    xlabels = ["very\nnegative", "moderately\nnegative", "",
              "moderately\npositive", "very\npositive"]

    ylabels = ["very high\narousal", "moderately\nhigh arousal", "neutral", 
              "moderately\nlow arousal", "very low\narousal"]

    spacex = 0.89 *(maxx-minx)/(xlabels.length-1)
    spacey = 0.93 *(maxy-miny)/(ylabels.length-1)

    p.textSize(textHeight*1.1);
    p.fill(150,150,150);
    p.color(200,200,200)
    p.stroke(0)      
    p.strokeWeight(0.0);
   
   let i=0
    for(let lab of xlabels){
       /*p.translate(x+xoff, y+yoff)*/
       p.text(lab, minx + spacex *i,centreY-3);
       i++
    }

   i=0
    for(let lab of ylabels){
       /*p.translate(x+xoff, y+yoff)*/
       p.text(lab,centreX+2, miny + 12 + spacey * i);
       i++
    }

  }
  

  p.setup = function(){
    canvas = p.createCanvas(canvasX, canvasY);
    p.background(255);
    centreX = (p.width/2);
    centreY = (p.height/2);
    radius = (p.height-(circlePad+(textHeight/2)))/2;
    dotRadius = radius-(dotPad);
    drawText(centreX, centreY,radius, dotRadius)
    canvas.mouseClicked(drawMarker)
  }


  p.draw = function(){
      if(clicked){
        p.background(255);
        p.strokeWeight(1)        
        drawText(centreX, centreY,radius, dotRadius);
        p.strokeWeight(1.5);
        p.stroke(0)
        // draw the x at the point clicked
        p.line(clickedX - xSize, clickedY-xSize, clickedX + xSize, clickedY+xSize);
        p.line(clickedX + xSize, clickedY - xSize, clickedX-xSize, clickedY + xSize);        
        clicked=false;
      } 


  }

  function drawMarker() {
    clickedX = p.mouseX;
    clickedY = p.mouseY;
    cx = (p.width/2);
    cy = (p.height/2);   
    lbound = cx-dotRadius
    rbound = cx+dotRadius
    tbound = cy-dotRadius
    bbound = cy+dotRadius

    if((clickedX > lbound) &
        (clickedX < rbound) &
        (clickedY > tbound) &
        (clickedY < bbound) 
      )
      {
      clicked = true;
      relClickX =  clickedX - lbound
      relClickX /= (rbound-lbound)
      relClickX = (relClickX * 2) - 1
      relClickY = clickedY - tbound
      relClickY /= (bbound-tbound)   
      relClickY = (relClickY * 2) - 1      
      relClickY *= -1 // Flip the axis
      p._circ_callback(relClickX, relClickY);    
    }
  }




  p.getCircClickX = function (){
    return relClickX;
  }

  p.getCircClickY = function (){
    return relClickY;
  }

  p.setCallback = function(clickCallback){
    p._circ_callback = clickCallback
  }
}

function setupCircumplex(div){
  circ =  new p5(circumplexSketch, div);
  return circ
};


function Circumplex(){
  this.setupCircumplex = setupCircumplex;
};



