import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Expresiones regulares para validaciones
const validations = {
  username: /^[a-zA-Z0-9_]{4,20}$/,
  password:
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  nombre: /^[a-zA-ZÁÉÍÓÚáéíóúñÑ\s]{2,50}$/,
  apellido: /^[a-zA-ZÁÉÍÓÚáéíóúñÑ\s]{2,50}$/,
  dni: /^\d{7,8}$/,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  telefono: /^(\d{10,15})?$/,
};

const Login = () => {
  const { login, register, checkAvailability } = useAuth();
  const navigate = useNavigate();

  // Estados del formulario
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    nombre: "",
    apellido: "",
    dni: "",
    email: "",
    telefono: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [validFields, setValidFields] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitMessage, setSubmitMessage] = useState({ type: "", text: "" });

  // Estado para validación en tiempo real (duplicados)
  const [availability, setAvailability] = useState({
    username: null,
    email: null,
    dni: null,
  });
  const [validating, setValidating] = useState({
    username: false,
    email: false,
    dni: false,
  });

  // Referencias para animaciones
  const formRef = useRef(null);

  const validateForm = React.useCallback(() => {
    const newErrors = {};
    const newValidFields = {};

    // Validaciones comunes
    if (touched.username) {
      if (!formData.username.trim()) {
        newErrors.username = "El usuario es requerido";
      } else if (!validations.username.test(formData.username)) {
        newErrors.username =
          "Usuario inválido (4-20 caracteres, solo letras, números y _)";
      } else {
        newValidFields.username = true;
      }
    }

    if (touched.password) {
      if (!formData.password.trim()) {
        newErrors.password = "La contraseña es requerida";
      } else if (isRegister && !validations.password.test(formData.password)) {
        newErrors.password =
          "Mínimo 8 caracteres, 1 mayúscula, 1 minúscula, 1 número y 1 caracter especial";
      } else {
        newValidFields.password = true;
      }
    }

    // Validaciones específicas de registro
    if (isRegister) {
      if (touched.nombre) {
        if (!formData.nombre.trim()) {
          newErrors.nombre = "El nombre es requerido";
        } else if (!validations.nombre.test(formData.nombre)) {
          newErrors.nombre = "Nombre inválido (solo letras y espacios)";
        } else {
          newValidFields.nombre = true;
        }
      }

      if (touched.apellido) {
        if (!formData.apellido.trim()) {
          newErrors.apellido = "El apellido es requerido";
        } else if (!validations.apellido.test(formData.apellido)) {
          newErrors.apellido = "Apellido inválido (solo letras y espacios)";
        } else {
          newValidFields.apellido = true;
        }
      }

      if (touched.dni) {
        if (!formData.dni.trim()) {
          newErrors.dni = "El DNI es requerido";
        } else if (!validations.dni.test(formData.dni)) {
          newErrors.dni = "DNI inválido (7 u 8 dígitos)";
        } else {
          newValidFields.dni = true;
        }
      }

      if (touched.email) {
        if (!formData.email.trim()) {
          newErrors.email = "El email es requerido";
        } else if (!validations.email.test(formData.email)) {
          newErrors.email = "Email inválido";
        } else {
          newValidFields.email = true;
        }
      }

      if (touched.telefono && formData.telefono) {
        if (!validations.telefono.test(formData.telefono)) {
          newErrors.telefono = "Teléfono inválido (10-15 dígitos)";
        } else {
          newValidFields.telefono = true;
        }
      }

      if (touched.confirmPassword) {
        if (!confirmPassword.trim()) {
          newErrors.confirmPassword = "Confirma tu contraseña";
        } else if (formData.password !== confirmPassword) {
          newErrors.confirmPassword = "Las contraseñas no coinciden";
        } else {
          newValidFields.confirmPassword = true;
        }
      }
    }

    setErrors(newErrors);
    setValidFields(newValidFields);
    return Object.keys(newErrors).length === 0;
  }, [formData, touched, isRegister, confirmPassword]);

  // Validaciones en tiempo real de formato
  useEffect(() => {
    validateForm();
  }, [validateForm]);

  // Validación de disponibilidad (duplicados) con debounce
  useEffect(() => {
    if (!isRegister) return;

    const fieldsToCheck = ["username", "email", "dni"];
    const timeouts = {};

    fieldsToCheck.forEach((field) => {
      const value = formData[field];
      // Solo validar si tiene el formato correcto según la Regex y longitud mínima
      const isValidFormat =
        field === "dni"
          ? validations.dni.test(value)
          : field === "email"
          ? validations.email.test(value)
          : validations.username.test(value);

      if (value && isValidFormat) {
        setValidating((prev) => ({ ...prev, [field]: true }));
        timeouts[field] = setTimeout(async () => {
          const isAvailable = await checkAvailability(field, value);
          setAvailability((prev) => ({ ...prev, [field]: isAvailable }));
          setValidating((prev) => ({ ...prev, [field]: false }));
        }, 600);
      } else {
        setAvailability((prev) => ({ ...prev, [field]: null }));
        setValidating((prev) => ({ ...prev, [field]: false }));
      }
    });

    return () => {
      Object.values(timeouts).forEach((t) => clearTimeout(t));
    };
  }, [
    formData.username,
    formData.email,
    formData.dni,
    isRegister,
    checkAvailability,
  ]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Limpieza de datos según el campo
    let cleanedValue = value;

    switch (name) {
      case "dni":
        cleanedValue = value.replace(/\D/g, "").slice(0, 8);
        break;
      case "telefono":
        cleanedValue = value.replace(/\D/g, "").slice(0, 15);
        break;
      case "username":
        cleanedValue = value.toLowerCase().replace(/[^a-z0-9_]/g, "");
        break;
      case "email":
        cleanedValue = value.toLowerCase();
        break;
      case "nombre":
      case "apellido":
        cleanedValue = value.replace(/[^a-zA-ZÁÉÍÓÚáéíóúñÑ\s]/g, "");
        break;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: cleanedValue,
    }));

    // Resetear disponibilidad al cambiar el valor
    if (availability[name] !== undefined) {
      setAvailability((prev) => ({ ...prev, [name]: null }));
    }

    // Marcar como tocado cuando se empieza a escribir
    if (!touched[name]) {
      setTouched((prev) => ({ ...prev, [name]: true }));
    }
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSubmitMessage({ type: "", text: "" });

    // Marcar todos los campos como tocados
    const allFields = isRegister
      ? [
          "username",
          "password",
          "nombre",
          "apellido",
          "dni",
          "email",
          "telefono",
          "confirmPassword",
        ]
      : ["username", "password"];

    const newTouched = allFields.reduce(
      (acc, field) => ({ ...acc, [field]: true }),
      {}
    );
    setTouched(newTouched);

    // Esperar un ciclo para que se actualice el estado
    setTimeout(() => {
      if (!validateForm()) {
        setLoading(false);
        setSubmitMessage({
          type: "error",
          text: "Por favor, corrige los errores en el formulario",
        });

        // Enfocar el primer campo con error
        const firstErrorField = Object.keys(errors)[0];
        if (firstErrorField && formRef.current) {
          const errorInput = formRef.current.querySelector(
            `[name="${firstErrorField}"]`
          );
          if (errorInput) errorInput.focus();
        }
        return;
      }

      proceedWithSubmit(formData);
    }, 0);
  };

  const proceedWithSubmit = async (currentFormData) => {
    try {
      if (isRegister) {
        // Proceso de registro
        const result = await register(currentFormData);
        if (result.success) {
          setSubmitMessage({ type: "success", text: result.message });
          // Limpiar formulario
          setFormData({
            username: "",
            password: "",
            nombre: "",
            apellido: "",
            dni: "",
            email: "",
            telefono: "",
          });
          setConfirmPassword("");
          setTouched({});
          setValidFields({});
          // Cambiar a modo login después de 2 segundos
          setTimeout(() => {
            setIsRegister(false);
            setSubmitMessage({ type: "", text: "" });
          }, 2000);
        } else {
          setSubmitMessage({ type: "error", text: result.message });
        }
      } else {
        // Proceso de login
        const result = await login(
          currentFormData.username,
          currentFormData.password
        );
        if (result.success) {
          setSubmitMessage({
            type: "success",
            text: "Inicio de sesión exitoso. Redirigiendo...",
          });

          // Redirigir según el rol
          setTimeout(() => {
            if (result.user.role === "admin") {
              navigate("/admin");
            } else {
              navigate("/alumno");
            }
          }, 1500);
        } else {
          setSubmitMessage({ type: "error", text: result.message });
        }
      }
    } catch {
      setSubmitMessage({
        type: "error",
        text: "Ocurrió un error inesperado. Por favor, intenta nuevamente",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsRegister(!isRegister);
    setSubmitMessage({ type: "", text: "" });
    setErrors({});
    setTouched({});
    setValidFields({});
    setConfirmPassword("");
  };

  // Función para renderizar el ícono de validación
  const renderValidationIcon = (fieldName) => {
    if (!touched[fieldName]) return null;

    if (errors[fieldName]) {
      return (
        <div className="input-group-append">
          <span className="input-group-text bg-white border-start-0 text-danger">
            <i className="bi bi-x-circle-fill"></i>
          </span>
        </div>
      );
    }

    if (validFields[fieldName]) {
      return (
        <div className="input-group-append">
          <span className="input-group-text bg-white border-start-0 text-success">
            <i className="bi bi-check-circle-fill"></i>
          </span>
        </div>
      );
    }

    return null;
  };

  // Función para obtener clase del campo
  const getInputClassName = (field) => {
    let className = "form-control ";

    if (touched[field]) {
      if (errors[field] || availability[field] === false) {
        className += "is-invalid ";
      } else if (validFields[field] && availability[field] !== false) {
        className += "is-valid ";
      }
    }

    return className.trim();
  };

  // Función para renderizar feedback de disponibilidad
  const renderAvailabilityFeedback = (field) => {
    if (!isRegister) return null;

    if (validating[field]) {
      return (
        <small className="text-info d-block mt-1">
          <span
            className="spinner-border spinner-border-sm me-1"
            role="status"
            aria-hidden="true"
          ></span>
          Verificando...
        </small>
      );
    }

    if (availability[field] === true) {
      return (
        <small className="text-success d-block mt-1">
          <i className="bi bi-check-circle-fill me-1"></i> Disponible
        </small>
      );
    }

    if (availability[field] === false) {
      return (
        <small className="text-danger d-block mt-1">
          <i className="bi bi-exclamation-triangle-fill me-1"></i> Ya registrado
          en la base
        </small>
      );
    }

    return null;
  };
  // Función para renderizar mensaje de ayuda
  const renderHelpText = (field) => {
    if (!touched[field] || validFields[field]) return null;

    const helpTexts = {
      username: "4-20 caracteres, solo letras, números y _",
      password:
        "Mín. 8 caracteres con mayúscula, minúscula, número y símbolo (@$!%*?&)",
      nombre: "Solo letras y espacios (2-50 caracteres)",
      apellido: "Solo letras y espacios (2-50 caracteres)",
      dni: "7 u 8 dígitos",
      email: "Formato: usuario@dominio.com",
      telefono: "10-15 dígitos (opcional)",
      confirmPassword: "Debe coincidir con la contraseña",
    };

    if (helpTexts[field]) {
      return <small className="form-text text-muted">{helpTexts[field]}</small>;
    }

    return null;
  };

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-gradient">
      <div
        className="card p-4 shadow-lg border-0"
        style={{ width: "450px", maxWidth: "95%" }}
        ref={formRef}
      >
        <div className="text-center mb-4">
          <h2 className="text-danger fw-bold">
            <i
              className={`bi bi-${
                isRegister ? "person-plus" : "box-arrow-in-right"
              } me-2`}
            ></i>
            {isRegister ? "Crear Cuenta" : "Iniciar Sesión"}
          </h2>
          <p className="text-muted">
            {isRegister
              ? "Completa el formulario para registrarte"
              : "Ingresa tus credenciales para acceder"}
          </p>
        </div>

        {/* Indicador de progreso (solo para registro) */}
        {isRegister && (
          <div className="mb-4">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <small className="text-muted">Progreso del formulario:</small>
              <small className="fw-semibold text-danger">
                {Object.keys(validFields).length} / 7 campos válidos
              </small>
            </div>
            <div className="progress" style={{ height: "6px" }}>
              <div
                className="progress-bar bg-success"
                role="progressbar"
                style={{
                  width: `${(Object.keys(validFields).length / 7) * 100}%`,
                }}
                aria-valuenow={Object.keys(validFields).length}
                aria-valuemin="0"
                aria-valuemax="7"
              ></div>
            </div>
          </div>
        )}

        {/* Mensajes de éxito/error */}
        {submitMessage.text && (
          <div
            className={`alert alert-${
              submitMessage.type === "success" ? "success" : "danger"
            } alert-dismissible fade show`}
          >
            <i
              className={`bi bi-${
                submitMessage.type === "success"
                  ? "check-circle"
                  : "exclamation-triangle"
              } me-2`}
            ></i>
            {submitMessage.text}
            <button
              type="button"
              className="btn-close"
              onClick={() => setSubmitMessage({ type: "", text: "" })}
            ></button>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          {/* Usuario */}
          <div className="mb-3">
            <label className="form-label fw-semibold">
              <i className="bi bi-person me-1"></i>
              Usuario *
            </label>
            <div className="input-group">
              <input
                type="text"
                className={getInputClassName("username")}
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                onBlur={() => handleBlur("username")}
                placeholder="ej: juan.perez"
                disabled={loading}
                required
              />
              {renderValidationIcon("username")}
            </div>
            {touched.username && errors.username ? (
              <div className="invalid-feedback d-block">{errors.username}</div>
            ) : (
              <>
                {renderAvailabilityFeedback("username")}
                {renderHelpText("username")}
              </>
            )}
          </div>

          {/* Contraseña */}
          <div className="mb-3">
            <label className="form-label fw-semibold">
              <i className="bi bi-lock me-1"></i>
              Contraseña *
            </label>
            <div className="input-group">
              <input
                type="password"
                className={getInputClassName("password")}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                onBlur={() => handleBlur("password")}
                placeholder={isRegister ? "Contraseña segura" : "Tu contraseña"}
                disabled={loading}
                required
              />
              {renderValidationIcon("password")}
            </div>
            {touched.password && errors.password ? (
              <div className="invalid-feedback d-block">{errors.password}</div>
            ) : (
              renderHelpText("password")
            )}

            {/* Indicador de fortaleza de contraseña (solo registro) */}
            {isRegister && touched.password && (
              <div className="mt-2">
                <small className="d-block mb-1">Fortaleza de contraseña:</small>
                <div className="password-strength">
                  {[
                    "Mínimo 8 caracteres",
                    "Mayúscula y minúscula",
                    "Al menos un número",
                    "Carácter especial",
                  ].map((req, idx) => {
                    const regexChecks = [
                      /.{8,}/,
                      /(?=.*[a-z])(?=.*[A-Z])/,
                      /\d/,
                      /[@$!%*?&]/,
                    ];
                    const isValid = regexChecks[idx].test(formData.password);

                    return (
                      <div key={idx} className="d-flex align-items-center mb-1">
                        <i
                          className={`bi ${
                            isValid
                              ? "bi-check-circle-fill text-success"
                              : "bi-circle text-muted"
                          } me-2`}
                        ></i>
                        <small
                          className={isValid ? "text-success" : "text-muted"}
                        >
                          {req}
                        </small>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Campos de registro */}
          {isRegister && (
            <>
              {/* Nombre y Apellido */}
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">
                    <i className="bi bi-card-heading me-1"></i>
                    Nombre *
                  </label>
                  <div className="input-group">
                    <input
                      type="text"
                      className={getInputClassName("nombre")}
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleInputChange}
                      onBlur={() => handleBlur("nombre")}
                      placeholder="Juan"
                      disabled={loading}
                      required
                    />
                    {renderValidationIcon("nombre")}
                  </div>
                  {touched.nombre && errors.nombre ? (
                    <div className="invalid-feedback d-block">
                      {errors.nombre}
                    </div>
                  ) : (
                    renderHelpText("nombre")
                  )}
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">
                    <i className="bi bi-card-heading me-1"></i>
                    Apellido *
                  </label>
                  <div className="input-group">
                    <input
                      type="text"
                      className={getInputClassName("apellido")}
                      name="apellido"
                      value={formData.apellido}
                      onChange={handleInputChange}
                      onBlur={() => handleBlur("apellido")}
                      placeholder="Pérez"
                      disabled={loading}
                      required
                    />
                    {renderValidationIcon("apellido")}
                  </div>
                  {touched.apellido && errors.apellido ? (
                    <div className="invalid-feedback d-block">
                      {errors.apellido}
                    </div>
                  ) : (
                    renderHelpText("apellido")
                  )}
                </div>
              </div>

              {/* DNI */}
              <div className="mb-3">
                <label className="form-label fw-semibold">
                  <i className="bi bi-credit-card me-1"></i>
                  DNI *
                </label>
                <div className="input-group">
                  <input
                    type="text"
                    className={getInputClassName("dni")}
                    name="dni"
                    value={formData.dni}
                    onChange={handleInputChange}
                    onBlur={() => handleBlur("dni")}
                    placeholder="12345678"
                    maxLength="8"
                    disabled={loading}
                    required
                  />
                  {renderValidationIcon("dni")}
                </div>
                {touched.dni && errors.dni ? (
                  <div className="invalid-feedback d-block">{errors.dni}</div>
                ) : (
                  <>
                    {renderAvailabilityFeedback("dni")}
                    {renderHelpText("dni")}
                  </>
                )}
              </div>

              {/* Email */}
              <div className="mb-3">
                <label className="form-label fw-semibold">
                  <i className="bi bi-envelope me-1"></i>
                  Email *
                </label>
                <div className="input-group">
                  <input
                    type="email"
                    className={getInputClassName("email")}
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    onBlur={() => handleBlur("email")}
                    placeholder="juan@email.com"
                    disabled={loading}
                    required
                  />
                  {renderValidationIcon("email")}
                </div>
                {touched.email && errors.email ? (
                  <div className="invalid-feedback d-block">{errors.email}</div>
                ) : (
                  <>
                    {renderAvailabilityFeedback("email")}
                    {renderHelpText("email")}
                  </>
                )}
              </div>

              {/* Teléfono (opcional) */}
              <div className="mb-3">
                <label className="form-label fw-semibold">
                  <i className="bi bi-telephone me-1"></i>
                  Teléfono
                </label>
                <div className="input-group">
                  <input
                    type="text"
                    className={getInputClassName("telefono")}
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleInputChange}
                    onBlur={() => handleBlur("telefono")}
                    placeholder="1122334455"
                    disabled={loading}
                  />
                  {renderValidationIcon("telefono")}
                </div>
                {touched.telefono && errors.telefono ? (
                  <div className="invalid-feedback d-block">
                    {errors.telefono}
                  </div>
                ) : (
                  renderHelpText("telefono")
                )}
              </div>

              {/* Confirmar Contraseña */}
              <div className="mb-4">
                <label className="form-label fw-semibold">
                  <i className="bi bi-lock-fill me-1"></i>
                  Confirmar Contraseña *
                </label>
                <div className="input-group">
                  <input
                    type="password"
                    className={`form-control ${
                      touched.confirmPassword && errors.confirmPassword
                        ? "is-invalid"
                        : ""
                    } ${
                      touched.confirmPassword && !errors.confirmPassword
                        ? "is-valid"
                        : ""
                    }`}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onBlur={() => handleBlur("confirmPassword")}
                    placeholder="Repite tu contraseña"
                    disabled={loading}
                    required
                  />
                  {renderValidationIcon("confirmPassword")}
                </div>
                {touched.confirmPassword && errors.confirmPassword ? (
                  <div className="invalid-feedback d-block">
                    {errors.confirmPassword}
                  </div>
                ) : (
                  renderHelpText("confirmPassword")
                )}

                {/* Indicador de coincidencia */}
                {touched.confirmPassword &&
                  formData.password &&
                  confirmPassword && (
                    <div className="mt-1">
                      {formData.password === confirmPassword ? (
                        <small className="text-success">
                          <i className="bi bi-check-circle-fill me-1"></i>
                          Las contraseñas coinciden
                        </small>
                      ) : (
                        <small className="text-danger">
                          <i className="bi bi-x-circle-fill me-1"></i>
                          Las contraseñas no coinciden
                        </small>
                      )}
                    </div>
                  )}
              </div>
            </>
          )}

          {/* Botón de envío */}
          <button
            type="submit"
            className="btn btn-danger w-100 py-2 mb-3 fw-semibold"
            disabled={
              loading ||
              (isRegister &&
                (availability.username === false ||
                  availability.email === false ||
                  availability.dni === false ||
                  validating.username ||
                  validating.email ||
                  validating.dni))
            }
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                {isRegister ? "Registrando..." : "Iniciando sesión..."}
              </>
            ) : (
              <>
                <i
                  className={`bi bi-${
                    isRegister ? "person-plus" : "box-arrow-in-right"
                  } me-2`}
                ></i>
                {isRegister ? "Registrarse" : "Iniciar Sesión"}
              </>
            )}
          </button>

          {/* Enlace para cambiar modo */}
          <div className="text-center">
            <button
              type="button"
              className="btn btn-link text-decoration-none"
              onClick={toggleMode}
              disabled={loading}
            >
              <i
                className={`bi bi-arrow-${
                  isRegister ? "left" : "right"
                }-circle me-1`}
              ></i>
              {isRegister
                ? "¿Ya tienes cuenta? Inicia sesión"
                : "¿No tienes cuenta? Regístrate"}
            </button>
          </div>
        </form>

        {/* Información adicional */}
        <div className="mt-4 pt-3 border-top">
          <div className="d-flex align-items-center">
            <i className="bi bi-info-circle text-primary me-2"></i>
            <small className="text-muted">
              <strong>Nota:</strong> * Campos obligatorios
            </small>
          </div>
          <div className="mt-2">
            <small className="text-muted">
              {isRegister
                ? "✓ Tus datos están protegidos"
                : "🔒 Acceso seguro con validación en tiempo real"}
            </small>
          </div>

          {/* Indicadores de validación */}
          <div className="mt-3 d-flex justify-content-around small">
            <div className="text-center">
              <i className="bi bi-check-circle-fill text-success d-block"></i>
              <small className="text-muted">Válido</small>
            </div>
            <div className="text-center">
              <i className="bi bi-x-circle-fill text-danger d-block"></i>
              <small className="text-muted">Error</small>
            </div>
            <div className="text-center">
              <i className="bi bi-dash-circle text-muted d-block"></i>
              <small className="text-muted">Pendiente</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
