FROM tiangolo/meinheld-gunicorn-flask:python3.7 
# this is debian based

# setup
USER root

# install some extra apps
RUN apt-get update; apt-get install -y wget openssh-server nano sudo telnet traceroute

# Add account and set password
RUN useradd elims
RUN echo 'elims:Elims2019!' | chpasswd
RUN gpasswd -a elims sudo

# enable ssh
RUN sed -i 's/PermitRootLogin prohibit-password/PermitRootLogin yes/' /etc/ssh/sshd_config
ENV NOTVISIBLE "in users profile"
RUN echo "export VISIBLE=now" >> /etc/profile

# pip
COPY requirements.txt /tmp/requirements.txt
RUN pip install -U pip
RUN pip install -r /tmp/requirements.txt

# shell scripts and permissions
COPY ./entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

COPY ./start.sh /start.sh
RUN chmod +x /start.sh

# RUN chmod +x /app/startApp.sh

# Setup application
COPY . /app
WORKDIR /app/
ENV PYTHONPATH=/app

# SSH and gunicorn server
EXPOSE 22 5000

# Bootstrapper?
ENTRYPOINT ["/entrypoint.sh"]

# start ssh and gunicorn
CMD ["/start.sh"]

# docker run -l -t -p 5000:5000 cv-api


