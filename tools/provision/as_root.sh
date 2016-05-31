#! /usr/bin/env bash

echo -e "\n--- Setting default root locale en_US.UTF-8 ---\n"
grep -q -F 'export LC_CTYPE=en_US.UTF-8' ~/.bashrc || echo 'export LC_CTYPE=en_US.UTF-8' >> ~/.bashrc


echo -e "\n--- Updating package list ---\n"
apt-get -qq update


echo -e "\n--- Installing node, npm ---\n"
curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash - > /dev/null 2>&1
apt-get -qq install nodejs build-essential > /dev/null 2>&1


echo -e "\n--- Installing node-pre-gyp and coffee-script ---\n"
npm install -g node-gyp node-pre-gyp webpack webpack-dev-server coffee-script > /dev/null 2>&1

echo -e "\n--- Installing mysql-server ---\n"
export DEBIAN_FRONTEND="noninteractive"
apt-get -qq install -y mysql-server > /dev/null 2>&1


echo -e "\n--- Clean up packages ---\n"
apt-get -qq autoremove > /dev/null 2>&1