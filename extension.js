/*
Alessandrio code ~sdevgfrbg6d5f26nb2
*/
const vscode = require('vscode'),
  path = require("path"),
  fs = require("fs");

function getWebviewContent(css, settings, full, path, name, string) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <link rel="stylesheet" href="${css}">
  <!--<meta http-equiv="Content-Security-Policy" content="default-src 'none'; font-src * data: blob: 'unsafe-inline' vscode-webview-resource:;">-->
</head>
<body>
  <div class="syncingbox">
    <label>
      <input type="checkbox" name="" class="autoclose" ${settings[2] ? 'checked' : ''}>
      <span>close modal after syncing</span>
    </label>
    <input type="text" name="" placeholder="scriptpath" class="scriptpath suggest-input-container" ${settings[1]?'value="'+settings[1]+'"':''}>
    <input type="text" name="" placeholder="/home/[cloudserver]/public_html/" class="serverpathsave suggest-input-container" ${settings[0]?'value="'+settings[0]+'"':''}>
    <div class="filepath"></div>
    <button class="syncing suggest-input-container syncing-cloud">Sync</button>
  </div>
  <div>
    <textarea id="formessage">${JSON.stringify({settings, full, path, name, string: encodeURIComponent(string)})}</textarea>
  </div>
  <script>
    const vscode = acquireVsCodeApi();
    let message = JSON.parse(document.querySelector("#formessage").value),
      syncing = document.querySelector(".syncing"),
      _syncing = '<div class="loader"><div class="dot"></div><div class="dot"></div><div class="dot"></div><div class="dot"></div><div class="dot"></div></div>syncing...',
      lastslash = (str) => (str.slice(-1) != "/" ? str + "/" : str),
      endslash = (str) => (str.endsWith('/') ? str.substr(0, str.length - 1) : str),
      startslash = (str) => (str.startsWith('/') ? str : '/' + str),
      rbeginslash = (str) => str !== '' ? str.substr(1) : str,
      formatBytes = (t) => {
        return t < 1024 ? t + " Bytes" : t < 1048576 ? (t / 1024).toFixed(3) + " KB" : t < 1073741824 ? (t / 1048576)
          .toFixed(3) + " MB" : (t / 1073741824).toFixed(3) + " GB";
      };
      syncing.innerHTML = _syncing;
      if (message.settings[2]) {
        document.querySelector(".autoclose").setAttribute("checked", "true");
      }
      document.querySelector(".scriptpath").value = lastslash(message.settings[0]);
      document.querySelector(".serverpathsave").value = lastslash(message.settings[1]);
      const filetext = decodeURIComponent(message.string),
        file = new File([filetext], 'syncing.txt', {
          type: "text/plain",
        }),
        formData = new FormData(),
        syncingfile = " - " + formatBytes(file.size);
      formData.append('file', file);
      formData.append('name', startslash(message.name));
      formData.append('path', rbeginslash(message.path));
      formData.append('root', lastslash(message.settings[1]));
      formData.append('syncing', 'alessandrio');
      document.querySelector(".filepath").textContent = "[~]" + startslash(message.name) + syncingfile;
      vscode.postMessage({
        syncingfile: "[~]" + message.path + startslash(message.name) + syncingfile
      });
      //https://github.com/github/fetch
      let errorsyng = () => {
          syncing.textContent = "error syncing - retry";
          syncing.classList.remove("syncing-cloud");
          syncing.classList.remove("syncing-synced");
          syncing.classList.add("syncing-error");
        },
        _click = 0,
        _fetch = () => {
          fetch(lastslash(message.settings[0]), {
              body: formData,
              method: 'POST'
            })
            .then(response => response.text())
            .then(function (response) {
              if (response == '1') {
                syncing.textContent = "synced";
                syncing.classList.remove("syncing-cloud");
                syncing.classList.add("syncing-synced");
                if (message.settings[2]) {
                  vscode.postMessage({
                    disposepanel: true
                  });
                }
                _click = 0;
              } else {
                errorsyng();
                _click = 1;
              }
            })
            .catch(function (error) {
              errorsyng();
              _click = 1;
            });
        };
      _fetch();
      syncing.onclick = function () {
        if (_click == 1) {
          syncing.className = "syncing suggest-input-container syncing-cloud";
          syncing.innerHTML = _syncing;
          _fetch();
          _click = 0;
        }
      }
      const messagesettings = (name, value) => {
        return {
          name,
          value,
          updatesettings: true
        }
      };
      document.querySelector(".autoclose").onchange = function () {
        vscode.postMessage(messagesettings('autoclosepanel', this.checked));
      }
      document.querySelector(".scriptpath").onchange = function () {
        vscode.postMessage(messagesettings('scriptserver', this.value));
      }
      document.querySelector(".serverpathsave").onchange = function () {
        vscode.postMessage(messagesettings('upluadpath', this.value));
      }
  </script>
</body>
</html>
`;
}
const getsettings = (name) => {
    return vscode.workspace.getConfiguration().get('syncing.' + name);
  },
  updatesettings = (name, value) => {
    vscode.workspace.getConfiguration().update(name, value, true);
  },
  notification = (text, sbitem, error) => {
    var info = vscode.window[error ? 'showErrorMessage' : 'showInformationMessage'](`Syncing: ${text}.`).then(selection => {
      sbitem.color = '';
      info = undefined;
    });
    info.modal = true;
  };

function activate(context) {
  const myCommandId = 'showstatusbariconsyncing';
  let myStatusBarItem = vscode.window.createStatusBarItem("Syncingicon", vscode.StatusBarAlignment.Right, 100);
  myStatusBarItem.command = myCommandId;
  myStatusBarItem.text = '$(cloud-upload)';
  myStatusBarItem.tooltip = "Syncing Cloud";
  myStatusBarItem.show();
  context.subscriptions.push(vscode.commands.registerCommand(myCommandId, (e) => {
    myStatusBarItem.color = '#0F82E6';
    let workspacefolder,
      editor = vscode.window.activeTextEditor;
    try {
      workspacefolder = vscode.workspace.workspaceFolders[0].uri.fsPath;
    } catch (err) {
      workspacefolder = '';
    }
    let fullpath = '',
      filepath = '',
      filename = '',
      isUntitled = 0,
      capturefile = 0;

    if (e && e.fsPath && e.scheme == 'file') {
      fullpath = e.fsPath;
      filepath = path.dirname(e.fsPath);
      filename = path.basename(e.fsPath);
      capturefile = 1;
    } else if (editor) {
      fullpath = editor.document.fileName;
      filepath = path.dirname(fullpath);
      filename = path.basename(fullpath);
      isUntitled = editor.document.isUntitled;
      capturefile = 1;
    } else {
      capturefile = 0;
    }
    filepath = (filepath == workspacefolder || isUntitled || workspacefolder == '') ? '' : filepath;
    filepath = workspacefolder != '' ? filepath.replace(workspacefolder, '') : filepath;
    let title = "Syncing - " + filename,
      syncingfile = '';
    if (capturefile) {
      const stringContent = fs.readFileSync(fullpath, 'utf8'),
        panel = vscode.window.createWebviewPanel('Syncing.Syncing.id',
          title,
          vscode.ViewColumn.one, {
            enableScripts: true,
            retainContextWhenHidden: true,
            enableCommandUris: true
          }),
        css = panel.webview.asWebviewUri(vscode.Uri.file(
          path.join(context.extensionPath, "style.css")
        )),
        settings = [getsettings('scriptserver'), getsettings('upluadpath'), getsettings('autoclosepanel')];
      panel.webview.html = getWebviewContent(css, settings,
        fullpath.replace(/\\/gi, '/'), filepath.replace(/\\/gi, '/'),
        filename, stringContent);
      panel.webview.onDidReceiveMessage(message => {
        if (message.disposepanel) {
          panel.dispose();
        }
        if (message.updatesettings) {
          updatesettings(`${message.name}`, message.value);
        }
        if (message.syncingfile) {
          syncingfile = message.syncingfile;
        }
      }, undefined, context.subscriptions);
      panel.onDidDispose(() => {
        currentPanel = undefined;
        notification("success -> " + syncingfile, myStatusBarItem);
      }, null, context.subscriptions);
    } else {
      notification("No valid file open", myStatusBarItem, 1);
    }
  }));
}

function deactivate() {}
module.exports = {
  activate,
  deactivate
}
/*
Alessandrio code ~sdevgfrbg6d5f26nb2
*/
