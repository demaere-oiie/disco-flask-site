FROM python:3.12.1

# docker will not re-pip install if requirements.txt doesn't change
WORKDIR /code
ADD ./requirements.txt /code/requirements.txt
RUN pip install -r requirements.txt
RUN wget -q https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task

ADD . /code

ADD test.htm /tmp/test.htm
ADD test.js /tmp/test.js

CMD ["python", "server.py"]

