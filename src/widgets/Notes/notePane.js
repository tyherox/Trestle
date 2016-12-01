/**
 * Created by JohnBae on 8/21/16.
 */

import React from 'react';
import ReactDOM from 'react-dom';
import Note from './note';
import zenscroll from 'zenscroll';

var NotePane = React.createClass({

    getInitialState: function() {
        var notes = this.props.config.get('notes');
        console.log("NOTES",notes);
        if(!notes) notes = [];
        return {notes: notes, dragging: false, viewHeight: 0, selector: 'none'};
    },
    componentDidUpdate(){
        this.props.config.set('notes',this.state.notes);
    },
    createId: function(){
        var i = 0;
        var existing = [];
        this.state.notes.forEach(function(note){
            existing.push(note.id);
        })
        while(existing.indexOf(i)!=-1){
            i++;
        };
        return i;
    },
    setDrag: function(collider, state, coord){
        var self = this,
            notes = self.state.notes,
            cOrder = collider.props.order,
            y = coord ? coord.y : 0;

        notes.forEach(function(note, i){
            if(note.order==cOrder){
                note.drag = state;
                if(!state) {
                    var scroller = zenscroll.createScroller(self.refs.scrollPane, 750, 0)
                    scroller.toY(note.top - note.height);
                }
            }
            else if(note.order<cOrder) y -= 30;
            note.reorder = state;
        });

        if(state) {
            coord = {y: y};
            this.setState({notes:notes, dragging: coord});
        }
        else this.setState({notes:notes, dragging: null});
    },
    toggle: function(noteArg, state){
        var notes = this.state.notes,
            id = noteArg.props.id;
        notes.forEach(function(note){
            if(id==note.id) note.toggleState = state;
        })
        this.setState({notes:notes});
    },
    updateHeight: function(id, height){
        var notes = this.state.notes,
            viewHeight = 0;

        notes.forEach(function(note){
            if(id==note.id) {
                note.height = height;
            }
            viewHeight += note.height + 5;
        })

        this.setState({notes:notes});
        if(!this.state.dragging) this.setState({viewHeight: viewHeight});
    },
    addNote: function(){
        var note = {
            id:this.createId(),
            order: this.state.notes.length,
            drag: false,
            reorder: false,
            toggleState: true,
            height: 100,
            visible: true
        };
        var notes = this.state.notes;
        var newNotes = notes.concat([note]);

        this.setState({notes: newNotes, viewHeight: this.state.viewHeight + 105, selector: 'none'});

        var scroll = zenscroll.createScroller(this.refs.scrollPane, 750, 0)
        scroll.toY(this.state.viewHeight + 60);
    },
    removeNote: function(elem){
        var notes = this.state.notes;
        var i = notes.length;
        while(i--){
            var note = notes[i];
            if(note.id==elem.props.id){
                notes.splice(i,1);
            }
            else if(note.order>elem.props.order){
                --note.order;
            }
        }
        var cut = notes.height ? notes.height + 5 : 105;
        this.setState({notes:notes, viewHeight: this.state.viewHeight - cut});
    },
    moveNote: function(from, to){
        var notes = this.state.notes,
            neighbor= true;

        if(Math.abs(from-to)!=1)  neighbor = false;

        notes.forEach(function(note){
            if(neighbor){
                if(note.order == from){
                    note.order = to;
                }
                else if(note.order == to){
                    note.order = from;
                }
            }
            else{
                if(note.drag) note.order = to;
                else if(note.order == from){
                    if(from > to)  note.order--;
                    else  note.order++;
                }
                else if(note.order == to){
                    if(from < to)  note.order--;
                    else  note.order++;
                }
                else if(note.order<from && note.order>to)note.order++;
                else if((note.order<to && note.order>from))note.order--;
            }

        })
        this.setState({notes:notes});
    },
    search: function(){
        var value = this.refs.search.value;awe
        this.setState({selector:value});
    },
    render: function() {
        return (
            <div id = 'id2'>
                <input id = 'id2-inputField'
                       ref = 'search'
                       onChange = {this.search}
                       className = 'inputField themeTextColor themeSecondaryColor'></input>
                <div id = 'id2-scrollPane' ref = 'scrollPane'>
                    <NoteList notes={this.state.notes}
                              selector = {this.state.selector}
                              dragging = {this.state.dragging}
                              viewHeight = {this.state.viewHeight}
                              updateHeight = {this.updateHeight}
                              removeNote = {this.removeNote}
                              moveNote = {this.moveNote}
                              toggle = {this.toggle}
                              setDrag = {this.setDrag}
                              ref = 'noteList'/>
                </div>
                <button id = 'id2-addButton'
                        onClickCapture={this.addNote}> + </button>
            </div>
        );
    }
});

var NoteList = React.createClass({
    overlap: function intersectRect(r1, r2) {
    return !(r2.left > r1.right ||
    r2.right < r1.left ||
    r2.top > r1.bottom ||
    r2.bottom < r1.top);
    },
    componentDidUpdate: function() {
        this.refs.noteList.style.height = this.props.viewHeight + "px";
    },
    componentDidMount: function() {
        this.refs.noteList.style.height = this.props.viewHeight + "px";
    },
    collisionHandler: function(collider, event){
        if(this.props.dragging){
            var height = 100;
            for(var i = 0; i<this.props.notes.length; i ++){
                var note = this.props.notes[i];
                var height = (note.toggleState && !note.reorder) ? note.height + 5: 30;
                var top = note.top - 100;
                if(top + 5<event.clientY && top + height - 5>event.clientY && collider.props.id!= note.id){
                    collider.props.moveNote(collider.props.order, note.order);
                    break;
                }
            }
        }
    },
    render: function() {

        var i = 0, self = this,
            search = this.props.selector,
            collisionHandler = this.collisionHandler,
            top = 0,
            totalTop = this.props.dragging ? this.props.dragging.y: 100;

        var notes = this.props.notes.slice();
        this.props.notes.forEach(function(note){
            notes[note.order] = note;
            if(self.refs[note.id]){
                var content = self.refs[note.id].state.editorState.getCurrentContent().getPlainText('\n').toLowerCase();
                if(content.indexOf(search)==-1 && self.props.selector!='none'){
                    note.visible = false;
                }
                else {
                    note.visible = true;
                }
            }
        })
        notes.forEach(function(note){
            top = totalTop;
            if(!note.visible) totalTop += 0;
            else if(note.toggleState && !note.reorder) totalTop += note.height + 5;
            else totalTop += 30;
            note.top = top;
        })
        notes = this.props.notes.map(function(note,i){
            return (
                <Note key = {note.id}
                      ref = {note.id}
                      top = {note.top}
                      left = {0}
                      order = {note.order}
                      drag = {note.drag}
                      reorder = {note.reorder}
                      id = {note.id}
                      height = {note.height}
                      toggleState = {note.toggleState}
                      visible = {note.visible}
                      updateHeight = {self.props.updateHeight}
                      toggle = {self.props.toggle}
                      removeNote = {self.props.removeNote}
                      moveNote = {self.props.moveNote}
                      setDrag = {self.props.setDrag}
                      overlap = {self.collisionHandler}/>
            );
        });

        return (
            <div id = 'id2-noteList'
                 ref="noteList">
                {notes}
            </div>
        );
    }
})

Array.prototype.move = function(from, to) {
    this.splice(to, 0, this.splice(from, 1)[0]);
};

module.exports = function(config){
    return <NotePane config = {config}/>;
}
