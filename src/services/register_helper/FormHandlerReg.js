import axios from "axios";

const handleRegisterForm = async (formData) => {
  try {
    const API_URL = "http://localhost:5001/register";
    const response = await axios.post(API_URL, formData);

    if (response.status >= 200 && response.status < 300) {
      // Success message
      console.log(response.data);
      localStorage.setItem("token", response.data.token);
      // console.log("token:", response.data.token);
      return [response.data.status, response.data.message];
    } else {
      return [
        response.data.status,
        response.data.message || "An error occurred. Please try again.",
      ];
    }
  } catch (err) {
    // If the request fails or any other error happens
    console.error("Error: ", err);
    return [
      500,
      err.response
        ? err.response.data.message
        : "Error registering. Please try again.",
    ];
  }
};

export default handleRegisterForm;
