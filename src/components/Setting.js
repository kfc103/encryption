import React from "react";

import Divider from "@mui/material/Divider";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material//MenuItem";
import ListItemText from "@mui/material//ListItemText";
import ListItemIcon from "@mui/material//ListItemIcon";
import LinearProgress from "@mui/material//LinearProgress";
import PasswordIcon from "@mui/icons-material/Password";
import { usePassphrase } from "./Passphrase";
import { encrypt, decrypt } from "../utils/Dencryptor";
import api from "../utils/api";

export default function Setting(props) {
  const { rows, setRows, passphrase, setPassphrase } = props;
  const { getPassphrase, Passphrase, MODE } = usePassphrase();
  const [busy, setBusy] = React.useState(false);

  const handleChangePassphrase = async () => {
    setBusy(true);

    const newPassphrase = await getPassphrase({
      mode: MODE.UPDATE,
      isCancelable: true,
      ciphertextList: rows.map((item) => {
        return item.data.password;
      })
    });
    //console.log(newPassphrase);

    if (newPassphrase) {
      // update with new passphrase
      // decrypt with old passphrase and then encrypt with new passphrase
      let newRows = rows.map((item) => {
        return {
          ...item,
          data: {
            ...item.data,
            password: encrypt(
              decrypt(item.data.password, passphrase),
              newPassphrase
            )
          }
        };
      });

      newRows.forEach(async (item) => {
        await api.update(item.ref["@ref"].id, item.data);
      });

      setRows(newRows);
      setPassphrase(newPassphrase);
    }

    setBusy(false);
  };
  return (
    <React.Fragment>
      {busy && <LinearProgress />}
      <MenuList>
        <MenuItem onClick={handleChangePassphrase} disabled={busy}>
          <ListItemIcon>
            <PasswordIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Change Master Passphrase</ListItemText>
        </MenuItem>
        <Divider />
      </MenuList>
      <Passphrase />
    </React.Fragment>
  );
}
