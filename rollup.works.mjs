// rollup.config.js
import * as path from 'path';
import resolve from '@rollup/plugin-node-resolve';
import commonJS from '@rollup/plugin-commonjs';
//import minifyHTML from 'rollup-plugin-minify-html-literals';
import terser from "@rollup/plugin-terser";
import pkg from './package.json' with { type: "json" };

export default args => {
        return {
                input: `src/works/map.js`,
                output: {
                        file: `public/js/map.js`,
                        format: 'esm',
                        compact:true,
                },
                plugins: [ 
                        resolve({
                                browser:true,
                                customResolveOptions: {
                                        moduleDirectory:'node_modules',
                                        dedup: [...Object.keys(pkg.dependencies || {})]
                                }
                        }),
                        commonJS({
                                include: 'node_modules/**',
                                exclude: [
                                ],
                        }),
                        //minifyHTML(),
                        terser({
                        compress:{
                                //drop_console:true
                                }
                        })

                ]
        }
};