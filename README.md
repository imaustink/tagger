# tagger
My own tags input with blackjack and hookers. [Demo!](https://jsfiddle.net/AustinJKurpuis/gts3cxf5/4/)
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

## Methods
###.tagger().add(value)
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
###.tagger().remove(tag)
Removes selected tag(s) from an instance of .tagger()

| Arguments | Type   | Required |
|-----------|--------|----------|
| tag       | Object | yes      |

```javascript
// Setup
var $tagger = $('#Tagger').tagger();
// Select all tags
var tags = $('#Tagger').parent().find('.label');
// Remove selected tags
$tagger.remove(tags);
```
###.tagger().getValues()
Returns an array of strings representing the tags in a given instance of .tagger()
```javascript
// Setup
var $tagger = $('#Tagger').tagger();
// Remove selected tags
$tagger.getValues();
```

