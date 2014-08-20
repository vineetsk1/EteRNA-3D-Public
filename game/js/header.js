
// 1 ) Event when you hover over the links that have several menu items
// When you hover over, hide all other popups and show yours
var navElements = document.getElementsByClassName("link multi");

for(var i = 0; i < navElements.length; i++) {
  var obj = navElements[i];
  obj.setAttribute('id', i+"_navElem");
      
  obj.onmouseover = function() {
    var m = document.getElementsByClassName("popupmenu rounded10");
    
    for(var i = 0; i < m.length; i++) {
      m[i].style.display = "none";
    }
        
    m[this.id.substring(0, this.id.indexOf("_"))].style.display = "block";
  }
}

// 2 ) Event when you leave the popup menu item
// When you leave, check back in 50 ms to see if you actually left,
// due to faulty event firing.
navElements = document.getElementsByClassName("popupmenu rounded10");
    
var exitedNav = null;
    
for(var i = 0; i < navElements.length; i++) {

  navElements[i].onmouseover = function() {
    this.setAttribute('id', 1);
  }

  navElements[i].onmouseout = function() {
    this.setAttribute('id', 0);
    exitedNav = this;
    setTimeout(function() {
      if(exitedNav.id == 0) exitedNav.style.display = "none";
    }, 50);
  }
}