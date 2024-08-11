import json
import os
import sys
import uuid

import dotenv

from azure.core.exceptions import AzureError
from azure.cosmos import CosmosClient, PartitionKey
import azure.cosmos.exceptions as exceptions
from azure.cosmos import ThroughputProperties

dotenv.load_dotenv()

CONNECTION_STRING = os.getenv("PRIMARY_CONNECTION_STRING")
ENDPOINT = os.environ.get("COSMOS_ENDPOINT")
KEY = os.environ.get("COSMOS_KEY")

DATABASE_ID = "echo-music"
CONTAINER_ID = "song-data"

client = CosmosClient.from_connection_string(conn_str=CONNECTION_STRING)


def create_database():
    try:
        database = client.create_database_if_not_exists(id=DATABASE_ID)
        print("Database created or returned: " + DATABASE_ID)
        return database
    except exceptions.CosmosHttpResponseError:
        print("Request to the Azure Cosmos database service failed.")


def list_containers(database):
    for container in database.list_containers():
        print(f'Container name: {container["id"]}')
        return container
    

def get_container(database):
    try:
        container = database.get_container_client("music-data")
        container.read()
        print('Container with id \'{0}\' was found, it\'s link is {1}'.format(container.id, container.container_link))
        return container

    except exceptions.CosmosResourceNotFoundError:
        print('A container with id \'{0}\' does not exist'.format(id))


def create_container(database):
    try:
        partition_key_path = PartitionKey(path="/TrackID")
        container = database.create_container_if_not_exists(
            id=CONTAINER_ID,
            partition_key=partition_key_path,
            offer_throughput=400,
        )
        print(f"Container created or returned: {container.id}")
        return container

    except exceptions.CosmosHttpResponseError:
        print("Request to the Azure Cosmos database service failed.")


def store_song(container, song):
    print("Storing song...")
    container.create_item(body=song)
    print("Song stored successfully.")


def read_all(container):
    print("Reading items...")
    item_list = list(container.read_all_items(max_item_count=10))
    print('Found {0} items'.format(item_list.__len__()))

    for doc in item_list:
        print('Track Id: {0}'.format(doc.get('Song Name')))

