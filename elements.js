/**
 * Creates a DOM element from a concise selector string like 'div#id.class1.class2',
 * optionally including a '|type' suffix like 'input|text#foo'.
 * Accepts a string (short form) or an attribute object.
 *
 * @param {string} tag - Tag name with optional #id, .class and |type suffix
 * @param {object|string} [attrs={}] - Attributes or shortform content string
 * @returns {HTMLElement}
 */
function tag(tag, attrs = {}) {
  // Extract optional type (e.g., 'input|password')
  let tagType = null;
  if (tag.includes('|')) {
    [tag, tagType] = tag.split('|');
  }

  // Parse tag name, ID and classes
  const match = tag.match(/^([a-z0-9]+)(#[\w-]+)?((\.[\w-]+)*)$/i);
  if (!match) throw new Error(`Invalid tag: "${tag}"`);
  const [, tagName, rawId, rawClasses] = match;

  const el = document.createElement(tagName);

  if (rawId) el.id = rawId.slice(1);
  if (rawClasses) el.className = rawClasses.split('.').filter(Boolean).join(' ');

  // Set 'type' attribute for allowed tags
  if (tagType && ['input', 'button', 'select', 'textarea'].includes(tagName)) {
    el.setAttribute('type', tagType);
  }

  // If attrs is a string, interpret as shortform content or attribute
  if (typeof attrs === 'string') {
    const selfClosingMap = {
      img: 'src',
      input: 'value',
      source: 'src',
      link: 'href',
      meta: 'content',
      track: 'src'
    };

    if (selfClosingMap[tagName]) {
      el.setAttribute(selfClosingMap[tagName], attrs);
    } else if (['script', 'style'].includes(tagName)) {
      el.innerHTML = attrs;
    } else {
      el.textContent = attrs;
    }

    return el;
  }

  // Process attribute object
  for (const [key, val] of Object.entries(attrs)) {
    if (key === 'text') {
      el.textContent = val;
    } else if (key === 'html') {
      el.innerHTML = val;
    } else if (key === 'style' && typeof val === 'object') {
      Object.assign(el.style, val);
    } else if (key.startsWith('on') && typeof val === 'function') {
      el.addEventListener(key.slice(2).toLowerCase(), val);
    } else if (key === 'dataset' && typeof val === 'object') {
      for (const [k, v] of Object.entries(val)) {
        el.dataset[k] = v;
      }
    } else if (key === 'children' && Array.isArray(val)) {
      val.forEach(child =>
        el.append(child instanceof Node ? child : document.createTextNode(child))
      );
    } else if (key === 'appendTo' && val instanceof Node) {
      val.appendChild(el);
    } else {
      el.setAttribute(key, val);
    }
  }

  return el;
}

/**
 * A chainable wrapper class for building and modifying DOM elements.
 */
class ElementBuilder {
  constructor(tagName, attrs = {}) {
    this.el = tag(tagName, attrs);

    // Ensure event listeners are always applied
    for (const [key, val] of Object.entries(attrs)) {
      if (key.startsWith('on') && typeof val === 'function') {
        this.el.addEventListener(key.slice(2).toLowerCase(), val);
      }
    }
  }

  /** Set an attribute */
  attr(key, value) {
    this.el.setAttribute(key, value);
    return this;
  }

  /** Set text content */
  text(content) {
    this.el.textContent = content;
    return this;
  }

  /** Set inner HTML */
  html(content) {
    this.el.innerHTML = content;
    return this;
  }

  /** Apply inline styles */
  style(styleObj) {
    Object.assign(this.el.style, styleObj);
    return this;
  }

  /** Add an event listener */
  on(event, handler) {
    this.el.addEventListener(event, handler);
    return this;
  }

  /** Append a single child (element or string) */
  child(childEl) {
    this.el.append(childEl instanceof Node ? childEl : document.createTextNode(childEl));
    return this;
  }

  /** Append multiple children */
  children(childArray) {
    childArray.forEach(c => this.child(c));
    return this;
  }

  /** Append this element to a parent node */
  appendTo(parent) {
    if (parent instanceof Node) parent.appendChild(this.el);
    return this;
  }

  /** Set dataset attributes */
  dataset(data) {
    for (const [k, v] of Object.entries(data)) {
      this.el.dataset[k] = v;
    }
    return this;
  }

  /** Get the underlying DOM element */
  get node() {
    return this.el;
  }
}

/**
 * Creates a chainable ElementBuilder for constructing DOM nodes.
 *
 * @param {string} tag - Tag name with optional |type / #id / .class
 * @param {object|string} [attrs] - Attributes or string content
 * @returns {ElementBuilder}
 */
function element(tag, attrs = {}) {
  return new ElementBuilder(tag, attrs);
}