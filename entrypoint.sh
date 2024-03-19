#!/bin/sh

# Start MongoDB
mongod --replSet rs0 &

# Wait for MongoDB to be ready
until mongo --eval "printjson(rs.isMaster())" &> /dev/null; do
  echo "Waiting for MongoDB to be ready..."
  sleep 2
done

# Initiate replica set
mongo --eval "rs.initiate()"
