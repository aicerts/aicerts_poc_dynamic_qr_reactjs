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
const BASE_URL = serverConfig.appServerUrl;

/**
 * Function to register a user
 * @param data - The data to be sent in the registration request
 * @param callback - Callback function to handle the registration response
 */
const register = (data: any, callback: (response: Response) => void) => {
  API({
    method: "POST",
    url: `${BASE_URL}/api/signup`,
    data: data,
  })
    .then((response) => {
      callback({ status: "SUCCESS", data: response.data });
    })
    .catch((error) => {
      callback({ status: "ERROR", error: error });
    });
};

const verifyOtp = (data: any, callback: (response: Response) => void) => {
  API({
    method: "POST",
    url: `${BASE_URL}/api/verify-issuer`,
    data: data,
  })
    .then((response) => {
      callback({ status: "SUCCESS", data: response.data });
    })
    .catch((error) => {
      callback({ status: "ERROR", error: error });
    });
};

const sendLink = (data: any, callback: (response: Response) => void) => {
  API({
    method: "POST",
    url: `${BASE_URL}/api/forgot-password`,
    data: {
      email:data
    },
  })
    .then((response) => {
      callback({ status: "SUCCESS", data: response.data });
    })
    .catch((error) => {
      callback({ status: "ERROR", error: error });
    });
};

const changePassword = (data: any, callback: (response: Response) => void) => {
  API({
    method: "POST",
    url: `${BASE_URL}/api/reset-password`,
    data: data,
  })
    .then((response) => {
      callback({ status: "SUCCESS", data: response.data });
    })
    .catch((error) => {
      callback({ status: "ERROR", error: error });
    });
};





const user = {
  register,
  verifyOtp,
  sendLink,
  changePassword
}
// Export the register function as the default export for this module
export default user;
