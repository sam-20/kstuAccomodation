import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid'
import {
    Card, Carousel, Nav, Dropdown, DropdownButton, Container, Row, Col,
    Button, Collapse, Modal, Spinner, InputGroup, FormControl as RBFormControl, ListGroup,
    OverlayTrigger, Popover
} from 'react-bootstrap'
// import { Hotel, Person, DeleteIcon } from '@material-ui/icons'
// import Icon from '@material-ui/core/Icon';
import Typography from '@material-ui/core/Typography';
import HomeWorkIcon from '@material-ui/icons/HomeWork';
import AccountCircleRoundedIcon from '@material-ui/icons/AccountCircleRounded';
import PersonIcon from '@material-ui/icons/Person';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import HotelIcon from '@material-ui/icons/Hotel';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import EditIcon from '@material-ui/icons/Edit'
import DeleteIcon from '@material-ui/icons/Delete'
import SearchIcon from '@material-ui/icons/Search';
import { Paper, IconButton, Avatar } from '@material-ui/core'
// import { Page, Text, View, Document, PDFViewer } from '@react-pdf/renderer'
// import ReactPDF from '@react-pdf/renderer';
import modulevariables from '../Modulevariables'
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import FilledInput from '@material-ui/core/FilledInput';
import { FormControl as MUFormControl } from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { AsyncStorage } from 'AsyncStorage' /**asyncstorage 1 */
import Tooltip from '@material-ui/core/Tooltip';
import { Redirect } from 'react-router' /**navigation***  1 */
import Table from 'react-bootstrap/Table'
import TextField from '@material-ui/core/TextField';
import Form from 'react-bootstrap/Form'

//background image of page
import mybackground_image from '../../assets/bg5.jpg';

const server = modulevariables.applicationserver;

class Students extends Component {

    constructor(props) {
        super(props)

        /**declaring our variables */
        this.state = {
            students_table: [], /**students data are fetched into this to be displayed on the grid table */
            student_searchbox_value: '',

            display_delete_student_dialog_box: false,   /**dialog box 1 */

            /**table to temporarily store any student who's record we have clicked so that we can get the info whenever we need it */
            student_temp_info_table: [],

            /**incase we would be using a number of modals which will change only in their messages */
            display_general_modal: false,
            general_modal_message: '',

            /**when we click the edit button of the students row */
            display_student_info_modal: false,

            /**various locations to modals in the student info modal */
            display_edit_student_profile_modal: false,
            display_manage_student_profile_modal: false,
            display_manage_student_payment_modal: false,

            /**validation 1 */
            validated: false,
        }

        this.fetch_students_info = this.fetch_students_info.bind(this)
    }

    componentDidMount() {
        this.fetch_students_info()
    }

    /**validation 2 */
    handleSubmit = (event) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagtion();
        }
        this.setState({ validated: true })
    }

    /**fetch all student details from db with sql join on specific columns including their booking status, booked rooms and payment status */
    fetch_students_info() {

        fetch(server + 'fetch_students_for_admin.php', {
            method: 'POST',
            headers: {
                'Accept': 'text/plain',
                'Content-type': 'text/plain'
            },
            body: JSON.stringify({

            })
        }).then((response) => response.text())
            .then((responseJson) => {
                // console.log(responseJson)

                var jsonconvertedrows = JSON.parse(responseJson)
                var finaldata = JSON.stringify(jsonconvertedrows)

                /**if no students exist in the db */
                if (finaldata === '"no search results"') {
                    console.log('no students in the database')
                }
                else {

                    /**add a count property to be displayed under the '#' header in the table being displayed */
                    jsonconvertedrows.map(element => {
                        element.row_numbering = null;

                        return false; //include this to clear console warning
                    })

                    for (var count = 0; count < jsonconvertedrows.length; count++) {

                        /**assign our count to the ordering property
                         * we add +1 because the count starts from 0
                        */
                        jsonconvertedrows[count].row_numbering = count + 1;

                        if (jsonconvertedrows[count].student_booking_payment_status === 'F') {
                            jsonconvertedrows[count].student_booking_payment_status = 'Not paid'
                        }

                        if (jsonconvertedrows[count].student_booking_payment_status === 'T') {
                            jsonconvertedrows[count].student_booking_payment_status = 'Paid'
                        }
                    }

                    /**we can now set our feched students into the students table */
                    this.setState({ students_table: [] })
                    this.setState({ students_table: jsonconvertedrows });

                    console.log('all students: ', this.state.students_table)
                }
            })
    }

    /**handle value in the student search box */
    handleStudentsearchvalueChange = (event) => {
        this.setState({
            student_searchbox_value: event.target.value
        })
    }

    /**search student in the db */
    search_student() {
        /**removing white space */
        try {
            this.setState({ student_searchbox_value: this.state.student_searchbox_value.toString().trim() })
        } catch (e) {
            console.log(e)
        }

        if ((!this.state.student_searchbox_value)) {
            console.log('enter student name!')
        }
        else {

            /**api to search from db */
            console.log('search student is: ', this.state.student_searchbox_value)
        }
    }

    render() {

        return (
            <Container fluid style={{ background: '#4B5357', height: '91.7vh', color: 'white', paddingTop: 0, paddingLeft: 0, paddingRight: 0 }}>

                {/**area above table */}
                <Container fluid style={{ background: '#4B5357' }}>
                    <Row>
                        {/**search bar column*/}
                        <Col xs='auto' sm='auto' md='auto' lg='auto' style={{ alignSelf: 'center', paddingTop: 7, paddingBottom: 7, paddingLeft: 5 }} >
                            <InputGroup style={{}}>
                                <RBFormControl
                                    placeholder="Search students..."
                                    value={this.state.student_searchbox_value}
                                    onChange={this.handleStudentsearchvalueChange}
                                />
                                <InputGroup.Append style={{ height: 38 }}>
                                    <Button variant="outline-secondary" onClick={() => { this.search_student() }}><SearchIcon /></Button>
                                </InputGroup.Append>
                            </InputGroup>
                        </Col>

                        {/**useless space column */}
                        <Col xs={true} sm={true} md={true} lg={true} style={{ background: 'transparent' }}></Col>

                        {/**filter options button column */}
                        <Col xs='auto' sm='auto' md='auto' lg='auto' style={{ alignSelf: 'center', paddingTop: 7, paddingBottom: 7, paddingRight: 5 }} >
                            <Button

                                block
                                variant='outline-secondary' /**use variant='outline-primary' to show background color when clicked' or 'outline-*' to hide background color when clicked */
                                size='lg'
                                aria-controls="example-collapse-text"
                                aria-expanded={this.state.open}
                                style={{
                                    fontSize: 12, color: 'white'
                                }}>
                                Filter options
                            </Button>
                        </Col>
                    </Row>
                </Container>

                {/**table to store students info */}
                <Table
                    responsive="sm" responsive="md" responsive="lg" responsive="xl"
                    variant='dark'
                    striped bordered hover style={{ marginTop: 0, marginLeft: 0 }}>

                    {/**table header */}
                    <thead>
                        <tr>
                            <th style={{ textAlign: 'center' }}>#</th>
                            <th>Student number</th>
                            <th>Name</th>
                            <th>Contact</th>
                            <th>Booking status</th>
                            <th>Payment status</th>
                            <th style={{ textAlign: 'center' }}>Actions</th>
                        </tr>
                    </thead>

                    {/**table body */}
                    <tbody>
                        {
                            this.state.students_table.map((countA) => {
                                return (
                                    <tr key={countA.student_id}>
                                        <td style={{ textAlign: 'center' }}>{countA.row_numbering}</td>
                                        <td>{countA.student_number}</td>
                                        <td>{countA.student_last_name} {countA.student_first_name} {countA.student_other_name}</td>
                                        <td>{countA.student_contact}</td>

                                        {/**we display the booking info only if the student has booked a room */}
                                        {
                                            countA.hall_name != null ?
                                                <td>{countA.hall_name} (Room {countA.room_number} )</td>
                                                :
                                                <td>Not booked</td>
                                        }

                                        <td>{countA.student_booking_payment_status}</td>

                                        {/**edit and delete buttons */}
                                        <td style={{ textAlign: 'center', paddingTop: 0, paddingBottom: 0 }}>
                                            <IconButton onClick={() => { this.open_student_info_modal(countA) }}>  <EditIcon style={{ color: 'dodgerblue' }} /></IconButton>
                                            <IconButton onClick={() => { this.open_delete_student_dialog_box(countA.student_id, countA.student_last_name, countA.student_first_name, countA.student_other_name, countA.student_booked_room_status) }}>  <DeleteIcon style={{ color: 'red' }} /></IconButton>
                                        </td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </Table>


                {/**dialog box 3 */}
                <Dialog
                    open={this.state.display_delete_student_dialog_box}
                    onClose={() => { this.close_delete_student_dialog_box() }}
                    aria-labelledby="draggable-dialog-title"
                >
                    <DialogTitle style={{ cursor: 'move', textAlign: 'center', background: 'reds', width: 260, paddingTop: 5, paddingBottom: 0 }} id="draggable-dialog-title">
                        Delete student
                    </DialogTitle>
                    <DialogContent style={{ background: 'yellows', width: 260, paddingLeft: 15, paddingBottom: 0 }}>
                        <DialogContentText style={{ fontSize: 14, padding: 0 }}>
                            Are you sure you remove {this.state.student_name_temp_storage} from the system?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions style={{ background: 'greens', width: 260, paddingTop: 0 }}>
                        <Button variant="primary" onClick={() => { this.confrim_student_deletion(this.state.student_id_temp_storage) }} >
                            Confirm
                        </Button>
                        <Button variant="danger" onClick={() => { this.close_delete_student_dialog_box() }}>
                            Cancel
                        </Button>
                    </DialogActions>
                </Dialog>

                {/**modal for general purposes starts here */}
                <Modal show={this.state.display_general_modal} onHide={() => { this.close_general_modal() }} size="sm" aria-labelledby="contained-modal-title-vcenter" centered>
                    <Modal.Body>
                        <div className="col text-center">
                            <p>{this.state.general_modal_message}</p>
                        </div>
                        <div className="col text-center">
                            <Button block onClick={() => { this.close_general_modal() }}>Close</Button>
                        </div>
                    </Modal.Body>
                </Modal>


                {/**modal for student's full information starts here*/}
                <Modal show={this.state.display_student_info_modal} backdrop='static' onHide={() => { this.close_student_info_modal() }} size="sm" aria-labelledby="contained-modal-title-vcenter" centered>

                    <Modal.Header closeButton style={{ background: '#2e324b', marginRight: -1 }}>
                    </Modal.Header>

                    <Modal.Body style={{ background: '#2e324b', marginRight: -1, marginTop: -1, paddingTop: 0 }} >
                        <Container fluid>
                            <Row>
                                <Col></Col>
                                <Col md='auto' xs='auto' sm='auto' lg='auto'>
                                    <div className="container">
                                        <div className="row">
                                            <div className="col text-center">
                                                <Avatar src="../../assets/defaultprofilepic3.jpg" style={{ width: 80, height: 80 }} />
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                                <Col></Col>
                            </Row>
                        </Container>

                        <div className="container" style={{ fontSize: 13, color: '#dddee0' }}>
                            <div className="col text-center" style={{ paddingTop: 20, paddingBottom: 10 }}>
                                <h6>{this.state.student_temp_info_table.student_last_name} {this.state.student_temp_info_table.student_first_name} {this.state.student_temp_info_table.student_other_name}</h6>
                                <div>{this.state.student_temp_info_table.student_contact}</div>
                            </div>
                        </div>
                    </Modal.Body>


                    <Modal.Footer style={{ background: '#2e324b', marginRight: -1, marginTop: -1, paddingBottom: 50 }}>
                        <Container fluid style={{ paddingTop: 10, color: '#dddee0' }}>
                            <Row>
                                <Col md={true} xs={true} sm={true} lg={true}>

                                    {/**edit student profile button */}
                                    <IconButton style={{ background: '#cf3483' }} onClick={() => { this.open_edit_student_profile_modal() }}>
                                        <PersonIcon fontSize='large' style={{ color: 'white' }} />
                                    </IconButton>
                                    <div style={{ fontSize: 10, marginTop: 10 }}><b>Edit Profile</b></div>
                                </Col>

                                <Col md={true} xs={true} sm={true} lg={true}>

                                    {/**manage student booking button */}
                                    <IconButton style={{ background: '#137dfd' }} onClick={() => { this.open_manage_student_booking_modal() }}>
                                        <HotelIcon fontSize='large' style={{ color: 'white' }} />
                                    </IconButton>
                                    <div style={{ fontSize: 10, marginTop: 10, paddingLeft: 5 }}><b>Manage Booking</b></div>
                                </Col>

                                <Col md={true} xs={true} sm={true} lg={true}>

                                    {/**manage student payment button */}
                                    <IconButton style={{ background: '#6458f0' }} onClick={() => { this.open_manage_student_payment_modal() }}>
                                        <AttachMoneyIcon fontSize='large' style={{ color: 'white' }} />
                                    </IconButton>
                                    <div style={{ fontSize: 10, marginTop: 10, paddingLeft: 5 }}><b>Manage Payment</b></div>
                                </Col>
                            </Row>
                        </Container>
                    </Modal.Footer>
                </Modal>



                {/**modal for edit student profile */}
                <Modal show={this.state.display_edit_student_profile_modal} backdrop='static' onHide={() => { this.close_edit_student_profile_modal() }} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>

                    <Modal.Header closeButton style={{ background: '#2e324b', marginRight: -1 }}>
                        <Modal.Title id="contained-modal-title-vcenter" style={{ color: 'white', paddingLeft: 20 }}>
                            Edit student
                        </Modal.Title>
                    </Modal.Header>

                    <Modal.Body style={{ background: '#2e324b', marginRight: -1, marginTop: -1, paddingTop: 0 }} >

                        <div className="container" style={{ fontSize: 13, color: 'white' }}>
                            <div className="row">

                                {/**row 1*/}
                                <div className="w-100" style={{ marginTop: 5 }}></div>

                                {/**col 1 student number*/}
                                <div className="col" style={{}}><Form.Group controlId="student_number">
                                    <Form.Label>Student Number</Form.Label>
                                    <Form.Control type="number" placeholder="" value={this.state.student_temp_info_table.student_number} onChange={this.handleStudentnumberChange} />
                                </Form.Group></div>

                                {/**col 2 student contact*/}
                                <div className="col" style={{}}> <Form.Group controlId="contact">
                                    <Form.Label>Contact</Form.Label>
                                    <Form.Control type="text" placeholder="" value={this.state.student_temp_info_table.student_contact} />
                                </Form.Group></div>


                                {/**row 2*/}
                                <div className="w-100" style={{ marginTop: 5 }}></div>

                                {/**col 1 first name*/}
                                <div className="col" style={{}}><Form.Group controlId="first_name">
                                    <Form.Label>First Name</Form.Label>
                                    <Form.Control type="text" placeholder="" value={this.state.student_temp_info_table.student_first_name} />
                                </Form.Group></div>

                                {/**col 2 last name*/}
                                <div className="col" style={{}}><Form.Group controlId="last_name">
                                    <Form.Label>Last Name</Form.Label>
                                    <Form.Control type="text" placeholder="" value={this.state.student_temp_info_table.student_last_name} />
                                </Form.Group></div>

                                {/**row 3*/}
                                <div className="w-100" style={{ marginTop: 5 }}></div>

                                {/**col 1 other names*/}
                                <div className="col" style={{}}> <Form.Group controlId="other_names">
                                    <Form.Label>Other Names</Form.Label>
                                    <Form.Control type="text" placeholder="" value={this.state.student_temp_info_table.student_other_name} />
                                </Form.Group></div>

                                {/**col 2 student year*/}
                                <div className="col" style={{}}> <Form.Group controlId="year">
                                    <Form.Label>Year</Form.Label>
                                    <Form.Control as="select" value={this.state.student_temp_info_table.student_year}>
                                        <option>1</option>
                                        <option>2</option>
                                        <option>3</option>
                                    </Form.Control>
                                </Form.Group></div>

                                {/**row  4*/}
                                <div className="w-100" style={{ marginTop: 5 }}></div>

                                {/**col 1 gender*/}
                                <div className="col" style={{}}> <Form.Group controlId="gender">
                                    <Form.Label>Gender</Form.Label>
                                    <Form.Control as="select" value={this.state.student_temp_info_table.student_gender}>
                                        <option>Male</option>
                                        <option>Female</option>
                                    </Form.Control>
                                </Form.Group></div>

                                {/**col 2 */}
                                <div className="col" style={{}}>
                                    <Form noValidate validated={this.state.validated} onSubmit={this.handleSubmit}>

                                        <Form.Group as={Col} md="4" controlId="validationCustom01">
                                            <Form.Label>First name</Form.Label>
                                            <Form.Control
                                                required
                                                type="text"
                                                placeholder="First name"
                                                defaultValue="Mark"
                                            />
                                            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                        </Form.Group>
                                        <Button onClick={this.handleSubmit}>Submit form</Button>
                                    </Form>
                                </div>
                            </div>
                        </div>

                    </Modal.Body>


                    <Modal.Footer style={{ background: '#2e324b', marginRight: -1, marginTop: -1, marginBottom: -1, paddingBottom: 50 }}>
                        <Container fluid style={{ paddingTop: 10, color: '#dddee0' }}>
                            <Row>
                                <Col md={true} xs={true} sm={true} lg={true}>
                                    <Button block variant='success' onClick={() => { this.edit_student_info() }}>Save changes</Button>

                                </Col>

                                <Col md={true} xs={true} sm={true} lg={true}>
                                    <Button block variant="danger" >Cancel</Button>
                                </Col>
                            </Row>
                        </Container>

                    </Modal.Footer>
                </Modal>


            </Container >

        )
    }

    /**dialog box 2 */
    open_delete_student_dialog_box(id, lastname, firstname, othernames, booking_status) {

        if (booking_status === 'T') {
            this.setState({ general_modal_message: 'Unbook student before deleting from the system' })
            this.open_general_modal()
        }

        else {
            this.setState({ student_id_temp_storage: id }) /**we store the student's id incase we'd delete their record from the db */

            /**we'd want to display the students name for deletion confirmation in the dialog box
             * if the student has only 2 names we set the othernames variable to an empty string
             */
            if (othernames === null) {
                othernames = ''
            }

            this.setState({ student_name_temp_storage: lastname + ' ' + firstname + ' ' + othernames }) /**we store the student's name to be displayed in the dialog box */
            this.setState({ display_delete_student_dialog_box: true })  /**we finally open our dialog box */
        }
    }

    close_delete_student_dialog_box() {
        this.setState({ display_delete_student_dialog_box: false })
    }

    confrim_student_deletion() {
        /**api to delete student from db */
        console.log('student id to be deleted is: ', this.state.student_id_temp_storage)

        fetch(server + 'delete_student_from_system.php', {
            method: 'POST',
            headers: {
                'Accept': 'text/plain',
                'Content-Type': 'text/plain'
            },
            body: JSON.stringify({
                student_idDB: this.state.student_id_temp_storage
            })
        }).then((response) => response.text())
            .then((responseJson) => {
                console.log(responseJson)

                var jsonconvertedrows = JSON.parse(responseJson)
                var finaldata = JSON.stringify(jsonconvertedrows)

                /**if student was succesfully deleted */
                if (finaldata === '"student successully deleted"') {
                    console.log('student succesfully deleted')

                    /**close our dialog box */
                    this.close_delete_student_dialog_box()

                    /**refresh our page */
                    this.fetch_students_info()
                }
                else {
                    alert('student deletion unsuccessful')
                }
            }, err => {
                /**connection to server error */
                alert('deletion failed. check internet connection')
            })
    }

    open_general_modal() {
        this.setState({ display_general_modal: true })
    }

    close_general_modal() {
        this.setState({ display_general_modal: false })
    }

    open_student_info_modal(count) {

        console.log('student record is: ', count)

        /**assigning the student's record information to our temporary student table */
        this.setState({ student_temp_info_table: JSON.parse(JSON.stringify(count)) }, () => {

            /**we have to make sure our data is in the table before we can continue that's where we put the rest of the codes here
             * to ensure they're executed after the state has been updated
             */
            console.log('student temp info table: ', this.state.student_temp_info_table)
            this.setState({ display_student_info_modal: true })
        })

    }

    close_student_info_modal() {
        this.setState({ display_student_info_modal: false })
    }


    /**functions for the various buttons inside the student info modal */
    open_edit_student_profile_modal() {
        this.setState({ display_edit_student_profile_modal: true })
    }

    close_edit_student_profile_modal() {
        this.setState({ display_edit_student_profile_modal: false })
    }

    open_manage_student_booking_modal() {

    }

    open_manage_student_payment_modal() {

    }

    /**edit student number text input */
    handleStudentnumberChange = (event) => {

        let student_temp_info_table2 = this.state.student_temp_info_table
        student_temp_info_table2.student_number = event.target.value

        this.setState({
            student_temp_info_table: student_temp_info_table2
        })
    }


    /**edit student's info in the database */
    edit_student_info() {
        console.log(this.state.student_temp_info_table.student_number)

        /**validate student number */
        if ((!this.state.student_temp_info_table.student_number)) {
            console.log('Provide a student number')
        }
    }
}

export default Students;