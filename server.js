const express = require('express');
const { exec } = require('child_process');
const app = express();
const port = 3000;

// Permite recibir datos en formato JSON y URL encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Servir archivos estáticos desde la carpeta "public"
app.use(express.static('public'));

// Endpoint de AWS local
const awsEndpoint = process.env.AWS_ENDPOINT || "http://localhost:4566";

// Crear Secret Manager
app.post('/create-secret', (req, res) => {
  const command = `aws --endpoint-url=${awsEndpoint} secretsmanager create-secret --name mi-secreto-local --secret-string "{}"`;
  exec(command, (error, stdout, stderr) => {
    if (error) return res.status(500).send(stderr);
    res.send(stdout);
  });
});

// Crear Bucket S3
app.post('/create-bucket', (req, res) => {
  const command = `aws --endpoint-url=${awsEndpoint} s3 mb s3://mi-bucket-local`;
  exec(command, (error, stdout, stderr) => {
    if (error) return res.status(500).send(stderr);
    res.send(stdout);
  });
});

// Crear el archivo jwks.json en el Bucket S3
app.post('/create-jwks', (req, res) => {
  const command = `echo '{"keys": []}' | aws --endpoint-url=${awsEndpoint} s3 cp - s3://mi-bucket-local/jwks.json`;
  exec(command, { shell: '/bin/bash' }, (error, stdout, stderr) => {
    if (error) return res.status(500).send(stderr);
    res.send("JWKS creado:" + (stdout ? "\n" + stdout : ""));
  });
});

// Listar secrets
app.get('/list-secrets', (req, res) => {
  const command = `aws --endpoint-url=${awsEndpoint} secretsmanager list-secrets`;
  exec(command, (error, stdout, stderr) => {
    if (error) return res.status(500).send(stderr);
    res.send(stdout);
  });
});

// Listar contenidos del Bucket S3
app.get('/list-bucket', (req, res) => {
  const command = `aws --endpoint-url=${awsEndpoint} s3 ls s3://mi-bucket-local`;
  exec(command, (error, stdout, stderr) => {
    if (error) return res.status(500).send(stderr);
    res.send(stdout);
  });
});

// Obtener el valor del secreto
app.get('/get-secret', (req, res) => {
  const command = `aws --endpoint-url=${awsEndpoint} secretsmanager get-secret-value --secret-id mi-secreto-local`;
  exec(command, (error, stdout, stderr) => {
    if (error) return res.status(500).send(stderr);
    res.send(stdout);
  });
});

// Ver el contenido de una llave pública PEM (requiere el valor de variable)
app.get('/view-pem', (req, res) => {
  const variable = req.query.variable;
  if (!variable) return res.status(400).send("El parámetro 'variable' es requerido.");
  const command = `aws --endpoint-url=${awsEndpoint} s3 cp s3://mi-bucket-local/public_key_jwt_${variable}.pem -`;
  exec(command, (error, stdout, stderr) => {
    if (error) return res.status(500).send(stderr);
    res.send(stdout);
  });
});

// Ver el contenido del llavero JWKS
app.get('/view-jwks', (req, res) => {
  const command = `aws --endpoint-url=${awsEndpoint} s3 cp s3://mi-bucket-local/jwks.json -`;
  exec(command, (error, stdout, stderr) => {
    if (error) return res.status(500).send(stderr);
    res.send(stdout);
  });
});

// Borrar un recurso del bucket S3 (requiere el valor de variable)
app.delete('/delete-resource', (req, res) => {
  const variable = req.query.variable;
  if (!variable) return res.status(400).send("El parámetro 'variable' es requerido.");
  const command = `aws --endpoint-url=${awsEndpoint} s3 rm s3://mi-bucket-local/public_key_jwt_${variable}.pem`;
  exec(command, (error, stdout, stderr) => {
    if (error) return res.status(500).send(stderr);
    res.send(stdout);
  });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});