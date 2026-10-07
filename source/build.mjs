import {fileURLToPath} from 'node:url';import path from 'node:path';process.chdir(path.dirname(fileURLToPath(import.meta.url)));
const {build} = await import(process.env.ESBUILD_MODULE || 'esbuild');
import fs from 'node:fs';import crypto from 'node:crypto';
await build({entryPoints:['src/partner-demo/main.tsx'],bundle:true,minify:true,format:'esm',jsx:'automatic',outdir:'../assets',loader:{'.svg':'file','.png':'file','.jpg':'file','.woff2':'file','.ttf':'file'},external:['/spreeai-always-on-demo/*'],define:{'process.env.NODE_ENV':'"production"'}});
const hash=crypto.createHash('sha256').update(fs.readFileSync('../assets/main.js')).update(fs.readFileSync('../config.js')).update(fs.readFileSync('../assets/main.css')).digest('hex').slice(0,12);const p='../index.html';fs.writeFileSync(p,fs.readFileSync(p,'utf8').replace(/(config.js|assets\/main.(?:css|js))(?:\?v=[a-z0-9]+)?/g,'$1?v='+hash));console.log(hash);
