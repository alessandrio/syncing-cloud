# Syncing (v1.0.1)

Synchronize the edition of your document (if it does not exist it will be created) directly to your server without the need for an ftp or similar user, as you do locally and without third parties.

## Getting Started

After installing the extension in the editor, it is important to add a file inside the server in which we will synchronize the files.

### Prerequisites

 - inside any folder of our directory in the server we will create a file with the name `index.[py,php]`
 - in which we will add the following code:
 ###### PYTHON2.5+
 ```python
#!/usr/bin/python
import cgi
import json
print "Content-type: text/html\n"
form = cgi.FieldStorage()
tojson = json.loads(str(form.getvalue('file')))
todict = json.loads(tojson);
datable = todict['datable']
way = todict['way']
try:
  with open(way, 'w') as file:
    file.write(datable)
    print('1')
except IOError as e:
    print('0')
```
###### PHP7+
```php
  $str = file_get_contents($_FILES["file"]["tmp_name"]);
  $tojson = json_decode(rtrim($str, "\0"), true);
  $obj = json_decode($tojson);
  echo (file_put_contents($obj->way, $obj->datable) !== false) ? 1 : 0;
 ```
 - copy the final url of the created file e.g. (`https://[mywebsite.cloud]/up/`) and put it in the extension settings in the editor.
![dir](https://github.com/alessandrio/syncing-brackets/raw/master/ss/dir.png)
 
### Settings

![settings](https://github.com/alessandrio/syncing-brackets/raw/master/ss/settings.png)
 - write the path of the file on the server with which it will be synchronized e.g. ()(`/home/[hostingservername]/public_html/`), the file name will automatically be taken from the editor. it is important to make sure that the links end with a slash `/`.

### Run

 - the extension will be shown by pressing the cloud button located in the status bar of the editor.
![statusbar](https://github.com/alessandrio/syncing-brackets/raw/master/ss/statusbar.png)
 - once configured the extension it is time to press the button for the function.
![button](https://github.com/alessandrio/syncing-brackets/raw/master/ss/button.png)
 - when it turns blue it's time for excitement :)
![synced](https://github.com/alessandrio/syncing-brackets/raw/master/ss/synced.png)

## screenshot

![syncing screenshoot](https://github.com/alessandrio/syncing-brackets/blob/master/ss/syncing.png?raw=true?raw=true "Syncing screenshoot")

## Contribution
 - Fork & Pull Request.
 
## Versioning

 - 22/Jul/2019 (v1.0.0)
   - Initial code
 - 23/Jul/2019 (v1.0.1)
   - added icons (main, settings)
   - adjustment section was added
   - fix some bugs
   
## Mentions
 - Iconfinder
   - [synchronize_icon](https://www.iconfinder.com/icons/4265043/cloud_refresh_reload_sync_synchronize_icon)
   - [setting_icon](https://www.iconfinder.com/icons/3838430/engine_gear_setting_icon)

## License

This project is licensed under the Apache License - see the [LICENSE](https://github.com/alessandrio/syncing-brackets/blob/master/LICENSE) file for details.
 ```
 by : Alessandrio >> s1dg78hg4df85h1
 ```
