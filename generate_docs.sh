version=$1
major=$(echo $version | cut -d. -f1)
major_minor=$(echo $version | cut -d. -f-2)

set -euxo pipefail

git worktree add docs docs

npm run check_api
npx api-documenter markdown -i dist/ -o docs/v$major_minor/

ln -sfT rsc-tools.md docs/v$major_minor/index.md
ln -sfT v$major_minor docs/v$major
ln -sfT v$major_minor docs/latest

pushd docs
git add .
git commit -m "Updates documentation ($version)"
git push origin
popd

git worktree remove docs