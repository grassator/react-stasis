const _ = require('react').createElement;
const server = require('./server');
const {Static} = require('./index');

describe('server', () => {

    it('should be able to render to static markup', () => {
        expect(
            server.renderToStaticMarkup(_('h1', null, 'Works!'))
        ).toBe(
            `<h1>Works!</h1>`
        );
    });

    it('should add a special data attribute when rendering to string', () => {
        expect(
            server.renderToString(
                _('div', null,
                    _(Static, { component: 'h1', props: {className: 'foo'}}, 'static'),
                    _('h2', null, 'dynamic')
                )
            )
        ).toContain('data-stasis="0"');
    });

    it('should restard ids every render', () => {
        server.renderToString(
            _(Static, { component: 'h1', props: {className: 'foo'}}, 'static')
        );
        expect(
            server.renderToString(
                _(Static, { component: 'h1', props: {className: 'foo'}}, 'static')
            )
        ).toContain('data-stasis="0"');
    });
});