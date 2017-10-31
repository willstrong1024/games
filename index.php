<!DOCTYPE html>
<html>
<head>
  <!-- Global site tag (gtag.js) - Google Analytics -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=UA-109032066-1"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());

    gtag('config', 'UA-109032066-1');
  </script>
  <meta charset="UTF-8">
  <title>William Strong</title>
  <style>
    html, body {
      margin: 0;
      overflow: hidden;
    }
  </style>
</head>
<body>
  <canvas id="game-canvas"></canvas>
  <?php
    $files = glob("*.js");
    $random_file = $files[array_rand($files)];
    echo "<script src=" . $random_file . "></script>";
  ?>
</body>
</html>
