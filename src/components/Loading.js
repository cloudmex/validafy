import React,{useState} from 'react';

export const Loading = ({num=100}) => {

    const [load, setload] = useState(num);

     setTimeout(() => {
        setload(load +1);
        console.log(ff(load));
    }, 1000);
    
    const ff = (x) => (x === true ? 100 : (1+(-1/((x*x/1000) +1)))*100);

return(
        <div className="barra">
            <div className="carga" style={{width: ff(load)+"%"}}>
                {parseInt(ff(load))}
            </div>
        </div>
    )
}