const fs = require('fs');
const path = require('path');

const directory = path.join(__dirname, '../src/pages/AdminDashboard');

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;

    // Remove "use client"
    content = content.replace(/['"]use client['"];?\n?/g, '');

    // Replace next/image import
    content = content.replace(/import Image from ['"]next\/image['"];?\n?/g, '');
    
    // Replace <Image> with <img>
    // Next Image often has: src, alt, width, height, fill, className.
    // We just rename the tag. The standard img doesn't support 'fill' but CSS usually handles it.
    // For simplicity, we just replace <Image with <img and </Image> with </img>
    content = content.replace(/<Image/g, '<img');
    content = content.replace(/<\/Image>/g, '</img>'); // Standard img is self closing, but React allows </img> or self closing

    // Replace next/link
    // First, handle the import. It could be import Link from 'next/link'
    if (content.includes('next/link')) {
        content = content.replace(/import Link from ['"]next\/link['"];?/g, "import { Link } from 'react-router-dom';");
        
        // Replace href= with to= inside Link tags
        // This is tricky, but usually it's <Link href="...">
        content = content.replace(/<Link\s+([^>]*)href=/g, '<Link $1to=');
    }

    // Replace next/navigation
    if (content.includes('next/navigation')) {
        // Find what's imported
        const navigationImportMatch = content.match(/import\s+{([^}]+)}\s+from\s+['"]next\/navigation['"];?/);
        if (navigationImportMatch) {
            const imports = navigationImportMatch[1].split(',').map(s => s.trim());
            const newImports = [];
            
            if (imports.includes('useRouter')) newImports.push('useNavigate');
            if (imports.includes('usePathname')) newImports.push('useLocation');
            if (imports.includes('useSearchParams')) newImports.push('useSearchParams');
            
            let reactRouterDomImport = `import { ${newImports.join(', ')} } from 'react-router-dom';`;
            
            // Check if react-router-dom is already imported
            if (content.includes("'react-router-dom'")) {
                 // Too complex to merge automatically here, we'll just prepend and let the linter/us fix duplicates
                 content = content.replace(navigationImportMatch[0], reactRouterDomImport);
            } else {
                 content = content.replace(navigationImportMatch[0], reactRouterDomImport);
            }
        }

        // Replace useRouter() with useNavigate()
        content = content.replace(/useRouter\(\)/g, 'useNavigate()');
        // Replace router = useRouter() usually called 'router', so router.push -> navigate
        // First find if router is assigned useNavigate
        if (content.includes('useNavigate()')) {
            content = content.replace(/const\s+router\s*=\s*useNavigate\(\);?/g, 'const navigate = useNavigate();');
            content = content.replace(/router\.push\(/g, 'navigate(');
            content = content.replace(/router\.replace\((.*?)\)/g, 'navigate($1, { replace: true })');
            content = content.replace(/router\.back\(\)/g, 'navigate(-1)');
            content = content.replace(/router\.refresh\(\)/g, 'window.location.reload()');
        }

        // Replace usePathname() with useLocation().pathname
        content = content.replace(/usePathname\(\)/g, 'useLocation().pathname');
    }

    if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated: ${filePath}`);
    }
}

function walkDir(dir) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        if (isDirectory) {
            walkDir(dirPath);
        } else if (f.endsWith('.tsx') || f.endsWith('.ts') || f.endsWith('.jsx') || f.endsWith('.js')) {
            processFile(dirPath);
        }
    });
}

walkDir(directory);
console.log('Done.');
