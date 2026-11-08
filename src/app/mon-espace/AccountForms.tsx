"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { createClient } from "../../lib/supabase/client";
import styles from "./page.module.css";

type FormMode = "login" | "signup";
type SignupRole = "tenant" | "real_estate_agent";
type Feedback = { type: "error" | "success"; message: string } | null;

function getErrorMessage(code: string | undefined, message: string) {
  if (code === "invalid_credentials") {
    return "Adresse e-mail ou mot de passe incorrect.";
  }

  if (code === "email_not_confirmed") {
    return "Confirme d’abord ton adresse e-mail depuis le message reçu.";
  }

  if (code === "user_already_exists") {
    return "Un compte existe déjà avec cette adresse e-mail.";
  }

  if (/rate limit|too many requests/i.test(message)) {
    return "Trop de demandes pour le moment. Réessaie un peu plus tard.";
  }

  if (process.env.NODE_ENV === "development" && message) {
    return `Détail Supabase (${code || "sans code"}) : ${message}`;
  }

  return "Une erreur est survenue. Vérifie les informations puis réessaie.";
}

export default function AccountForms({
  confirmationError,
  onAuthenticated,
  variant = "page",
}: {
  confirmationError: boolean;
  onAuthenticated?: () => void;
  variant?: "page" | "modal";
}) {
  const router = useRouter();
  const [mode, setMode] = useState<FormMode>("login");
  const [signupRole, setSignupRole] = useState<SignupRole>("tenant");
  const [firstNames, setFirstNames] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("+224 ");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [canResendConfirmation, setCanResendConfirmation] =
    useState(confirmationError);
  const [feedback, setFeedback] = useState<Feedback>(
    confirmationError
      ? {
          type: "error",
          message:
            "Le lien de confirmation est invalide ou a expiré. Demande un nouvel e-mail d’inscription.",
        }
      : null,
  );

  const selectMode = (nextMode: FormMode) => {
    setMode(nextMode);
    setFeedback(null);
  };

  const finishAuthentication = () => {
    if (onAuthenticated) {
      onAuthenticated();
      router.refresh();
      return;
    }

    router.replace("/mon-espace");
    router.refresh();
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedFirstNames = firstNames.trim().replace(/\s+/g, " ");
    const normalizedLastName = lastName.trim();
    const normalizedPhone = phone.trim();

    if (
      mode === "signup" &&
      normalizedFirstNames.split(" ").length > 2
    ) {
      setFeedback({
        type: "error",
        message: "Saisissez un ou deux prénoms seulement.",
      });
      return;
    }

    if (
      mode === "signup" &&
      (!normalizedFirstNames || !normalizedLastName || !normalizedPhone)
    ) {
      setFeedback({
        type: "error",
        message: "Renseignez votre prénom, votre nom et votre téléphone.",
      });
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);

    try {
      const supabase = createClient();

      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
            data: {
              full_name: `${normalizedFirstNames} ${normalizedLastName}`,
              first_names: normalizedFirstNames,
              last_name: normalizedLastName,
              phone: normalizedPhone,
              requested_role: signupRole,
            },
          },
        });

        if (error) {
          setFeedback({
            type: "error",
            message: getErrorMessage(error.code, error.message),
          });
        } else if (data.session) {
          finishAuthentication();
        } else {
          setCanResendConfirmation(true);
          setFeedback({
            type: "success",
            message: signupRole === "real_estate_agent"
              ? "Compte créé avec le profil Locataire. Ta demande d’accès comme agent immobilier sera étudiée par ENAFIM après confirmation de ton adresse e-mail."
              : "Compte créé. Consulte ta boîte e-mail et confirme ton adresse avant de te connecter.",
          });
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (error) {
          if (error.code === "email_not_confirmed") {
            setCanResendConfirmation(true);
          }
          setFeedback({
            type: "error",
            message: getErrorMessage(error.code, error.message),
          });
        } else {
          finishAuthentication();
        }
      }
    } catch (error) {
      setFeedback({
        type: "error",
        message: getErrorMessage(
          undefined,
          error instanceof Error ? error.message : "",
        ),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendConfirmation = async () => {
    const normalizedEmail = email.trim();

    if (!normalizedEmail) {
      setFeedback({
        type: "error",
        message: "Saisis ton adresse e-mail pour recevoir un nouveau lien.",
      });
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);

    try {
      const { error } = await createClient().auth.resend({
        type: "signup",
        email: normalizedEmail,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        setFeedback({
          type: "error",
          message: getErrorMessage(error.code, error.message),
        });
      } else {
        setFeedback({
          type: "success",
          message:
            "Si cette adresse attend une confirmation, un nouveau lien vient d’être envoyé. Vérifie aussi les courriers indésirables.",
        });
      }
    } catch (error) {
      setFeedback({
        type: "error",
        message: getErrorMessage(
          undefined,
          error instanceof Error ? error.message : "",
        ),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div
        className={
          variant === "modal"
            ? `${styles.formHeading} ${styles.modalHeading}`
            : styles.formHeading
        }
      >
        <h2 id={variant === "modal" ? "account-dialog-title" : undefined}>
          {mode === "login"
            ? variant === "modal"
              ? "Connectez-vous à votre espace"
              : "Heureux de vous retrouver"
            : variant === "modal"
              ? "Créez votre espace personnel"
              : "Votre espace commence ici"}
        </h2>
        <p>
          {mode === "login"
            ? "Retrouvez votre compte en quelques instants."
            : "Créez votre accès personnel ENAFIM."}
        </p>
      </div>

      <form
        className={
          [
            styles.form,
            variant === "modal" ? styles.modalForm : "",
            mode === "signup" ? styles.signupForm : "",
          ]
            .filter(Boolean)
            .join(" ")
        }
        onSubmit={handleSubmit}
      >
        {mode === "signup" && (
          <fieldset className={styles.accountTypeFieldset}>
            <legend>Type de compte</legend>
            <div className={styles.accountTypeOptions}>
              <label
                className={
                  signupRole === "tenant"
                    ? styles.accountTypeSelected
                    : styles.accountTypeOption
                }
              >
                <input
                  type="radio"
                  name="requestedRole"
                  value="tenant"
                  checked={signupRole === "tenant"}
                  onChange={() => setSignupRole("tenant")}
                />
                <span>
                  <strong>Locataire</strong>
                  <small>Rechercher un logement</small>
                </span>
              </label>
              <label
                className={
                  signupRole === "real_estate_agent"
                    ? styles.accountTypeSelected
                    : styles.accountTypeOption
                }
              >
                <input
                  type="radio"
                  name="requestedRole"
                  value="real_estate_agent"
                  checked={signupRole === "real_estate_agent"}
                  onChange={() => setSignupRole("real_estate_agent")}
                />
                <span>
                  <strong>Agent immobilier</strong>
                  <small>Profil professionnel soumis à validation</small>
                </span>
              </label>
            </div>
          </fieldset>
        )}

        {mode === "signup" && (
          <label className={styles.field}>
            <span>Prénom(s)</span>
            <input
              autoComplete="given-name"
              maxLength={100}
              name="firstNames"
              onChange={(event) => setFirstNames(event.target.value)}
              required
              value={firstNames}
            />
          </label>
        )}

        {mode === "signup" && (
          <label className={styles.field}>
            <span>Nom</span>
            <input
              autoComplete="family-name"
              maxLength={100}
              name="lastName"
              onChange={(event) => setLastName(event.target.value)}
              required
              value={lastName}
            />
          </label>
        )}

        <label className={styles.field}>
          <span>Adresse e-mail</span>
          <input
            autoComplete="email"
            name="email"
            onChange={(event) => setEmail(event.target.value)}
            required
            type="email"
            value={email}
          />
        </label>

        {mode === "signup" && (
          <label className={styles.field}>
            <span>Téléphone</span>
            <input
              autoComplete="tel"
              inputMode="tel"
              maxLength={25}
              name="phone"
              onChange={(event) => setPhone(event.target.value)}
              required
              type="tel"
              value={phone}
            />
          </label>
        )}

        <label className={styles.field}>
          <span>Mot de passe</span>
          <div className={styles.passwordControl}>
            <input
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
              minLength={8}
              name="password"
              onChange={(event) => setPassword(event.target.value)}
              required
              type={isPasswordVisible ? "text" : "password"}
              value={password}
            />
            <button
              className={styles.passwordToggle}
              type="button"
              aria-label={
                isPasswordVisible ? "Masquer le mot de passe" : "Afficher le mot de passe"
              }
              aria-pressed={isPasswordVisible}
              onClick={() => setIsPasswordVisible((visible) => !visible)}
            >
              {isPasswordVisible ? (
                <EyeOff size={19} aria-hidden="true" />
              ) : (
                <Eye size={19} aria-hidden="true" />
              )}
            </button>
          </div>
        </label>

        <button
          className={styles.submitButton}
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting
            ? "Patientez..."
            : mode === "login"
              ? "Se connecter"
              : "Créer mon espace personnel"}
        </button>
      </form>

      {feedback && (
        <p
          className={
            feedback.type === "error"
              ? styles.errorMessage
              : styles.successMessage
          }
          role={feedback.type === "error" ? "alert" : "status"}
          aria-live="polite"
        >
          {feedback.message}
        </p>
      )}

      {canResendConfirmation && (
        <button
          className={styles.resendButton}
          type="button"
          disabled={isSubmitting}
          onClick={handleResendConfirmation}
        >
          {isSubmitting ? "Envoi en cours..." : "Renvoyer l’e-mail de confirmation"}
        </button>
      )}

      <div className={styles.alternateAction}>
        <div className={styles.divider}>
          <span>ou</span>
        </div>
        {mode === "login" ? (
          <button
            className={styles.createAccountButton}
            type="button"
            onClick={() => selectMode("signup")}
          >
            Créer un espace personnel
          </button>
        ) : (
          <p className={styles.switchPrompt}>
            Déjà inscrit(e) ?{" "}
            <button type="button" onClick={() => selectMode("login")}>
              Se connecter
            </button>
          </p>
        )}
      </div>
    </>
  );
}