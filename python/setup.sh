#!/bin/zsh

# Install dependencies through `conda`
# conda env create -f environment.yml
# conda activate ./env

# Install dependencies through `pip`
venv ./env
source ./env
pip install -r requirements.txt
