import React, { useState, useEffect } from 'react';
import { Form, FormGroup, FormSelect, Button, Table, Container, Row, Col} from 'react-bootstrap';
import { isNameValid, getLocations } from './mock-api/apis'; 

const MyForm = () => {
  const [name, setName] = useState('');
  const [validationMessage, setValidationMessage] = useState(''); // State for validation message
  const [isLoading, setIsLoading] = useState(false); // State for loading indicator
  const [locations, setLocations] = useState([]); //state for location
  const [selectedLocation, setSelectedLocation] = useState(''); // state for selected location
  const [tableData, setTableData] = useState([]); //state for table entries


  const handleChange = (event) => {
    event.preventDefault();
    setName(event.target.value);
    setValidationMessage(''); // Clear validation message on input change
  }; //This is triggered when user enters any character in input field 

  const handleLocationChange = (event) => {
    setSelectedLocation(event.target.value);
  };

  const validateName = async (name) => {
    setIsLoading(true); // Show loading indicator while checking API

    try {
      const isValid = await isNameValid(name); // Use the imported function
      setValidationMessage(isValid ? 'this name has already been taken':'' ); // Set message based on validity
    } catch (error) {
      console.error('Error checking name:', error);
      setValidationMessage('An error occurred. Please try again later.'); // Handle API errors
    } finally {
      setIsLoading(false); // Hide loading indicator
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => validateName(name), 1000); // Debounce validation by 1000ms
    return () => clearTimeout(timer); // Cleanup function to prevent memory leaks
  }, [name]); // Runs this effect only when name changes in input filed

  useEffect(() => {
    const fetchLocations = async () => {
      const fetchedLocations = await getLocations();
      setLocations(fetchedLocations);
    };

    fetchLocations();
  }, []); //this effect runs to fetch location list from api


  const addEntry = () => {
    if (name && selectedLocation) {
      setTableData([...tableData, { name, location: selectedLocation }]);
      setName('');
      setSelectedLocation('');
    } else {
      alert('Please enter both Name and Location');
    }
  }; //this function add entries to table when add button is clicked

  const clearForm = () => {
    setName('');
    setSelectedLocation('');
    setValidationMessage('');
    // setLocations('');
    setTableData([]);
  }; // Clears all the form fields including table entries
  
return (
    <Form>
      <FormGroup controlId="formBasicName">
      <Container>
      <Row className='P-10'>
      <Col className='col-2'>
      <Form.Label className='.label'>Name</Form.Label> 
      </Col>
      <Col>
      <Form.Control  type="text"
          placeholder="Enter your name"
          value={name}
          onChange={handleChange}
          isInvalid={!!validationMessage} // Set isInvalid based on validation message
          disabled={isLoading} // Disable input while loading
        />
        <Form.Control.Feedback type="invalid">{validationMessage}</Form.Control.Feedback>
        {isLoading && <p>Checking availability...</p>}
        </Col>
        </Row>
        <br />
        <Row>
        <Col className='col-2'>
        <Form.Label className=".label">Location</Form.Label>
        </Col>
        <Col>
        <FormSelect aria-label="Location Select" value={selectedLocation} onChange={handleLocationChange}>
          <option key="default" value="">Select Location</option>
          {locations.map((location) => (
            <option key={location} value={location}>
              {location}
            </option>
          ))}
        </FormSelect>
        </Col>
        </Row>
        <br />
        <br />
        <Container fluid>
        <Row className=" justify-content-end .btn-list">
        <Button className='.btn' variant="primary" onClick={addEntry}>
          Add
        </Button>
        <Button className='.btn' variant="secondary" onClick={clearForm}>
          Clear
        </Button>
        </Row>
        </Container>
        
        <br />
        <Row>
        <Table className="table table-bordered">
        <thead>
          <tr>
            <th>Name</th>
            <th>Location</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((entry) => (
            <tr key={entry.name}>
              <td>{entry.name}</td>
              <td>{entry.location}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      </Row>
      </Container>
      </FormGroup>
    </Form>
  );
};

export default MyForm;