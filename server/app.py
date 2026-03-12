from flask import Flask, jsonify, request
from flask_cors import CORS
import math

app = Flask(__name__)
# Enable CORS for local development from React
CORS(app)

# In-memory mock leaderboard
leaderboard = [
    {"username": "CyberNinja", "score": 25000},
    {"username": "PuzzleMaster", "score": 18024},
    {"username": "Guest_8471", "score": 8412}
]

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "ok", "message": "NodeShift Server is running."})

@app.route('/api/leaderboard', methods=['GET'])
def get_leaderboard():
    # Sort by score descending and return top 10
    sorted_board = sorted(leaderboard, key=lambda x: x["score"], reverse=True)[:10]
    return jsonify({"leaderboard": sorted_board})

@app.route('/api/leaderboard', methods=['POST'])
def submit_score():
    data = request.json
    if not data or "username" not in data or "score" not in data:
        return jsonify({"error": "Missing username or score"}), 400
    
    score = int(data["score"])
    username = data["username"]
    
    leaderboard.append({"username": username, "score": score})
    
    return jsonify({
        "status": "success",
        "message": f"Score {score} submitted for {username}."
    }), 201

if __name__ == '__main__':
    # Run on port 5000
    app.run(debug=True, port=5000)
