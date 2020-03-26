from functools import wraps
from flask import url_for, redirect, session


def requires_access_level(access_level):
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            if not session.get('email'):
                return redirect(url_for('users.login'))

            user = User.find_by_email(session['email'])
            elif not user.allowed(access_level):
                return redirect(url_for('users.profile', message="You do not have access to that page. Sorry!"))
            return f(*args, **kwargs)
        return decorated_function
    return decorator