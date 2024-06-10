import { useRef, useState } from 'react';

const Uploader = (props) => {
    const [filename, setFilename] = useState('');
    const inputCargaRef = useRef(null);

    const handleUpload = () => {
        inputCargaRef.current.click();
    }

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        //event.target.value = null;
        if (file) {
            setFilename(file.name);
            props.onClick(file);

        }
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
                    <h5 className='blue strong'>
                        {props.children}
                    </h5>
                    <h5 className='blue filename'>{filename}</h5>
                </div>
            </div>
            {filename && <button className='btn-close' onClick={removeItemHandler}>x</button>}
        </div>
    );
}

export default Uploader;