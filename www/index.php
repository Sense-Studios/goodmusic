<?php
  $request = $_SERVER['REQUEST_URI'];
  
  $url = "http://" . $_SERVER['HTTP_HOST'] . parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
  $title = "The Good Music Company";
  $description = "Music Agency";
  $image = "http://www.goodmusiccompany.com/images/info.jpg";

  $load_artist = strpos($_SERVER['HTTP_USER_AGENT'], "facebook") !== false;

  if(strpos($request, "/artist/") !== FALSE && $load_artist) {
    $artist = explode("/",$url);
    $artist = $artist[count($artist)-1];
    $data = json_decode(file_get_contents("https://goodmusic.firebaseio.com/1-0-0/artists/$artist.json"));
    
    $title = $data->name . ' - The Good Music Company';
    $description = IsSet($data->bio) && IsSet($data->bio->text)? $data->bio->text: $data->news;
    $image = IsSet($data->cover) && IsSet($data->cover->link)? $data->cover->link: $image;
  } 
?><!DOCTYPE html>
<html ng-app="app" class="target-{!target!} fixed-header fixed-footer loading" version="{!version!}">
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="description" content="{!title!}">
  <meta content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0' name='viewport' />
  <meta name="viewport" content="width=device-width" />
  <script type="text/javascript">Firebase = {}</script>
  <script src="{!baseUrl!}app/app.lib.js"></script>
  <script src="{!baseUrl!}app/app.src.js"></script>
  <script src="{!baseUrl!}app/app.views.js"></script>
	<link href="{!baseUrl!}app/app.lib.css" rel="stylesheet"></link>
	<link href="{!baseUrl!}app/app.src.css" rel="stylesheet"></link>
  <meta property="og:url" content="<?php echo $url; ?>"/>
  <meta property="og:title" content="<?php echo htmlspecialchars($title); ?>"/>
  <meta property="og:description" content="<?php echo htmlspecialchars($description); ?>"/>
  <meta property="og:image" content="<?php echo $image; ?>"/>

  <title>{!title!}</title>
  </script>
</head>
<body class="loading">
    <div ui-view="menu"></div>
    <div ui-view="content"></div>
    <div ui-view="footer"></div>
</body>
</html>