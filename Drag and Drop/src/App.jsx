import { Button, Upload, message, Spin } from "antd";
import { useState } from "react";
import UploadImage from "./assets/Upload.png";

export default function App() {
  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);

  const handleUpload = () => {
    if (fileList.length > 0) {
      setUploading(true);
      setTimeout(() => {
        setUploading(false);
        message.success("Files successfully uploaded");
        console.log("Files successfully uploaded:", fileList);
        setFileList([]); // Clear the file list after upload
      }, 2000);
    } else {
      message.warning("No files to upload.");
      console.log("No files to upload.");
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <div className="w-200 h-150 rounded-4xl shadow-2xl" style={{ padding: "20px", backgroundColor: "#fff" }}>
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
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "auto",
            }}
          >
            {!uploading && (
              <Upload.Dragger
                className="w-xl h-64"
                multiple
                listType="picture"
                showUploadList={{ showRemoveIcon: true }}
                accept=".xls,.png,.csv"
                beforeUpload={(file) => {
                  setFileList((prevList) => [...prevList, file]);
                  return false;
                }}
              >
                <img
                  src={UploadImage}
                  alt="Upload"
                  className="size-18"
                  style={{ display: "block", margin: "0 auto" }}
                />
                <h1
                  className="font-bold text-[20px] mt-3 font-sans text-[#0F5862]" 
                >
                  Browse a CSV file to Upload
                </h1>
                <p className="font-sans text-[16px] text-[#AEAEAE]">
                  or drag and drop it here
                </p>
              </Upload.Dragger>
            )}
            {uploading && (
              <div className="w-xl h-64 flex flex-col justify-center items-center rounded-xl" style={{ backgroundColor: "rgba(255, 177, 0, 0.1)", borderColor: "#ffb100", borderWidth: "3px", borderStyle:"dashed" }}>
                <Spin size="large">
                  <h1 className="mt-20 text-[20px] text-[#0F5862]">Uploading...</h1>
                </Spin>
              </div>
            )}
          </div>

          {/* Hide text instructions completely when uploading or when files are present */}
          {!uploading && fileList.length === 0 && (
            <>
              <div className="mt-8">
                <h2 className="text-[16px] font-bold text-[#0F5862] mb-2">
                  Please note the following steps before proceeding.
                </h2>
                <ul className="list-none">
                  <li className="mb-2">
                    1. Ensure your file is saved with the extension .csv before
                    uploading.
                  </li>
                  <li className="mb-2">2. Make sure your file has correct column headers.</li>
                  <li>
                    3. Upload a CSV file with at least 500 records. You can download
                    the sample template.
                  </li>
                </ul>
              </div>
            </>
          )}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "20px"}}>
            {!uploading && fileList.length === 0 && (
              <Button href="./assets/upload.png" download="./assets/upload.png" target='_blank'>
                Download CSV Template
              </Button>
            )}
            {!uploading && fileList.length > 0 && (
              <Button onClick={handleUpload} disabled={fileList.length === 0}>
                Submit
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
