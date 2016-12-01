/**
 * Created by JohnBae on 8/21/16.
 */
(function(element, parent, dragHandler, resizeHandler, options){

    var interact = require("interact.js/dist/interact.js");

    if(!options){
        options = {preventDefault: 'never'};
    }

    this.interact  = function(){
        var widget_interact = interact(element, options)
            .draggable({
                inertia:true,
                snap: {
                    targets: [
                        interact.createSnapGrid({ x: Layout.cellWidth+Layout.cellOffset, y: Layout.cellHeight+Layout.cellOffset })
                    ],
                    offset: { x: 2, y: 2 },
                    range: Infinity,
                    relativePoints: [ { x: 0, y: 0 } ],
                    endOnly: true
                },
                restrict: {
                    restriction: document.getElementById('parent'),
                    elementRect: { top: 0, left: 0, bottom: 1, right: 1 },
                    endOnly: true
                },
                onstart: function(event){

                    Layout.reset();
                    Layout.setCollider(event.target);

                    var target = event.target;

                    var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
                    var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

                    target.setAttribute("data-start_x", x);
                    target.setAttribute("data-start_y", y);

                    target.style.webkitTransition =  "all 0s ease ";
                    target.style.zIndex = 10;

                    Layout.toggle(true);
                },
                onmove: function(event) {
                    dragMoveListener(event);
                },
                onend: function (event) {
                    var target = event.target;

                    var viewportOffset = target.getBoundingClientRect();
                    var y = viewportOffset.top || 0;
                    var x = viewportOffset.left || 0;

                    target.style.webkitTransition =  "all .5s ease";
                    target.style.zIndex = 1;

                    if(!Layout.isValidHome(target)){
                        var x = target.getAttribute("data-start_x");
                        var y = target.getAttribute("data-start_y");

                        target.style.webkitTransform = 'translate(' + x + 'px, ' + y + 'px)';

                        target.setAttribute('data-x', x);
                        target.setAttribute('data-y', y);
                    }

                    Layout.reset();

                }
            })
            .on("draginertiastart", function(event){
                Layout.toggle(false);
            })
            .resizable({
                invert: 'none',
                inertia:true,
                square: false,
                preserveAspectRatio: false,
                edges: { left: false, right: true, bottom: true, top: false },
                snap: {
                    targets: [
                        interact.createSnapGrid({ x: Layout.cellWidth+Layout.cellOffset, y: Layout.cellHeight+Layout.cellOffset })
                    ],
                    offset: { x: 2, y: 2 },
                    range: Infinity,
                    relativePoints: [ { x: 0, y: 0 } ],
                    endOnly: true
                },
                restrict: {
                    restriction: document.getElementById("grid"),
                    endOnly: true
                },
                onstart: function(event){

                    var target = event.target;

                    Layout.reset();
                    Layout.setCollider(target);

                    target.setAttribute("data-start_width", event.rect.width);
                    target.setAttribute("data-start_height", event.rect.height);

                    target.style.webkitTransition =  "all 0s ease";

                    Layout.toggle(true);
                },
                onmove: function(event){
                    dragResizeListener(event);
                },
                onend: function(event){
                    var target = event.target;

                    target.style.webkitTransition =  "all 0.5s ease";

                    if(!Layout.isValidHome(target)){
                        var width = target.getAttribute("data-start_width");
                        var height = target.getAttribute("data-start_height");

                        target.style.width  = width + 'px';
                        target.style.height = height + 'px';
                    }

                    Layout.reset();
                }
            })
            .on("resizeinertiastart", function(event){
                Layout.toggle(false);
            })
            .actionChecker(function (pointer, event, action, interactable, element, interaction) {
                if(action.name=='drag'){
                    if(event.target.className == 'widgetToolbar' || event.target.className == 'widgetToolbarTitle'){
                        action.name = 'drag';
                    }
                    else{
                        return null;
                    }
                }
                else if(action.name=='resize'){
                }
                return action;
            })
            .origin('parent');

        var dragResizeListener = function(event){
            var target = event.target,
                x = (parseFloat(target.getAttribute('data-x')) || 0),
                y = (parseFloat(target.getAttribute('data-y')) || 0);

            target.style.width  = event.rect.width + 'px';
            target.style.height = event.rect.height + 'px';

            if(event.rect.width>Layout.cellWidth-Layout.cellOffset){
                x += event.deltaRect.left;
            }
            if(event.rect.height>Layout.cellHeight-Layout.cellOffset){
                y += event.deltaRect.top;
            }
            target.style.webkitTransform = target.style.transform = 'translate(' + x + 'px,' + y + 'px)';

            Layout.dragWidget(target);
            Layout.freePushed();

            target.setAttribute('data-x', x);
            target.setAttribute('data-y', y);

            if(Layout.findWidget(target.id).resizeListener!=null) Layout.findWidget(target.id).resizeListener();
        };

        var dragMoveListener = function(event) {

            var target = event.target,
                x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
                y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

            target.style.webkitTransform = 'translate(' + x + 'px, ' + y + 'px)';

            target.setAttribute('data-x', x);
            target.setAttribute('data-y', y);

            if(event.velocityX<750&&event.velocityY<750){
                Layout.dragWidget(target);
            }
            Layout.freePushed();
        };

        return widget_interact;
    };

})()
