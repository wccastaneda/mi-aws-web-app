**Mi-app-aws-web-local**

Aplicación de node.js para interactuar a través de una interfaz web con recursos de localStack (herramienta de simulación de AWS en ambiente local)

*Instrucciones de inicio:*

Sobre la raíz de este mismo proyecto, abre una terminal y ejecuta el comando "docker-compose up --build". Importante que sea este comando y no el tradicional "docker-compose up", dado que docker necesita constuir primero la imagen de la app por medio de un Dockerfile antes de poder hacer el despliegue de los contenedores.