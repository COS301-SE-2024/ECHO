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
        return database
    except exceptions.CosmosHttpResponseError:
        print("Request to the Azure Cosmos database service failed.")


def list_containers(database):
    for container in database.list_containers():
        return container
    

def get_container(database):
    try:
        container = database.get_container_client("music-data")
        container.read()
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
        return container

    except exceptions.CosmosHttpResponseError:
        print("Request to the Azure Cosmos database service failed.")


def store_song(container, song):
    container.create_item(body=song)


def read_all(container):
    item_list = list(container.read_all_items(max_item_count=10))

    for doc in item_list:
        song_features = doc.get('Song Features', {})
        uri = song_features.get('uri')

    return item_list


def read_from_cluster(cluster_number):
    database = create_database()
    container = get_container(database)

    query = f"SELECT * FROM c WHERE c['Cluster Number'] = {cluster_number}"
    item_list = list(container.query_items(query=query, enable_cross_partition_query=True))

    return item_list


def in_database(uri):
    database = create_database()
    container = get_container(database)

    query = f"SELECT * FROM c WHERE c['Song Features'].uri = '{uri}'"
    item_list = list(container.query_items(query=query, enable_cross_partition_query=True))

    if item_list:
        return item_list[0]
    else:
        return None
    

def check_id(song_id):
    database = create_database()
    container = get_container(database)

    query = f"SELECT * FROM c WHERE c['Track ID'] = '{song_id}'"
    item_list = list(container.query_items(query=query, enable_cross_partition_query=True))

    if item_list:
        return item_list[0]
    else:
        return None


# database = create_database()
# container = get_container(database)
# read_all(container)