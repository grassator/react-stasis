var React = require('react');
var ReactDOM = require('react-dom');

function Static(props) {
    React.Component.call(this, props);
}

/**
 * Will always short-circuit and not re-render
 * @returns {boolean}
 */
Static.prototype.shouldComponentUpdate = function () {
    return false;
};

Static.prototype = new React.Component();

Static.prototype.render = function () {
    return exports.isServer ? this.renderServer() : this.renderClient();
};

/**
 * Gets a copy of the props, that we can modify.
 * This is necessary because actual props are immutable.
 * @returns {object}
 */
Static.prototype.getProps = function () {
    var props = {};
    for (var key in this.props.props) {
        if (this.props.hasOwnProperty(key)) {
            props[key] = this.props[key];
        }
    }
    return props;
};

Static.prototype.renderServer = function () {
    var props = this.getProps();
    if (this.props.children) {
        props.children = this.props.children;
    }
    props['data-stasis'] = exports.id++;
    return React.createElement(this.props.component, props);
};

Static.prototype.renderClient = function () {
    var id = exports.id++;
    var props = this.getProps();
    props['data-stasis'] = id;
    // On the client we use already rendered HTML as the children
    props.dangerouslySetInnerHTML = {
        __html: exports.root.querySelector('[data-stasis="' + id + '"]').innerHTML
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
