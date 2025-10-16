let canvas;
let ctx;
let defualtControlData = {
    x: 100,
    y: 100,
    angle: 0,
    pivotX: 50,
    pivotY: 50,
    width: 100,
    height: 100
}

// Main events and life cycles functions
function viewDidLoad(){
    canvas = document.getElementById('main_canvas');
    if (canvas.getContext) {
        ctx = canvas.getContext('2d');
    } else {
        alert('Your browser does not support the HTML5 canvas tag.');
    }
    updateInputs(defualtControlData);
    applyTransformations();
}
function allEventsHandler(e){
    if (e.target && (e.target.id === 'angle' )) {
        document.getElementById('angle.value').textContent = e.target.value;
    }
    applyTransformations();
}
function reset(){
    updateInputs(defualtControlData);
    applyTransformations();
}
function initEvents(){
    document.getElementById('x').addEventListener('input',allEventsHandler);
    document.getElementById('y').addEventListener('input',allEventsHandler);
    document.getElementById('width').addEventListener('input',allEventsHandler);
    document.getElementById('height').addEventListener('input',allEventsHandler);
    document.getElementById('angle').addEventListener('input',allEventsHandler);
    document.getElementById('pivotX').addEventListener('input',allEventsHandler);
    document.getElementById('pivotY').addEventListener('input',allEventsHandler);
}

// Utilities functions 
function drawPoint(x=0,y=0,color='red') {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
    }
function drawRuler() {
    const w = canvas.width;
    const h = canvas.height;
    const step = 50; // grid spacing in px
  
    // Set coordinate system:
    // Origin = center, Y positive up
    ctx.setTransform(1, 0, 0, -1, w / 2, h / 2);
    ctx.clearRect(-w / 2, -h / 2, w, h);
  
    // grid lines
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#eee";
    for (let x = -w / 2; x <= w / 2; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, -h / 2);
      ctx.lineTo(x, h / 2);
      ctx.stroke();
    }
    for (let y = -h / 2; y <= h / 2; y += step) {
      ctx.beginPath();
      ctx.moveTo(-w / 2, y);
      ctx.lineTo(w / 2, y);
      ctx.stroke();
    }
  
   
    ctx.strokeStyle = "lightgray";
    ctx.lineWidth = 1.0;
  
    // X-axis
    ctx.beginPath();
    ctx.moveTo(-w / 2, 0);
    ctx.lineTo(w / 2, 0);
    ctx.stroke();
  
    // Y-axis
    ctx.beginPath();
    ctx.moveTo(0, -h / 2);
    ctx.lineTo(0, h / 2);
    ctx.stroke();
  
    // font settings for text
    ctx.font = "10px sans-serif";
    ctx.fillStyle = "#444";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
  
    // X-axis ticks
    for (let x = -w / 2; x <= w / 2; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, -5);
      ctx.lineTo(x, 5);
      ctx.stroke();
      if (x !== 0) {
        ctx.save();
        ctx.scale(1, -1); // flip text upright
        ctx.fillText(x.toString(), x, -15);
        ctx.restore();
      }
    }
  
    // Y-axis ticks
    ctx.textAlign = "right";
    for (let y = -h / 2; y <= h / 2; y += step) {
      ctx.beginPath();
      ctx.moveTo(-5, y);
      ctx.lineTo(5, y);
      ctx.stroke();
      if (y !== 0) {
        ctx.save();
        ctx.scale(1, -1);
        ctx.fillText(y.toString(), -10, -(y) + 4);
        ctx.restore();
      }
    }
  
    drawPoint(0,0,'black');
  }
function clear() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawRuler();
  }
function updateInputs(controlData) {
    document.getElementById('x').value = controlData.x;
    document.getElementById('y').value = controlData.y;
    document.getElementById('angle').value = controlData.angle;
    document.getElementById('angle.value').textContent = controlData.angle;
    document.getElementById('pivotX').value = controlData.pivotX;
    document.getElementById('pivotY').value = controlData.pivotY;
    document.getElementById('width').value = controlData.width;
    document.getElementById('height').value = controlData.height;
}
function updateInfo(box) {
    const corners = box.getCorners();
    corners.forEach(corner => {
        document.getElementById(`info.${corner.name}`).textContent = `(${corner.x.toFixed(2)}, ${corner.y.toFixed(2)})`;
    });
  }
function applyTransformations() {
    let x = parseFloat(document.getElementById('x').value) || 0;
    let y = parseFloat(document.getElementById('y').value) || 0;
    let angle = parseFloat(document.getElementById('angle').value) || 0;
    let pivotX = parseFloat(document.getElementById('pivotX').value) || 0;
    let pivotY = parseFloat(document.getElementById('pivotY').value) || 0;
    let width = parseFloat(document.getElementById('width').value) || 100;
    let height = parseFloat(document.getElementById('height').value) || 100;

    let controlData = {
        x: x,
        y: y,
        angle: angle,
        pivotX: pivotX,
        pivotY: pivotY,
        width:  width,
        height: height
    }

    clear();
    let box = new Box();
    box.draw(ctx,canvas,controlData);
    updateInfo(box);
  }

// Box class drawing and calculations
class Box{
    constructor(x=0,y=0,width=100,height=100,angle=0,pivotX=0,pivotY=0){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.angle = angle; // in degrees
        this.pivotX = pivotX;
        this.pivotY = pivotY;
    }
    draw(ctx,canvas,control=null) {
        
        if (control){
            this.x = control.x;
            this.y = control.y;
            this.width = control.width;
            this.height = control.height;
            this.angle = control.angle; // in degrees
            this.pivotX = control.pivotX;
            this.pivotY = control.pivotY;
        }

    
        const xPos = this.x;
        const yPos = this.y;
        const angleRad = -this.angle * Math.PI / 180; // to radians and (-) for clockwise rotation
    
        ctx.save();
    
        // goto pivot
        ctx.translate(xPos, yPos);
    
        // rotate at pivot
        ctx.rotate(angleRad);
    
        
        let localX = -this.pivotX 
        let localY = -this.pivotY 
    

        ctx.fillStyle = 'rgba(0, 128, 255, 1)';
        ctx.strokeStyle = 'rgb(60, 60, 61)';
        ctx.lineWidth = 2;
        ctx.strokeRect(localX , localY , this.width, this.height); 
        ctx.fillRect(localX , localY , this.width, this.height); 
        drawPoint(localX , localY,'rgb(93, 229, 98)');
        // Restore context
        ctx.restore();
        drawPoint(xPos,yPos,'red');
    
    }
    getCorners() {
        const rad = -this.angle * Math.PI / 180;
        console.log(`${rad} == ${Math.PI/4}`);

        // if not rotatation
        const corners = [
            { name: "lb",     x: -this.pivotX,              y: -this.pivotY },
            { name: "rb",    x: -this.pivotX + this.width, y: -this.pivotY },
            { name: "lt",  x: -this.pivotX,              y: -this.pivotY + this.height },
            { name: "rt", x: -this.pivotX + this.width, y: -this.pivotY + this.height },
        ];
        console.log(corners);

        // Rotate and translate to world space
        return corners.map(pt => {
            const cos = Math.cos(rad);
            const sin = Math.sin(rad);
            const rx = pt.x * cos - pt.y * sin;
            const ry = pt.x * sin + pt.y * cos;
            return {
                name: pt.name,
                x: this.x + rx,
                y: this.y + ry
            };
        });
    }
     
}
//on document load
window.addEventListener('DOMContentLoaded', viewDidLoad);
initEvents();
