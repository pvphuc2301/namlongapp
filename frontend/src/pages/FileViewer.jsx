import { useParams } from "react-router-dom";

const FileViewer = () => {
    const { fileName } = useParams();

    return (
        <object data={fileName} type="application/pdf" style={{
            height: '100vh',
            width: '100vw',
        }}>
            <embed src={fileName} type="application/pdf" />
        </object>
    )
}

export default FileViewer;