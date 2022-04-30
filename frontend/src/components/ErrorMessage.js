import React from 'react'
import {Alert} from 'react-bootstrap';


//  will show an error message if variant danger is provided otherwise
// it will show an info msg in blue color
const ErrorMessage = ({variant="info",children}) => {
  return (
    <Alert variant={variant} style={{fontSize:20}}>
        <strong>{children}</strong>
    </Alert>
  )
}

export default ErrorMessage;