# pull the latest node Docker image
FROM node:latest

# expose port number 3000 from Docker container to localhost
EXPOSE 3000

# set the working directory of the project
WORKDIR /project

# copy source code to the container
COPY ./applications/project .

# install necessary packages
RUN npm install && npm install react-scripts

# start the application/development server
CMD ["npm", "start"]
