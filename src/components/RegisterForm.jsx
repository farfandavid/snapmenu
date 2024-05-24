import { useState } from "react";

export default function RegisterForm() {
  //const [username, setusername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [error, setError] = useState({});
  const [loading, setIsLoading] = useState(false);

  const validateForm = () => {
    let updatedError = {};
    if (!password || !email) {
      updatedError = { ...updatedError, error: "Please complete all fields" };
    }
    // Regex pattern for userName validation (alphanumeric characters only)
    /* const userNameRegex = /^[a-zA-Z0-9]{3,}$/;
    if (!userNameRegex.test(username)) {
      updatedError = { ...updatedError, userNameError: "userName must be at least 3 characters long and contain only alphanumeric characters: example123" };
    } */
    // Regex pattern for password validation (at least 8 characters, at least one uppercase letter, one lowercase letter, and one digit)
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,20}$/;
    if (!passwordRegex.test(password)) {
      updatedError = { ...updatedError, passwordError: "Password must be at least 8 characters long and must contain at least one capital letter and one digit: ex4Mpl3aa" };
    }
    // Check if the email is valid
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      updatedError = { ...updatedError, emailError: "Please enter a valid email address" };
    }
    if (password !== repeatPassword) {
      updatedError = { ...updatedError, repeatPasswordError: "Passwords do not match" };
    }
    if (Object.keys(updatedError).length > 0) {
      setError(updatedError);
      return false;
    }
    return true;
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    setIsLoading(true); // Mostrar animación de espera

    if (!validateForm()) {
      setIsLoading(false); // Ocultar animación de espera
      return;
    }

    /* try {
      const response = await fetch("http://localhost:4321/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      }).then((response) => {
        response.redirected ? window.location.href = response.url : console.log("error");
        return response.json();
      });
      document.cookie = `register=${response.user._id}; path=/login; max-age=3600`;
      window.location.href = `/login`;
      
    } catch (error) {
      setError({ error: error.message });
    } */

    setIsLoading(false); // Ocultar animación de espera
  };

  return (
    <form action="#" className="mx-auto mb-0 mt-8 max-w-md space-y-4" onSubmit={handleRegister}>
      {/*<div>
        <label htmlFor="username" className="sr-only">userName</label>
        <div className="relative">
          <input
            name="username"
            type="text"
            className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setusername(e.target.value)}
            id="username"
          />

          <span
            className="absolute inset-y-0 end-0 grid place-content-center px-4 text-gray-500"
          >
            <i className="bi bi-person-fill"></i>
          </span>
        </div>
        {error.usernameError && <p className="text-red-500 text-xs mt-1 ml-2">{error.usernameError}</p>}
  </div>*/}

      <div>
        <label htmlFor="email" className="sr-only">Email</label>

        <div className="relative">
          <input
            name="email"
            type="email"
            className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            id="email"
          />

          <span
            className="absolute inset-y-0 end-0 grid place-content-center px-4 text-gray-500"
          >
            <i className="bi bi-at"></i>
          </span>
        </div>
        {error.emailError && <p className="text-red-500 text-xs mt-1 ml-2">{error.emailError}</p>}
      </div>
      <div>
        <label htmlFor="password" className="sr-only">Password</label>

        <div className="relative">
          <input
            name="password"
            type="password"
            className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            id="password"
          />

          <span
            className="absolute inset-y-0 end-0 grid place-content-center px-4 text-gray-500"
          >
            <i className="bi bi-key-fill"></i>
          </span>
        </div>
        {error.passwordError && <p className="text-red-500 text-xs mt-1 ml-2">{error.passwordError}</p>}
      </div>
      <div>
        <label htmlFor="repeatpassword" className="sr-only">Password</label>

        <div className="relative">
          <input
            name="repeatpassword"
            type="password"
            className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
            placeholder="Repeat password"
            value={repeatPassword}
            onChange={(e) => setRepeatPassword(e.target.value)}
            id="repeatpassword"
          />

          <span
            className="absolute inset-y-0 end-0 grid place-content-center px-4 text-gray-500"
          >
            <i className="bi bi-key-fill"></i>
          </span>
        </div>
        {error.repeatPasswordError && <p className="text-red-500 text-xs mt-1 ml-2">{error.repeatPasswordError}</p>}
      </div>
      {error.error && <p className="text-red-500 text-xs mt-1 ml-2">{error.error}</p>}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Already have an account?
          <a className="underline" href="login">Sign in</a>
        </p>

        <button
          type="submit"
          className="flex rounded-lg bg-orange-500 px-5 py-3 text-sm font-medium text-white"
        >
          {loading === true ? <div className="w-5 h-5 mx-5 border-2 border-t-white border-b-white border-l-white border-r-transparent rounded-full animate-spin animate animate-ease-in-out"></div> : "Register"}
        </button>
      </div>
    </form>
  )
}
