#!/bin/zsh

# Install dependencies through `conda`
# conda env create -f environment.yml
# conda activate ./env

# Install dependencies through `pip`
python3 -m venv env
source env/bin/activate
# pip install -r requirements.txt
# Install line by line instead, ignoring versions, because some packages I installed through `conda` are not available on `pip`:
cat requirements.txt | sed 's/[= ].*//' | xargs -n 1 pip install

# Set script files executable
chmod +x start.sh
chmod +x debug.sh
chmod +x update-setup.sh
