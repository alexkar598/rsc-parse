version=$1

set -euxo pipefail

npm run check_api
npx api-documenter markdown -i dist/ -o pages/$version/

ln -sf rsc-tools.md pages/$version/index.md
ln -sf $version pages/latest