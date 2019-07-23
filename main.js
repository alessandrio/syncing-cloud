/*jslint white, this, long, single*/
/*global define, window, brackets, console, $*/
define(function (require, exports, module) {
  "use strict";
  var w = window,
    d = w.document,
    AppInit = brackets.getModule("utils/AppInit"),
    StatusBar = brackets.getModule("widgets/StatusBar"),
    DocumentManager = brackets.getModule("document/DocumentManager"),
    EditorManager = brackets.getModule("editor/EditorManager"),
    WorkspaceManager = brackets.getModule("view/WorkspaceManager"),
    StringUtils = brackets.getModule("utils/StringUtils"),
    ExtensionUtils = brackets.getModule("utils/ExtensionUtils");
  ExtensionUtils.loadStyleSheet(module, "simple.css");
  var _opens = false,
    $panel;
  AppInit.appReady(function () {
    var _first = w.localStorage.getItem("syncing-first");
    var _syncing = false,
      _file,
      _dir,
      _up,
      params = function (obj) {
        var _obj = "",
          i;
        for (i in obj) {
          if (obj.hasOwnProperty(i)) {
            _obj += i + "=" + obj[i] + "&";
          }
        }
        return _obj + "syncing=alessandrio";
      },
      currentfile = function () {
        try {
          _file = EditorManager.getActiveEditor().getFile();
          $("#syncing-paneltitle span").text("Syncing - " + _file.name);
          $(".syncing-path").val(_file.fullPath);
          _dir = w.localStorage.getItem("syncingdir");
          $(".syncing-dir").val(_dir);
          _up = w.localStorage.getItem("syncingup");
          $(".syncing-upbackend").val(_up);
        } catch (err) {
          $("#syncing-status").text("non file");
        }
      }
    StatusBar.addIndicator("syncing", $(d.createElement("div")).html("&nbsp;"), true, "syncing-statusbar syncing-statusbar-close", "Syncing", "status-indent");
    $("#syncing").on("click", function () {
      if (_syncing) {
        StatusBar.updateIndicator("syncing", true, "syncing-statusbar syncing-statusbar-close");
        $panel.hide();
        _syncing = false;
      } else {
        StatusBar.updateIndicator("syncing", true, "syncing-statusbar syncing-statusbar-open");
        currentfile();
        $panel.show();
        _syncing = true;
      }
    });
    $panel = WorkspaceManager.createBottomPanel("synceditfile.syncingpanel", $(d.createElement("div")).attr({
      "id": "synceditfile.syncingpanel",
      "class": "syncingpanel",
    }).html(require('text!panel.html')), 121);
    if (!_first) {
      $(".syncing-starting").addClass("syncing-starting-show");
    }
    $(".syncing-dir").on("change", function () {
      var _thisval = $(this).val();
      if (_thisval.substr(_thisval.length - 1) != "/") {
        _thisval += "/";
        $(this).val(_thisval);
      }
      w.localStorage.setItem("syncingdir", _thisval);
    });
    $(".syncing-upbackend").on("change", function () {
      var _thisval = $(this).val();
      if (_thisval.substr(_thisval.length - 1) != "/") {
        _thisval += "/";
        $(this).val(_thisval);
      }
      w.localStorage.setItem("syncingup", _thisval);
    });
    $(".syncing-sync").on("click", function () {
      var _dir = $(".syncing-dir").val();
      var _up = $(".syncing-upbackend").val();
      if (!_dir) {
        $(".syncing-dir").focus();
      } else if (!_up) {
        $(".syncing-upbackend").focus();
      } else {
        currentfile();
        DocumentManager.getDocumentText(_file).done(function (text) {
          $(".syncing-sync").attr("disabled", true);
          $("#syncing-status").removeClass("syncing-blue syncing-red").addClass("syncing-grey").text("syncing...");
          var _data = JSON.stringify({
            datable: text,
            way: _dir + _file.name,
            syncing: "alessandrio"
          });
          var _json = new File([JSON.stringify(_data)], "syncing.json", {
            type: "application/json"
          });
          $("#syncing-paneltitle span").text("Syncing - " + _file.name + " - " + StringUtils.prettyPrintBytes(_json.size));
          var _formData = new FormData();
          _formData.append('file', _json);
          $.ajax({
              url: _up,
              type: "POST",
              data: _formData,
              contentType: false,
              processData: false,
              cache: false
            })
            .done(function (response) {
              if (response == "1") {
                $("#syncing-status").addClass("syncing-blue").text("synced!");
              } else {
                $("#syncing-status").addClass("syncing-red").text("syncing failed!");
              }
              $(".syncing-sync").removeAttr("disabled");
            })
            .fail(function (jqXHR, status, errorThrown) {
              $("#syncing-status").addClass("syncing.red").text("syncing failed!");
              $(".syncing-sync").removeAttr("disabled");
              console.log(jqXHR.responseText + " : " + status + " : " + errorThrown);
            });
        });
      }
    });
    $(".syncing-goit").on("click", function () {
      w.localStorage.setItem("syncing-first", "syncing");
      $(".syncing-starting").removeClass("syncing-starting-show");
    });
  });
});
