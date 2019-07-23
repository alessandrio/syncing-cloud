# Syncing (v1.0.0)

Synchronize the edition of your document directly to your server without the need for an ftp or similar user, as you do locally and without third parties.

## Getting Started

After installing the extension in the editor, it is important to add a file inside the server in which we will synchronize the files.

### Prerequisites

 - inside any folder of our directory in the server we will create a file with the name `index.[py,php]`
 - in which we will add the following code:
 ```
 PYTHON2.5+
 
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
 
 PHP7+
 
  $str = file_get_contents($_FILES["file"]["tmp_name"]);
  $tojson = json_decode(rtrim($str, "\0"), true);
  $obj = json_decode($tojson);
  echo (file_put_contents($obj->way, $obj->datable) !== false) ? 1 : 0;
 ```
 - copy the final url of the created file. e.g. (`https://[mywebsite.cloud]/up/`)
 
### Settings

![settings](https://github.com/alessandrio/syncing-brackets/raw/master/ss/settings.png)

 - the first line is added automatically indicating the path of the local file in edition.
 - the second line indicates the path of the file on the server with which it will be synchronized. e.g. ()(`/home/[hostingservername]/public_html/`)
 - the file name will automatically be taken from the editor.
 - in the third line will indicate the path of the file created lines above. e.g. (`https://[mywebsite.cloud]/up/`)
 - it is important to make sure that the links end with a slash `/`.

### Run

 - the extension will be shown by pressing the cloud button located in the status bar of the editor.
![statusbar](https://github.com/alessandrio/syncing-brackets/raw/master/ss/statusbar.png)
 - once configured the extension it is time to press the button for the function.
![button](https://github.com/alessandrio/syncing-brackets/raw/master/ss/button.png)
 - when it turns green it's time for excitement :)
![synced](https://github.com/alessandrio/syncing-brackets/raw/master/ss/synced.png)

### screenshot

![Syncing screenshoot](https://github.com/alessandrio/syncing-brackets/blob/master/ss/syncing.jpg?raw=true?raw=true "Syncing screenshoot")

## Contribution
 - Fork & Pull Request.
 
## Versioning

 - 22/Jul/2019
   - Initial code

## Mentions

[Iconfinder](https://www.iconfinder.com/icons/314719/cloud_icon)

## License

This project is licensed under the Apache License - see the [LICENSE](https://github.com/alessandrio/syncing-brackets/blob/master/LICENSE) file for details.
 ```
 by : Alessandrio >> s1dg78hg4df85h1
 ```
