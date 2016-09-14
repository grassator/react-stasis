# react-stasis

Universal (isomorphic) rendering is one of the benefits of using React. Often times, however, a large portion of the page is static, so ideally you would want to to render it on the server, but not worry about it on the client side.

Unfortunately when React checks if the markup can be reused on the client side, it's currently impossible to tell it to ignore a certain subtree. That means that if you are unable to replicate DOM *exactly*, reconciliation will fail.

This is where `react-stasis` comes in. This package allows to you to only render part of the React tree on the server thus possibly reducing data sent to the client and the app initialization time.

## How to Use?

`react-stasis` provides a wrapper around `react-dom` APIs, so usually on the server side you just need to install `react-stasis` NPM package and then change `react-dom/server` import to `react-stasis/server`.

On the client side you also need change the import of `react-dom` to `react-stasis`.

In the React application itself, the only thing you need to do is to wrap a static subtree in a `Static` component provided by `react-stasis` and only include it's children on the server-side:

```jsx
const {Component} = require('react');
const {Static, render} = require('react-stasis');

class MyApp extends Component {
    render() {
        return <div>
            <div>Some dynamic part of your app</div>
            <Static>
                {this.renderStatic()}
            </Static>
        </div>
    }
    renderStatic() {
        // this can be used for example by webpack
        // to exclude the statis part from the bundle
        // if you use https://webpack.github.io/docs/list-of-plugins.html#defineplugin
        if (process.env.TARGET === 'browser') {
            return null;
        } else {
            const MyStaticComponent = require('./my-static-component');
            return <MyStaticComponent someFoo="bar"/>;
        }
    }
}
```

### Fully Working Example

To see a fully-working example, but which is really barebones (without a server-side framework or a bundler) you can take a look at the [example folder](https://github.com/grassator/react-stasis/tree/master/example).

You can also clone this repo and then run:

```bash
npm install
npm run example
```

and see how it works out in the browser.

> You shouldn't use this example as a starting point for your React app — look at [react-create-app](https://github.com/facebookincubator/create-react-app) instead.

## Caveats

* Using `react-stasis` just in the browser will result in an error.

* Nested `Static` components are not supported at the moment and will result in an error in the browser. 

* The implementation implicitly relies on some React internals and may break in the future in a way that checksum will not match, so the app will be always re-rendered on the frontend.

## `Static` component props

* `component: React.Component | string`
* `props: object`