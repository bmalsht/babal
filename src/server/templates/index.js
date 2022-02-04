/*
 * React template engine
 */

'use strict';

const fs = require('fs');
const Helmet = require('react-helmet').Helmet;
const config = require('getconfig');

require('@babel/register')({
    extends: config.babel && config.babel.rc && fs.existsSync(config.babel.rc) ? config.babel.rc : undefined
});

const Path = require('path');
const Fs = require('fs');
const React = require('react');
const ReactDOMServer = require('react-dom/server');
const Handlebars = require('./handlebars');

const handlebars = Handlebars.compile(Fs.readFileSync(Path.join(__dirname, '/pages/main.html'), 'utf8'));

const safeStringify = obj => {
    return JSON.stringify(obj)
        .replace(/<\/script/g, '<\\/script')
        .replace(/<!--/g, '<\\!--');
};

module.exports = {
    /*
     * Compile a React page component
     */
    compile: (template, options) => {
        if (!options.filename) {
            throw new Error('Error [template engine]: Filename not defined.');
        }

        const View = require(options.filename);

        return context => {
            // Prepare the props string
            let props = context.props || {};

            props.dev = config.getconfig.isDev;
            props = safeStringify(props);

            // Render the React application
            const app = ReactDOMServer.renderToString(React.createElement(View, JSON.parse(props)));
            const helmet = Helmet.renderStatic();

            // Prepare the Handlebars data
            const data = context;

            data.app = app;
            data.props = props;

            // Metadata
            if (helmet) {
                data.meta = Object.keys(helmet)
                    .map(k => {
                        const s = helmet[k].toString();

                        return s ? `${s}\n` : '';
                    })
                    .join('');
            }

            // Render the Handlebars template
            const result = handlebars(data);

            return result;
        };
    }
};
