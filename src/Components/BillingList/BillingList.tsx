import {
  Box,
  Button,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Modal,
  OutlinedInput,
  Paper,
  Select,
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
import { useEffect, useState } from "react";
import { styled } from "styled-components";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import Loader from "../Loader/Loader";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
interface billItem {
  primaryKeyID: number;
  billID: number;
  billNo: number;
  billDate: string;
  customerID: number;
  customerName: number;
  netAmount: number;
  remarks: string;
}
interface CreateBillingItem {
  descr: string;
  unit: string;
  qty: number;
  rate: number;
  discAmt: number;
  amount: number;
}
interface customerItem {
  customerID: number;
  customerName: string;
}
interface AxiosSccessResponse {
  data: YourDataType;
  status: number;
}
interface YourDataType {
  primaryKeyID: number;
  billID: number;
  billNo: number;
  billDate: string;
  customerID: number;
  netAmount: number;
  totalDiscountAmount: number;
  remarks: string;
  billItems: {
    primaryKeyID: number;
    billItemID: number;
    billID: number;
    sNo: number;
    descr: string;
    unit: string;
    qty: number;
    rate: number;
    discAmt: number;
    amount: number;
  }[];
}

const BillingList = () => {
  const [billingList, setBillingList] = useState<billItem[]>([]);
  const [createbillingItems, setCreateBillingItems] = useState<
    CreateBillingItem[]
  >([]);
  const [customerList, setCutomerList] = useState<customerItem[]>([]);
  const [loader, setLoader] = useState<boolean>(false);
  const [customerName, setCustomerName] = useState<string>("");

  const [date, setDate] = useState<string>();
  const [billNumber, setBillNumber] = useState<number>(0);

  const [description, setDescription] = useState<string>("");
  const [descriptionError, setDescriptionError] = useState<boolean>(false);
  const [descriptionMessage, setDescriptionMessage] = useState<string>("");

  const [unit, setUnit] = useState<string>("");
  const [unitError, setUnitError] = useState<boolean>(false);
  const [unitMessage, setUnitMessage] = useState<string>("");

  const [rate, setRate] = useState<number>(0);
  const [rateError, setRateError] = useState<boolean>(false);
  const [rateMessage, setRateMessage] = useState<string>("");

  const [quantity, setQuantity] = useState<number>(0);
  const [quantityError, setQuantityError] = useState<boolean>(false);
  const [quantityMessage, setQuantityMessage] = useState<string>("");

  const [discount, setDiscount] = useState<number>(0);
  const [discountError, setDiscountError] = useState<boolean>(false);
  const [discountMessage, setDiscountMessage] = useState<string>("");

  const [amount, setAmount] = useState<number>(0);
  const [amountError, setAmountError] = useState<boolean>(false);
  const [amountMessage, setAmountMessage] = useState<string>("");

  const [remark, setRemark] = useState<string>("");
  const [customerID, setCustomerID] = useState<number>(0);

  const [openAddCustomerForm, setOpenAddCustomerForm] =
    useState<boolean>(false);

  const [updateActive, setUpdateActive] = useState<boolean>(false);
  const [billId, setBillId] = useState<number>(0);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [totalNetAmount, settotalNetAmount] = useState<number>(0);
  const [totalDiscount, settotalDiscount] = useState<number>(0);

  useEffect(() => {
    GetAllCustomerList();
    generateBillNumber();
    getCurrentDate();
    getAllBillList();
  }, []);

  const getAllBillList = () => {
    setLoader(true);
    const apiUrl =
      "https://reacttestprojectapi.azurewebsites.net/api/BillManagement/Bill/GetList/";
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
          setBillingList(response.data);
          setTimeout(() => {
            setLoader(false);
          }, 1500);
        }
      })
      .catch((error) => {
        toast.error(error.response.data);
      });
  };

  const GetAllCustomerList = () => {
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
        }
      })
      .catch((error) => {
        toast.error(error.response.data);
      });
  };

  const generateBillNumber = () => {
    const apiUrl =
      "https://reacttestprojectapi.azurewebsites.net/api/BillManagement/Bill/GenerateBillNo";
    const token = localStorage.getItem("authToken");

    axios
      .get(apiUrl, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.status === 200 && response.data) {
          checkDuplicateBillNumber(response.data);
        }
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  const checkDuplicateBillNumber = (bilNumber: number) => {
    const apiUrl = `https://reacttestprojectapi.azurewebsites.net/api/BillManagement/Bill/CheckDuplicateBillNo?BillNo=${bilNumber}&excludeID=8`;
    const token = localStorage.getItem("authToken");

    axios
      .get(apiUrl, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.data === "") {
          setBillNumber(bilNumber);
        } else {
          generateBillNumber();
        }
      })
      .catch((error) => {
        toast.error(error);
      });
  };
  const deleteBill = (bill: billItem) => {
    const apiUrl = `https://reacttestprojectapi.azurewebsites.net/api/BillManagement/Bill/Delete/${bill.primaryKeyID}`;
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
          toast.success("");
          setBillNumber(response.data);
          getAllBillList();
        }
      })
      .catch((error) => {
        toast.error(error);
      });
  };
  const openUpdate = async (bill: billItem) => {
    setBillId(bill.billID);
    setCustomerID(bill.customerID);
    setCustomerName(String(bill.customerName));
    setRemark(bill.remarks);
    setDate(bill.billDate);
    setBillNumber(bill.billNo);
    setUpdateActive(!updateActive);
    setOpenAddCustomerForm(true);

    const apiUrl = `https://reacttestprojectapi.azurewebsites.net/api/BillManagement/Bill/GetModel/${bill.billID}`;
    const token = localStorage.getItem("authToken");

    await axios
      .get(apiUrl, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response: AxiosSccessResponse) => {
        if (response.status === 200) {
          setCreateBillingItems(response.data.billItems);
          response.data.billItems.map((bill: any) => {
            settotalDiscount(bill.discAmt);
            setTotalAmount(bill.amount);
            settotalNetAmount(bill.amount);
          });
        }
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  const handleEditorChange = (event: any, editor: any) => {
    const data = editor.getData();
    setRemark(data);
  };

  const updateBill = () => {
    setLoader(true);

    let requestData = {
      billID: billId,
      billNo: billNumber,
      billDate: date,
      customerID: customerID,
      netAmount: totalNetAmount,
      totalDiscountAmount: totalDiscount,
      Remarks: remark,
      billItems: createbillingItems,
    };
    const apiUrl = `https://reacttestprojectapi.azurewebsites.net/api/BillManagement/Bill/Update`;
    const token = localStorage.getItem("authToken");

    axios
      .put(apiUrl, requestData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          setOpenAddCustomerForm(!openAddCustomerForm);
          toast.success("");
          setBillNumber(response.data);
          setUpdateActive(false);
          getAllBillList();
          setTimeout(() => {
            setLoader(false);
          }, 1500);
        }
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  const getCurrentDate = () => {
    var currentDate = new Date();
    var year = currentDate.getFullYear();
    var month = (currentDate.getMonth() + 1).toString().padStart(2, "0"); // Months are zero-indexed
    var day = currentDate.getDate().toString().padStart(2, "0");
    var formattedDate = year + "-" + month + "-" + day;
    setDate(formattedDate);
  };

  const handleAddCustomerFormModal = () => {
    setOpenAddCustomerForm(!openAddCustomerForm);
  };
  const handleCloseAddBillModal = () => {
    setDescription("");
    setUnit("");
    setRemark("");
    setRate(0);
    setQuantity(0);
    setAmount(0);
    setOpenAddCustomerForm(false);
    setBillId(0);
    setCustomerID(0);
    setCustomerName("");
    setRemark("");
    setDate("");
    setBillNumber(0);
    settotalNetAmount(0);
    setDiscount(0);
    setUpdateActive(false);
  };

  const getCustomerID = (event: any) => {
    customerList.map((customer) => {
      if (customer.customerName === event.target.value) {
        setCustomerID(customer.customerID);
        return customerID;
      }
    });
  };
  const handleCreateBillValidation = () => {
    if (!description) {
      setDescriptionError(true);
      setDescriptionMessage("Enter description");
      return true;
    } else if (!unit) {
      setDescriptionError(false);
      setDescriptionMessage("");
      setUnitError(true);
      setUnitMessage("Enter unit");
      return true;
    } else if (!rate) {
      setUnitError(false);
      setUnitMessage("");
      setRateError(true);
      setRateMessage("Enter rate");
      return true;
    } else if (!quantity) {
      setRateError(false);
      setRateMessage("");
      setQuantityError(true);
      setQuantityMessage("Enter quantity");
      return true;
    } else if (!discount) {
      setDiscountError(false);
      setDiscountMessage("");
      setDiscountError(true);
      setDiscountMessage("Enter discount");
      return true;
    } else if (!amount) {
      setAmountError(true);
      setAmountMessage("Enter amount");
      return true;
    } else if (!remark) {
    } else {
      setDescriptionError(false);
      setDescriptionMessage("");
      setUnitError(false);
      setUnitMessage("");
      setRateError(false);
      setRateMessage("");
      setQuantityError(false);
      setQuantityMessage("");
      setDiscountError(false);
      setDiscountMessage("");
      setAmountError(false);
      setAmountMessage("");
      return false;
    }
  };
  const calculateBillAmount = () => {
    let total = rate * quantity - discount;
    setAmount(total);
  };
  const calculateTotalAmount = () => {
    let totalAmt = Number(rate) * Number(quantity);
    setTotalAmount(totalAmt);
    calculateTotalDiscount();
  };

  const calculateTotalDiscount = () => {
    let totalDic = totalDiscount + Number(discount);
    settotalDiscount(totalDic);
    calculateNetAmount();
  };

  const calculateNetAmount = () => {
    let totalNetAmt = totalNetAmount + amount;
    settotalNetAmount(totalNetAmt);
    addItemToBillingList();
  };

  const addItemToBillingList = async () => {
    let billingItem: CreateBillingItem = {
      descr: description,
      unit: unit,
      rate: rate,
      qty: quantity,
      discAmt: discount,
      amount: amount,
    };
    await setCreateBillingItems((prevItems) => [...prevItems, billingItem]);
    setDescription("");
    setUnit("");
    setRate(0);
    setQuantity(0);
    setDiscount(0);
    setAmount(0);
  };

  const handleSave = () => {
    if (!handleCreateBillValidation()) {
      calculateTotalAmount();
    }
  };

  const handleCreateBill = () => {
    let requestData = {
      billNo: billNumber,
      billDate: date,
      customerID: customerID,
      netAmount: totalNetAmount,
      totalDiscountAmount: discount,
      Remarks: remark,
      billItems: createbillingItems,
    };

    const apiUrl =
      "https://reacttestprojectapi.azurewebsites.net/api/BillManagement/Bill/Insert";
    const token = localStorage.getItem("authToken");

    axios
      .post(apiUrl, requestData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log("Response:", response.data);
        if (response.status === 200) {
          setOpenAddCustomerForm(!openAddCustomerForm);
          toast.success("Customer Added");
          setCustomerID(0);
          settotalDiscount(0);
          settotalNetAmount(0);
        }
      })
      .catch((error) => {
        toast.error(error.response.data);
      });
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(billingList);
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
    <BillingListContainer>
      <Box className="cutomerTopContainer">
        <Grid container spacing={[4, 4]}>
          <Grid item xs={12} sm={6} md={6} lg={6}>
            <Typography variant="h4">Billing List</Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={6}>
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
          </Grid>
        </Grid>
      </Box>
      <Box className="customerListContainer">
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="center">S.No</TableCell>
                <TableCell align="center">Bill No.</TableCell>
                <TableCell align="center">Bill Date</TableCell>
                <TableCell align="center">Customer Name</TableCell>
                <TableCell align="center">Net Amount</TableCell>
                <TableCell align="center">Remark</TableCell>
                <TableCell align="center">Operation</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {billingList.length === 0 ? (
                <Loader />
              ) : (
                billingList?.map((bill, index) => (
                  <TableRow key={index}>
                    <TableCell align="center">{index + 1}</TableCell>
                    <TableCell align="center">{bill.billNo}</TableCell>
                    <TableCell align="center">{bill.billDate}</TableCell>
                    <TableCell align="center">{bill.customerName}</TableCell>
                    <TableCell align="center">{bill.netAmount}</TableCell>
                    <TableCell align="center">
                      <div
                        dangerouslySetInnerHTML={{
                          __html: bill.remarks,
                        }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <IconButton onClick={() => openUpdate(bill)}>
                          <BorderColorIcon />
                        </IconButton>
                        <IconButton onClick={() => deleteBill(bill)}>
                          <DeleteOutlineIcon />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <Typography style={{ width: "100%", margin: "20px auto" }}>
          Record Count : {billingList.length}
        </Typography>
      </Box>
      <Modal open={openAddCustomerForm}>
        <AddCustomerModalContainer>
          <Box className="addCustomerForm">
            <Typography align="center" variant="h5">
              Add Bill
            </Typography>
            <Grid container spacing={[5, 5]}>
              <Grid item xs={12} sm={12} md={6} lg={6}>
                <InputLabel>Bill Number</InputLabel>
                <TextField
                  fullWidth
                  type="text"
                  InputProps={{
                    readOnly: true,
                  }}
                  value={billNumber}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={6}>
                <InputLabel>Bill Date</InputLabel>

                <TextField
                  fullWidth
                  type="text"
                  InputProps={{
                    readOnly: true,
                  }}
                  value={date}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">
                    Customers
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={customerName}
                    label="Customers"
                    onChange={(event) => getCustomerID(event)}
                  >
                    {customerList.map((customer, index) => (
                      <MenuItem value={customer.customerName} key={index}>
                        {customer.customerName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <InputLabel>Add Bill Item</InputLabel>
                <table id="table2" style={{ width: "100%" }}>
                  <thead>
                    <tr>
                      <th>S.No</th>
                      <th>Description</th>
                      <th>Unit</th>
                      <th>Rate</th>
                      <th>Qty</th>
                      <th>Discount</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {createbillingItems?.map((bill, index) => {
                      return (
                        <tr key={index}>
                          <td>
                            <Typography align="center">{index + 1}</Typography>
                          </td>

                          <td>
                            <Typography align="center"></Typography>
                            {bill?.descr}
                          </td>
                          <td>
                            <Typography align="center">{bill?.unit}</Typography>
                          </td>
                          <td>
                            <Typography align="center">{bill?.rate}</Typography>
                          </td>
                          <td>
                            <Typography align="center">{bill?.qty}</Typography>
                          </td>
                          <td>
                            <Typography align="center">
                              {bill?.discAmt}
                            </Typography>
                          </td>
                          <td>
                            <Typography align="center">
                              {bill?.amount}
                            </Typography>
                          </td>
                        </tr>
                      );
                    })}
                    <tr>
                      <td>
                        <Typography align="center">
                          {createbillingItems.length + 1}
                        </Typography>
                      </td>
                      <td>
                        <TextField
                          fullWidth
                          required
                          type="text"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          error={descriptionError}
                          helperText={descriptionMessage}
                          placeholder="Descriiption"
                        />
                      </td>
                      <td>
                        <TextField
                          fullWidth
                          required
                          type="text"
                          value={unit}
                          onChange={(e) => setUnit(e.target.value)}
                          error={unitError}
                          helperText={unitMessage}
                          placeholder="Unit"
                        />
                      </td>
                      <td>
                        <TextField
                          fullWidth
                          required
                          type="number"
                          value={rate}
                          onChange={(e) => setRate(Number(e.target.value))}
                          error={rateError}
                          helperText={rateMessage}
                          placeholder="Rate"
                        />
                      </td>
                      <td>
                        <TextField
                          fullWidth
                          required
                          type="number"
                          value={quantity}
                          onChange={(e) => setQuantity(Number(e.target.value))}
                          error={quantityError}
                          helperText={quantityMessage}
                          placeholder="Quantity"
                        />
                      </td>
                      <td>
                        <TextField
                          fullWidth
                          required
                          type="text"
                          value={discount}
                          onChange={(e) => setDiscount(Number(e.target.value))}
                          error={discountError}
                          helperText={discountMessage}
                          placeholder="Discount"
                        />
                      </td>
                      <td>
                        <TextField
                          fullWidth
                          required
                          type="text"
                          value={amount}
                          onFocus={calculateBillAmount}
                          InputProps={{ readOnly: true }}
                          placeholder="Amount"
                          error={amountError}
                          helperText={amountMessage}
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </Grid>

              <Grid item xs={12} sm={12} md={6} lg={6}>
                {/* <CKEditor
                  editor={ClassicEditor}
                  data={remark}
                  onChange={handleEditorChange}
                  config={{
                    toolbar: [
                      "bold",
                      "italic",
                      "bulletedList",
                      "numberedList",
                      "undo",
                      "redo",
                    ],
                  }}
                /> */}
                <CKEditor
                  editor={ClassicEditor}
                  data={remark}
                  onChange={handleEditorChange}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={6}>
                <OutlinedInput
                  id="outlined-adornment-weight"
                  endAdornment={
                    <InputAdornment position="end">Total Amount</InputAdornment>
                  }
                  aria-describedby="outlined-weight-helper-text"
                  inputProps={{
                    "aria-label": "weight",
                  }}
                  readOnly
                  fullWidth
                  value={totalAmount}
                />
                <OutlinedInput
                  id="outlined-adornment-weight"
                  endAdornment={
                    <InputAdornment position="end">Discount</InputAdornment>
                  }
                  aria-describedby="outlined-weight-helper-text"
                  inputProps={{
                    "aria-label": "weight",
                  }}
                  readOnly
                  fullWidth
                  style={{ margin: "12px 0px" }}
                  value={totalDiscount}
                />
                <OutlinedInput
                  id="outlined-adornment-weight"
                  endAdornment={
                    <InputAdornment position="end">Net Amount</InputAdornment>
                  }
                  aria-describedby="outlined-weight-helper-text"
                  inputProps={{
                    "aria-label": "weight",
                  }}
                  readOnly
                  fullWidth
                  value={totalNetAmount}
                />
              </Grid>
            </Grid>
            <Box className="addCustomerBtnContainer">
              {updateActive ? (
                <Button
                  variant="contained"
                  size="large"
                  className="commonBtn"
                  onClick={updateBill}
                >
                  Update
                </Button>
              ) : (
                <Button
                  variant="contained"
                  size="large"
                  className="commonBtn"
                  onClick={handleCreateBill}
                >
                  Add
                </Button>
              )}

              <Button
                variant="contained"
                size="large"
                className="commonBtn"
                onClick={handleSave}
              >
                Save
              </Button>
              <Button
                variant="contained"
                size="large"
                className="commonBtn"
                onClick={handleCloseAddBillModal}
              >
                Close
              </Button>
            </Box>
          </Box>
        </AddCustomerModalContainer>
      </Modal>
      <Loader open={loader} />
    </BillingListContainer>
  );
};

const BillingListContainer = styled(Box)({
  marginTop: "50px",
  padding: "50px",
  "& .customerListContainer": {
    padding: "20px 0px",
  },
  "& .customerListBtnContainer": {
    display: "flex",
    gap: "10px",
    justifyContent: "flex-end",
    alignItems: "center",
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
    width: "90%",
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

export default BillingList;
