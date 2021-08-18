
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }
    function exclude_internal_props(props) {
        const result = {};
        for (const k in props)
            if (k[0] !== '$')
                result[k] = props[k];
        return result;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function get_spread_object(spread_props) {
        return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : options.context || []),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.42.1' }, detail), true));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev('SvelteDOMSetProperty', { node, property, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

    function createCommonjsModule(fn) {
      var module = { exports: {} };
    	return fn(module, module.exports), module.exports;
    }

    var browserPonyfill = createCommonjsModule(function (module, exports) {
    var global = typeof self !== 'undefined' ? self : commonjsGlobal;
    var __self__ = (function () {
    function F() {
    this.fetch = false;
    this.DOMException = global.DOMException;
    }
    F.prototype = global;
    return new F();
    })();
    (function(self) {

    ((function (exports) {

      var support = {
        searchParams: 'URLSearchParams' in self,
        iterable: 'Symbol' in self && 'iterator' in Symbol,
        blob:
          'FileReader' in self &&
          'Blob' in self &&
          (function() {
            try {
              new Blob();
              return true
            } catch (e) {
              return false
            }
          })(),
        formData: 'FormData' in self,
        arrayBuffer: 'ArrayBuffer' in self
      };

      function isDataView(obj) {
        return obj && DataView.prototype.isPrototypeOf(obj)
      }

      if (support.arrayBuffer) {
        var viewClasses = [
          '[object Int8Array]',
          '[object Uint8Array]',
          '[object Uint8ClampedArray]',
          '[object Int16Array]',
          '[object Uint16Array]',
          '[object Int32Array]',
          '[object Uint32Array]',
          '[object Float32Array]',
          '[object Float64Array]'
        ];

        var isArrayBufferView =
          ArrayBuffer.isView ||
          function(obj) {
            return obj && viewClasses.indexOf(Object.prototype.toString.call(obj)) > -1
          };
      }

      function normalizeName(name) {
        if (typeof name !== 'string') {
          name = String(name);
        }
        if (/[^a-z0-9\-#$%&'*+.^_`|~]/i.test(name)) {
          throw new TypeError('Invalid character in header field name')
        }
        return name.toLowerCase()
      }

      function normalizeValue(value) {
        if (typeof value !== 'string') {
          value = String(value);
        }
        return value
      }

      // Build a destructive iterator for the value list
      function iteratorFor(items) {
        var iterator = {
          next: function() {
            var value = items.shift();
            return {done: value === undefined, value: value}
          }
        };

        if (support.iterable) {
          iterator[Symbol.iterator] = function() {
            return iterator
          };
        }

        return iterator
      }

      function Headers(headers) {
        this.map = {};

        if (headers instanceof Headers) {
          headers.forEach(function(value, name) {
            this.append(name, value);
          }, this);
        } else if (Array.isArray(headers)) {
          headers.forEach(function(header) {
            this.append(header[0], header[1]);
          }, this);
        } else if (headers) {
          Object.getOwnPropertyNames(headers).forEach(function(name) {
            this.append(name, headers[name]);
          }, this);
        }
      }

      Headers.prototype.append = function(name, value) {
        name = normalizeName(name);
        value = normalizeValue(value);
        var oldValue = this.map[name];
        this.map[name] = oldValue ? oldValue + ', ' + value : value;
      };

      Headers.prototype['delete'] = function(name) {
        delete this.map[normalizeName(name)];
      };

      Headers.prototype.get = function(name) {
        name = normalizeName(name);
        return this.has(name) ? this.map[name] : null
      };

      Headers.prototype.has = function(name) {
        return this.map.hasOwnProperty(normalizeName(name))
      };

      Headers.prototype.set = function(name, value) {
        this.map[normalizeName(name)] = normalizeValue(value);
      };

      Headers.prototype.forEach = function(callback, thisArg) {
        for (var name in this.map) {
          if (this.map.hasOwnProperty(name)) {
            callback.call(thisArg, this.map[name], name, this);
          }
        }
      };

      Headers.prototype.keys = function() {
        var items = [];
        this.forEach(function(value, name) {
          items.push(name);
        });
        return iteratorFor(items)
      };

      Headers.prototype.values = function() {
        var items = [];
        this.forEach(function(value) {
          items.push(value);
        });
        return iteratorFor(items)
      };

      Headers.prototype.entries = function() {
        var items = [];
        this.forEach(function(value, name) {
          items.push([name, value]);
        });
        return iteratorFor(items)
      };

      if (support.iterable) {
        Headers.prototype[Symbol.iterator] = Headers.prototype.entries;
      }

      function consumed(body) {
        if (body.bodyUsed) {
          return Promise.reject(new TypeError('Already read'))
        }
        body.bodyUsed = true;
      }

      function fileReaderReady(reader) {
        return new Promise(function(resolve, reject) {
          reader.onload = function() {
            resolve(reader.result);
          };
          reader.onerror = function() {
            reject(reader.error);
          };
        })
      }

      function readBlobAsArrayBuffer(blob) {
        var reader = new FileReader();
        var promise = fileReaderReady(reader);
        reader.readAsArrayBuffer(blob);
        return promise
      }

      function readBlobAsText(blob) {
        var reader = new FileReader();
        var promise = fileReaderReady(reader);
        reader.readAsText(blob);
        return promise
      }

      function readArrayBufferAsText(buf) {
        var view = new Uint8Array(buf);
        var chars = new Array(view.length);

        for (var i = 0; i < view.length; i++) {
          chars[i] = String.fromCharCode(view[i]);
        }
        return chars.join('')
      }

      function bufferClone(buf) {
        if (buf.slice) {
          return buf.slice(0)
        } else {
          var view = new Uint8Array(buf.byteLength);
          view.set(new Uint8Array(buf));
          return view.buffer
        }
      }

      function Body() {
        this.bodyUsed = false;

        this._initBody = function(body) {
          this._bodyInit = body;
          if (!body) {
            this._bodyText = '';
          } else if (typeof body === 'string') {
            this._bodyText = body;
          } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
            this._bodyBlob = body;
          } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
            this._bodyFormData = body;
          } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
            this._bodyText = body.toString();
          } else if (support.arrayBuffer && support.blob && isDataView(body)) {
            this._bodyArrayBuffer = bufferClone(body.buffer);
            // IE 10-11 can't handle a DataView body.
            this._bodyInit = new Blob([this._bodyArrayBuffer]);
          } else if (support.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(body) || isArrayBufferView(body))) {
            this._bodyArrayBuffer = bufferClone(body);
          } else {
            this._bodyText = body = Object.prototype.toString.call(body);
          }

          if (!this.headers.get('content-type')) {
            if (typeof body === 'string') {
              this.headers.set('content-type', 'text/plain;charset=UTF-8');
            } else if (this._bodyBlob && this._bodyBlob.type) {
              this.headers.set('content-type', this._bodyBlob.type);
            } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
              this.headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
            }
          }
        };

        if (support.blob) {
          this.blob = function() {
            var rejected = consumed(this);
            if (rejected) {
              return rejected
            }

            if (this._bodyBlob) {
              return Promise.resolve(this._bodyBlob)
            } else if (this._bodyArrayBuffer) {
              return Promise.resolve(new Blob([this._bodyArrayBuffer]))
            } else if (this._bodyFormData) {
              throw new Error('could not read FormData body as blob')
            } else {
              return Promise.resolve(new Blob([this._bodyText]))
            }
          };

          this.arrayBuffer = function() {
            if (this._bodyArrayBuffer) {
              return consumed(this) || Promise.resolve(this._bodyArrayBuffer)
            } else {
              return this.blob().then(readBlobAsArrayBuffer)
            }
          };
        }

        this.text = function() {
          var rejected = consumed(this);
          if (rejected) {
            return rejected
          }

          if (this._bodyBlob) {
            return readBlobAsText(this._bodyBlob)
          } else if (this._bodyArrayBuffer) {
            return Promise.resolve(readArrayBufferAsText(this._bodyArrayBuffer))
          } else if (this._bodyFormData) {
            throw new Error('could not read FormData body as text')
          } else {
            return Promise.resolve(this._bodyText)
          }
        };

        if (support.formData) {
          this.formData = function() {
            return this.text().then(decode)
          };
        }

        this.json = function() {
          return this.text().then(JSON.parse)
        };

        return this
      }

      // HTTP methods whose capitalization should be normalized
      var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT'];

      function normalizeMethod(method) {
        var upcased = method.toUpperCase();
        return methods.indexOf(upcased) > -1 ? upcased : method
      }

      function Request(input, options) {
        options = options || {};
        var body = options.body;

        if (input instanceof Request) {
          if (input.bodyUsed) {
            throw new TypeError('Already read')
          }
          this.url = input.url;
          this.credentials = input.credentials;
          if (!options.headers) {
            this.headers = new Headers(input.headers);
          }
          this.method = input.method;
          this.mode = input.mode;
          this.signal = input.signal;
          if (!body && input._bodyInit != null) {
            body = input._bodyInit;
            input.bodyUsed = true;
          }
        } else {
          this.url = String(input);
        }

        this.credentials = options.credentials || this.credentials || 'same-origin';
        if (options.headers || !this.headers) {
          this.headers = new Headers(options.headers);
        }
        this.method = normalizeMethod(options.method || this.method || 'GET');
        this.mode = options.mode || this.mode || null;
        this.signal = options.signal || this.signal;
        this.referrer = null;

        if ((this.method === 'GET' || this.method === 'HEAD') && body) {
          throw new TypeError('Body not allowed for GET or HEAD requests')
        }
        this._initBody(body);
      }

      Request.prototype.clone = function() {
        return new Request(this, {body: this._bodyInit})
      };

      function decode(body) {
        var form = new FormData();
        body
          .trim()
          .split('&')
          .forEach(function(bytes) {
            if (bytes) {
              var split = bytes.split('=');
              var name = split.shift().replace(/\+/g, ' ');
              var value = split.join('=').replace(/\+/g, ' ');
              form.append(decodeURIComponent(name), decodeURIComponent(value));
            }
          });
        return form
      }

      function parseHeaders(rawHeaders) {
        var headers = new Headers();
        // Replace instances of \r\n and \n followed by at least one space or horizontal tab with a space
        // https://tools.ietf.org/html/rfc7230#section-3.2
        var preProcessedHeaders = rawHeaders.replace(/\r?\n[\t ]+/g, ' ');
        preProcessedHeaders.split(/\r?\n/).forEach(function(line) {
          var parts = line.split(':');
          var key = parts.shift().trim();
          if (key) {
            var value = parts.join(':').trim();
            headers.append(key, value);
          }
        });
        return headers
      }

      Body.call(Request.prototype);

      function Response(bodyInit, options) {
        if (!options) {
          options = {};
        }

        this.type = 'default';
        this.status = options.status === undefined ? 200 : options.status;
        this.ok = this.status >= 200 && this.status < 300;
        this.statusText = 'statusText' in options ? options.statusText : 'OK';
        this.headers = new Headers(options.headers);
        this.url = options.url || '';
        this._initBody(bodyInit);
      }

      Body.call(Response.prototype);

      Response.prototype.clone = function() {
        return new Response(this._bodyInit, {
          status: this.status,
          statusText: this.statusText,
          headers: new Headers(this.headers),
          url: this.url
        })
      };

      Response.error = function() {
        var response = new Response(null, {status: 0, statusText: ''});
        response.type = 'error';
        return response
      };

      var redirectStatuses = [301, 302, 303, 307, 308];

      Response.redirect = function(url, status) {
        if (redirectStatuses.indexOf(status) === -1) {
          throw new RangeError('Invalid status code')
        }

        return new Response(null, {status: status, headers: {location: url}})
      };

      exports.DOMException = self.DOMException;
      try {
        new exports.DOMException();
      } catch (err) {
        exports.DOMException = function(message, name) {
          this.message = message;
          this.name = name;
          var error = Error(message);
          this.stack = error.stack;
        };
        exports.DOMException.prototype = Object.create(Error.prototype);
        exports.DOMException.prototype.constructor = exports.DOMException;
      }

      function fetch(input, init) {
        return new Promise(function(resolve, reject) {
          var request = new Request(input, init);

          if (request.signal && request.signal.aborted) {
            return reject(new exports.DOMException('Aborted', 'AbortError'))
          }

          var xhr = new XMLHttpRequest();

          function abortXhr() {
            xhr.abort();
          }

          xhr.onload = function() {
            var options = {
              status: xhr.status,
              statusText: xhr.statusText,
              headers: parseHeaders(xhr.getAllResponseHeaders() || '')
            };
            options.url = 'responseURL' in xhr ? xhr.responseURL : options.headers.get('X-Request-URL');
            var body = 'response' in xhr ? xhr.response : xhr.responseText;
            resolve(new Response(body, options));
          };

          xhr.onerror = function() {
            reject(new TypeError('Network request failed'));
          };

          xhr.ontimeout = function() {
            reject(new TypeError('Network request failed'));
          };

          xhr.onabort = function() {
            reject(new exports.DOMException('Aborted', 'AbortError'));
          };

          xhr.open(request.method, request.url, true);

          if (request.credentials === 'include') {
            xhr.withCredentials = true;
          } else if (request.credentials === 'omit') {
            xhr.withCredentials = false;
          }

          if ('responseType' in xhr && support.blob) {
            xhr.responseType = 'blob';
          }

          request.headers.forEach(function(value, name) {
            xhr.setRequestHeader(name, value);
          });

          if (request.signal) {
            request.signal.addEventListener('abort', abortXhr);

            xhr.onreadystatechange = function() {
              // DONE (success or failure)
              if (xhr.readyState === 4) {
                request.signal.removeEventListener('abort', abortXhr);
              }
            };
          }

          xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit);
        })
      }

      fetch.polyfill = true;

      if (!self.fetch) {
        self.fetch = fetch;
        self.Headers = Headers;
        self.Request = Request;
        self.Response = Response;
      }

      exports.Headers = Headers;
      exports.Request = Request;
      exports.Response = Response;
      exports.fetch = fetch;

      Object.defineProperty(exports, '__esModule', { value: true });

      return exports;

    })({}));
    })(__self__);
    __self__.fetch.ponyfill = true;
    // Remove "polyfill" property added by whatwg-fetch
    delete __self__.fetch.polyfill;
    // Choose between native implementation (global) or custom implementation (__self__)
    // var ctx = global.fetch ? global : __self__;
    var ctx = __self__; // this line disable service worker support temporarily
    exports = ctx.fetch; // To enable: import fetch from 'cross-fetch'
    exports.default = ctx.fetch; // For TypeScript consumers without esModuleInterop.
    exports.fetch = ctx.fetch; // To enable: import {fetch} from 'cross-fetch'
    exports.Headers = ctx.Headers;
    exports.Request = ctx.Request;
    exports.Response = ctx.Response;
    module.exports = exports;
    });

    var lib = createCommonjsModule(function (module) {
    const BASE_API_PATH = "https://api.countapi.xyz";
    const validPattern = /^[A-Za-z0-9_\-.]{3,64}$/;
    const validRegex = new RegExp(validPattern);

    const validatePath = module.exports.validatePath = function(namespace, key) {
        if(typeof key === "undefined") {
            if(typeof namespace === "undefined") {
                return Promise.reject("Missing key");
            }
            key = namespace;
            namespace = undefined;
        }

        function validName(name) {
            return validRegex.test(name) || name === ':HOST:' || name === ':PATHNAME:';
        }

        return new Promise(function(resolve, reject) {
            if(!validName(key)) {
                reject(`Key must match ${validPattern}. Got '${namespace}'`);
                return;
            }
            if(!validName(namespace) && typeof namespace !== "undefined" && namespace !== null) {
                reject(`Namespace must match ${validPattern} or be empty. Got '${namespace}'`);
                return;
            }
            
            var path = '';
            if(typeof namespace !== "undefined")
                path += namespace + '/';
            path += key;
            
            resolve({
                path: path
            });
        });
    };

    const validateTuple = module.exports.validateTuple = function(namespace, key, value) {
        if(typeof value === "undefined") {
            if(typeof key === "undefined") {
                return Promise.reject("Missing key or value");
            }
            value = key;
            key = undefined;
        }
        if(typeof value !== "number") {
            return Promise.reject("Value is NaN");
        }

        return validatePath(namespace, key).then(function(result) {
            return Object.assign({}, { value: value }, result);
        });
    };

    function finalize(res) {
        const valid_responses = [200, 400, 403, 404];
        if (valid_responses.includes(res.status)) {
            return res.json().then(function(json) {
                if(res.status == 400)
                    return Promise.reject(json.error);
                return Object.assign({}, {
                    status: res.status,
                    path: res.headers.get('X-Path')
                }, json);
            });
        }
        return Promise.reject("Response from server: " + res.status);
    }

    function queryParams(params) {
        return Object.keys(params || {})
            .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
            .join('&');
    }

    module.exports.get = function(namespace, key) {
        return validatePath(namespace, key).then(function(result) {
            return browserPonyfill(`${BASE_API_PATH}/get/${result.path}`).then(finalize);
        });
    };

    module.exports.set = function(namespace, key, value) {
        return validateTuple(namespace, key, value).then(function(result) {
            return browserPonyfill(`${BASE_API_PATH}/set/${result.path}?value=${result.value}`).then(finalize);
        });
    };

    module.exports.update = function(namespace, key, amount) {
        return validateTuple(namespace, key, amount).then(function(result) {
            return browserPonyfill(`${BASE_API_PATH}/update/${result.path}?amount=${result.value}`).then(finalize);
        });
    };

    module.exports.hit = function(namespace, key) {
        return validatePath(namespace, key).then(function(result) {
            return browserPonyfill(`${BASE_API_PATH}/hit/${result.path}`).then(finalize);
        });
    };

    module.exports.info = function(namespace, key) {
        return validatePath(namespace, key).then(function(result) {
            return browserPonyfill(`${BASE_API_PATH}/info/${result.path}`).then(finalize);
        });
    };

    module.exports.create = function(options) {
        var params = queryParams(options);
        return browserPonyfill(`${BASE_API_PATH}/create${params.length > 0 ? '?' + params : ''}`).then(finalize);
    };

    module.exports.stats = function() {
        return browserPonyfill(`${BASE_API_PATH}/stats`).then(finalize);
    };

    module.exports.visits = function(page) {
        return this.hit(':HOST:', page ? page : ':PATHNAME:');
    };

    module.exports.event = function(name) {
        return this.hit(':HOST:', name);
    };
    });

    var countapiJs = lib;

    /* src\components\CopiableText.svelte generated by Svelte v3.42.1 */

    const file$c = "src\\components\\CopiableText.svelte";

    function create_fragment$e(ctx) {
    	let span;
    	let i;
    	let t;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			span = element("span");
    			i = element("i");
    			t = text(/*text*/ ctx[0]);
    			add_location(i, file$c, 8, 2, 144);
    			attr_dev(span, "title", "Clique para copiar");
    			attr_dev(span, "class", "svelte-e703nl");
    			add_location(span, file$c, 4, 0, 43);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, i);
    			append_dev(i, t);

    			if (!mounted) {
    				dispose = listen_dev(
    					span,
    					"click",
    					function () {
    						if (is_function(window.prompt("Copiar: Ctrl+C, Enter", /*text*/ ctx[0]))) window.prompt("Copiar: Ctrl+C, Enter", /*text*/ ctx[0]).apply(this, arguments);
    					},
    					false,
    					false,
    					false
    				);

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;
    			if (dirty & /*text*/ 1) set_data_dev(t, /*text*/ ctx[0]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$e.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$e($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('CopiableText', slots, []);
    	let { text } = $$props;
    	const writable_props = ['text'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<CopiableText> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('text' in $$props) $$invalidate(0, text = $$props.text);
    	};

    	$$self.$capture_state = () => ({ text });

    	$$self.$inject_state = $$props => {
    		if ('text' in $$props) $$invalidate(0, text = $$props.text);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [text];
    }

    class CopiableText extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$e, create_fragment$e, safe_not_equal, { text: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CopiableText",
    			options,
    			id: create_fragment$e.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*text*/ ctx[0] === undefined && !('text' in props)) {
    			console.warn("<CopiableText> was created without expected prop 'text'");
    		}
    	}

    	get text() {
    		throw new Error("<CopiableText>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set text(value) {
    		throw new Error("<CopiableText>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\Figure.svelte generated by Svelte v3.42.1 */

    const file$b = "src\\components\\Figure.svelte";

    // (10:2) {#if caption}
    function create_if_block$5(ctx) {
    	let figcaption;
    	let t;

    	const block = {
    		c: function create() {
    			figcaption = element("figcaption");
    			t = text(/*caption*/ ctx[1]);
    			attr_dev(figcaption, "class", "svelte-caua2q");
    			add_location(figcaption, file$b, 10, 4, 234);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, figcaption, anchor);
    			append_dev(figcaption, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*caption*/ 2) set_data_dev(t, /*caption*/ ctx[1]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(figcaption);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$5.name,
    		type: "if",
    		source: "(10:2) {#if caption}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$d(ctx) {
    	let figure;
    	let img;
    	let img_src_value;
    	let t;
    	let if_block = /*caption*/ ctx[1] && create_if_block$5(ctx);

    	const block = {
    		c: function create() {
    			figure = element("figure");
    			img = element("img");
    			t = space();
    			if (if_block) if_block.c();
    			if (!src_url_equal(img.src, img_src_value = /*src*/ ctx[0])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", /*caption*/ ctx[1]);
    			attr_dev(img, "class", "svelte-caua2q");
    			add_location(img, file$b, 8, 2, 184);
    			set_style(figure, "--width", /*width*/ ctx[3]);
    			set_style(figure, "--height", /*height*/ ctx[2]);
    			attr_dev(figure, "class", "svelte-caua2q");
    			add_location(figure, file$b, 7, 0, 126);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, figure, anchor);
    			append_dev(figure, img);
    			append_dev(figure, t);
    			if (if_block) if_block.m(figure, null);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*src*/ 1 && !src_url_equal(img.src, img_src_value = /*src*/ ctx[0])) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*caption*/ 2) {
    				attr_dev(img, "alt", /*caption*/ ctx[1]);
    			}

    			if (/*caption*/ ctx[1]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$5(ctx);
    					if_block.c();
    					if_block.m(figure, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty & /*width*/ 8) {
    				set_style(figure, "--width", /*width*/ ctx[3]);
    			}

    			if (dirty & /*height*/ 4) {
    				set_style(figure, "--height", /*height*/ ctx[2]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(figure);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$d($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Figure', slots, []);
    	let { src } = $$props;
    	let { caption } = $$props;
    	let { height = "auto" } = $$props;
    	let { width = "auto" } = $$props;
    	const writable_props = ['src', 'caption', 'height', 'width'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Figure> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('src' in $$props) $$invalidate(0, src = $$props.src);
    		if ('caption' in $$props) $$invalidate(1, caption = $$props.caption);
    		if ('height' in $$props) $$invalidate(2, height = $$props.height);
    		if ('width' in $$props) $$invalidate(3, width = $$props.width);
    	};

    	$$self.$capture_state = () => ({ src, caption, height, width });

    	$$self.$inject_state = $$props => {
    		if ('src' in $$props) $$invalidate(0, src = $$props.src);
    		if ('caption' in $$props) $$invalidate(1, caption = $$props.caption);
    		if ('height' in $$props) $$invalidate(2, height = $$props.height);
    		if ('width' in $$props) $$invalidate(3, width = $$props.width);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [src, caption, height, width];
    }

    class Figure extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$d, create_fragment$d, safe_not_equal, { src: 0, caption: 1, height: 2, width: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Figure",
    			options,
    			id: create_fragment$d.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*src*/ ctx[0] === undefined && !('src' in props)) {
    			console.warn("<Figure> was created without expected prop 'src'");
    		}

    		if (/*caption*/ ctx[1] === undefined && !('caption' in props)) {
    			console.warn("<Figure> was created without expected prop 'caption'");
    		}
    	}

    	get src() {
    		throw new Error("<Figure>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set src(value) {
    		throw new Error("<Figure>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get caption() {
    		throw new Error("<Figure>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set caption(value) {
    		throw new Error("<Figure>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get height() {
    		throw new Error("<Figure>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set height(value) {
    		throw new Error("<Figure>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get width() {
    		throw new Error("<Figure>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set width(value) {
    		throw new Error("<Figure>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\quotes\Quote.svelte generated by Svelte v3.42.1 */

    const file$a = "src\\components\\quotes\\Quote.svelte";

    // (10:2) {#if author}
    function create_if_block$4(ctx) {
    	let small;
    	let t;

    	const block = {
    		c: function create() {
    			small = element("small");
    			t = text(/*author*/ ctx[1]);
    			attr_dev(small, "class", "author svelte-1vtz2fo");
    			add_location(small, file$a, 10, 4, 152);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, small, anchor);
    			append_dev(small, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*author*/ 2) set_data_dev(t, /*author*/ ctx[1]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(small);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(10:2) {#if author}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$c(ctx) {
    	let blockquote;
    	let p;
    	let t;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[3].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[2], null);
    	let if_block = /*author*/ ctx[1] && create_if_block$4(ctx);

    	const block = {
    		c: function create() {
    			blockquote = element("blockquote");
    			p = element("p");
    			if (default_slot) default_slot.c();
    			t = space();
    			if (if_block) if_block.c();
    			attr_dev(p, "class", "svelte-1vtz2fo");
    			add_location(p, file$a, 6, 2, 105);
    			set_style(blockquote, "color", /*color*/ ctx[0]);
    			attr_dev(blockquote, "class", "svelte-1vtz2fo");
    			add_location(blockquote, file$a, 5, 0, 66);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, blockquote, anchor);
    			append_dev(blockquote, p);

    			if (default_slot) {
    				default_slot.m(p, null);
    			}

    			append_dev(blockquote, t);
    			if (if_block) if_block.m(blockquote, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 4)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[2],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[2])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[2], dirty, null),
    						null
    					);
    				}
    			}

    			if (/*author*/ ctx[1]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$4(ctx);
    					if_block.c();
    					if_block.m(blockquote, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (!current || dirty & /*color*/ 1) {
    				set_style(blockquote, "color", /*color*/ ctx[0]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(blockquote);
    			if (default_slot) default_slot.d(detaching);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$c($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Quote', slots, ['default']);
    	let { color } = $$props;
    	let { author } = $$props;
    	const writable_props = ['color', 'author'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Quote> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('color' in $$props) $$invalidate(0, color = $$props.color);
    		if ('author' in $$props) $$invalidate(1, author = $$props.author);
    		if ('$$scope' in $$props) $$invalidate(2, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ color, author });

    	$$self.$inject_state = $$props => {
    		if ('color' in $$props) $$invalidate(0, color = $$props.color);
    		if ('author' in $$props) $$invalidate(1, author = $$props.author);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [color, author, $$scope, slots];
    }

    class Quote extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$c, create_fragment$c, safe_not_equal, { color: 0, author: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Quote",
    			options,
    			id: create_fragment$c.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*color*/ ctx[0] === undefined && !('color' in props)) {
    			console.warn("<Quote> was created without expected prop 'color'");
    		}

    		if (/*author*/ ctx[1] === undefined && !('author' in props)) {
    			console.warn("<Quote> was created without expected prop 'author'");
    		}
    	}

    	get color() {
    		throw new Error("<Quote>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<Quote>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get author() {
    		throw new Error("<Quote>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set author(value) {
    		throw new Error("<Quote>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\quotes\Answer.svelte generated by Svelte v3.42.1 */

    // (5:0) <Quote color="#49fc33">
    function create_default_slot$2(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[0].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[1], null);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 2)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[1],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[1])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[1], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$2.name,
    		type: "slot",
    		source: "(5:0) <Quote color=\\\"#49fc33\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$b(ctx) {
    	let quote;
    	let current;

    	quote = new Quote({
    			props: {
    				color: "#49fc33",
    				$$slots: { default: [create_default_slot$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(quote.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(quote, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const quote_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				quote_changes.$$scope = { dirty, ctx };
    			}

    			quote.$set(quote_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(quote.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(quote.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(quote, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Answer', slots, ['default']);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Answer> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('$$scope' in $$props) $$invalidate(1, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ Quote });
    	return [slots, $$scope];
    }

    class Answer extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Answer",
    			options,
    			id: create_fragment$b.name
    		});
    	}
    }

    /* src\components\quotes\Question.svelte generated by Svelte v3.42.1 */

    // (5:0) <Quote color="#fccd33" {...$$props}>
    function create_default_slot$1(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[1].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[2], null);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 4)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[2],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[2])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[2], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(5:0) <Quote color=\\\"#fccd33\\\" {...$$props}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$a(ctx) {
    	let quote;
    	let current;
    	const quote_spread_levels = [{ color: "#fccd33" }, /*$$props*/ ctx[0]];

    	let quote_props = {
    		$$slots: { default: [create_default_slot$1] },
    		$$scope: { ctx }
    	};

    	for (let i = 0; i < quote_spread_levels.length; i += 1) {
    		quote_props = assign(quote_props, quote_spread_levels[i]);
    	}

    	quote = new Quote({ props: quote_props, $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(quote.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(quote, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const quote_changes = (dirty & /*$$props*/ 1)
    			? get_spread_update(quote_spread_levels, [quote_spread_levels[0], get_spread_object(/*$$props*/ ctx[0])])
    			: {};

    			if (dirty & /*$$scope*/ 4) {
    				quote_changes.$$scope = { dirty, ctx };
    			}

    			quote.$set(quote_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(quote.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(quote.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(quote, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Question', slots, ['default']);

    	$$self.$$set = $$new_props => {
    		$$invalidate(0, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		if ('$$scope' in $$new_props) $$invalidate(2, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({ Quote });

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(0, $$props = assign(assign({}, $$props), $$new_props));
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$props = exclude_internal_props($$props);
    	return [$$props, slots, $$scope];
    }

    class Question extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Question",
    			options,
    			id: create_fragment$a.name
    		});
    	}
    }

    /* src\components\skills\Icon.svelte generated by Svelte v3.42.1 */

    const file$9 = "src\\components\\skills\\Icon.svelte";

    // (9:2) {#if key}
    function create_if_block$3(ctx) {
    	let span;
    	let t;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t = text(/*key*/ ctx[1]);
    			attr_dev(span, "class", "key svelte-j4pn79");
    			add_location(span, file$9, 9, 4, 186);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*key*/ 2) set_data_dev(t, /*key*/ ctx[1]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(9:2) {#if key}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$9(ctx) {
    	let span;
    	let img;
    	let img_src_value;
    	let t;
    	let if_block = /*key*/ ctx[1] && create_if_block$3(ctx);

    	const block = {
    		c: function create() {
    			span = element("span");
    			img = element("img");
    			t = space();
    			if (if_block) if_block.c();
    			if (!src_url_equal(img.src, img_src_value = /*src*/ ctx[0])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", /*key*/ ctx[1]);
    			attr_dev(img, "class", "svelte-j4pn79");
    			add_location(img, file$9, 7, 2, 144);
    			attr_dev(span, "class", "container svelte-j4pn79");
    			set_style(span, "--size", /*size*/ ctx[2] + "px");
    			add_location(span, file$9, 6, 0, 91);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, img);
    			append_dev(span, t);
    			if (if_block) if_block.m(span, null);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*src*/ 1 && !src_url_equal(img.src, img_src_value = /*src*/ ctx[0])) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*key*/ 2) {
    				attr_dev(img, "alt", /*key*/ ctx[1]);
    			}

    			if (/*key*/ ctx[1]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$3(ctx);
    					if_block.c();
    					if_block.m(span, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty & /*size*/ 4) {
    				set_style(span, "--size", /*size*/ ctx[2] + "px");
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Icon', slots, []);
    	let { src } = $$props;
    	let { key = "" } = $$props;
    	let { size = 32 } = $$props;
    	const writable_props = ['src', 'key', 'size'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Icon> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('src' in $$props) $$invalidate(0, src = $$props.src);
    		if ('key' in $$props) $$invalidate(1, key = $$props.key);
    		if ('size' in $$props) $$invalidate(2, size = $$props.size);
    	};

    	$$self.$capture_state = () => ({ src, key, size });

    	$$self.$inject_state = $$props => {
    		if ('src' in $$props) $$invalidate(0, src = $$props.src);
    		if ('key' in $$props) $$invalidate(1, key = $$props.key);
    		if ('size' in $$props) $$invalidate(2, size = $$props.size);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [src, key, size];
    }

    class Icon extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, { src: 0, key: 1, size: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Icon",
    			options,
    			id: create_fragment$9.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*src*/ ctx[0] === undefined && !('src' in props)) {
    			console.warn("<Icon> was created without expected prop 'src'");
    		}
    	}

    	get src() {
    		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set src(value) {
    		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get key() {
    		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set key(value) {
    		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\Tooltip.svelte generated by Svelte v3.42.1 */

    const file$8 = "src\\components\\Tooltip.svelte";
    const get_tooltip_slot_changes = dirty => ({});
    const get_tooltip_slot_context = ctx => ({});
    const get_hoverable_slot_changes = dirty => ({});
    const get_hoverable_slot_context = ctx => ({});

    // (16:2) {#if show}
    function create_if_block$2(ctx) {
    	let div;
    	let current;
    	const tooltip_slot_template = /*#slots*/ ctx[3].tooltip;
    	const tooltip_slot = create_slot(tooltip_slot_template, ctx, /*$$scope*/ ctx[2], get_tooltip_slot_context);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (tooltip_slot) tooltip_slot.c();
    			attr_dev(div, "class", "tooltip svelte-1jy2kym");
    			add_location(div, file$8, 16, 4, 350);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (tooltip_slot) {
    				tooltip_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (tooltip_slot) {
    				if (tooltip_slot.p && (!current || dirty & /*$$scope*/ 4)) {
    					update_slot_base(
    						tooltip_slot,
    						tooltip_slot_template,
    						ctx,
    						/*$$scope*/ ctx[2],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[2])
    						: get_slot_changes(tooltip_slot_template, /*$$scope*/ ctx[2], dirty, get_tooltip_slot_changes),
    						get_tooltip_slot_context
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tooltip_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tooltip_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (tooltip_slot) tooltip_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(16:2) {#if show}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$8(ctx) {
    	let span1;
    	let span0;
    	let t;
    	let current;
    	let mounted;
    	let dispose;
    	const hoverable_slot_template = /*#slots*/ ctx[3].hoverable;
    	const hoverable_slot = create_slot(hoverable_slot_template, ctx, /*$$scope*/ ctx[2], get_hoverable_slot_context);
    	let if_block = /*show*/ ctx[1] && create_if_block$2(ctx);

    	const block = {
    		c: function create() {
    			span1 = element("span");
    			span0 = element("span");
    			if (hoverable_slot) hoverable_slot.c();
    			t = space();
    			if (if_block) if_block.c();
    			attr_dev(span0, "class", "hoverable svelte-1jy2kym");
    			add_location(span0, file$8, 12, 2, 264);
    			set_style(span1, "--width", /*width*/ ctx[0] + "px");
    			attr_dev(span1, "class", "container");
    			add_location(span1, file$8, 6, 0, 123);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span1, anchor);
    			append_dev(span1, span0);

    			if (hoverable_slot) {
    				hoverable_slot.m(span0, null);
    			}

    			append_dev(span1, t);
    			if (if_block) if_block.m(span1, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(span1, "mouseover", /*mouseover_handler*/ ctx[4], false, false, false),
    					listen_dev(span1, "mouseleave", /*mouseleave_handler*/ ctx[5], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (hoverable_slot) {
    				if (hoverable_slot.p && (!current || dirty & /*$$scope*/ 4)) {
    					update_slot_base(
    						hoverable_slot,
    						hoverable_slot_template,
    						ctx,
    						/*$$scope*/ ctx[2],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[2])
    						: get_slot_changes(hoverable_slot_template, /*$$scope*/ ctx[2], dirty, get_hoverable_slot_changes),
    						get_hoverable_slot_context
    					);
    				}
    			}

    			if (/*show*/ ctx[1]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*show*/ 2) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$2(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(span1, null);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			if (!current || dirty & /*width*/ 1) {
    				set_style(span1, "--width", /*width*/ ctx[0] + "px");
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(hoverable_slot, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(hoverable_slot, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span1);
    			if (hoverable_slot) hoverable_slot.d(detaching);
    			if (if_block) if_block.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Tooltip', slots, ['hoverable','tooltip']);
    	let { width } = $$props;
    	let show = false;
    	const writable_props = ['width'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Tooltip> was created with unknown prop '${key}'`);
    	});

    	const mouseover_handler = () => $$invalidate(1, show = true);
    	const mouseleave_handler = () => $$invalidate(1, show = false);

    	$$self.$$set = $$props => {
    		if ('width' in $$props) $$invalidate(0, width = $$props.width);
    		if ('$$scope' in $$props) $$invalidate(2, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ width, show });

    	$$self.$inject_state = $$props => {
    		if ('width' in $$props) $$invalidate(0, width = $$props.width);
    		if ('show' in $$props) $$invalidate(1, show = $$props.show);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [width, show, $$scope, slots, mouseover_handler, mouseleave_handler];
    }

    class Tooltip extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, { width: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Tooltip",
    			options,
    			id: create_fragment$8.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*width*/ ctx[0] === undefined && !('width' in props)) {
    			console.warn("<Tooltip> was created without expected prop 'width'");
    		}
    	}

    	get width() {
    		throw new Error("<Tooltip>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set width(value) {
    		throw new Error("<Tooltip>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var T={icon:"https://dak.gg/bser/images/assets/skill/1010100.png",name:"Concentração de Álcool no Sangue (CAS)",description:["Li Dailin pode usar Beber para encher sua barra de CAS. Quando sua CAS está acima de 40, ela fica Bêbada, dando a suas habilidades efeitos extras e ganhando Alcoolizada depois de usar uma habilidade.","Se sua CAS chegar à 100, ela fica Embriagada, é silenciada por 5 segundos e ganha Alcoolizada.","Alcoolizada: O próximo ataque normal de Li Dailin acontece 2 vezes.","Estômago Forte: Sua velocidade de ataque é aumentada por um certo tempo após o consumo de bebidas alcoólicas."],key:"T"};var Q={icon:"https://dak.gg/bser/images/assets/skill/1010200.png",name:"Chute Vivaz",description:["Li Dailin avança para a frente, causando dano aos inimigos atingidos. Ela pode reativar esta habilidade mais duas vezes.","Bêbada: Aumenta o alcance e os danos causados."],key:"Q"};var W={icon:"https://dak.gg/bser/images/assets/skill/1010300.png",name:"Beber",description:["Li Dailin toma um gole, ganhando Força Líquida, aumentando seu CAS, e evitando ataques normais enquanto bebe.","Força Líquida: o dano de seu próximo ataque normal e o dano de Alcoolizada são aumentados dependendo de seu CAS."],key:"W"};var E={icon:"https://dak.gg/bser/images/assets/skill/1010400.png",name:"Prateleira Inferior",description:["Li Dailin cospe licor barato em uma área, com formato de cone, na sua frente, causando dano aos inimigos ao seu alcance e aplicando lentidão.","Bêbada: Aplica silenciar aos inimigos."],key:"E"};var R={icon:"https://dak.gg/bser/images/assets/skill/1010500.png",name:"Ataque do Tigre",description:["Li Dailin chuta para frente, não podendo ser impedida, suprimindo o primeiro inimigo atingido e seguindo com mais 2 chutes consecutivos, reduzindo seu tempo de recarga se atingir um inimigo.","Bêbada: Realiza 4 chutes consecutivos."],key:"R"};var DG={icon:"resources/skills/Glove.png",name:"Gancho",description:["Soca o seu alvo e causa dano."],key:"D"};var DN={icon:"resources/skills/Nunchaku.png",name:"Bafo do Dragão",description:["Balança o nunchaku rapidamente, criando uma rajada de vento.","Balançar o nunchaku por mais de 0,8 segundo atordoa os inimigos atingidos por 1 segundo.","Depois de algum tempo, lança a rajada de vento na direção-alvo, causando dano dependendo do tempo de conjuração."],key:"D"};var skills = {T:T,Q:Q,W:W,E:E,R:R,DG:DG,DN:DN};

    var skills$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        T: T,
        Q: Q,
        W: W,
        E: E,
        R: R,
        DG: DG,
        DN: DN,
        'default': skills
    });

    /* src\components\skills\Skill.svelte generated by Svelte v3.42.1 */
    const file$7 = "src\\components\\skills\\Skill.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i];
    	return child_ctx;
    }

    // (11:2) {#each skill.description as p}
    function create_each_block$1(ctx) {
    	let p;
    	let t_value = /*p*/ ctx[2] + "";
    	let t;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t = text(t_value);
    			add_location(p, file$7, 11, 4, 305);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(11:2) {#each skill.description as p}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let div;
    	let icon;
    	let t0;
    	let span;
    	let t2;
    	let current;

    	icon = new Icon({
    			props: {
    				src: /*skill*/ ctx[0].icon,
    				size: 48,
    				key: /*skill*/ ctx[0].key
    			},
    			$$inline: true
    		});

    	let each_value = /*skill*/ ctx[0].description;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(icon.$$.fragment);
    			t0 = space();
    			span = element("span");
    			span.textContent = `${/*skill*/ ctx[0].name}`;
    			t2 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(span, "class", "name svelte-n2rm1n");
    			add_location(span, file$7, 9, 2, 227);
    			attr_dev(div, "class", "skill svelte-n2rm1n");
    			add_location(div, file$7, 7, 0, 149);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(icon, div, null);
    			append_dev(div, t0);
    			append_dev(div, span);
    			append_dev(div, t2);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*skill*/ 1) {
    				each_value = /*skill*/ ctx[0].description;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(icon);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Skill', slots, []);
    	let { id } = $$props;
    	let skill = skills$1[id];
    	const writable_props = ['id'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Skill> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('id' in $$props) $$invalidate(1, id = $$props.id);
    	};

    	$$self.$capture_state = () => ({ skills: skills$1, Icon, id, skill });

    	$$self.$inject_state = $$props => {
    		if ('id' in $$props) $$invalidate(1, id = $$props.id);
    		if ('skill' in $$props) $$invalidate(0, skill = $$props.skill);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [skill, id];
    }

    class Skill extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, { id: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Skill",
    			options,
    			id: create_fragment$7.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*id*/ ctx[1] === undefined && !('id' in props)) {
    			console.warn("<Skill> was created without expected prop 'id'");
    		}
    	}

    	get id() {
    		throw new Error("<Skill>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<Skill>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\Modal.svelte generated by Svelte v3.42.1 */

    const file$6 = "src\\components\\Modal.svelte";
    const get_modal_slot_changes = dirty => ({});
    const get_modal_slot_context = ctx => ({});
    const get_button_slot_changes = dirty => ({});
    const get_button_slot_context = ctx => ({});

    // (16:0) {#if show}
    function create_if_block$1(ctx) {
    	let div0;
    	let t0;
    	let div2;
    	let div1;
    	let t2;
    	let current;
    	let mounted;
    	let dispose;
    	const modal_slot_template = /*#slots*/ ctx[4].modal;
    	const modal_slot = create_slot(modal_slot_template, ctx, /*$$scope*/ ctx[3], get_modal_slot_context);

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			t0 = space();
    			div2 = element("div");
    			div1 = element("div");
    			div1.textContent = "✗";
    			t2 = space();
    			if (modal_slot) modal_slot.c();
    			attr_dev(div0, "class", "overlay svelte-1n924aq");
    			add_location(div0, file$6, 16, 2, 233);
    			attr_dev(div1, "class", "close svelte-1n924aq");
    			add_location(div1, file$6, 18, 4, 302);
    			attr_dev(div2, "class", "modal svelte-1n924aq");
    			add_location(div2, file$6, 17, 2, 277);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div1);
    			append_dev(div2, t2);

    			if (modal_slot) {
    				modal_slot.m(div2, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(div0, "click", /*close*/ ctx[2], false, false, false),
    					listen_dev(div1, "click", /*close*/ ctx[2], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (modal_slot) {
    				if (modal_slot.p && (!current || dirty & /*$$scope*/ 8)) {
    					update_slot_base(
    						modal_slot,
    						modal_slot_template,
    						ctx,
    						/*$$scope*/ ctx[3],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[3])
    						: get_slot_changes(modal_slot_template, /*$$scope*/ ctx[3], dirty, get_modal_slot_changes),
    						get_modal_slot_context
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(modal_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(modal_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div2);
    			if (modal_slot) modal_slot.d(detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(16:0) {#if show}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let span;
    	let t;
    	let if_block_anchor;
    	let current;
    	let mounted;
    	let dispose;
    	const button_slot_template = /*#slots*/ ctx[4].button;
    	const button_slot = create_slot(button_slot_template, ctx, /*$$scope*/ ctx[3], get_button_slot_context);
    	let if_block = /*show*/ ctx[0] && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			span = element("span");
    			if (button_slot) button_slot.c();
    			t = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    			attr_dev(span, "class", "button svelte-1n924aq");
    			add_location(span, file$6, 12, 0, 145);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);

    			if (button_slot) {
    				button_slot.m(span, null);
    			}

    			insert_dev(target, t, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(span, "click", /*open*/ ctx[1], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (button_slot) {
    				if (button_slot.p && (!current || dirty & /*$$scope*/ 8)) {
    					update_slot_base(
    						button_slot,
    						button_slot_template,
    						ctx,
    						/*$$scope*/ ctx[3],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[3])
    						: get_slot_changes(button_slot_template, /*$$scope*/ ctx[3], dirty, get_button_slot_changes),
    						get_button_slot_context
    					);
    				}
    			}

    			if (/*show*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*show*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$1(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button_slot, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button_slot, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    			if (button_slot) button_slot.d(detaching);
    			if (detaching) detach_dev(t);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Modal', slots, ['button','modal']);
    	let { show = false } = $$props;

    	function open() {
    		$$invalidate(0, show = true);
    	}

    	function close() {
    		$$invalidate(0, show = false);
    	}

    	const writable_props = ['show'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Modal> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('show' in $$props) $$invalidate(0, show = $$props.show);
    		if ('$$scope' in $$props) $$invalidate(3, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ show, open, close });

    	$$self.$inject_state = $$props => {
    		if ('show' in $$props) $$invalidate(0, show = $$props.show);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [show, open, close, $$scope, slots];
    }

    class Modal extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, { show: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Modal",
    			options,
    			id: create_fragment$6.name
    		});
    	}

    	get show() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set show(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\skills\SkillModal.svelte generated by Svelte v3.42.1 */
    const file$5 = "src\\components\\skills\\SkillModal.svelte";

    // (16:4) 
    function create_button_slot$1(ctx) {
    	let icon;
    	let current;

    	icon = new Icon({
    			props: {
    				slot: "button",
    				src: /*skill*/ ctx[2].icon,
    				key: /*skill*/ ctx[2].key,
    				size: /*size*/ ctx[1]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(icon.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(icon, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const icon_changes = {};
    			if (dirty & /*size*/ 2) icon_changes.size = /*size*/ ctx[1];
    			icon.$set(icon_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(icon, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_button_slot$1.name,
    		type: "slot",
    		source: "(16:4) ",
    		ctx
    	});

    	return block;
    }

    // (17:4) 
    function create_modal_slot$1(ctx) {
    	let skill_1;
    	let current;

    	skill_1 = new Skill({
    			props: { id: /*id*/ ctx[0], slot: "modal" },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(skill_1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(skill_1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const skill_1_changes = {};
    			if (dirty & /*id*/ 1) skill_1_changes.id = /*id*/ ctx[0];
    			skill_1.$set(skill_1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(skill_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(skill_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(skill_1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_modal_slot$1.name,
    		type: "slot",
    		source: "(17:4) ",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let span;
    	let modal;
    	let current;

    	modal = new Modal({
    			props: {
    				$$slots: {
    					modal: [create_modal_slot$1],
    					button: [create_button_slot$1]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			span = element("span");
    			create_component(modal.$$.fragment);
    			attr_dev(span, "class", "skill svelte-8jj3ko");
    			add_location(span, file$5, 13, 0, 296);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			mount_component(modal, span, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const modal_changes = {};

    			if (dirty & /*$$scope, id, size*/ 11) {
    				modal_changes.$$scope = { dirty, ctx };
    			}

    			modal.$set(modal_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(modal.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(modal.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    			destroy_component(modal);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('SkillModal', slots, []);
    	let { id } = $$props;
    	let { size } = $$props;
    	let skill = skills$1[id];
    	const writable_props = ['id', 'size'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<SkillModal> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('id' in $$props) $$invalidate(0, id = $$props.id);
    		if ('size' in $$props) $$invalidate(1, size = $$props.size);
    	};

    	$$self.$capture_state = () => ({
    		Icon,
    		Tooltip,
    		Skill,
    		skills: skills$1,
    		Modal,
    		id,
    		size,
    		skill
    	});

    	$$self.$inject_state = $$props => {
    		if ('id' in $$props) $$invalidate(0, id = $$props.id);
    		if ('size' in $$props) $$invalidate(1, size = $$props.size);
    		if ('skill' in $$props) $$invalidate(2, skill = $$props.skill);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [id, size, skill];
    }

    class SkillModal extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, { id: 0, size: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SkillModal",
    			options,
    			id: create_fragment$5.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*id*/ ctx[0] === undefined && !('id' in props)) {
    			console.warn("<SkillModal> was created without expected prop 'id'");
    		}

    		if (/*size*/ ctx[1] === undefined && !('size' in props)) {
    			console.warn("<SkillModal> was created without expected prop 'size'");
    		}
    	}

    	get id() {
    		throw new Error("<SkillModal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<SkillModal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<SkillModal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<SkillModal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\skills\Combo.svelte generated by Svelte v3.42.1 */
    const file$4 = "src\\components\\skills\\Combo.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i];
    	return child_ctx;
    }

    // (9:2) {#each skills as skill}
    function create_each_block(ctx) {
    	let div;
    	let skillmodal;
    	let t;
    	let current;

    	skillmodal = new SkillModal({
    			props: {
    				size: /*size*/ ctx[1],
    				id: /*skill*/ ctx[2]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(skillmodal.$$.fragment);
    			t = space();
    			attr_dev(div, "class", "skill svelte-7xnvrh");
    			add_location(div, file$4, 9, 4, 173);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(skillmodal, div, null);
    			append_dev(div, t);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const skillmodal_changes = {};
    			if (dirty & /*size*/ 2) skillmodal_changes.size = /*size*/ ctx[1];
    			if (dirty & /*skills*/ 1) skillmodal_changes.id = /*skill*/ ctx[2];
    			skillmodal.$set(skillmodal_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(skillmodal.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(skillmodal.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(skillmodal);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(9:2) {#each skills as skill}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let div;
    	let current;
    	let each_value = /*skills*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "combo svelte-7xnvrh");
    			add_location(div, file$4, 7, 0, 121);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*size, skills*/ 3) {
    				each_value = /*skills*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Combo', slots, []);
    	let { skills = [] } = $$props;
    	let { size } = $$props;
    	const writable_props = ['skills', 'size'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Combo> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('skills' in $$props) $$invalidate(0, skills = $$props.skills);
    		if ('size' in $$props) $$invalidate(1, size = $$props.size);
    	};

    	$$self.$capture_state = () => ({ SkillModal, skills, size });

    	$$self.$inject_state = $$props => {
    		if ('skills' in $$props) $$invalidate(0, skills = $$props.skills);
    		if ('size' in $$props) $$invalidate(1, size = $$props.size);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [skills, size];
    }

    class Combo extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, { skills: 0, size: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Combo",
    			options,
    			id: create_fragment$4.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*size*/ ctx[1] === undefined && !('size' in props)) {
    			console.warn("<Combo> was created without expected prop 'size'");
    		}
    	}

    	get skills() {
    		throw new Error("<Combo>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set skills(value) {
    		throw new Error("<Combo>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<Combo>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Combo>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\TextModal.svelte generated by Svelte v3.42.1 */
    const file$3 = "src\\components\\TextModal.svelte";
    const get_default_slot_changes = dirty => ({});
    const get_default_slot_context = ctx => ({ slot: "modal" });

    // (7:2) 
    function create_button_slot(ctx) {
    	let span;
    	let t;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t = text(/*text*/ ctx[0]);
    			attr_dev(span, "slot", "button");
    			attr_dev(span, "class", "text svelte-4zhmg4");
    			add_location(span, file$3, 6, 2, 93);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*text*/ 1) set_data_dev(t, /*text*/ ctx[0]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_button_slot.name,
    		type: "slot",
    		source: "(7:2) ",
    		ctx
    	});

    	return block;
    }

    // (10:2) 
    function create_modal_slot(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[1].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[2], get_default_slot_context);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 4)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[2],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[2])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[2], dirty, get_default_slot_changes),
    						get_default_slot_context
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_modal_slot.name,
    		type: "slot",
    		source: "(10:2) ",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let modal;
    	let current;

    	modal = new Modal({
    			props: {
    				$$slots: {
    					modal: [create_modal_slot],
    					button: [create_button_slot]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(modal.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(modal, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const modal_changes = {};

    			if (dirty & /*$$scope, text*/ 5) {
    				modal_changes.$$scope = { dirty, ctx };
    			}

    			modal.$set(modal_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(modal.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(modal.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(modal, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('TextModal', slots, ['default']);
    	let { text } = $$props;
    	const writable_props = ['text'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<TextModal> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('text' in $$props) $$invalidate(0, text = $$props.text);
    		if ('$$scope' in $$props) $$invalidate(2, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ Modal, text });

    	$$self.$inject_state = $$props => {
    		if ('text' in $$props) $$invalidate(0, text = $$props.text);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [text, slots, $$scope];
    }

    class TextModal extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { text: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TextModal",
    			options,
    			id: create_fragment$3.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*text*/ ctx[0] === undefined && !('text' in props)) {
    			console.warn("<TextModal> was created without expected prop 'text'");
    		}
    	}

    	get text() {
    		throw new Error("<TextModal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set text(value) {
    		throw new Error("<TextModal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\TooltipText.svelte generated by Svelte v3.42.1 */

    const file$2 = "src\\components\\TooltipText.svelte";

    function create_fragment$2(ctx) {
    	let span1;
    	let span0;
    	let t0;
    	let t1;
    	let small;
    	let t2;

    	const block = {
    		c: function create() {
    			span1 = element("span");
    			span0 = element("span");
    			t0 = text(/*text*/ ctx[0]);
    			t1 = space();
    			small = element("small");
    			t2 = text(/*tip*/ ctx[1]);
    			attr_dev(span0, "class", "hoverable svelte-1kfx8ll");
    			add_location(span0, file$2, 6, 2, 90);
    			attr_dev(small, "class", "tip svelte-1kfx8ll");
    			add_location(small, file$2, 9, 2, 141);
    			attr_dev(span1, "class", "container svelte-1kfx8ll");
    			add_location(span1, file$2, 5, 0, 62);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span1, anchor);
    			append_dev(span1, span0);
    			append_dev(span0, t0);
    			append_dev(span1, t1);
    			append_dev(span1, small);
    			append_dev(small, t2);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*text*/ 1) set_data_dev(t0, /*text*/ ctx[0]);
    			if (dirty & /*tip*/ 2) set_data_dev(t2, /*tip*/ ctx[1]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('TooltipText', slots, []);
    	let { text } = $$props;
    	let { tip } = $$props;
    	const writable_props = ['text', 'tip'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<TooltipText> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('text' in $$props) $$invalidate(0, text = $$props.text);
    		if ('tip' in $$props) $$invalidate(1, tip = $$props.tip);
    	};

    	$$self.$capture_state = () => ({ text, tip });

    	$$self.$inject_state = $$props => {
    		if ('text' in $$props) $$invalidate(0, text = $$props.text);
    		if ('tip' in $$props) $$invalidate(1, tip = $$props.tip);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [text, tip];
    }

    class TooltipText extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { text: 0, tip: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TooltipText",
    			options,
    			id: create_fragment$2.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*text*/ ctx[0] === undefined && !('text' in props)) {
    			console.warn("<TooltipText> was created without expected prop 'text'");
    		}

    		if (/*tip*/ ctx[1] === undefined && !('tip' in props)) {
    			console.warn("<TooltipText> was created without expected prop 'tip'");
    		}
    	}

    	get text() {
    		throw new Error("<TooltipText>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set text(value) {
    		throw new Error("<TooltipText>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get tip() {
    		throw new Error("<TooltipText>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tip(value) {
    		throw new Error("<TooltipText>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\Video.svelte generated by Svelte v3.42.1 */

    const file$1 = "src\\components\\Video.svelte";

    // (34:23) 
    function create_if_block_2(ctx) {
    	let span;

    	const block = {
    		c: function create() {
    			span = element("span");
    			span.textContent = "▶";
    			attr_dev(span, "class", "text");
    			add_location(span, file$1, 34, 8, 862);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(34:23) ",
    		ctx
    	});

    	return block;
    }

    // (31:6) {#if loading}
    function create_if_block_1(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = "resources/loading.svg")) attr_dev(img, "src", img_src_value);
    			add_location(img, file$1, 32, 8, 792);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(31:6) {#if loading}",
    		ctx
    	});

    	return block;
    }

    // (51:2) {#if caption}
    function create_if_block(ctx) {
    	let figcaption;
    	let t;

    	const block = {
    		c: function create() {
    			figcaption = element("figcaption");
    			t = text(/*caption*/ ctx[7]);
    			attr_dev(figcaption, "class", "svelte-1c7agx3");
    			add_location(figcaption, file$1, 51, 4, 1162);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, figcaption, anchor);
    			append_dev(figcaption, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*caption*/ 128) set_data_dev(t, /*caption*/ ctx[7]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(figcaption);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(51:2) {#if caption}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let figure;
    	let div1;
    	let div0;
    	let t0;
    	let video_1;
    	let video_1_src_value;
    	let t1;
    	let mounted;
    	let dispose;

    	function select_block_type(ctx, dirty) {
    		if (/*loading*/ ctx[10]) return create_if_block_1;
    		if (/*paused*/ ctx[11]) return create_if_block_2;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block0 = current_block_type && current_block_type(ctx);
    	let if_block1 = /*caption*/ ctx[7] && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			figure = element("figure");
    			div1 = element("div");
    			div0 = element("div");
    			if (if_block0) if_block0.c();
    			t0 = space();
    			video_1 = element("video");
    			t1 = space();
    			if (if_block1) if_block1.c();
    			attr_dev(div0, "class", "overlay svelte-1c7agx3");
    			toggle_class(div0, "paused", /*paused*/ ctx[11]);
    			add_location(div0, file$1, 29, 4, 672);
    			if (!src_url_equal(video_1.src, video_1_src_value = /*src*/ ctx[0])) attr_dev(video_1, "src", video_1_src_value);
    			video_1.controls = /*controls*/ ctx[1];
    			video_1.autoplay = /*autoplay*/ ctx[2];
    			video_1.loop = /*loop*/ ctx[4];
    			video_1.muted = /*muted*/ ctx[3];
    			attr_dev(video_1, "width", /*width*/ ctx[5]);
    			attr_dev(video_1, "height", /*height*/ ctx[6]);
    			attr_dev(video_1, "preload", /*preload*/ ctx[8]);
    			attr_dev(video_1, "class", "svelte-1c7agx3");
    			add_location(video_1, file$1, 37, 4, 920);
    			attr_dev(div1, "class", "video svelte-1c7agx3");
    			add_location(div1, file$1, 28, 2, 624);
    			set_style(figure, "width", /*width*/ ctx[5]);
    			attr_dev(figure, "class", "svelte-1c7agx3");
    			add_location(figure, file$1, 27, 0, 589);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, figure, anchor);
    			append_dev(figure, div1);
    			append_dev(div1, div0);
    			if (if_block0) if_block0.m(div0, null);
    			append_dev(div1, t0);
    			append_dev(div1, video_1);
    			/*video_1_binding*/ ctx[14](video_1);
    			append_dev(figure, t1);
    			if (if_block1) if_block1.m(figure, null);

    			if (!mounted) {
    				dispose = [
    					listen_dev(video_1, "canplay", /*canplay_handler*/ ctx[13], false, false, false),
    					listen_dev(div1, "click", /*toggleVideo*/ ctx[12], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (current_block_type !== (current_block_type = select_block_type(ctx))) {
    				if (if_block0) if_block0.d(1);
    				if_block0 = current_block_type && current_block_type(ctx);

    				if (if_block0) {
    					if_block0.c();
    					if_block0.m(div0, null);
    				}
    			}

    			if (dirty & /*paused*/ 2048) {
    				toggle_class(div0, "paused", /*paused*/ ctx[11]);
    			}

    			if (dirty & /*src*/ 1 && !src_url_equal(video_1.src, video_1_src_value = /*src*/ ctx[0])) {
    				attr_dev(video_1, "src", video_1_src_value);
    			}

    			if (dirty & /*controls*/ 2) {
    				prop_dev(video_1, "controls", /*controls*/ ctx[1]);
    			}

    			if (dirty & /*autoplay*/ 4) {
    				prop_dev(video_1, "autoplay", /*autoplay*/ ctx[2]);
    			}

    			if (dirty & /*loop*/ 16) {
    				prop_dev(video_1, "loop", /*loop*/ ctx[4]);
    			}

    			if (dirty & /*muted*/ 8) {
    				prop_dev(video_1, "muted", /*muted*/ ctx[3]);
    			}

    			if (dirty & /*width*/ 32) {
    				attr_dev(video_1, "width", /*width*/ ctx[5]);
    			}

    			if (dirty & /*height*/ 64) {
    				attr_dev(video_1, "height", /*height*/ ctx[6]);
    			}

    			if (dirty & /*preload*/ 256) {
    				attr_dev(video_1, "preload", /*preload*/ ctx[8]);
    			}

    			if (/*caption*/ ctx[7]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block(ctx);
    					if_block1.c();
    					if_block1.m(figure, null);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (dirty & /*width*/ 32) {
    				set_style(figure, "width", /*width*/ ctx[5]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(figure);

    			if (if_block0) {
    				if_block0.d();
    			}

    			/*video_1_binding*/ ctx[14](null);
    			if (if_block1) if_block1.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Video', slots, []);
    	let { src } = $$props;
    	let { controls = false } = $$props;
    	let { autoplay = false } = $$props;
    	let { muted = true } = $$props;
    	let { loop = true } = $$props;
    	let { width = "320px" } = $$props;
    	let { height = "auto" } = $$props;
    	let { caption } = $$props;
    	let { preload = false } = $$props;
    	let video;
    	let loading = true;
    	let paused = !autoplay;

    	function toggleVideo() {
    		if (paused) {
    			video.play();
    		} else {
    			video.pause();
    		}

    		$$invalidate(11, paused = !paused);
    	}

    	const writable_props = [
    		'src',
    		'controls',
    		'autoplay',
    		'muted',
    		'loop',
    		'width',
    		'height',
    		'caption',
    		'preload'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Video> was created with unknown prop '${key}'`);
    	});

    	const canplay_handler = () => $$invalidate(10, loading = false);

    	function video_1_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			video = $$value;
    			$$invalidate(9, video);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('src' in $$props) $$invalidate(0, src = $$props.src);
    		if ('controls' in $$props) $$invalidate(1, controls = $$props.controls);
    		if ('autoplay' in $$props) $$invalidate(2, autoplay = $$props.autoplay);
    		if ('muted' in $$props) $$invalidate(3, muted = $$props.muted);
    		if ('loop' in $$props) $$invalidate(4, loop = $$props.loop);
    		if ('width' in $$props) $$invalidate(5, width = $$props.width);
    		if ('height' in $$props) $$invalidate(6, height = $$props.height);
    		if ('caption' in $$props) $$invalidate(7, caption = $$props.caption);
    		if ('preload' in $$props) $$invalidate(8, preload = $$props.preload);
    	};

    	$$self.$capture_state = () => ({
    		src,
    		controls,
    		autoplay,
    		muted,
    		loop,
    		width,
    		height,
    		caption,
    		preload,
    		video,
    		loading,
    		paused,
    		toggleVideo
    	});

    	$$self.$inject_state = $$props => {
    		if ('src' in $$props) $$invalidate(0, src = $$props.src);
    		if ('controls' in $$props) $$invalidate(1, controls = $$props.controls);
    		if ('autoplay' in $$props) $$invalidate(2, autoplay = $$props.autoplay);
    		if ('muted' in $$props) $$invalidate(3, muted = $$props.muted);
    		if ('loop' in $$props) $$invalidate(4, loop = $$props.loop);
    		if ('width' in $$props) $$invalidate(5, width = $$props.width);
    		if ('height' in $$props) $$invalidate(6, height = $$props.height);
    		if ('caption' in $$props) $$invalidate(7, caption = $$props.caption);
    		if ('preload' in $$props) $$invalidate(8, preload = $$props.preload);
    		if ('video' in $$props) $$invalidate(9, video = $$props.video);
    		if ('loading' in $$props) $$invalidate(10, loading = $$props.loading);
    		if ('paused' in $$props) $$invalidate(11, paused = $$props.paused);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		src,
    		controls,
    		autoplay,
    		muted,
    		loop,
    		width,
    		height,
    		caption,
    		preload,
    		video,
    		loading,
    		paused,
    		toggleVideo,
    		canplay_handler,
    		video_1_binding
    	];
    }

    class Video extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {
    			src: 0,
    			controls: 1,
    			autoplay: 2,
    			muted: 3,
    			loop: 4,
    			width: 5,
    			height: 6,
    			caption: 7,
    			preload: 8
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Video",
    			options,
    			id: create_fragment$1.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*src*/ ctx[0] === undefined && !('src' in props)) {
    			console.warn("<Video> was created without expected prop 'src'");
    		}

    		if (/*caption*/ ctx[7] === undefined && !('caption' in props)) {
    			console.warn("<Video> was created without expected prop 'caption'");
    		}
    	}

    	get src() {
    		throw new Error("<Video>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set src(value) {
    		throw new Error("<Video>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get controls() {
    		throw new Error("<Video>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set controls(value) {
    		throw new Error("<Video>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get autoplay() {
    		throw new Error("<Video>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set autoplay(value) {
    		throw new Error("<Video>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get muted() {
    		throw new Error("<Video>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set muted(value) {
    		throw new Error("<Video>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get loop() {
    		throw new Error("<Video>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set loop(value) {
    		throw new Error("<Video>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get width() {
    		throw new Error("<Video>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set width(value) {
    		throw new Error("<Video>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get height() {
    		throw new Error("<Video>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set height(value) {
    		throw new Error("<Video>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get caption() {
    		throw new Error("<Video>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set caption(value) {
    		throw new Error("<Video>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get preload() {
    		throw new Error("<Video>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set preload(value) {
    		throw new Error("<Video>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\App.svelte generated by Svelte v3.42.1 */

    const { console: console_1 } = globals;
    const file = "src\\App.svelte";

    // (47:4) <Question>
    function create_default_slot_15(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Então esse guia vai ensinar só o básico?");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_15.name,
    		type: "slot",
    		source: "(47:4) <Question>",
    		ctx
    	});

    	return block;
    }

    // (48:4) <Answer       >
    function create_default_slot_14(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Não se engane, apesar de não abordar rotas, vou me aprofundar bastante.");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_14.name,
    		type: "slot",
    		source: "(48:4) <Answer       >",
    		ctx
    	});

    	return block;
    }

    // (63:4) <Question author="DE DAILIN, Novato">
    function create_default_slot_13(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Ok, mas por que minha Li Dailin não dá dano?!");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_13.name,
    		type: "slot",
    		source: "(63:4) <Question author=\\\"DE DAILIN, Novato\\\">",
    		ctx
    	});

    	return block;
    }

    // (91:8) <TextModal text="40 CAS ou mais">
    function create_default_slot_12(ctx) {
    	let figure;
    	let current;

    	figure = new Figure({
    			props: {
    				height: "48px",
    				src: "resources/habilidades/passiva/barra.png",
    				caption: "Use o traço branco em baixo da sua barra de mana como referência"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(figure.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(figure, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(figure.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(figure.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(figure, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_12.name,
    		type: "slot",
    		source: "(91:8) <TextModal text=\\\"40 CAS ou mais\\\">",
    		ctx
    	});

    	return block;
    }

    // (156:8) <TextModal text="bonus considerável de velocidade de ataque">
    function create_default_slot_11(ctx) {
    	let div;
    	let video0;
    	let t;
    	let video1;
    	let current;

    	video0 = new Video({
    			props: {
    				src: "resources/habilidades/passiva/SadDailin.mp4",
    				autoplay: true,
    				caption: "Normal"
    			},
    			$$inline: true
    		});

    	video1 = new Video({
    			props: {
    				src: "resources/habilidades/passiva/HappyDailin.mp4",
    				autoplay: true,
    				caption: "Com bebida"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(video0.$$.fragment);
    			t = space();
    			create_component(video1.$$.fragment);
    			attr_dev(div, "class", "flex svelte-oc2kff");
    			add_location(div, file, 156, 10, 5365);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(video0, div, null);
    			append_dev(div, t);
    			mount_component(video1, div, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(video0.$$.fragment, local);
    			transition_in(video1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(video0.$$.fragment, local);
    			transition_out(video1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(video0);
    			destroy_component(video1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_11.name,
    		type: "slot",
    		source: "(156:8) <TextModal text=\\\"bonus considerável de velocidade de ataque\\\">",
    		ctx
    	});

    	return block;
    }

    // (171:8) <TextModal           text="durante         Alpha / Omega / Wickeline."         >
    function create_default_slot_10(ctx) {
    	let video;
    	let current;

    	video = new Video({
    			props: {
    				autoplay: true,
    				src: "resources/habilidades/passiva/silence.mp4",
    				caption: "Embriagada durante Wickeline"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(video.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(video, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(video.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(video.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(video, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_10.name,
    		type: "slot",
    		source: "(171:8) <TextModal           text=\\\"durante         Alpha / Omega / Wickeline.\\\"         >",
    		ctx
    	});

    	return block;
    }

    // (182:10) 
    function create_hoverable_slot(ctx) {
    	let span;

    	const block = {
    		c: function create() {
    			span = element("span");
    			attr_dev(span, "slot", "hoverable");
    			add_location(span, file, 181, 10, 6105);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_hoverable_slot.name,
    		type: "slot",
    		source: "(182:10) ",
    		ctx
    	});

    	return block;
    }

    // (183:10) 
    function create_tooltip_slot(ctx) {
    	let span;

    	const block = {
    		c: function create() {
    			span = element("span");
    			attr_dev(span, "slot", "tooltip");
    			add_location(span, file, 182, 10, 6141);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_tooltip_slot.name,
    		type: "slot",
    		source: "(183:10) ",
    		ctx
    	});

    	return block;
    }

    // (229:6) <Question>
    function create_default_slot_9(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Eu ganho mais mobilidade, mais dano e fico imune a ataque básico... Vou\n        spammar essa skill então!");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_9.name,
    		type: "slot",
    		source: "(229:6) <Question>",
    		ctx
    	});

    	return block;
    }

    // (245:77) <TextModal           text="40"         >
    function create_default_slot_8(ctx) {
    	let figure;
    	let t;
    	let current;

    	figure = new Figure({
    			props: {
    				height: "48px",
    				src: "resources/habilidades/passiva/barra.png",
    				caption: "Use o traço branco em baixo da sua barra de mana como referência"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(figure.$$.fragment);
    			t = space();
    		},
    		m: function mount(target, anchor) {
    			mount_component(figure, target, anchor);
    			insert_dev(target, t, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(figure.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(figure.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(figure, detaching);
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_8.name,
    		type: "slot",
    		source: "(245:77) <TextModal           text=\\\"40\\\"         >",
    		ctx
    	});

    	return block;
    }

    // (309:10) <TextModal text="A Li Dailin fica imparável durante o dash">
    function create_default_slot_7(ctx) {
    	let video;
    	let current;

    	video = new Video({
    			props: {
    				src: "resources/habilidades/r/RAlpha2.mp4",
    				caption: "A Li Dailin fica imparável durante o dash"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(video.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(video, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(video.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(video.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(video, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_7.name,
    		type: "slot",
    		source: "(309:10) <TextModal text=\\\"A Li Dailin fica imparável durante o dash\\\">",
    		ctx
    	});

    	return block;
    }

    // (317:10) <TextModal text="A Li Dailin não fica imparável durante a supressão">
    function create_default_slot_6(ctx) {
    	let video;
    	let current;

    	video = new Video({
    			props: {
    				src: "resources/habilidades/r/RAlpha1.mp4",
    				caption: "A Li Dailin não fica imparável durante a supressão"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(video.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(video, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(video.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(video.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(video, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_6.name,
    		type: "slot",
    		source: "(317:10) <TextModal text=\\\"A Li Dailin não fica imparável durante a supressão\\\">",
    		ctx
    	});

    	return block;
    }

    // (325:10) <TextModal text="O hitbox é estranho">
    function create_default_slot_5(ctx) {
    	let video;
    	let current;

    	video = new Video({
    			props: {
    				src: "resources/habilidades/r/RAlpha3.mp4",
    				caption: "O hitbox é estranho"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(video.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(video, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(video.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(video.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(video, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_5.name,
    		type: "slot",
    		source: "(325:10) <TextModal text=\\\"O hitbox é estranho\\\">",
    		ctx
    	});

    	return block;
    }

    // (364:4) <Question       >
    function create_default_slot_4(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Tá, eu já entendi as habilidades, mas você pode me falar logo como eu\n      combo?");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4.name,
    		type: "slot",
    		source: "(364:4) <Question       >",
    		ctx
    	});

    	return block;
    }

    // (425:4) <Question author="PROCURANDO BUILD, Novato.">
    function create_default_slot_3(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = "resources/stats/scammed.gif")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "Emote SCAM");
    			add_location(img, file, 425, 6, 13946);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3.name,
    		type: "slot",
    		source: "(425:4) <Question author=\\\"PROCURANDO BUILD, Novato.\\\">",
    		ctx
    	});

    	return block;
    }

    // (428:4) <Answer>
    function create_default_slot_2(ctx) {
    	let t;
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			t = text("Calma, eu posso explicar ");
    			img = element("img");
    			set_style(img, "vertical-align", "middle");
    			if (!src_url_equal(img.src, img_src_value = "resources/stats/D.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "Emote D:");
    			add_location(img, file, 428, 31, 14065);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    			insert_dev(target, img, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2.name,
    		type: "slot",
    		source: "(428:4) <Answer>",
    		ctx
    	});

    	return block;
    }

    // (527:4) <Question>
    function create_default_slot_1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Tá, mas essa build aqui é boa?");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(527:4) <Question>",
    		ctx
    	});

    	return block;
    }

    // (528:4) <Answer>
    function create_default_slot(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("No geral, se ela prioriza stat ofensivo, faz stat defensivo e um pouco de\n      stat útil, é uma boa build.");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(528:4) <Answer>",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let div5;
    	let h10;
    	let t1;
    	let figure0;
    	let t2;
    	let section0;
    	let h11;
    	let t4;
    	let p0;
    	let t6;
    	let p1;
    	let t8;
    	let p2;
    	let t9;
    	let copiabletext;
    	let t10;
    	let section1;
    	let h12;
    	let t12;
    	let p3;
    	let t14;
    	let question0;
    	let t15;
    	let answer0;
    	let t16;
    	let p4;
    	let t18;
    	let section2;
    	let h13;
    	let t20;
    	let p5;
    	let t22;
    	let question1;
    	let t23;
    	let iframe;
    	let iframe_src_value;
    	let t24;
    	let p6;
    	let t26;
    	let section10;
    	let h14;
    	let t28;
    	let section3;
    	let skill0;
    	let t29;
    	let p7;
    	let t31;
    	let p8;
    	let t32;
    	let textmodal0;
    	let t33;
    	let t34;
    	let ol0;
    	let li0;
    	let t35;
    	let small0;
    	let t36;
    	let hoverableskill0;
    	let t37;
    	let t38;
    	let t39;
    	let li1;
    	let t40;
    	let small1;
    	let t41;
    	let hoverableskill1;
    	let t42;
    	let t43;
    	let t44;
    	let li2;
    	let tooltiptext0;
    	let t45;
    	let p9;
    	let t46;
    	let span;
    	let t48;
    	let t49;
    	let div0;
    	let video0;
    	let t50;
    	let video1;
    	let t51;
    	let video2;
    	let t52;
    	let video3;
    	let t53;
    	let p10;
    	let b;
    	let t55;
    	let div1;
    	let video4;
    	let t56;
    	let video5;
    	let t57;
    	let p11;
    	let t58;
    	let textmodal1;
    	let t59;
    	let textmodal2;
    	let t60;
    	let tooltip;
    	let t61;
    	let section4;
    	let skill1;
    	let t62;
    	let p12;
    	let t64;
    	let p13;
    	let t66;
    	let div2;
    	let video6;
    	let t67;
    	let video7;
    	let t68;
    	let video8;
    	let t69;
    	let p14;
    	let t70;
    	let hoverableskill2;
    	let t71;
    	let t72;
    	let div3;
    	let video9;
    	let t73;
    	let video10;
    	let t74;
    	let section5;
    	let skill2;
    	let t75;
    	let p15;
    	let t77;
    	let question2;
    	let t78;
    	let figure1;
    	let t79;
    	let p16;
    	let t81;
    	let p17;
    	let t82;
    	let hoverableskill3;
    	let t83;
    	let textmodal3;
    	let t84;
    	let t85;
    	let p18;
    	let t86;
    	let hoverableskill4;
    	let t87;
    	let hoverableskill5;
    	let t88;
    	let t89;
    	let section6;
    	let skill3;
    	let t90;
    	let p19;
    	let t92;
    	let p20;
    	let t94;
    	let p21;
    	let t96;
    	let p22;
    	let t98;
    	let div4;
    	let video11;
    	let t99;
    	let video12;
    	let t100;
    	let section7;
    	let skill4;
    	let t101;
    	let p23;
    	let t103;
    	let p24;
    	let t105;
    	let p25;
    	let t107;
    	let ol1;
    	let li3;
    	let t109;
    	let li4;
    	let t111;
    	let li5;
    	let textmodal4;
    	let t112;
    	let li6;
    	let textmodal5;
    	let t113;
    	let li7;
    	let textmodal6;
    	let t114;
    	let section8;
    	let skill5;
    	let t115;
    	let p26;
    	let t117;
    	let p27;
    	let t119;
    	let p28;
    	let t121;
    	let section9;
    	let skill6;
    	let t122;
    	let p29;
    	let t124;
    	let p30;
    	let t126;
    	let section11;
    	let h15;
    	let t128;
    	let question3;
    	let t129;
    	let figure2;
    	let t130;
    	let p31;
    	let t132;
    	let p32;
    	let t134;
    	let video13;
    	let t135;
    	let br;
    	let t136;
    	let combo;
    	let t137;
    	let p33;
    	let t139;
    	let p34;
    	let t141;
    	let p35;
    	let t143;
    	let section12;
    	let h16;
    	let strike0;
    	let t145;
    	let t146;
    	let p36;
    	let t148;
    	let question4;
    	let t149;
    	let answer1;
    	let t150;
    	let p37;
    	let t152;
    	let ul0;
    	let li8;
    	let t154;
    	let li9;
    	let t155;
    	let strike1;
    	let small2;
    	let t157;
    	let t158;
    	let p38;
    	let t160;
    	let h20;
    	let t162;
    	let ul1;
    	let li10;
    	let t164;
    	let li11;
    	let t165;
    	let tooltiptext1;
    	let t166;
    	let t167;
    	let li12;
    	let t169;
    	let h21;
    	let t171;
    	let ul2;
    	let li13;
    	let t172;
    	let small3;
    	let t174;
    	let t175;
    	let li14;
    	let t177;
    	let li15;
    	let t178;
    	let hoverableskill6;
    	let t179;
    	let img;
    	let img_src_value;
    	let t180;
    	let t181;
    	let p39;
    	let t183;
    	let h22;
    	let t185;
    	let ul3;
    	let li16;
    	let t186;
    	let hoverableskill7;
    	let t187;
    	let t188;
    	let li17;
    	let t190;
    	let li18;
    	let t192;
    	let h23;
    	let t194;
    	let ul4;
    	let t196;
    	let h24;
    	let t198;
    	let ul5;
    	let li19;
    	let t200;
    	let li20;
    	let t202;
    	let question5;
    	let t203;
    	let answer2;
    	let t204;
    	let section13;
    	let h17;
    	let t206;
    	let section14;
    	let h18;
    	let t208;
    	let p40;
    	let t210;
    	let ul6;
    	let li21;
    	let a0;
    	let t212;
    	let li22;
    	let a1;
    	let t214;
    	let li23;
    	let a2;
    	let t216;
    	let li24;
    	let a3;
    	let t218;
    	let li25;
    	let a4;
    	let t220;
    	let small4;
    	let current;

    	figure0 = new Figure({
    			props: {
    				class: "center",
    				height: "50vh",
    				src: "resources/header/Tourist_Li_Dailin.png"
    			},
    			$$inline: true
    		});

    	copiabletext = new CopiableText({
    			props: { text: "uema#2118" },
    			$$inline: true
    		});

    	question0 = new Question({
    			props: {
    				$$slots: { default: [create_default_slot_15] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	answer0 = new Answer({
    			props: {
    				$$slots: { default: [create_default_slot_14] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	question1 = new Question({
    			props: {
    				author: "DE DAILIN, Novato",
    				$$slots: { default: [create_default_slot_13] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	skill0 = new Skill({ props: { id: "T" }, $$inline: true });

    	textmodal0 = new TextModal({
    			props: {
    				text: "40 CAS ou mais",
    				$$slots: { default: [create_default_slot_12] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	hoverableskill0 = new SkillModal({ props: { id: "W" }, $$inline: true });
    	hoverableskill1 = new SkillModal({ props: { id: "W" }, $$inline: true });

    	tooltiptext0 = new TooltipText({
    			props: {
    				text: "Seu próximo ataque normal sairá duas vezes.",
    				tip: "O segundo ataque tem dano reduzido, mas aumenta conforme o nível da\n          passiva"
    			},
    			$$inline: true
    		});

    	video0 = new Video({
    			props: {
    				src: "resources/habilidades/passiva/AA1.mp4",
    				caption: "Ataque normal"
    			},
    			$$inline: true
    		});

    	video1 = new Video({
    			props: {
    				src: "resources/habilidades/passiva/AA2.mp4",
    				caption: "Ataque bêbada"
    			},
    			$$inline: true
    		});

    	video2 = new Video({
    			props: {
    				src: "resources/habilidades/passiva/AA3.mp4",
    				caption: "Ataque alcoolizada"
    			},
    			$$inline: true
    		});

    	video3 = new Video({
    			props: {
    				src: "resources/habilidades/passiva/AA4.mp4",
    				caption: "Ataque embriagada"
    			},
    			$$inline: true
    		});

    	video4 = new Video({
    			props: {
    				src: "resources/habilidades/passiva/wqtqtqt.mp4",
    				caption: "✓"
    			},
    			$$inline: true
    		});

    	video5 = new Video({
    			props: {
    				src: "resources/habilidades/passiva/wqaqaqa.mp4",
    				caption: "✗"
    			},
    			$$inline: true
    		});

    	textmodal1 = new TextModal({
    			props: {
    				text: "bonus considerável de velocidade de ataque",
    				$$slots: { default: [create_default_slot_11] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	textmodal2 = new TextModal({
    			props: {
    				text: "durante\n        Alpha / Omega / Wickeline.",
    				$$slots: { default: [create_default_slot_10] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	tooltip = new Tooltip({
    			props: {
    				$$slots: {
    					tooltip: [create_tooltip_slot],
    					hoverable: [create_hoverable_slot]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	skill1 = new Skill({ props: { id: "Q" }, $$inline: true });

    	video6 = new Video({
    			props: {
    				width: "320px",
    				src: "resources/habilidades/q/WQTQTQT.mp4",
    				caption: "Se a primeira ativação da habilidade foi buffada por alcoolizada,\n            as duas ativações seguintes também serão"
    			},
    			$$inline: true
    		});

    	video7 = new Video({
    			props: {
    				width: "320px",
    				src: "resources/habilidades/q/QQQ.mp4",
    				caption: "Nenhuma das ativações atravessa unidades inimigas, isso é,\n        jogadores, animais, Wickeline, etc"
    			},
    			$$inline: true
    		});

    	video8 = new Video({
    			props: {
    				width: "320px",
    				src: "resources/habilidades/q/QJavas.mp4",
    				caption: "Qualquer atordoamento, empurrão ou enraizamento cancela o dash"
    			},
    			$$inline: true
    		});

    	hoverableskill2 = new SkillModal({ props: { id: "Q" }, $$inline: true });

    	video9 = new Video({
    			props: {
    				src: "resources/habilidades/q/Q.mp4",
    				caption: "Q normal"
    			},
    			$$inline: true
    		});

    	video10 = new Video({
    			props: {
    				src: "resources/habilidades/q/WQ.mp4",
    				caption: "Q buffado"
    			},
    			$$inline: true
    		});

    	skill2 = new Skill({ props: { id: "W" }, $$inline: true });

    	question2 = new Question({
    			props: {
    				$$slots: { default: [create_default_slot_9] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	figure1 = new Figure({
    			props: {
    				height: "160px",
    				src: "resources/habilidades/w/WastedDailin.png",
    				caption: "DE DAILIN, Novato."
    			},
    			$$inline: true
    		});

    	hoverableskill3 = new SkillModal({ props: { id: "W" }, $$inline: true });

    	textmodal3 = new TextModal({
    			props: {
    				text: "40",
    				$$slots: { default: [create_default_slot_8] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	hoverableskill4 = new SkillModal({ props: { id: "W" }, $$inline: true });
    	hoverableskill5 = new SkillModal({ props: { id: "T" }, $$inline: true });
    	skill3 = new Skill({ props: { id: "E" }, $$inline: true });

    	video11 = new Video({
    			props: {
    				src: "resources/habilidades/e/EJavas.mp4",
    				caption: "Silence no dash do Javali"
    			},
    			$$inline: true
    		});

    	video12 = new Video({
    			props: {
    				src: "resources/habilidades/e/EAlpha.mp4",
    				caption: "Silence no knockback do Alpha"
    			},
    			$$inline: true
    		});

    	skill4 = new Skill({ props: { id: "R" }, $$inline: true });

    	textmodal4 = new TextModal({
    			props: {
    				text: "A Li Dailin fica imparável durante o dash",
    				$$slots: { default: [create_default_slot_7] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	textmodal5 = new TextModal({
    			props: {
    				text: "A Li Dailin não fica imparável durante a supressão",
    				$$slots: { default: [create_default_slot_6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	textmodal6 = new TextModal({
    			props: {
    				text: "O hitbox é estranho",
    				$$slots: { default: [create_default_slot_5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	skill5 = new Skill({ props: { id: "DG" }, $$inline: true });
    	skill6 = new Skill({ props: { id: "DN" }, $$inline: true });

    	question3 = new Question({
    			props: {
    				$$slots: { default: [create_default_slot_4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	figure2 = new Figure({
    			props: { src: "resources/combos/Well.jpg" },
    			$$inline: true
    		});

    	video13 = new Video({
    			props: { src: "resources/combos/Combo.mp4" },
    			$$inline: true
    		});

    	combo = new Combo({
    			props: {
    				size: 48,
    				skills: [
    					"W",
    					"W",
    					"DG",
    					"T",
    					"Q",
    					"T",
    					"W",
    					"T",
    					"Q",
    					"T",
    					"Q",
    					"T",
    					"E",
    					"T",
    					"R",
    					"T",
    					"DG"
    				]
    			},
    			$$inline: true
    		});

    	question4 = new Question({
    			props: {
    				author: "PROCURANDO BUILD, Novato.",
    				$$slots: { default: [create_default_slot_3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	answer1 = new Answer({
    			props: {
    				$$slots: { default: [create_default_slot_2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	tooltiptext1 = new TooltipText({
    			props: {
    				text: "glass cannon",
    				tip: "Build que sacrifica defesa pra ter mais dano"
    			},
    			$$inline: true
    		});

    	hoverableskill6 = new SkillModal({ props: { id: "T" }, $$inline: true });
    	hoverableskill7 = new SkillModal({ props: { id: "Q" }, $$inline: true });

    	question5 = new Question({
    			props: {
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	answer2 = new Answer({
    			props: {
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div5 = element("div");
    			h10 = element("h1");
    			h10.textContent = "\"....Do I really have to do this?\"";
    			t1 = space();
    			create_component(figure0.$$.fragment);
    			t2 = space();
    			section0 = element("section");
    			h11 = element("h1");
    			h11.textContent = "Disclaimer";
    			t4 = space();
    			p0 = element("p");
    			p0.textContent = "Pra quem não me conhece, meu nick é uema, e sou mono Li Dailin desde\n      novembro de 2020, não posso afirmar que sou a melhor Li Dailin do\n      servidor, mas provavelmente a com mais experiência no jogo.";
    			t6 = space();
    			p1 = element("p");
    			p1.textContent = "Esse guia está longe de completo, e será atualizado sempre que eu tiver\n      tempo.";
    			t8 = space();
    			p2 = element("p");
    			t9 = text("Se encontrar algum erro, tiver algum feedback, dúvida ou sugestão, pode\n      falar comigo no Discord: ");
    			create_component(copiabletext.$$.fragment);
    			t10 = space();
    			section1 = element("section");
    			h12 = element("h1");
    			h12.textContent = "Objetivo";
    			t12 = space();
    			p3 = element("p");
    			p3.textContent = "O intuito desse guia, é passar um conhecimento geral sobre a personagem,\n      fugindo um pouco de coisas que variam com atualizações, como rotas e\n      builds.";
    			t14 = space();
    			create_component(question0.$$.fragment);
    			t15 = space();
    			create_component(answer0.$$.fragment);
    			t16 = space();
    			p4 = element("p");
    			p4.textContent = "A ideia é passar conhecimento teórico o suficiente pra que você entenda o\n      personagem, e seja capaz de construir e avaliar jogadas e rotas por conta\n      própria, independente do patch.";
    			t18 = space();
    			section2 = element("section");
    			h13 = element("h1");
    			h13.textContent = "Introdução";
    			t20 = space();
    			p5 = element("p");
    			p5.textContent = "Li Dailin é uma personagem conhecida pela sua mobilidade e por causar\n      bastante dano em pouco tempo.";
    			t22 = space();
    			create_component(question1.$$.fragment);
    			t23 = space();
    			iframe = element("iframe");
    			t24 = space();
    			p6 = element("p");
    			p6.textContent = "Pra causar dano com ela, é necessário entender e utilizar muito bem suas\n      skills, que apesar de simples têm diversas nuâncias e pequenos detalhes\n      que podem alterar e muito o seu potencial de dano.";
    			t26 = space();
    			section10 = element("section");
    			h14 = element("h1");
    			h14.textContent = "Habilidades";
    			t28 = space();
    			section3 = element("section");
    			create_component(skill0.$$.fragment);
    			t29 = space();
    			p7 = element("p");
    			p7.textContent = "Essa é a principal habilidade da Li Dailin. É o bom aproveitamento dela\n        que vai definir quanto de dano você pode causar.";
    			t31 = space();
    			p8 = element("p");
    			t32 = text("Se você tiver\n        ");
    			create_component(textmodal0.$$.fragment);
    			t33 = text("\n        ao usar uma habilidade:");
    			t34 = space();
    			ol0 = element("ol");
    			li0 = element("li");
    			t35 = text("Você consumirá 40 de CAS ");
    			small0 = element("small");
    			t36 = text("(exceto ");
    			create_component(hoverableskill0.$$.fragment);
    			t37 = text(")");
    			t38 = text(".");
    			t39 = space();
    			li1 = element("li");
    			t40 = text("A habilidade vai ganhar um efeito adicional ");
    			small1 = element("small");
    			t41 = text("(exceto ");
    			create_component(hoverableskill1.$$.fragment);
    			t42 = text(")");
    			t43 = text(".");
    			t44 = space();
    			li2 = element("li");
    			create_component(tooltiptext0.$$.fragment);
    			t45 = space();
    			p9 = element("p");
    			t46 = text("Se você atingir 100 de CAS, ficará ");
    			span = element("span");
    			span.textContent = "silenciado por 5s";
    			t48 = text(" e todos os ataques normais sairão duas vezes, são raros os momentos em\n        que isso é útil. Um exemplo é durante a Wickeline.");
    			t49 = space();
    			div0 = element("div");
    			create_component(video0.$$.fragment);
    			t50 = space();
    			create_component(video1.$$.fragment);
    			t51 = space();
    			create_component(video2.$$.fragment);
    			t52 = space();
    			create_component(video3.$$.fragment);
    			t53 = space();
    			p10 = element("p");
    			b = element("b");
    			b.textContent = "É muito importante não cancelar o segundo ataque da passiva, ele\n          depende da sua velocidade de ataque e é cancelado por movimentação ou\n          uso de habilidades.";
    			t55 = space();
    			div1 = element("div");
    			create_component(video4.$$.fragment);
    			t56 = space();
    			create_component(video5.$$.fragment);
    			t57 = space();
    			p11 = element("p");
    			t58 = text("Consumir bebidas alcóolicas dá\n        ");
    			create_component(textmodal1.$$.fragment);
    			t59 = text("\n        e é muito importante em builds com pouca velocidade de ataque ou\n        ");
    			create_component(textmodal2.$$.fragment);
    			t60 = space();
    			create_component(tooltip.$$.fragment);
    			t61 = space();
    			section4 = element("section");
    			create_component(skill1.$$.fragment);
    			t62 = space();
    			p12 = element("p");
    			p12.textContent = "Essa habilidade é a principal mobilidade e a principal fonte de dano da\n        Li Dailin, cada uso dá um dash, e o terceiro dash pode atravessar\n        paredes.";
    			t64 = space();
    			p13 = element("p");
    			p13.textContent = "Existem alguns detalhes importantes sobre essa habilidade:";
    			t66 = space();
    			div2 = element("div");
    			create_component(video6.$$.fragment);
    			t67 = space();
    			create_component(video7.$$.fragment);
    			t68 = space();
    			create_component(video8.$$.fragment);
    			t69 = space();
    			p14 = element("p");
    			t70 = text("A diferença entre o ");
    			create_component(hoverableskill2.$$.fragment);
    			t71 = text(" buffado e não buffado é um\n        aumento do dano e do alcance do pulo.");
    			t72 = space();
    			div3 = element("div");
    			create_component(video9.$$.fragment);
    			t73 = space();
    			create_component(video10.$$.fragment);
    			t74 = space();
    			section5 = element("section");
    			create_component(skill2.$$.fragment);
    			t75 = space();
    			p15 = element("p");
    			p15.textContent = "Cada uso dessa habilidade vai te dar 45 de CAS e te deixa imune a\n        ataques básicos durante a animação.";
    			t77 = space();
    			create_component(question2.$$.fragment);
    			t78 = space();
    			create_component(figure1.$$.fragment);
    			t79 = space();
    			p16 = element("p");
    			p16.textContent = "É interessante sempre manter a barra acima de 40 CAS, pra caso seja\n        necessário usar uma habilidade buffada imediatamente, mas é preciso\n        controlar o uso pra não se silenciar sem querer.";
    			t81 = space();
    			p17 = element("p");
    			t82 = text("No geral, use ");
    			create_component(hoverableskill3.$$.fragment);
    			t83 = text(" sempre que seu CAS chegar em ");
    			create_component(textmodal3.$$.fragment);
    			t84 = text(".");
    			t85 = space();
    			p18 = element("p");
    			t86 = text("Outro detalhe importante, é que cada ataque básico reduz o tempo de\n        recarga de ");
    			create_component(hoverableskill4.$$.fragment);
    			t87 = text(" em 1s, incluíndo o ataque duplo da passiva\n        ");
    			create_component(hoverableskill5.$$.fragment);
    			t88 = text(".");
    			t89 = space();
    			section6 = element("section");
    			create_component(skill3.$$.fragment);
    			t90 = space();
    			p19 = element("p");
    			p19.textContent = "Esse é o famigerado silence da Li Dailin, a habilidade também dá\n        lentidão, mas na maioria das vezes é usada pelo silenciamento.";
    			t92 = space();
    			p20 = element("p");
    			p20.textContent = "Pra silenciar é necessário usar a skill buffada, e ela tem um tempo de\n        conjuração relativamente alto, então pense bem antes de usa-la pra fugir\n        ou perseguir alguém.";
    			t94 = space();
    			p21 = element("p");
    			p21.textContent = "O momento ideal pra usar o silenciamento varia muito do momento e da\n        match up, e será abordado mais pra frente no guia.";
    			t96 = space();
    			p22 = element("p");
    			p22.textContent = "Nem todo tipo de conjuração é cancelado pelo silence, varia habilidade\n        por habilidade.";
    			t98 = space();
    			div4 = element("div");
    			create_component(video11.$$.fragment);
    			t99 = space();
    			create_component(video12.$$.fragment);
    			t100 = space();
    			section7 = element("section");
    			create_component(skill4.$$.fragment);
    			t101 = space();
    			p23 = element("p");
    			p23.textContent = "A ultimate da Li Dailin é um dash que suprime o alvo por 0.7s (1.2s se\n        alcoolizada).";
    			t103 = space();
    			p24 = element("p");
    			p24.textContent = "O dano da habilidade aumenta conforme a vida perdida, mas não é baseado\n        na vida máxima do alvo.";
    			t105 = space();
    			p25 = element("p");
    			p25.textContent = "Observações importantes:";
    			t107 = space();
    			ol1 = element("ol");
    			li3 = element("li");
    			li3.textContent = "O dash atravessa paredes.";
    			t109 = space();
    			li4 = element("li");
    			li4.textContent = "O cooldown é bem alto (180/150/115s), mas é reduzido em 40% se acertar\n          um alvo.";
    			t111 = space();
    			li5 = element("li");
    			create_component(textmodal4.$$.fragment);
    			t112 = space();
    			li6 = element("li");
    			create_component(textmodal5.$$.fragment);
    			t113 = space();
    			li7 = element("li");
    			create_component(textmodal6.$$.fragment);
    			t114 = space();
    			section8 = element("section");
    			create_component(skill5.$$.fragment);
    			t115 = space();
    			p26 = element("p");
    			p26.textContent = "É uma habilidade target, não interrompível, que funciona como um ataque\n        básico normal, mas com dano aumentado e causa dano verdadeiro adicional.";
    			t117 = space();
    			p27 = element("p");
    			p27.textContent = "Não existe um momento certo pra usar ela, recomendo usar sempre que sair\n        do cooldown ou para garantir um last hit.";
    			t119 = space();
    			p28 = element("p");
    			p28.textContent = "Obs: o alcance dessa habilidade é maior que o alcance padrão de ataque\n        básico, então ela dá um pequeno dash.";
    			t121 = space();
    			section9 = element("section");
    			create_component(skill6.$$.fragment);
    			t122 = space();
    			p29 = element("p");
    			p29.textContent = "São bem raras as situações em que é possível carregar o stun e ainda\n        assim acertar o alvo, pois é possível ouvir o Nunchaku sendo carregado\n        de muito longe.";
    			t124 = space();
    			p30 = element("p");
    			p30.textContent = "Então, no geral é utilizado como um pequeno dano adicional no combo,\n        para finalizar kills à distância ou para farmar.";
    			t126 = space();
    			section11 = element("section");
    			h15 = element("h1");
    			h15.textContent = "Combos";
    			t128 = space();
    			create_component(question3.$$.fragment);
    			t129 = space();
    			create_component(figure2.$$.fragment);
    			t130 = space();
    			p31 = element("p");
    			p31.textContent = "Como eu falei antes, é o bom aproveitamento da passiva que define quanto\n      dano você pode causar, então não existe um combo certo ou errado, tudo é\n      situacional.";
    			t132 = space();
    			p32 = element("p");
    			p32.textContent = "Numa situacão perfeita, o combo com o maior dano é aquele que maximiza o\n      uso da passiva, por exemplo:";
    			t134 = space();
    			create_component(video13.$$.fragment);
    			t135 = space();
    			br = element("br");
    			t136 = space();
    			create_component(combo.$$.fragment);
    			t137 = space();
    			p33 = element("p");
    			p33.textContent = "No entanto o seu inimigo não é um boneco de treino. Então na maioria das\n      vezes você vai ser obrigado a desperdiçar uma passiva ou outra, ou vai ter\n      alguma habilidade interrompida.";
    			t139 = space();
    			p34 = element("p");
    			p34.textContent = "O combo mostrado acima é apenas um exemplo de aproveitamento da passiva,\n      não se limite a ele. Situações diferentes vão exigir combos diferentes e\n      saber se adaptar é absolutamente necessário.";
    			t141 = space();
    			p35 = element("p");
    			p35.textContent = "Mas não se preocupe, você não vai ter que lutar 10x contra o mesmo\n      personagem pra aprender os combos apropriados, mais pra frente no guia eu\n      vou explicar como agir em cada um dos match ups.";
    			t143 = space();
    			section12 = element("section");
    			h16 = element("h1");
    			strike0 = element("strike");
    			strike0.textContent = "Builds";
    			t145 = text(" Stats");
    			t146 = space();
    			p36 = element("p");
    			p36.textContent = "Esse guia não vai ter uma seção de builds. Use o buscador de planos dentro\n      do jogo.";
    			t148 = space();
    			create_component(question4.$$.fragment);
    			t149 = space();
    			create_component(answer1.$$.fragment);
    			t150 = space();
    			p37 = element("p");
    			p37.textContent = "Eu poderia fazer guias separados pra cada uma das builds possíveis de Li\n      Dailin, mas eu tenho bons motivos para não fazer isso:";
    			t152 = space();
    			ul0 = element("ul");
    			li8 = element("li");
    			li8.textContent = "Li Dailin tem muita build.";
    			t154 = space();
    			li9 = element("li");
    			t155 = text("Eu tenho pouco tempo ");
    			strike1 = element("strike");
    			small2 = element("small");
    			small2.textContent = "(talvez isso seja mentira)";
    			t157 = text(".");
    			t158 = space();
    			p38 = element("p");
    			p38.textContent = "Mas tendo uma visão geral sobre quais stats devem ser priorizados e como\n      eles afetam o estilo de jogo, você pode pesquisar builds dentro do jogo e\n      decidir por conta própria quais usar.";
    			t160 = space();
    			h20 = element("h2");
    			h20.textContent = "Stats ofensivos";
    			t162 = space();
    			ul1 = element("ul");
    			li10 = element("li");
    			li10.textContent = "Poder de Ataque: aumenta o dano dos ataques básicos e habilidades.";
    			t164 = space();
    			li11 = element("li");
    			t165 = text("Chance/Dano Crítico: é interessante em builds ");
    			create_component(tooltiptext1.$$.fragment);
    			t166 = text(" e é eficiente contra alvos com pouca defesa.");
    			t167 = space();
    			li12 = element("li");
    			li12.textContent = "Dano Extra de Ataque Básico: aumenta o dano dos ataques básicos\n        ignorando defesa, é interessante em builds mais tanks, e é eficiente\n        contra alvos com muita defesa.";
    			t169 = space();
    			h21 = element("h2");
    			h21.textContent = "Stats defensivos";
    			t171 = space();
    			ul2 = element("ul");
    			li13 = element("li");
    			t172 = text("Defesa: é bom contra danos que não ignoram armadura ");
    			small3 = element("small");
    			small3.textContent = "(duh)";
    			t174 = text(".");
    			t175 = space();
    			li14 = element("li");
    			li14.textContent = "Vida: é bom contra Dano Extra de Ataque Básico, Dano Extra de\n        Habilidade, Armadilhas e Dano Verdadeiro.";
    			t177 = space();
    			li15 = element("li");
    			t178 = text("Roubo de vida + ");
    			create_component(hoverableskill6.$$.fragment);
    			t179 = text(" =\n        ");
    			img = element("img");
    			t180 = text(".");
    			t181 = space();
    			p39 = element("p");
    			p39.textContent = "Obs: o interessante é ter um equilibrio entre Vida e Defesa, por exemplo:\n      +300 de Vida e +40 de defesa";
    			t183 = space();
    			h22 = element("h2");
    			h22.textContent = "Stats úteis";
    			t185 = space();
    			ul3 = element("ul");
    			li16 = element("li");
    			t186 = text("Velocidade de movimento: quanto mais velocidade, menos você depende do\n        seu ");
    			create_component(hoverableskill7.$$.fragment);
    			t187 = text(" pra se aproximar, e mais você pode aproveitar\n        a passiva.");
    			t188 = space();
    			li17 = element("li");
    			li17.textContent = "Redução de Tempo de Recarga: menos tempo de recarga, mais skills, mais\n        mobilidade, mais passivas.";
    			t190 = space();
    			li18 = element("li");
    			li18.textContent = "Visão: Ter mais visão ajuda a abusar da mobilidade e do burst pra fugir\n        ou dar third-party.";
    			t192 = space();
    			h23 = element("h2");
    			h23.textContent = "Stats situacionais";
    			t194 = space();
    			ul4 = element("ul");
    			ul4.textContent = "Velocidade de ataque: é interessante ter pelo menos 1.0 de velocidade de\n      ataque. Na Luva não é necessário fazer itens de velocidade de ataque, no\n      Nunchaku 20~30% é suficiente.";
    			t196 = space();
    			h24 = element("h2");
    			h24.textContent = "Outros stats";
    			t198 = space();
    			ul5 = element("ul");
    			li19 = element("li");
    			li19.textContent = "Dano Extra de Habilidade: Esse stat é interessante em personagens com\n        muitos hits de habilidade, a Li Dailin num combo completo tem só 8 hits,\n        então no geral é um stat desnecessário.";
    			t200 = space();
    			li20 = element("li");
    			li20.textContent = "Alcance de ataque: É um stat interessante e relativamente útil, mas que\n        não vale a pena ir atrás. E no caso do Nunchaku, ele já está presente no\n        Cerberus e é um passivo único.";
    			t202 = space();
    			create_component(question5.$$.fragment);
    			t203 = space();
    			create_component(answer2.$$.fragment);
    			t204 = space();
    			section13 = element("section");
    			h17 = element("h1");
    			h17.textContent = "Match ups";
    			t206 = space();
    			section14 = element("section");
    			h18 = element("h1");
    			h18.textContent = "Streams";
    			t208 = space();
    			p40 = element("p");
    			p40.textContent = "O melhor jeito de aprender Eternal é assistindo, e com Li Dailin não é\n      diferente, segue a lista de streams que eu recomendo:";
    			t210 = space();
    			ul6 = element("ul");
    			li21 = element("li");
    			a0 = element("a");
    			a0.textContent = "트백";
    			t212 = space();
    			li22 = element("li");
    			a1 = element("a");
    			a1.textContent = "BigSean";
    			t214 = space();
    			li23 = element("li");
    			a2 = element("a");
    			a2.textContent = "lNeroTV";
    			t216 = space();
    			li24 = element("li");
    			a3 = element("a");
    			a3.textContent = "ShuviSenpai";
    			t218 = space();
    			li25 = element("li");
    			a4 = element("a");
    			a4.textContent = "uemaaaaa";
    			t220 = space();
    			small4 = element("small");
    			small4.textContent = "(De vez em nunca eu streamo)";
    			attr_dev(h10, "class", "svelte-oc2kff");
    			add_location(h10, file, 17, 2, 785);
    			attr_dev(h11, "class", "svelte-oc2kff");
    			add_location(h11, file, 24, 4, 946);
    			add_location(p0, file, 25, 4, 970);
    			add_location(p1, file, 30, 4, 1200);
    			add_location(p2, file, 34, 4, 1308);
    			add_location(section0, file, 23, 2, 932);
    			attr_dev(h12, "class", "svelte-oc2kff");
    			add_location(h12, file, 40, 4, 1493);
    			add_location(p3, file, 41, 4, 1515);
    			add_location(p4, file, 50, 4, 1871);
    			add_location(section1, file, 39, 2, 1479);
    			attr_dev(h13, "class", "svelte-oc2kff");
    			add_location(h13, file, 57, 4, 2111);
    			add_location(p5, file, 58, 4, 2135);
    			attr_dev(iframe, "width", "560");
    			attr_dev(iframe, "height", "315");
    			if (!src_url_equal(iframe.src, iframe_src_value = "https://www.youtube-nocookie.com/embed/r1_iuvZxx4Y")) attr_dev(iframe, "src", iframe_src_value);
    			attr_dev(iframe, "title", "YouTube video player");
    			attr_dev(iframe, "frameborder", "0");
    			attr_dev(iframe, "allow", "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture");
    			iframe.allowFullscreen = true;
    			attr_dev(iframe, "class", "svelte-oc2kff");
    			add_location(iframe, file, 65, 4, 2374);
    			add_location(p6, file, 74, 4, 2675);
    			add_location(section2, file, 56, 2, 2097);
    			attr_dev(h14, "class", "svelte-oc2kff");
    			add_location(h14, file, 81, 4, 2931);
    			add_location(p7, file, 84, 6, 2995);
    			add_location(p8, file, 88, 6, 3153);
    			add_location(small0, file, 101, 35, 3546);
    			attr_dev(li0, "class", "svelte-oc2kff");
    			add_location(li0, file, 100, 8, 3506);
    			add_location(small1, file, 106, 54, 3702);
    			attr_dev(li1, "class", "svelte-oc2kff");
    			add_location(li1, file, 105, 8, 3643);
    			attr_dev(li2, "class", "svelte-oc2kff");
    			add_location(li2, file, 110, 8, 3799);
    			add_location(ol0, file, 99, 6, 3493);
    			attr_dev(span, "class", "yellow svelte-oc2kff");
    			add_location(span, file, 119, 43, 4086);
    			add_location(p9, file, 118, 6, 4039);
    			attr_dev(div0, "class", "flex svelte-oc2kff");
    			add_location(div0, file, 124, 6, 4299);
    			attr_dev(b, "class", "yellow svelte-oc2kff");
    			add_location(b, file, 143, 8, 4814);
    			add_location(p10, file, 142, 6, 4802);
    			attr_dev(div1, "class", "flex svelte-oc2kff");
    			add_location(div1, file, 149, 6, 5048);
    			add_location(p11, file, 153, 6, 5242);
    			add_location(section3, file, 82, 4, 2956);
    			add_location(p12, file, 188, 6, 6253);
    			add_location(p13, file, 193, 6, 6445);
    			attr_dev(div2, "class", "flex svelte-oc2kff");
    			add_location(div2, file, 194, 6, 6517);
    			add_location(p14, file, 213, 6, 7200);
    			attr_dev(div3, "class", "flex svelte-oc2kff");
    			add_location(div3, file, 217, 6, 7348);
    			add_location(section4, file, 186, 4, 6214);
    			add_location(p15, file, 224, 6, 7586);
    			add_location(p16, file, 238, 6, 8013);
    			add_location(p17, file, 243, 6, 8243);
    			add_location(p18, file, 254, 6, 8606);
    			add_location(section5, file, 222, 4, 7547);
    			add_location(p19, file, 262, 6, 8878);
    			add_location(p20, file, 266, 6, 9043);
    			add_location(p21, file, 271, 6, 9253);
    			add_location(p22, file, 275, 6, 9410);
    			attr_dev(div4, "class", "flex svelte-oc2kff");
    			add_location(div4, file, 279, 6, 9534);
    			add_location(section6, file, 260, 4, 8839);
    			add_location(p23, file, 292, 6, 9874);
    			add_location(p24, file, 296, 6, 9996);
    			add_location(p25, file, 300, 6, 10129);
    			attr_dev(li3, "class", "svelte-oc2kff");
    			add_location(li3, file, 302, 8, 10180);
    			attr_dev(li4, "class", "svelte-oc2kff");
    			add_location(li4, file, 303, 8, 10223);
    			attr_dev(li5, "class", "svelte-oc2kff");
    			add_location(li5, file, 307, 8, 10350);
    			attr_dev(li6, "class", "svelte-oc2kff");
    			add_location(li6, file, 315, 8, 10627);
    			attr_dev(li7, "class", "svelte-oc2kff");
    			add_location(li7, file, 323, 8, 10922);
    			add_location(ol1, file, 301, 6, 10167);
    			add_location(section7, file, 290, 4, 9835);
    			add_location(p26, file, 335, 6, 11218);
    			add_location(p27, file, 339, 6, 11400);
    			add_location(p28, file, 343, 6, 11552);
    			add_location(section8, file, 333, 4, 11178);
    			add_location(p29, file, 350, 6, 11751);
    			add_location(p30, file, 355, 6, 11952);
    			add_location(section9, file, 348, 4, 11711);
    			add_location(section10, file, 80, 2, 2917);
    			attr_dev(h15, "class", "svelte-oc2kff");
    			add_location(h15, file, 362, 4, 12145);
    			add_location(p31, file, 369, 4, 12382);
    			add_location(p32, file, 374, 4, 12576);
    			add_location(br, file, 379, 4, 12754);
    			add_location(p33, file, 402, 4, 13047);
    			add_location(p34, file, 407, 4, 13262);
    			add_location(p35, file, 412, 4, 13488);
    			add_location(section11, file, 361, 2, 12131);
    			add_location(strike0, file, 419, 8, 13742);
    			attr_dev(h16, "class", "svelte-oc2kff");
    			add_location(h16, file, 419, 4, 13738);
    			add_location(p36, file, 420, 4, 13781);
    			add_location(p37, file, 434, 4, 14196);
    			attr_dev(li8, "class", "svelte-oc2kff");
    			add_location(li8, file, 439, 6, 14364);
    			add_location(small2, file, 442, 11, 14459);
    			add_location(strike1, file, 441, 29, 14440);
    			attr_dev(li9, "class", "svelte-oc2kff");
    			add_location(li9, file, 440, 6, 14406);
    			add_location(ul0, file, 438, 4, 14353);
    			add_location(p38, file, 446, 4, 14546);
    			attr_dev(h20, "class", "svelte-oc2kff");
    			add_location(h20, file, 451, 4, 14766);
    			attr_dev(li10, "class", "svelte-oc2kff");
    			add_location(li10, file, 453, 6, 14806);
    			attr_dev(li11, "class", "svelte-oc2kff");
    			add_location(li11, file, 456, 6, 14904);
    			attr_dev(li12, "class", "svelte-oc2kff");
    			add_location(li12, file, 462, 6, 15141);
    			add_location(ul1, file, 452, 4, 14795);
    			attr_dev(h21, "class", "svelte-oc2kff");
    			add_location(h21, file, 468, 4, 15360);
    			add_location(small3, file, 471, 60, 15466);
    			attr_dev(li13, "class", "svelte-oc2kff");
    			add_location(li13, file, 470, 6, 15401);
    			attr_dev(li14, "class", "svelte-oc2kff");
    			add_location(li14, file, 474, 6, 15515);
    			set_style(img, "vertical-align", "middle");
    			set_style(img, "height", "1.7em");
    			if (!src_url_equal(img.src, img_src_value = "resources/stats/dailinSmile.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "Emote Li Dailin Sorrindo");
    			add_location(img, file, 480, 8, 15723);
    			attr_dev(li15, "class", "svelte-oc2kff");
    			add_location(li15, file, 478, 6, 15658);
    			add_location(ul2, file, 469, 4, 15390);
    			add_location(p39, file, 487, 4, 15912);
    			attr_dev(h22, "class", "svelte-oc2kff");
    			add_location(h22, file, 491, 4, 16044);
    			attr_dev(li16, "class", "svelte-oc2kff");
    			add_location(li16, file, 493, 6, 16080);
    			attr_dev(li17, "class", "svelte-oc2kff");
    			add_location(li17, file, 498, 6, 16285);
    			attr_dev(li18, "class", "svelte-oc2kff");
    			add_location(li18, file, 502, 6, 16422);
    			add_location(ul3, file, 492, 4, 16069);
    			attr_dev(h23, "class", "svelte-oc2kff");
    			add_location(h23, file, 507, 4, 16561);
    			add_location(ul4, file, 508, 4, 16593);
    			attr_dev(h24, "class", "svelte-oc2kff");
    			add_location(h24, file, 513, 4, 16806);
    			attr_dev(li19, "class", "svelte-oc2kff");
    			add_location(li19, file, 515, 6, 16843);
    			attr_dev(li20, "class", "svelte-oc2kff");
    			add_location(li20, file, 520, 6, 17073);
    			add_location(ul5, file, 514, 4, 16832);
    			add_location(section12, file, 418, 2, 13724);
    			attr_dev(h17, "class", "svelte-oc2kff");
    			add_location(h17, file, 533, 4, 17526);
    			add_location(section13, file, 532, 2, 17512);
    			attr_dev(h18, "class", "svelte-oc2kff");
    			add_location(h18, file, 536, 4, 17574);
    			add_location(p40, file, 537, 4, 17595);
    			attr_dev(a0, "href", "https://www.twitch.tv/qhrudwkd777");
    			attr_dev(a0, "class", "svelte-oc2kff");
    			add_location(a0, file, 542, 10, 17764);
    			attr_dev(li21, "class", "svelte-oc2kff");
    			add_location(li21, file, 542, 6, 17760);
    			attr_dev(a1, "href", "https://www.twitch.tv/bi9sean55");
    			attr_dev(a1, "class", "svelte-oc2kff");
    			add_location(a1, file, 543, 10, 17830);
    			attr_dev(li22, "class", "svelte-oc2kff");
    			add_location(li22, file, 543, 6, 17826);
    			attr_dev(a2, "href", "https://www.twitch.tv/lnerotv");
    			attr_dev(a2, "class", "svelte-oc2kff");
    			add_location(a2, file, 544, 10, 17899);
    			attr_dev(li23, "class", "svelte-oc2kff");
    			add_location(li23, file, 544, 6, 17895);
    			attr_dev(a3, "href", "https://www.twitch.tv/shuvisenpai");
    			attr_dev(a3, "class", "svelte-oc2kff");
    			add_location(a3, file, 545, 10, 17966);
    			attr_dev(li24, "class", "svelte-oc2kff");
    			add_location(li24, file, 545, 6, 17962);
    			attr_dev(a4, "href", "https://www.twitch.tv/uemaaaaa");
    			attr_dev(a4, "class", "svelte-oc2kff");
    			add_location(a4, file, 547, 8, 18050);
    			add_location(small4, file, 548, 8, 18112);
    			attr_dev(li25, "class", "svelte-oc2kff");
    			add_location(li25, file, 546, 6, 18037);
    			add_location(ul6, file, 541, 4, 17749);
    			add_location(section14, file, 535, 2, 17560);
    			attr_dev(div5, "class", "container svelte-oc2kff");
    			add_location(div5, file, 16, 0, 759);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div5, anchor);
    			append_dev(div5, h10);
    			append_dev(div5, t1);
    			mount_component(figure0, div5, null);
    			append_dev(div5, t2);
    			append_dev(div5, section0);
    			append_dev(section0, h11);
    			append_dev(section0, t4);
    			append_dev(section0, p0);
    			append_dev(section0, t6);
    			append_dev(section0, p1);
    			append_dev(section0, t8);
    			append_dev(section0, p2);
    			append_dev(p2, t9);
    			mount_component(copiabletext, p2, null);
    			append_dev(div5, t10);
    			append_dev(div5, section1);
    			append_dev(section1, h12);
    			append_dev(section1, t12);
    			append_dev(section1, p3);
    			append_dev(section1, t14);
    			mount_component(question0, section1, null);
    			append_dev(section1, t15);
    			mount_component(answer0, section1, null);
    			append_dev(section1, t16);
    			append_dev(section1, p4);
    			append_dev(div5, t18);
    			append_dev(div5, section2);
    			append_dev(section2, h13);
    			append_dev(section2, t20);
    			append_dev(section2, p5);
    			append_dev(section2, t22);
    			mount_component(question1, section2, null);
    			append_dev(section2, t23);
    			append_dev(section2, iframe);
    			append_dev(section2, t24);
    			append_dev(section2, p6);
    			append_dev(div5, t26);
    			append_dev(div5, section10);
    			append_dev(section10, h14);
    			append_dev(section10, t28);
    			append_dev(section10, section3);
    			mount_component(skill0, section3, null);
    			append_dev(section3, t29);
    			append_dev(section3, p7);
    			append_dev(section3, t31);
    			append_dev(section3, p8);
    			append_dev(p8, t32);
    			mount_component(textmodal0, p8, null);
    			append_dev(p8, t33);
    			append_dev(section3, t34);
    			append_dev(section3, ol0);
    			append_dev(ol0, li0);
    			append_dev(li0, t35);
    			append_dev(li0, small0);
    			append_dev(small0, t36);
    			mount_component(hoverableskill0, small0, null);
    			append_dev(small0, t37);
    			append_dev(li0, t38);
    			append_dev(ol0, t39);
    			append_dev(ol0, li1);
    			append_dev(li1, t40);
    			append_dev(li1, small1);
    			append_dev(small1, t41);
    			mount_component(hoverableskill1, small1, null);
    			append_dev(small1, t42);
    			append_dev(li1, t43);
    			append_dev(ol0, t44);
    			append_dev(ol0, li2);
    			mount_component(tooltiptext0, li2, null);
    			append_dev(section3, t45);
    			append_dev(section3, p9);
    			append_dev(p9, t46);
    			append_dev(p9, span);
    			append_dev(p9, t48);
    			append_dev(section3, t49);
    			append_dev(section3, div0);
    			mount_component(video0, div0, null);
    			append_dev(div0, t50);
    			mount_component(video1, div0, null);
    			append_dev(div0, t51);
    			mount_component(video2, div0, null);
    			append_dev(div0, t52);
    			mount_component(video3, div0, null);
    			append_dev(section3, t53);
    			append_dev(section3, p10);
    			append_dev(p10, b);
    			append_dev(section3, t55);
    			append_dev(section3, div1);
    			mount_component(video4, div1, null);
    			append_dev(div1, t56);
    			mount_component(video5, div1, null);
    			append_dev(section3, t57);
    			append_dev(section3, p11);
    			append_dev(p11, t58);
    			mount_component(textmodal1, p11, null);
    			append_dev(p11, t59);
    			mount_component(textmodal2, p11, null);
    			append_dev(p11, t60);
    			mount_component(tooltip, p11, null);
    			append_dev(section10, t61);
    			append_dev(section10, section4);
    			mount_component(skill1, section4, null);
    			append_dev(section4, t62);
    			append_dev(section4, p12);
    			append_dev(section4, t64);
    			append_dev(section4, p13);
    			append_dev(section4, t66);
    			append_dev(section4, div2);
    			mount_component(video6, div2, null);
    			append_dev(div2, t67);
    			mount_component(video7, div2, null);
    			append_dev(div2, t68);
    			mount_component(video8, div2, null);
    			append_dev(section4, t69);
    			append_dev(section4, p14);
    			append_dev(p14, t70);
    			mount_component(hoverableskill2, p14, null);
    			append_dev(p14, t71);
    			append_dev(section4, t72);
    			append_dev(section4, div3);
    			mount_component(video9, div3, null);
    			append_dev(div3, t73);
    			mount_component(video10, div3, null);
    			append_dev(section10, t74);
    			append_dev(section10, section5);
    			mount_component(skill2, section5, null);
    			append_dev(section5, t75);
    			append_dev(section5, p15);
    			append_dev(section5, t77);
    			mount_component(question2, section5, null);
    			append_dev(section5, t78);
    			mount_component(figure1, section5, null);
    			append_dev(section5, t79);
    			append_dev(section5, p16);
    			append_dev(section5, t81);
    			append_dev(section5, p17);
    			append_dev(p17, t82);
    			mount_component(hoverableskill3, p17, null);
    			append_dev(p17, t83);
    			mount_component(textmodal3, p17, null);
    			append_dev(p17, t84);
    			append_dev(section5, t85);
    			append_dev(section5, p18);
    			append_dev(p18, t86);
    			mount_component(hoverableskill4, p18, null);
    			append_dev(p18, t87);
    			mount_component(hoverableskill5, p18, null);
    			append_dev(p18, t88);
    			append_dev(section10, t89);
    			append_dev(section10, section6);
    			mount_component(skill3, section6, null);
    			append_dev(section6, t90);
    			append_dev(section6, p19);
    			append_dev(section6, t92);
    			append_dev(section6, p20);
    			append_dev(section6, t94);
    			append_dev(section6, p21);
    			append_dev(section6, t96);
    			append_dev(section6, p22);
    			append_dev(section6, t98);
    			append_dev(section6, div4);
    			mount_component(video11, div4, null);
    			append_dev(div4, t99);
    			mount_component(video12, div4, null);
    			append_dev(section10, t100);
    			append_dev(section10, section7);
    			mount_component(skill4, section7, null);
    			append_dev(section7, t101);
    			append_dev(section7, p23);
    			append_dev(section7, t103);
    			append_dev(section7, p24);
    			append_dev(section7, t105);
    			append_dev(section7, p25);
    			append_dev(section7, t107);
    			append_dev(section7, ol1);
    			append_dev(ol1, li3);
    			append_dev(ol1, t109);
    			append_dev(ol1, li4);
    			append_dev(ol1, t111);
    			append_dev(ol1, li5);
    			mount_component(textmodal4, li5, null);
    			append_dev(ol1, t112);
    			append_dev(ol1, li6);
    			mount_component(textmodal5, li6, null);
    			append_dev(ol1, t113);
    			append_dev(ol1, li7);
    			mount_component(textmodal6, li7, null);
    			append_dev(section10, t114);
    			append_dev(section10, section8);
    			mount_component(skill5, section8, null);
    			append_dev(section8, t115);
    			append_dev(section8, p26);
    			append_dev(section8, t117);
    			append_dev(section8, p27);
    			append_dev(section8, t119);
    			append_dev(section8, p28);
    			append_dev(section10, t121);
    			append_dev(section10, section9);
    			mount_component(skill6, section9, null);
    			append_dev(section9, t122);
    			append_dev(section9, p29);
    			append_dev(section9, t124);
    			append_dev(section9, p30);
    			append_dev(div5, t126);
    			append_dev(div5, section11);
    			append_dev(section11, h15);
    			append_dev(section11, t128);
    			mount_component(question3, section11, null);
    			append_dev(section11, t129);
    			mount_component(figure2, section11, null);
    			append_dev(section11, t130);
    			append_dev(section11, p31);
    			append_dev(section11, t132);
    			append_dev(section11, p32);
    			append_dev(section11, t134);
    			mount_component(video13, section11, null);
    			append_dev(section11, t135);
    			append_dev(section11, br);
    			append_dev(section11, t136);
    			mount_component(combo, section11, null);
    			append_dev(section11, t137);
    			append_dev(section11, p33);
    			append_dev(section11, t139);
    			append_dev(section11, p34);
    			append_dev(section11, t141);
    			append_dev(section11, p35);
    			append_dev(div5, t143);
    			append_dev(div5, section12);
    			append_dev(section12, h16);
    			append_dev(h16, strike0);
    			append_dev(h16, t145);
    			append_dev(section12, t146);
    			append_dev(section12, p36);
    			append_dev(section12, t148);
    			mount_component(question4, section12, null);
    			append_dev(section12, t149);
    			mount_component(answer1, section12, null);
    			append_dev(section12, t150);
    			append_dev(section12, p37);
    			append_dev(section12, t152);
    			append_dev(section12, ul0);
    			append_dev(ul0, li8);
    			append_dev(ul0, t154);
    			append_dev(ul0, li9);
    			append_dev(li9, t155);
    			append_dev(li9, strike1);
    			append_dev(strike1, small2);
    			append_dev(li9, t157);
    			append_dev(section12, t158);
    			append_dev(section12, p38);
    			append_dev(section12, t160);
    			append_dev(section12, h20);
    			append_dev(section12, t162);
    			append_dev(section12, ul1);
    			append_dev(ul1, li10);
    			append_dev(ul1, t164);
    			append_dev(ul1, li11);
    			append_dev(li11, t165);
    			mount_component(tooltiptext1, li11, null);
    			append_dev(li11, t166);
    			append_dev(ul1, t167);
    			append_dev(ul1, li12);
    			append_dev(section12, t169);
    			append_dev(section12, h21);
    			append_dev(section12, t171);
    			append_dev(section12, ul2);
    			append_dev(ul2, li13);
    			append_dev(li13, t172);
    			append_dev(li13, small3);
    			append_dev(li13, t174);
    			append_dev(ul2, t175);
    			append_dev(ul2, li14);
    			append_dev(ul2, t177);
    			append_dev(ul2, li15);
    			append_dev(li15, t178);
    			mount_component(hoverableskill6, li15, null);
    			append_dev(li15, t179);
    			append_dev(li15, img);
    			append_dev(li15, t180);
    			append_dev(section12, t181);
    			append_dev(section12, p39);
    			append_dev(section12, t183);
    			append_dev(section12, h22);
    			append_dev(section12, t185);
    			append_dev(section12, ul3);
    			append_dev(ul3, li16);
    			append_dev(li16, t186);
    			mount_component(hoverableskill7, li16, null);
    			append_dev(li16, t187);
    			append_dev(ul3, t188);
    			append_dev(ul3, li17);
    			append_dev(ul3, t190);
    			append_dev(ul3, li18);
    			append_dev(section12, t192);
    			append_dev(section12, h23);
    			append_dev(section12, t194);
    			append_dev(section12, ul4);
    			append_dev(section12, t196);
    			append_dev(section12, h24);
    			append_dev(section12, t198);
    			append_dev(section12, ul5);
    			append_dev(ul5, li19);
    			append_dev(ul5, t200);
    			append_dev(ul5, li20);
    			append_dev(section12, t202);
    			mount_component(question5, section12, null);
    			append_dev(section12, t203);
    			mount_component(answer2, section12, null);
    			append_dev(div5, t204);
    			append_dev(div5, section13);
    			append_dev(section13, h17);
    			append_dev(div5, t206);
    			append_dev(div5, section14);
    			append_dev(section14, h18);
    			append_dev(section14, t208);
    			append_dev(section14, p40);
    			append_dev(section14, t210);
    			append_dev(section14, ul6);
    			append_dev(ul6, li21);
    			append_dev(li21, a0);
    			append_dev(ul6, t212);
    			append_dev(ul6, li22);
    			append_dev(li22, a1);
    			append_dev(ul6, t214);
    			append_dev(ul6, li23);
    			append_dev(li23, a2);
    			append_dev(ul6, t216);
    			append_dev(ul6, li24);
    			append_dev(li24, a3);
    			append_dev(ul6, t218);
    			append_dev(ul6, li25);
    			append_dev(li25, a4);
    			append_dev(li25, t220);
    			append_dev(li25, small4);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const question0_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				question0_changes.$$scope = { dirty, ctx };
    			}

    			question0.$set(question0_changes);
    			const answer0_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				answer0_changes.$$scope = { dirty, ctx };
    			}

    			answer0.$set(answer0_changes);
    			const question1_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				question1_changes.$$scope = { dirty, ctx };
    			}

    			question1.$set(question1_changes);
    			const textmodal0_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				textmodal0_changes.$$scope = { dirty, ctx };
    			}

    			textmodal0.$set(textmodal0_changes);
    			const textmodal1_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				textmodal1_changes.$$scope = { dirty, ctx };
    			}

    			textmodal1.$set(textmodal1_changes);
    			const textmodal2_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				textmodal2_changes.$$scope = { dirty, ctx };
    			}

    			textmodal2.$set(textmodal2_changes);
    			const tooltip_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				tooltip_changes.$$scope = { dirty, ctx };
    			}

    			tooltip.$set(tooltip_changes);
    			const question2_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				question2_changes.$$scope = { dirty, ctx };
    			}

    			question2.$set(question2_changes);
    			const textmodal3_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				textmodal3_changes.$$scope = { dirty, ctx };
    			}

    			textmodal3.$set(textmodal3_changes);
    			const textmodal4_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				textmodal4_changes.$$scope = { dirty, ctx };
    			}

    			textmodal4.$set(textmodal4_changes);
    			const textmodal5_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				textmodal5_changes.$$scope = { dirty, ctx };
    			}

    			textmodal5.$set(textmodal5_changes);
    			const textmodal6_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				textmodal6_changes.$$scope = { dirty, ctx };
    			}

    			textmodal6.$set(textmodal6_changes);
    			const question3_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				question3_changes.$$scope = { dirty, ctx };
    			}

    			question3.$set(question3_changes);
    			const question4_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				question4_changes.$$scope = { dirty, ctx };
    			}

    			question4.$set(question4_changes);
    			const answer1_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				answer1_changes.$$scope = { dirty, ctx };
    			}

    			answer1.$set(answer1_changes);
    			const question5_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				question5_changes.$$scope = { dirty, ctx };
    			}

    			question5.$set(question5_changes);
    			const answer2_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				answer2_changes.$$scope = { dirty, ctx };
    			}

    			answer2.$set(answer2_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(figure0.$$.fragment, local);
    			transition_in(copiabletext.$$.fragment, local);
    			transition_in(question0.$$.fragment, local);
    			transition_in(answer0.$$.fragment, local);
    			transition_in(question1.$$.fragment, local);
    			transition_in(skill0.$$.fragment, local);
    			transition_in(textmodal0.$$.fragment, local);
    			transition_in(hoverableskill0.$$.fragment, local);
    			transition_in(hoverableskill1.$$.fragment, local);
    			transition_in(tooltiptext0.$$.fragment, local);
    			transition_in(video0.$$.fragment, local);
    			transition_in(video1.$$.fragment, local);
    			transition_in(video2.$$.fragment, local);
    			transition_in(video3.$$.fragment, local);
    			transition_in(video4.$$.fragment, local);
    			transition_in(video5.$$.fragment, local);
    			transition_in(textmodal1.$$.fragment, local);
    			transition_in(textmodal2.$$.fragment, local);
    			transition_in(tooltip.$$.fragment, local);
    			transition_in(skill1.$$.fragment, local);
    			transition_in(video6.$$.fragment, local);
    			transition_in(video7.$$.fragment, local);
    			transition_in(video8.$$.fragment, local);
    			transition_in(hoverableskill2.$$.fragment, local);
    			transition_in(video9.$$.fragment, local);
    			transition_in(video10.$$.fragment, local);
    			transition_in(skill2.$$.fragment, local);
    			transition_in(question2.$$.fragment, local);
    			transition_in(figure1.$$.fragment, local);
    			transition_in(hoverableskill3.$$.fragment, local);
    			transition_in(textmodal3.$$.fragment, local);
    			transition_in(hoverableskill4.$$.fragment, local);
    			transition_in(hoverableskill5.$$.fragment, local);
    			transition_in(skill3.$$.fragment, local);
    			transition_in(video11.$$.fragment, local);
    			transition_in(video12.$$.fragment, local);
    			transition_in(skill4.$$.fragment, local);
    			transition_in(textmodal4.$$.fragment, local);
    			transition_in(textmodal5.$$.fragment, local);
    			transition_in(textmodal6.$$.fragment, local);
    			transition_in(skill5.$$.fragment, local);
    			transition_in(skill6.$$.fragment, local);
    			transition_in(question3.$$.fragment, local);
    			transition_in(figure2.$$.fragment, local);
    			transition_in(video13.$$.fragment, local);
    			transition_in(combo.$$.fragment, local);
    			transition_in(question4.$$.fragment, local);
    			transition_in(answer1.$$.fragment, local);
    			transition_in(tooltiptext1.$$.fragment, local);
    			transition_in(hoverableskill6.$$.fragment, local);
    			transition_in(hoverableskill7.$$.fragment, local);
    			transition_in(question5.$$.fragment, local);
    			transition_in(answer2.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(figure0.$$.fragment, local);
    			transition_out(copiabletext.$$.fragment, local);
    			transition_out(question0.$$.fragment, local);
    			transition_out(answer0.$$.fragment, local);
    			transition_out(question1.$$.fragment, local);
    			transition_out(skill0.$$.fragment, local);
    			transition_out(textmodal0.$$.fragment, local);
    			transition_out(hoverableskill0.$$.fragment, local);
    			transition_out(hoverableskill1.$$.fragment, local);
    			transition_out(tooltiptext0.$$.fragment, local);
    			transition_out(video0.$$.fragment, local);
    			transition_out(video1.$$.fragment, local);
    			transition_out(video2.$$.fragment, local);
    			transition_out(video3.$$.fragment, local);
    			transition_out(video4.$$.fragment, local);
    			transition_out(video5.$$.fragment, local);
    			transition_out(textmodal1.$$.fragment, local);
    			transition_out(textmodal2.$$.fragment, local);
    			transition_out(tooltip.$$.fragment, local);
    			transition_out(skill1.$$.fragment, local);
    			transition_out(video6.$$.fragment, local);
    			transition_out(video7.$$.fragment, local);
    			transition_out(video8.$$.fragment, local);
    			transition_out(hoverableskill2.$$.fragment, local);
    			transition_out(video9.$$.fragment, local);
    			transition_out(video10.$$.fragment, local);
    			transition_out(skill2.$$.fragment, local);
    			transition_out(question2.$$.fragment, local);
    			transition_out(figure1.$$.fragment, local);
    			transition_out(hoverableskill3.$$.fragment, local);
    			transition_out(textmodal3.$$.fragment, local);
    			transition_out(hoverableskill4.$$.fragment, local);
    			transition_out(hoverableskill5.$$.fragment, local);
    			transition_out(skill3.$$.fragment, local);
    			transition_out(video11.$$.fragment, local);
    			transition_out(video12.$$.fragment, local);
    			transition_out(skill4.$$.fragment, local);
    			transition_out(textmodal4.$$.fragment, local);
    			transition_out(textmodal5.$$.fragment, local);
    			transition_out(textmodal6.$$.fragment, local);
    			transition_out(skill5.$$.fragment, local);
    			transition_out(skill6.$$.fragment, local);
    			transition_out(question3.$$.fragment, local);
    			transition_out(figure2.$$.fragment, local);
    			transition_out(video13.$$.fragment, local);
    			transition_out(combo.$$.fragment, local);
    			transition_out(question4.$$.fragment, local);
    			transition_out(answer1.$$.fragment, local);
    			transition_out(tooltiptext1.$$.fragment, local);
    			transition_out(hoverableskill6.$$.fragment, local);
    			transition_out(hoverableskill7.$$.fragment, local);
    			transition_out(question5.$$.fragment, local);
    			transition_out(answer2.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div5);
    			destroy_component(figure0);
    			destroy_component(copiabletext);
    			destroy_component(question0);
    			destroy_component(answer0);
    			destroy_component(question1);
    			destroy_component(skill0);
    			destroy_component(textmodal0);
    			destroy_component(hoverableskill0);
    			destroy_component(hoverableskill1);
    			destroy_component(tooltiptext0);
    			destroy_component(video0);
    			destroy_component(video1);
    			destroy_component(video2);
    			destroy_component(video3);
    			destroy_component(video4);
    			destroy_component(video5);
    			destroy_component(textmodal1);
    			destroy_component(textmodal2);
    			destroy_component(tooltip);
    			destroy_component(skill1);
    			destroy_component(video6);
    			destroy_component(video7);
    			destroy_component(video8);
    			destroy_component(hoverableskill2);
    			destroy_component(video9);
    			destroy_component(video10);
    			destroy_component(skill2);
    			destroy_component(question2);
    			destroy_component(figure1);
    			destroy_component(hoverableskill3);
    			destroy_component(textmodal3);
    			destroy_component(hoverableskill4);
    			destroy_component(hoverableskill5);
    			destroy_component(skill3);
    			destroy_component(video11);
    			destroy_component(video12);
    			destroy_component(skill4);
    			destroy_component(textmodal4);
    			destroy_component(textmodal5);
    			destroy_component(textmodal6);
    			destroy_component(skill5);
    			destroy_component(skill6);
    			destroy_component(question3);
    			destroy_component(figure2);
    			destroy_component(video13);
    			destroy_component(combo);
    			destroy_component(question4);
    			destroy_component(answer1);
    			destroy_component(tooltiptext1);
    			destroy_component(hoverableskill6);
    			destroy_component(hoverableskill7);
    			destroy_component(question5);
    			destroy_component(answer2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	countapiJs.visits().then(result => console.log(result.value));
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		countapi: countapiJs,
    		CopiableText,
    		Figure,
    		Answer,
    		Question,
    		Combo,
    		HoverableSkill: SkillModal,
    		Skill,
    		TextModal,
    		Tooltip,
    		TooltipText,
    		Video
    	});

    	return [];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    	props: {
    		name: 'world'
    	}
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
