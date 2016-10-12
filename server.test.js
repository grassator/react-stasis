const _ = require('react').createElement;
const server = require('./server');
const {Static, Portal} = require('./index');

describe('server', () => {

    describe('render', () => {
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
                        _(Static, { component: 'h1', props: {className: 'foo'}},
                            _('div', null, 'static')
                        ),
                        _('h2', null, 'dynamic')
                    )
                )
            ).toContain('data-stasis="0"');
        });

        it('should restart ids every render', () => {
            server.renderToString(
                _(Static, { component: 'h1', props: {className: 'foo'}},
                    _('div', null, 'static')
                )
            );
            expect(
                server.renderToString(
                    _(Static, { component: 'h1', props: {className: 'foo'}},
                        _('div', null, 'static')
                    )
                )
            ).toContain('data-stasis="0"');
        });
    });

    describe('Portal', () => {
        it('should mark named portals with a spacial data attribute', () => {
            const markup = server.renderToString(
                _('div', null,
                    _(Static, { component: 'h1', props: {className: 'foo'}},
                        _('div', { className: 'bar'},
                            _(Portal, { name: 'test'},
                                _('div', {}, '123456')
                            )
                        )
                    )
                )
            );
            expect(markup).toContain('data-stasis-portal="test"');
            expect(markup).toContain('123456');
        });
    });
});