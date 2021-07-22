export default async (event,initialBc,setInitialBc,sameNetwork,addNetwork,ValidafySM,wait) => {
    
    ///browser detection
    event.preventDefault();
    setInitialBc({ ...initialBc, showHideCharge: true, showImg: false });

    try {
      //tratamos de cargar el documento que el usuario eligio
      const file = event.target.files[0];
      if (file === undefined || !event.target.files) {
        window.location.reload();
        return "recargando pagina";
      }
      //confirmamos que la red seleccionada y la
      if (!(await sameNetwork())) {
        setInitialBc({
          ...initialBc,
          show: true,
          success: false,
          message: "Cambia de red",
          disabled: true,
        });

        //se sale del bucle hasta que la red the metamask y la llave network en localstorage son identicas

        while (!( await sameNetwork())) {
          //espera 200 milisegundo para volver a llamar addNetwork evita que no se muestre el modal de metamask
          wait(200);
        //   console.log();
          await addNetwork(parseInt(localStorage.getItem("network"))).catch();
        }

        setInitialBc({
          ...initialBc,
          show: false,
          showHideCharge: true,
        });
      }

      // sm address
      let tokenNetworkData =
        ValidafySM.networks[localStorage.getItem("network")];
      //instantiate the contract object
      let contract = new window.web3.eth.Contract(
        ValidafySM.abi,
        tokenNetworkData.address
      );
      //nos permite cargar el archivo
      const reader = new window.FileReader();
      reader.readAsArrayBuffer(file);
      reader.onloadend = () => {
        //obtener el hash de ipfs ,una vez que cargo el archivo
        window.ipfs
          .add(Buffer(reader.result), { onlyHash: true })
          .then(async (result) => {
            //comprobar si el hash se encuetra dentro de algun tokenuri
            let ishashed = await contract.methods
              .IsHashed(result[0].hash)
              .call();
            //console.log(result[0].hash);
            let estado = "Documento no estampado";
            if (ishashed) estado = "Documento Valido";
            setInitialBc({
              ...initialBc,
              show: true,
              success: ishashed,
              message: estado,
              namepdf: file.name,
              showImg: true,
              disabled: false,
            });
          });
      };
    } catch (err) {
      window.alert(err.message || err);
      return;
    }
  };