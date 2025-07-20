function tag(tag, attrs = {}) {
  // Optionales |type extrahieren
  let tagType = null;
  if (tag.includes('|')) {
    [tag, tagType] = tag.split('|');
  }

  const match = tag.match(/^([a-z0-9]+)(#[\w-]+)?((\.[\w-]+)*)$/i);
  if (!match) throw new Error(`Invalid tag: "${tag}"`);

  const [, tagName, rawId, rawClasses] = match;
  const el = document.createElement(tagName);

  if (rawId) el.id = rawId.slice(1);
  if (rawClasses) el.className = rawClasses.split('.').filter(Boolean).join(' ');

  // type-Attribut setzen, falls |type vorhanden
  if (tagType && ['input', 'button', 'select', 'textarea'].includes(tagName)) {
    el.setAttribute('type', tagType);
  }

  // Wenn attrs ein String ist
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

  // Normale Attributverarbeitung
  for (const [key, val] of Object.entries(attrs)) {
    if (key === 'text') el.textContent = val;
    else if (key === 'html') el.innerHTML = val;
    else if (key === 'style' && typeof val === 'object') Object.assign(el.style, val);
    else if (key.startsWith('on') && typeof val === 'function') {
      el.addEventListener(key.slice(2).toLowerCase(), val);
    } else if (key === 'dataset' && typeof val === 'object') {
      for (const [k, v] of Object.entries(val)) el.dataset[k] = v;
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

class ElementBuilder {
  constructor(tagName, attrs = {}) {
    this.el = tag(tagName, attrs);

    for (const [key, val] of Object.entries(attrs)) {
      if (key.startsWith('on') && typeof val === 'function') {
        this.el.addEventListener(key.slice(2).toLowerCase(), val);
      }
    }
  }

  attr(key, value) {
    this.el.setAttribute(key, value);
    return this;
  }

  text(content) {
    this.el.textContent = content;
    return this;
  }

  html(content) {
    this.el.innerHTML = content;
    return this;
  }

  style(styleObj) {
    Object.assign(this.el.style, styleObj);
    return this;
  }

  on(event, handler) {
    this.el.addEventListener(event, handler);
    return this;
  }

  child(childEl) {
    this.el.append(childEl instanceof Node ? childEl : document.createTextNode(childEl));
    return this;
  }

  children(childArray) {
    childArray.forEach(c => this.child(c));
    return this;
  }

  appendTo(parent) {
    if (parent instanceof Node) parent.appendChild(this.el);
    return this;
  }

  dataset(data) {
    for (const [k, v] of Object.entries(data)) {
      this.el.dataset[k] = v;
    }
    return this;
  }

  get node() {
    return this.el;
  }
}

function element(tag, attrs = {}) {
  return new ElementBuilder(tag, attrs);
}