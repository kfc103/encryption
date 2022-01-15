import React from "react";
import IconButton from "@material-ui/core/IconButton";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";
import InputAdornment from "@material-ui/core/InputAdornment";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import FormHelperText from "@material-ui/core/FormHelperText";

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
