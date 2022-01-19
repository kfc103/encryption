import React from "react";

import Divider from "@material-ui/core/Divider";
import MenuList from "@material-ui/core/MenuList";
import MenuItem from "@material-ui/core/MenuItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import LinearProgress from "@material-ui/core/LinearProgress";
import PasswordIcon from "@material-ui/icons/Menu";
import Cloud from "@material-ui/icons/Cloud";
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
        <MenuItem>
          <ListItemIcon>
            <Cloud fontSize="small" />
          </ListItemIcon>
          <ListItemText>Web Clipboard</ListItemText>
        </MenuItem>
      </MenuList>
      <Passphrase />
    </React.Fragment>
  );
}
