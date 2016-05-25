# tagger
My own tags input with blackjack and hookers. <a target="_blank" href="https://jsfiddle.net/AustinJKurpuis/gts3cxf5/4/">Demo!</a>
## Example
```html
<form>
    <div class="form-group">
        <div class="form-control">
            <input id="Tagger" value="starting,values">
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
| Name                | Description                   |
|---------------------|-------------------------------|
| ```tagger:change``` | Fires for any and all changes |
| ```tagger:add```    | Fires when a tag are added    |
| ```tagger:remove``` | Fires when a tag is removed   |
| ```tagger:edit```   | Fires when a tag is edited    |
| ```tagger:sort```   | Fires when any tag is sorted  |

## Options
### color
Color class name of tags

| Type   | Default    | Options                                                                              |
|--------|------------|--------------------------------------------------------------------------------------|
| ```String``` | ```info``` | ```default```, ```primary```, ```success```, ```info```, ```warning```, ```danger``` |

```javascript
$('#Tagger').tagger({
    color: 'success'
});
```

### duplicates
Allow duplicate tags

| Type          | Default     | Options                 |
|---------------|-------------|-------------------------|
| ```Boolean``` | ```false``` | ```true```, ```false``` |

```javascript
$('#Tagger').tagger({
    duplicates: true
});
```

### sortable
Make tags sortable by drag and drop

| Type          | Default     | Options                 |
|---------------|-------------|-------------------------|
| ```Boolean``` | ```false``` | ```true```, ```false``` |

```javascript
$('#Tagger').tagger({
    sortable: true
});
```

### terminators
Key codes to terminate tag on

| Type        | Default    | Options     |
|-------------|------------|-------------|
| ```Array``` | ```[13]``` | ```[...]``` |

```javascript
$('#Tagger').tagger({
    terminators: [
        13, // Rteurn key
        32 // Space
    ]
});
```

### transform
Text transformation function

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
Overwrite styles

| Type         | Default         | Options     |
|--------------|-----------------|-------------|
| ```Object``` | ```undefined``` | ```{...}``` |

```javascript
$('#Tagger').tagger({
    styles: {
        '.tagger-label': {
            'margin-right': '10px'
        }
    }
});
```

## Methods
### .tagger().add(value)
Adds a tag or many tags to an instance of .tagger()

| Arguments | Type                  | Required |
|-----------|-----------------------|----------|
| value     | ```String || Array``` | yes      |

```javascript
// Setup
var $tagger = $('#Tagger').tagger();
// Add single tags
$tagger.add('tag');
// Also accepts array of strings for multiple tags
$tagger.add(['firstTag', 'secondTag']);
```
### .tagger().remove(tag)
Removes selected tag(s) from an instance of .tagger()

| Arguments | Type   | Required |
|-----------|--------|----------|
| tag       | ```Object``` | yes|

```javascript
// Setup
var $tagger = $('#Tagger').tagger();
// Select all tags
var tags = $('#Tagger').parent().find('.label');
// Remove selected tags
$tagger.remove(tags);
```
### .tagger().getValues()
Returns an array of strings representing the tags in an instance of .tagger()
```javascript
// Setup
var $tagger = $('#Tagger').tagger();
// Remove selected tags
$tagger.getValues();
```
### .tagger().removeLast()
Removes last tag in list from an instance of .tagger()

```javascript
// Setup
var $tagger = $('#Tagger').tagger();
// Remove selected tags
$tagger.removeLast();
```
### .tagger().removeIndex(index)
Removes a specific tag by it's index in the list.
###### Note: starting index is 0

| Arguments | Type   | Required |
|-----------|--------|----------|
| index     | ```Number``` | yes|

```javascript
// Setup
var $tagger = $('#Tagger').tagger();
// Remove the second tag
$tagger.removeIndex(1);
```

### .tagger().removeValue(value)
Removes specific tag(s) by their value.
###### Note: all matching tags will be removed

| Arguments | Type   | Required |
|-----------|--------|----------|
| index     | ```String``` | yes|

```javascript
// Setup
var $tagger = $('#Tagger').tagger();
// Remove a tage with the value of 'myTag'
$tagger.removeValue('myTag');
```
### .tagger().exists(value)
Returns true if the tag already exits
###### Note: always returns false if duplicates are enabled

| Arguments | Type   | Required |
|-----------|--------|----------|
| index     | ```String``` | yes|

```javascript
// Setup
var $tagger = $('#Tagger').tagger();
// Remove a tage with the value of 'myTag'
$tagger.exists('myTag');
```
