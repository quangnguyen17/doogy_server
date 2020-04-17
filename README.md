# Doogy!

"A place where dog enthusiasts can be who they are and find thousands of dog pictures being fetched from a public API in which hosts one of the biggest collections of open source dog pictures."

## Links

- [Live Site](http://13.52.102.43/)
- [Repo](https://github.com/quangnguyen17/doogy_server)
- [Dog API](https://dog.ceo/dog-api/)
- Deployed using GitHub and [AWS](https://aws.amazon.com/).

## How to run the project locally

- Create a new project directory and clone repo to your computer: `git clone https://github.com/quangnguyen17/doogy_server.git`
- `cd` into repo folder
- `python3 -m venv venv` to create a virtual environment
- `pip install -r requirements.txt` to install all the requirements to run project.
- `python3 manage.py collectstatic`
- `python3 manage.py makemigrations`
- `python3 manage.py migrate`
- Finally, to start project, run this command: `python3 manage.py runserver` 
- Go to `http://localhost:8000/` on your browser and see the magic! :).
