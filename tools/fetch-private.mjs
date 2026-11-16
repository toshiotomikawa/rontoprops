// Copies the gallery photos into assets/images before the build.
// They are the client's photos and live in a private repository, not here.
// Local: reads ../PrivateHub (or PRIVATE_HUB_DIR). CI/Vercel: clones it with HUB_TOKEN.
import { cp, mkdtemp, rm, access } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const target = path.join(root, 'assets', 'images');
const exists = p => access(p).then(() => true, () => false);

let hub = process.env.PRIVATE_HUB_DIR || path.join(root, '..', 'PrivateHub');
let temp;
if (!(await exists(hub))) {
  const token = process.env.HUB_TOKEN;
  if (!token) throw new Error('Gallery photos not found: set PRIVATE_HUB_DIR or HUB_TOKEN.');
  temp = hub = await mkdtemp(path.join(tmpdir(), 'hub-'));
  const git = (...args) => execFileSync('git', args, { cwd: temp, stdio: 'ignore' });
  git('clone', '--depth', '1', '--filter=blob:none', '--sparse',
    `https://x-access-token:${token}@github.com/toshiotomikawa/PrivateHub.git`, '.');
  git('sparse-checkout', 'set', 'rontoprops');
}
await cp(path.join(hub, 'rontoprops', 'images'), target, { recursive: true });
if (temp) await rm(temp, { recursive: true, force: true });
console.log('Gallery photos copied.');
