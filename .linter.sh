#!/bin/bash
cd /home/kavia/workspace/code-generation/voicevault-100906-5cebf73c/voicevault
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

