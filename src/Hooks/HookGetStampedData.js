
    import {useState} from 'react';
    
    export default (
        _id,//props
        _txHash,
        _date_pinned,
        _owner,
        _name,
        _tokenid,
        _explorer
    ) => {
        // const [IpfsHash, setIpfsHash] = useState(props.match.params.id);
        const [IpfsHash, setIpfsHash] = useState(_id);
        // const [TxHash, setTxHash] = useState(result.rows[0].metadata.keyvalues.txHash);
        const [TxHash, setTxHash] = useState(_txHash);
        // const [DateCreated, setDateCreated] = useState(result.rows[0].date_pinned);
        const [DateCreated, setDateCreated] = useState(_date_pinned);
        // const [Owner, setOwner] = useState(result.rows[0].metadata.keyvalues.owner);
        const [Owner, setOwner] = useState(_owner);
        // const [filename, setfilename] = useState(result.rows[0].metadata.name);
        const [filename, setfilename] = useState(_name);
        // const [tokenid, settokenid] = useState(result.rows[0].metadata.keyvalues.tokenid);
        const [tokenid, settokenid] = useState(_tokenid);
        // const [explorer, setexplorer] = useState(result.rows[0].metadata.keyvalues.explorer);
        const [explorer, setexplorer] = useState(_explorer);

        const reset = () =>{
            setIpfsHash("");
            setTxHash("");
            setDateCreated("");
            setOwner("");
            setfilename("");
            settokenid("");
            setexplorer("");
          };

        return{
            reset,
            setIpfsHash,
            setTxHash,
            setDateCreated,
            setOwner,
            setfilename,
            settokenid,
            setexplorer,
            
            IpfsHash,
            TxHash,
            DateCreated,
            Owner,
            filename,
            tokenid,
            explorer,
        }
    }