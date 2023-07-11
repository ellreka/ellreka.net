#!/bin/bash

cat > ./docs/$1.mdx << __EOF__
export const meta = {
  date: '$(date '+%Y-%m-%d')',
  title: '',
  tags: ['']
}

## title
__EOF__
