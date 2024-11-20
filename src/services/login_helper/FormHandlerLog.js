import axios from "axios";

const handleLoginForm = async (email, password) => {
  try {
    const Api_Url = "http://localhost:5001/login";
    const response = await axios.post(Api_Url, {
      email,
      password,
    });

    if (response.data.status >= 200 && response.data.status < 300) {
      const token = response.data.token;
      localStorage.setItem("token", token);
      console.log("token:", token);
      return [response.data.status, response.data.message];
    } else {
      return [
        response.data.status,
        response.data.message || "An error occurred. Please try again.",
      ];
    }
  } catch (err) {
    console.error("Error: ", err);
    return [
      500,
      err.response
        ? err.response.data.message
        : "Error login. Please try again.",
    ];
  }
};

export default handleLoginForm;
