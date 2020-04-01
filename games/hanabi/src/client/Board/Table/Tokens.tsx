/** @jsx jsx */
import { jsx, Box } from "theme-ui";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as _ from "lodash";
import { colourMap, hanabiColour } from "../../../api";

const gainKeyframe = {
  "0%": {
    color: "lightgrey",
  },
  "50%": {
    color: hanabiColour,
  },
  "100%": {
    color: "inherit",
  },
};
const loseKeyframe = {
  "0%": {
    color: "inherit",
  },
  "50%": {
    color: colourMap["red"],
  },
  "100%": {
    color: "lightgrey",
  },
};

export default ({
  num,
  total,
  icon,
}: {
  num: number;
  total: number;
  icon: any;
}) => {
  const tokens = _.range(num);
  const missing = _.range(total - num).reverse();

  return (
    <Box m={1}>
      {tokens.map(idx => (
        <FontAwesomeIcon
          key={`have_${idx}`}
          icon={icon}
          style={{ margin: "5px" }}
          css={{
            WebkitAnimation: "gain 1s forwards",
            animation: "gain 1s forwards",
            "@webkit-keyframes gain": gainKeyframe,
            "@keyframes gain": gainKeyframe,
          }}
        />
      ))}
      {missing.map(idx => (
        <span
          key={`used_${idx}`}
          css={{
            WebkitAnimation: "lose 1s forwards",
            animation: "lose 1s forwards",
            "@webkit-keyframes lose": loseKeyframe,
            "@keyframes lose": loseKeyframe,
          }}
        >
          <FontAwesomeIcon
            icon={icon}
            style={{
              margin: "5px",
            }}
          />
        </span>
      ))}
    </Box>
  );
};
