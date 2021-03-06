/*globals define:false*/
define('app/views/text',[
  'jquery-ui',
  'backbone'
], function($, Backbone){
  var TextView = Backbone.View.extend({
    tagName: "div",
    events: {
      "mouseover": "showToolbar",
      "mouseout": "hideToolbar",
      "click .postit_close_image": "deleteText",
      "keyup .text_input": "updateText"
    },
    initialize: function(options)
    {
      this.boardConnection = options.boardConnection;
      this.model.bind('change', this.render, this);
      this.model.bind('remove', this.remove, this);
      var _this = this;
      this.$el.attr("id", "text"+this.model.id)
        .addClass("text");
      this.$el.css("top", this.model.get("y")+"px")
        .css("position", "absolute")
        .css("left", this.model.get("x")+"px")
        .css("padding", "22px 2px 2px 2px")
        .css("width", this.model.get("width")+"px")
        .css("height", this.model.get("height")+"px");
      this.$el.draggable({
        cursor: "move",
        containment: "parent",
        drag: function(){
          var position = $(this).position();
          _this.boardConnection.moveText(_this.model.get("id"), position.left, position.top);
        },
        stop: function(){
          var position = $(this).position();
          _this.model.save({x: position.left, y: position.top});
        }
      }).resizable({
          autoHide: true,
          resize: function(){
            var width = $(this).width();
            var height = $(this).height();
            _this.boardConnection.resizeText(_this.model.get("id"), width, height);
          },
          stop: function(event, ui){
            var width = ui.size.width;
            var height = ui.size.height;
            _this.model.save({width: width, height: height});
          }
        });
      this.createCloseElement().appendTo(this.$el);
      this.createTextArea().appendTo(this.$el);
      this.input = this.$('.text_input');
    },
    render: function(){
      this.$el
        .css("top", this.model.get("y")+"px")
        .css("left", this.model.get("x")+"px")
        .css("width", this.model.get("width")+"px")
        .css("height", this.model.get("height")+"px");
      this.input.val(this.model.get("text"));
      return this;
    },
    createCloseElement: function(){
      return $("<img/>")
        .addClass("postit_close_image")
        .attr("src", "/static/images/close.png");
    },

    createTextArea: function(){
      var textArea =  $("<textarea/>").addClass("text_input");
      textArea.val(this.model.get("text"));
      textArea.attr("placeholder", "Write your text");
      return textArea;
    },
    showToolbar: function() {
      this.$el.find(".postit_close_image").show();
      this.$el.css('padding-top','2px');
      this.$el.css('padding-bottom','20px');
    },
    hideToolbar: function() {
      this.$el.find(".postit_close_image").hide();
      this.$el.css('padding-top','22px');
      this.$el.css('padding-bottom','2px');
    },
    updateText: function() {
      var text = this.input.val();
      var _this = this;
      this.model.save({text: text},{
        'silent':true,
        success: function(){
          _this.boardConnection.updateText(_this.model.get("id"), text);
        }
      });
    },
    deleteText: function() {
      this.remove();
      this.model.destroy();
      this.boardConnection.deleteText(this.model.get("id"));
    }
  });
  return TextView;
});