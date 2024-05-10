import API from "./index";
import { serverConfig } from "../config/server-config";



// Define the expected response structure for the registration API call
interface Response {
  status: "SUCCESS" | "ERROR";
  data?: any;
  error?: any;
  message?: any
}

// Set the base URL for the app server using the configuration
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL_VERIFY;

/**
 * Function to register a user
 * @param data - The data to be sent in the registration request
 * @param callback - Callback function to handle the registration response
 */
const verifyCertificate = (data: any, callback: (response: Response) => void) => {
  API({
    method: "POST",
    url: `${BASE_URL}/api/verify-decrypt`, // Append the endpoint to the base URL
    data: {
      encryptedData: data.qValue,
      iv: data.ivValue,
    },
  })
    .then((response) => {
      callback({ status: "SUCCESS", data: response.data });
    })
    .catch((error) => {
      callback({ status: "ERROR", error: error });
    });
};

const verifyCertificatePDF = (data: any, callback: (response: Response) => void) => {
  API({
    method: "POST",
    url: `${BASE_URL}/api/verify`, // Append the endpoint to the base URL
    data:data,
  })
    .then((response) => {
      callback({ status: "SUCCESS", data: response.data });
    })
    .catch((error) => {
      callback({ status: "ERROR", error: error });
    });
};




const certificate = {
  verifyCertificate,
  verifyCertificatePDF
}
// Export the register function as the default export for this module
export default certificate;
