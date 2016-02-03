/**
 * SortableTree
 *
 * A simple, touchscreen-friendly, no-dependencies sortable/nestable tree
 *
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Patrick Fox
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define([], factory);
    } else if (typeof exports === "object") {
        module.exports = factory();
    } else {
        root.SortableTree = factory();
    }
}(
    this,
    function () {
        // Constructor
        var S = function( element, option ){
            this.o = {
                ev: 'click', // 'Click' event to listen for
                el: 'li' // Parent element that will be moved
            }
            
            this.element = $(element)[0];

            var el = this.element;
            var items = $(this.element).find( 'li' );

            for ( var i = 0; i < items.length; i++ ) {
                // Create button
                var button = $('<div class="button move">Move</div><div class="button select">Select</div>');

                // Prepend button to element
                $( items[ i ] ).prepend( button );
            }

            // Bind click event
            $( this.element ).find( '.button.move' ).on( this.o.ev, $.proxy( this.StartMove, this ));
            $( items ).addClass( 'sortable-nested-item' );
            $( this.element ).find( '.button.select' ).on( this.o.ev, $.proxy( this.Select, this ) );
        }
        S.prototype.StartMove = function( event ){
            var buttons = $( this.element ).find( '.button.move' );

            // Add class to all elements
            $( '.sortable-nested-item' ).addClass( 'sortable-nested-is-target' );
            // Remove from this element's parent
            var parent = $( event.target ).closest( '.sortable-nested-item' );
            $( parent ).removeClass( 'sortable-nested-is-target' );
            this.current_item = parent;
        }
        S.prototype.Select = function( event ){
            // Get parent
            var parent = $( event.target ).closest( '.sortable-nested-item' );
            // Remove from this element's parent
            $( '.sortable-nested-item' ).removeClass( 'sortable-nested-is-selected' );
            $( parent ).addClass( 'sortable-nested-is-selected' );

            // Create buttons
            var button = $('<div class="button before">Insert before</div><div class="button after">Insert after</div><div class="button child">Insert as child</div>');

            // Prepend button to element
            parent.prepend( button );
            parent.find( '.button.after' ).on( this.o.ev, $.proxy( this.InsertAfter, this ) );
            parent.find( '.button.before' ).on( this.o.ev, $.proxy( this.InsertBefore, this ) );
            parent.find( '.button.child' ).on( this.o.ev, $.proxy( this.InsertAsChild, this ) );
        }
        S.prototype.InsertAfter = function(  ){
            this.current_item.insertAfter( $( this.element ).find( '.sortable-nested-is-selected' ) );
            this.ClearUp();
        }
        S.prototype.InsertBefore = function(  ){
            this.current_item.insertBefore( $( this.element ).find( '.sortable-nested-is-selected' ) );
            this.ClearUp();
        }
        S.prototype.InsertAsChild = function(){
            var child_list = $( this.element ).find( '.sortable-nested-is-selected' ).find( '> ul' );
            if ( child_list.length == 0 ) {
                var child_list = $( '<ul></ul>' );
                $( this.element ).find( '.sortable-nested-is-selected' ).append( child_list );
            }

            child_list.append( this.current_item );
            this.ClearUp();
        }
        S.prototype.ClearUp = function(){
            $( this.element ).find( '.button.before,.button.after,.button.child' ).remove();
            $( this.element ).find( 'li' ).removeClass( 'sortable-nested-is-selected sortable-nested-is-target' );
        }
        return S;
    }
));