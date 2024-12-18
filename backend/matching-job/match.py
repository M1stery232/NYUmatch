from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
import certifi
import requests
import dotenv
import os
import logging
import firebase_admin
from firebase_admin import auth
from firebase_admin import credentials
from flask_sock import Sock
import time
import openai


app = Flask(__name__)
cred = credentials.Certificate('nyumatch-1155c-firebase-adminsdk-26toc-eb5c159cad.json')  
firebase_admin.initialize_app(cred)


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


dotenv.load_dotenv()


client = MongoClient(os.getenv('MONGO_URI'), tlsCAFile=certifi.where())
db = client['nyumatch']


CORS(app, resources={r"*": {"origins": "*"}})

sock = Sock(app)


openai.api_key = os.getenv('OPENAI_API_KEY')

@app.route('/login', methods=['POST'])
def login():
    print("Received request to /login")
    print(f"Request method: {request.method}")
    print(f"Request headers: {request.headers}")

    try:
        data = request.json
        print(f"Received request data: {data}")

        token_id = data.get('tokenId')
        if not token_id:
            print("Token is missing")
            return jsonify({'error': 'Token is missing'}), 400


        try:
            decoded_token = auth.verify_id_token(token_id)
            email = decoded_token.get('email')
            print(f"User authenticated: {email}")
            user_data = db.users.find_one({'email': email})
            if user_data:
                try:
                    db.users.update_one(
                        {'email': email},
                        {'$set': decoded_token},
                    )
                    print(f"User {email} updated in MongoDB")
                    return jsonify({'message': 'User logged in successfully', 'user': decoded_token})
                except Exception as e:
                    print(f"MongoDB error: {e}")
                    return jsonify({'error': 'Database error occurred'}), 500
            else:
                try:
                    db.users.insert_one(
                    {**decoded_token, 'email': email}
                    )
                    return jsonify({'message': 'User not found', 'needsSignup': True, 'user': decoded_token}), 200  
                except Exception as e:
                    print(f"MongoDB error: {e}")
                    return jsonify({'error': 'Database error occurred'}), 500
        except Exception as e:
            print(f"Token verification error: {e}")
            return jsonify({'error': 'Invalid token'}), 401

    except Exception as e:
        print(f"Unexpected error: {e}")
        return jsonify({'error': 'An unexpected error occurred'}), 500

@app.route('/user', methods=['GET'])
def get_user():
    email = request.args.get('email') 
    if not email:
        return jsonify({'error': 'Email not provided'}), 400

    try:
        user_data = db.users.find_one({'email': email})
        if user_data:
            user_data['_id'] = str(user_data['_id'])  
            return jsonify(user_data), 200
        
        return jsonify({'error': 'User not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/signup', methods=['POST'])
def signup():
    data = request.json
    email = data.get('email')  
    major = data.get('major')
    residency = data.get('residency')  
    gender = data.get('gender')
    social_goal = data.get('socialGoal')
    personality_type = data.get('personalityType')  
    nationality = data.get('nationality')  
    something_about_me = data.get('somethingAboutMe')  

    try:
        db.users.update_one(
            {'email': email}, 
            {'$set': {
                'major': major,
                'residency': residency, 
                'gender': gender,
                'socialGoal': social_goal,
                'personalityType': personality_type,
                'nationality': nationality,  
                'somethingAboutMe': something_about_me,  
                'previousMatch': []  
            }},
            upsert=True
        )
        return jsonify({'message': 'User signed up successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/match', methods=['POST'])
def match():
    data = request.json
    email = data.get('email')
    match_type = data.get('matchType')  

    try:
        current_user = db.users.find_one({'email': email})
        if not current_user:
            return jsonify({'error': 'User not found'}), 404


        if current_user.get('currentMatch'):
            return jsonify({'error': 'User already has a match'}), 400


        filter_criteria = {
            'email': {
                '$ne': email,
                '$nin': current_user.get('previousMatch', [])
            },
            'socialGoal': current_user['socialGoal'],
            'currentMatch': None
        }


        candidates = list(db.users.find(filter_criteria))


        scored_candidates = []
        for candidate in candidates:
            score = 0
            if match_type == 'similar':
                if candidate['residency'] == current_user['residency']:
                    score += 1
                if candidate['personalityType'] == current_user['personalityType']:
                    score += 1
                if candidate['nationality'] == current_user['nationality']:
                    score += 1
            else:  # different
                if candidate['residency'] != current_user['residency']:
                    score += 1
                if candidate['personalityType'] != current_user['personalityType']:
                    score += 1
                if candidate['nationality'] != current_user['nationality']:
                    score += 1

            if score > 0:
                scored_candidates.append((candidate, score))

        if not scored_candidates:
            return jsonify({'error': 'No suitable matches found'}), 404

        matched_user = sorted(scored_candidates, key=lambda x: x[1], reverse=True)[0][0]


        explanation = generate_explanation(current_user, matched_user, match_type)


        db.users.update_one(
            {'email': email},
            {
                '$set': {'currentMatch': matched_user['email'], 'matchExplanation': explanation},
                '$addToSet': {'previousMatch': matched_user['email']}
            }
        )

        db.users.update_one(
            {'email': matched_user['email']},
            {
                '$set': {'currentMatch': email, 'matchExplanation': explanation},
                '$addToSet': {'previousMatch': email}
            }
        )

        return jsonify({
            'matchedUser': {
                'email': matched_user['email'],
                'name': matched_user['name'],
                'major': matched_user['major'],
                'somethingAboutMe': matched_user['somethingAboutMe'],
                'matchExplanation': explanation
            }
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

def generate_explanation(user1, user2, match_type):
    user1_profile = (
        f"User 1: {user1['name']}\n"
        f"- Residency: {user1['residency']}\n"
        f"- Nationality: {user1['nationality']}\n"
        f"- Personality Type: {user1['personalityType']}\n"
        f"- About Them: {user1['somethingAboutMe']}\n"
    )
    
    user2_profile = (
        f"User 2: {user2['name']}\n"
        f"- Residency: {user2['residency']}\n"
        f"- Nationality: {user2['nationality']}\n"
        f"- Personality Type: {user2['personalityType']}\n"
        f"- About Them: {user2['somethingAboutMe']}\n"
    )

    prompt = f"""As a matching expert, explain why these two NYU students would make great matches based on their profiles and their preference for matching with {match_type} people.

{user1_profile}
{user2_profile}

Please analyze their compatibility considering:
1. Their residency situations {user1['residency']} vs {user2['residency']}
2. Their cultural backgrounds ({user1['nationality']} and {user2['nationality']})
3. Their personality dynamics ({user1['personalityType']} and {user2['personalityType']})
4. Their personal descriptions

Generate a friendly, personalized explanation of why they would be great matches, highlighting their {match_type} qualities and how these qualities could lead to a meaningful connection. Keep the response concise but meaningful (2-3 sentences).
"""

    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": prompt}]
    )
    return response['choices'][0]['message']['content']
@app.route('/unmatch', methods=['POST'])
def unmatch():
    data = request.json
    email = data.get('email')

    try:

        current_user = db.users.find_one({'email': email})
        if not current_user:
            return jsonify({'error': 'User not found'}), 404


        matched_email = current_user.get('currentMatch')
        if not matched_email:
            return jsonify({'error': 'No current match found'}), 400


        db.users.update_one(
            {'email': email},
            {'$set': {
                'currentMatch': None,
                'matchExplanation': None
            }}
        )

        db.users.update_one(
            {'email': matched_email},
            {'$set': {
                'currentMatch': None,
                'matchExplanation': None
            }}
        )

        return jsonify({'message': 'Successfully unmatched'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500




if __name__ == "__main__":
    app.run(debug=True, port=5000)

