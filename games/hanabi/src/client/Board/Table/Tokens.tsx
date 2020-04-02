/** @jsx jsx */
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as _ from "lodash";
import { animated, useTransition } from "react-spring";
import { Box, jsx } from "theme-ui";
import { colourMap, hanabiColour } from "../../../api";

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
  const transitions = useTransition(tokens, item => item, {
    from: { color: hanabiColour },
    enter: { color: "#333" },
    leave: { color: colourMap.red },
  });

  return (
    <Box
      m={1}
      sx={{ height: "26px", width: `${26 * total}px`, position: "relative" }}
    >
      <div style={{ position: "absolute", top: 0, left: 0, display: "flex" }}>
        {_.range(total).map(idx => (
          <FontAwesomeIcon
            icon={icon}
            key={idx}
            style={{
              margin: "5px",
              color: "lightgrey",
            }}
          />
        ))}
      </div>
      <div style={{ position: "absolute", top: 0, left: 0, display: "flex" }}>
        {transitions.map(({ props, key }) => (
          <animated.span
            key={key}
            style={{
              margin: "5px",
              transition: "color 0.5s ease",
              ...props,
            }}
          >
            <FontAwesomeIcon icon={icon} />
          </animated.span>
        ))}
      </div>
    </Box>
  );
};
