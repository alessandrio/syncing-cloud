###### syncing

Synchronize the edition of your document (if it does not exist it will be created) directly to your server without the need for an ftp or similar user, as you do locally and without third parties.

## Getting Started

After installing the extension in the editor, it is important to add a file inside the server in which we will synchronize the files.

### Prerequisites

 - inside any folder of our directory in the server we will create a file with the name `[index?].[py,php]`
 - in which we will add the following code:
 ###### PYTHON2.5+
 ```python
 #!/usr/bin/python
 import cgi
 import json
 print "Content-type: text/html\n"
 form = cgi.FieldStorage()
 todict = json.loads(form.getvalue('file'))
 try:
   print("1")
   with open(todict['way'], 'w') as file:
     file.write(todict['datable'])
 except IOError as e:
     print("0")
```
###### PHP7+
```php
  $str = file_get_contents($_FILES["file"]["tmp_name"]);
  $tojson = json_decode($str);
  echo (file_put_contents($tojson->way, $tojson->datable) !== false) ? 1 : 0;
 ```
 - copy the final url of the created file e.g. (`https://[mywebsite.cloud]/up/`) and put it in the extension settings in the editor.
![dir](https://github.com/alessandrio/syncing-cloud/raw/master/ss/atom/backend.png?raw=true)

### Settings

![settings](https://github.com/alessandrio/syncing-cloud/raw/master/ss/atom/cloudpath.png?raw=true)
 - write the path of the folder on the server with which it will be synchronized e.g. (`/home/[cloudserver]/public_html/`), the file name will automatically be taken from the editor.

### Run

 - the extension will be shown by pressing the cloud button located in the status bar of the editor.
![statusbar](https://github.com/alessandrio/syncing-cloud/raw/master/ss/atom/statusbar.png?raw=true)
 - once configured the extension it is time to press the button for the function.
![button](https://github.com/alessandrio/syncing-cloud/raw/master/ss/atom/button.png?raw=true)
 - when it turns blue it's time for excitement :)
![synced](https://github.com/alessandrio/syncing-cloud/raw/master/ss/atom/synced.png?raw=true)

## screenshot

![syncing screenshoot](https://github.com/alessandrio/syncing-cloud/raw/master/ss/atom-screenshot.png?raw=true)

### Installation
|     <>    |                                                                   |
|-----------|-------------------------------------------------------------------|
|  brackets | https://s3.amazonaws.com/extend.brackets/brackets-syncing/brackets-syncing-1.0.2.zip
|           | File ➔ Extension Manager ➔ Search for -Syncing Cloud- or DragAndDrop download previous
|  atom     | https://atom.io/packages/syncing-cloud or atom://settings-view/show-package?package=syncing-cloud
|           | ```apm install syncing-cloud```
|           | Settings/Preferences ➔ Install ➔ Search for syncing-cloud

## Contribution
 - [Issues](https://github.com/alessandrio/syncing-cloud/issues) & Pull Request.

## Mentions
 - Iconfinder
   - [synchronize_icon](https://www.iconfinder.com/icons/4265043/cloud_refresh_reload_sync_synchronize_icon)

## License

This project is licensed under the Apache License - see the [LICENSE](https://github.com/alessandrio/syncing-cloud/blob/master/LICENSE) file for details.
 ```
 by: Alessandrio >> s1dg78hg4df85h1
 ```
