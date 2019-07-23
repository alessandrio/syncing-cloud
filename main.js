//Alessandrio
/*jslint white, this, long, single*/
/*global define, window, brackets, console, $*/
define(function (require, exports, module) {
  "use strict";
  var w = window,
    d = w.document,
    AppInit = brackets.getModule("utils/AppInit"),
    NativeApp = brackets.getModule(("utils/NativeApp")),
    StatusBar = brackets.getModule("widgets/StatusBar"),
    DocumentManager = brackets.getModule("document/DocumentManager"),
    EditorManager = brackets.getModule("editor/EditorManager"),
    WorkspaceManager = brackets.getModule("view/WorkspaceManager"),
    StringUtils = brackets.getModule("utils/StringUtils"),
    PreferencesManager = brackets.getModule("preferences/PreferencesManager"),
    prefs = PreferencesManager.getExtensionPrefs("syncing"),
    ExtensionUtils = brackets.getModule("utils/ExtensionUtils");
  ExtensionUtils.loadStyleSheet(module, "simple.css");
  var _opens = false,
    $panel;
  PreferencesManager.definePreference("syncing-uploadableurl", "boolean", !1, {
    description: "The path of the file on the server with which it will be synchronized."
  }).on("change", function () {
    var _up = prefs.get("uploadableurl");
    if (_up && _up.substr(_up.length - 1) != "/") {
      prefs.set("uploadableurl", _up + "/");
      prefs.save();
    }
  });
  AppInit.appReady(function () {
    var _syncing = false,
      _file,
      _dir,
      _up = prefs.get("uploadableurl"),
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
    }).html(require('text!panel.html')), 153);
    if (!_up || _up == "") {
      $panel.show();
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
      prefs.set("uploadableurl", _thisval);
      prefs.save();
    });
    $(".syncing-sync").on("click", function () {
      var _dir = $(".syncing-dir").val();
      if (!_dir) {
        $(".syncing-dir").focus();
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
    var _github = false;
    $(".syncing-settings").on("click", function (e) {
      $(".syncing-starting").addClass("syncing-starting-show");
      $(".syncing-upbackend").val(_up);
      _github = true;
    });
    $(".syncing-github").on("click", function (e) {
      _github = true;
    });
    $(".syncing-goit").on("click", function () {
      var _up = $(".syncing-upbackend").val();
      if (!_up || _up == "") {
        $(".syncing-upbackend").focus();
      } else {
        $(".syncing-starting").removeClass("syncing-starting-show");
        currentfile();
      }
      if (!_github) {
        NativeApp.openURLInDefaultBrowser("https://github.com/alessandrio/syncing-brackets");
      }
    });
  });
});
