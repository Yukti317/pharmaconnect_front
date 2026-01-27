import axios from 'axios';


// const BASE_URL = "http://localhost:5000/api";
const BASE_URL = "https://pharmaconnect-backend-ywps.onrender.com/api" ;

const service = axios.create({
  baseURL: BASE_URL,
});

// Common error handler
const handleError = (error) => {
  if (error.message === 'Network Error') {
    alert('Server is not responding. Please try again later.');
  }
  return error.response || { data: { message: 'Unknown error occurred' } };
};

// Create (POST)
//  "Authorization": "Bearer " + localStorage.getItem("token") //pass this in header
export const createData = async (method, path, payload, headers) => {
  console.log("header",headers)
  try {
    const response = await service.post(
      path,
      payload,
      headers ? headers : " ", 
    );
    return response;
  } catch (error) {
    console.log('axiosApiCall-----==', error);
    if (error.message === 'Network Error') {
      console.log(`${error}, Server is not responding, please try again after some time`);
    }
    if (error.response?.data?.statusCode === 401 && header && !header['access-token']) {
      if (error.response.data.refresh_expire) {
        return error.response;
      }
    } else {
      return error.response;
    }
  }
};

// Read (GET)
export const readData = async (path, options = {}) => {
  try {
    const response = await service.get(path,{ ...options} );
    return response.data;
  } catch (error) {
    console.log("errrr", error)
    return handleError(error);
  }
};

// Update (PUT or PATCH)
export const updateData = async (path, data, header) => {
  console.log("path",path)
  try {
    const response = await service.put(path, data,  header ? header : " ", );
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

// Delete (DELETE)
export const deleteData = async (path, headers ) => {
  try {
    const response = await service.delete(path, headers ? headers : "");
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};
