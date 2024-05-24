import { useState } from "react"

export default function LoginForm() {
  const [error, setError] = useState({})
  const [loading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const validateForm = () => {
    let updatedError = {};
    if (!password || !email) {
      updatedError = { ...updatedError, error: "Please enter a email and password" };
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      updatedError = { ...updatedError, emailError: "Please enter a valid email address" };
    }
    // Regex pattern for password validation (at least 8 characters, at least one uppercase letter, one lowercase letter, and one digit)
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(password)) {
      updatedError = { ...updatedError, passwordError: "Password must be at least 8 characters long and must contain at least one capital letter and one digit: ex4Mpl3aa" };
    }
    if (Object.keys(updatedError).length > 0) {
      setError(updatedError);
      return false;
    }
    return true;
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    setIsLoading(true); // Mostrar animación de espera

    if (!validateForm()) {
      setIsLoading(false); // Ocultar animación de espera
      return;
    }
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      }).then((response) => {
        //response.redirected ? window.location.href = response.url : console.log(response);
        return response.json();
      });
      if (response.error) {
        setError({ error: response.error });
        setIsLoading(false); // Ocultar animación de espera
        return error;
      } else {
        document.cookie = `token=${response.token}; path=/admin; max-age=${3 * 60 * 60}`;
        document.cookie = `user_id=${response.id}; path=/admin; max-age=${3 * 60 * 60}`;
        window.location.href = `/admin/${response.id}`;
      }
      console.log(response);

    } catch (error) {
      setError({ error: error.message });
    }

    setIsLoading(false); // Ocultar animación de espera
  };

  return (
    <form onSubmit={handleLogin} className="w-full 2xl:w-1/2 mb-0 mt-8 space-y-4">
      <div className="w-full">
        <label htmlFor="email" className="sr-only">Email</label>

        <div className="relative">
          <input
            id="email"
            name="email"
            type="email"
            className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
            placeholder="Enter email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <span
            className="absolute inset-y-0 end-0 grid place-content-center px-4 text-gray-500"
          >
            <i className="bi bi-key-fill"></i>
          </span>
        </div>
        {error.passwordError && <p className="text-red-500 text-xs mt-1 ml-2">{error.passwordError}</p>}
      </div>
      {error.error && <p className="text-red-500 text-xs mt-1 ml-2">{error.error}</p>}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          No account?
          <a className="underline" href="register">Sign up</a>
        </p>

        <button
          type="submit"
          className="flex rounded-lg bg-orange-500 px-5 py-3 text-sm font-medium text-white"
        >
          {loading === true ? <div className="w-5 h-5 mx-5 border-2 border-t-white border-b-white border-l-white border-r-transparent rounded-full animate-spin animate animate-ease-in-out"></div> : "Sign in"}
        </button>
      </div>
    </form>
  )
}