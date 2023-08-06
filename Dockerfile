# Install the base requirements for the app.
# This stage is to support development.
FROM node:12.22.7

RUN apt update && apt -y install python sqlite3
RUN npm i -g @sap/cds-dk


COPY entrypoint.sh entrypoint.sh
RUN chmod 777 /entrypoint.sh

EXPOSE 4004
EXPOSE 80

#WORKDIR /app
#COPY poolcheck .
#RUN npm install

CMD ["/entrypoint.sh"]