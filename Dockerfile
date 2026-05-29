FROM python:3.12.1

# docker will not re-pip install if requirements.txt doesn't change
WORKDIR /code
ADD ./requirements.txt /code/requirements.txt
RUN pip install -r requirements.txt

ADD . /code

ADD test.htm /tmp/test.htm
ADD test.js /tmp/test.js

CMD ["python", "server.py"]

