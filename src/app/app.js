/* globals $:false, define:false, document:false, window:false */
define("app",[
  'jquery',
  'app/views/main',
  'app/views/board',
  'app/views/canvas',
  'app/boardconnection',
  'app/boardmessagehandler',
  'app/toolbar',
  'app/utils',
  'app/models/board',
  'bootstrap'
], 

function($, MainView, BoardView, BoardCanvas, BoardConnection, BoardMessageHandler, Toolbar, Utils){
    var initialize = function(){

        var boardConnection, boardView;// Added

        function initBoard(){
          var boardId = Utils.getBoardId();
          var boardMessageHandler = new BoardMessageHandler();
          boardConnection = new BoardConnection(boardId, boardMessageHandler);
          boardView = new BoardView({boardConnection: boardConnection});
          boardMessageHandler.setBoardView(boardView);

          var mainView = new MainView({boardView: boardView, boardId: boardId});
          mainView.render();
        }

        $(document).ready(function() {
          initBoard();
          loadToolbar();
          var pencil_tool = $("#pencil_tool");
          pencil_tool.mouseover(function(){
            $("#pencil_tool").width(200);
            $("#selected_pencil_tool").hide();
            $("#pencil_black_tool").show();
            $("#pencil_green_tool").show();
            $("#pencil_red_tool").show();
            $("#pencil_blue_tool").show();
          });
          pencil_tool.mouseout(function(){
            $("#pencil_tool").width(50);
            $("#selected_pencil_tool").show();
            $("#pencil_black_tool").hide();
            $("#pencil_green_tool").hide();
            $("#pencil_red_tool").hide();
            $("#pencil_blue_tool").hide();
          });

          $(window).bind("beforeunload", function() {
            boardConnection.disconnect();
          });
        });

        function loadToolbar(){
            var toolbar = new Toolbar();
            toolbar.addTool($("#eraser_tool").tool(toolbar, {
                    "action": function(){
                        $("#board").css('cursor','url(/static/images/eraser_disabled.ico),default');
                        boardView.selectEraserTool();
                    }
            }));

            toolbar.addTool($("#postit_tool").tool(toolbar, {
                    "action": function(){
                        $("#board").css('cursor','url(/static/images/postit_disabled.ico),default');
                        boardView.selectPostitTool();
                    }
            }));

            toolbar.addTool($("#selected_pencil_tool").tool(toolbar, {
                    "enabledClass": "pencil_black_tool_enabled",
                    "disabledClass": "pencil_tool_disabled",
                    "action": function(){}
            }));

            toolbar.addTool($("#pencil_black_tool").tool(toolbar, {
                    "action": function(){
                        $("#board").css('cursor','url(/static/images/pencil_disabled.ico),default');
                        boardView.selectPencilTool("black");
                        $("#selected_pencil_tool").attr('class', "pencil_black_tool_enabled");
                    }
            }));

            toolbar.addTool($("#pencil_green_tool").tool(toolbar, {
                    "action": function(){
                        $("#board").css('cursor','url(/static/images/pencil_green_disabled.ico),default');
                        boardView.selectPencilTool("green");
                        $("#selected_pencil_tool").attr('class', "pencil_green_tool_enabled");
                    }
            }));

            toolbar.addTool($("#pencil_red_tool").tool(toolbar, {
                    "action": function(){
                        $("#board").css('cursor','url(/static/images/pencil_red_disabled.ico),default');
                        boardView.selectPencilTool("red");
                        $("#selected_pencil_tool").attr('class', "pencil_red_tool_enabled");
                    }
            }));

            toolbar.addTool($("#pencil_blue_tool").tool(toolbar, {
                    "action": function(){
                        $("#board").css('cursor','url(/static/images/pencil_blue_disabled.ico),default');
                        boardView.selectPencilTool("blue");
                        $("#selected_pencil_tool").attr('class', "pencil_blue_tool_enabled");
                    }
            }));

            toolbar.addTool($("#clear_lines_tool").tool(toolbar, {
                    "action": function(){
                        boardView.clearLines();
                    },
                    "confirmable": true,
                    "exclusive": false
            }));

            toolbar.addTool($("#rectline_tool").tool(toolbar, {
                    "action": function(){
                        $("#board").css('cursor','crosshair');
                        boardView.selectRectLineTool("FF000000");
                    }
            }));

          toolbar.addTool($("#text_tool").tool(toolbar, {
            "action": function(){
              $("#board").css('cursor','arrow');
              boardView.selectTextTool();
            }
          }));
        }
  };

  return {
    initialize: initialize
  };
});
