# element.js
Micro Library to create and manipulate HTML / DOM Elements with JavaScript.

## Usage

### Shorthands

If the second parameter is only a string you get some shorthand logic different tags.

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