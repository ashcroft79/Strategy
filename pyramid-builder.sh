#!/bin/bash
# Wrapper script to run pyramid-builder CLI without installation

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
export PYTHONPATH="${SCRIPT_DIR}/src:${PYTHONPATH}"

python -m pyramid_builder.cli.main "$@"
