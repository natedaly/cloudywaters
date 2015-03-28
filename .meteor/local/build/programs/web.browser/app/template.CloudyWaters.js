(function(){
Template.body.addContent((function() {
  var view = this;
  return [ Spacebars.include(view.lookupTemplate("loginButtons")), "\n  ", Blaze.If(function() {
    return Spacebars.call(view.lookup("currentUser"));
  }, function() {
    return [ "\n\n  ", HTML.DIV({
      id: "messages"
    }, "\n    ", Blaze.View("lookup:messages", function() {
      return Spacebars.mustache(view.lookup("messages"));
    }), "\n  "), "\n\n  ", HTML.DIV({
      id: "northRoom"
    }, "\n    ", Blaze._TemplateWith(function() {
      return Spacebars.call(view.lookup("northRoom"));
    }, function() {
      return Spacebars.include(view.lookupTemplate("room"));
    }), "\n  "), "\n\n  ", HTML.DIV({
      id: "westRoom"
    }, "\n    ", Blaze._TemplateWith(function() {
      return Spacebars.call(view.lookup("westRoom"));
    }, function() {
      return Spacebars.include(view.lookupTemplate("room"));
    }), "\n  "), "\n\n  ", HTML.DIV({
      id: "currentRoom"
    }, "\n    ", Blaze._TemplateWith(function() {
      return Spacebars.call(view.lookup("currentRoom"));
    }, function() {
      return Spacebars.include(view.lookupTemplate("room"));
    }), "\n  "), "\n\n  ", HTML.DIV({
      id: "eastRoom"
    }, "\n    ", Blaze._TemplateWith(function() {
      return Spacebars.call(view.lookup("eastRoom"));
    }, function() {
      return Spacebars.include(view.lookupTemplate("room"));
    }), "\n  "), "\n\n  ", HTML.DIV({
      id: "southRoom"
    }, "\n    ", Blaze._TemplateWith(function() {
      return Spacebars.call(view.lookup("southRoom"));
    }, function() {
      return Spacebars.include(view.lookupTemplate("room"));
    }), "\n  "), "\n  \n  ", HTML.FORM({
      id: "prompt"
    }, "\n    ", HTML.INPUT({
      type: "text",
      name: "command",
      placeholder: "Enter a command",
      autofocus: ""
    }), "\n  "), "\n\n  " ];
  }) ];
}));
Meteor.startup(Template.body.renderToDocument);

Template.__checkName("room");
Template["room"] = new Template("Template.room", (function() {
  var view = this;
  return HTML.DIV({
    "class": "room"
  }, "\n    ", HTML.DIV({
    "class": "roomName"
  }, "\n      ", Blaze.View("lookup:name", function() {
    return Spacebars.mustache(view.lookup("name"));
  }), "\n    "), "\n    ", HTML.DIV({
    "class": "roomDesc"
  }, "\n      ", Blaze.View("lookup:desc", function() {
    return Spacebars.mustache(view.lookup("desc"));
  }), "\n    "), "\n    ", HTML.DIV({
    "class": "exits"
  }, "\n      ", Blaze.If(function() {
    return Spacebars.call(view.lookup("hasExits"));
  }, function() {
    return [ "\n        ", HTML.SPAN({
      "class": "label"
    }, "Exits: "), "\n      " ];
  }), "\n      ", Blaze.If(function() {
    return Spacebars.call(view.lookup("north"));
  }, function() {
    return "North";
  }), "\n      ", Blaze.If(function() {
    return Spacebars.call(view.lookup("south"));
  }, function() {
    return "South";
  }), "\n      ", Blaze.If(function() {
    return Spacebars.call(view.lookup("east"));
  }, function() {
    return "East";
  }), "\n      ", Blaze.If(function() {
    return Spacebars.call(view.lookup("west"));
  }, function() {
    return "West";
  }), "\n    "), "\n    ", HTML.DIV({
    "class": "playerList"
  }, "\n      ", Blaze.Each(function() {
    return Spacebars.call(view.lookup("playerList"));
  }, function() {
    return [ "\n        ", HTML.DIV(Blaze.View("lookup:.", function() {
      return Spacebars.mustache(view.lookup("."));
    }), " is standing here."), "\n      " ];
  }), "\n    "), "\n  ");
}));

})();
