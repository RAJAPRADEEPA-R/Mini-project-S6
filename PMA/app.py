import firebase_admin
from firebase_admin import credentials, firestore
from flask import Flask, render_template, request, jsonify

# Connect to Firebase
cred = credentials.Certificate("firebase-key.json")
firebase_admin.initialize_app(cred)

db = firestore.client()
print("✅ Connected to Firestore successfully!")

# Flask app
app = Flask(__name__)

# Home page
@app.route('/')
def home():
    return render_template('index.html')


# -----------------------------
# ADD STUDENT
# -----------------------------
@app.route('/addStudent', methods=['POST'])
def add_student():
    data = request.get_json()

    if not data:
        return jsonify({"error": "No JSON data received"}), 400

    student = {
        "name": data.get("name"),
        "roll_no": data.get("roll_no"),
        "class": data.get("class"),
        "section": data.get("section")
    }

    db.collection('students').add(student)

    return jsonify({"message": "Student added successfully"})


# -----------------------------
# GET ALL STUDENTS
# -----------------------------
@app.route('/students', methods=['GET'])
def get_students():
    students = db.collection('students').stream()

    student_list = []

    for student in students:
        student_data = student.to_dict()
        student_data["id"] = student.id   # important for update/delete
        student_list.append(student_data)

    return jsonify(student_list)


# -----------------------------
# UPDATE STUDENT
# -----------------------------
@app.route('/updateStudent/<doc_id>', methods=['PUT'])
def update_student(doc_id):
    data = request.get_json()

    if not data:
        return jsonify({"error": "No JSON data received"}), 400

    db.collection('students').document(doc_id).update({
        "name": data.get("name"),
        "class": data.get("class")
    })

    return jsonify({"message": "Student updated successfully"})


# -----------------------------
# DELETE STUDENT
# -----------------------------
@app.route('/deleteStudent/<doc_id>', methods=['DELETE'])
def delete_student(doc_id):

    db.collection('students').document(doc_id).delete()

    return jsonify({"message": "Student deleted successfully"})


# Run server
if __name__ == "__main__":
    app.run(debug=True)