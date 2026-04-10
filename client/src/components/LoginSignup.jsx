import React, { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, X } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { axiosInstance } from "../lib/axios";
import { GoogleLogin } from "@react-oauth/google";


const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Minimum 6 characters"),
});

const signupSchema = loginSchema.extend({
  firstName: z.string().min(2, "Required"),
  lastName: z.string().min(2, "Required"),
  phone: z.string().min(8, "Invalid phone"),
});

const Input = React.forwardRef(
  ({ label, type = "text", error, ...props }, ref) => (
    <div>
      <label className="mb-1 block text-xs text-black/60">
        {label}
      </label>

      <input
        ref={ref}
        type={type}
        {...props}
        className="w-full rounded-lg bg-white border border-black/20 px-4 py-3 text-sm outline-none focus:ring-1 focus:ring-black"
      />

      {error && (
        <p className="mt-1 text-xs text-red-500">
          {error.message}
        </p>
      )}
    </div>
  )
);

Input.displayName = "Input";


const LoginSignup = ({ onClose }) => {
  const [mode, setMode] = useState("login");
  const [showPassword, setShowPassword] = useState(false);

  const { signUp, login, isSigningUp, isLoggingIn } = useAuthStore();

  const schema = useMemo(
    () => (mode === "login" ? loginSchema : signupSchema),
    [mode]
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      if (mode === "login") {
        await login(data);
      } else {
        await signUp(data);
      }

      reset();
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md">
      
      {/* Modal */}
      <div className="relative w-full max-w-md rounded-xl bg-white border border-black/10 shadow-2xl px-6 py-6">
        
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 rounded-md hover:bg-black/5"
        >
          <X size={18} />
        </button>

        {/* Logo */}
        <h2 className="text-lg font-semibold text-black mb-6">
          {mode === "login" ? "Login to Kanvas.io" : "Create your Kanvas.io account"}
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          {mode === "signup" && (
            <>
              <Input
                label="First Name"
                {...register("firstName")}
                error={errors.firstName}
              />
              <Input
                label="Last Name"
                {...register("lastName")}
                error={errors.lastName}
              />
              <Input
                label="Phone"
                {...register("phone")}
                error={errors.phone}
              />
            </>
          )}

          <Input
            label="Email"
            {...register("email")}
            error={errors.email}
          />

          {/* Password */}
          <div className="relative">
            <Input
              label="Password"
              type={showPassword ? "text" : "password"}
              {...register("password")}
              error={errors.password}
            />

            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-9 text-black/50 hover:text-black"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {/* Forgot */}
          {mode === "login" && (
            <div className="text-sm">
              <button className="underline text-black/70 hover:text-black">
                Forgot password?
              </button>
            </div>
          )}

          {/* Submit */}
          <button
            disabled={isSigningUp || isLoggingIn}
            className="w-full rounded-lg bg-black py-3 text-sm font-medium text-white hover:bg-black/90 disabled:opacity-60"
          >
            {isSigningUp || isLoggingIn
              ? "Please wait..."
              : mode === "login"
              ? "Login"
              : "Create account"}
          </button>
        </form>

        {/* Switch */}
        <p className="mt-4 text-center text-sm text-black/70">
          {mode === "login"
            ? "Don't have an account?"
            : "Already have an account?"}{" "}
          <button
            onClick={() => {
              setMode(mode === "login" ? "signup" : "login");
              reset();
            }}
            className="underline font-medium text-black"
          >
            {mode === "login" ? "Sign up" : "Login"}
          </button>
        </p>

        {/* Divider */}
        <div className="my-5 flex items-center gap-3">
          <span className="h-px flex-1 bg-black/20" />
          <span className="text-xs text-black/40">OR</span>
          <span className="h-px flex-1 bg-black/20" />
        </div>

        {/* Google */}
        <GoogleLogin
          onSuccess={async (cred) => {
            try {
              const res = await axiosInstance.post("/auth/google", {
                token: cred.credential,
              });

              useAuthStore.setState({
                authUser: res.data.user,
              });

              onClose();
            } catch (err) {
              console.log("Google login failed", err);
            }
          }}
          onError={() => console.log("Google Login Failed")}
          theme="filled_black"
          size="large"
          width="100%"
        />
      </div>
    </div>
  );
};

export default LoginSignup;