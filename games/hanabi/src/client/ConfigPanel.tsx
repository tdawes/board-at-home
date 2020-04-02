import { ConfigProps } from "@board-at-home/api/src";
import { faBomb, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as React from "react";
import { Checkbox, Flex, Input, Label, Select } from "theme-ui";
import { Config } from "../api";

export const ConfigPanel = ({ config, setConfig }: ConfigProps<Config>) => (
  <Flex sx={{ flexDirection: "column", alignItems: "center" }} mt={3}>
    <Label mb={2}>
      <Select
        defaultValue="basic"
        onChange={e => {
          if (e.target.value === "basic" || e.target.value === "rainbow") {
            setConfig({ gameType: e.target.value });
          }
        }}
        sx={{ width: "240px" }}
      >
        <option value="basic">Play basic game</option>
        <option value="rainbow">Play with 🌈 rainbow 🌈 set</option>
      </Select>
    </Label>
    <Label mb={2}>
      <Checkbox
        checked={config.royalFavour}
        onChange={() => setConfig({ royalFavour: !config.royalFavour })}
      />
      Royal Favour (finish all sets)
    </Label>
    <Label sx={{ alignItems: "center", width: "170px" }}>
      <Input
        type="number"
        min="1"
        max="20"
        value={config.infoTokens}
        onChange={e => setConfig({ infoTokens: parseInt(e.target.value, 10) })}
        mb={1}
        mr={1}
        sx={{ width: "50px" }}
      />
      <FontAwesomeIcon icon={faInfoCircle} style={{ margin: "5px" }} />
      info tokens
    </Label>
    <Label sx={{ alignItems: "center", width: "170px" }}>
      <Input
        type="number"
        min="1"
        max="10"
        value={config.fuseTokens}
        onChange={e => setConfig({ fuseTokens: parseInt(e.target.value, 10) })}
        mb={1}
        mr={1}
        sx={{ width: "50px" }}
      />
      <FontAwesomeIcon icon={faBomb} style={{ margin: "5px" }} />
      fuse tokens
    </Label>
  </Flex>
);
