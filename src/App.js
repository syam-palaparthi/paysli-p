import React, { useState } from 'react';
import { read, utils } from 'xlsx';
import './App.css';
import ReactDOMServer from 'react-dom/server';
import html2pdf from 'html2pdf.js/dist/html2pdf.min';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [excelData, setExcelData] = useState([]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);

    if (file) {
      const reader = new FileReader();
      console.log(reader)
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = read(data, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const parsedData = utils.sheet_to_json(worksheet, { header: 1 });

        const headers = parsedData[0];
        const rows = parsedData.slice(1);

        const formattedData = rows.map((row) => {
          const rowData = {
            EmployeeNo: row[0],
            Name: row[1],
            JoinDate: row[2],
            Designation: row[3],
            Department: row[4],
            Location: row[5],
            EffectiveWorkDays: row[6],
            DaysInMonth: row[7],
            BankName: row[8],
            BankAccountNo: row[9],
            PFNo: row[10],
            PFUAN: row[11],
            ESINo: row[12],
            PANNo: row[13],
            LOP: row[14],
            Basic: row[15],
            HRA: row[16],
            MedicalAllowance: row[17],
            TransportAllowance: row[18],
            SpecialAllowance: row[19],
            PF: row[20],
            ProfTax: row[21],
            // Continue for other columns...
          };
          return rowData;
        });

        setExcelData(formattedData);
      };
      reader.readAsArrayBuffer(file);
    }
  };

  return (
    <div className="App">
      <h1>Upload and Render Excel Data</h1>
      <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />

      {excelData.length > 0 && <Payslip excelData={excelData[0]} />}
      {excelData.length > 0 && <Down data={excelData[0]} payslipData={excelData} />}
    </div>
  );
}

const Payslip=({excelData})=>{
  return (<>
    <table border={1}>
    <div id="company_name">
              <p colSpan="2"><h2>Mantra Technologies Pvt. Ltd.</h2></p>
              <p class="img-logo"><img src="https://naukrirecruiter.naukri.com/profilePic/getpic?pid=1579858995rp3506888_medium4"/> 1st Floor, Vertex Corporate buid. Jubilee Enclave, HITEX Madhapur, HYderabad</p>
              <p >Pay Slip of the Month</p>
              </div>
          <tbody clss="main_con">
            <tr>
              <td class="width">Name</td>
              <td>{excelData.Name}</td>
            </tr>
            <tr>
              <td>Join Date</td>
              <td>{excelData.JoinDate}</td>
            </tr>
            <tr>
              <td>Designation</td>
              <td>{excelData.Designation}</td>
            </tr>
            <tr>
              <td>Department</td>
              <td>{excelData.Department}</td>
            </tr>
            <tr>
              <td>Location</td>
              <td>{excelData.Location}</td>
            </tr>
            <tr>
              <td>Effective Work Days</td>
              <td>{excelData.EffectiveWorkDays}</td>
            </tr>
            <tr>
              <td>Days In Month</td>
              <td>{excelData.DaysInMonth}</td>
            </tr>
            <tr>
              <td colSpan="2">Bank Information</td>
            </tr>
            <tr>
              <td>Bank Name</td>
              <td>{excelData.BankName}</td>
            </tr>
            <tr>
              <td>Bank Account No</td>
              <td>{excelData.BankAccountNo}</td>
            </tr>
            <tr>
              <td>PF No</td>
              <td>{excelData.PFNo}</td>
            </tr>
            <tr>
              <td>PF UAN</td>
              <td>{excelData.PFUAN}</td>
            </tr>
            <tr>
              <td>ESI No</td>
              <td>{excelData.ESINo}</td>
            </tr>
            <tr>
              <td>PAN No</td>
              <td>{excelData.PANNo}</td>
            </tr>
            <tr>
              <td>LOP</td>
              <td>{excelData.LOP}</td>
            </tr>
            <tr>
              <td colSpan="2">Earnings</td>
            </tr>
            <tr>
              <td>Basic</td>
              <td>{excelData.Basic}</td>
            </tr>
            <tr>
              <td>HRA</td>
              <td>{excelData.HRA}</td>
            </tr>
            <tr>
              <td>Medical Allowance</td>
              <td>{excelData.MedicalAllowance}</td>
            </tr>
            <tr>
              <td>Transport Allowance</td>
              <td>{excelData.TransportAllowance}</td>
            </tr>
            <tr>
              <td>Special Allowance</td>
              <td>{excelData.SpecialAllowance}</td>
            </tr>
            <tr>
              <td colSpan="2">Deductions</td>
            </tr>
            <tr>
              <td>PF</td>
              <td>{excelData.PF}</td>
            </tr>
            <tr>
              <td>Prof Tax</td>
              <td>{excelData.ProfTax}</td>
            </tr>
            <tr>
              <td colSpan="2">Total Earnings</td>
            </tr>
            <tr>
              <td colSpan="2">{/* Total Earnings Calculation */}</td>
            </tr>
            <tr>
              <td colSpan="2">Total Deductions</td>
            </tr>
            <tr>
              <td colSpan="2">{/* Total Deductions Calculation */}</td>
            </tr>
          </tbody>
        </table>
  </>)
}

const Down=(props)=>{
  let data=props.data
  let paySlipData=props.payslipData
    const pdfJSX=()=>{
      return(
        <Payslip excelData={data} />
      )
    }
    const allPdfJSX = () => {
      return paySlipData.map((item)=>{
        return <>
        <Payslip excelData={item}/>
        </>
      })
    }

    const printHandler=()=>{
      const printElement=ReactDOMServer.renderToString(pdfJSX());
     // const printelement=pdfJSX();
      html2pdf().from(printElement).save();
    }
      const printAll=()=>{
        const printElement=ReactDOMServer.renderToString(allPdfJSX());
        html2pdf().from(printElement).save();
    }


    return (
      <div className="App">
        <button onClick={printHandler}>Print</button>
        <button onClick={printAll}>printAll</button>
      </div>
    )
    
}
export default App;
