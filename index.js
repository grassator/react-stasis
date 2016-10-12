(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['react', 'react-dom'], function (React, ReactDOM) {
            return factory(React, ReactDOM);
        });
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory(require('react'), require('react-dom'));
    } else {
        root.ReactStasis = factory(root.React, root.ReactDOM);
    }
}(this, function (React, ReactDOM) {

    /**
     * Gets a copy of the props, that we can modify.
     * This is necessary because actual props are immutable.
     * @returns {object}
     */
    function getProps(component) {
        var props = {};
        for (var key in component.props.props) {
            if (component.props.hasOwnProperty(key)) {
                props[key] = component.props[key];
            }
        }
        return props;
    }

    function Static(props) {
        React.Component.call(this, props);
        this.portals = Object.create(null);
    }

    Static.prototype = new React.Component();

    Static.prototype.updatePortal = function (portal) {
        if (portal === null || portal === undefined) {
            return;
        }
        var name = portal.props.name;
        var portalRoot = this.portals[name];
        if (!(name in this.portals)) {
            portalRoot = this.portals[name] = document.querySelector('[data-stasis-portal="' + name + '"]');
            if (portalRoot) {
                portalRoot.innerHTML = '';
            }
        }
        if (!portalRoot) {
            return;
        }
        ReactDOM.render(React.Children.only(portal.props.children), portalRoot);
    };

    Static.prototype.processChildren = function (children) {
        React.Children.forEach(children, this.updatePortal, this);
    };

    /**
     * Will always short-circuit and not re-render
     * @returns {boolean}
     */
    Static.prototype.shouldComponentUpdate = function (props) {
        this.processChildren(props.children);
        return false;
    };

    Static.prototype.componentDidMount = function () {
        this.processChildren(this.props.children);
    };

    Static.prototype.render = function () {
        return exports.isServer ? this.renderServer() : this.renderClient();
    };

    Static.prototype.renderServer = function () {
        var ReactDOMServer = require('react-dom/server');
        var props = getProps(this);
        var html = '';
        React.Children.forEach(this.props.children, function (child) {
            html += ReactDOMServer.renderToStaticMarkup(child)
                .replace(/\/>/g, '>');
        });
        props['data-stasis'] = exports.id++;
        props.dangerouslySetInnerHTML = {
            __html: html
        };
        return React.createElement(this.props.component, props);
    };

    Static.prototype.renderClient = function () {
        var id = exports.id++;
        var props = getProps(this);
        props['data-stasis'] = id;
        // On the client we use already rendered HTML as the children
        var html = exports.root.querySelector('[data-stasis="' + id + '"]').innerHTML;
        props.dangerouslySetInnerHTML = {
            __html: html
        };
        return React.createElement(this.props.component, props);
    };

    Static.defaultProps = {
        component: 'div',
        props: null
    };

    Static.propTypes = {
        component: React.PropTypes.oneOfType([
            React.PropTypes.string,
            React.PropTypes.element
        ]).isRequired,
        props: React.PropTypes.object
    };

    function Portal(props) {
        React.Component.call(this, props);
    }

    Portal.prototype = new React.Component();

    Portal.prototype.render = function () {
        var props = getProps(this);
        if (this.props.children) {
            props.children = this.props.children;
        }
        props['data-stasis-portal'] = this.props.name;
        return React.createElement(this.props.component, props);
    };

    Portal.defaultProps = {
        component: 'div',
        props: null,
        children: React.PropTypes.element
    };

    Portal.propTypes = {
        component: React.PropTypes.oneOfType([
            React.PropTypes.string,
            React.PropTypes.element
        ]).isRequired,
        props: React.PropTypes.object,
        name: React.PropTypes.string.isRequired
    };

    var exports = {};
    // Being future-proof and copying all the props for react-dom
    for (var key in ReactDOM) {
        if (ReactDOM.hasOwnProperty(key)) {
            exports[key] = ReactDOM[key];
        }
    }

    /**
     * A wrapper around ReactDOM.render that takes care about
     * static subtrees generated with react-stasis
     * @param {*} component
     * @param {Element} root
     * @returns {*}
     */
    exports.render = function (component, root) {
        exports.isServer = false;
        exports.id = 0;
        exports.root = root;
        return ReactDOM.render.apply(ReactDOM, arguments);
    };

    // This is used for a shared state between component and renderer
    exports.isServer = false;
    exports.id = 0;
    exports.root = null;

    exports.Static = Static;
    exports.Portal = Portal;

    return exports;
}));

