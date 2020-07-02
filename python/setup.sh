#!/bin/zsh

# Install dependencies through `conda`
# conda env create -f environment.yml
# conda activate ./env

# Install dependencies through `pip`
virtualenv env
source ./env
# pip install -r requirements.txt
# Install line by line, ignoring versions, because some packages I installed through `conda` are not available on `pip`:
cat requirements.txt | sed 's/[= ].*//' | xargs -n 1 pip install
