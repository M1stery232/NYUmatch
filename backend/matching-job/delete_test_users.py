from pymongo import MongoClient
import os
import dotenv
import certifi
dotenv.load_dotenv()


client = MongoClient(os.getenv('MONGO_URI'), tlsCAFile=certifi.where())
db = client['nyumatch']


def delete_test_users():
    try:

        result = db.users.delete_many({"email": {"$regex": "^test_user_"}})
        print(f"Deleted {result.deleted_count} test users.")

        update_result = db.users.update_one(
            {"email": "wc2182@nyu.edu"},
            {"$set": {"previousMatch": []}}
        )
        if update_result.modified_count > 0:
            print("Successfully cleared previousMatch array for wc2182@nyu.edu")
        else:
            print("No changes made to wc2182@nyu.edu (user might not exist or array was already empty)")
            
    except Exception as e:
        print(f"Error: {str(e)}")

if __name__ == "__main__":
    delete_test_users() 