import * as React from "react";
import { ConfigProps } from "@board-at-home/api/src";
import { Config } from "../api";
import { Flex, Label, Checkbox, Input } from "theme-ui";

export const ConfigPanel = ({ config, setConfig }: ConfigProps<Config>) => (
  <Flex sx={{ flexDirection: "column", alignItems: "center" }}>
    <Label mb={1}>
      Game type: Basic (Sorry, 🌈rainbow🌈 is not supported yet)
    </Label>
    <Label mb={1}>
      <Checkbox
        checked={config.royalFavor}
        onChange={() => setConfig({ royalFavor: !config.royalFavor })}
      />
      Use Royal Favor variant (must complete all sets to win)
    </Label>
    <Label sx={{ alignItems: "center", width: "180px" }}>
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
      information tokens
    </Label>
    <Label sx={{ alignItems: "center", width: "180px" }}>
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
      fuse tokens
    </Label>
  </Flex>
);
