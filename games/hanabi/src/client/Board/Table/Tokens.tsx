import * as React from "react";
import { Box } from "theme-ui";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as _ from "lodash";

export default ({
  num,
  total,
  icon,
}: {
  num: number;
  total: number;
  icon: any;
}) => (
  <Box m={1}>
    {_.range(num).map(idx => (
      <FontAwesomeIcon
        key={`have_${idx}`}
        icon={icon}
        style={{ margin: "5px" }}
      />
    ))}
    {_.range(total - num).map(idx => (
      <FontAwesomeIcon
        icon={icon}
        key={`used_${idx}`}
        style={{ margin: "5px" }}
        color="lightgrey"
      />
    ))}
  </Box>
);
