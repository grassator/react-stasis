(function (window) {
    var React = window.React;
    var ReactStasis = window.ReactStasis;
    if (typeof require !== 'undefined') {
        React = require('react');
        ReactStasis = require('../index');
    }

    // Dynamic part of the app
    var Counter = React.createClass({
        getInitialState: function () {
            return {
                count: 0
            };
        },
        increment: function () {
            this.setState({
                count: this.state.count + 1
            });
        },
        render: function () {
            return React.createElement('button', {
                onClick: this.increment
            }, this.state.count);
        }
    });

    // Static part of the app
    var List = React.createClass({
        getDefaultProps: function () {
            return {
                items: []
            }
        },
        render: function () {
            // in the browser
            if (typeof document !== 'undefined') {
                return null;
            }
            return React.createElement(
                'ul', null,
                this.props.items.map(function (item) {
                    return React.createElement('li', { key: item }, item);
                })
            );
        }
    });

    function app(items) {
        return React.createElement('div', null,
            React.createElement(Counter, null),
            React.createElement(ReactStasis.Static, null,
                React.createElement(List, {items: items})
            )
        );
    }

    if (typeof module !== 'undefined') {
        module.exports = app;
    }

    window.App = app;
})(this);