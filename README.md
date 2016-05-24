# tagger
My own tags input with blackjack and hookers.

## Example
```javascript
// Init tagger
var tag = $('#UserTags').tagger();

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

## Methods
Documentation coming soon...
