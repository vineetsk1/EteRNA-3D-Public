document.getElementById("toggleRotate").onclick = function() {
  if(this.checked) {
    colorDisplay(1);
  } else {
    colorDisplay(0);
  }
}

document.getElementById("toggleBone").onclick = function() {
  if(this.checked) {
    toggleBackBone(1);
  } else {
    toggleBackBone(0);
  }
}

var s_a = document.getElementById("show_a");
var s_b = document.getElementById("show_b");
var s_c = document.getElementById("show_ab");
var s_d = document.getElementById("displayInfo1");

s_a.onclick = function() {
    s_d.innerHTML = "Display: Atoms";
    s_a.className = "toggleDisplayType active";
    s_b.className = "toggleDisplayType";
    s_c.className = "toggleDisplayType";
    toggleBondsAtoms(0);
}

s_b.onclick = function() {
    s_d.innerHTML = "Display: Bonds";
    s_b.className = "toggleDisplayType active";
    s_a.className = "toggleDisplayType";
    s_c.className = "toggleDisplayType";
    toggleBondsAtoms(1);
}

s_c.onclick = function() {
    s_d.innerHTML = "Display: All";
    s_c.className = "toggleDisplayType active";
    s_b.className = "toggleDisplayType";
    s_a.className = "toggleDisplayType";
    toggleBondsAtoms(2);
}

  function toggleBondsAtoms(type) {
    displayType = type;
    for(var i = 0; i < models.length; i++) {
      scene.remove(models[i].particles);
      for(var j = 0; j < models[i].bonds.length; j++) scene.remove(models[i].bonds[j]);
      if(displayType != 1) { scene.add(models[i].particles); }
      if(displayType != 0) {
        for(var j = 0; j < models[i].bonds.length; j++) scene.add(models[i].bonds[j]);
      }
    }
  }

// 0 = default = red,green,blue,yellow for GUAC
  // 1 = set to element color
  function colorDisplay(type) {
    colorType = type;
    if(type == 1) {
      for(var i = 0; i < models.length; i++) {
        for(var j = 0; j < models[i].colors.length; j++) {
          if(models[i].colors[j].r != 0.5 || models[i].colors[j].g != 1 || models[i].colors[j].b != 0.5)
            models[i].colors[j].setRGB(models[i].colorscopy[j].r, models[i].colorscopy[j].g, models[i].colorscopy[j].b);
        }
        for(var j = 0; j < models[i].bonds.length; j++) {
          if(models[i].bonds[j].material !== models[i].lineMaterial[5]) {
            scene.remove(models[i].bonds[j]);
            var rType = models[i].bonds[j].residueType;
            var rName = models[i].bonds[j].residueName;
            models[i].bonds[j] = new THREE.Line(models[i].lineGeometry[j], models[i].lineMaterial[0], THREE.LinePieces);
            models[i].bonds[j].residueType = rType;
            models[i].bonds[j].residueName = rName;
            if(displayType != 0) scene.add(models[i].bonds[j]);
          }
        }
      }
    } else {
      for(var i = 0; i < models.length; i++) {
        for(var j = 0; j < models[i].colors.length; j++) {
          if(models[i].colors[j].r == 0.5 && models[i].colors[j].g == 1 && models[i].colors[j].b == 0.5) continue;
          if(models[i].types[j] == 'g')         models[i].colors[j].setRGB(0.80, 0.15, 0.00);
          else if(models[i].types[j] == 'u')    models[i].colors[j].setRGB(0.00, 0.36, 0.72);
          else if(models[i].types[j] == 'a')    models[i].colors[j].setRGB(0.99, 0.95, 0.00);
          else if(models[i].types[j] == 'c')    models[i].colors[j].setRGB(0.00, 0.65, 0.00);
        }
        for(var j = 0; j < models[i].bonds.length; j++) {
          if(models[i].bonds[j].material !== models[i].lineMaterial[5]) {
            var mat = models[i].lineMaterial[0];
            var rType = models[i].bonds[j].residueType;
            var rName = models[i].bonds[j].residueName;
            if(rType == 'g') mat = models[i].lineMaterial[1];
            else if(rType == 'u') mat = models[i].lineMaterial[2];
            else if(rType == 'a') mat = models[i].lineMaterial[3];
            else if(rType == 'c') mat = models[i].lineMaterial[4];
            if(startingResidues.indexOf(rName) >= 0) mat = models[i].lineMaterial[8];
            scene.remove(models[i].bonds[j]);
            models[i].bonds[j] = new THREE.Line(models[i].lineGeometry[j], mat, THREE.LinePieces);
            models[i].bonds[j].residueType = rType;
            models[i].bonds[j].residueName = rName;
            if(displayType != 0) scene.add(models[i].bonds[j]);
          }
        }
      }
    }
    for(var i = 0; i < starting.length; i++) {
      var c = models[0].geometry.colors[starting[i]];
      c.setRGB(0.99, 0.99, 0.5);
    } 

    for(var i = 0; i < models.length; i++) {
      if(models[i].isHelix != 2) continue;
      for(var j = 0; j < models[i].geometry.colors.length; j++) {
        models[i].geometry.colors[j].setRGB(0.9, 0.9, 0.9);
      }
      for(var j = 0; j < models[i].bonds.length; j++) {
        models[i].bonds[j].material = models[i].lineMaterial[7];
      }
    }

  }

function holdit(btn, action, start) {
    var t;

    var repeat = function () {
        action();
        t = setTimeout(repeat, start);
    }

    btn.onmousedown = function() {
        repeat();
    }

    btn.onmouseup = function () {
        clearTimeout(t);
    }
};

holdit(document.getElementById("leftArrow"), function () { camera.position.x -=20; }, 5);
holdit(document.getElementById("rightArrow"), function () { camera.position.x +=20; }, 5);
holdit(document.getElementById("upArrow"), function () { camera.position.y -=20; }, 5);
holdit(document.getElementById("downArrow"), function () { camera.position.y +=20; }, 5);
holdit(document.getElementById("lessZoom"), function () { camera.translateZ(20) }, 5);
holdit(document.getElementById("moreZoom"), function () { camera.translateZ(-20) }, 5);

holdit(document.getElementById("scrollSequenceLeft"), function () { document.getElementById('fullsequence').scrollLeft -= 5; document.getElementById('fullsecondarystructure').scrollLeft -= 5; }, 25);
holdit(document.getElementById("scrollSequenceRight"), function () { document.getElementById('fullsequence').scrollLeft += 5; document.getElementById('fullsecondarystructure').scrollLeft += 5; }, 25);
