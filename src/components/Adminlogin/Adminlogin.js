import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
// import { Link } from 'react-router-dom'
import { Redirect } from 'react-router' /**navigation***  1 */
import { Card, Carousel, Nav, Dropdown, Button as RB_Button, DropdownButton, Row, Col, Collapse, Modal, Spinner, Toast } from 'react-bootstrap'
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import modulevariables from '../Modulevariables'
import { AsyncStorage } from 'AsyncStorage' /**asyncstorage 1 */

const server = modulevariables.applicationserver

class Adminlogin extends Component {

    constructor(props) {
        super(props)

        /**declaring our variables */
        this.state = {
            redirect: false,  /**navigation***  2 */

            admin_username: '', /**variable to store our admin's username */
            admin_password: '', /**variable to store admin's password */

            /**toast 1  we dont want to show our toast by default*/
            display_toast: false,

            /**toast 2 we define the toast message and just change it whenever we want to show a toast for a diff situation*/
            toast_message: '',

            /**backdrop 1  we hide the backdrop by default*/
            display_backdrop: false,

            /**we disable the input field when a signining process is going on to prevent interruptions
             * or enable it to let user change value
             */
            disable_input_field: false,

            /**we want to display modal if theres no internet conn. or student's details cannot be found */
            display_internet_error_modal: false,
            display_staff_not_found_modal: false,
        }
    }

    /**keeping track of admin username and password onchange textfield events */
    handleAdminusernameChange = (event) => {
        this.setState({
            admin_username: event.target.value
        })
    }

    handleAdminpasswordChange = (event) => {
        this.setState({
            admin_password: event.target.value
        })
    }


    /**login function */
    login() {

        /**removin white space */
        try {
            this.setState({ admin_username: this.state.admin_username.toString().trim() })
            this.setState({ admin_password: this.state.admin_password.toString().trim() })
        } catch (e) {
            console.log(e)
        }

        if ((!this.state.admin_username) || (!this.state.admin_password)) {
            // console.log('provide all details')

            this.show_toast('Provide all details')
        }
        else {

            /**if user provides details then proceed to check from the db */
            this.setState({ disable_input_field: true }) /**disable input field to prevent user from changing value whiles backdrop is displaying */
            this.show_backdrop() /**then display our backdrop */
            this.checklogincredentials()
        }
    }


    //verify login credentials
    checklogincredentials() {

        this.checklogincredentials = this.checklogincredentials.bind(this)

        fetch(server + 'view_admin_users.php', {
            method: 'POST',
            headers: {
                'Accept': 'text/plain',
                'Content-Type': 'text/plain'
            },
            body: JSON.stringify({
                admin_usernameDB: this.state.admin_username,        /**variables going to the  db */
                admin_passwordDB: this.state.admin_password
            })
        }).then((response) => response.text())
            .then((responseJson) => {

                //raw data response from database
                console.log(responseJson)

                var jsonconvertedrows = JSON.parse(responseJson)
                var finaldata = JSON.stringify(jsonconvertedrows)

                if (finaldata === '"no search results"') {

                    // console.log('Admin with details provided doesnt exist')

                    /**hide backdrop */
                    this.hide_backdrop()

                    this.open_modal_staff_not_found()

                    /**enable input field to allow user tp change value */
                    this.setState({ disable_input_field: false })
                }

                else {
                    /**if account exist */
                    console.log('Admin details exist')

                    /**transfer the id of that staff in the db to the global module variable */
                    for (var count = 0; count < jsonconvertedrows.length; count++) {
                        modulevariables.global_staff_id = jsonconvertedrows[count].admin_id
                    }

                    /**asyncstorage 3 */
                    /**save the staff's id into our storage */
                    this._asyncStore_save_staff_id()

                    //we can now proceed to open the page
                    this.setState({ redirect: true }) /**navigation *** 4 */
                }
            }, err => {
                /**connection to server error */
                this.hide_backdrop()
                this.open_modal_internet_error()
                this.setState({ disable_input_field: false })
            })
    }



    render() {

        /**navigation***  3 */
        if (this.state.redirect) {
            return <Redirect push to="admin/adminpanel" />;
        }

        return (

            /**container div for the entire form including the logo */
            <Container component="main" maxWidth="xs" style={{ marginTop: 0, height: '100vh' }}>
                <CssBaseline />
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}>

                    {/**toast 3 we define how the toast will look like */}
                    <div style={{ background: 'red', width: '100%', position: 'relative' }}>
                        <Toast show={this.state.display_toast} autohide='true' delay='3000' style={{ width: '100%', position: 'absolute' }} onClose={() => { this.setState({ display_toast: false }) }}>
                            <Toast.Header>
                                {/* <img src="holder.js/20x20?text=%20" className="rounded mr-2" alt="" /> */}
                                <strong className="mr-auto">Login failed!</strong>
                                {/* <small>11 mins ago</small> */}
                            </Toast.Header>
                            <Toast.Body>{this.state.toast_message}</Toast.Body>
                        </Toast>
                    </div>

                    {/**backdrop 2 we define how the backdrop will look like */}
                    <Backdrop open={this.state.display_backdrop} style={{}}>
                        <CircularProgress color="inherit" /> <span style={{ paddingLeft: 8 }}>Please wait... </span>
                    </Backdrop>

                    {/**modal for internet connection error */}
                    <Modal show={this.state.display_internet_error_modal} onHide={() => { this.close_modal_internet_error() }} size="sm" aria-labelledby="contained-modal-title-vcenter" centered>
                        <Modal.Title id="contained-modal-title-vcenter">
                            <div className="col text-center" style={{ fontSize: 16, paddingTop: 5 }}>
                                Login failed!
                               </div>
                        </Modal.Title>
                        <Modal.Body>
                            <Row>
                                <Col></Col>
                                <Col xs='auto'>
                                    <p style={{ paddingLeft: 3 }}>Please check your internet connection</p>
                                </Col>
                                <Col></Col>
                            </Row>

                            <div className="col text-center">
                                <RB_Button variant='primary' onClick={() => { this.close_modal_internet_error() }}>Close</RB_Button>
                            </div>
                        </Modal.Body>
                    </Modal>

                    {/**modal for staff not found error */}
                    <Modal show={this.state.display_staff_not_found_modal} onHide={() => { this.close_modal_staff_not_found() }} size="sm" aria-labelledby="contained-modal-title-vcenter" centered>
                        <Modal.Title id="contained-modal-title-vcenter">
                            <div className="col text-center" style={{ fontSize: 16, paddingTop: 5 }}>
                                Login failed!
                               </div>
                        </Modal.Title>
                        <Modal.Body>
                            <div className="col text-center">
                                <p>Staff details could not be found</p>
                            </div>
                            <div className="col text-center">
                                <RB_Button variant='primary' onClick={() => { this.close_modal_staff_not_found() }}>Close</RB_Button>
                            </div>
                        </Modal.Body>
                    </Modal>

                    {/**kstu image logo */}
                    <div style={{ marginBottom: 20, marginTop: 150 }}>
                        <img alt="" src={require('../../assets/kstu.png')} style={{ width: 150, height: 150 }} />
                    </div>

                    {/**sign in heading */}
                    <Typography component="h1" variant="h5">Sign in</Typography>

                    {/**main text inputs form */}
                    <form style={{ width: '100%' }} noValidate>

                        {/**username textbox */}
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="username"
                            label="Username"
                            name="username"
                            // autoComplete="email"
                            autoComplete="off" //remove chromes text auto fill feature
                            color="primary"  //changes the highlight color of the text field when focused
                            autoFocus
                            disabled={this.state.disable_input_field} //read only 

                            value={this.state.admin_username}
                            onChange={this.handleAdminusernameChange}
                        />

                        {/**password textbox */}
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            color="primary"  //changes the highlight color of the text field when focused
                            disabled={this.state.disable_input_field} //read only 

                            value={this.state.admin_password}
                            onChange={this.handleAdminpasswordChange}
                        />

                        {/**remember me checkbox */}
                        <FormControlLabel
                            control={<Checkbox value="remember" color="primary" />}
                            label="Remember me"
                        />

                        {/**sign in button */}
                        {/* <Link to="admin/adminpanel" style={{ textDecoration: 'none' }}><Button fullWidth variant="contained" color="primary" >Sign In</Button></Link> */}

                        <Button fullWidth variant="contained" color="primary" onClick={() => { this.login() }}>Sign In</Button>

                        <Grid container style={{ paddingTop: 10 }}>
                            <Grid item xs>
                                {/* <Link href="#" variant="body2">Forgot password?</Link> */}
                            </Grid>

                        </Grid>
                    </form>
                </div>

            </Container>
        );
    }

    /**asyncstorage 2 */
    _asyncStore_save_staff_id = async () => {
        try {
            await AsyncStorage.setItem('stored_staff_id', modulevariables.global_staff_id);
            // console.log('the id stored is: ', modulevariables.global_staff_id)
        } catch (error) {
            // Error saving data
            console.log("async storage error: ", error)
        }
    }


    /**toast 4 we define the function to open the toast */
    show_toast(message) {
        this.setState({ toast_message: message })
        this.setState({ display_toast: true })
    }


    /**backdrop 3 we define the function to open and close the backdrop */
    show_backdrop() {
        this.setState({ display_backdrop: true })
    }

    hide_backdrop() {
        this.setState({ display_backdrop: false })
    }

    open_modal_internet_error() {
        this.setState({ display_internet_error_modal: true })
    }

    close_modal_internet_error() {
        this.setState({ display_internet_error_modal: false })
    }

    open_modal_staff_not_found() {
        this.setState({ display_staff_not_found_modal: true })
    }

    close_modal_staff_not_found() {
        this.setState({ display_staff_not_found_modal: false })
    }

}


export default Adminlogin;






