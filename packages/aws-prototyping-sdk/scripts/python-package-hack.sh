#!/bin/bash

# This is need until https://github.com/aws/jsii/issues/3408 is resolved
cd dist/python
FILE=$(ls *.tar.gz | awk '{split($0,a,".tar.gz"); print a[1]}')
gunzip $FILE.tar.gz
tar -xvf $FILE.tar
rm $FILE.tar
cd $FILE/src/aws_prototyping_sdk
awk '{sub("from . import pdk_projen","")}1' __init__.py > temp.txt && mv temp.txt __init__.py
cd ../../..
tar -cf $FILE.tar $FILE
rm -rf $FILE
gzip $FILE.tar