
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

    /* src\CopiableText.svelte generated by Svelte v3.42.1 */

    const file$5 = "src\\CopiableText.svelte";

    function create_fragment$5(ctx) {
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
    			add_location(i, file$5, 8, 2, 144);
    			attr_dev(span, "title", "Clique para copiar");
    			attr_dev(span, "class", "svelte-e703nl");
    			add_location(span, file$5, 4, 0, 43);
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
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, { text: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CopiableText",
    			options,
    			id: create_fragment$5.name
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

    /* src\skills\Icon.svelte generated by Svelte v3.42.1 */

    const file$4 = "src\\skills\\Icon.svelte";

    // (9:2) {#if key}
    function create_if_block(ctx) {
    	let span;
    	let t;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t = text(/*key*/ ctx[1]);
    			attr_dev(span, "class", "key svelte-j4pn79");
    			add_location(span, file$4, 9, 4, 186);
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
    		id: create_if_block.name,
    		type: "if",
    		source: "(9:2) {#if key}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let span;
    	let img;
    	let img_src_value;
    	let t;
    	let if_block = /*key*/ ctx[1] && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			span = element("span");
    			img = element("img");
    			t = space();
    			if (if_block) if_block.c();
    			if (!src_url_equal(img.src, img_src_value = /*src*/ ctx[0])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", /*key*/ ctx[1]);
    			attr_dev(img, "class", "svelte-j4pn79");
    			add_location(img, file$4, 7, 2, 144);
    			attr_dev(span, "class", "container svelte-j4pn79");
    			set_style(span, "--size", /*size*/ ctx[2] + "px");
    			add_location(span, file$4, 6, 0, 91);
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
    					if_block = create_if_block(ctx);
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
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, { src: 0, key: 1, size: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Icon",
    			options,
    			id: create_fragment$4.name
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

    /* src\Tooltip.svelte generated by Svelte v3.42.1 */

    const file$3 = "src\\Tooltip.svelte";
    const get_tooltip_slot_changes = dirty => ({});
    const get_tooltip_slot_context = ctx => ({});
    const get_hoverable_slot_changes = dirty => ({});
    const get_hoverable_slot_context = ctx => ({});

    function create_fragment$3(ctx) {
    	let span1;
    	let span0;
    	let t;
    	let div;
    	let current;
    	const hoverable_slot_template = /*#slots*/ ctx[1].hoverable;
    	const hoverable_slot = create_slot(hoverable_slot_template, ctx, /*$$scope*/ ctx[0], get_hoverable_slot_context);
    	const tooltip_slot_template = /*#slots*/ ctx[1].tooltip;
    	const tooltip_slot = create_slot(tooltip_slot_template, ctx, /*$$scope*/ ctx[0], get_tooltip_slot_context);

    	const block = {
    		c: function create() {
    			span1 = element("span");
    			span0 = element("span");
    			if (hoverable_slot) hoverable_slot.c();
    			t = space();
    			div = element("div");
    			if (tooltip_slot) tooltip_slot.c();
    			attr_dev(span0, "class", "hoverable svelte-6pg9cs");
    			add_location(span0, file$3, 1, 2, 10);
    			attr_dev(div, "class", "tooltip svelte-6pg9cs");
    			add_location(div, file$3, 4, 2, 80);
    			attr_dev(span1, "class", "svelte-6pg9cs");
    			add_location(span1, file$3, 0, 0, 0);
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
    			append_dev(span1, div);

    			if (tooltip_slot) {
    				tooltip_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (hoverable_slot) {
    				if (hoverable_slot.p && (!current || dirty & /*$$scope*/ 1)) {
    					update_slot_base(
    						hoverable_slot,
    						hoverable_slot_template,
    						ctx,
    						/*$$scope*/ ctx[0],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[0])
    						: get_slot_changes(hoverable_slot_template, /*$$scope*/ ctx[0], dirty, get_hoverable_slot_changes),
    						get_hoverable_slot_context
    					);
    				}
    			}

    			if (tooltip_slot) {
    				if (tooltip_slot.p && (!current || dirty & /*$$scope*/ 1)) {
    					update_slot_base(
    						tooltip_slot,
    						tooltip_slot_template,
    						ctx,
    						/*$$scope*/ ctx[0],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[0])
    						: get_slot_changes(tooltip_slot_template, /*$$scope*/ ctx[0], dirty, get_tooltip_slot_changes),
    						get_tooltip_slot_context
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(hoverable_slot, local);
    			transition_in(tooltip_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(hoverable_slot, local);
    			transition_out(tooltip_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span1);
    			if (hoverable_slot) hoverable_slot.d(detaching);
    			if (tooltip_slot) tooltip_slot.d(detaching);
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
    	validate_slots('Tooltip', slots, ['hoverable','tooltip']);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Tooltip> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('$$scope' in $$props) $$invalidate(0, $$scope = $$props.$$scope);
    	};

    	return [$$scope, slots];
    }

    class Tooltip extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Tooltip",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    var T={icon:"https://dak.gg/bser/images/assets/skill/1010100.png",name:"Concentração de Álcool no Sangue (CAS)",description:["Li Dailin pode usar Beber para encher sua barra de CAS. Quando sua CAS está acima de 40, ela fica Bêbada, dando a suas habilidades efeitos extras e ganhando Alcoolizada depois de usar uma habilidade.","Se sua CAS chegar à 100, ela fica Embriagada, é silenciada por 5 segundos e ganha Alcoolizada.","Alcoolizada: O próximo ataque normal de Li Dailin acontece 2 vezes.","Estômago Forte: Sua velocidade de ataque é aumentada por um certo tempo após o consumo de bebidas alcoólicas."],key:"T"};var Q={icon:"https://dak.gg/bser/images/assets/skill/1010200.png",name:"Chute Vivaz",description:["Li Dailin avança para a frente, causando dano aos inimigos atingidos. Ela pode reativar esta habilidade mais duas vezes.","Bêbada: Aumenta o alcance e os danos causados."],key:"Q"};var W={icon:"https://dak.gg/bser/images/assets/skill/1010300.png",name:"Beber",description:["Li Dailin toma um gole, ganhando Força Líquida, aumentando seu CAS, e evitando ataques normais enquanto bebe.","Força Líquida: o dano de seu próximo ataque normal e o dano de Alcoolizada são aumentados dependendo de seu CAS."],key:"W"};var E={icon:"https://dak.gg/bser/images/assets/skill/1010400.png",name:"Prateleira Inferior",description:["Li Dailin cospe licor barato em uma área, com formato de cone, na sua frente, causando dano aos inimigos ao seu alcance e aplicando lentidão.","Bêbada: Aplica silenciar aos inimigos."],key:"E"};var R={icon:"https://dak.gg/bser/images/assets/skill/1010500.png",name:"Ataque do Tigre",description:["Li Dailin chuta para frente, não podendo ser impedida, suprimindo o primeiro inimigo atingido e seguindo com mais 2 chutes consecutivos, reduzindo seu tempo de recarga se atingir um inimigo.","Bêbada: Realiza 4 chutes consecutivos."],key:"R"};var DG={icon:"https://dak.gg/bser/images/assets/skill/1010200.png",name:"Chute Vivaz",description:["Li Dailin avança para a frente, causando dano aos inimigos atingidos. Ela pode reativar esta habilidade mais duas vezes.","Bêbada: Aumenta o alcance e os danos causados."],key:"Q"};var DN={icon:"https://dak.gg/bser/images/assets/skill/1010200.png",name:"Chute Vivaz",description:["Li Dailin avança para a frente, causando dano aos inimigos atingidos. Ela pode reativar esta habilidade mais duas vezes.","Bêbada: Aumenta o alcance e os danos causados."],key:"Q"};var skills = {T:T,Q:Q,W:W,E:E,R:R,DG:DG,DN:DN};

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

    /* src\skills\Skill.svelte generated by Svelte v3.42.1 */
    const file$2 = "src\\skills\\Skill.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i];
    	return child_ctx;
    }

    // (11:2) {#each skill.description as p}
    function create_each_block(ctx) {
    	let p;
    	let t_value = /*p*/ ctx[2] + "";
    	let t;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t = text(t_value);
    			add_location(p, file$2, 11, 4, 307);
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
    		id: create_each_block.name,
    		type: "each",
    		source: "(11:2) {#each skill.description as p}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
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
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
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

    			attr_dev(span, "class", "name svelte-1xfkp92");
    			add_location(span, file$2, 9, 2, 229);
    			attr_dev(div, "class", "skill svelte-1xfkp92");
    			add_location(div, file$2, 7, 0, 151);
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
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
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
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Skill', slots, []);
    	let { key } = $$props;
    	let skill = skills$1[key];
    	const writable_props = ['key'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Skill> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('key' in $$props) $$invalidate(1, key = $$props.key);
    	};

    	$$self.$capture_state = () => ({ skills: skills$1, Icon, key, skill });

    	$$self.$inject_state = $$props => {
    		if ('key' in $$props) $$invalidate(1, key = $$props.key);
    		if ('skill' in $$props) $$invalidate(0, skill = $$props.skill);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [skill, key];
    }

    class Skill extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { key: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Skill",
    			options,
    			id: create_fragment$2.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*key*/ ctx[1] === undefined && !('key' in props)) {
    			console.warn("<Skill> was created without expected prop 'key'");
    		}
    	}

    	get key() {
    		throw new Error("<Skill>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set key(value) {
    		throw new Error("<Skill>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\skills\HoverableSkill.svelte generated by Svelte v3.42.1 */
    const file$1 = "src\\skills\\HoverableSkill.svelte";

    // (15:4) 
    function create_hoverable_slot$1(ctx) {
    	let icon;
    	let current;

    	icon = new Icon({
    			props: {
    				slot: "hoverable",
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
    		id: create_hoverable_slot$1.name,
    		type: "slot",
    		source: "(15:4) ",
    		ctx
    	});

    	return block;
    }

    // (16:4) 
    function create_tooltip_slot$1(ctx) {
    	let skill_1;
    	let current;

    	skill_1 = new Skill({
    			props: { key: /*key*/ ctx[0], slot: "tooltip" },
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
    			if (dirty & /*key*/ 1) skill_1_changes.key = /*key*/ ctx[0];
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
    		id: create_tooltip_slot$1.name,
    		type: "slot",
    		source: "(16:4) ",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let span;
    	let tooltip;
    	let current;

    	tooltip = new Tooltip({
    			props: {
    				$$slots: {
    					tooltip: [create_tooltip_slot$1],
    					hoverable: [create_hoverable_slot$1]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			span = element("span");
    			create_component(tooltip.$$.fragment);
    			attr_dev(span, "class", "skill svelte-8jj3ko");
    			add_location(span, file$1, 12, 0, 258);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			mount_component(tooltip, span, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const tooltip_changes = {};

    			if (dirty & /*$$scope, key, size*/ 11) {
    				tooltip_changes.$$scope = { dirty, ctx };
    			}

    			tooltip.$set(tooltip_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tooltip.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tooltip.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    			destroy_component(tooltip);
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
    	validate_slots('HoverableSkill', slots, []);
    	let { key } = $$props;
    	let { size } = $$props;
    	let skill = skills$1[key];
    	const writable_props = ['key', 'size'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<HoverableSkill> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('key' in $$props) $$invalidate(0, key = $$props.key);
    		if ('size' in $$props) $$invalidate(1, size = $$props.size);
    	};

    	$$self.$capture_state = () => ({
    		Icon,
    		Tooltip,
    		Skill,
    		skills: skills$1,
    		key,
    		size,
    		skill
    	});

    	$$self.$inject_state = $$props => {
    		if ('key' in $$props) $$invalidate(0, key = $$props.key);
    		if ('size' in $$props) $$invalidate(1, size = $$props.size);
    		if ('skill' in $$props) $$invalidate(2, skill = $$props.skill);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [key, size, skill];
    }

    class HoverableSkill extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { key: 0, size: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "HoverableSkill",
    			options,
    			id: create_fragment$1.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*key*/ ctx[0] === undefined && !('key' in props)) {
    			console.warn("<HoverableSkill> was created without expected prop 'key'");
    		}

    		if (/*size*/ ctx[1] === undefined && !('size' in props)) {
    			console.warn("<HoverableSkill> was created without expected prop 'size'");
    		}
    	}

    	get key() {
    		throw new Error("<HoverableSkill>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set key(value) {
    		throw new Error("<HoverableSkill>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<HoverableSkill>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<HoverableSkill>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\App.svelte generated by Svelte v3.42.1 */
    const file = "src\\App.svelte";

    // (82:12) 
    function create_hoverable_slot_5(ctx) {
    	let span;

    	const block = {
    		c: function create() {
    			span = element("span");
    			span.textContent = "40 CAS ou mais";
    			attr_dev(span, "slot", "hoverable");
    			add_location(span, file, 81, 12, 2872);
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
    		id: create_hoverable_slot_5.name,
    		type: "slot",
    		source: "(82:12) ",
    		ctx
    	});

    	return block;
    }

    // (83:12) 
    function create_tooltip_slot_5(ctx) {
    	let span;
    	let t0;
    	let br0;
    	let t1;
    	let br1;
    	let t2;
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t0 = text("Use o traço branco em baixo da sua barra de mana como referência.\n              ");
    			br0 = element("br");
    			t1 = space();
    			br1 = element("br");
    			t2 = space();
    			img = element("img");
    			add_location(br0, file, 84, 14, 3045);
    			add_location(br1, file, 85, 14, 3066);
    			if (!src_url_equal(img.src, img_src_value = "resources/habilidades/passiva/barra.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "class", "svelte-p1ercs");
    			add_location(img, file, 87, 14, 3147);
    			attr_dev(span, "slot", "tooltip");
    			add_location(span, file, 82, 12, 2929);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t0);
    			append_dev(span, br0);
    			append_dev(span, t1);
    			append_dev(span, br1);
    			append_dev(span, t2);
    			append_dev(span, img);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_tooltip_slot_5.name,
    		type: "slot",
    		source: "(83:12) ",
    		ctx
    	});

    	return block;
    }

    // (108:12) 
    function create_hoverable_slot_4(ctx) {
    	let span;

    	const block = {
    		c: function create() {
    			span = element("span");
    			span.textContent = "Obs²: Consumir bebidas alcóolicas dá um bonus considerável de\n              velocidade de ataque e é muito importante em builds com pouca\n              velocidade de ataque ou durante Alpha/Omega/Wickeline.";
    			attr_dev(span, "slot", "hoverable");
    			add_location(span, file, 107, 12, 3891);
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
    		id: create_hoverable_slot_4.name,
    		type: "slot",
    		source: "(108:12) ",
    		ctx
    	});

    	return block;
    }

    // (113:12) 
    function create_tooltip_slot_4(ctx) {
    	let span;
    	let video0;
    	let source0;
    	let source0_src_value;
    	let t0;
    	let p0;
    	let small0;
    	let t2;
    	let video1;
    	let source1;
    	let source1_src_value;
    	let t3;
    	let p1;
    	let small1;

    	const block = {
    		c: function create() {
    			span = element("span");
    			video0 = element("video");
    			source0 = element("source");
    			t0 = space();
    			p0 = element("p");
    			small0 = element("small");
    			small0.textContent = "Normal";
    			t2 = space();
    			video1 = element("video");
    			source1 = element("source");
    			t3 = space();
    			p1 = element("p");
    			small1 = element("small");
    			small1.textContent = "Com bêbida";
    			if (!src_url_equal(source0.src, source0_src_value = "resources/habilidades/passiva/SadDailin.mp4")) attr_dev(source0, "src", source0_src_value);
    			add_location(source0, file, 114, 16, 4248);
    			video0.autoplay = true;
    			video0.loop = true;
    			video0.muted = true;
    			attr_dev(video0, "class", "svelte-p1ercs");
    			add_location(video0, file, 113, 14, 4204);
    			add_location(small0, file, 116, 17, 4349);
    			add_location(p0, file, 116, 14, 4346);
    			if (!src_url_equal(source1.src, source1_src_value = "resources/habilidades/passiva/HappyDailin.mp4")) attr_dev(source1, "src", source1_src_value);
    			add_location(source1, file, 118, 16, 4433);
    			video1.autoplay = true;
    			video1.loop = true;
    			video1.muted = true;
    			attr_dev(video1, "class", "svelte-p1ercs");
    			add_location(video1, file, 117, 14, 4389);
    			add_location(small1, file, 120, 17, 4536);
    			add_location(p1, file, 120, 14, 4533);
    			attr_dev(span, "slot", "tooltip");
    			add_location(span, file, 112, 12, 4168);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, video0);
    			append_dev(video0, source0);
    			append_dev(span, t0);
    			append_dev(span, p0);
    			append_dev(p0, small0);
    			append_dev(span, t2);
    			append_dev(span, video1);
    			append_dev(video1, source1);
    			append_dev(span, t3);
    			append_dev(span, p1);
    			append_dev(p1, small1);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_tooltip_slot_4.name,
    		type: "slot",
    		source: "(113:12) ",
    		ctx
    	});

    	return block;
    }

    // (153:14) 
    function create_hoverable_slot_3(ctx) {
    	let span;

    	const block = {
    		c: function create() {
    			span = element("span");
    			span.textContent = "Se a primeira ativação da habilidade foi buffada por\n                alcoolizada, as duas ativações seguintes também serão;";
    			attr_dev(span, "slot", "hoverable");
    			add_location(span, file, 152, 14, 5560);
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
    		id: create_hoverable_slot_3.name,
    		type: "slot",
    		source: "(153:14) ",
    		ctx
    	});

    	return block;
    }

    // (157:14) 
    function create_tooltip_slot_3(ctx) {
    	let span;
    	let video;
    	let source;
    	let source_src_value;

    	const block = {
    		c: function create() {
    			span = element("span");
    			video = element("video");
    			source = element("source");
    			if (!src_url_equal(source.src, source_src_value = "resources/habilidades/q/WQTQTQT.mp4")) attr_dev(source, "src", source_src_value);
    			add_location(source, file, 158, 18, 5844);
    			video.autoplay = true;
    			video.loop = true;
    			video.muted = true;
    			attr_dev(video, "class", "svelte-p1ercs");
    			add_location(video, file, 157, 16, 5798);
    			attr_dev(span, "slot", "tooltip");
    			add_location(span, file, 156, 14, 5760);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, video);
    			append_dev(video, source);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_tooltip_slot_3.name,
    		type: "slot",
    		source: "(157:14) ",
    		ctx
    	});

    	return block;
    }

    // (167:14) 
    function create_hoverable_slot_2(ctx) {
    	let span;

    	const block = {
    		c: function create() {
    			span = element("span");
    			span.textContent = "Nenhuma das ativações atravessa unidades inimigas, isso é,\n                jogadores, animais, Wickeline, etc;";
    			attr_dev(span, "slot", "hoverable");
    			add_location(span, file, 166, 14, 6051);
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
    		id: create_hoverable_slot_2.name,
    		type: "slot",
    		source: "(167:14) ",
    		ctx
    	});

    	return block;
    }

    // (171:14) 
    function create_tooltip_slot_2(ctx) {
    	let span;
    	let video;
    	let source;
    	let source_src_value;

    	const block = {
    		c: function create() {
    			span = element("span");
    			video = element("video");
    			source = element("source");
    			if (!src_url_equal(source.src, source_src_value = "resources/habilidades/q/QQQ.mp4")) attr_dev(source, "src", source_src_value);
    			add_location(source, file, 172, 18, 6322);
    			video.autoplay = true;
    			video.loop = true;
    			video.muted = true;
    			attr_dev(video, "class", "svelte-p1ercs");
    			add_location(video, file, 171, 16, 6276);
    			attr_dev(span, "slot", "tooltip");
    			add_location(span, file, 170, 14, 6238);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, video);
    			append_dev(video, source);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_tooltip_slot_2.name,
    		type: "slot",
    		source: "(171:14) ",
    		ctx
    	});

    	return block;
    }

    // (181:14) 
    function create_hoverable_slot_1(ctx) {
    	let span;

    	const block = {
    		c: function create() {
    			span = element("span");
    			span.textContent = "Qualquer atordoamento, empurrão ou enraizamento cancela o dash;";
    			attr_dev(span, "slot", "hoverable");
    			add_location(span, file, 180, 14, 6525);
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
    		id: create_hoverable_slot_1.name,
    		type: "slot",
    		source: "(181:14) ",
    		ctx
    	});

    	return block;
    }

    // (184:14) 
    function create_tooltip_slot_1(ctx) {
    	let span;
    	let video;
    	let source;
    	let source_src_value;

    	const block = {
    		c: function create() {
    			span = element("span");
    			video = element("video");
    			source = element("source");
    			if (!src_url_equal(source.src, source_src_value = "resources/habilidades/q/QJavas.mp4")) attr_dev(source, "src", source_src_value);
    			add_location(source, file, 185, 18, 6749);
    			video.autoplay = true;
    			video.loop = true;
    			video.muted = true;
    			attr_dev(video, "class", "svelte-p1ercs");
    			add_location(video, file, 184, 16, 6703);
    			attr_dev(span, "slot", "tooltip");
    			add_location(span, file, 183, 14, 6665);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, video);
    			append_dev(video, source);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_tooltip_slot_1.name,
    		type: "slot",
    		source: "(184:14) ",
    		ctx
    	});

    	return block;
    }

    // (227:12) 
    function create_hoverable_slot(ctx) {
    	let span;

    	const block = {
    		c: function create() {
    			span = element("span");
    			span.textContent = "40";
    			attr_dev(span, "slot", "hoverable");
    			add_location(span, file, 226, 12, 8203);
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
    		source: "(227:12) ",
    		ctx
    	});

    	return block;
    }

    // (228:12) 
    function create_tooltip_slot(ctx) {
    	let span;
    	let img;
    	let img_src_value;
    	let t;

    	const block = {
    		c: function create() {
    			span = element("span");
    			img = element("img");
    			t = space();
    			if (!src_url_equal(img.src, img_src_value = "resources/habilidades/passiva/barra.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "class", "svelte-p1ercs");
    			add_location(img, file, 229, 14, 8344);
    			attr_dev(span, "slot", "tooltip");
    			add_location(span, file, 227, 12, 8248);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, img);
    			append_dev(span, t);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_tooltip_slot.name,
    		type: "slot",
    		source: "(228:12) ",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let div;
    	let header;
    	let h10;
    	let t1;
    	let img0;
    	let img0_src_value;
    	let t2;
    	let main;
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
    	let q0;
    	let t16;
    	let q1;
    	let t18;
    	let p4;
    	let t20;
    	let section2;
    	let h13;
    	let t22;
    	let p5;
    	let t24;
    	let q2;
    	let t26;
    	let small0;
    	let t28;
    	let iframe;
    	let iframe_src_value;
    	let t29;
    	let p6;
    	let t31;
    	let section6;
    	let h14;
    	let t33;
    	let section3;
    	let skill0;
    	let t34;
    	let p7;
    	let t36;
    	let p8;
    	let t37;
    	let tooltip0;
    	let t38;
    	let t39;
    	let ol0;
    	let li0;
    	let t41;
    	let li1;
    	let t43;
    	let li2;
    	let t45;
    	let p9;
    	let t47;
    	let p10;
    	let t49;
    	let p11;
    	let tooltip1;
    	let t50;
    	let aside0;
    	let video0;
    	let source0;
    	let source0_src_value;
    	let t51;
    	let small1;
    	let ol1;
    	let li3;
    	let t53;
    	let li4;
    	let t55;
    	let li5;
    	let t57;
    	let li6;
    	let t59;
    	let video1;
    	let source1;
    	let source1_src_value;
    	let t60;
    	let p12;
    	let small2;
    	let t62;
    	let section4;
    	let skill1;
    	let t63;
    	let p13;
    	let t65;
    	let p14;
    	let t67;
    	let ol2;
    	let li7;
    	let tooltip2;
    	let t68;
    	let br0;
    	let t69;
    	let li8;
    	let tooltip3;
    	let t70;
    	let br1;
    	let t71;
    	let li9;
    	let tooltip4;
    	let t72;
    	let aside1;
    	let video2;
    	let source2;
    	let source2_src_value;
    	let t73;
    	let p15;
    	let small3;
    	let t75;
    	let video3;
    	let source3;
    	let source3_src_value;
    	let t76;
    	let p16;
    	let small4;
    	let t78;
    	let section5;
    	let skill2;
    	let t79;
    	let p17;
    	let t81;
    	let q3;
    	let t83;
    	let small5;
    	let t84;
    	let img1;
    	let img1_src_value;
    	let t85;
    	let p18;
    	let t87;
    	let p19;
    	let t88;
    	let hoverableskill0;
    	let t89;
    	let tooltip5;
    	let t90;
    	let t91;
    	let p20;
    	let t92;
    	let hoverableskill1;
    	let t93;
    	let hoverableskill2;
    	let t94;
    	let t95;
    	let skill3;
    	let t96;
    	let skill4;
    	let t97;
    	let skill5;
    	let t98;
    	let skill6;
    	let t99;
    	let p21;
    	let hoverableskill3;
    	let t100;
    	let hoverableskill4;
    	let t101;
    	let hoverableskill5;
    	let t102;
    	let hoverableskill6;
    	let t103;
    	let hoverableskill7;
    	let t104;
    	let hoverableskill8;
    	let t105;
    	let hoverableskill9;
    	let current;

    	copiabletext = new CopiableText({
    			props: { text: "uema#2118" },
    			$$inline: true
    		});

    	skill0 = new Skill({ props: { key: "T" }, $$inline: true });

    	tooltip0 = new Tooltip({
    			props: {
    				$$slots: {
    					tooltip: [create_tooltip_slot_5],
    					hoverable: [create_hoverable_slot_5]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	tooltip1 = new Tooltip({
    			props: {
    				$$slots: {
    					tooltip: [create_tooltip_slot_4],
    					hoverable: [create_hoverable_slot_4]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	skill1 = new Skill({ props: { key: "Q" }, $$inline: true });

    	tooltip2 = new Tooltip({
    			props: {
    				$$slots: {
    					tooltip: [create_tooltip_slot_3],
    					hoverable: [create_hoverable_slot_3]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	tooltip3 = new Tooltip({
    			props: {
    				$$slots: {
    					tooltip: [create_tooltip_slot_2],
    					hoverable: [create_hoverable_slot_2]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	tooltip4 = new Tooltip({
    			props: {
    				$$slots: {
    					tooltip: [create_tooltip_slot_1],
    					hoverable: [create_hoverable_slot_1]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	skill2 = new Skill({ props: { key: "W" }, $$inline: true });
    	hoverableskill0 = new HoverableSkill({ props: { key: "W" }, $$inline: true });

    	tooltip5 = new Tooltip({
    			props: {
    				$$slots: {
    					tooltip: [create_tooltip_slot],
    					hoverable: [create_hoverable_slot]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	hoverableskill1 = new HoverableSkill({ props: { key: "W" }, $$inline: true });
    	hoverableskill2 = new HoverableSkill({ props: { key: "T" }, $$inline: true });
    	skill3 = new Skill({ props: { key: "E" }, $$inline: true });
    	skill4 = new Skill({ props: { key: "R" }, $$inline: true });
    	skill5 = new Skill({ props: { key: "DG" }, $$inline: true });
    	skill6 = new Skill({ props: { key: "DN" }, $$inline: true });

    	hoverableskill3 = new HoverableSkill({
    			props: { size: 72, key: "T" },
    			$$inline: true
    		});

    	hoverableskill4 = new HoverableSkill({
    			props: { size: 72, key: "Q" },
    			$$inline: true
    		});

    	hoverableskill5 = new HoverableSkill({
    			props: { size: 72, key: "W" },
    			$$inline: true
    		});

    	hoverableskill6 = new HoverableSkill({
    			props: { size: 72, key: "E" },
    			$$inline: true
    		});

    	hoverableskill7 = new HoverableSkill({
    			props: { size: 72, key: "R" },
    			$$inline: true
    		});

    	hoverableskill8 = new HoverableSkill({
    			props: { size: 72, key: "DG" },
    			$$inline: true
    		});

    	hoverableskill9 = new HoverableSkill({
    			props: { size: 72, key: "DN" },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			header = element("header");
    			h10 = element("h1");
    			h10.textContent = "\"....Do I really have to do this?\"";
    			t1 = space();
    			img0 = element("img");
    			t2 = space();
    			main = element("main");
    			section0 = element("section");
    			h11 = element("h1");
    			h11.textContent = "Disclaimer";
    			t4 = space();
    			p0 = element("p");
    			p0.textContent = "Pra quem não me conhece, meu nick é uema, e sou mono Li Dailin desde\n        novembro de 2020, não posso afirmar que sou a melhor Li Dailin do\n        servidor, mas provavelmente a com mais experiência no jogo.";
    			t6 = space();
    			p1 = element("p");
    			p1.textContent = "Esse guia está longe de completo, e será atualizado sempre que eu tiver\n        tempo.";
    			t8 = space();
    			p2 = element("p");
    			t9 = text("Se encontrar algum erro, tiver algum feedback, dúvida ou sugestão, pode\n        falar comigo no Discord: ");
    			create_component(copiabletext.$$.fragment);
    			t10 = space();
    			section1 = element("section");
    			h12 = element("h1");
    			h12.textContent = "Objetivo";
    			t12 = space();
    			p3 = element("p");
    			p3.textContent = "O intuito desse guia, é passar um conhecimento geral sobre a personagem,\n        fugindo um pouco de coisas que variam com atualizações, como rotas e\n        builds.";
    			t14 = space();
    			q0 = element("q");
    			q0.textContent = "Então esse guia vai ensinar só o básico?";
    			t16 = space();
    			q1 = element("q");
    			q1.textContent = "Não se engane, apesar de não abordar rotas, vou me aprofundar bastante.";
    			t18 = space();
    			p4 = element("p");
    			p4.textContent = "A ideia é passar conhecimento teórico o suficiente pra que você entenda\n        o personagem, e seja capaz de construir e avaliar jogadas e rotas por\n        conta própria, independente do patch.";
    			t20 = space();
    			section2 = element("section");
    			h13 = element("h1");
    			h13.textContent = "Introdução";
    			t22 = space();
    			p5 = element("p");
    			p5.textContent = "Li Dailin é uma personagem conhecida pela sua mobilidade e por causar\n        bastante dano em pouco tempo.";
    			t24 = space();
    			q2 = element("q");
    			q2.textContent = "Ok, mas por que minha Li Dailin não dá dano?!";
    			t26 = space();
    			small0 = element("small");
    			small0.textContent = "DE DAILIN, Novato.";
    			t28 = space();
    			iframe = element("iframe");
    			t29 = space();
    			p6 = element("p");
    			p6.textContent = "Pra causar dano com ela, é necessário entender e utilizar muito bem suas\n        skills, que apesar de simples têm diversas nuâncias e pequenos detalhes\n        que podem alterar e muito o seu potencial de dano.";
    			t31 = space();
    			section6 = element("section");
    			h14 = element("h1");
    			h14.textContent = "Habilidades";
    			t33 = space();
    			section3 = element("section");
    			create_component(skill0.$$.fragment);
    			t34 = space();
    			p7 = element("p");
    			p7.textContent = "Essa é a principal habilidade da Li Dailin. É o bom aproveitamento\n          dela que vai definir quanto de dano você pode causar.";
    			t36 = space();
    			p8 = element("p");
    			t37 = text("Se você tiver\n          ");
    			create_component(tooltip0.$$.fragment);
    			t38 = text(" ao usar uma habilidade:");
    			t39 = space();
    			ol0 = element("ol");
    			li0 = element("li");
    			li0.textContent = "Você consumirá 40 de CAS (exceto W);";
    			t41 = space();
    			li1 = element("li");
    			li1.textContent = "A habilidade vai ganhar um efeito adicional e";
    			t43 = space();
    			li2 = element("li");
    			li2.textContent = "Seu próximo ataque normal sairá duas vezes.";
    			t45 = space();
    			p9 = element("p");
    			p9.textContent = "Obs: o segundo ataque tem dano reduzido, mas aumenta conforme o nível\n          da passiva.";
    			t47 = space();
    			p10 = element("p");
    			p10.textContent = "Se você atingir 100 de CAS, ficará silenciado por 5s e todos os\n          ataques normais sairão duas vezes, são raros os momentos em que isso é\n          útil. Um exemplo é durante a Wickeline.";
    			t49 = space();
    			p11 = element("p");
    			create_component(tooltip1.$$.fragment);
    			t50 = space();
    			aside0 = element("aside");
    			video0 = element("video");
    			source0 = element("source");
    			t51 = space();
    			small1 = element("small");
    			ol1 = element("ol");
    			li3 = element("li");
    			li3.textContent = "Ataque normal";
    			t53 = space();
    			li4 = element("li");
    			li4.textContent = "Ataque bêbada";
    			t55 = space();
    			li5 = element("li");
    			li5.textContent = "Ataque alcoolizada";
    			t57 = space();
    			li6 = element("li");
    			li6.textContent = "Ataque embriagada";
    			t59 = space();
    			video1 = element("video");
    			source1 = element("source");
    			t60 = space();
    			p12 = element("p");
    			small2 = element("small");
    			small2.textContent = "Embriagada durante Wickeline";
    			t62 = space();
    			section4 = element("section");
    			create_component(skill1.$$.fragment);
    			t63 = space();
    			p13 = element("p");
    			p13.textContent = "Essa habilidade é a principal mobilidade da Li Dailin, cada uso dá um\n          dash, e o terceiro dash pode atravessar paredes.";
    			t65 = space();
    			p14 = element("p");
    			p14.textContent = "Existem alguns detalhes importantes sobre essa habilidade:";
    			t67 = space();
    			ol2 = element("ol");
    			li7 = element("li");
    			create_component(tooltip2.$$.fragment);
    			t68 = space();
    			br0 = element("br");
    			t69 = space();
    			li8 = element("li");
    			create_component(tooltip3.$$.fragment);
    			t70 = space();
    			br1 = element("br");
    			t71 = space();
    			li9 = element("li");
    			create_component(tooltip4.$$.fragment);
    			t72 = space();
    			aside1 = element("aside");
    			video2 = element("video");
    			source2 = element("source");
    			t73 = space();
    			p15 = element("p");
    			small3 = element("small");
    			small3.textContent = "Q normal";
    			t75 = space();
    			video3 = element("video");
    			source3 = element("source");
    			t76 = space();
    			p16 = element("p");
    			small4 = element("small");
    			small4.textContent = "Q com alcoolizada";
    			t78 = space();
    			section5 = element("section");
    			create_component(skill2.$$.fragment);
    			t79 = space();
    			p17 = element("p");
    			p17.textContent = "Cada uso dessa habilidade vai te dar 45 de CAS e te deixa imune a\n          ataques básicos durante a animação.";
    			t81 = space();
    			q3 = element("q");
    			q3.textContent = "Eu ganho mais mobilidade, mais dano e fico imune a ataque básico...\n          Vou spammar essa skill então!";
    			t83 = space();
    			small5 = element("small");
    			t84 = text("DE DAILIN, Novato.\n          \n          ");
    			img1 = element("img");
    			t85 = space();
    			p18 = element("p");
    			p18.textContent = "É interessante sempre manter a barra acima de 40 CAS, pra caso seja\n          necessário usar uma habilidade buffada imediatamente, mas é preciso\n          controlar o uso pra não se silenciar sem querer.";
    			t87 = space();
    			p19 = element("p");
    			t88 = text("No geral, use ");
    			create_component(hoverableskill0.$$.fragment);
    			t89 = text(" sempre que seu CAS chegar em ");
    			create_component(tooltip5.$$.fragment);
    			t90 = text(".");
    			t91 = space();
    			p20 = element("p");
    			t92 = text("Outro detalhe importante, é que cada ataque básico reduz o tempo de\n          recarga de ");
    			create_component(hoverableskill1.$$.fragment);
    			t93 = text(" em 1s, incluíndo o ataque duplo da\n          passiva ");
    			create_component(hoverableskill2.$$.fragment);
    			t94 = text(".");
    			t95 = space();
    			create_component(skill3.$$.fragment);
    			t96 = space();
    			create_component(skill4.$$.fragment);
    			t97 = space();
    			create_component(skill5.$$.fragment);
    			t98 = space();
    			create_component(skill6.$$.fragment);
    			t99 = space();
    			p21 = element("p");
    			create_component(hoverableskill3.$$.fragment);
    			t100 = space();
    			create_component(hoverableskill4.$$.fragment);
    			t101 = space();
    			create_component(hoverableskill5.$$.fragment);
    			t102 = space();
    			create_component(hoverableskill6.$$.fragment);
    			t103 = space();
    			create_component(hoverableskill7.$$.fragment);
    			t104 = space();
    			create_component(hoverableskill8.$$.fragment);
    			t105 = space();
    			create_component(hoverableskill9.$$.fragment);
    			attr_dev(h10, "class", "svelte-p1ercs");
    			add_location(h10, file, 9, 4, 261);
    			if (!src_url_equal(img0.src, img0_src_value = "resources/header/Tourist_Li_Dailin.png")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "class", "svelte-p1ercs");
    			add_location(img0, file, 11, 4, 359);
    			attr_dev(header, "class", "svelte-p1ercs");
    			add_location(header, file, 8, 2, 248);
    			attr_dev(h11, "class", "svelte-p1ercs");
    			add_location(h11, file, 15, 6, 453);
    			add_location(p0, file, 16, 6, 479);
    			add_location(p1, file, 21, 6, 719);
    			add_location(p2, file, 25, 6, 835);
    			attr_dev(section0, "class", "svelte-p1ercs");
    			add_location(section0, file, 14, 4, 437);
    			attr_dev(h12, "class", "svelte-p1ercs");
    			add_location(h12, file, 31, 6, 1032);
    			add_location(p3, file, 32, 6, 1056);
    			attr_dev(q0, "class", "question svelte-p1ercs");
    			add_location(q0, file, 37, 6, 1251);
    			attr_dev(q1, "class", "answer svelte-p1ercs");
    			add_location(q1, file, 38, 6, 1322);
    			add_location(p4, file, 41, 6, 1438);
    			attr_dev(section1, "class", "svelte-p1ercs");
    			add_location(section1, file, 30, 4, 1016);
    			attr_dev(h13, "class", "svelte-p1ercs");
    			add_location(h13, file, 48, 6, 1692);
    			add_location(p5, file, 49, 6, 1718);
    			attr_dev(q2, "class", "question svelte-p1ercs");
    			add_location(q2, file, 53, 6, 1855);
    			attr_dev(small0, "class", "author svelte-p1ercs");
    			add_location(small0, file, 54, 6, 1931);
    			attr_dev(iframe, "width", "560");
    			attr_dev(iframe, "height", "315");
    			if (!src_url_equal(iframe.src, iframe_src_value = "https://www.youtube-nocookie.com/embed/r1_iuvZxx4Y")) attr_dev(iframe, "src", iframe_src_value);
    			attr_dev(iframe, "title", "YouTube video player");
    			attr_dev(iframe, "frameborder", "0");
    			attr_dev(iframe, "allow", "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture");
    			iframe.allowFullscreen = true;
    			attr_dev(iframe, "class", "svelte-p1ercs");
    			add_location(iframe, file, 55, 6, 1986);
    			add_location(p6, file, 64, 6, 2305);
    			attr_dev(section2, "class", "svelte-p1ercs");
    			add_location(section2, file, 47, 4, 1676);
    			attr_dev(h14, "class", "svelte-p1ercs");
    			add_location(h14, file, 71, 6, 2575);
    			add_location(p7, file, 74, 8, 2646);
    			add_location(p8, file, 78, 8, 2812);
    			add_location(li0, file, 92, 10, 3302);
    			add_location(li1, file, 93, 10, 3358);
    			add_location(li2, file, 94, 10, 3423);
    			add_location(ol0, file, 91, 8, 3287);
    			add_location(p9, file, 96, 8, 3498);
    			add_location(p10, file, 100, 8, 3625);
    			add_location(p11, file, 105, 8, 3855);
    			if (!src_url_equal(source0.src, source0_src_value = "resources/habilidades/passiva/ataques.mp4")) attr_dev(source0, "src", source0_src_value);
    			add_location(source0, file, 126, 12, 4686);
    			video0.autoplay = true;
    			video0.loop = true;
    			video0.muted = true;
    			attr_dev(video0, "class", "svelte-p1ercs");
    			add_location(video0, file, 125, 10, 4646);
    			add_location(li3, file, 130, 14, 4813);
    			add_location(li4, file, 131, 14, 4850);
    			add_location(li5, file, 132, 14, 4887);
    			add_location(li6, file, 133, 14, 4929);
    			add_location(ol1, file, 129, 12, 4794);
    			add_location(small1, file, 128, 10, 4774);
    			if (!src_url_equal(source1.src, source1_src_value = "resources/habilidades/passiva/silence.mp4")) attr_dev(source1, "src", source1_src_value);
    			add_location(source1, file, 137, 12, 5043);
    			video1.autoplay = true;
    			video1.loop = true;
    			video1.muted = true;
    			attr_dev(video1, "class", "svelte-p1ercs");
    			add_location(video1, file, 136, 10, 5003);
    			add_location(small2, file, 139, 13, 5134);
    			add_location(p12, file, 139, 10, 5131);
    			attr_dev(aside0, "class", "svelte-p1ercs");
    			add_location(aside0, file, 124, 8, 4628);
    			attr_dev(section3, "class", "svelte-p1ercs");
    			add_location(section3, file, 72, 6, 2602);
    			add_location(p13, file, 144, 8, 5266);
    			add_location(p14, file, 148, 8, 5430);
    			add_location(li7, file, 150, 10, 5519);
    			add_location(br0, file, 163, 10, 5993);
    			add_location(li8, file, 164, 10, 6010);
    			add_location(br1, file, 177, 10, 6467);
    			add_location(li9, file, 178, 10, 6484);
    			add_location(ol2, file, 149, 8, 5504);
    			if (!src_url_equal(source2.src, source2_src_value = "resources/habilidades/q/Q.mp4")) attr_dev(source2, "src", source2_src_value);
    			add_location(source2, file, 193, 12, 6967);
    			video2.autoplay = true;
    			video2.loop = true;
    			video2.muted = true;
    			attr_dev(video2, "class", "svelte-p1ercs");
    			add_location(video2, file, 192, 10, 6927);
    			add_location(small3, file, 195, 13, 7046);
    			add_location(p15, file, 195, 10, 7043);
    			if (!src_url_equal(source3.src, source3_src_value = "resources/habilidades/q/WQ.mp4")) attr_dev(source3, "src", source3_src_value);
    			add_location(source3, file, 197, 12, 7124);
    			video3.autoplay = true;
    			video3.loop = true;
    			video3.muted = true;
    			attr_dev(video3, "class", "svelte-p1ercs");
    			add_location(video3, file, 196, 10, 7084);
    			add_location(small4, file, 199, 13, 7204);
    			add_location(p16, file, 199, 10, 7201);
    			attr_dev(aside1, "class", "svelte-p1ercs");
    			add_location(aside1, file, 191, 8, 6909);
    			attr_dev(section4, "class", "svelte-p1ercs");
    			add_location(section4, file, 142, 6, 5222);
    			add_location(p17, file, 204, 8, 7325);
    			attr_dev(q3, "class", "question svelte-p1ercs");
    			add_location(q3, file, 208, 8, 7472);
    			attr_dev(img1, "class", "center svelte-p1ercs");
    			if (!src_url_equal(img1.src, img1_src_value = "resources/habilidades/w/WastedDailin.png")) attr_dev(img1, "src", img1_src_value);
    			add_location(img1, file, 215, 10, 7750);
    			attr_dev(small5, "class", "author svelte-p1ercs");
    			add_location(small5, file, 212, 8, 7632);
    			add_location(p18, file, 218, 8, 7846);
    			add_location(p19, file, 223, 8, 8086);
    			add_location(p20, file, 233, 8, 8461);
    			attr_dev(section5, "class", "svelte-p1ercs");
    			add_location(section5, file, 202, 6, 7281);
    			add_location(p21, file, 243, 6, 8806);
    			attr_dev(section6, "class", "svelte-p1ercs");
    			add_location(section6, file, 70, 4, 2559);
    			attr_dev(main, "class", "svelte-p1ercs");
    			add_location(main, file, 13, 2, 426);
    			attr_dev(div, "class", "container svelte-p1ercs");
    			add_location(div, file, 7, 0, 222);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, header);
    			append_dev(header, h10);
    			append_dev(header, t1);
    			append_dev(header, img0);
    			append_dev(div, t2);
    			append_dev(div, main);
    			append_dev(main, section0);
    			append_dev(section0, h11);
    			append_dev(section0, t4);
    			append_dev(section0, p0);
    			append_dev(section0, t6);
    			append_dev(section0, p1);
    			append_dev(section0, t8);
    			append_dev(section0, p2);
    			append_dev(p2, t9);
    			mount_component(copiabletext, p2, null);
    			append_dev(main, t10);
    			append_dev(main, section1);
    			append_dev(section1, h12);
    			append_dev(section1, t12);
    			append_dev(section1, p3);
    			append_dev(section1, t14);
    			append_dev(section1, q0);
    			append_dev(section1, t16);
    			append_dev(section1, q1);
    			append_dev(section1, t18);
    			append_dev(section1, p4);
    			append_dev(main, t20);
    			append_dev(main, section2);
    			append_dev(section2, h13);
    			append_dev(section2, t22);
    			append_dev(section2, p5);
    			append_dev(section2, t24);
    			append_dev(section2, q2);
    			append_dev(section2, t26);
    			append_dev(section2, small0);
    			append_dev(section2, t28);
    			append_dev(section2, iframe);
    			append_dev(section2, t29);
    			append_dev(section2, p6);
    			append_dev(main, t31);
    			append_dev(main, section6);
    			append_dev(section6, h14);
    			append_dev(section6, t33);
    			append_dev(section6, section3);
    			mount_component(skill0, section3, null);
    			append_dev(section3, t34);
    			append_dev(section3, p7);
    			append_dev(section3, t36);
    			append_dev(section3, p8);
    			append_dev(p8, t37);
    			mount_component(tooltip0, p8, null);
    			append_dev(p8, t38);
    			append_dev(section3, t39);
    			append_dev(section3, ol0);
    			append_dev(ol0, li0);
    			append_dev(ol0, t41);
    			append_dev(ol0, li1);
    			append_dev(ol0, t43);
    			append_dev(ol0, li2);
    			append_dev(section3, t45);
    			append_dev(section3, p9);
    			append_dev(section3, t47);
    			append_dev(section3, p10);
    			append_dev(section3, t49);
    			append_dev(section3, p11);
    			mount_component(tooltip1, p11, null);
    			append_dev(section3, t50);
    			append_dev(section3, aside0);
    			append_dev(aside0, video0);
    			append_dev(video0, source0);
    			append_dev(aside0, t51);
    			append_dev(aside0, small1);
    			append_dev(small1, ol1);
    			append_dev(ol1, li3);
    			append_dev(ol1, t53);
    			append_dev(ol1, li4);
    			append_dev(ol1, t55);
    			append_dev(ol1, li5);
    			append_dev(ol1, t57);
    			append_dev(ol1, li6);
    			append_dev(aside0, t59);
    			append_dev(aside0, video1);
    			append_dev(video1, source1);
    			append_dev(aside0, t60);
    			append_dev(aside0, p12);
    			append_dev(p12, small2);
    			append_dev(section6, t62);
    			append_dev(section6, section4);
    			mount_component(skill1, section4, null);
    			append_dev(section4, t63);
    			append_dev(section4, p13);
    			append_dev(section4, t65);
    			append_dev(section4, p14);
    			append_dev(section4, t67);
    			append_dev(section4, ol2);
    			append_dev(ol2, li7);
    			mount_component(tooltip2, li7, null);
    			append_dev(ol2, t68);
    			append_dev(ol2, br0);
    			append_dev(ol2, t69);
    			append_dev(ol2, li8);
    			mount_component(tooltip3, li8, null);
    			append_dev(ol2, t70);
    			append_dev(ol2, br1);
    			append_dev(ol2, t71);
    			append_dev(ol2, li9);
    			mount_component(tooltip4, li9, null);
    			append_dev(section4, t72);
    			append_dev(section4, aside1);
    			append_dev(aside1, video2);
    			append_dev(video2, source2);
    			append_dev(aside1, t73);
    			append_dev(aside1, p15);
    			append_dev(p15, small3);
    			append_dev(aside1, t75);
    			append_dev(aside1, video3);
    			append_dev(video3, source3);
    			append_dev(aside1, t76);
    			append_dev(aside1, p16);
    			append_dev(p16, small4);
    			append_dev(section6, t78);
    			append_dev(section6, section5);
    			mount_component(skill2, section5, null);
    			append_dev(section5, t79);
    			append_dev(section5, p17);
    			append_dev(section5, t81);
    			append_dev(section5, q3);
    			append_dev(section5, t83);
    			append_dev(section5, small5);
    			append_dev(small5, t84);
    			append_dev(small5, img1);
    			append_dev(section5, t85);
    			append_dev(section5, p18);
    			append_dev(section5, t87);
    			append_dev(section5, p19);
    			append_dev(p19, t88);
    			mount_component(hoverableskill0, p19, null);
    			append_dev(p19, t89);
    			mount_component(tooltip5, p19, null);
    			append_dev(p19, t90);
    			append_dev(section5, t91);
    			append_dev(section5, p20);
    			append_dev(p20, t92);
    			mount_component(hoverableskill1, p20, null);
    			append_dev(p20, t93);
    			mount_component(hoverableskill2, p20, null);
    			append_dev(p20, t94);
    			append_dev(section6, t95);
    			mount_component(skill3, section6, null);
    			append_dev(section6, t96);
    			mount_component(skill4, section6, null);
    			append_dev(section6, t97);
    			mount_component(skill5, section6, null);
    			append_dev(section6, t98);
    			mount_component(skill6, section6, null);
    			append_dev(section6, t99);
    			append_dev(section6, p21);
    			mount_component(hoverableskill3, p21, null);
    			append_dev(p21, t100);
    			mount_component(hoverableskill4, p21, null);
    			append_dev(p21, t101);
    			mount_component(hoverableskill5, p21, null);
    			append_dev(p21, t102);
    			mount_component(hoverableskill6, p21, null);
    			append_dev(p21, t103);
    			mount_component(hoverableskill7, p21, null);
    			append_dev(p21, t104);
    			mount_component(hoverableskill8, p21, null);
    			append_dev(p21, t105);
    			mount_component(hoverableskill9, p21, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const tooltip0_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				tooltip0_changes.$$scope = { dirty, ctx };
    			}

    			tooltip0.$set(tooltip0_changes);
    			const tooltip1_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				tooltip1_changes.$$scope = { dirty, ctx };
    			}

    			tooltip1.$set(tooltip1_changes);
    			const tooltip2_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				tooltip2_changes.$$scope = { dirty, ctx };
    			}

    			tooltip2.$set(tooltip2_changes);
    			const tooltip3_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				tooltip3_changes.$$scope = { dirty, ctx };
    			}

    			tooltip3.$set(tooltip3_changes);
    			const tooltip4_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				tooltip4_changes.$$scope = { dirty, ctx };
    			}

    			tooltip4.$set(tooltip4_changes);
    			const tooltip5_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				tooltip5_changes.$$scope = { dirty, ctx };
    			}

    			tooltip5.$set(tooltip5_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(copiabletext.$$.fragment, local);
    			transition_in(skill0.$$.fragment, local);
    			transition_in(tooltip0.$$.fragment, local);
    			transition_in(tooltip1.$$.fragment, local);
    			transition_in(skill1.$$.fragment, local);
    			transition_in(tooltip2.$$.fragment, local);
    			transition_in(tooltip3.$$.fragment, local);
    			transition_in(tooltip4.$$.fragment, local);
    			transition_in(skill2.$$.fragment, local);
    			transition_in(hoverableskill0.$$.fragment, local);
    			transition_in(tooltip5.$$.fragment, local);
    			transition_in(hoverableskill1.$$.fragment, local);
    			transition_in(hoverableskill2.$$.fragment, local);
    			transition_in(skill3.$$.fragment, local);
    			transition_in(skill4.$$.fragment, local);
    			transition_in(skill5.$$.fragment, local);
    			transition_in(skill6.$$.fragment, local);
    			transition_in(hoverableskill3.$$.fragment, local);
    			transition_in(hoverableskill4.$$.fragment, local);
    			transition_in(hoverableskill5.$$.fragment, local);
    			transition_in(hoverableskill6.$$.fragment, local);
    			transition_in(hoverableskill7.$$.fragment, local);
    			transition_in(hoverableskill8.$$.fragment, local);
    			transition_in(hoverableskill9.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(copiabletext.$$.fragment, local);
    			transition_out(skill0.$$.fragment, local);
    			transition_out(tooltip0.$$.fragment, local);
    			transition_out(tooltip1.$$.fragment, local);
    			transition_out(skill1.$$.fragment, local);
    			transition_out(tooltip2.$$.fragment, local);
    			transition_out(tooltip3.$$.fragment, local);
    			transition_out(tooltip4.$$.fragment, local);
    			transition_out(skill2.$$.fragment, local);
    			transition_out(hoverableskill0.$$.fragment, local);
    			transition_out(tooltip5.$$.fragment, local);
    			transition_out(hoverableskill1.$$.fragment, local);
    			transition_out(hoverableskill2.$$.fragment, local);
    			transition_out(skill3.$$.fragment, local);
    			transition_out(skill4.$$.fragment, local);
    			transition_out(skill5.$$.fragment, local);
    			transition_out(skill6.$$.fragment, local);
    			transition_out(hoverableskill3.$$.fragment, local);
    			transition_out(hoverableskill4.$$.fragment, local);
    			transition_out(hoverableskill5.$$.fragment, local);
    			transition_out(hoverableskill6.$$.fragment, local);
    			transition_out(hoverableskill7.$$.fragment, local);
    			transition_out(hoverableskill8.$$.fragment, local);
    			transition_out(hoverableskill9.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(copiabletext);
    			destroy_component(skill0);
    			destroy_component(tooltip0);
    			destroy_component(tooltip1);
    			destroy_component(skill1);
    			destroy_component(tooltip2);
    			destroy_component(tooltip3);
    			destroy_component(tooltip4);
    			destroy_component(skill2);
    			destroy_component(hoverableskill0);
    			destroy_component(tooltip5);
    			destroy_component(hoverableskill1);
    			destroy_component(hoverableskill2);
    			destroy_component(skill3);
    			destroy_component(skill4);
    			destroy_component(skill5);
    			destroy_component(skill6);
    			destroy_component(hoverableskill3);
    			destroy_component(hoverableskill4);
    			destroy_component(hoverableskill5);
    			destroy_component(hoverableskill6);
    			destroy_component(hoverableskill7);
    			destroy_component(hoverableskill8);
    			destroy_component(hoverableskill9);
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
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		CopiableText,
    		HoverableSkill,
    		Skill,
    		Tooltip
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
