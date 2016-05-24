(function($) {

    var cnames = ['default', 'primary', 'success', 'info', 'warning', 'danger'];

    function classes(cname) {
        if (!~cnames.indexOf(cname)) cname = 'default';
        return 'tagger-label label label-' + cname;
    }

    function textWidth(elem) {
        if (!this.fakeEl) this.fakeEl = $('<span>').hide().appendTo(document.body);
        this.fakeEl.text(elem.val() || elem.text()).css('font', elem.css('font'));
        return this.fakeEl.width();
    };

    function getDefaultOptions(options) {
        options.terminators = options.terminators || [
            13 // return
        ];
        options.lowerCase = options.lowerCase || false;
        options.color = options.color || 'info';
        options.duplicates = options.duplicates || false;
    }
    
    function triggerMamy(elem, events, args){
    	events.split(' ').forEach(function(event){
        	elem.trigger(event, args);
        });
    }

    $.fn.extend({
        tagger: function(options) {
            options = options || {};
            getDefaultOptions(options);
            var $input = $(this);
            var $container = $input.parent();
            var self = this;
            
            
        	// Tag removal handler
            this.remove = function(tag){
            	tag.remove();
                triggerMamy($input, 'tagger:change tagger:remove', [self.getValues()]);
            }
            
            // Value getter
            this.getValues = function(){
            	var output = [];
    			$container.find('.tagger-content').each(function(){
        	 		output.push($(this).text());
        		});
        		return output;
            };
            
            // Add tag
            this.add = function(value){
            	if(Array.isArray(value)){
                	return value.forEach(function(val){
                    	self.add(val)
                    });
                }
            	if(options.duplicates === false && !self.getValues().indexOf(value)) return;
                // Create tag
            	var tag = $('<span>', {class: classes(options.color)}).append(
                    $('<span>', {class: 'tagger-content', 'contenteditable': true}).text(value).blur(function(){
                        var text = $(this).text();
                        // Remove tag if it's empty
                        if(!text) return self.remove(tag);
                        // Trigger change if the tag has changed
                        if(value !== text) triggerMamy($input, 'tagger:change tagger:edit', [self.getValues()]);
                    })
                    .keydown(function(e){
                        // Return key
                        if(e.which === 13){
                            // Block it
                            e.preventDefault();
                            // Focus out input
                            $input.focus();
                        }
                    }),
                    '&nbsp;',
                    $('<a>', {class: 'glyphicon glyphicon-remove tagger-remove-tag'}).click(function(){
                        self.remove(tag);
                    })
                );
                // Add tag
                $container.append(tag);
                // Move input to the end
                $container.append($input);
                // Fire add event
                triggerMamy($input, 'tagger:change tagger:add', [self.getValues()]);
            };
            
            // Remove last tag
            this.removeLast = function(){
            	self.remove($container.find('.label').last());
            };
            
            // Remove tag by index
            this.removeIndex = function(i){
            	self.remove($container.find('.label')[i]);
            };
            
            // Remove tag(s) by value
            this.removeValue = function(value){
            	$container.find('.label').each(function(){
                	if($(this).find('.tagger-content').text() === value) $(this).remove();
                });
            };

            // Check for input
            if($input.prop('tagName') !== 'INPUT'){
            	// Convert to input
                var input = $('<input>');
            	$input.replaceWith(input);
                $input = input;
            }
            
            var starting = $input.val();
            if(starting){
            	$input.val('');
            	self.add(starting.split(','));
            }

            // Set input classes
            $input.removeClass().addClass('tagger-input');

            // Update on each key press
            $input.keyup(function(e) {
                // Set width based on text width in $input
                $input.css('width', (textWidth($input) + 15) + 'px');
                
                // Get the new value
                var value = $input.val().trim();
                
                if(options.lowerCase){
                	value = value.toLowerCase();
                	$input.val(value.toLowerCase());
                }
                
                // Check for terminators
                if (~options.terminators.indexOf(e.which)) {
                	// If they don't have a value yet stop here
                    if(!value) return;
                    // Reset input box
               		$input.val('').keyup();
                    // Add our tag
                    self.add(value);
                    // Refocus the input
               		$input.focus();
                };
                
            });
            
            // Check for delete on each keydown
            $input.keydown(function(e){
            	// Delete key and no value in text box and remove last label
            	if(e.which === 8 && !$(this).val().trim()) self.removeLast();
            });

            // Focus input when you click inside its container 
            $container.click(function(e) {
            	if($(e.target).is('.tagger-content')) return;
                $input.focus();
            });

            // Add hover class
            $input.focus(function() {
                $container.addClass('tagger-focused');
            });

            // Remove hover class
            $input.blur(function() {
                $container.removeClass('tagger-focused');
            });
            
       		return this;
        }
    });

}(jQuery))
