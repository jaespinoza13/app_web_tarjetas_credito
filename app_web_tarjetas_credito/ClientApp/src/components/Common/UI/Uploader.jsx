import { useRef, useState } from 'react';

const Uploader = (props) => {
    const [filename, setFilename] = useState('');
    const inputCargaRef = useRef(null);

    const handleUpload = () => {
        inputCargaRef.current.click();
    }

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setFilename(file.name);
            props.onClick(file);
        }
        inputCargaRef.current.value = null;
    };

    const removeItemHandler = () => {
        props.onRemoveFile();
        setFilename('');
    }


    return (
        <div className="f-row uploader">
            <div className={"btn_mg btn_mg__toggler active"} onClick={handleUpload}>
                <img className='mr-2' src="icons/menu.png" alt="" />
                <input type="file" accept=".pdf" ref={inputCargaRef} style={{ display: 'none' }} onChange={handleFileChange} />
                <div className='upload-info'>
                    <h4 className='blue strong'>
                        {props.children}
                    </h4>
                    <h6 className='blue filename'>{filename.substring(0, 22)}</h6>
                </div>
            </div>
            {filename && <button className='btn-close' onClick={removeItemHandler}>x</button>}
        </div>
    );
}

export default Uploader;