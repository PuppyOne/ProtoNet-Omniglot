import { $ } from 'bun';


const remote = process.argv[2];

if (!remote) {
  console.error('Usage: commitlint-main <remote>');
  process.exit(1);
}

for await (const line of console) {
  if (!line.trim()) continue;
  const [_localRef, _localSha, remoteRef, _remoteSha] = line.split(/\s+/);

  const isMain = remoteRef === 'refs/heads/main';

  if (!isMain) continue;

  await $`bun commitlint --from ${remote}/main --to HEAD --verbose`;
}
