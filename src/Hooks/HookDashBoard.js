import React, {useState, useRef} from 'react';


export default (
    _open,
    _initialBc,
    _openTab,
    _message,
    _estadoProgress,
    _buffer,
    _ipfss,
    _sm,
    _progress,
    _Modal

)=>{

    const [open, setOpen] = useState(_open);
    const cancelButtonRef = useRef();
    const [initialBc, setInitialBc] = useState(_initialBc);
    //  const [Buffe,setBuffer]=useState(null );
    const [openTab, setOpenTab] = React.useState(_openTab);
  
    const [message, setMessage] = useState(_message);
    const [estadoProgress, setestadoProgress] = useState(_estadoProgress);
  
    const [buffer, setBuffer] = useState(_buffer);
    const [ipfss, setIpfs] = useState(_ipfss);
    const [sm, setSm] = useState(_sm);
    const [progress, setprogress] = useState(_progress);
    const [Modal, setShowModal] = useState(_Modal);

    const hideComponent = (e) => {
        return setInitialBc({ showHidebutton: e });
    };

    const unhideCharge = (e) => {
        var neg = "";
        if (e) {
            neg = false;
        } else {
            neg = true;
        }
        return setInitialBc({ showHideCharge: e });
    };

    const hideFile = (e) => {
        return setInitialBc({ showHideFile: e });
    };

    const hideProgresss = (e) => {
        return setInitialBc({ showHideProgress: e });
    };

    const resetForm = () => {
        setInitialBc({
            Hash: "",
            contract: null,
            buffer: null,
            web3: null,
            account: null,
            file: null,
            showHidebutton: false,
        });
        setBuffer("");
        setSm([]);
        // MY COMICION
        window.localStorage.setItem("payed", 0);
    }
    
    const goToMetamask =() =>{
        setInitialBc({
            show: true,
            success: false,
            message:
            "No cuentas con metamask,te estamos redireccionando al sitio oficial para que procedas con la descarga",
        });
    }

    const AddInfoInitialBc = (obj = {}) => {
        setInitialBc({
            ...initialBc,
            ...obj
          });
    }

    const AddInfoModal = (obj = {}) => {
        setShowModal({
            ...initialBc,
            ...obj
        });
    }

    const FileName = (file) =>{
        AddInfoInitialBc(
            {
                namepdf: file,
                showImg: true,
            }
        );
    }

    const ModalAlert = (menssage) =>{
        AddInfoModal(
            {
                show: true,
                success: false,
                message: menssage,
            }
        );
    }
    const ModalSucces = (menssage) =>{
        AddInfoModal(
            {
                show: true,
                success: true,
                message: menssage ///"Ya se pagó la comision. Seleccione un Documento",
            }
        );
    }

    // NEW

    const SelectNetworkTryAgain = () =>{
        AddInfoInitialBc(
            {
                show: true,
                success: false,
                message: "Selecciona la red e intentalo de nuevo",
                disabled: true,
            }
        );
    }

    const RemoveLoadImage = () =>{
        AddInfoInitialBc(
            {
                showHideCharge: false 
            }
        );
        
    }
    const BufferUndefined= () =>{
        AddInfoInitialBc(
            {
                buffer: undefined,
            }
        );
    }

    const showImgValidar  = (Validar) => {
        AddInfoInitialBc(
            {
                Validado: "",
                showImg: true,
                Validar
            }
        );
    }

    const Validado = () =>{
        AddInfoInitialBc(
            {
                Validado: "",
            }
        );

    }



    return{
        setOpen,
        cancelButtonRef,
        setInitialBc,
        setOpenTab,
        setMessage,
        setestadoProgress,
        setBuffer,
        setIpfs,
        setSm,
        setprogress,
        setShowModal,

        open,
        initialBc,
        openTab,
        message,
        estadoProgress,
        buffer,
        ipfss,
        sm,
        progress,
        Modal,
        setOpen,

        hideComponent,
        unhideCharge,
        hideFile,
        hideProgresss,
        resetForm,
        goToMetamask,
        SelectNetworkTryAgain,
        RemoveLoadImage,

        ModalAlert,
        ModalSucces,
        FileName,
        BufferUndefined,
        showImgValidar,
        Validado,
        AddInfoInitialBc,
        AddInfoModal

    }

}

