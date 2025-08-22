#!/bin/bash

# Ask for container ID
read -p "Enter your container ID: " container_id

# Enter psql and run `\l` to show all databases
docker exec -it "$container_id" psql -U postgres -c "\dt"
