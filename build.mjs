import autoprefixer from "autoprefixer";
import cssnano from "cssnano";

import rollupBabel from "@rollup/plugin-babel";
import rollupGzip from 'rollup-plugin-gzip';
import rollupNodeResolve from '@rollup/plugin-node-resolve';
import rollupReplace from 'rollup-plugin-replace';
import rollupVue from 'rollup-plugin-vue2';
import rollupCommonJs from '@rollup/plugin-commonjs';
import rollupScss from 'rollup-plugin-scss'

import buildBundle from "./build/bundle.mjs";

const babelPresets = ["@babel/preset-env"];
const babelPlugins = ["@babel/plugin-proposal-class-properties"];

// demo files
// -----------------------------------------------------------------------------------------
(async root => await Promise.all([
    await buildBundle({
        input: {
            input: `${root}/src/main.js`
        },

        plugins: [
            rollupNodeResolve(),

            rollupScss(),

            rollupVue({ css: false }),

            rollupCommonJs(),

            rollupReplace({
              'process.env.NODE_ENV': JSON.stringify('production')
            })
        ],
        
        output: [
            {
                compact: true,
                sourcemap: true,
                format: 'iife',
                file: `${root}/dist/main.js`,
                plugins: [
                    rollupBabel.getBabelOutputPlugin({
                        compact: true,
                        comments: false,
                        presets: babelPresets,
                        plugins: babelPlugins,
                        allowAllFormats: true
                    }),
                    
                    rollupGzip()
                ]
            }
        ]
    })
]))("./demo");

// library
// -----------------------------------------------------------------------------------------
(async root => {
    const bundles = [];

    const bundlify = async (type, min) => await buildBundle({
        input: {
            input: `${root}src/padlock.mjs`
        },

        output: [
            {
                compact: min,
                sourcemap: true,
                format: type,
                name: "ScrollPadlock",
                file: `${root}dist/${type}/scroll-padlock${ min ? '.min' : '' }.js`,
                exports: "auto",
                plugins: [
                    rollupBabel.getBabelOutputPlugin({
                        compact: min,
                        comments: false,
                        presets: babelPresets,
                        plugins: babelPlugins,
                        allowAllFormats: true
                    }),
                    
                    rollupGzip()
                ]
            }
        ]
    });

    ["amd", "iife", "system", "es", "cjs"].forEach(type => {
        // non-minified version
        bundles.push(bundlify(type, false));

        // minified version
        bundles.push(bundlify(type, true));
    });

    await Promise.all(bundles);
})('./');
