#!/bin/env bash


set -e # Non-zero exit status must be captured.
set -o pipefail # Return exit status of the last successful command in a pipeline.

# paths
readonly PROJ_ROOT="$( cd $(dirname $0) && pwd)"
readonly MODULE_NAME="cmp-ui"
readonly BUILD_OUTPUT_DIR="${PROJ_ROOT}/output"
readonly TAR_FILE_APPENDIX="tar.gz"

function exit_error() {
    echo "ERROR: $1"
    exit 1
}

function pack() {
    local module_package_name=${MODULE_NAME}.${TAR_FILE_APPENDIX}

    cd ${PROJ_ROOT}

    tar zcf ${module_package_name} *
    # create directory for output
    [[ -d "./output" ]] && rm -rf output
    mkdir output
    mv ${module_package_name} ./output/
}

function main() {
    # pack module
    pack || {
        exit_error "Failed output packing."
    }
}

main "$@"
