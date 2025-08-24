#!/usr/bin/env tsx
import fs from 'fs';
import path from 'path';

const APP_DIR = path.resolve(process.cwd(), 'app');
const ALLOWED_PLACEHOLDER = '/__placeholder';

function walk(dir: string, filterExt: string[] = ['.ts', '.tsx']): string[] {
  const out: string[] = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...walk(p, filterExt));
    else if (filterExt.includes(path.extname(e.name))) out.push(p);
  }
  return out;
}

function buildRouteSet(): Set<string> {
  const files = walk(APP_DIR, ['.tsx', '.ts']).filter((f) => !f.endsWith('_layout.tsx'));
  const set = new Set<string>();
  for (const f of files) {
    const rel = path.relative(APP_DIR, f).replace(/\\/g, '/');
    if (rel.startsWith('api/')) continue;
    const noExt = rel.replace(/\.(tsx|ts)$/i, '');
    const isIndex = path.basename(noExt) === 'index';
    const dir = path.dirname(noExt);
    const route = isIndex ? `/${dir === '.' ? '' : dir}` : `/${noExt}`;
    set.add(route);
  }
  set.add(ALLOWED_PLACEHOLDER);
  return set;
}

function findRouteStrings(content: string): Array<{ match: string; index: number }> {
  const results: Array<{ match: string; index: number }> = [];
  const regexes = [
    /router\.(push|replace|navigate)\(\s*['"]([^'"\)]+)['"][^\)]*\)/g,
    /href=\{?['"]([^'"}]+)['"]\}?/g,
    /Link\s+[^>]*href=\{?['"]([^'"}]+)['"]\}?/g,
  ];
  for (const rx of regexes) {
    let m: RegExpExecArray | null;
    while ((m = rx.exec(content))) {
      const full = m[0];
      const pathStr = m[2] ?? m[1];
      const candidate = (m.length === 3 ? m[2] : m[1]) as string;
      if (!candidate) continue;
      if (candidate.startsWith('/')) results.push({ match: candidate, index: m.index });
    }
  }
  return results;
}

function runAudit() {
  const routeSet = buildRouteSet();
  const files = walk(process.cwd(), ['.tsx', '.ts']).filter((p) => p.includes(path.sep + 'app' + path.sep) || p.includes(path.sep + 'components' + path.sep));
  const broken: Array<{ file: string; route: string }> = [];

  for (const file of files) {
    const content = fs.readFileSync(file, 'utf8');
    const matches = findRouteStrings(content);
    for (const m of matches) {
      const route = m.match;
      if (!routeSet.has(route)) {
        broken.push({ file, route });
      }
    }
  }

  if (broken.length) {
    console.log(`Found ${broken.length} broken route reference(s):`);
    for (const b of broken) {
      console.log(` - ${b.route}  -> in ${path.relative(process.cwd(), b.file)}`);
    }

    if (process.env.PATCH_PLACEHOLDERS === 'true') {
      console.log('\nPatching to placeholder...');
      const group = new Map<string, Set<string>>();
      for (const b of broken) {
        const set = group.get(b.file) ?? new Set<string>();
        set.add(b.route);
        group.set(b.file, set);
      }
      for (const [file, targets] of group.entries()) {
        let content = fs.readFileSync(file, 'utf8');
        for (const t of targets) {
          const safe = t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          content = content.replace(new RegExp(safe, 'g'), ALLOWED_PLACEHOLDER);
        }
        fs.writeFileSync(file, content);
        console.log(`Patched ${targets.size} route(s) in ${path.relative(process.cwd(), file)}`);
      }
      console.log('Done.');
    } else {
      process.exitCode = 1;
    }
  } else {
    console.log('✅ No broken route references found');
  }
}

runAudit();
