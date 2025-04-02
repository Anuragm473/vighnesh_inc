import { useState } from "react";
import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api";


const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: "", password: "" });
  
    const mutation = useMutation({
      mutationFn: registerUser,
      onSuccess: () => {
        navigate("/login");
      },
    });
  
    const handleSubmit = (e) => {
      e.preventDefault();
      mutation.mutate(formData);
    };
  
    return (
      <div className="flex flex-col items-center p-4">
        <h2 className="text-2xl">Register</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input className="border p-2" type="email" placeholder="Email" onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
          <input className="border p-2" type="password" placeholder="Password" onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
          <button className="bg-green-500 text-white px-4 py-2 rounded" type="submit">
            {mutation.isLoading ? "Registering..." : "Register"}
          </button>
        </form>
        <button className="mt-4 text-blue-500" onClick={() => navigate("/login")}>
          Already have an account? Login
        </button>
      </div>
    );
  };
  
  export { Register };