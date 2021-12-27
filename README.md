# Social Method Setup
After creating a virtual environment open/run environment

### Windows:
  - `<venv_name>/scripts/activate` 

### Linux/Mac:
  - ` source <venv_name>/bin/activate`


Install necessary dependencies.
```
(venv)$ pip install -r requirements.txt 
```

# Migrations:  This must be done in order

1. Make migrations for the **user** and **newsfeed** app before anything else
```shell
(venv)$ python manage.py makemigrations user
(venv)$ python manage.py makemigrations newsfeed
```
2. Then apply migrations 

```
(venv)$ python manage.py migrate
```

---
# User creation
Create a user in the shell by simply running
```
(venv)$ python manage.py createsuperuser
```
---
# Warning:

This application uses Jupyter Notebook but the requirement.txt was created with Windows. If running on Mac/Linux
you may need to **delete** the following packages from requirements.txt.
  - pywin32
  - pywinpty
 ------------------
 # Testing 

1. Open one terminal to activate React app
```
$ cd frontend
$ npm start
```

1. While node is serving our React frontend, open a separate terminal, activate the same virtual environment as above and start django's test server with the folloming: *(see alternatives to 'settings' flag below)*
   ```
   (venv)$ python manage.py testserver test_user.json --settings social_method.settings.test` # test_user.json is a fixture (fixture is required for testserver)
   ```
   1. Another way of assigning the `settings` variable as opposed to using the CLI flag, is to export/set `DJANGO_SETTINGS_MODULE` variable with the value as `social_method.settings.test`
   2. A 3rd way, instead of declaring a variable in a shell/terminal (export variables are usually only available to that terminal/shell session) is to create a `.env` file in the **top level** (same level as manage.py) and place the settings inside like so: `DJANGO_SETTINGS_MODULE=social_method.settings.test`

2. While test server is running, to run the tests using the `pytest` library, open a seperate 3rd *(and final)* terminal, activate the virtual environment, and run the following command.
   ```
   (venv)$ pytest # this runs all tests
   ```

Flags (pytest):
  - *-x* means fail fast. ie `pytest -x` will exit the testing suite after the 1st failure
  - *-s* allows for print() to be displayed inside of tests 
  - *-k [test_name]* selects a specific test to run ie. `pytest -k test_submit-observation` 
  - ...Many more found here https://docs.pytest.org/en/6.2.x/usage.html