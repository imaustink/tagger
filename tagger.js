(function($) {
    // All of our color classes
    var CNAMES = ['default', 'primary', 'success', 'info', 'warning', 'danger'];

    var DEFAULT_OPTIONS  = {
        terminators: [
            13, // return
            188 // comma
        ],
        color: 'info',
        duplicates: false,
        handleClass: 'glyphicon glyphicon-menu-hamburger',
        removeClass: 'glyphicon glyphicon-remove',
        showAllSuggestions: false,
        suggestionsOnly: false
    };

    // TODO: add arbitrary color option
    // Get classes for a label
    function classes(cname) {
        return 'label label-' + (~CNAMES.indexOf(cname) ? cname : 'default');
    }

    function Sizr($elem, pad){
        this.$elem = $elem;
        this.pad = pad || 0;
        this.$dummy = $('<span>').appendTo(document.body);
    }

    Sizr.prototype.measure = function(){
        this.$dummy.text(this.$elem.text() || this.$elem.val()).css('font', this.$elem.css('font'));
        return this.$dummy.width() + this.pad;
    };

    function Tagger($input, options) {
        var self = this;
        
        this.options = $.extend({}, DEFAULT_OPTIONS, options);
        this.$ = this.$input = $input;
        this.$container = $input.parent();

        var starting = $input.val();
        var name = $input.attr('name');
        var placeholder = $input.attr('placeholder') || this.options.placeholder;
        var sizr = new Sizr($input, 15);

        // Setup custom styles
        if(typeof this.options.styles === 'object' && !Array.isArray(this.options.styles)){
            for(var styles in this.options.styles){
                if(this.options.styles.hasOwnProperty(styles)){
                    this.styles[styles] = this.options.styles[styles];
                }
            }
            delete this.options.styles;
        }

        // Check for input
        if($input.prop('tagName') !== 'INPUT'){
            // Convert to input
            var input = $('<input>');
            $input.replaceWith(input);
            $input = input;
        }

        if(this.options.handleClass) this.options.handleClass += ' tagger-handle';

        if(name) $input.removeAttr('name');

        this.$dummy = $('<input>', {type: 'hidden', name: name, value: starting});
        this.$container.append(this.$dummy);

        if(starting){
            $input.removeAttr('value');
            $input.val('');
            self.add(starting.split(','));
        }

        if(placeholder){
            $input.removeAttr('placeholder');
            placeholder = $('<span>', {class: 'tagger-placeholder'}).css(this.styles['.tagger-placeholder']).text(placeholder);
            this.$container.prepend(placeholder);
            if(!self.getValues().length) placeholder.show();
        }

        if(this.options.autocomplete){
            this.$suggestions = $('<ul>', {class: 'tagger-suggestions'}).css(this.styles['.tagger-suggestions']);
            this.$container.after(this.$suggestions);
        }

        // Init text area size
        $input.css('width', '15px');

        // Set input classes
        $input.css(this.styles['.tagger-input']);

        // Set input type to text
        $input.attr('type', 'text');
        
        // Set container styles
        this.$container.css({'height': 'auto', 'line-height': '20px'});

        // Update on each key press
        $input.keyup(function inputKeyup(e) {

            var input_width = Math.min(sizr.measure(), self.$container.innerWidth());
            // Resize out input as the text has changed
            self.$input.css('width', input_width + 'px');

            // Get the new value
            var value = self.$input.val();

            // Case transformation
            if(typeof self.options.transform === 'function'){
                value = self.options.transform(value);
                self.$input.val(value);
            }

            // Trim our value of spaces
            value = value.trim();
            
            self.showSuggestions(value);

            // Check for terminators
            if(~self.options.terminators.indexOf(e.which)){
                // If they don't have a value yet stop here
                if(!value) return;
                // Reset input box
                self.$input.val('').keyup();
                // Add our tag
                self.add(value);
                // Refocus the input
                self.$input.focus();
            }

            if((self.$input.previous === 17 || self.$input.previous === 91) && e.which === 65) self.$input.select();
            self.$input.previous = e.which;

        });

        // Check for delete on each keydown
        $input.keydown(function inputKeydown(e){
            // Delete key if no value in text box and remove last label
            if(e.which === 8 && !$(this).val().trim()) self.removeLast();
            // Prevent submitting form on enter
            if(e.which === 13) e.preventDefault();
        });

        // Focus input when you click inside its container 
        this.$container.mousedown(function containerMousedown(e) {
            // Don't trigger if they're clicking the content or handle because it's editable and sortable
            if($(e.target).is('.tagger-content, .tagger-handle')) return;
            
            e.preventDefault();
            // Focus our input field
            self.$input.show().focus();
            // Reset text and subsequently the cursor
            //$input.text($input.text());
        });

        // Add hover class
        $input.focus(function inputFocus(){
            self.$container.css(self.styles['.tagger-focused']);
            self.$input.keyup();
            if(placeholder) placeholder.hide();
        });

        // Remove hover class
        $input.blur(function inputBlur(e){
            self.$container.css(self.styles['.tagger-blurred']);
            if(self.$suggestions) self.$suggestions.hide();
            if(placeholder){
                if(!self.getValues().length){
                    placeholder.show();
                    $input.hide();
                }
                else{
                    placeholder.hide();
                    $input.show();
                }
            }
        });
        
        // Setup sortable plugin
        if(this.options.sortable){
            this.options.sortable.create(this.$container[0], {
                // Class of sort handle in tag elem
                handle: '.tagger-handle',
                onStart: function sortStart(){
                    // Hide the $input when sorting
                    self.$input.hide();
                },
                onEnd: function sortEnd(){
                    // Move $input to the end again
                    self.$container.append($input);
                    // Show it again
                    self.$input.show();
                    // Trigger our event
                    self.triggerChange(self.$input, 'tagger:change tagger:sort', self.getValues());
                }
            });
        }

        return this;
    }

    // TODO: accept array on all remove methods
    // Tag removal handler
    Tagger.prototype.remove = function remove(tag){
        tag.remove();
        this.triggerChange(this.$input, 'tagger:change tagger:remove', this.getValues());
        this.showSuggestions(this.$input.val());
    };

    // Value getter
    Tagger.prototype.getValues = function getValues(){
        var output = [];
        this.$container.find('.tagger-content').each(function(){
            output.push($(this).text());
        });
        return output;
    };

    // Returns tags
    Tagger.prototype.getTags = function getTags(){
        return this.$container.children('span.label');
    };

    // Add tag
    Tagger.prototype.add = function add(value){
        var self = this;
        // Handle array of tags
        if(Array.isArray(value)){
            return value.forEach(function(val){
                self.add(val);
            });
        }
        // Prevent duplicates
        if(!this.options.duplicates && this.duplicate(value)) return;
    
        if(this.options.suggestionsOnly && !self.inSuggestions(value)) return;

        // Create tag
        var tag = $('<span>', {class: classes(this.options.color)}).css(this.styles['.tagger-label']).data('value', value).append(
            $('<span>', {class: 'tagger-content', contenteditable: true}).text(value).blur(function(){
                // Update tag
                var text = $(this).text();
                $(this).text(value);
                self.update(tag, text);
            }).keydown(function tagKeydown(e){
                // Return key
                if(e.which === 13){
                    // Block it
                    e.preventDefault();
                    // Focus out input
                    self.$input.focus();
                }
            }),
            '&nbsp;',
            $('<a>', {class: this.options.removeClass}).css(this.styles['.tagger-remove-tag']).click(function tagClick(){
                self.remove(tag);
            })
        );
        // Add drag handle
        if(this.options.sortable) tag.prepend(
            $('<span>', {class: this.options.handleClass}).css(this.styles['.tagger-handle'])
        );
        // Add tag
        this.$container.append(tag);
        // Move input to the end
        this.$container.append(this.$input);
        
        if(this.$suggestions) this.$suggestions.hide();
        // Fire add event
        this.triggerChange(this.$input, 'tagger:change tagger:add', self.getValues());
    };
    
    // Update tag value
    Tagger.prototype.update = function update(tag, value){
        if(value === tag.data('value')) return;
        if(!this.options.duplicates && this.duplicate(value)) return this.remove(tag);
        tag.find('.tagger-content').text(value);
        // Trigger change
        this.triggerChange(this.$input, 'tagger:change tagger:edit', this.getValues());
    };

    // Remove last tag
    Tagger.prototype.removeLast = function removeLast(){
        this.remove(this.$container.find('.label').last());
    };

    // Remove tag by index
    Tagger.prototype.removeIndex = function removeIndex(i){
        this.remove(this.$container.find('.label').eq(i));
    };
    
    // TODO rename to 'values' and make it a getter/setter
    // Remove tag(s) by value
    Tagger.prototype.removeValue = function removeValue(value){
        var self = this;
        this.$container.find('.label').each(function(){
            if($(this).find('.tagger-content').text() === value)  self.remove($(this));
        });
    };
    
    // TODO: rename to 'duplicate'
    Tagger.prototype.duplicate = function duplicate(value){
        return !!~this.getValues().indexOf(value);
    };
    
    
    Tagger.prototype.autocomplete = function autocomplete(value, values){
        var self = this;
        var output = [];
        if(!value && this.options.showAllSuggestions === false) return output;
        values.forEach(function(val){
            if(~val.indexOf(value) && !~self.getValues().indexOf(val)) output.push(val);
        });
        return output;
    };
    
    Tagger.prototype.printSuggestions = function printSuggestions(values){
        var self = this;
        if(!this.$suggestions) return;
        if(!values.length) return this.$suggestions.hide();
        this.$suggestions.empty().show();
        values.forEach(function(value){
            self.$suggestions.append(
                $('<li>', {class: classes(this.options.color)})
                .css(self.styles['.tagger-suggestion'])
                .text(value).mousedown(function(e){
                    e.preventDefault();
                    self.add(value);
                    //self.$suggestions.hide();
                    this.$input.val('').focus();
                })
            ); 
        });
    };
    
    // TODO: this looks bad and isn't very performant. Rework this.
    Tagger.prototype.showSuggestions = function showSuggestions(value){
        var self = this;
        if(typeof this.options.autocomplete === 'function'){
            this.options.autocomplete(function(results){
                self.suggestions = self.autocomplete(value, results);
                self.printSuggestions(self.suggestions);
            });
        }else if(Array.isArray(this.options.autocomplete)){
            self.suggestions = self.autocomplete(value, this.options.autocomplete);
            self.printSuggestions(self.suggestions);
        }
    };
    
    Tagger.prototype.inSuggestions = function inSuggestions(value){
        // Ignore if we don't have suggestions yet
        if(!this.suggestions) return true;
        return ~this.suggestions.indexOf(value);
    };

    Tagger.prototype.triggerChange = function(elem, events, values){
        // Trigger multiple events
        events.split(' ').forEach(function(event){
            elem.trigger(event, [values]);
        });

        if(this.$dummy) this.$dummy.val(values.join()).change();
    };
    
    Tagger.prototype.styles = {
        '.tagger-label': {
            'margin-right': '5px',
            display: 'inline-block'
        },
        '.tagger-remove-tag': {
            'color': '#FFF',
            'text-decoration': 'none',
            'cursor': 'pointer'
        },
        '.tagger-input': {
            'padding': '0',
            'margin': '0',
            'border': 'none',
            'outline': 'none',
            'display': 'inline-block'
        },
        '.tagger-focused': {
            'border-color': '#66afe9',
            'outline': '0',
            '-webkit-box-shadow': 'inset 0 1px 1px rgba(0, 0, 0, .075), 0 0 8px rgba(102, 175, 233, .6)',
            'box-shadow': 'inset 0 1px 1px rgba(0, 0, 0, .075), 0 0 8px rgba(102, 175, 233, .6)'
        },
        '.tagger-blurred': {
            'border-color': '#cacaca',
            '-webkit-box-shadow': 'none',
            'box-shadow': 'none'
        },
        '.tagger-handle': {
            'cursor': 'move',
            'margin-right': '3px'
        },
        '.tagger-suggestions': {
            'top': '20px',
            'background-color': '#FFF',
            'padding': '5px',
            'margin': '0 3px',
            'border': '1px solid #cccccc',
            'display': 'none'
        },
        '.tagger-suggestion': {
            'margin-right': '5px',
            'cursor': 'pointer'
        },
        '.tagger-placeholder': {
            'color': '#cacaca',
            'display': 'none'
        }
    };

    // Extend jquery here
    $.fn.extend({tagger: function(){
        var $input = $(this[0]);
        var tagger = $input.data('Tagger');
        var args = Array.prototype.slice.call(arguments);
        if(!tagger){
            tagger = new Tagger($input, args[0]);
            $input.data('Tagger', tagger);
        }else{
            args.splice(0, 1);
            return tagger[arguments[0]].apply(tagger, args);
        }
        return $input;
    }});

}(jQuery));
