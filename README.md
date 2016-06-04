# State in templates
this package brings state functionality to the blaze templates


## Installation
```sh
$ meteor cristo:state-in-templates
```

## How to use

### in template

```html
<template name="myListing">
    <span><b>count:</b> {{_state 'count'}}</span>
    <button>Increast</button>
</template>

```

### in events / hooks

```js
import addStateToTemplate from 'meteor/cristo:state-in-templates';

addStateToTemplate(Template.my);

Template.my.onCreated(function () {
    this.state.setDefault({
        count: 0,
        name: 'Cristo'
    });

    this.autorun(() => {
        console.log('all', this.state.all());
        console.log('get', this.state.get('name'));
    });
});

Template.my.events({
    'click button': function (e, template) {
        var count = template.state.get('count') || 0;
        template.state.set('count', ++count);
    }
});
```

## Sharing state with children

```html
<template name="list">
    <ul>
        <li>{{> itemOne _state=_state}}</li>
        <li>{{> itemTwo _state=_state}}</li>
    </ul>
</template>

// In children we can use state from parent
<template name="itemOne">
    {{_state 'one'}}
</template>

<template name="itemTwo">
    {{_state 'two'}}
</template>
```

```js
import addStateToTemplate from 'meteor/cristo:state-in-templates';

addStateToTemplate(Template.list);
addStateToTemplate(Template.itemOne);
addStateToTemplate(Template.itemTwo);

Template.list.onCreated(function () {
    this.state.set('name', 'Cristo');
    this.state.set('lastName', 'Rabani');
});
```

## Using state functionality with autoform

1. Add state functionality to the autoform template

```js
addStateToTemplate(Template.autoForm);
```

2. If you want share current state for autoform form, you should inject current state to the form like this:

```html
{{#autoForm schema=getSchema id="myForm"  _state=_state}}
    {{> afQuickField name='price' value=(_state 'count')}}
{{/autoform}}

```

## LICENSE MIT
