import { Ionicons } from "@expo/vector-icons";
import { useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from "react-native";
import { useTheme } from "../theme/ThemeContext";

type Props = {
  // Básico
  value: string; // Valor actual del input
  onChange: (value: string) => void; // Función que se ejecuta al cambiar el texto

  // Apariencia
  variant?: "default" | "filled" | "outlined"; // Estilo visual del input
  label?: string; // Etiqueta superior
  placeholder?: string; // Texto de ayuda cuando está vacío

  // Validación
  error?: string; // Mensaje de error
  helperText?: string; // Texto de ayuda
  success?: boolean; // Estado de éxito
  successMessage?: string; // Mensaje de éxito
  required?: boolean; // Campo obligatorio (muestra *)

  // Estados
  disabled?: boolean; // Deshabilitado
  loading?: boolean; // Muestra spinner de carga

  // Funcionalidad
  clearable?: boolean; // Muestra botón X para limpiar
  multiline?: boolean; // Permite múltiples líneas
  numberOfLines?: number; // Número de líneas si es multiline
  maxLength?: number; // Límite de caracteres
  showCharacterCount?: boolean; // Muestra contador de caracteres

  // Adornos visuales
  leftIcon?: React.ReactNode; // Icono a la izquierda
  rightIcon?: React.ReactNode; // Icono a la derecha
  prefix?: string; // Texto prefijo (ej: "$")
  suffix?: string; // Texto sufijo (ej: "kg")

  // Accesibilidad
  accessibilityLabel?: string;
  accessibilityHint?: string;

  // Configuración del teclado
  keyboardType?: TextInputProps["keyboardType"]; // Tipo de teclado
  autoCapitalize?: TextInputProps["autoCapitalize"]; // Auto mayúsculas
  autoCorrect?: boolean; // Auto corrección
  secureTextEntry?: boolean; // Para contraseñas
  returnKeyType?: TextInputProps["returnKeyType"]; // Botón del teclado
  onSubmitEditing?: () => void; // Al presionar enter
};

/**
 * InputText - A comprehensive, themeable text input component
 *
 * Supports multiple variants, validation states, character counting,
 * prefix/suffix adornments, and full accessibility features.
 *
 * @example
 * ```tsx
 * <InputText
 *   label="Email"
 *   value={email}
 *   onChange={setEmail}
 *   placeholder="Enter your email"
 *   keyboardType="email-address"
 *   required
 *   clearable
 *   error={emailError}
 * />
 * ```
 */
export default function InputText({
  value,
  variant = "default",
  onChange,
  label,
  placeholder,
  error,
  helperText,
  success = false,
  successMessage,
  required = false,
  disabled = false,
  loading = false,
  clearable = false,
  multiline = false,
  numberOfLines = 1,
  maxLength,
  showCharacterCount = false,
  leftIcon,
  rightIcon,
  prefix,
  suffix,
  accessibilityLabel,
  accessibilityHint,
  keyboardType,
  autoCapitalize,
  autoCorrect,
  secureTextEntry,
  returnKeyType,
  onSubmitEditing,
}: Props) {
  const theme = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const borderColorAnim = useRef(new Animated.Value(0)).current;

  const handleFocus = () => {
    setIsFocused(true);
    Animated.timing(borderColorAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const handleBlur = () => {
    setIsFocused(false);
    Animated.timing(borderColorAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const handleClear = () => {
    onChange("");
  };

  const getBorderColor = () => {
    if (error) return theme.colors.error;
    if (success) return theme.colors.success;
    if (isFocused) return theme.colors.primary;
    return theme.colors.border;
  };

  const animatedBorderColor = borderColorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [getBorderColor(), theme.colors.primary],
  });

  const getVariantStyles = () => {
    switch (variant) {
      case "filled":
        return {
          backgroundColor: theme.colors.surfaceMuted,
          borderWidth: 0,
          borderBottomWidth: 2,
        };
      case "outlined":
        return {
          backgroundColor: theme.colors.transparent,
          borderWidth: 2,
        };
      case "default":
      default:
        return {
          backgroundColor: theme.colors.surface,
          borderWidth: 1,
        };
    }
  };

  const textColor = disabled
    ? theme.colors.textSecondary
    : error
    ? theme.colors.error
    : theme.colors.text;

  const characterCountText = maxLength
    ? `${value.length}/${maxLength}`
    : `${value.length}`;

  const shouldShowRightIcon = () => {
    if (loading) return true;
    if (secureTextEntry) return true;
    if (clearable && value.length > 0 && !disabled) return true;
    if (rightIcon) return true;
    return false;
  };

  return (
    <View style={styles.container}>
      {label && (
        <View style={styles.labelContainer}>
          <Text
            style={[
              styles.label,
              {
                color: error ? theme.colors.error : theme.colors.onBackground,
              },
            ]}
            accessibilityRole="text"
          >
            {label}
            {required && (
              <Text
                style={[styles.required, { color: theme.colors.error }]}
                accessibilityLabel="required field"
              >
                {" *"}
              </Text>
            )}
          </Text>
        </View>
      )}

      <Animated.View
        style={[
          styles.inputContainer,
          getVariantStyles(),
          {
            borderColor: animatedBorderColor,
            ...(Platform.OS === "android" && {
              elevation: isFocused ? 2 : 0,
            }),
          },
          disabled && {
            backgroundColor: theme.colors.surfaceMuted,
            opacity: 0.6,
          },
        ]}
      >
        {(leftIcon || prefix) && (
          <View style={styles.leftAdornment}>
            {leftIcon}
            {prefix && (
              <Text
                style={[
                  styles.adornmentText,
                  { color: theme.colors.textSecondary },
                ]}
              >
                {prefix}
              </Text>
            )}
          </View>
        )}

        <TextInput
          value={value}
          onChangeText={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.text}
          editable={!disabled && !loading}
          multiline={multiline}
          numberOfLines={multiline ? numberOfLines : 1}
          maxLength={maxLength}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
          accessibilityLabel={accessibilityLabel || label}
          accessibilityHint={accessibilityHint || helperText}
          accessibilityState={{
            disabled: disabled,
          }}
          style={[
            styles.input,
            {
              color: textColor,
              minHeight: multiline ? 96 : 52,
              textAlignVertical: multiline ? "top" : "center",
            },
            leftIcon || prefix ? styles.inputWithLeftAdornment : undefined,
            shouldShowRightIcon() ? styles.inputWithRightAdornment : undefined,
          ]}
        />

        {shouldShowRightIcon() && (
          <View style={styles.rightAdornment}>
            {loading && (
              <ActivityIndicator size="small" color={theme.colors.primary} />
            )}

            {!loading && secureTextEntry && (
              <Pressable
                onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                accessibilityLabel={
                  isPasswordVisible ? "Hide password" : "Show password"
                }
                accessibilityRole="button"
                style={styles.iconButton}
              >
                <Ionicons
                  name={isPasswordVisible ? "eye-off-outline" : "eye-outline"}
                  size={22}
                  color={theme.colors.textSecondary}
                />
              </Pressable>
            )}

            {!loading &&
              !secureTextEntry &&
              clearable &&
              value.length > 0 &&
              !disabled && (
                <Pressable
                  onPress={handleClear}
                  accessibilityLabel="Clear text"
                  accessibilityRole="button"
                  accessibilityHint="Clears all text from this field"
                  style={styles.iconButton}
                >
                  <Ionicons
                    name="close-circle"
                    size={20}
                    color={theme.colors.textSecondary}
                  />
                </Pressable>
              )}

            {!loading &&
              !secureTextEntry &&
              !clearable &&
              rightIcon &&
              rightIcon}

            {suffix && (
              <Text
                style={[
                  styles.adornmentText,
                  { color: theme.colors.textSecondary },
                ]}
              >
                {suffix}
              </Text>
            )}
          </View>
        )}
      </Animated.View>

      {showCharacterCount && multiline && (
        <Text
          style={[
            styles.characterCount,
            {
              color:
                maxLength && value.length > maxLength * 0.9
                  ? theme.colors.error
                  : theme.colors.textSecondary,
            },
          ]}
        >
          {characterCountText}
        </Text>
      )}

      {(error || successMessage || helperText) && (
        <Text
          style={[
            styles.helperText,
            {
              color: error
                ? theme.colors.error
                : success
                ? theme.colors.success
                : theme.colors.text,
            },
          ]}
          accessibilityRole="text"
          accessibilityLiveRegion={error || success ? "polite" : "none"}
        >
          {error || successMessage || helperText}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 24,
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 20,
  },
  required: {
    fontSize: 14,
    fontWeight: "700",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    position: "relative",
  },
  input: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    lineHeight: 24,
  },
  inputWithLeftAdornment: {
    paddingLeft: 44,
  },
  inputWithRightAdornment: {
    paddingRight: 44,
  },
  leftAdornment: {
    position: "absolute",
    left: 12,
    flexDirection: "row",
    alignItems: "center",
    zIndex: 1,
  },
  rightAdornment: {
    position: "absolute",
    right: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    zIndex: 1,
  },
  iconButton: {
    padding: 4,
  },
  adornmentText: {
    fontSize: 16,
    fontWeight: "500",
  },
  helperText: {
    fontSize: 12,
    marginTop: 6,
    lineHeight: 16,
  },
  characterCount: {
    fontSize: 12,
    marginTop: 4,
    textAlign: "right",
    lineHeight: 16,
  },
});
