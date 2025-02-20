import React, { useState } from "react";
import { Button, Upload, message, Spin, Table } from "antd";
import { DeleteOutlined, FileOutlined } from "@ant-design/icons";
import Papa from "papaparse";
import UploadImage from "./assets/Upload.png";

export default function App() {
  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [csvData, setCsvData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [isFileListVisible, setIsFileListVisible] = useState(false);
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);

  const handleFileParse = (file) => {
    if (file.type !== "text/csv") {
      message.error("Please upload a valid CSV file.");
      return;
    }

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        if (result.data.length > 0) {
          setCsvData((prevData) => [...prevData, { fileName: file.name, data: result.data }]);
          setIsFileListVisible(true);
          message.success("File uploaded successfully! Review it below.");
        } else {
          message.error("No data found in the CSV file. Returning to page 1.");
          setIsFileListVisible(false);
          setIsPreviewVisible(false); 
        }
      },
      error: (err) => {
        message.error("Failed to parse the file. Please check the format.");
        console.error(err);
      },
    });
  };

  const handleUpload = () => {
    if (fileList.length > 0) {
      
      const isEmptyCell = csvData.some(fileData => 
        fileData.data.some(row => 
          Object.values(row).some(cell => cell.trim() === "")
        )
      );
  
      if (isEmptyCell) {
        message.error("Please fill all cells before uploading.");
        return;
      }
  
      setUploading(true);
      setTimeout(() => {
        message.success("Files uploaded successfully!");
        
    
        console.log("Uploaded CSV Data:", csvData);
  
        setUploading(false);
        setFileList([]);
        setCsvData([]);
        setColumns([]);
        setIsFileListVisible(false);
        setIsPreviewVisible(false);
      }, 4000);
    } else {
      message.warning("No files to upload.");
    }
  };

  const handleRemoveFile = (file) => {
    const newFileList = fileList.filter((item) => item.uid !== file.uid);
    setFileList(newFileList);

    // If the file list is empty, go back to page 1
    if (newFileList.length === 0) {
      setIsFileListVisible(false);
      setIsPreviewVisible(false);
    }
  };

  const handleProceedToPreview = () => {
    if (csvData.length > 0) {
      const headers = Object.keys(csvData[0].data[0] || {});
      const tableColumns = headers.map((header) => ({
        title: header,
        dataIndex: header,
        key: header,
        width: 150,
        ellipsis: true,
        editable: true,
        render: (text, record, index) => {
          const isEmpty = text === "N/A" || text.trim() === "";

          return (
            <div
              style={{
                padding: "8px",
                borderRadius: "4px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: "150px",
                cursor: "text",
                border: isEmpty ? "2px solid red" : "1px solid #d9d9d9", // Add red border if empty
              }}
              title={text}
              contentEditable={true}
              onClick={(e) => {
                e.target.style.overflow = "visible";
                e.target.style.whiteSpace = "normal";
              }}
              onBlur={(e) => {
                e.target.style.overflow = "hidden";
                e.target.style.whiteSpace = "nowrap";
                const newText = e.target.innerText;

                if (newText.trim() === "") {
                  message.error("Cell cannot be empty.");
                  e.target.innerText = text;
                  return;
                }

                const regex = /^[a-zA-Z0-9\s.,/#!$%^&*;:{}=\-_`~()@+?><[]*$/;

                if (regex.test(newText)) {
                  const newData = [...csvData];
                  const fileDataIndex = Math.floor(index / newData[0].data.length);
                  const rowIndex = index % newData[0].data.length;
                  newData[fileDataIndex].data[rowIndex][header] = newText;
                  setCsvData(newData);
                } else {
                  message.error("Invalid input. Only alphanumeric characters, spaces, and common symbols are allowed.");
                  e.target.innerText = text;
                }
              }}
              suppressContentEditableWarning={true}
            >
              {text}
            </div>
          );
        },
      }));

      setColumns(tableColumns);
      setIsPreviewVisible(true);
      setIsFileListVisible(false);
    }
  };

  const handleBackToFileList = () => {
    setIsFileListVisible(true);
    setIsPreviewVisible(false);
  };

  const handleBackToUpload = () => {
    setIsFileListVisible(false);
    setIsPreviewVisible(false);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        padding: "20px",
      }}
    >
      <div
        className="w-full max-w-2xl rounded-4xl shadow-2xl"
        style={{ padding: "40px", backgroundColor: "#fff" }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            fontFamily: "'Open Sans', sans-serif",
          }}
        >
          {/* Step 1: Show Upload Area and Instructions */}
          {!isFileListVisible && !isPreviewVisible && (
            <div>
              <Upload.Dragger
                className="w-full h-72"
                multiple={true}
                listType="picture"
                showUploadList={{ showRemoveIcon: true }}
                accept=".csv"
                beforeUpload={(file) => {
                  setFileList((prevFileList) => [...prevFileList, file]);
                  handleFileParse(file); 
                  return false;
                }}
              >
                <img
                  src={UploadImage}
                  alt="Upload"
                  className="size-18"
                  style={{ display: "block", margin: "0 auto" }}
                />
                <h1 className="font-bold text-[20px] mt-3 font-sans text-[#0F5862]">
                  Browse CSV Files to Upload
                </h1>
                <p className="font-sans text-[16px] text-[#AEAEAE]">
                  or drag and drop them here
                </p>
              </Upload.Dragger>

              <div className="mt-10">
                <h2 className="text-[16px] font-bold text-[#0F5862] mb-2">
                  Please note the following steps before proceeding.
                </h2>
                <ul className="list-none">
                  <li className="mb-2">
                    1. Ensure your files are saved with the extension .csv before uploading.
                  </li>
                  <li className="mb-2">
                    2. Make sure your files have correct column headers.
                  </li>
                  <li>
                    3. Upload CSV files with at least 500 records each.
                  </li>
                </ul>
              </div>
              <Button
                href="./assets/upload.png"
                download="./assets/upload.png"
                target="_blank"
                className="mt-9"
                style={{ backgroundColor: "#ffb100", color: "white", border: "none" }}
              >
                Download CSV Template
              </Button>
            </div>
          )}

          {/* Step 2: Show uploaded file list with custom file removal logic */}
          {isFileListVisible && !uploading && (
            <div style={{ width: "100%", marginTop: "20px" }}>
              <div className="mt-4">
                <h3 className="font-bold text-[#0F5862]">Uploaded Files:</h3>
                <ul style={{ listStyleType: "none", padding: 0, marginTop:"20px" }}>
                  {fileList.map((file) => (
                    <li
                      key={file.uid}
                      className="mb-2"
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "10px",
                        border: "1px solid #e0e0e0",
                        borderRadius: "4px",
                        marginBottom: "5px",
                      }}
                    >
                      <span style={{ display: "flex", alignItems: "center" }}>
                        <FileOutlined style={{ marginRight: "8px", color: "#0F5862" }} />
                        {file.name}
                      </span>
                      {/* Delete button */}
                      <DeleteOutlined
                        style={{ color: "#ff4d4f", cursor: "pointer" }}
                        onClick={() => handleRemoveFile(file)}
                      />
                    </li>
                  ))}
                </ul>
              </div>

              <Button
                className="mt-4"
                onClick={handleBackToUpload}
                style={{
                  backgroundColor: "#0F5862",
                  color: "white",
                  border: "none",
                  marginRight: "10px",
                }}
              >
                Back
              </Button>
              <Button
                className="mt-4"
                onClick={handleProceedToPreview}
                style={{ backgroundColor: "#ffb100", color: "white", border: "none" }}
              >
                Proceed to Preview
              </Button>
            </div>
          )}

          {/* Step 3: Show file preview */}
          {isPreviewVisible && !uploading && (
            <div style={{ width: "100%", marginTop: "20px" }}>
              <h2 className="text-lg mb-5 font-bold text-[#0F5862]">File Preview</h2>
              <Table
                dataSource={csvData.length > 0 ? csvData[0].data : []}
                columns={columns}
                rowKey={(record, index) => index}
                pagination={{ pageSize: 5 }}
                style={{ 
                  backgroundColor: "#f9f9f9", 
                  borderRadius: "8px",
                  width: "100%",
                }}
                scroll={{ x: 'max-content' }} // Enable horizontal scrolling if needed
                bordered
              />
              <Button
                className="mt-4"
                onClick={handleBackToFileList}
                style={{
                  backgroundColor: "#0F5862",
                  color: "white",
                  border: "none",
                  marginRight: "10px",
                }}
              >
                Back
              </Button>
              <Button
                className="mt-4"
                onClick={handleUpload}
                disabled={uploading}
                style={{
                  backgroundColor: "#ffb100",
                  color: "white",
                  border: "none",
                  cursor: uploading ? "not-allowed" : "pointer",
                }}
              >
                Submit
              </Button>
            </div>
          )}

          {/* Uploading state */}
          {uploading && (
            <div
              className="w-full h-64 flex flex-col justify-center items-center rounded-xl"
              style={{
                backgroundColor: "rgba(255, 177, 0, 0.05)",
                borderColor: "#ffb100",
                borderWidth: "3px",
                borderStyle: "dashed",
                position: "relative",
                transition: "all 0.3s ease",
              }}
            >
              <div className="text-center">
                <Spin 
                  size="large" 
                  style={{ 
                    color: "#ffb100",
                    marginBottom: "20px"
                  }} 
                />
                <h1 
                  style={{ 
                    fontWeight: "bold", 
                    fontSize: "24px", 
                    color: "#0F5862",
                    marginTop: "20px"
                  }}
                >
                  Uploading your files...
                </h1>
                <p 
                  style={{ 
                    color: "#AEAEAE",
                    marginTop: "10px",
                    fontSize: "16px"
                  }}
                >
                  Please wait while we process your data
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}