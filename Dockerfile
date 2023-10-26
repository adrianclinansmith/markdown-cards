FROM node:21-alpine

COPY public 		/app/public/
COPY src 			/app/src/
COPY package.json 	/app/
COPY tsconfig.json 	/app/

WORKDIR /app

RUN npm install

CMD ["npm", "start"] 

# build image:		docker build --tag markdown-cards:1.0 .
# run container:    docker run -p 3000:3000 markdown-cards:1.0 
# run with shell:   docker run -it markdown-cards:1.0 sh