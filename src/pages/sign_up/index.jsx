import styles from "./signUp.module.scss";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { fetchRegister } from "../../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";

export const SignUp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
  });

  const onRegister = async (data) => {
    const result = await dispatch(fetchRegister(data));
    console.log(result);
    if ("serverError" in result.payload) {
      alert(result.payload.serverError.error);
    } else {
      alert("Registration successful!");
      navigate("/login");
    }
  };

  return (
    <div className={styles.users}>
      <div className={styles.users_box}>
        <h2>Register User</h2>
        <form onSubmit={handleSubmit(onRegister)} className={styles.form}>
          <p>{errors?.username?.message}</p>
          <input
            className={errors?.username ? styles.error : ""}
            {...register("username", {
              required: {
                value: true,
                message: "Username is required ",
              },
              minLength: {
                value: 2,
                message: "Username must be at least 2 characters long",
              },
              maxLength: {
                value: 20,
                message: "Username must be at most 20 characters long",
              },
              pattern: {
                value: /^[A-Za-z0-9_.@-]+$/,
                message: "Can only contain letters, numbers, and underscores",
              },
            })}
            placeholder="Username"
          />
          <p>{errors?.email?.message}</p>
          <input
            className={errors?.email ? styles.error : ""}
            placeholder="Email"
            {...register("email", {
              required: {
                value: true,
                message: "Email is required",
              },
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: "Invalid email address",
              },
            })}
          />
          <p>{errors?.password?.message}</p>
          <input
            className={errors?.password ? styles.error : ""}
            placeholder="Password"
            type="password"
            {...register("password", {
              required: {
                value: true,
                message: "Password is required",
              },
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters long",
              },
              maxLength: {
                value: 20,
                message: "Password must be at most 20 characters long",
              },
              pattern: {
                value: /^(?!^\d{8}$).{8}$/,
                message: "Password cannot be only numbers",
              },
            })}
          />
          <p>{errors?.confirmPassword?.message}</p>
          <input
            className={errors?.confirmPassword ? styles.error : ""}
            placeholder="Confirm Password"
            type="password"
            {...register("password_confirm", {
              required: {
                value: true,
                message: "Confirm Password is required",
              },
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters long",
              },
              maxLength: {
                value: 20,
                message: "Password must be at most 20 characters long",
              },
              pattern: {
                value: /^(?!^\d{8}$).{8}$/,
                message: "Password cannot be only numbers",
              },
            })}
          />
          <button>Sign Up</button>
        </form>
        <p>
          Are you have an account? <a href="/login">Login</a>
        </p>
      </div>
    </div>
  );
};
