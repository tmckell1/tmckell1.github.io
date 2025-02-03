const express = require('express');
const axios = require('axios');
const { DefaultAzureCredential } = require('@azure/identity');
const { SecretClient } = require('@azure/keyvault-secrets');
const app = express();
const port = 3000;

const keyVaultName = 'da-pcc-kv-prod';
const keyVaultUrl = `https://${keyVaultName}.vault.azure.net`;
const clientIdSecretName = 'DataAnalytics-PCC-Secret';
const clientSecretSecretName = 'DataAnalytics-PCC-ClientId';

const credential = new DefaultAzureCredential();
const client = new SecretClient(keyVaultUrl, credential);

async function getSecret(secretName) {
    const secret = await client.getSecret(secretName);
    return secret.value;
}

app.get('/getAccessToken', async (req, res) => {
    try {
        const clientId = await getSecret(clientIdSecretName);
        const clientSecret = await getSecret(clientSecretSecretName);
        const tenantId = '61e6eeb3-5fd7-4aaa-ae3c-61e8deb09b79';
        const scope = 'https://analysis.windows.net/powerbi/api/.default';

        const response = await axios.post(`https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`, null, {
            params: {
                grant_type: 'client_credentials',
                client_id: clientId,
                client_secret: clientSecret,
                scope: scope
            }
        });
        res.json({ accessToken: response.data.access_token });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});