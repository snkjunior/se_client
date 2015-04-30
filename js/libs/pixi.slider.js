$(document).ready(function() {

  /* =========================================================
                              CONFIG
     ========================================================= */

  var SLIDE_LENGTH = 100;
  var SLIDE_WIDTH = 10;
  var SLIDE_COL = 0x888888;
  var SLIDE_X0 = 100;
  var SLIDE_Y0 = 100;

  var KNOB_COL = 0xaaaaaa;
  var KNOB_RAD = 10;

  var KNOB_PATH = 'https://cdn0.iconfinder.com/data/icons/gcons-2/9/point1-16.png';

  /* =========================================================
                              PIXI
     ========================================================= */
  var stage = new PIXI.Stage(0xFFFFFF);
  var renderer = new PIXI.autoDetectRenderer(400, 300);
  
  document.body.appendChild(renderer.view);

  requestAnimFrame(animate);

  /*------------
       Slider  
    ------------*/
  var slide = new PIXI.Graphics();
  slide.lineStyle(SLIDE_WIDTH,SLIDE_COL,1);
  slide.moveTo(SLIDE_X0,SLIDE_Y0);
  slide.lineTo(SLIDE_X0+SLIDE_LENGTH,SLIDE_Y0);

  /*------------
        Knob  
    ------------*/
  
  // using a graphics circle (this is wonky :( )
  // var knob = new PIXI.Graphics();
  // knob.beginFill(KNOB_COL);
  // knob.drawCircle(SLIDE_X0,SLIDE_Y0,KNOB_RAD);
  // knob.hitArea = new PIXI.Rectangle(SLIDE_X0-KNOB_RAD,SLIDE_Y0-KNOB_RAD,KNOB_RAD*2,KNOB_RAD*2);

  // using an image
  var texture = new PIXI.Texture.fromImage(KNOB_PATH);
  var knob = new PIXI.Sprite(texture);
  knob.interactive = true;
  knob.buttonMode = true;
  knob.anchor.x = 0.5;
  knob.anchor.y = 0.5;
  knob.position.x = SLIDE_X0;
  knob.position.y = SLIDE_Y0;

  // use the mousedown and touchstart
  knob.mousedown = knob.touchstart = function(data)
  {
    this.data = data;
    this.alpha = 0.9;
    this.dragging = true;
  };
  
  // set the events for when the mouse is released or a touch is released
  knob.mouseup = knob.mouseupoutside = knob.touchend = knob.touchendoutside = function(data)
  {
    this.alpha = 1
    this.dragging = false;
    this.data = null;
  };
  
  // set the callbacks for when the mouse or a touch moves
  knob.mousemove = knob.touchmove = function(data)
  {
    if(this.dragging)
    {
      var newPosition = this.data.getLocalPosition(stage);
      if (newPosition.x > SLIDE_X0 && newPosition.x < SLIDE_X0 + SLIDE_LENGTH) {
        this.position.x = newPosition.x;
      }
    }
  }

  // Display value of slider
  var slider_val_text = new PIXI.Text('0%', {fill: "black", align: "left"});
  slider_val_text.position.x = 20;
  slider_val_text.position.y = 20;

  stage.addChild(slide);
  stage.addChild(knob);
  stage.addChild(slider_val_text);

  function animate() {
    requestAnimFrame(animate);
    renderer.render(stage);
    slider_val_text.setText(get_slider_val().toString() + '%');
  }

  function get_slider_val() {
    return parseInt((knob.position.x - SLIDE_X0)/(SLIDE_LENGTH)*100);
  }
});

