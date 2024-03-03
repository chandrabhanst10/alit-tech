import { Box, CircularProgress, Modal } from "@mui/material";
import { useEffect, useState } from "react";
import { styled } from "styled-components";

interface Props {
  open: boolean;
}
const Loader = ({ open }: any) => {
  return (
    <Modal open={open}>
      <LoaderContainer>
        <CircularProgress color="secondary" />
      </LoaderContainer>
    </Modal>
  );
};
const LoaderContainer = styled(Box)({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
});
export default Loader;
