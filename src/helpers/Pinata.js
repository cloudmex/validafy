const pinataSDK = require("@pinata/sdk");
export const pinata = pinataSDK(
  "8e2b2fe58bbbc6c45be1",
  "440d5cf3f57689b93028a75c6d71a4ef82c83ba00926ae61674859564fa357a8"
);

const start = async() =>{
await pinata.testAuthentication()
          .then((result) => {
            //handle successful authentication here
            console.log(result);
          })
          .catch((err) => {
            //handle error here
            console.log(err,"este es el error");
          });
        }
start();

export default pinata;