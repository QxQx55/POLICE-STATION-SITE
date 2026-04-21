from flask import Flask, render_template, request, redirect, url_for, flash
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from werkzeug.security import generate_password_hash, check_password_hash
from models import db, Role, User, Case, Complaint, CriminalRecord
import os
from datetime import datetime

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key-here'  # Change this in production
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///police.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# Routes
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')
        user = User.query.filter_by(email=email).first()
        if user and check_password_hash(user.password, password):
            login_user(user)
            return redirect(url_for('dashboard'))
        flash('Invalid email or password')
    return render_template('login.html')

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form.get('username')
        email = request.form.get('email')
        password = request.form.get('password')
        role_name = request.form.get('role')
        role = Role.query.filter_by(name=role_name).first()
        if not role:
            flash('Invalid role')
            return redirect(url_for('register'))
        hashed_password = generate_password_hash(password, method='sha256')
        new_user = User(username=username, email=email, password=hashed_password, role=role)
        db.session.add(new_user)
        db.session.commit()
        flash('Registration successful')
        return redirect(url_for('login'))
    roles = Role.query.all()
    return render_template('register.html', roles=roles)

@app.route('/dashboard')
@login_required
def dashboard():
    if current_user.role.name in ['Police Officer', 'Investigator/Detective', 'Admin']:
        complaints = Complaint.query.filter_by(assigned_officer_id=current_user.id).all()
    else:
        complaints = current_user.complaints
    return render_template('dashboard.html', user=current_user, complaints=complaints)

@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('index'))

@app.route('/complaint', methods=['GET', 'POST'])
@login_required
def complaint():
    if request.method == 'POST':
        title = request.form.get('title')
        category = request.form.get('category')
        description = request.form.get('description')
        complaint_id = f"COMP-{datetime.now().strftime('%Y%m%d%H%M%S')}"
        new_complaint = Complaint(
            complaint_id=complaint_id,
            citizen_id=current_user.id,
            description=f"{title} - {category}: {description}",
            date_filed=datetime.now()
        )
        db.session.add(new_complaint)
        db.session.commit()
        flash('Complaint filed successfully')
        return redirect(url_for('dashboard'))
    return render_template('complaint.html')

@app.route('/cases')
@login_required
def cases():
    if current_user.role.name not in ['Police Officer', 'Investigator/Detective', 'Admin']:
        flash('Access denied')
        return redirect(url_for('dashboard'))
    cases = Case.query.filter_by(assigned_officer_id=current_user.id).all()
    return render_template('cases.html', cases=cases)

@app.route('/criminals')
@login_required
def criminals():
    if current_user.role.name not in ['Police Officer', 'Investigator/Detective', 'Admin']:
        flash('Access denied')
        return redirect(url_for('dashboard'))
    criminals = CriminalRecord.query.all()
    return render_template('criminals.html', criminals=criminals)

@app.route('/add_criminal', methods=['GET', 'POST'])
@login_required
def add_criminal():
    if current_user.role.name not in ['Police Officer', 'Investigator/Detective', 'Admin']:
        flash('Access denied')
        return redirect(url_for('dashboard'))
    if request.method == 'POST':
        name = request.form.get('name')
        age = request.form.get('age')
        address = request.form.get('address')
        criminal_history = request.form.get('criminal_history')
        mugshot_url = request.form.get('mugshot_url')
        fingerprint_id = request.form.get('fingerprint_id')
        new_criminal = CriminalRecord(
            name=name,
            age=age,
            address=address,
            criminal_history=criminal_history,
            mugshot_url=mugshot_url,
            fingerprint_id=fingerprint_id
        )
        db.session.add(new_criminal)
        db.session.commit()
        flash('Criminal record added successfully')
        return redirect(url_for('criminals'))
    return render_template('add_criminal.html')

@app.route('/contact')
def contact():
    return render_template('contact.html')

@app.route('/service')
def service():
    return render_template('service.html')

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        # Create roles if not exist
        if not Role.query.first():
            roles = ['Admin', 'Police Officer', 'Investigator/Detective', 'Reception/Front Desk', 'Forensic Staff']
            for role_name in roles:
                role = Role(name=role_name)
                db.session.add(role)
            db.session.commit()
    app.run(debug=True)