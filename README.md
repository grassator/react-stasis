# react-stasis

Universal (isomorphic) rendering is one of the benefits of using React. Often times, however, a large portion of the page is static, so ideally you would want to to render it on the server, but not worry about it on the client side.

Unfortunately when React checks if the markup can be reused on the client side, it's currently impossible to tell it to ignore a certain subtree. That means that if you are unable to replicate DOM *exactly*, reconciliation will fail.

This is where `react-stasis` comes in. This package allows to you to only render part of the React tree on the server thus possibly reducing data sent to the client and the app initialization time.

In case you want some dynamic elements somewhere deep inside your static tree, `react-stasis` has you covered with a [portal functionality](#portals)

## Basics

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

## Portals

Portals allow you to have some dynamic React components inside your sub tree. A good example would be a slider with images in a long page of text. Here's how it will roughly look like:


```jsx
const {Component} = require('react');
const {Static, Portal, render} = require('react-stasis');

class MyApp extends Component {
    render() {
        return <div>
            <div>Some dynamic part of your app</div>
            <Static>
                {this.renderStatic(
                    <MySlider />
                )}
            </Static>
        </div>
    }
    renderStatic(slider) {
        // this can be used for example by webpack
        // to exclude the statis part from the bundle
        // if you use https://webpack.github.io/docs/list-of-plugins.html#defineplugin
        const portal =
            <Portal name="slider">
                <MySlider />
            </Portal>
        if (process.env.TARGET === 'browser') {
            return portal;
        } else {
            const MyStaticComponent = require('./my-static-component');
            return <MyStaticComponent someFoo="bar">
                {portal}
            </MyStaticComponent>;
        }
    }
}
```

The example above only assumes that `MyStaticComponent` can accept Slider as a child and knows where to place it in the content.

## Fully Working Example

To see a fully-working example, but which is really bare bones (without a server-side framework or a bundler) you can take a look at the [example folder](https://github.com/grassator/react-stasis/tree/master/example).

You can also clone this repo and then run:

```bash
npm install
npm run example
```

and see how it works out in the browser.

> You shouldn't use this example as a starting point for your React app — look at [react-create-app](https://github.com/facebookincubator/create-react-app) instead.

## Known issues

* Using `react-stasis` just in the browser will result in an error.

* Nested `Static` components are not supported at the moment and will result in an error in the browser. 

* Due to a difference in reported markup between browser-generated `innerHTML` and what `ReactDOM.renderToStaticMarkup` generates, `react-stasis` has to go a global replace `/>` to `>`, so if you have some html markup as text (static data) in your app, it might be affected. If you don't need to render, it's recommended to escape this markup beforehand.

## `Static` component props

* `component: React.Component | string`
* `props: object`