#!/usr/bin/env bash

set -exuo pipefail

while [[ $# -gt 0 ]]; do
    case $1 in
        --task-dir|-t)
            task_dir="$2"
            shift 2
            ;;
        --app-dir|-a)
            app_dir="$2"
            shift 2
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

# set inputs
export INPUT_PARAPYPYPIADDRESS=$PARAPY_PYPI_ADDRESS
export INPUT_PARAPYPYPIUSERNAME=$PARAPY_PYPI_USERNAME
export INPUT_PARAPYPYPIPASSWORD=$PARAPY_PYPI_PASSWORD
export INPUT_PARAPYCLOUDADDRESS=$PARAPY_CLOUD_ADDRESS
export INPUT_SERVICEACCOUNTIDENTIFIER=$SERVICE_ACCOUNT_IDENTIFIER
export INPUT_SERVICEACCOUNTSECRET=$SERVICE_ACCOUNT_SECRET
export INPUT_PARAPYAPPIDENTIFIER=$PARAPY_APP_IDENTIFIER
export INPUT_PARAPYAPPVERSION=$PARAPY_APP_VERSION

pushd $task_dir
    # create temp venv and activate
    python3 -m venv venv
    source venv/bin/activate

    # transpile to js
    tsc

    pushd $app_dir
        # run release pipeline
        node "${task_dir}/index.js"
    popd

    # clean up venv
    rm -rf venv
popd