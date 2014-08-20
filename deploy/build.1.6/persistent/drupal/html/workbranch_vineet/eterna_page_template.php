<?php
  require_once 'includes/bootstrap.inc';

  drupal_bootstrap(DRUPAL_BOOTSTRAP_SESSION);
  global $user;
  $DEPLOY = false;
  $DEPLOY_VER = 23121222542222;
  $ETERNA_3 = false;
  $ETERNA_3_sols = false;
  if($_SERVER[REQUEST_URI] == "/web/eterna3/puz1/" || $_SERVER[REQUEST_URI] == "/web/eterna3/puz2/" || $_SERVER[REQUEST_URI] == "/web/eterna3/puz3/" || $_SERVER[REQUEST_URI] == "/web/eterna3/sols/") $ETERNA_3 = true; 
  if($_SERVER[REQUEST_URI] == "/web/eterna3/sols/") $ETERNA_3_sols = true; 
  if ($user->uid == -10) {
    $DEPLOY = false;
  }
?>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">

<html>
  <head>      
    <?php if ($ETERNA_3 && !$ETERNA_3_sols): ?>
      <title>EteRNA 3D</title>
      <link href='http://fonts.googleapis.com/css?family=Source+Sans+Pro:400,600' rel='stylesheet' type='text/css'></link>
      <link type="text/css" rel="stylesheet" media="all" href="/<?php print ETERNA_WORKBRANCH_FRONTEND; ?>jscripts/eterna3/styles.css" />

      <script type="text/javascript">

      window.onload = function() {
        // alert("HI");
        setTimeout(function() {
        var script = document.createElement('script'); script.type = 'text/javascript'; script.async = true;
          script.src = "/<?php print ETERNA_WORKBRANCH_FRONTEND; ?>jscripts/eterna3/game.js";
          var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(script, s);
        }, 500);

      }
      </script>
    <?php else: ?>

      <?php if ($ETERNA_3_sols): ?>
        <title>EteRNA 3D</title>
        <link href='http://fonts.googleapis.com/css?family=Source+Sans+Pro:400,600' rel='stylesheet' type='text/css'></link>
        <link type="text/css" rel="stylesheet" media="all" href="/<?php print ETERNA_WORKBRANCH_FRONTEND; ?>jscripts/eterna3/styles.css" />

        <script type="text/javascript">

        window.onload = function() {
          // alert("HI");
          setTimeout(function() {
          var script = document.createElement('script'); script.type = 'text/javascript'; script.async = true;
            script.src = "/<?php print ETERNA_WORKBRANCH_FRONTEND; ?>jscripts/eterna3/sols.js";
            var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(script, s);
          }, 500);

        }
        </script>
      <?php else: ?>
        <title>EteRNA - Played by Humans. Scored by Nature.</title>
      <?php endif; ?>
    <?php endif; ?>

    <?php if ($DEPLOY): ?>
      <link type="text/css" rel="stylesheet" media="all" href="/<?php print ETERNA_WORKBRANCH_FRONTEND; ?>eterna.min.css?ver=<?php print $DEPLOY_VER; ?>" />
      <script type="text/javascript" src="/<?php print ETERNA_WORKBRANCH_FRONTEND; ?>eterna.min.js?ver=<?php print $DEPLOY_VER; ?>"></script>
    <?php else: ?>  
      <!--CSSSTART-->
      <?php if (!$ETERNA_3): ?>
        <link type="text/css" rel="stylesheet" media="all" href="/<?php print ETERNA_WORKBRANCH_FRONTEND; ?>themes/css/eterna.css" />
      <?php endif; ?>
      <link type="text/css" rel="stylesheet" media="all" href="/<?php print ETERNA_WORKBRANCH_FRONTEND; ?>themes/css/jquery-ui.css" />
      <link type="text/css" rel="stylesheet" media="all" href="/<?php print ETERNA_WORKBRANCH_FRONTEND; ?>themes/css/codemirror.css" />
      <!--CSSEND-->
      
      <!--JSSTART-->
      <!-- External javasscripts -->     
      <script type="text/javascript" src="/<?php print ETERNA_WORKBRANCH_FRONTEND; ?>jscripts/jquery/jquery-1.7.2.min.js"></script>
      <script type="text/javascript" src="/<?php print ETERNA_WORKBRANCH_FRONTEND; ?>jscripts/jquery/jquery-unselectable.js"></script>
      <script type="text/javascript" src="/<?php print ETERNA_WORKBRANCH_FRONTEND; ?>jscripts/jquery-ui/jquery-ui-1.8.7.custom.min.js"></script>
      <script type="text/javascript" src="/<?php print ETERNA_WORKBRANCH_FRONTEND; ?>jscripts/json/json2.js"></script>
      <script type="text/javascript" src="/<?php print ETERNA_WORKBRANCH_FRONTEND; ?>jscripts/jquery-form/jquery.form.js"></script>
      <script type="text/javascript" src="/<?php print ETERNA_WORKBRANCH_FRONTEND; ?>jscripts/table/jquery.dataTables.js"></script>
      <script type="text/javascript" src="/<?php print ETERNA_WORKBRANCH_FRONTEND; ?>jscripts/table/jquery.dataTables.columnFilter.js"></script>
      <script type="text/javascript" src="/<?php print ETERNA_WORKBRANCH_FRONTEND; ?>jscripts/table/ColReorder.min.js"></script> 
      <script type="text/javascript" src="/<?php print ETERNA_WORKBRANCH_FRONTEND; ?>jscripts/swfobject.js"></script>
      <script type="text/javascript" src="/<?php print ETERNA_WORKBRANCH_FRONTEND; ?>jscripts/editor/codemirror.js"></script>
      <script type="text/javascript" src="/<?php print ETERNA_WORKBRANCH_FRONTEND; ?>jscripts/editor/javascript.js"></script>
      <script type="text/javascript" src="/<?php print ETERNA_WORKBRANCH_FRONTEND; ?>jscripts/jquery-slides/jquery.slides.min.js"></script>
      
      <!-- Load general poly library -->
      <script type="text/javascript" src="/<?php print ETERNA_WORKBRANCH_FRONTEND; ?>jscripts/application.js"></script>
      <script type="text/javascript" src="/<?php print ETERNA_WORKBRANCH_FRONTEND; ?>jscripts/content.js"></script>
      <script type="text/javascript" src="/<?php print ETERNA_WORKBRANCH_FRONTEND; ?>jscripts/utils.js"></script>
      <script type="text/javascript" src="/<?php print ETERNA_WORKBRANCH_FRONTEND; ?>jscripts/ajaxmanager.js"></script>
      <script type="text/javascript" src="/<?php print ETERNA_WORKBRANCH_FRONTEND; ?>jscripts/callbackmanager.js"></script>
      <script type="text/javascript" src="/<?php print ETERNA_WORKBRANCH_FRONTEND; ?>jscripts/cookiemanager.js"></script>
      <script type="text/javascript" src="/<?php print ETERNA_WORKBRANCH_FRONTEND; ?>jscripts/datamanager.js"></script>
      <script type="text/javascript" src="/<?php print ETERNA_WORKBRANCH_FRONTEND; ?>jscripts/usermanager.js"></script>
      <script type="text/javascript" src="/<?php print ETERNA_WORKBRANCH_FRONTEND; ?>jscripts/packer.js"></script>
      <script type="text/javascript" src="/<?php print ETERNA_WORKBRANCH_FRONTEND; ?>jscripts/packer-gallery.js"></script>
      <script type="text/javascript" src="/<?php print ETERNA_WORKBRANCH_FRONTEND; ?>jscripts/page.js"></script>
      <script type="text/javascript" src="/<?php print ETERNA_WORKBRANCH_FRONTEND; ?>jscripts/block.js"></script>
      <script type="text/javascript" src="/<?php print ETERNA_WORKBRANCH_FRONTEND; ?>jscripts/blockmanager.js"></script>
      <script type="text/javascript" src="/<?php print ETERNA_WORKBRANCH_FRONTEND; ?>jscripts/themecompiler.js"></script>
      <script type="text/javascript" src="/<?php print ETERNA_WORKBRANCH_FRONTEND; ?>jscripts/jquery-polystory.js"></script>
      <script type="text/javascript" src="/<?php print ETERNA_WORKBRANCH_FRONTEND; ?>jscripts/overlay.js"></script>

      <script type="text/javascript" src="/<?php print ETERNA_WORKBRANCH_FRONTEND; ?>jscripts/eterna/eterna-application.js"></script>
      <script type="text/javascript" src="/<?php print ETERNA_WORKBRANCH_FRONTEND; ?>jscripts/eterna/eterna-utils.js"></script>
      <script type="text/javascript" src="/<?php print ETERNA_WORKBRANCH_FRONTEND; ?>jscripts/eterna/builder-comments.js"></script>
      <script type="text/javascript" src="/<?php print ETERNA_WORKBRANCH_FRONTEND; ?>jscripts/eterna/builder-script.js"></script>
      <script type="text/javascript" src="/<?php print ETERNA_WORKBRANCH_FRONTEND; ?>jscripts/eterna/script-library.js"></script>
      <script type="text/javascript" src="/<?php print ETERNA_WORKBRANCH_FRONTEND; ?>jscripts/eterna/script-interface.js"></script>
      <script type="text/javascript" src="/<?php print ETERNA_WORKBRANCH_FRONTEND; ?>jscripts/eterna/builder-etc.js"></script>
      <script type="text/javascript" src="/<?php print ETERNA_WORKBRANCH_FRONTEND; ?>jscripts/eterna/builder-labs.js"></script>
      <script type="text/javascript" src="/<?php print ETERNA_WORKBRANCH_FRONTEND; ?>jscripts/eterna/builder-login.js"></script>
      <script type="text/javascript" src="/<?php print ETERNA_WORKBRANCH_FRONTEND; ?>jscripts/eterna/builder-me.js"></script>
      <script type="text/javascript" src="/<?php print ETERNA_WORKBRANCH_FRONTEND; ?>jscripts/eterna/builder-news.js"></script>
      <script type="text/javascript" src="/<?php print ETERNA_WORKBRANCH_FRONTEND; ?>jscripts/eterna/builder-players.js"></script>
      <script type="text/javascript" src="/<?php print ETERNA_WORKBRANCH_FRONTEND; ?>jscripts/eterna/builder-puzzles.js"></script>
      <script type="text/javascript" src="/<?php print ETERNA_WORKBRANCH_FRONTEND; ?>jscripts/eterna/builder-roadmap.js"></script>
      <script type="text/javascript" src="/<?php print ETERNA_WORKBRANCH_FRONTEND; ?>jscripts/eterna/builder-widgets.js"></script>
      <script type="text/javascript" src="/<?php print ETERNA_WORKBRANCH_FRONTEND; ?>jscripts/eterna/presenter.js"></script>
      <script type="text/javascript" src="/<?php print ETERNA_WORKBRANCH_FRONTEND; ?>jscripts/eterna/roadmap.js"></script>
      <script type="text/javascript" src="/<?php print ETERNA_WORKBRANCH_FRONTEND; ?>jscripts/eterna/builder-blog.js"></script> 
      <script type="text/javascript" src="/<?php print ETERNA_WORKBRANCH_FRONTEND; ?>jscripts/eterna/builder-group.js"></script>
      <script type="text/javascript" src="/<?php print ETERNA_WORKBRANCH_FRONTEND; ?>jscripts/eterna/builder-test.js"></script>
      <script type="text/javascript" src="/<?php print ETERNA_WORKBRANCH_FRONTEND; ?>jscripts/eterna/builder-aayush.js"></script>
      <script type="text/javascript" src="/<?php print ETERNA_WORKBRANCH_FRONTEND; ?>jscripts/eterna/builder-mikebaoprofile.js"></script>
      <script type="text/javascript" src="/<?php print ETERNA_WORKBRANCH_FRONTEND; ?>jscripts/eterna/builder-about.js"></script>
      <script type="text/javascript" src="/<?php print ETERNA_WORKBRANCH_FRONTEND; ?>jscripts/eterna/builder-browser.js"></script>
      
      <script type="text/javascript" src="/<?php print ETERNA_WORKBRANCH_FRONTEND; ?>themes/htmls/eterna.js"></script>
      <script type="text/javascript" src="/<?php print ETERNA_WORKBRANCH_FRONTEND; ?>themes/htmls/lab.js"></script>
      <script type="text/javascript" src="/<?php print ETERNA_WORKBRANCH_FRONTEND; ?>themes/htmls/designbrowser.js"></script> 
      <script type="text/javascript" src="/<?php print ETERNA_WORKBRANCH_FRONTEND; ?>themes/htmls/propose.js"></script> 
      <script type="text/javascript" src="/<?php print ETERNA_WORKBRANCH_FRONTEND; ?>themes/htmls/news.js"></script>  
      <script type="text/javascript" src="/<?php print ETERNA_WORKBRANCH_FRONTEND; ?>themes/htmls/player.js"></script> 
      <script type="text/javascript" src="/<?php print ETERNA_WORKBRANCH_FRONTEND; ?>themes/htmls/puzzle.js"></script>
      <script type="text/javascript" src="/<?php print ETERNA_WORKBRANCH_FRONTEND; ?>themes/htmls/roadmap.js"></script>
      <script type="text/javascript" src="/<?php print ETERNA_WORKBRANCH_FRONTEND; ?>themes/htmls/blog.js"></script>
      <script type="text/javascript" src="/<?php print ETERNA_WORKBRANCH_FRONTEND; ?>themes/htmls/group.js"></script>
      <script type="text/javascript" src="/<?php print ETERNA_WORKBRANCH_FRONTEND; ?>themes/htmls/script.js"></script>
      <script type="text/javascript" src="/<?php print ETERNA_WORKBRANCH_FRONTEND; ?>themes/htmls/secretSetter.js"></script>
      <script type="text/javascript" src="/<?php print ETERNA_WORKBRANCH_FRONTEND; ?>themes/htmls/eterna3d.js"></script>

      <!--JSEND-->

    <?php endif; ?>     
    
    <script src="http://connect.facebook.net/en_US/all.js"></script>  
    
    <script type="text/javascript">
      <?php
        include_once(ETERNA_WORKBRANCH_BACKEND."eterna_autoload.php");
      
        if($user->uid) {
          $data = array();
          $user_model = new EternaUserModel();
          $data['user'] = $user_model->get_user($user->uid);
          $user_data = json_encode($data);
          print "DataManager.stash_data($user_data);";
        }
        
      ?>
      Application.initialize();
      var synTable = null;
    </script>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">

  </head>

  <body>    
  </body>
</html>

