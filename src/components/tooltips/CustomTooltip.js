import React from 'react'
import InfoIcon from '@mui/icons-material/Info'
import Tooltip from '@mui/material/Tooltip'

export default function CustomTooltip({children}) {
  return (
    <Tooltip 
        className='custom-tooltip'
        placement="right-end"
        title={
                <React.Fragment>
                    {children}
                </React.Fragment>
                } 
        >
        <InfoIcon/>
    </Tooltip>
  )
}