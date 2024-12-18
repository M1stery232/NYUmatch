from pymongo import MongoClient

def get_user_data():
    client = MongoClient('mongodb+srv://<username>:<password>@cluster0.mongodb.net/<dbname>?retryWrites=true&w=majority')
    db = client['nyumatch']
    return db['users'].find()
