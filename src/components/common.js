import { styled } from "@mui/material/styles";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import * as React from "react";

export const BootstrapTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.palette.common.black,
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.black,
  },
}));

export const getDateMonth = (date) => {
  date = new Date(date * 1000);
  return (
    date.toLocaleString("default", {
      month: "long",
    }) +
    " " +
    date.getDate() +
    ", " +
    date.getHours() +
    ":" +
    date.getMinutes()
  );
};

export function getErrorMsg(message) {
  let msgArray = [
    "Name can not be blank during user creation",
    "Email can not be blank during user creation",
    "user address should be exist",
    "Blog title can not be blank",
    "Blog content can not be blank",
    "Blog id can not be blank",
    "Blog title can not be blank",
    "Blog content can not be blank",
    "Only author can update his/her blog",
  ];
  for (let i = 0; i < msgArray.length; i++) {
    if (message.includes(msgArray[i])) return msgArray[i];
  }
  return "Something is wrong where error can't detect";
}
