
## Personal notes
---
sudo yum update

sudo yum install git

~~sudo yum install -y https://dl.fedoraproject.org/pub/epel/epel-release-latest-7.noarch.rpm~~

~~sudo yum-config-manager --enable epel~~

~~sudo yum install nodejs --enablerepo=epel-testing~~

curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash

. ~/.nvm/nvm.sh

nvm install node


npm i -g pm2

create a folder in the root called encryption and put the 2 pem files for SSL in the folder, it is accessed by app.js

pm2 start peerjs -- --port 3001 --sslkey path/to/key --sslcert path/to/cert

pm2 start app.js

pm2 startup


# Other points

## Port forwarding 

iptables -t nat -A PREROUTING -i eth0 -p tcp --dport 80 -j REDIRECT --to-port 8080

iptables -t nat -A PREROUTING -i eth0 -p tcp --dport 443 -j REDIRECT --to-port 3000

## Self signed SSL certs

openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365
