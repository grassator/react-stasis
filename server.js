var ReactDOM = require('react-dom/server');
const stasis = require('./index');

exports.renderToStaticMarkup = ReactDOM.renderToStaticMarkup;

exports.renderToString = function () {
    stasis.isServer = true;
    stasis.id = 0;
    return ReactDOM.renderToString.apply(ReactDOM, arguments);
};
