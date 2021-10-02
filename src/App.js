import React, {useState, useEffect} from "react";
import "./App.css";
import {forwardRef} from "react";
import Avatar from "react-avatar";
import Grid from "@material-ui/core/Grid";

import MaterialTable from "material-table";
import AddBox from "@material-ui/icons/AddBox";
import ArrowDownward from "@material-ui/icons/ArrowDownward";
import Check from "@material-ui/icons/Check";
import ChevronLeft from "@material-ui/icons/ChevronLeft";
import ChevronRight from "@material-ui/icons/ChevronRight";
import Clear from "@material-ui/icons/Clear";
import DeleteOutline from "@material-ui/icons/DeleteOutline";
import Edit from "@material-ui/icons/Edit";
import FilterList from "@material-ui/icons/FilterList";
import FirstPage from "@material-ui/icons/FirstPage";
import LastPage from "@material-ui/icons/LastPage";
import Remove from "@material-ui/icons/Remove";
import SaveAlt from "@material-ui/icons/SaveAlt";
import Search from "@material-ui/icons/Search";
import ViewColumn from "@material-ui/icons/ViewColumn";
import axios from "axios";
import Alert from "@material-ui/lab/Alert";

const tableIcons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref}/>),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref}/>),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref}/>),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref}/>),
  DetailPanel: forwardRef((props, ref) => (
      <ChevronRight {...props} ref={ref}/>
  )),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref}/>),
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref}/>),
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref}/>),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref}/>),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref}/>),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref}/>),
  PreviousPage: forwardRef((props, ref) => (
      <ChevronLeft {...props} ref={ref}/>
  )),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref}/>),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref}/>),
  SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref}/>),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref}/>),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref}/>)
};

const api = axios.create({
  baseURL: `https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json`
});

function validateEmail(email) {
    const re = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
  return re.test(String(email).toLowerCase());
}

function App() {
  const columns = [
    {
      title: "Avatar",
      render: rowData => (
          <Avatar
              maxInitials={1}
              size={40}
              round={true}
              name={rowData === undefined ? " " : rowData.name}
          />
      )
    },
    {title: "Name", field: "name"},
    {title: "email", field: "email"},
    {title: "Role", field: "role"},

  ];
  const [data, setData] = useState([]); //table data

  //for error handling
  const [iserror, setIserror] = useState(false);
  const [errorMessages, setErrorMessages] = useState([]);

  // componentDidMount()

  useEffect(() => {
    api
        .get('https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json')
        .then(res => {
          setData(res.data);
          console.log(res.data);
        })
        .catch(error => {
          console.log("Error");
        });
  }, []);

  const onRowUpdate = (newData, oldData) =>
      new Promise((resolve, reject) => {
        //validation
        let errorList = [];
        setIserror(false);
        if (newData.name === "") {
          errorList.push("Please enter  name");
        }
        if (newData.role === "") {
          errorList.push("Please enter role");
        }
        if (newData.email === "" || validateEmail(newData.email) === false) {
          errorList.push("Please enter a valid email");
        }
        if (errorList.length < 1) {
          // Copy current state data to a new array
          const dataUpdate = [...data];
          // Get edited row index
          const index = oldData.tableData.id;
          // replace old data
          dataUpdate[index] = newData;
          // update state with the new array
          setData([...dataUpdate]);
          resolve();
        } else {
          setErrorMessages(errorList);
          setIserror(true);
          resolve();
        }

      });

  const onRowAdd = newData =>
      new Promise((resolve, reject) => {
        let errorList = [];
        setIserror(false);
        if (newData.name === undefined) {
          errorList.push("Please enter name");
        }
        if (newData.role === undefined) {
          errorList.push("Please enter a role");
        }
        if (newData.email === undefined || validateEmail(newData.email) === false) {
          errorList.push("Please enter a valid email");
        }
        if (errorList.length < 1) {
          let dataToAdd = [...data];
          dataToAdd.push(newData);
          setData(dataToAdd);
          resolve();
        } else {
          setErrorMessages(errorList);
          setIserror(true);
          resolve();
        }
      });

  const onRowDelete = oldData =>
      new Promise((resolve, reject) => {
        setIserror(false);
        const dataDelete = [...data];
        const index = oldData.tableData.id;
        dataDelete.splice(index, 1);
        setData([...dataDelete]);
        resolve();
      });

  return (
      <div className="App">
        <Grid container spacing={1}>

          <Grid item xs={12}>
            <div data-testid="form">
              {iserror && (
                  <Alert severity="error">
                    {errorMessages.map((msg, i) => {
                      return <div key={i}>{msg}</div>;
                    })}
                  </Alert>
              )}
            </div>
            <MaterialTable
                data-testid= "material-ui"
                title="Admin UI"
                columns={columns}
                data={data}
                icons={tableIcons}
                options={{
                  selection: true
                }}
                editable={{
                  isEditable: rowData => true,
                  isDeletable: rowData => true,

                  onRowUpdate: onRowUpdate,
                  onRowAdd: onRowAdd,
                  onRowDelete: onRowDelete
                }}
            />
          </Grid>
        </Grid>
      </div>
  );
}

export default App;
