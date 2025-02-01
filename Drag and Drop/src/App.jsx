import {Button, Spin, Upload} from "antd"

export default function App() {
  return(
    <>
    <div style= {{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh"
                }}>
      <Upload.Dragger multiple listType='picture' action={'http://localhost:8000/fileUpload'}
       showUploadList={{showRemoveIcon:true}}
       accept=".xsl,.png,.csv"
       beforeUpload={(file) => {
          console.log(file)
          return false
       }}
       defaultFileList={[{
        uid:'abc',
        name:'file.png',
        status:'uploading',
        percent:50,
        url:"https://www.google.com",
       }]}
       iconRender={()=>{
        return <Spin></Spin>
       }}
       progress = {{
        strokeWidth:3,
        strokeColor:{
          "0%":"#108ee9",
          "100%":"#87d068",
          
        },
        style: {top:12},
       }}
       >
          Drag files here OR
          <br></br>
        <Button>Click Upload</Button>
      </Upload.Dragger>
    </div>
    </>
  );
}
