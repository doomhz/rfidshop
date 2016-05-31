#! /usr/bin/env bash

# fix permission issues when tmp or .npm folders belongs to root
sudo chown -R $USER:$GROUP ~/tmp
sudo chown -R $USER:$GROUP ~/.npm


echo -e "\n--- Setting default user locale en_US.UTF-8 ---\n"
grep -q -F 'export LC_CTYPE=en_US.UTF-8' ~/.bashrc || echo 'export LC_CTYPE=en_US.UTF-8' >> ~/.bashrc
grep -q -F 'cd /vagrant' ~/.bashrc || echo 'cd /vagrant' >> ~/.bashrc
cd /vagrant


echo -e "\n--- Installing npm modules ---\n"
npm install > /dev/null 2>&1


echo -e "\n--- Creating databases ---\n"
mysql -uroot -e "CREATE DATABASE rfidshop_dev" > /dev/null 2>&1
mysql -uroot -e "CREATE DATABASE rfidshop_test" > /dev/null 2>&1


echo -e "\n--- Copying config file and creating tables ---\n"
cp config.json.sample config.json
cake db:create_tables
