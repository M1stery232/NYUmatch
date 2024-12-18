from pymongo import MongoClient
import os
import dotenv
import random
import certifi

dotenv.load_dotenv()

# MongoDB configuration
client = MongoClient(os.getenv('MONGO_URI'), tlsCAFile=certifi.where())
db = client['nyumatch']

# Sample data for random generation
majors = ["Computer Science", "Business", "Engineering", "Arts", "Mathematics", "Biology"]
residencies = ["Jersey City", "Manhattan", "LIC", "Brooklyn"]
genders = ["Male", "Female"]
social_goals = ["Study Partner", "People with same hobbies", "Meet more people to hangout with"]
personality_types = ["Introvert", "Extrovert"]
nationalities = ["United States", "China", "India", "Korea (South)", "Japan", "Germany"]

# Function to generate a fake user
def create_fake_user(index):
    return {
        "email": f"test_user_{index}@nyu.edu",
        "name": f"Test User {index + 1}",
        "major": random.choice(majors),
        "residency": random.choice(residencies),
        "gender": random.choice(genders),
        "socialGoal": random.choice(social_goals),
        "personalityType": random.choice(personality_types),
        "nationality": random.choice(nationalities),
        "somethingAboutMe": f"I am test user {index + 1}",
        "currentMatch": None,
        "previousMatch": []
    }

# Add 20 fake users
def add_fake_users():
    for i in range(10):
        user = create_fake_user(i)
        try:
            # Use update_one with upsert to avoid duplicates
            db.users.update_one(
                {"email": user["email"]},
                {"$set": user},
                upsert=True
            )
            print(f"Added/Updated user: {user['email']}")
        except Exception as e:
            print(f"Error adding user {i}: {str(e)}")

if __name__ == "__main__":
    add_fake_users() 