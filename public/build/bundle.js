
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

    /* src\skills\Icon.svelte generated by Svelte v3.42.1 */

    const file$7 = "src\\skills\\Icon.svelte";

    // (9:2) {#if key}
    function create_if_block$2(ctx) {
    	let span;
    	let t;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t = text(/*key*/ ctx[1]);
    			attr_dev(span, "class", "key svelte-j4pn79");
    			add_location(span, file$7, 9, 4, 186);
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
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(9:2) {#if key}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let span;
    	let img;
    	let img_src_value;
    	let t;
    	let if_block = /*key*/ ctx[1] && create_if_block$2(ctx);

    	const block = {
    		c: function create() {
    			span = element("span");
    			img = element("img");
    			t = space();
    			if (if_block) if_block.c();
    			if (!src_url_equal(img.src, img_src_value = /*src*/ ctx[0])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", /*key*/ ctx[1]);
    			attr_dev(img, "class", "svelte-j4pn79");
    			add_location(img, file$7, 7, 2, 144);
    			attr_dev(span, "class", "container svelte-j4pn79");
    			set_style(span, "--size", /*size*/ ctx[2] + "px");
    			add_location(span, file$7, 6, 0, 91);
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
    					if_block = create_if_block$2(ctx);
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
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, { src: 0, key: 1, size: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Icon",
    			options,
    			id: create_fragment$7.name
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

    const file$6 = "src\\Tooltip.svelte";
    const get_tooltip_slot_changes = dirty => ({});
    const get_tooltip_slot_context = ctx => ({});
    const get_hoverable_slot_changes = dirty => ({});
    const get_hoverable_slot_context = ctx => ({});

    // (16:2) {#if show}
    function create_if_block$1(ctx) {
    	let div;
    	let current;
    	const tooltip_slot_template = /*#slots*/ ctx[3].tooltip;
    	const tooltip_slot = create_slot(tooltip_slot_template, ctx, /*$$scope*/ ctx[2], get_tooltip_slot_context);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (tooltip_slot) tooltip_slot.c();
    			attr_dev(div, "class", "tooltip svelte-1r2yewj");
    			add_location(div, file$6, 16, 4, 350);
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
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(16:2) {#if show}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let span1;
    	let span0;
    	let t;
    	let current;
    	let mounted;
    	let dispose;
    	const hoverable_slot_template = /*#slots*/ ctx[3].hoverable;
    	const hoverable_slot = create_slot(hoverable_slot_template, ctx, /*$$scope*/ ctx[2], get_hoverable_slot_context);
    	let if_block = /*show*/ ctx[1] && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			span1 = element("span");
    			span0 = element("span");
    			if (hoverable_slot) hoverable_slot.c();
    			t = space();
    			if (if_block) if_block.c();
    			attr_dev(span0, "class", "hoverable svelte-1r2yewj");
    			add_location(span0, file$6, 12, 2, 264);
    			set_style(span1, "--width", /*width*/ ctx[0] + "px");
    			attr_dev(span1, "class", "container svelte-1r2yewj");
    			add_location(span1, file$6, 6, 0, 123);
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
    					if_block = create_if_block$1(ctx);
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
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, { width: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Tooltip",
    			options,
    			id: create_fragment$6.name
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

    /* src\skills\Skill.svelte generated by Svelte v3.42.1 */
    const file$5 = "src\\skills\\Skill.svelte";

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
    			add_location(p, file$5, 11, 4, 307);
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

    function create_fragment$5(ctx) {
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

    			attr_dev(span, "class", "name svelte-1tneao5");
    			add_location(span, file$5, 9, 2, 229);
    			attr_dev(div, "class", "skill svelte-1tneao5");
    			add_location(div, file$5, 7, 0, 151);
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
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, { key: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Skill",
    			options,
    			id: create_fragment$5.name
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
    const file$4 = "src\\skills\\HoverableSkill.svelte";

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

    function create_fragment$4(ctx) {
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
    			add_location(span, file$4, 12, 0, 258);
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
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, { key: 0, size: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "HoverableSkill",
    			options,
    			id: create_fragment$4.name
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

    /* src\Combo.svelte generated by Svelte v3.42.1 */
    const file$3 = "src\\Combo.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i];
    	return child_ctx;
    }

    // (9:2) {#each skills as skill}
    function create_each_block(ctx) {
    	let div;
    	let hoverableskill;
    	let t;
    	let current;

    	hoverableskill = new HoverableSkill({
    			props: {
    				size: /*size*/ ctx[1],
    				key: /*skill*/ ctx[2]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(hoverableskill.$$.fragment);
    			t = space();
    			attr_dev(div, "class", "skill svelte-7xnvrh");
    			add_location(div, file$3, 9, 4, 188);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(hoverableskill, div, null);
    			append_dev(div, t);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const hoverableskill_changes = {};
    			if (dirty & /*size*/ 2) hoverableskill_changes.size = /*size*/ ctx[1];
    			if (dirty & /*skills*/ 1) hoverableskill_changes.key = /*skill*/ ctx[2];
    			hoverableskill.$set(hoverableskill_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(hoverableskill.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(hoverableskill.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(hoverableskill);
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

    function create_fragment$3(ctx) {
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
    			add_location(div, file$3, 7, 0, 136);
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
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
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

    	$$self.$capture_state = () => ({ HoverableSkill, skills, size });

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
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { skills: 0, size: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Combo",
    			options,
    			id: create_fragment$3.name
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

    /* src\CopiableText.svelte generated by Svelte v3.42.1 */

    const file$2 = "src\\CopiableText.svelte";

    function create_fragment$2(ctx) {
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
    			add_location(i, file$2, 8, 2, 144);
    			attr_dev(span, "title", "Clique para copiar");
    			attr_dev(span, "class", "svelte-e703nl");
    			add_location(span, file$2, 4, 0, 43);
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
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { text: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CopiableText",
    			options,
    			id: create_fragment$2.name
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

    /* src\Video.svelte generated by Svelte v3.42.1 */

    const file$1 = "src\\Video.svelte";

    // (27:4) {#if paused}
    function create_if_block(ctx) {
    	let span;

    	const block = {
    		c: function create() {
    			span = element("span");
    			span.textContent = "▶";
    			attr_dev(span, "class", "text");
    			add_location(span, file$1, 27, 6, 632);
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
    		id: create_if_block.name,
    		type: "if",
    		source: "(27:4) {#if paused}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let div1;
    	let div0;
    	let t;
    	let video_1;
    	let video_1_src_value;
    	let mounted;
    	let dispose;
    	let if_block = /*paused*/ ctx[8] && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			if (if_block) if_block.c();
    			t = space();
    			video_1 = element("video");
    			attr_dev(div0, "class", "overlay svelte-17obxmk");
    			toggle_class(div0, "paused", /*paused*/ ctx[8]);
    			add_location(div0, file$1, 25, 2, 572);
    			if (!src_url_equal(video_1.src, video_1_src_value = /*src*/ ctx[0])) attr_dev(video_1, "src", video_1_src_value);
    			video_1.controls = /*controls*/ ctx[1];
    			video_1.autoplay = /*autoplay*/ ctx[2];
    			video_1.loop = /*loop*/ ctx[4];
    			video_1.muted = /*muted*/ ctx[3];
    			attr_dev(video_1, "width", /*width*/ ctx[5]);
    			attr_dev(video_1, "height", /*height*/ ctx[6]);
    			attr_dev(video_1, "class", "svelte-17obxmk");
    			add_location(video_1, file$1, 30, 2, 684);
    			attr_dev(div1, "class", "video svelte-17obxmk");
    			set_style(div1, "--width", /*width*/ ctx[5] + "px");
    			add_location(div1, file$1, 24, 0, 499);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			if (if_block) if_block.m(div0, null);
    			append_dev(div1, t);
    			append_dev(div1, video_1);
    			/*video_1_binding*/ ctx[10](video_1);

    			if (!mounted) {
    				dispose = listen_dev(div1, "click", /*toggleVideo*/ ctx[9], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*paused*/ ctx[8]) {
    				if (if_block) ; else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					if_block.m(div0, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty & /*paused*/ 256) {
    				toggle_class(div0, "paused", /*paused*/ ctx[8]);
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

    			if (dirty & /*width*/ 32) {
    				set_style(div1, "--width", /*width*/ ctx[5] + "px");
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (if_block) if_block.d();
    			/*video_1_binding*/ ctx[10](null);
    			mounted = false;
    			dispose();
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
    	let { width = 320 } = $$props;
    	let { height } = $$props;
    	let video;
    	let paused = !autoplay;

    	function toggleVideo() {
    		if (paused) {
    			video.play();
    		} else {
    			video.pause();
    		}

    		$$invalidate(8, paused = !paused);
    	}

    	const writable_props = ['src', 'controls', 'autoplay', 'muted', 'loop', 'width', 'height'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Video> was created with unknown prop '${key}'`);
    	});

    	function video_1_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			video = $$value;
    			$$invalidate(7, video);
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
    	};

    	$$self.$capture_state = () => ({
    		src,
    		controls,
    		autoplay,
    		muted,
    		loop,
    		width,
    		height,
    		video,
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
    		if ('video' in $$props) $$invalidate(7, video = $$props.video);
    		if ('paused' in $$props) $$invalidate(8, paused = $$props.paused);
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
    		video,
    		paused,
    		toggleVideo,
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
    			height: 6
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

    		if (/*height*/ ctx[6] === undefined && !('height' in props)) {
    			console.warn("<Video> was created without expected prop 'height'");
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
    }

    /* src\App.svelte generated by Svelte v3.42.1 */
    const file = "src\\App.svelte";

    // (84:12) 
    function create_hoverable_slot_8(ctx) {
    	let span;

    	const block = {
    		c: function create() {
    			span = element("span");
    			span.textContent = "40 CAS ou mais";
    			attr_dev(span, "slot", "hoverable");
    			add_location(span, file, 83, 12, 2960);
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
    		id: create_hoverable_slot_8.name,
    		type: "slot",
    		source: "(84:12) ",
    		ctx
    	});

    	return block;
    }

    // (85:12) 
    function create_tooltip_slot_8(ctx) {
    	let span1;
    	let span0;
    	let t1;
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			span1 = element("span");
    			span0 = element("span");
    			span0.textContent = "Use o traço branco em baixo da sua barra de mana como\n                referência.";
    			t1 = space();
    			img = element("img");
    			add_location(span0, file, 85, 14, 3053);
    			if (!src_url_equal(img.src, img_src_value = "resources/habilidades/passiva/barra.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "class", "svelte-1owiu6n");
    			add_location(img, file, 90, 14, 3254);
    			attr_dev(span1, "slot", "tooltip");
    			add_location(span1, file, 84, 12, 3017);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span1, anchor);
    			append_dev(span1, span0);
    			append_dev(span1, t1);
    			append_dev(span1, img);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_tooltip_slot_8.name,
    		type: "slot",
    		source: "(85:12) ",
    		ctx
    	});

    	return block;
    }

    // (111:12) 
    function create_hoverable_slot_7(ctx) {
    	let span;

    	const block = {
    		c: function create() {
    			span = element("span");
    			span.textContent = "Obs²: Consumir bebidas alcóolicas dá um bonus considerável de\n              velocidade de ataque e é muito importante em builds com pouca\n              velocidade de ataque ou durante Alpha/Omega/Wickeline.";
    			attr_dev(span, "slot", "hoverable");
    			add_location(span, file, 110, 12, 3994);
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
    		id: create_hoverable_slot_7.name,
    		type: "slot",
    		source: "(111:12) ",
    		ctx
    	});

    	return block;
    }

    // (116:12) 
    function create_tooltip_slot_7(ctx) {
    	let span;
    	let video0;
    	let t0;
    	let p0;
    	let small0;
    	let t2;
    	let video1;
    	let t3;
    	let p1;
    	let small1;
    	let current;

    	video0 = new Video({
    			props: {
    				src: "resources/habilidades/passiva/SadDailin.mp4",
    				autoplay: true
    			},
    			$$inline: true
    		});

    	video1 = new Video({
    			props: {
    				src: "resources/habilidades/passiva/HappyDailin.mp4",
    				autoplay: true
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			span = element("span");
    			create_component(video0.$$.fragment);
    			t0 = space();
    			p0 = element("p");
    			small0 = element("small");
    			small0.textContent = "Normal";
    			t2 = space();
    			create_component(video1.$$.fragment);
    			t3 = space();
    			p1 = element("p");
    			small1 = element("small");
    			small1.textContent = "Com bêbida";
    			add_location(small0, file, 120, 17, 4439);
    			add_location(p0, file, 120, 14, 4436);
    			add_location(small1, file, 125, 17, 4613);
    			add_location(p1, file, 125, 14, 4610);
    			attr_dev(span, "slot", "tooltip");
    			add_location(span, file, 115, 12, 4271);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			mount_component(video0, span, null);
    			append_dev(span, t0);
    			append_dev(span, p0);
    			append_dev(p0, small0);
    			append_dev(span, t2);
    			mount_component(video1, span, null);
    			append_dev(span, t3);
    			append_dev(span, p1);
    			append_dev(p1, small1);
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
    			if (detaching) detach_dev(span);
    			destroy_component(video0);
    			destroy_component(video1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_tooltip_slot_7.name,
    		type: "slot",
    		source: "(116:12) ",
    		ctx
    	});

    	return block;
    }

    // (154:14) 
    function create_hoverable_slot_6(ctx) {
    	let span;

    	const block = {
    		c: function create() {
    			span = element("span");
    			span.textContent = "Se a primeira ativação da habilidade foi buffada por\n                alcoolizada, as duas ativações seguintes também serão";
    			attr_dev(span, "slot", "hoverable");
    			add_location(span, file, 153, 14, 5517);
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
    		id: create_hoverable_slot_6.name,
    		type: "slot",
    		source: "(154:14) ",
    		ctx
    	});

    	return block;
    }

    // (158:14) 
    function create_tooltip_slot_6(ctx) {
    	let span;
    	let video;
    	let current;

    	video = new Video({
    			props: {
    				src: "resources/habilidades/q/WQTQTQT.mp4",
    				autoplay: true
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			span = element("span");
    			create_component(video.$$.fragment);
    			attr_dev(span, "slot", "tooltip");
    			add_location(span, file, 157, 14, 5716);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			mount_component(video, span, null);
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
    			if (detaching) detach_dev(span);
    			destroy_component(video);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_tooltip_slot_6.name,
    		type: "slot",
    		source: "(158:14) ",
    		ctx
    	});

    	return block;
    }

    // (165:14) 
    function create_hoverable_slot_5(ctx) {
    	let span;

    	const block = {
    		c: function create() {
    			span = element("span");
    			span.textContent = "Nenhuma das ativações atravessa unidades inimigas, isso é,\n                jogadores, animais, Wickeline, etc";
    			attr_dev(span, "slot", "hoverable");
    			add_location(span, file, 164, 14, 5927);
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
    		source: "(165:14) ",
    		ctx
    	});

    	return block;
    }

    // (169:14) 
    function create_tooltip_slot_5(ctx) {
    	let span;
    	let video;
    	let current;

    	video = new Video({
    			props: {
    				src: "resources/habilidades/q/QQQ.mp4",
    				autoplay: true
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			span = element("span");
    			create_component(video.$$.fragment);
    			attr_dev(span, "slot", "tooltip");
    			add_location(span, file, 168, 14, 6113);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			mount_component(video, span, null);
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
    			if (detaching) detach_dev(span);
    			destroy_component(video);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_tooltip_slot_5.name,
    		type: "slot",
    		source: "(169:14) ",
    		ctx
    	});

    	return block;
    }

    // (176:14) 
    function create_hoverable_slot_4(ctx) {
    	let span;

    	const block = {
    		c: function create() {
    			span = element("span");
    			span.textContent = "Qualquer atordoamento, empurrão ou enraizamento cancela o dash";
    			attr_dev(span, "slot", "hoverable");
    			add_location(span, file, 175, 14, 6320);
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
    		source: "(176:14) ",
    		ctx
    	});

    	return block;
    }

    // (179:14) 
    function create_tooltip_slot_4(ctx) {
    	let span;
    	let video;
    	let current;

    	video = new Video({
    			props: {
    				src: "resources/habilidades/q/QJavas.mp4",
    				autoplay: true
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			span = element("span");
    			create_component(video.$$.fragment);
    			attr_dev(span, "slot", "tooltip");
    			add_location(span, file, 178, 14, 6459);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			mount_component(video, span, null);
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
    			if (detaching) detach_dev(span);
    			destroy_component(video);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_tooltip_slot_4.name,
    		type: "slot",
    		source: "(179:14) ",
    		ctx
    	});

    	return block;
    }

    // (217:12) 
    function create_hoverable_slot_3(ctx) {
    	let span;

    	const block = {
    		c: function create() {
    			span = element("span");
    			span.textContent = "40";
    			attr_dev(span, "slot", "hoverable");
    			add_location(span, file, 216, 12, 7830);
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
    		source: "(217:12) ",
    		ctx
    	});

    	return block;
    }

    // (218:12) 
    function create_tooltip_slot_3(ctx) {
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
    			attr_dev(img, "class", "svelte-1owiu6n");
    			add_location(img, file, 219, 14, 7971);
    			attr_dev(span, "slot", "tooltip");
    			add_location(span, file, 217, 12, 7875);
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
    		id: create_tooltip_slot_3.name,
    		type: "slot",
    		source: "(218:12) ",
    		ctx
    	});

    	return block;
    }

    // (275:14) 
    function create_hoverable_slot_2(ctx) {
    	let span;

    	const block = {
    		c: function create() {
    			span = element("span");
    			span.textContent = "A Li Dailin fica imparável durante o dash";
    			attr_dev(span, "slot", "hoverable");
    			add_location(span, file, 274, 14, 9953);
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
    		source: "(275:14) ",
    		ctx
    	});

    	return block;
    }

    // (278:14) 
    function create_tooltip_slot_2(ctx) {
    	let span;
    	let video;
    	let current;

    	video = new Video({
    			props: {
    				src: "resources/habilidades/r/RAlpha2.mp4",
    				autoplay: true
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			span = element("span");
    			create_component(video.$$.fragment);
    			attr_dev(span, "slot", "tooltip");
    			add_location(span, file, 277, 14, 10071);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			mount_component(video, span, null);
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
    			if (detaching) detach_dev(span);
    			destroy_component(video);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_tooltip_slot_2.name,
    		type: "slot",
    		source: "(278:14) ",
    		ctx
    	});

    	return block;
    }

    // (285:14) 
    function create_hoverable_slot_1(ctx) {
    	let span;

    	const block = {
    		c: function create() {
    			span = element("span");
    			span.textContent = "A Li Dailin não fica imparável durante a supressão";
    			attr_dev(span, "slot", "hoverable");
    			add_location(span, file, 284, 14, 10282);
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
    		source: "(285:14) ",
    		ctx
    	});

    	return block;
    }

    // (288:14) 
    function create_tooltip_slot_1(ctx) {
    	let span;
    	let video;
    	let current;

    	video = new Video({
    			props: {
    				src: "resources/habilidades/r/RAlpha1.mp4",
    				autoplay: true
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			span = element("span");
    			create_component(video.$$.fragment);
    			attr_dev(span, "slot", "tooltip");
    			add_location(span, file, 287, 14, 10409);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			mount_component(video, span, null);
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
    			if (detaching) detach_dev(span);
    			destroy_component(video);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_tooltip_slot_1.name,
    		type: "slot",
    		source: "(288:14) ",
    		ctx
    	});

    	return block;
    }

    // (295:14) 
    function create_hoverable_slot(ctx) {
    	let span;

    	const block = {
    		c: function create() {
    			span = element("span");
    			span.textContent = "O hitbox é estranho";
    			attr_dev(span, "slot", "hoverable");
    			add_location(span, file, 294, 14, 10620);
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
    		source: "(295:14) ",
    		ctx
    	});

    	return block;
    }

    // (296:14) 
    function create_tooltip_slot(ctx) {
    	let span;
    	let video;
    	let current;

    	video = new Video({
    			props: {
    				src: "resources/habilidades/r/RAlpha3.mp4",
    				autoplay: true
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			span = element("span");
    			create_component(video.$$.fragment);
    			attr_dev(span, "slot", "tooltip");
    			add_location(span, file, 295, 14, 10685);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			mount_component(video, span, null);
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
    			if (detaching) detach_dev(span);
    			destroy_component(video);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_tooltip_slot.name,
    		type: "slot",
    		source: "(296:14) ",
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
    	let section10;
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
    	let li8;
    	let tooltip3;
    	let t69;
    	let li9;
    	let tooltip4;
    	let t70;
    	let aside1;
    	let video2;
    	let t71;
    	let p15;
    	let small3;
    	let t73;
    	let video3;
    	let t74;
    	let p16;
    	let small4;
    	let t76;
    	let section5;
    	let skill2;
    	let t77;
    	let p17;
    	let t79;
    	let q3;
    	let t81;
    	let small5;
    	let t82;
    	let img1;
    	let img1_src_value;
    	let t83;
    	let p18;
    	let t85;
    	let p19;
    	let t86;
    	let hoverableskill0;
    	let t87;
    	let tooltip5;
    	let t88;
    	let t89;
    	let p20;
    	let t90;
    	let hoverableskill1;
    	let t91;
    	let hoverableskill2;
    	let t92;
    	let t93;
    	let section6;
    	let skill3;
    	let t94;
    	let p21;
    	let t96;
    	let p22;
    	let t98;
    	let p23;
    	let t100;
    	let p24;
    	let t102;
    	let aside2;
    	let video4;
    	let t103;
    	let p25;
    	let small6;
    	let t105;
    	let video5;
    	let t106;
    	let p26;
    	let small7;
    	let t108;
    	let section7;
    	let skill4;
    	let t109;
    	let p27;
    	let t111;
    	let p28;
    	let t113;
    	let p29;
    	let t115;
    	let ol3;
    	let li10;
    	let t117;
    	let li11;
    	let t119;
    	let li12;
    	let tooltip6;
    	let t120;
    	let li13;
    	let tooltip7;
    	let t121;
    	let li14;
    	let tooltip8;
    	let t122;
    	let section8;
    	let skill5;
    	let t123;
    	let p30;
    	let t125;
    	let p31;
    	let t127;
    	let p32;
    	let t129;
    	let section9;
    	let skill6;
    	let t130;
    	let p33;
    	let t132;
    	let p34;
    	let t134;
    	let section11;
    	let h15;
    	let t136;
    	let q4;
    	let t138;
    	let img2;
    	let img2_src_value;
    	let t139;
    	let p35;
    	let t141;
    	let p36;
    	let t143;
    	let video6;
    	let t144;
    	let br;
    	let t145;
    	let combo;
    	let t146;
    	let section12;
    	let h16;
    	let t148;
    	let section13;
    	let h17;
    	let t150;
    	let section14;
    	let h18;
    	let t152;
    	let p37;
    	let t154;
    	let ul;
    	let li15;
    	let a0;
    	let t156;
    	let li16;
    	let a1;
    	let t158;
    	let li17;
    	let a2;
    	let t160;
    	let li18;
    	let a3;
    	let current;

    	copiabletext = new CopiableText({
    			props: { text: "uema#2118" },
    			$$inline: true
    		});

    	skill0 = new Skill({ props: { key: "T" }, $$inline: true });

    	tooltip0 = new Tooltip({
    			props: {
    				width: "320",
    				$$slots: {
    					tooltip: [create_tooltip_slot_8],
    					hoverable: [create_hoverable_slot_8]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	tooltip1 = new Tooltip({
    			props: {
    				$$slots: {
    					tooltip: [create_tooltip_slot_7],
    					hoverable: [create_hoverable_slot_7]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	video0 = new Video({
    			props: {
    				src: "resources/habilidades/passiva/ataques.mp4"
    			},
    			$$inline: true
    		});

    	video1 = new Video({
    			props: {
    				src: "resources/habilidades/passiva/silence.mp4"
    			},
    			$$inline: true
    		});

    	skill1 = new Skill({ props: { key: "Q" }, $$inline: true });

    	tooltip2 = new Tooltip({
    			props: {
    				$$slots: {
    					tooltip: [create_tooltip_slot_6],
    					hoverable: [create_hoverable_slot_6]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	tooltip3 = new Tooltip({
    			props: {
    				$$slots: {
    					tooltip: [create_tooltip_slot_5],
    					hoverable: [create_hoverable_slot_5]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	tooltip4 = new Tooltip({
    			props: {
    				$$slots: {
    					tooltip: [create_tooltip_slot_4],
    					hoverable: [create_hoverable_slot_4]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	video2 = new Video({
    			props: { src: "resources/habilidades/q/Q.mp4" },
    			$$inline: true
    		});

    	video3 = new Video({
    			props: { src: "resources/habilidades/q/WQ.mp4" },
    			$$inline: true
    		});

    	skill2 = new Skill({ props: { key: "W" }, $$inline: true });
    	hoverableskill0 = new HoverableSkill({ props: { key: "W" }, $$inline: true });

    	tooltip5 = new Tooltip({
    			props: {
    				width: "120",
    				$$slots: {
    					tooltip: [create_tooltip_slot_3],
    					hoverable: [create_hoverable_slot_3]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	hoverableskill1 = new HoverableSkill({ props: { key: "W" }, $$inline: true });
    	hoverableskill2 = new HoverableSkill({ props: { key: "T" }, $$inline: true });
    	skill3 = new Skill({ props: { key: "E" }, $$inline: true });

    	video4 = new Video({
    			props: {
    				src: "resources/habilidades/e/EJavas.mp4"
    			},
    			$$inline: true
    		});

    	video5 = new Video({
    			props: {
    				src: "resources/habilidades/e/EAlpha.mp4"
    			},
    			$$inline: true
    		});

    	skill4 = new Skill({ props: { key: "R" }, $$inline: true });

    	tooltip6 = new Tooltip({
    			props: {
    				$$slots: {
    					tooltip: [create_tooltip_slot_2],
    					hoverable: [create_hoverable_slot_2]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	tooltip7 = new Tooltip({
    			props: {
    				$$slots: {
    					tooltip: [create_tooltip_slot_1],
    					hoverable: [create_hoverable_slot_1]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	tooltip8 = new Tooltip({
    			props: {
    				$$slots: {
    					tooltip: [create_tooltip_slot],
    					hoverable: [create_hoverable_slot]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	skill5 = new Skill({ props: { key: "DG" }, $$inline: true });
    	skill6 = new Skill({ props: { key: "DN" }, $$inline: true });

    	video6 = new Video({
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
    			section10 = element("section");
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
    			li0.textContent = "Você consumirá 40 de CAS (exceto W)";
    			t41 = space();
    			li1 = element("li");
    			li1.textContent = "A habilidade vai ganhar um efeito adicional";
    			t43 = space();
    			li2 = element("li");
    			li2.textContent = "Seu próximo ataque normal sairá duas vezes";
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
    			create_component(video0.$$.fragment);
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
    			create_component(video1.$$.fragment);
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
    			li8 = element("li");
    			create_component(tooltip3.$$.fragment);
    			t69 = space();
    			li9 = element("li");
    			create_component(tooltip4.$$.fragment);
    			t70 = space();
    			aside1 = element("aside");
    			create_component(video2.$$.fragment);
    			t71 = space();
    			p15 = element("p");
    			small3 = element("small");
    			small3.textContent = "Q normal";
    			t73 = space();
    			create_component(video3.$$.fragment);
    			t74 = space();
    			p16 = element("p");
    			small4 = element("small");
    			small4.textContent = "Q buffado";
    			t76 = space();
    			section5 = element("section");
    			create_component(skill2.$$.fragment);
    			t77 = space();
    			p17 = element("p");
    			p17.textContent = "Cada uso dessa habilidade vai te dar 45 de CAS e te deixa imune a\n          ataques básicos durante a animação.";
    			t79 = space();
    			q3 = element("q");
    			q3.textContent = "Eu ganho mais mobilidade, mais dano e fico imune a ataque básico...\n          Vou spammar essa skill então!";
    			t81 = space();
    			small5 = element("small");
    			t82 = text("DE DAILIN, Novato.\n          \n          ");
    			img1 = element("img");
    			t83 = space();
    			p18 = element("p");
    			p18.textContent = "É interessante sempre manter a barra acima de 40 CAS, pra caso seja\n          necessário usar uma habilidade buffada imediatamente, mas é preciso\n          controlar o uso pra não se silenciar sem querer.";
    			t85 = space();
    			p19 = element("p");
    			t86 = text("No geral, use ");
    			create_component(hoverableskill0.$$.fragment);
    			t87 = text(" sempre que seu CAS chegar em ");
    			create_component(tooltip5.$$.fragment);
    			t88 = text(".");
    			t89 = space();
    			p20 = element("p");
    			t90 = text("Outro detalhe importante, é que cada ataque básico reduz o tempo de\n          recarga de ");
    			create_component(hoverableskill1.$$.fragment);
    			t91 = text(" em 1s, incluíndo o ataque duplo da\n          passiva ");
    			create_component(hoverableskill2.$$.fragment);
    			t92 = text(".");
    			t93 = space();
    			section6 = element("section");
    			create_component(skill3.$$.fragment);
    			t94 = space();
    			p21 = element("p");
    			p21.textContent = "Esse é o famigerado silence da Li Dailin, a habilidade também dá\n          lentidão, mas na maioria das vezes é usada pelo silenciamento.";
    			t96 = space();
    			p22 = element("p");
    			p22.textContent = "Pra silenciar é necessário usar a skill buffada, e ela tem um tempo de\n          conjuração relativamente alto, então pense bem antes de usa-la pra\n          fugir ou perseguir alguém.";
    			t98 = space();
    			p23 = element("p");
    			p23.textContent = "O momento ideal pra usar o silenciamento varia muito do momento e da\n          match up, e será abordado mais pra frente no guia.";
    			t100 = space();
    			p24 = element("p");
    			p24.textContent = "Obs: Nem todo tipo de conjuração é cancelado pelo silence, varia\n          habilidade por habilidade.";
    			t102 = space();
    			aside2 = element("aside");
    			create_component(video4.$$.fragment);
    			t103 = space();
    			p25 = element("p");
    			small6 = element("small");
    			small6.textContent = "Silence no dash do Javali";
    			t105 = space();
    			create_component(video5.$$.fragment);
    			t106 = space();
    			p26 = element("p");
    			small7 = element("small");
    			small7.textContent = "Silence no knockback do Alpha";
    			t108 = space();
    			section7 = element("section");
    			create_component(skill4.$$.fragment);
    			t109 = space();
    			p27 = element("p");
    			p27.textContent = "A ultimate da Li Dailin é um dash que suprime o alvo por 0.7s (1.2s se\n          alcoolizada).";
    			t111 = space();
    			p28 = element("p");
    			p28.textContent = "O dano da habilidade aumenta conforme a vida perdida, mas não é\n          baseado na vida máxima do alvo.";
    			t113 = space();
    			p29 = element("p");
    			p29.textContent = "Observações importantes:";
    			t115 = space();
    			ol3 = element("ol");
    			li10 = element("li");
    			li10.textContent = "O dash atravessa paredes";
    			t117 = space();
    			li11 = element("li");
    			li11.textContent = "O cooldown é bem alto (180/150/115s), mas é reduzido em 40% se\n            acertar um alvo";
    			t119 = space();
    			li12 = element("li");
    			create_component(tooltip6.$$.fragment);
    			t120 = space();
    			li13 = element("li");
    			create_component(tooltip7.$$.fragment);
    			t121 = space();
    			li14 = element("li");
    			create_component(tooltip8.$$.fragment);
    			t122 = space();
    			section8 = element("section");
    			create_component(skill5.$$.fragment);
    			t123 = space();
    			p30 = element("p");
    			p30.textContent = "É uma habilidade target, não interrompível, que funciona como um\n          ataque básico normal, mas com dano aumentado e causa dano verdadeiro\n          adicional.";
    			t125 = space();
    			p31 = element("p");
    			p31.textContent = "Não existe um momento certo pra usar ela, recomendo usar sempre que\n          sair do cooldown ou para garantir um last hit.";
    			t127 = space();
    			p32 = element("p");
    			p32.textContent = "Obs: o alcance dessa habilidade é maior que o alcance padrão de ataque\n          básico, então ela dá um pequeno dash.";
    			t129 = space();
    			section9 = element("section");
    			create_component(skill6.$$.fragment);
    			t130 = space();
    			p33 = element("p");
    			p33.textContent = "São bem raras as situações em que é possível carregar o stun e ainda\n          assim acertar o alvo, pois é possível ouvir o Nunchaku sendo carregado\n          de muito longe.";
    			t132 = space();
    			p34 = element("p");
    			p34.textContent = "Então, no geral é utilizado como um pequeno dano adicional no combo,\n          para finalizar kills à distância ou para farmar.";
    			t134 = space();
    			section11 = element("section");
    			h15 = element("h1");
    			h15.textContent = "Combos";
    			t136 = space();
    			q4 = element("q");
    			q4.textContent = "Tá, eu já entendi as habilidades, mas você pode me falar logo como eu\n        combo?";
    			t138 = space();
    			img2 = element("img");
    			t139 = space();
    			p35 = element("p");
    			p35.textContent = "Como eu falei antes, é o bom aproveitamento da passiva que define quanto\n        dano você pode causar, então não existe um combo certo ou errado, tudo é\n        situacional.";
    			t141 = space();
    			p36 = element("p");
    			p36.textContent = "Numa situacão perfeita, o combo com o maior dano é aquele que maximiza o\n        uso da passiva, por exemplo:";
    			t143 = space();
    			create_component(video6.$$.fragment);
    			t144 = space();
    			br = element("br");
    			t145 = space();
    			create_component(combo.$$.fragment);
    			t146 = space();
    			section12 = element("section");
    			h16 = element("h1");
    			h16.textContent = "Stats";
    			t148 = space();
    			section13 = element("section");
    			h17 = element("h1");
    			h17.textContent = "Match ups";
    			t150 = space();
    			section14 = element("section");
    			h18 = element("h1");
    			h18.textContent = "Streams";
    			t152 = space();
    			p37 = element("p");
    			p37.textContent = "O melhor jeito de aprender Eternal é assistindo, e com Li Dailin não é\n        diferente, segue a lista de streams que eu recomendo:";
    			t154 = space();
    			ul = element("ul");
    			li15 = element("li");
    			a0 = element("a");
    			a0.textContent = "트백";
    			t156 = space();
    			li16 = element("li");
    			a1 = element("a");
    			a1.textContent = "BigSean";
    			t158 = space();
    			li17 = element("li");
    			a2 = element("a");
    			a2.textContent = "lNeroTV";
    			t160 = space();
    			li18 = element("li");
    			a3 = element("a");
    			a3.textContent = "ShuviSenpai";
    			attr_dev(h10, "class", "svelte-1owiu6n");
    			add_location(h10, file, 11, 4, 337);
    			if (!src_url_equal(img0.src, img0_src_value = "resources/header/Tourist_Li_Dailin.png")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "class", "svelte-1owiu6n");
    			add_location(img0, file, 13, 4, 435);
    			attr_dev(header, "class", "svelte-1owiu6n");
    			add_location(header, file, 10, 2, 324);
    			attr_dev(h11, "class", "svelte-1owiu6n");
    			add_location(h11, file, 17, 6, 529);
    			add_location(p0, file, 18, 6, 555);
    			add_location(p1, file, 23, 6, 795);
    			add_location(p2, file, 27, 6, 911);
    			attr_dev(section0, "class", "svelte-1owiu6n");
    			add_location(section0, file, 16, 4, 513);
    			attr_dev(h12, "class", "svelte-1owiu6n");
    			add_location(h12, file, 33, 6, 1108);
    			add_location(p3, file, 34, 6, 1132);
    			attr_dev(q0, "class", "question svelte-1owiu6n");
    			add_location(q0, file, 39, 6, 1327);
    			attr_dev(q1, "class", "answer svelte-1owiu6n");
    			add_location(q1, file, 40, 6, 1398);
    			add_location(p4, file, 43, 6, 1514);
    			attr_dev(section1, "class", "svelte-1owiu6n");
    			add_location(section1, file, 32, 4, 1092);
    			attr_dev(h13, "class", "svelte-1owiu6n");
    			add_location(h13, file, 50, 6, 1768);
    			add_location(p5, file, 51, 6, 1794);
    			attr_dev(q2, "class", "question svelte-1owiu6n");
    			add_location(q2, file, 55, 6, 1931);
    			attr_dev(small0, "class", "author svelte-1owiu6n");
    			add_location(small0, file, 56, 6, 2007);
    			attr_dev(iframe, "width", "560");
    			attr_dev(iframe, "height", "315");
    			if (!src_url_equal(iframe.src, iframe_src_value = "https://www.youtube-nocookie.com/embed/r1_iuvZxx4Y")) attr_dev(iframe, "src", iframe_src_value);
    			attr_dev(iframe, "title", "YouTube video player");
    			attr_dev(iframe, "frameborder", "0");
    			attr_dev(iframe, "allow", "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture");
    			iframe.allowFullscreen = true;
    			attr_dev(iframe, "class", "svelte-1owiu6n");
    			add_location(iframe, file, 57, 6, 2062);
    			add_location(p6, file, 66, 6, 2381);
    			attr_dev(section2, "class", "svelte-1owiu6n");
    			add_location(section2, file, 49, 4, 1752);
    			attr_dev(h14, "class", "svelte-1owiu6n");
    			add_location(h14, file, 73, 6, 2651);
    			add_location(p7, file, 76, 8, 2722);
    			add_location(p8, file, 80, 8, 2888);
    			attr_dev(li0, "class", "svelte-1owiu6n");
    			add_location(li0, file, 95, 10, 3409);
    			attr_dev(li1, "class", "svelte-1owiu6n");
    			add_location(li1, file, 96, 10, 3464);
    			attr_dev(li2, "class", "svelte-1owiu6n");
    			add_location(li2, file, 97, 10, 3527);
    			add_location(ol0, file, 94, 8, 3394);
    			add_location(p9, file, 99, 8, 3601);
    			add_location(p10, file, 103, 8, 3728);
    			add_location(p11, file, 108, 8, 3958);
    			attr_dev(li3, "class", "svelte-1owiu6n");
    			add_location(li3, file, 133, 14, 4830);
    			attr_dev(li4, "class", "svelte-1owiu6n");
    			add_location(li4, file, 134, 14, 4867);
    			attr_dev(li5, "class", "svelte-1owiu6n");
    			add_location(li5, file, 135, 14, 4904);
    			attr_dev(li6, "class", "svelte-1owiu6n");
    			add_location(li6, file, 136, 14, 4946);
    			add_location(ol1, file, 132, 12, 4811);
    			add_location(small1, file, 131, 10, 4791);
    			add_location(small2, file, 140, 13, 5091);
    			add_location(p12, file, 140, 10, 5088);
    			attr_dev(aside0, "class", "svelte-1owiu6n");
    			add_location(aside0, file, 129, 8, 4705);
    			attr_dev(section3, "class", "svelte-1owiu6n");
    			add_location(section3, file, 74, 6, 2678);
    			add_location(p13, file, 145, 8, 5223);
    			add_location(p14, file, 149, 8, 5387);
    			attr_dev(li7, "class", "svelte-1owiu6n");
    			add_location(li7, file, 151, 10, 5476);
    			attr_dev(li8, "class", "svelte-1owiu6n");
    			add_location(li8, file, 162, 10, 5886);
    			attr_dev(li9, "class", "svelte-1owiu6n");
    			add_location(li9, file, 173, 10, 6279);
    			add_location(ol2, file, 150, 8, 5461);
    			add_location(small3, file, 186, 13, 6717);
    			add_location(p15, file, 186, 10, 6714);
    			add_location(small4, file, 188, 13, 6815);
    			add_location(p16, file, 188, 10, 6812);
    			attr_dev(aside1, "class", "svelte-1owiu6n");
    			add_location(aside1, file, 184, 8, 6640);
    			attr_dev(section4, "class", "svelte-1owiu6n");
    			add_location(section4, file, 143, 6, 5179);
    			add_location(p17, file, 193, 8, 6928);
    			attr_dev(q3, "class", "question svelte-1owiu6n");
    			add_location(q3, file, 197, 8, 7075);
    			attr_dev(img1, "class", "center svelte-1owiu6n");
    			if (!src_url_equal(img1.src, img1_src_value = "resources/habilidades/w/WastedDailin.png")) attr_dev(img1, "src", img1_src_value);
    			add_location(img1, file, 204, 10, 7353);
    			attr_dev(small5, "class", "author svelte-1owiu6n");
    			add_location(small5, file, 201, 8, 7235);
    			add_location(p18, file, 207, 8, 7449);
    			add_location(p19, file, 212, 8, 7689);
    			add_location(p20, file, 223, 8, 8088);
    			attr_dev(section5, "class", "svelte-1owiu6n");
    			add_location(section5, file, 191, 6, 6884);
    			add_location(p21, file, 231, 8, 8379);
    			add_location(p22, file, 235, 8, 8552);
    			add_location(p23, file, 240, 8, 8772);
    			add_location(p24, file, 244, 8, 8937);
    			add_location(small6, file, 250, 13, 9156);
    			add_location(p25, file, 250, 10, 9153);
    			add_location(small7, file, 252, 13, 9275);
    			add_location(p26, file, 252, 10, 9272);
    			attr_dev(aside2, "class", "svelte-1owiu6n");
    			add_location(aside2, file, 248, 8, 9074);
    			attr_dev(section6, "class", "svelte-1owiu6n");
    			add_location(section6, file, 229, 6, 8335);
    			add_location(p27, file, 257, 8, 9408);
    			add_location(p28, file, 261, 8, 9538);
    			add_location(p29, file, 265, 8, 9679);
    			attr_dev(li10, "class", "svelte-1owiu6n");
    			add_location(li10, file, 267, 10, 9734);
    			attr_dev(li11, "class", "svelte-1owiu6n");
    			add_location(li11, file, 268, 10, 9778);
    			attr_dev(li12, "class", "svelte-1owiu6n");
    			add_location(li12, file, 272, 10, 9912);
    			attr_dev(li13, "class", "svelte-1owiu6n");
    			add_location(li13, file, 282, 10, 10241);
    			attr_dev(li14, "class", "svelte-1owiu6n");
    			add_location(li14, file, 292, 10, 10579);
    			add_location(ol3, file, 266, 8, 9719);
    			attr_dev(section7, "class", "svelte-1owiu6n");
    			add_location(section7, file, 255, 6, 9364);
    			add_location(p30, file, 304, 8, 10927);
    			add_location(p31, file, 309, 8, 11127);
    			add_location(p32, file, 313, 8, 11287);
    			attr_dev(section8, "class", "svelte-1owiu6n");
    			add_location(section8, file, 302, 6, 10882);
    			add_location(p33, file, 320, 8, 11501);
    			add_location(p34, file, 325, 8, 11712);
    			attr_dev(section9, "class", "svelte-1owiu6n");
    			add_location(section9, file, 318, 6, 11456);
    			attr_dev(section10, "class", "svelte-1owiu6n");
    			add_location(section10, file, 72, 4, 2635);
    			attr_dev(h15, "class", "svelte-1owiu6n");
    			add_location(h15, file, 332, 6, 11919);
    			attr_dev(q4, "class", "question svelte-1owiu6n");
    			add_location(q4, file, 333, 6, 11941);
    			if (!src_url_equal(img2.src, img2_src_value = "resources/combos/Well.jpg")) attr_dev(img2, "src", img2_src_value);
    			attr_dev(img2, "class", "svelte-1owiu6n");
    			add_location(img2, file, 338, 6, 12124);
    			add_location(p35, file, 339, 6, 12170);
    			add_location(p36, file, 344, 6, 12374);
    			add_location(br, file, 349, 6, 12562);
    			attr_dev(section11, "class", "svelte-1owiu6n");
    			add_location(section11, file, 331, 4, 11903);
    			attr_dev(h16, "class", "svelte-1owiu6n");
    			add_location(h16, file, 374, 6, 12930);
    			attr_dev(section12, "class", "svelte-1owiu6n");
    			add_location(section12, file, 373, 4, 12914);
    			attr_dev(h17, "class", "svelte-1owiu6n");
    			add_location(h17, file, 377, 6, 12980);
    			attr_dev(section13, "class", "svelte-1owiu6n");
    			add_location(section13, file, 376, 4, 12964);
    			attr_dev(h18, "class", "svelte-1owiu6n");
    			add_location(h18, file, 380, 6, 13034);
    			add_location(p37, file, 381, 6, 13057);
    			attr_dev(a0, "href", "https://www.twitch.tv/qhrudwkd777");
    			attr_dev(a0, "class", "svelte-1owiu6n");
    			add_location(a0, file, 386, 12, 13236);
    			attr_dev(li15, "class", "svelte-1owiu6n");
    			add_location(li15, file, 386, 8, 13232);
    			attr_dev(a1, "href", "https://www.twitch.tv/bi9sean55");
    			attr_dev(a1, "class", "svelte-1owiu6n");
    			add_location(a1, file, 387, 12, 13304);
    			attr_dev(li16, "class", "svelte-1owiu6n");
    			add_location(li16, file, 387, 8, 13300);
    			attr_dev(a2, "href", "https://www.twitch.tv/lnerotv");
    			attr_dev(a2, "class", "svelte-1owiu6n");
    			add_location(a2, file, 388, 12, 13375);
    			attr_dev(li17, "class", "svelte-1owiu6n");
    			add_location(li17, file, 388, 8, 13371);
    			attr_dev(a3, "href", "https://www.twitch.tv/shuvisenpai");
    			attr_dev(a3, "class", "svelte-1owiu6n");
    			add_location(a3, file, 389, 12, 13444);
    			attr_dev(li18, "class", "svelte-1owiu6n");
    			add_location(li18, file, 389, 8, 13440);
    			add_location(ul, file, 385, 6, 13219);
    			attr_dev(section14, "class", "svelte-1owiu6n");
    			add_location(section14, file, 379, 4, 13018);
    			attr_dev(main, "class", "svelte-1owiu6n");
    			add_location(main, file, 15, 2, 502);
    			attr_dev(div, "class", "container svelte-1owiu6n");
    			add_location(div, file, 9, 0, 298);
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
    			append_dev(main, section10);
    			append_dev(section10, h14);
    			append_dev(section10, t33);
    			append_dev(section10, section3);
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
    			mount_component(video0, aside0, null);
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
    			mount_component(video1, aside0, null);
    			append_dev(aside0, t60);
    			append_dev(aside0, p12);
    			append_dev(p12, small2);
    			append_dev(section10, t62);
    			append_dev(section10, section4);
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
    			append_dev(ol2, li8);
    			mount_component(tooltip3, li8, null);
    			append_dev(ol2, t69);
    			append_dev(ol2, li9);
    			mount_component(tooltip4, li9, null);
    			append_dev(section4, t70);
    			append_dev(section4, aside1);
    			mount_component(video2, aside1, null);
    			append_dev(aside1, t71);
    			append_dev(aside1, p15);
    			append_dev(p15, small3);
    			append_dev(aside1, t73);
    			mount_component(video3, aside1, null);
    			append_dev(aside1, t74);
    			append_dev(aside1, p16);
    			append_dev(p16, small4);
    			append_dev(section10, t76);
    			append_dev(section10, section5);
    			mount_component(skill2, section5, null);
    			append_dev(section5, t77);
    			append_dev(section5, p17);
    			append_dev(section5, t79);
    			append_dev(section5, q3);
    			append_dev(section5, t81);
    			append_dev(section5, small5);
    			append_dev(small5, t82);
    			append_dev(small5, img1);
    			append_dev(section5, t83);
    			append_dev(section5, p18);
    			append_dev(section5, t85);
    			append_dev(section5, p19);
    			append_dev(p19, t86);
    			mount_component(hoverableskill0, p19, null);
    			append_dev(p19, t87);
    			mount_component(tooltip5, p19, null);
    			append_dev(p19, t88);
    			append_dev(section5, t89);
    			append_dev(section5, p20);
    			append_dev(p20, t90);
    			mount_component(hoverableskill1, p20, null);
    			append_dev(p20, t91);
    			mount_component(hoverableskill2, p20, null);
    			append_dev(p20, t92);
    			append_dev(section10, t93);
    			append_dev(section10, section6);
    			mount_component(skill3, section6, null);
    			append_dev(section6, t94);
    			append_dev(section6, p21);
    			append_dev(section6, t96);
    			append_dev(section6, p22);
    			append_dev(section6, t98);
    			append_dev(section6, p23);
    			append_dev(section6, t100);
    			append_dev(section6, p24);
    			append_dev(section6, t102);
    			append_dev(section6, aside2);
    			mount_component(video4, aside2, null);
    			append_dev(aside2, t103);
    			append_dev(aside2, p25);
    			append_dev(p25, small6);
    			append_dev(aside2, t105);
    			mount_component(video5, aside2, null);
    			append_dev(aside2, t106);
    			append_dev(aside2, p26);
    			append_dev(p26, small7);
    			append_dev(section10, t108);
    			append_dev(section10, section7);
    			mount_component(skill4, section7, null);
    			append_dev(section7, t109);
    			append_dev(section7, p27);
    			append_dev(section7, t111);
    			append_dev(section7, p28);
    			append_dev(section7, t113);
    			append_dev(section7, p29);
    			append_dev(section7, t115);
    			append_dev(section7, ol3);
    			append_dev(ol3, li10);
    			append_dev(ol3, t117);
    			append_dev(ol3, li11);
    			append_dev(ol3, t119);
    			append_dev(ol3, li12);
    			mount_component(tooltip6, li12, null);
    			append_dev(ol3, t120);
    			append_dev(ol3, li13);
    			mount_component(tooltip7, li13, null);
    			append_dev(ol3, t121);
    			append_dev(ol3, li14);
    			mount_component(tooltip8, li14, null);
    			append_dev(section10, t122);
    			append_dev(section10, section8);
    			mount_component(skill5, section8, null);
    			append_dev(section8, t123);
    			append_dev(section8, p30);
    			append_dev(section8, t125);
    			append_dev(section8, p31);
    			append_dev(section8, t127);
    			append_dev(section8, p32);
    			append_dev(section10, t129);
    			append_dev(section10, section9);
    			mount_component(skill6, section9, null);
    			append_dev(section9, t130);
    			append_dev(section9, p33);
    			append_dev(section9, t132);
    			append_dev(section9, p34);
    			append_dev(main, t134);
    			append_dev(main, section11);
    			append_dev(section11, h15);
    			append_dev(section11, t136);
    			append_dev(section11, q4);
    			append_dev(section11, t138);
    			append_dev(section11, img2);
    			append_dev(section11, t139);
    			append_dev(section11, p35);
    			append_dev(section11, t141);
    			append_dev(section11, p36);
    			append_dev(section11, t143);
    			mount_component(video6, section11, null);
    			append_dev(section11, t144);
    			append_dev(section11, br);
    			append_dev(section11, t145);
    			mount_component(combo, section11, null);
    			append_dev(main, t146);
    			append_dev(main, section12);
    			append_dev(section12, h16);
    			append_dev(main, t148);
    			append_dev(main, section13);
    			append_dev(section13, h17);
    			append_dev(main, t150);
    			append_dev(main, section14);
    			append_dev(section14, h18);
    			append_dev(section14, t152);
    			append_dev(section14, p37);
    			append_dev(section14, t154);
    			append_dev(section14, ul);
    			append_dev(ul, li15);
    			append_dev(li15, a0);
    			append_dev(ul, t156);
    			append_dev(ul, li16);
    			append_dev(li16, a1);
    			append_dev(ul, t158);
    			append_dev(ul, li17);
    			append_dev(li17, a2);
    			append_dev(ul, t160);
    			append_dev(ul, li18);
    			append_dev(li18, a3);
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
    			const tooltip6_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				tooltip6_changes.$$scope = { dirty, ctx };
    			}

    			tooltip6.$set(tooltip6_changes);
    			const tooltip7_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				tooltip7_changes.$$scope = { dirty, ctx };
    			}

    			tooltip7.$set(tooltip7_changes);
    			const tooltip8_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				tooltip8_changes.$$scope = { dirty, ctx };
    			}

    			tooltip8.$set(tooltip8_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(copiabletext.$$.fragment, local);
    			transition_in(skill0.$$.fragment, local);
    			transition_in(tooltip0.$$.fragment, local);
    			transition_in(tooltip1.$$.fragment, local);
    			transition_in(video0.$$.fragment, local);
    			transition_in(video1.$$.fragment, local);
    			transition_in(skill1.$$.fragment, local);
    			transition_in(tooltip2.$$.fragment, local);
    			transition_in(tooltip3.$$.fragment, local);
    			transition_in(tooltip4.$$.fragment, local);
    			transition_in(video2.$$.fragment, local);
    			transition_in(video3.$$.fragment, local);
    			transition_in(skill2.$$.fragment, local);
    			transition_in(hoverableskill0.$$.fragment, local);
    			transition_in(tooltip5.$$.fragment, local);
    			transition_in(hoverableskill1.$$.fragment, local);
    			transition_in(hoverableskill2.$$.fragment, local);
    			transition_in(skill3.$$.fragment, local);
    			transition_in(video4.$$.fragment, local);
    			transition_in(video5.$$.fragment, local);
    			transition_in(skill4.$$.fragment, local);
    			transition_in(tooltip6.$$.fragment, local);
    			transition_in(tooltip7.$$.fragment, local);
    			transition_in(tooltip8.$$.fragment, local);
    			transition_in(skill5.$$.fragment, local);
    			transition_in(skill6.$$.fragment, local);
    			transition_in(video6.$$.fragment, local);
    			transition_in(combo.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(copiabletext.$$.fragment, local);
    			transition_out(skill0.$$.fragment, local);
    			transition_out(tooltip0.$$.fragment, local);
    			transition_out(tooltip1.$$.fragment, local);
    			transition_out(video0.$$.fragment, local);
    			transition_out(video1.$$.fragment, local);
    			transition_out(skill1.$$.fragment, local);
    			transition_out(tooltip2.$$.fragment, local);
    			transition_out(tooltip3.$$.fragment, local);
    			transition_out(tooltip4.$$.fragment, local);
    			transition_out(video2.$$.fragment, local);
    			transition_out(video3.$$.fragment, local);
    			transition_out(skill2.$$.fragment, local);
    			transition_out(hoverableskill0.$$.fragment, local);
    			transition_out(tooltip5.$$.fragment, local);
    			transition_out(hoverableskill1.$$.fragment, local);
    			transition_out(hoverableskill2.$$.fragment, local);
    			transition_out(skill3.$$.fragment, local);
    			transition_out(video4.$$.fragment, local);
    			transition_out(video5.$$.fragment, local);
    			transition_out(skill4.$$.fragment, local);
    			transition_out(tooltip6.$$.fragment, local);
    			transition_out(tooltip7.$$.fragment, local);
    			transition_out(tooltip8.$$.fragment, local);
    			transition_out(skill5.$$.fragment, local);
    			transition_out(skill6.$$.fragment, local);
    			transition_out(video6.$$.fragment, local);
    			transition_out(combo.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(copiabletext);
    			destroy_component(skill0);
    			destroy_component(tooltip0);
    			destroy_component(tooltip1);
    			destroy_component(video0);
    			destroy_component(video1);
    			destroy_component(skill1);
    			destroy_component(tooltip2);
    			destroy_component(tooltip3);
    			destroy_component(tooltip4);
    			destroy_component(video2);
    			destroy_component(video3);
    			destroy_component(skill2);
    			destroy_component(hoverableskill0);
    			destroy_component(tooltip5);
    			destroy_component(hoverableskill1);
    			destroy_component(hoverableskill2);
    			destroy_component(skill3);
    			destroy_component(video4);
    			destroy_component(video5);
    			destroy_component(skill4);
    			destroy_component(tooltip6);
    			destroy_component(tooltip7);
    			destroy_component(tooltip8);
    			destroy_component(skill5);
    			destroy_component(skill6);
    			destroy_component(video6);
    			destroy_component(combo);
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
    		Combo,
    		CopiableText,
    		HoverableSkill,
    		Skill,
    		Tooltip,
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
