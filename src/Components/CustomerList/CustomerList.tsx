import {
  Box,
  Button,
  IconButton,
  Modal,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { styled } from "styled-components";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import Loader from "../Loader/Loader";
interface customerItem {
  customerID: number;
  customerName: string;
}

const CustomerList = () => {
  const [customerList, setCutomerList] = useState<customerItem[]>([]);
  const [customerName, setCustomerName] = useState<string>("");
  const [customerNameError, setCustomerNameError] = useState<boolean>(false);
  const [customerNameMessage, setCustomerNameMessage] = useState<string>("");
  const [openAddCustomerForm, setOpenAddCustomerForm] =
    useState<boolean>(false);
  const [loader, setLoader] = useState<boolean>(false);
  const [updateActive, setUpdateActive] = useState<boolean>(false);
  const [customerID, setCustomerID] = useState<number>();

  useEffect(() => {
    GetAllCustomerList();
  }, []);

  const GetAllCustomerList = () => {
    setLoader(true);
    const apiUrl =
      "https://reacttestprojectapi.azurewebsites.net/api/CustomerManagement/Customer/GetLookupList";
    const token = localStorage.getItem("authToken");

    axios
      .get(apiUrl, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          setCutomerList(response.data);
          setTimeout(() => {
            setLoader(false);
          }, 1500);
        }
      })
      .catch((error) => {
        toast.error(error.response.data);
      });
  };

  const deleteCustomer = (customerID: number) => {
    setLoader(true);
    const apiUrl = `https://reacttestprojectapi.azurewebsites.net/api/CustomerManagement/Customer/Delete/${customerID}`;
    const token = localStorage.getItem("authToken");

    axios
      .delete(apiUrl, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          toast.success("Customer Deleted");
          setCutomerList((prevList) =>
            prevList.filter((customer) => customer.customerID !== customerID)
          );
          GetAllCustomerList();
          setTimeout(() => {
            setLoader(false);
          }, 1500);
        }
      })
      .catch((error) => {
        toast.error(error.response.data);
      });
  };

  const handleAddCustomerFormModal = () => {
    setOpenAddCustomerForm(!openAddCustomerForm);
  };

  const handleCustomerNameOnchange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCustomerName(event.target.value);
  };

  const handleAddCustomer = () => {
    setLoader(true);
    if (!customerName) {
      setCustomerNameError(true);
      setCustomerNameMessage("Please Enter Customer Name");
    } else {
      setCustomerNameError(false);
      setCustomerNameMessage("");
      const apiUrl =
        "https://reacttestprojectapi.azurewebsites.net/api/CustomerManagement/Customer/Insert";
      const token = localStorage.getItem("authToken");

      const requestData = {
        customerName: customerName,
      };

      axios
        .post(apiUrl, requestData, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          if (response.status === 200) {
            setCustomerName("");
            handleAddCustomerFormModal();
            toast.success("Customer Added");
            GetAllCustomerList();
            setTimeout(() => {
              setLoader(false);
            }, 1500);
          }
        })
        .catch((error) => {
          toast.error(error.response.data);
        });
    }
  };

  const openUpdate = (customer: any) => {
    setCustomerName(customer.customerName);
    setOpenAddCustomerForm(true);
    setUpdateActive(true);
    setCustomerID(customer.customerID);
  };
  const handleUpdateCustomer = () => {
    const apiUrl =
      "https://reacttestprojectapi.azurewebsites.net/api/CustomerManagement/Customer/Update";
    const token = localStorage.getItem("authToken");
    const data = {
      customerID: customerID,
      customerName: customerName,
    };
    axios
      .put(apiUrl, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          toast.success("Customer Updated");
          setUpdateActive(false);

          setCutomerList((prevList) =>
            prevList.map((customer) =>
              customer.customerID === customerID
                ? { ...customer, customerName: customerName }
                : customer
            )
          );
          setOpenAddCustomerForm(false);
          GetAllCustomerList();
        }
      })
      .catch((error) => {
        toast.error(error.response.data);
      });
  };
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(customerList);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const excelBlob = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });
    saveAs(excelBlob, "data.xlsx");
  };
  return (
    <CustomerListContainer>
      <Box className="cutomerTopContainer">
        <Typography variant="h4">Customer List</Typography>
        <Box className="customerListBtnContainer">
          <Button
            variant="contained"
            size="large"
            className="commonBtn"
            onClick={handleAddCustomerFormModal}
          >
            Add
          </Button>
          <Button
            variant="contained"
            size="large"
            className="commonBtn"
            onClick={exportToExcel}
          >
            Print
          </Button>
        </Box>
      </Box>
      <Box className="customerListContainer">
        <TableContainer component={Paper} sx={{ width: "70%", margin: "auto" }}>
          <Table sx={{ margin: "auto" }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="center">S.No</TableCell>
                <TableCell align="center">Customer</TableCell>
                <TableCell align="center">Operation</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {customerList?.map((customer, index) => (
                <TableRow key={index}>
                  <TableCell align="center">{index + 1}</TableCell>
                  <TableCell align="center">{customer?.customerName}</TableCell>
                  <TableCell align="center">
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <IconButton onClick={() => openUpdate(customer)}>
                        <BorderColorIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => deleteCustomer(customer.customerID)}
                      >
                        <DeleteOutlineIcon />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Typography style={{ width: "70%", margin: "20px auto" }}>
          Record Count : {customerList.length}
        </Typography>
      </Box>
      <Modal open={openAddCustomerForm}>
        <AddCustomerModalContainer>
          <Box className="addCustomerForm">
            <Typography align="center" variant="h5">
              Add Customer
            </Typography>
            <TextField
              placeholder="Enter customer name"
              onChange={handleCustomerNameOnchange}
              value={customerName}
              error={customerNameError}
              helperText={customerNameMessage}
            />
            <Box className="addCustomerBtnContainer">
              {updateActive ? (
                <Button
                  variant="contained"
                  size="large"
                  className="commonBtn"
                  onClick={() => handleUpdateCustomer()}
                >
                  Update
                </Button>
              ) : (
                <Button
                  variant="contained"
                  size="large"
                  className="commonBtn"
                  onClick={() => handleAddCustomer()}
                >
                  Add
                </Button>
              )}
              <Button
                variant="contained"
                size="large"
                className="commonBtn"
                onClick={handleAddCustomerFormModal}
              >
                Close
              </Button>
            </Box>
          </Box>
        </AddCustomerModalContainer>
      </Modal>
      <Loader open={loader} />
    </CustomerListContainer>
  );
};

const CustomerListContainer = styled(Box)({
  padding: "50px",
  marginTop: "50px",
  "& .customerListContainer": {
    padding: "20px 0px",
  },
  "& .customerListBtnContainer": {
    display: "flex",
    gap: "10px",
  },
  "& .cutomerTopContainer": {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
const AddCustomerModalContainer = styled(Box)({
  height: "100vh",
  width: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",

  "& .addCustomerForm": {
    width: "50%",
    height: "200px",
    backgroundColor: "#fff",
    borderRadius: "20px",
    padding: "20px",
    display: "flex",
    gap: "30px",
    flexDirection: "column",
  },
  "& .addCustomerBtnContainer": {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
export default CustomerList;
