#!/bin/bash

yarn e2e:test ios.release

DETOX_EXIT_CODE=$?


exit $DETOX_EXIT_CODE
