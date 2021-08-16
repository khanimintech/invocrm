import React from 'react';




const OverviewBox = ({status, icon, count, color})=> {
    return (
        <div className="overview-box" style={{ backgroundColor:  color}} >
            <div className="overview-box-first-row">
                <span>{count}</span>
                {icon}
            </div>
            <div className="overview-box-second-row">
                <span>{status}</span>
            </div>
        </div>
    )
}


export default OverviewBox;