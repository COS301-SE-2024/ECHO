import os

from azure.cosmos import CosmosClient, PartitionKey
import azure.cosmos.exceptions as exceptions

CONNECTION_STRING = os.environ.get("PRIMARY_CONNECTION_STRING")
ENDPOINT = os.environ.get("COSMOS_ENDPOINT")
KEY = os.environ.get("COSMOS_KEY")

DATABASE_ID = "echo-music"
CONTAINER_ID = "music-store"
RECOMMENDATIONS_ID = "music-recommendations"

client = CosmosClient.from_connection_string(conn_str=CONNECTION_STRING)


def create_database():
    try:
        database = client.create_database_if_not_exists(id=DATABASE_ID)
        return database.client_connection()
    except exceptions.CosmosHttpResponseError:
        print("Request to the Azure Cosmos database service failed.")


def get_database():
    try:
        database = client.get_database_client(DATABASE_ID)
        database.read()
        return database

    except exceptions.CosmosResourceNotFoundError:
        print('A database with id \'{0}\' does not exist'.format(id))


def list_containers(database):
    for container in database.list_containers():
        return container
    

def get_container(database):
    try:
        container = database.get_container_client(CONTAINER_ID)
        container.read()
        return container

    except exceptions.CosmosResourceNotFoundError:
        print('A container with id \'{0}\' does not exist'.format(id))


def get_recommendations_container(database):
    try:
        container = database.get_container_client(RECOMMENDATIONS_ID)
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


def store_song(song):
    print("storing")
    database = get_database()
    print(database)
    container = get_container(database)
    print(container)

    container.create_item(body=song)
    print("song stored")


def store_recommendations(songs):
    database = get_database()
    container = get_recommendations_container(database)

    existing_song = check_recommendations(songs['URI'])
    if existing_song:
        return
    else:
        container.create_item(body=songs)


def read_all(container):
    item_list = list(container.read_all_items(max_item_count=10))
    return item_list


def read_from_cluster(cluster_number):
    database = create_database()
    container = get_container(database)

    query = f"SELECT * FROM c WHERE c['ClusterNumber'] = {cluster_number}"
    item_list = list(container.query_items(query=query, enable_cross_partition_query=True))

    return item_list
    

def check_id(song_id):
    database = get_database()
    container = get_container(database)

    query = f"SELECT * FROM c WHERE c['URI'] = '{song_id}'"
    item_list = list(container.query_items(query=query, enable_cross_partition_query=True))

    if item_list:
        return item_list[0]
    else:
        return None
    

def check_recommendations(song_id):
    database = get_database()
    container = get_recommendations_container(database)

    query = f"SELECT * FROM c WHERE c['URI'] = '{song_id}'"
    item_list = list(container.query_items(query=query, enable_cross_partition_query=True))

    if item_list:
        return item_list[0]
    else:
        return None


def get_songs_by_sentiment(sentiment):
    try:
        # Get the database and container clients
        database = get_database()
        container = get_container(database)

        # Define the query to fetch items with the requested sentiment
        query = f"SELECT * FROM c WHERE c.Emotion = '{sentiment}'"
        
        # Query the container for matching items
        items = list(container.query_items(query=query, enable_cross_partition_query=True))

        return items

    except exceptions.CosmosHttpResponseError as e:
        print(f"Error reading from Cosmos DB: {str(e)}")
        return None
    
