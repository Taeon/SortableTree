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
                el: 'li', // Parent element that will be moved
                nestable: true,
                id:'id'
            }
            for ( index in option ) {
				this.o[ index ] = option[index];
			}
            
            this.element = $(element)[0];

			if ( this.o.nestable ) {
				$( this.element ).addClass( 'sortable-tree-nestable' );
			}
			
            var el = this.element;
            
            $( el ).addClass( 'sortable-tree-list' );
            var items = $(this.element).find( 'li' );

            for ( var i = 0; i < items.length; i++ ) {
                // Create button
                var button = $('<div class="sortable-tree-button select">Move</div>');

                // Prepend button to element
                $( items[ i ] ).prepend( button );
            }

            // Bind click event
            $( items ).addClass( 'sortable-tree-item' );
            $( this.element ).find( '.sortable-tree-button.select' ).on( this.o.ev, $.proxy( this.SelectClick, this ) );
            
            var target = this.element;
            
            this.on = target.addEventListener.bind(target);
            this.off = target.removeEventListener.bind(target);
            var dispatch = target.dispatchEvent.bind(target);
            this.trigger = function( event_type, params ){
                
                var detail = {};
                var bubbles = false;
                var cancelable = false;
                for ( var index in params ) {
                    switch ( index ) {
                        case 'bubbles':{
                            bubbles = params[ index ];
                            break
                        }
                        case 'cancelable':{
                            cancelable = params[ index ];
                            break
                        }
                        default:{
                            detail[ index ] = params[ index ];
                            break;
                        }
                    }
                }
                
                var evt = new CustomEvent(
                    event_type,
                    {
                        bubbles: bubbles,
                        cancelable: cancelable,
                        detail:detail
                    }
                );
                dispatch(evt);
            }            
        }
        
        S.prototype.SelectClick = function( event ){
            var source = $( event.target ).closest( '.sortable-tree-item' );
            
			if ( source.hasClass( 'sortable-tree-is-disabled' ) ) {
				this.trigger( 'selected-item-is-disabled' );
				return;
			}
			
            if ( source.hasClass( 'sortable-tree-is-target' ) ) {
                // Select item to be moved next to
            
                // Reset, in case you're clicking another element after already having selected one
                $( this.element ).find( '.sortable-tree-item' ).removeClass( 'sortable-tree-is-selected' );
				$( this.element ).find( '.sortable-tree-item-clone,.sortable-tree-children-clone ' ).remove();

				// Show it's selected
                $( source ).addClass( 'sortable-tree-is-selected' );

                // Create clones

				// Insert before
				var clone_before = this.current_item.clone();
				clone_before.addClass( 'sortable-tree-item-clone before' ).removeClass( 'sortable-tree-is-source' ).insertBefore(source);
				clone_before.find( '.sortable-tree-button.select' ).on( this.o.ev, $.proxy( this.InsertBefore, this ) );

				// Insert after
				var clone_after = this.current_item.clone();
				clone_after.addClass( 'sortable-tree-item-clone after' ).removeClass( 'sortable-tree-is-source' ).insertAfter(source);
				clone_after.find( '.sortable-tree-button.select' ).on( this.o.ev, $.proxy( this.InsertAfter, this ) );
				
				// Insert as child
                if( this.o.nestable ){
					var clone_child = this.current_item.clone();
					clone_child.find( '.sortable-tree-button.select' ).on( this.o.ev, $.proxy( this.InsertAsChild, this ) );
					if ( $( source ).find( '> ul' ).length == 0 ) {
						$( source ).append( '<ul class="sortable-tree-children-clone"></ul>' );
					}
					clone_child.addClass( 'sortable-tree-item-clone after' ).removeClass( 'sortable-tree-is-source' ).appendTo($( source ).find( '> ul' ));
                };
				
				this.trigger( 'target-selected', {tree:this, item:this.current_item,target:source} );
            } else if( source.hasClass( 'sortable-tree-is-source' ) ) {
                // Cancel move
                this.ClearUp();
                this.trigger( 'cancelled', {tree:this, item:this.current_item} );
            } else {
				// Select item to be moved
				
                // Add class to all elements
                $( this.element ).find( '.sortable-tree-item' ).addClass( 'sortable-tree-is-target' );
				// Remove from current element
                $( source ).removeClass( 'sortable-tree-is-target' ).addClass( 'sortable-tree-is-source' );
				// Remove from current element's children
                $( source ).find( '.sortable-tree-item' ).removeClass( 'sortable-tree-is-target' ).addClass( 'sortable-tree-is-disabled' );
                this.current_item = source;
                this.trigger( 'source-selected', {tree:this, item:this.current_item} );
			}
        }
        
        S.prototype.InsertAfter = function( event ){
            this.current_item.insertAfter( $( this.element ).find( '.sortable-tree-is-selected' ) );
            this.ClearUp();
            this.trigger( 'moved', {tree:this, item:this.current_item} );
        }
        S.prototype.InsertBefore = function(  ){
            this.current_item.insertBefore( $( this.element ).find( '.sortable-tree-is-selected' ) );
            this.ClearUp();
            this.trigger( 'moved', {tree:this, item:this.current_item} );
        }
        S.prototype.InsertAsChild = function(){
            var child_list = $( this.element ).find( '.sortable-tree-is-selected' ).find( '> ul:not(.sortable-tree-children-clone)' );
            if ( child_list.length == 0 ) {
                var child_list = $( '<ul></ul>' );
                $( this.element ).find( '.sortable-tree-is-selected' ).append( child_list );
            }

            child_list.append( this.current_item );
            this.ClearUp();
            this.trigger( 'moved', {tree:this, item:this.current_item} );
        }
        S.prototype.GetStructure = function( target ){
            if ( typeof target == 'undefined' ){
				target = this.element;
			}
            target = $(target);
            var children = target.find( '> .sortable-tree-item' );
            var structure = [];
            for ( var i = 0; i < children.length; i++ ) {
                var child = {
                    id: $( children[ i ] ).data( this.o.id )
                };
                if ( $( children[ i ] ).find( '> ul' ).length ) {
					child.children = this.GetStructure( $( children[ i ] ).find( '> ul' ) );
				}
				structure.push(child);
			}
            return structure;
        }
		/**
		 * Get a list of all elements with their parent ID
		 */
		S.prototype.GetParentList = function(){
			var parent_list = [];
			var items = $( this.element ).find( '.sortable-tree-item' );
			for ( var i = 0; i < items.length; i++ ) {
				var parent = $( items[ i ] ).parent().closest( '.sortable-tree-item' );
				parent_list.push(
					{
						id: $( items[ i ] ).data( this.o.id ),
						parent_id: (parent.length>0)?parent.data( this.o.id ):null
					}
				);
			}
			return parent_list;
		}
        S.prototype.ClearUp = function(){
			$( this.element ).find( '.sortable-tree-item-clone,.sortable-tree-children-clone ' ).remove();
            $( this.element ).find( 'li' ).removeClass( 'sortable-tree-is-selected sortable-tree-is-target sortable-tree-is-source sortable-tree-is-disabled' );
        }
        
        return S;
    }
));