import { Client } from 'appwrite';

const client = new Client();

client
	.setEndpoint('https://cloud.appwrite.io/v1')
	.setProject('656e75ec8f87850c12b6');

export default client;
