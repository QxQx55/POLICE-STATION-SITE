from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin

db = SQLAlchemy()

class Role(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)

class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(150), unique=True, nullable=False)
    email = db.Column(db.String(150), unique=True, nullable=False)
    password = db.Column(db.String(150), nullable=False)
    role_id = db.Column(db.Integer, db.ForeignKey('role.id'), nullable=False)
    role = db.relationship('Role', backref=db.backref('users', lazy=True))

class Case(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    case_id = db.Column(db.String(50), unique=True, nullable=False)
    date_created = db.Column(db.DateTime, nullable=False)
    case_type = db.Column(db.String(100), nullable=False)
    status = db.Column(db.String(50), nullable=False, default='Open')
    assigned_officer_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)
    assigned_officer = db.relationship('User', backref=db.backref('cases', lazy=True))
    description = db.Column(db.Text, nullable=True)

class Complaint(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    complaint_id = db.Column(db.String(50), unique=True, nullable=False)
    citizen_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    citizen = db.relationship('User', foreign_keys=[citizen_id], backref=db.backref('complaints', lazy=True))
    description = db.Column(db.Text, nullable=False)
    status = db.Column(db.String(50), nullable=False, default='Pending')
    date_filed = db.Column(db.DateTime, nullable=False)
    assigned_officer_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)
    assigned_officer = db.relationship('User', foreign_keys=[assigned_officer_id], backref=db.backref('assigned_complaints', lazy=True))

class CriminalRecord(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(150), nullable=False)
    age = db.Column(db.Integer, nullable=True)
    address = db.Column(db.String(200), nullable=True)
    criminal_history = db.Column(db.Text, nullable=True)
    mugshot_url = db.Column(db.String(200), nullable=True)
    fingerprint_id = db.Column(db.String(100), nullable=True)
    linked_cases = db.relationship('Case', secondary='criminal_case_link', backref=db.backref('criminals', lazy=True))

# Association table for many-to-many between CriminalRecord and Case
criminal_case_link = db.Table('criminal_case_link',
    db.Column('criminal_id', db.Integer, db.ForeignKey('criminal_record.id'), primary_key=True),
    db.Column('case_id', db.Integer, db.ForeignKey('case.id'), primary_key=True)
)