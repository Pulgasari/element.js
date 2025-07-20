# element.js
`element()` is a tiny JavaScript utility ("Micro Library") for creating and manipulating DOM elements using a compact, expressive syntax. It combines selector-like tag definitions with a fluent API for building modern user interfaces without dependencies.

---

## 🚀 Features

* Compact tag definition (`div#id.class1.class2|type`)
* Optional shortform content (`text`, `html`, `src`, `value`, etc.)
* Attribute object with full support for:

  * `text`, `html`, `style`
  * `dataset`, `children`, `appendTo`
  * `onClick`, `onInput`, etc.
* Chainable API (`element()`)
* Lightweight and framework-free

---

## 📦 Usage

Include `element.js` in your page:

```html
<script src="element.js"></script>
```

Now you can call `element(...)` globally.

---

## 🔤 Syntax

### Basic tag syntax

```js
element('div')
element('section#main')
element('p.intro')
element('button#save.primary')
```

### With type (for input-like elements)

```js
element('input|text#username')
element('button|submit.primary')
element('input|checkbox.toggle')
```

### With shortform content

```js
element('h1', 'Hello World')
element('script', 'console.log("ready")')
element('img.logo', 'logo.png')           // sets src
```

---

## ⚙️ Attribute object

### Common attributes

```js
element('a.link', {
  href: '/about',
  text: 'About Us'
})

element('div.box', {
  html: '<strong>Bold</strong>'
})
```

### Styles

```js
element('div.box', {
  style: {
    padding: '1rem',
    backgroundColor: '#f0f0f0',
    borderRadius: '8px'
  }
})
```

### Dataset

```js
element('div', {
  dataset: {
    role: 'dialog',
    id: '12345'
  }
})
```

### Children

```js
const title = element('h2', 'Title').node;
const content = element('p', 'This is a paragraph.').node;

const box = element('div.card', {
  children: [title, content]
});
```

### Events

```js
element('button|button', {
  text: 'Click Me',
  onClick: () => alert('Clicked!')
})
```

### Append to parent

```js
element('div#app', {
  text: 'Hello!',
  appendTo: document.body
})
```

---

## 🔁 Chainable API

Every call to `element()` returns a chainable builder:

```js
const btn = element('button|button#go.primary', {
  text: 'Go',
  style: { backgroundColor: 'lime' },
  onClick: () => console.log('Go!')
});

btn.text('Start')
   .style({ fontWeight: 'bold' })
   .appendTo(document.body);
```

Access the raw DOM node with:

```js
btn.node
```

---

## 📘 Full example

```js
const form = element('form#login', {
  children: [
    element('label', { text: 'Username:' }).node,
    element('input|text#user', { placeholder: 'Enter username' }).node,
    element('label', { text: 'Password:' }).node,
    element('input|password#pass', { placeholder: 'Enter password' }).node,
    element('button|submit.primary', { text: 'Login' }).node
  ],
  appendTo: document.body
});
```

---

## ✅ Best practices

* Use shortform strings for simple text or src/value inputs
* Use attribute objects for structured content
* Store `.node` if you want to access/update later
* Chain methods (`.text()`, `.style()`, `.on()`, `.appendTo()`, etc.) for clarity

---

## 📎 License

MIT


## Usage

### Shorthands

If the second parameter is only a string you get some shorthand logic for different tags.

```JS
element('img#logo.logo', 'logo.png');
// <img id="logo" class="logo" src="logo.png">

element('input#email', 'info@example.com');
// <input id="email" value="info@example.com">

element('script', 'console.log("Hi")');
// <script>console.log("Hi")</script>

element('h2.title', 'Welcome');
// <h2 class="title">Welcome</h2>
```

```
element('input|text#nameField.large', {
  placeholder: 'Your name',
  value: 'Max'
});
// <input type="text" id="nameField" class="large" placeholder="Your name" value="Max">

element('button|submit.primary', 'Send');
// <button type="submit" class="primary">Send</button>
```