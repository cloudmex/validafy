







  export const MatchKeys = async(sameNetwork,AddInfoInitialBc,wait,addNetwork) =>{
    
    if (!(await sameNetwork())) {
      // window.alert('Error de red,Selecciona la red de BSC para seguir.')
      AddInfoInitialBc(
        {
          show: true,
          success: false,
          message: "Selecciona la red e intentalo de nuevo",
          disabled: true,
        }
      );
     
      //se sale del bucle hasta que la red the metamask y la llave network en localstorage son identicas

      while (!(await sameNetwork())) {
        
        //espera 200 milisegundo para volver a llamar addNetwork evita que no se muestre el modal de metamask
        wait(200);
        await addNetwork(parseInt(localStorage.getItem("network"))).catch();
      }
      AddInfoInitialBc(
        {
          show: false,
          showHideCharge: true,
        }
      );
    }
  }


  export const GetContrac = async(ValidafySM) => {
    //get the actual networkid or chainid
    const ActualnetworkId = await window.ethereum.request({
      method: "net_version",
    });
    // sm address
    const tokenNetworkData = ValidafySM.networks[ActualnetworkId];
    //instantiate the contract object
    //le quite el new 
    // console.log(ValidafySM.abi);
    
      return window.web3.eth.Contract(
      ValidafySM.abi,
      tokenNetworkData.address
    );
  }
  

  export const GetIpfs = async (file,ipfs,reader,AddInfoModal,AddInfoInitialBc,ValidafySM) => {

    ipfs
                .add(Buffer(reader.result), { onlyHash: true })
                .then(async (result) => {
                  //comprobar si el hash se encuetra dentro de algun tokenuri
                  const contrac = await GetContrac(ValidafySM);
                  const ishashed = await contrac.methods.IsHashed(result[0].hash).call();
                    
                  //console.log(result[0].hash);
                  let estado = "Documento no estampado";
                  if (ishashed) estado = "Documento Valido";
                  
                  AddInfoModal(
                    {
                    show: true,
                    success: ishashed,
                    message: estado,
                  });
    
                  AddInfoInitialBc(
                    {
                      namepdf: file.name, 
                      showImg: true 
                    }
                  );
                });
  }

  export const FileLoad = (file, ipfs, AddInfoModal,AddInfoInitialBc,ValidafySM) => {
    // await GetContrac(ValidafySM);
    //nos permite cargar el archivo
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = async() => {
      //obtener el hash de ipfs ,una vez que cargo el archivo
      GetIpfs(
        file,
        ipfs,
        reader,
        AddInfoModal,
        AddInfoInitialBc ,
        ValidafySM
      );
    }
  }

  export default async (event,unhideCharge,Web3,wait,sameNetwork,AddInfoInitialBc,AddInfoModal,addNetwork,ValidafySM,ipfs) => {

    // console.log( window.ethereum, "<= Este el WINDOW");
        event.preventDefault();
        ///browser detection 
        
        unhideCharge(true);
        if (window.ethereum) {
          window.web3 = new Web3(window.ethereum);
          try {
            //tratamos de cargar el documento que el usuario eligio
            const file = event.target.files[0];
            // console.log(file, " <= valor");
            if (file === undefined) {
              window.location.reload();
              // return 'recargar pagina';
            }
    
            if (!event.target.files) {
              return "no agrego ningun archivo";
            }
    
            //cambiar red
    
            const web3 = window.web3;
            // const networkId = await web3.eth.net.getId();
    
            await MatchKeys(sameNetwork,AddInfoInitialBc,wait,addNetwork);
            
            FileLoad(file, ipfs, AddInfoModal,AddInfoInitialBc,ValidafySM)
   
            
          } catch (err) {
            //   window.alert(err.message || err);
            return "Ocurrio un error en el Try";
          }
        } else {
          //no tiene metamask lo mandamos a la pagina oficial de descarga
    
          window.open("https://metamask.io/download", "_blank");
          return 'redireccionado a metamask';
        }

  }