import React, { useState } from "react";
import { Button, Upload, message, Spin } from "antd";
import UploadImage from "./assets/Upload.png";

export default function App() {
  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);

  const handleUpload = () => {
    if (fileList.length > 0) {
      setUploading(true);
      setTimeout(() => {
        message.success("File uploaded successfully!");
        console.log("Uploaded file:", fileList);
        setUploading(false);
        setFileList([]);
      }, 10000);
    } else {
      message.warning("No files to upload.");
    }
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
          {!uploading && (
            <Upload.Dragger
              className="w-full h-64"
              multiple={false}
              listType="picture"
              showUploadList={{ showRemoveIcon: true }}
              accept=".csv"
              beforeUpload={(file) => {
                setFileList([file]);
                return false;
              }}
              onRemove={() => setFileList([])}
            >
              <img
                src={UploadImage}
                alt="Upload"
                className="size-18"
                style={{ display: "block", margin: "0 auto" }}
              />
              <h1 className="font-bold text-[20px] mt-3 font-sans text-[#0F5862]">
                Browse a CSV file to Upload
              </h1>
              <p className="font-sans text-[16px] text-[#AEAEAE]">
                or drag and drop it here
              </p>
            </Upload.Dragger>
          )}
          {uploading && (
            <div
              className="w-full h-64 flex flex-col justify-center items-center rounded-xl"
              style={{
                backgroundColor: "rgba(255, 177, 0, 0.1)",
                borderColor: "#ffb100",
                borderWidth: "3px",
                borderStyle: "dashed",
                position: "relative",
              }}
            >
              <Spin size="large" tip="" style={{ position: "absolute", zIndex: 1, color: "#ffb100" }}>
                <h1 style={{ marginTop: "100px", fontWeight: "bold", fontSize: "20px", color: "#ffb100" }}>
                  Uploading...
                </h1>
              </Spin>
            </div>
          )}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginTop: "20px",
            }}
          >
            {!uploading && fileList.length === 0 && (
              <>
                <div className="mt-3">
                  <h2 className="text-[16px] font-bold text-[#0F5862] mb-2">
                    Please note the following steps before proceeding.
                  </h2>
                  <ul className="list-none">
                    <li className="mb-2">
                      1. Ensure your file is saved with the extension .csv before
                      uploading.
                    </li>
                    <li className="mb-2">
                      2. Make sure your file has correct column headers.
                    </li>
                    <li>
                      3. Upload a CSV file with at least 500 records. You can download
                      the sample template.
                    </li>
                  </ul>
                </div>
                <Button
                  href="./assets/upload.png"
                  download="./assets/upload.png"
                  target="_blank"
                  className="mt-9"
                >
                  Download CSV Template
                </Button>
              </>
            )}
            {!uploading && fileList.length > 0 && (
              <Button className="mt-20" onClick={handleUpload} disabled={uploading}>
                Submit
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}