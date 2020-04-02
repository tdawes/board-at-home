/** @jsx jsx */
import { ConfigProps } from "@board-at-home/api/src";
import { Flex, jsx, Label, Select } from "theme-ui";
import { Config } from "../api";

export default ({ game, config, setConfig }: ConfigProps<Config>) => (
  <Flex sx={{ flexDirection: "column", alignItems: "center" }} mt={3}>
    <Label mb={2} sx={{ alignItems: "center" }}>
      Quizmaster:
      <Select
        value={config.quizMaster}
        onChange={e => {
          setConfig({
            quizMaster: e.target.value,
          });
        }}
        sx={{ width: "240px" }}
      >
        {Object.keys(game.players).map(player => (
          <option key={player} value={player}>
            {game.players[player].name ||
              (player.length > 20 ? `${player.slice(0, 20)}...` : player)}
          </option>
        ))}
      </Select>
    </Label>
  </Flex>
);
