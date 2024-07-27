import React from "react";
import styled from "@emotion/styled";
import { css, keyframes } from "@emotion/react";
import { Box, Skeleton, Typography } from "@mui/material";
import { Colors } from "styles/theme/color";
import useResponsive from "utils/use-media-query";

const slideUp = keyframes`
  0% {top: 100%;}
  30%  {top: -24px;}
  50%  {top: 4px;}
`;

const slideDown = keyframes`
  0% {top: 0; opacity: 1;}
  50% {opacity: 0; opacity: 0.9;}
  100%  {top: 100%; opacity: 0;}
`;

const HideBox = styled(Box)`
  background-color: ${Colors.blue100};
  top: 100%;
  transition: all 0.3s ease-out;
  padding: 16px;
  border-radius: 20px;
  position: absolute;
`;

const ItemBox = styled(Box)(
  () => css`
    width: 225px;
    height: 130px;
    background-color: ${Colors.white};
    box-shadow: rgba(149, 157, 165, 0.2) 0px 1px 4px;
    border-radius: 11px;
    overflow: hidden;
    position: relative;

    @media (min-width: 1280px) {
      &:hover .hideBox {
        top: 0;
        opacity: 1;
        -webkit-animation: ${slideUp} 1s;
        -moz-animation: ${slideUp} 1s;
        -o-animation: ${slideUp} 1s;
        animation: ${slideUp} 1s;
      }

      &:not(:hover) .hideBox {
        -webkit-animation: ${slideDown} 1s;
        -moz-animation: ${slideDown} 1s;
        -o-animation: ${slideDown} 1s;
        animation: ${slideDown} 1s;
      }
    }
  `
);

interface Data {
  title: string;
  desc: string;
  detail: string;
  icon?: React.ElementType;
  isLoding: boolean;
}

const StatisticCard: React.FC<Data> = ({
  title,
  desc,
  detail,
  icon: Icon,
  isLoding,
}) => {
  const { laptop2 } = useResponsive();

  if (isLoding) {
    return (
      <Skeleton
        variant="rectangular"
        width="225px"
        height="130px"
        sx={{ borderRadius: "20px" }}
      />
    );
  }

  return (
    <ItemBox>
      <Box padding="16px">
        {Icon && <Icon />}
        <Typography
          marginTop="9px"
          fontWeight={700}
          fontSize="19px"
          color={Colors.blue}
        >
          {title}
        </Typography>
        <Typography color={Colors.darkGrey} fontSize="14px">
          {desc}
        </Typography>
        {!laptop2 && (
          <Typography marginTop={laptop2 ? "34px" : "20px"}>
            <span dangerouslySetInnerHTML={{ __html: detail }} />
          </Typography>
        )}
      </Box>

      <HideBox className="hideBox">
        <Typography color={Colors.white}>{title}</Typography>
        <Typography marginTop="8px" color={Colors.white}>
          {desc}
        </Typography>
        <Typography marginTop="34px" color={Colors.white}>
          <span dangerouslySetInnerHTML={{ __html: detail }} />
        </Typography>
      </HideBox>
    </ItemBox>
  );
};

export default StatisticCard;
