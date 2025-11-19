import chokidar from 'chokidar';
import { execSync } from 'child_process';

console.log('👀 Watching for changes...\n');

// Watch content and template files
const watcher = chokidar.watch(['content/**/*.md', 'static/template.html', 'static/style.css'], {
    persistent: true,
    ignoreInitial: false
});

watcher.on('change', (path) => {
    console.log(`📝 ${path} changed, rebuilding...`);
    try {
        execSync('node build.js', { stdio: 'inherit' });
    } catch (err) {
        console.error('Build failed:', err.message);
    }
});

watcher.on('add', (path) => {
    console.log(`➕ ${path} added, rebuilding...`);
    try {
        execSync('node build.js', { stdio: 'inherit' });
    } catch (err) {
        console.error('Build failed:', err.message);
    }
});

// Initial build
try {
    execSync('node build.js', { stdio: 'inherit' });
} catch (err) {
    console.error('Initial build failed:', err.message);
}

console.log('\n💡 To view your site, run in another terminal:');
console.log('   python3 -m http.server -d dist 8080');
console.log('   Then visit: http://localhost:8080\n');
