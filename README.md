Eterna 3D
=======

This page contains all of the documentation information about the Eterna 3D game developed by Vineet Kosaraju. This documentation is divided into several sections:

1. Introduction
* Getting started
* Running the game locally
* Deploying to the development servers
* Feature Requests
* Documentation


This page was last updated on *Wednesday August 20, 2014.*

Introduction
---------------

Eterna 3D is a early development version of **the** next generation Eterna game: utilizing 3D RNA motifs to solve 3D design puzzles.

Currently, the project is in its infancy, so we need feedback from the Eterna community to make changes that will reflect better game play and ease of use.
 
In the first game puzzle we will examine a key design challenge of building structural scaffolds to stabilize either a specific motif or the ligand-binding pocket of the FMN binding aptamer. 

Both scaffolds require building a segment of RNA from one base pair to another to build a continuous strand of RNA. That’s where the game challenge comes in: we have a large library of RNA 3D motifs that can be strung together to build a segment that can connect these two base pairs.

The combination space though is very large and its difficult to find a possible solution as large number of motifs are required. We hope that although difficult for a computer this may be doable and fun for people to do.  
 
After collecting solutions from players, a project will be made on Eterna to synthesize the top solutions. 

Keep in mind that the maximum number of total residues is 90 for a solution to be accepted on Eterna. Some of these larger ones might be made individually in the Das Lab. 

Try and apply the rules of design developed on Eterna to maximize the probability that solutions will fold correctly.
 
If you are interested, make sure that you are using a recent browser when playing the game. It requires WebGL, so also make sure that your browser supports it. Check out the following test to see if your browser supports WebGL: if you do not see a spinning cube, follow the instructions.

[WebGL Test >][getwebgl] 

Getting Started
---------------

Downloading the code is very simple since everything is hosted on GitHub (a public Git repository provider). Just clone the repo using the following code.

```bash
  git clone https://github.com/vineetsk1/EteRNA-3D-Public.git
```

Running the game locally
---------------

To run the server locally, you will need to have PHP installed. If you have a Mac, this comes installed by default on later computers. You can either use MAMP (if already installed) and start a server, then navigate to the directory where you downloaded the code, or you can use the default PHP installation to start a simple server. 

```bash
$ cd /path/to/repository
$ php -S 0.0.0.0:8080 -t .
```

Feel free to replace **0.0.0.0** with your server name and **8080** with your port. The default port for HTTP connections is 80, but you will need to authenticate with sudo first. If you decide to use PHP (no install required), then you should see an output similar to this:

```bash
PHP 5.4.24 Development Server started at Mon Aug  4 13:14:14 2014
Listening on http://0.0.0.0:8080
Document root is /Users/VineetK/Desktop/Eterna/Documentation
Press Ctrl-C to quit.
[Mon Aug  4 13:14:19 2014] 127.0.0.1:61044 [200]: /
[Mon Aug  4 13:14:20 2014] 127.0.0.1:61045 [404]: /favicon.ico - No such file or directory
```

Deploying to dev servers
---------------

First, go to your local repo and make a folder that will contain all your development builds. Inside that folder, make the following structure:

```
Alpha Build {VERSION NUM}
----- persistent  
---------- drupal  
--------------- html  
-------------------- workbranch_vineet  
------------------------- backend  
------------------------------ eterna_post_controller.php  
------------------------- frontend  
------------------------------ jscripts  
----------------------------------- eterna3  
---------------------------------------- ball.png  
---------------------------------------- game.js  
---------------------------------------- puzzle.png  
---------------------------------------- styles.css  
---------------------------------------- motifs  
---------------------------------------- solutions  
------------------------------ themes  
----------------------------------- htmls  
---------------------------------------- eterna3d.html  
------------------------- eterna_page_template.php  
```
Once you have made this structure, create the build by doing these tasks, in order:

- Replace eterna_post_controller.php with the local code to upload the puzzle solution.
- Replace eterna_page_template.php with the remote eterna_page_template using scp.
- Replace ball.png with the ball image from the local repo.
* Replace puzzle.png with the puzzle image from the local repo.
* Replace motifs with the entire motifs directory from the local repo.
* Go through the local index.html and copy and paste the styles for each css file linked to in the head into a new file called styles.css. Make sure the styles are pasted in order.
* Replace styles.css from the alpha build with the styles.css that you just made.
* Go through the local index.html and copy and paste the javascript for each js file and js code inside the body into a new file called game.js. Make sure that the scripts are pasted in order.
* Replace game.js from the alpha build with the game.js that you just made.
* Inside game.js goto the loadFile function inside PDBParser. Add the workbranch url to each loadAjaxFile function call, like so:

```js
this.loadAjaxFile("/workbranch_vineet/frontend/jscripts/eterna3/" + url, pdbCallback, 1, this);
this.loadAjaxFile("/workbranch_vineet/frontend/jscripts/eterna3/" + url.substring(0, url.lastIndexOf("/")) +"/ref_frames.dat", datCallback, 0, this);
this.loadAjaxFile("/workbranch_vineet/frontend/jscripts/eterna3/" + url.substring(0, url.lastIndexOf(".pdb")) + "_dssr.out", dssrCallback, 2, this);  
```

* Inside game.js goto the init function inside the main game code. Add the workbranch url when initializing the ball sprite:

```js
    sprite = THREE.ImageUtils.loadTexture("/workbranch_vineet/frontend/jscripts/eterna3/ball.png");
```

* Inside game.js goto the motif thumbnail loader code. Change it so that it uses the workbranch url when defining `imgurl`:

```js
  var imgurl = "/workbranch_vineet/frontend/jscripts/eterna3/" + url.substring(0, url.lastIndexOf("/")) + "/thumb.png";
```

* Replace index.html with the index.html from the remote repo.
* Replace the main block code of the alpha build index.html with the body code from the local index.html
* Make sure to close all tags in the index.html, such as `img` and `input`
* Make sure to remove all comments from index.html
* Change the style of `sequenceContainer` so that it has a `position` that is `fixed`, not `absolute`.
* Make sure to give the header the following style:

```html
  <div id="header" style="position: absolute; left: 0;">
```

Upload all the files individually using scp. Test by accessing `http://vineet.eternadev.org/web/eterna3/puz1/`

[View Development Build >][devbuild]

Feature Requests
---------------

#### Undo Hotkey (Eli Fisker)

There are several places to check possible player feature requests.

* [Github](https://github.com/vineetsk1/EteRNA-3D-Public/issues)
* [Getsat](https://getsatisfaction.com/eternagame/topics/your_gaming_ideas_for_our_3d_rna_game#reply_14655642)
* [EteRNA Blog](http://eterna.cmu.edu/web/blog/4911838/)
* [EteRNA News](http://eterna.cmu.edu/web/news/4911883/)


[getwebgl]: http://get.webgl.org/
[devbuild]: http://vineet.eternadev.org/web/eterna3/puz1/

Documentation
---------------

There are also a few places to view the documentation. Check out the functions in this repo:

* [Youtube](https://www.youtube.com/watch?v=jT4c2dFzb6c)
* `docs/index.html`
