(function (window) {
    var React = window.React;
    var ReactStasis = window.ReactStasis;
    if (typeof require !== 'undefined') {
        React = require('react');
        ReactStasis = require('../index');
    }

    var isBrowser = typeof document !== 'undefined';

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
            if (isBrowser) {
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

    function renderPortal(name, child) {
        var counterPortal = React.createElement(ReactStasis.Portal, {
            name: name.replace(/\s+/g, '-').toLowerCase(),
            component: 'span'
        }, child);
        if (isBrowser) {
            return counterPortal;
        }
        return React.createElement('div', null,
            React.createElement('h3', null, name),
            React.createElement('hr'),
            React.createElement('span', null, 'Press the button: '),
            counterPortal
        );
    }

    function app(items) {
        return React.createElement('div', null,
            React.createElement(ReactStasis.Static, null,
                renderPortal('Counter Portal 1', React.createElement(Counter))
            ),
            React.createElement(ReactStasis.Static, null,
                renderPortal('Counter Portal 2', React.createElement(Counter))
            ),
            React.createElement('h3', null, 'Static List'),
            React.createElement('hr'),
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