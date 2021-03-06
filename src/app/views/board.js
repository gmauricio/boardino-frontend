/*globals define:false*/
define('app/views/board',[
  'jquery',
  'backbone',
  'app/views/postit',
  'app/views/canvas',
  'app/views/text',
  'app/models/board',
  'app/models/postit',
  'app/models/text',
  'app/collections/postits',
  'app/collections/texts'
], 

function($, Backbone, PostitView, BoardCanvas, TextView, Board, Postit, Text, PostitList, TextList){
    var BoardView = Backbone.View.extend({
        el: $("#board"),

        events: {
            "mousedown #board-canvas": "mousedown",
            "mousemove": "mouseMove",
            "mouseup": "mouseUp"
        },

        initialize: function(attrs){
          this.boardConnection = attrs.boardConnection;

          this.tool = "postits";
          this.canvas = new BoardCanvas({boardConnection: this.boardConnection});
          this.canvas.render();

          this.postits = new PostitList();
          this.postits.bind('add', this.addOne, this);
          this.postits.bind('reset', this.addAll, this);
          this.postits.bind('all', this.render, this);
          this.postits.fetch();

          this.texts = new TextList();
          this.texts.bind('add', this.addOneText, this);
          this.texts.bind('reset', this.addAllTexts, this);
          this.texts.bind('all', this.render, this);
          this.texts.fetch();
        },

        mousedown: function(e){
            if (this.tool === "drawing") {
                this.canvas.startLine(e.pageX, e.pageY, "free");
            }
            if (this.tool === "rectDrawing") {
                this.canvas.startLine(e.pageX, e.pageY, "rect");
            }
            if (this.tool === "eraser") {
                this.canvas.tryToErase(e.pageX, e.pageY);
            }
            var _this = this;
            if (this.tool === "postits") {
                var postit = new Postit({"x":e.pageX, "y":e.pageY, "width":120, "height":120, "text":""});
                this.postits.add(postit);//TODO: check what is this doing
                postit.save(null, {
                    success: function(model, response){
                        _this.boardConnection.newPostit(model.get("id"), postit.get("x"), postit.get("y"), postit.get("width"), postit.get("height"), postit.get("text"));
                    }
                });
                postit.trigger('focus');
            }
            if (this.tool === "text") {
              var text = new Text({
                text: "",
                x: e.pageX,
                y: e.pageY,
                width: 150,
                height: 50
              });
              var view = new TextView({model: text, boardConnection: this.boardConnection});
              $("#board").append(view.render().el);

              text.save(null, {
                success: function(model, response){
                  _this.boardConnection.newText(model.get("id"), text.get("x"), text.get("y"), text.get("width"), text.get("height"), text.get("text"));
                }
              });
            }
            return false;
        },

        mouseMove: function(e){
            if(this.tool === "drawing" || this.tool === "rectDrawing"){
                this.canvas.mouseMove(e);
            }
        },

        mouseUp: function(e){
            if(this.tool === "drawing" || this.tool === "rectDrawing"){
                this.canvas.finishLine(e);
            }
        },

        showPostit: function(id){
            var postit = new Postit({id:id});
            postit.fetch();
            this.postits.add(postit);
        },
        showText: function(id){
          var _this = this;
          var text = new Text({id:id});
          text.fetch({
            success: function(){
              _this.texts.add(text);
            }
          });
        },
        addAll: function() {
            this.postits.each(this.addOne, this);
        },
        addAllTexts: function() {
            this.texts.each(this.addOneText, this);
        },
        addOne: function(postit){
            var view = new PostitView({model: postit, boardConnection: this.boardConnection});
            $("#board").append(view.render().el);
        },
        addOneText: function(text){
          var view = new TextView({model: text, boardConnection: this.boardConnection});
          $("#board").append(view.render().el);
        },
        movePostit: function(id, newX, newY){
            this.postits.get(id).set({x: newX, y: newY});
        },
        moveText: function(id, newX, newY){
          this.texts.get(id).set({x: newX, y: newY});
        },
        resizePostit: function(id, width, height){
            this.postits.get(id).set({width: width, height: height});
        },
        resizeText: function(id, width, height){
          this.texts.get(id).set({width: width, height: height});
        },
        changePostitColor: function(id, color){
            this.postits.get(id).set("back_color", color);
        },

        deletePostit: function(id){
            this.postits.remove(id);
        },

        deleteText: function(id){
          this.texts.remove(id);
        },

        updatePostitText: function(id, text){
            this.postits.get(id).set("text",text);
        },

        updateText: function(id, text){
          this.texts.get(id).set("text", text);
        },

        startPath: function(id, x, y, color){
            this.canvas.startPath(id, x, y, color);
        },

        addPathPoint: function(id, x, y){
            this.canvas.addPathPoint(id, x, y);
        },

        finishPath: function(id){
            this.canvas.finishPath(id);
        },

        selectPostitTool: function(){
            this.tool = "postits";
        },

        selectPencilTool: function(color){
            this.tool = "drawing";
            this.canvas.setStrokeColor(color);
        },

        selectRectLineTool: function(){
            this.tool = "rectDrawing";
            this.canvas.setStrokeColor("black");
        },

        selectEraserTool: function(){
            this.tool = "eraser";
        },

        selectTextTool: function(){
            this.tool = "text";
        },

        clearLines: function(){
            this.canvas.clearLines();
        },

        deleteLine: function(id){
            this.canvas.deleteLine(id);
        }
    });

    return BoardView;
});
