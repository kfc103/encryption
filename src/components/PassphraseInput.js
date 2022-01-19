import React from "react";
import IconButton from "@mui/material/IconButton";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Input from "@mui/material/Input";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import FormHelperText from "@mui/material/FormHelperText";

const PassphraseInput = (props) => {
  const [showPassword, setShowPassword] = React.useState();

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <FormControl fullWidth={props.fullWidth} sx={{ m: 1 }} variant="standard">
      <InputLabel htmlFor="standard-adornment-password">
        {props.label}
      </InputLabel>
      <Input
        {...props}
        type={showPassword ? "text" : "password"}
        value={props.value}
        onChange={props.onChange}
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={handleClickShowPassword}
            >
              {showPassword ? <Visibility /> : <VisibilityOff />}
            </IconButton>
          </InputAdornment>
        }
        aria-describedby="component-error-text"
      />
      {props.errortext && (
        <FormHelperText
          id="component-error-text"
          error={props.errortext !== ""}
        >
          {props.errortext}
        </FormHelperText>
      )}
    </FormControl>
  );
};

export default PassphraseInput;
