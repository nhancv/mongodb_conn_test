
## Install

```
yarn install
```

### Setup

```
cp env_sample .env

=> Update MONGODB_URL

Example:
MONGODB_URL=mongodb://{user}:{pass}@localhost:27017/{db_name}?directConnection=true
```

### Run

```
node -e "require('./mongodb.js').connect()"
```

### Setup SSH Tunnel to connect AWS via Bastion host

- To active tunnel:

```
ssh -fNL <local_db_port>:<remote_db_server_host>:<remote_db_port> -i <bastion_ssh_key> ubuntu@<bastion_ip>
```

Example custom port 27018 to avoid conflicting with default port:
 
```
ssh -fNL 27018:dev-aws-docdb-cluster.cluster-sidlxisy.us-east-1.docdb.amazonaws.com:27017 -i dev-key-bastion ubuntu@1.2.3.4
```

- To test mongodb connection in tunnel: https://www.mongodb.com/docs/v4.4/mongo/

```
mongo -u <user_name> localhost:<local_port>/<db_name>
=> Enter password: <user_pass>
```

Example:

```
mongo -u user_dev localhost:27018/db-dev
```

- To close tunnel

```
ps aux | grep ssh | grep <tunnel_local_port> | awk '{print $2}' | xargs kill
```

Example:
```
ps aux | grep ssh | grep 27018 | awk '{print $2}' | xargs kill
```
