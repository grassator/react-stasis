const _ = require('react').createElement;
const {Static, Portal, render} = require('./index');
const server = require('./server');


describe('client', () => {
    let err;

    beforeEach(() => {
        err = console.error;
        console.error = (msg) => {
            throw new Error(msg);
        }
    });

    afterEach(() => {
        console.error = err;
    });

    it('should reuse markup and allow re-render', () => {
        const root = document.createElement('div');
        document.body.appendChild(root);
        root.innerHTML = server.renderToString(
            _('div', null,
                _(Static, null,
                    _('h1', null, '')
                )
            )
        );
        render(
            _('div', null,
                _(Static, null)
            ), root
        );
        render(
            _('div', null,
                _(Static, null)
            ), root
        );
    });

    it('should support named portals', () => {
        const root = document.createElement('div');
        document.body.appendChild(root);
        root.innerHTML = server.renderToString(
            _('div', null,
                _(Static, null,
                    _('div', { className: 'wrapper' },
                        _(Portal, { name: 'test' },
                            _('span', null, 1)
                        )
                    )
                )
            )
        );
        render(
            _('div', null,
                _(Static, null,
                    _(Portal, { name: 'test' },
                        _('span', null, 21)
                    )
                )
            ), root
        );
        render(
            _('div', null,
                _(Static, null,
                    _(Portal, { name: 'test' },
                        _('span', null, 42)
                    )
                )
            ), root
        );
        expect(root.innerHTML).toContain('>42<')
    });
});