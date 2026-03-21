import styles from "./signUp.module.scss";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { fetchRegister } from "../../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../i18n/LanguageContext.jsx";

export const SignUp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
  });

  const onRegister = async (data) => {
    const result = await dispatch(fetchRegister(data));
    if (result.payload && "serverError" in result.payload) {
      alert(result.payload.serverError.error);
    } else {
      alert(t("auth.registerSuccess"));
      navigate("/");
    }
  };

  return (
    <div className={styles.users}>
      <div className={styles.users_box}>
        <h2>{t("auth.registerTitle")}</h2>
        <form onSubmit={handleSubmit(onRegister)} className={styles.form}>
          <p>{errors?.username?.message}</p>
          <input
            className={errors?.username ? styles.error : ""}
            {...register("username", {
              required: {
                value: true,
                message: t("auth.validation.usernameRequired"),
              },
              minLength: {
                value: 2,
                message: t("auth.validation.usernameMin"),
              },
              maxLength: {
                value: 20,
                message: t("auth.validation.usernameMax"),
              },
              pattern: {
                value: /^[A-Za-z0-9_.@-]+$/,
                message: t("auth.validation.usernamePattern"),
              },
            })}
            placeholder={t("auth.username")}
          />
          <p>{errors?.email?.message}</p>
          <input
            className={errors?.email ? styles.error : ""}
            placeholder={t("auth.email")}
            {...register("email", {
              required: {
                value: true,
                message: t("auth.validation.emailRequired"),
              },
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: t("auth.validation.emailInvalid"),
              },
            })}
          />
          <p>{errors?.password?.message}</p>
          <input
            className={errors?.password ? styles.error : ""}
            placeholder={t("auth.password")}
            type="password"
            {...register("password", {
              required: {
                value: true,
                message: t("auth.validation.passwordRequired"),
              },
              minLength: {
                value: 8,
                message: t("auth.validation.passwordMin"),
              },
              maxLength: {
                value: 20,
                message: t("auth.validation.passwordMax"),
              },
              pattern: {
                value: /^(?!^\d{8}$).{8}$/,
                message: t("auth.validation.passwordPattern"),
              },
            })}
          />
          <p>{errors?.password_confirm?.message}</p>
          <input
            className={errors?.password_confirm ? styles.error : ""}
            placeholder={t("auth.confirmPassword")}
            type="password"
            {...register("password_confirm", {
              required: {
                value: true,
                message: t("auth.validation.confirmRequired"),
              },
              minLength: {
                value: 8,
                message: t("auth.validation.passwordMin"),
              },
              maxLength: {
                value: 20,
                message: t("auth.validation.passwordMax"),
              },
              pattern: {
                value: /^(?!^\d{8}$).{8}$/,
                message: t("auth.validation.passwordPattern"),
              },
            })}
          />
          <button>{t("auth.signupButton")}</button>
        </form>
        <p>
          {t("auth.haveAccount")} <a href="/login">{t("auth.login")}</a>
        </p>
      </div>
    </div>
  );
}
