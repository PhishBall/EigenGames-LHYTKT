require('dotenv').config();
const pinataSDK = require("@pinata/sdk");
const { ethers, AbiCoder } = require('ethers');

var pinataApiKey='';
var pinataSecretApiKey='';
var rpcBaseAddress='';
var privateKey='';



function init() {
  pinataApiKey = process.env.PINATA_API_KEY;
  pinataSecretApiKey = process.env.PINATA_SECRET_API_KEY;
  rpcBaseAddress = process.env.OTHENTIC_CLIENT_RPC_ADDRESS;
  privateKey = process.env.PRIVATE_KEY_PERFORMER;
}

async function sendTask(proofOfTask, data, taskDefinitionId) {

  var wallet = new ethers.Wallet(privateKey);
  var performerAddress = wallet.address;

  data = ethers.hexlify(ethers.toUtf8Bytes(data));
  const message = ethers.AbiCoder.defaultAbiCoder().encode(["string", "bytes", "address", "uint16"], [proofOfTask, data, performerAddress, taskDefinitionId]);
  const messageHash = ethers.keccak256(message);
  const sig = wallet.signingKey.sign(messageHash).serialized;

  const jsonRpcBody = {
    jsonrpc: "2.0",
    method: "sendTask",
    params: [
      proofOfTask,
      data,
      taskDefinitionId,
      performerAddress,
      sig,
    ]
  };
    try {
      const provider = new ethers.JsonRpcProvider(rpcBaseAddress);
      const response = await provider.send(jsonRpcBody.method, jsonRpcBody.params);
      console.log("API response:", response);
  } catch (error) {
      console.error("Error making API request:", error);
  }
}

async function publishJSONToIpfs(data) {
  var proofOfTask = '';
  try {   
    const pinata = new pinataSDK(pinataApiKey, pinataSecretApiKey);
    const response = await pinata.pinJSONToIPFS(data);
    proofOfTask = response.IpfsHash;
    console.log(`proofOfTask: ${proofOfTask}`);
  }
  catch (error) {  
    console.error("Error making API request to pinataSDK:", error);
  }
  return proofOfTask;
}

async function getIPfsTaskByCity(city) {
  try {
    // Fetch the task result from IPFS using the city name as the key
    const taskResult = await pinata.pinList({
      metadata: { name: city },
    });

    if (taskResult.rows.length === 0) {
      throw new Error(`No task found for city: ${city}`);
    }

    const cid = taskResult.rows[0].ipfs_pin_hash;
    const data = await pinata.pinJSONToIPFS(cid);
    return data;
  } catch (error) {
    console.error("Error fetching task from IPFS:", error);
    throw error;
  }
}

module.exports = {
  init,
  publishJSONToIpfs,
  sendTask,
  getIPfsTaskByCity, // Export the new function
};