import styles from "./Login.module.scss";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { fetchLogin } from "../../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";

export const Login = () => {
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
    const result = await dispatch(fetchLogin(data));
    console.log(result);
    if ("serverError" in result.payload) {
      alert(result.payload.serverError.error);
    } else {
      alert("Login successful!");
      navigate("/");
    }
  };

  return (
    <div className={styles.users}>
      <div className={styles.users_box}>
        <h2>Login User</h2>
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

          <button>Login</button>
        </form>
        <p>
          Don't have an account? <a href="/sign_up">Sign Up</a>
        </p>
      </div>
    </div>
  );
};
