# Tagger
[![Build Status](https://travis-ci.org/imaustink/tagger.svg?branch=karma)](https://travis-ci.org/imaustink/tagger)

TLDR; My own tags input with blackjack and hookers. [Demo!](https://jsfiddle.net/AustinJKurpuis/gts3cxf5/7/)
###### Note: this library is designed to be used with [Bootstrap](http://www.getbootstrap.com/) and [jQuery](https://jquery.com/). Bootstrap is optional but jQuery is required.

After fighting with many of the dozens of tags inputs out there and attempting to modify a few of them, I have come to accept they are all garbage. This projects goal is to make a better tags input. Including features like drag and drop organization and editing of tags and proper events and methods for interacting with the input once it's initiated.

## Example
```html
<form>
    <div class="form-group">
        <div class="form-control">
            <!-- It's best to set the input style to display none
            to prevent an unstyled box from showing before it's loaded.
            Tagger will unhide it for you -->
            <input style="display:none;" id="Tagger" value="starting,values">
        </div>
    </div>
</form>
```
```javascript
// Init tagger
var tag = $('#Tagger').tagger();

// Listen for changes
tag.on('tagger:change', function(e, vals){
    console.log(e, vals);
});
```

## Events
Each instance of tagger() has several events you can listen for using the .on() jQuery method like in the example above.

| Name                | Description                   |
|---------------------|-------------------------------|
| ```tagger:change``` | Fires for any and all changes |
| ```tagger:add```    | Fires when a tag are added    |
| ```tagger:remove``` | Fires when a tag is removed   |
| ```tagger:edit```   | Fires when a tag is edited    |
| ```tagger:sort```   | Fires when any tag is sorted  |

## Options
### color
Color class name of tags.

| Type   | Default    | Options                                                                              |
|--------|------------|--------------------------------------------------------------------------------------|
| ```String``` | ```info``` | ```default```, ```primary```, ```success```, ```info```, ```warning```, ```danger``` |

```javascript
$('#Tagger').tagger({
    color: 'success'
});
```

### duplicates
Allow duplicate tags.

| Type          | Default     | Options                 |
|---------------|-------------|-------------------------|
| ```Boolean``` | ```false``` | ```true```, ```false``` |

```javascript
$('#Tagger').tagger({
    duplicates: true
});
```

### sortable
Make tags sortable by drag and drop by proviging an a [Sortable](https://github.com/RubaXa/Sortable) constructor.

| Type          | Default     | Options                 |
|---------------|-------------|-------------------------|
| ```Function``` | ```undefined``` | ```Sortable``` |

```javascript
$('#Tagger').tagger({
    sortable: true
});
```

### terminators
Key codes to terminate tag on.

| Type        | Default    | Options     |
|-------------|------------|-------------|
| ```Array``` of ```Number```(s) | ```[13, 188]``` | ```[...]``` |

```javascript
$('#Tagger').tagger({
    terminators: [
        13, // Return key
        32 // Space
    ]
});
```

### transform
Text transformation function.

| Type           | Default         | Options        |
|----------------|-----------------|----------------|
| ```Function``` | ```undefined``` | ```Function``` |

```javascript
$('#Tagger').tagger({
    transform: function(value){
        return value.toLowerCase();
    }
});
```

### styles
Overwrite styles.

| Type         | Default         | Options     |
|--------------|-----------------|-------------|
| ```Object``` | ```undefined``` | ```{...}``` |

For class documentation see [Custom styles](https://github.com/imaustink/tagger/blob/master/README.md#custom-styles).

```javascript
$('#Tagger').tagger({
    styles: {
        '.tagger-label': {
            'margin-right': '10px'
        }
    }
});
```

### handleClass
Overwrite handle css classes.
###### Note: the required class of ```.tagger-handle``` will be automatically added.

| Type         | Default         | Options     |
|--------------|-----------------|-------------|
| ```String``` | ```'glyphicon glyphicon-menu-hamburger tagger-handle'``` | ```'...'``` |

```javascript
$('#Tagger').tagger({
    handleClass: 'glyphicon glyphicon-th-large tagger-handle'
});
```

### removeClass
Overwrite remove button css classes.

| Type         | Default         | Options     |
|--------------|-----------------|-------------|
| ```String``` | ```'glyphicon glyphicon-remove'``` | ```'...'``` |

```javascript
$('#Tagger').tagger({
    removeClass: 'glyphicon glyphicon-remove-sign'
});
```

## Methods
### .tagger('add', value)
Adds a tag or many tags to an instance of .tagger().

| Arguments | Type                  | Required |
|-----------|-----------------------|----------|
| value     | ```String || Array``` | yes      |

```javascript
// Setup
var $input = $('#Tagger').tagger();
// Add single tags
$input.tagger('add', 'tag');
// Also accepts array of strings for multiple tags
$input.tagger('add', ['firstTag', 'secondTag']);
```
### .tagger('update', tag, value)
Updates an existing tag in an instance of .tagger().

| Arguments | Type                  | Required |
|-----------|-----------------------|----------|
| value     | ```String```, ```Array``` | yes      |

```javascript
// Setup
var $input = $('#Tagger').tagger();
// Select last tag
var tag = $('#Tagger').parent().find('.label').last();
// Update single tags
$input.tagger('update', tag, 'myTag');
```
### .tagger('remove', tag)
Removes selected tag(s) from an instance of .tagger().

| Arguments | Type   | Required |
|-----------|--------|----------|
| tag       | ```Object``` | yes|

```javascript
// Setup
var $input = $('#Tagger').tagger();
// Select all tags
var tags = $('#Tagger').parent().find('.label');
// Remove selected tags
$input.tagger('remove', tags);
```
### .tagger('getValues')
Returns an array of strings representing the tags in an instance of .tagger().
```javascript
// Setup
var $input = $('#Tagger').tagger();
// Remove selected tags
$input.tagger('getValues');
```
### .tagger('getTags')
Returns an array the tag elements in an instance of .tagger().
```javascript
// Setup
var $input = $('#Tagger').tagger();
// Remove selected tags
$input.tagger('getTags');
```
### .tagger('removeLast')
Removes last tag in list from an instance of .tagger().

```javascript
// Setup
var $input = $('#Tagger').tagger();
// Remove selected tags
$input.tagger('removeLast');
```
### .tagger('removeIndex', index)
Removes a specific tag by it's index in the list.
###### Note: starting index is 0

| Arguments | Type   | Required |
|-----------|--------|----------|
| index     | ```Number``` | yes|

```javascript
// Setup
var $input = $('#Tagger').tagger();
// Remove the second tag
$input.tagger('removeIndex', 1);
```

### .tagger('removeValue', value)
Removes specific tag(s) by their value.
###### Note: all matching tags will be removed.

| Arguments | Type   | Required |
|-----------|--------|----------|
| index     | ```String``` | yes|

```javascript
// Setup
var $input = $('#Tagger').tagger();
// Remove a tag with the value of 'myTag'
$input.tagger('removeValue', 'myTag');
```
### .tagger('duplicate', value)
Returns true if the tag is a duplicate.
###### Note: always returns false if duplicates are enabled.

| Arguments | Type   | Required |
|-----------|--------|----------|
| index     | ```String``` | yes|

```javascript
// Setup
var $input = $('#Tagger').tagger();
// Remove a tag with the value of 'myTag'
$input.tagger('duplicate', 'myTag');
```
## Custom styles
Using the style option you can pass an object containing custom styles.
```javascript
$('#Tagger').tagger({
    styles: {
        '.tagger-label': {
            'color': '#F00'
        }
    }
});
```

| Class Name               | Tag            | Description                           |
|--------------------------|----------------|---------------------------------------|
| ```.tagger-label```      | ```<span>```   | Tag container                         |
| ```.tagger-remove-tag``` | ```<a>```      | Remove tag button                     |
| ```.tagger-input```      | ```<input>```  | Tagger input field                    |
| ```.tagger-focused```    | Defined by you | Tags input container when focused     |
| ```.tagger-blurred```    | Defined by you | Tags input container when blurred     |
| ```.tagger-handle```     | ```<span>```   | Tag draggable handle                  |
