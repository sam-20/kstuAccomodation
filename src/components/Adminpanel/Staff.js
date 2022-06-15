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
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import HotelIcon from '@material-ui/icons/Hotel';
import Forward from '@material-ui/icons/Forward'
import PeopleIcon from '@material-ui/icons/People';
import { Paper, IconButton, Avatar } from '@material-ui/core'
// import { Page, Text, View, Document, PDFViewer } from '@react-pdf/renderer'
// import ReactPDF from '@react-pdf/renderer';
import modulevariables from '../Modulevariables'
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { AsyncStorage } from 'AsyncStorage' /**asyncstorage 1 */
import Tooltip from '@material-ui/core/Tooltip';
import { Redirect } from 'react-router' /**navigation***  1 */

//background image of page
import mybackground_image from '../../assets/bg5.jpg';

const server = modulevariables.applicationserver;

class Staff extends Component {

    constructor(props) {
        super(props)

        /**declaring our variables */
        this.state = {

        }
    }

    render() {

        return (
            <Container fluid style={{ background: '#66697D', height: '91.6vh', color: 'white' }}>
                <p>this is the staff page</p>
            </Container>

        )
    }
}

export default Staff;