#!/usr/bin/env bash

set -exuo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

access_type="private"

while [[ $# -gt 0 ]]; do
    case $1 in
        --public)
            access_type="public"
            shift 1
            ;;
        --env|-e)
            env_file="$2"
            source $env_file
            shift 2
            ;;
        *)
            echo "Unknown option: $1"
            exit 1
            ;;
    esac
done

# TODO: make this so that the new version is set through the script. 
# This would also require us to make some effort on the github side
echo "Please bump the extension version..."
read -p "You can continue by pressing enter" _

echo "Please bump the release-task version..."
read -p "You can continue by pressing enter" _

echo "Please bump the test-task version..."
read -p "You can continue by pressing enter" _

pushd "${SCRIPT_DIR}/../"
    # TODO: Create private extension that we use for testing releases before we publish them publically

    # build tasks
    pushd ./release-task
        npm install
        tsc
    popd

    pushd ./test-task
        npm install
        tsc
    popd

    case $access_type in
        public)
            tfx extension publish --manifest-globs vss-extension.json --service-url https://marketplace.visualstudio.com --auth-type pat --token $AZURE_MARKETPLACE_PAT
            ;;
        private)
            tfx extension publish --manifest-globs vss-extension.json --share-with ParaPy --service-url https://marketplace.visualstudio.com --auth-type pat --token $AZURE_MARKETPLACE_PAT
            ;;
        *)
            echo "Error: Invalid access type"
            exit 1
            ;;
    esac

    # clean tasks
    pushd ./release-task
        rm -rf node_modules
    popd

    pushd ./test-task
        rm -rf node_modules
    popd

popd