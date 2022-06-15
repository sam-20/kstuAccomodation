import React, { useEffect, useState } from 'react';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
// import InboxIcon from '@material-ui/icons/MoveToInbox';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import PeopleIcon from '@material-ui/icons/People';
// import MailIcon from '@material-ui/icons/Mail';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircleRoundedIcon from '@material-ui/icons/AccountCircleRounded';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import FaceIcon from '@material-ui/icons/Face';
import DashboardIcon from '@material-ui/icons/Dashboard';
import PersonIcon from '@material-ui/icons/Person';
import SettingsIcon from '@material-ui/icons/Settings';
// import Forward from '@material-ui/icons/Forward'
import HotelIcon from '@material-ui/icons/Hotel';
import HomeIcon from '@material-ui/icons/Home'
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Paper, IconButton, Avatar } from '@material-ui/core'
import { BrowserRouter, Route, Switch, Link } from "react-router-dom"
import {
    Card, Carousel, Nav, Dropdown, DropdownButton, Container, Row, Col,
    Button, Collapse, Modal, Spinner, InputGroup, FormControl as RBFormControl, ListGroup,
    OverlayTrigger
} from 'react-bootstrap'
import { AsyncStorage } from 'AsyncStorage' /**asyncstorage 1 */
import Popover from '@material-ui/core/Popover'; /**popover 1 */
import { Redirect } from 'react-router' /**navigation 1 */
import modulevariables from './../Modulevariables'

import StudentsComponent from './Students'
import ManageaccountComponent from './Manageaccount'
import HallsComponent from './Halls'
import RoomsComponent from './Rooms'
import PortersComponent from './Porters'
import StaffComponent from './Staff'

const server = modulevariables.applicationserver;

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    drawer: {
        [theme.breakpoints.up('sm')]: {
            width: drawerWidth,
            flexShrink: 0,
        },
    },
    appBar: {
        [theme.breakpoints.up('sm')]: {
            width: `calc(100% - ${drawerWidth}px)`,
            marginLeft: drawerWidth,
            background: 'dodgerblue' /**background of appbar */
        },
    },
    menuButton: {
        marginRight: theme.spacing(2),
        [theme.breakpoints.up('sm')]: {
            display: 'none',
        },
    },
    // necessary for content to be below app bar
    toolbar: theme.mixins.toolbar,
    drawerPaper: {
        width: drawerWidth,
        background: '#2C2F45',    /**background of drawer */
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(0),
    },
    typography: {
        padding: theme.spacing(2),
    },
}));


function ResponsiveDrawer(props) {
    const { window } = props;
    const classes = useStyles();
    const theme = useTheme();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [anchorEl, setAnchorEl] = React.useState(null); /**popover 2 */

    /**react hooks 1 */
    /**we create and define states in function hooks like this*/
    /**in this scenario 'name' is the variable and 'setName' is the method that will update it */
    // const [name, setName] = useState('samuel');

    const [staff_details_table, setStaff_details_table] = useState([]);

    /**IMPORTANT!!!  i added this variable to be used for the useEffect() function 
     * once we load our staff's details we set staff_table_has_data to true to prevent the component from the re-rendering loop
    */
    const [staff_table_has_data, setStaff_table_has_data] = useState(false);

    const [redirect, setRedirect] = useState(false) /**navigation 2 */

    /**useEffect is the class form of 'ComponentDidMount()' */
    useEffect(() => {
        console.log('component mounted')

        /**when component is mounted we'd fetched the id of the staff from our async store and use it to load their details
         * the id was saved in the store at the time the admin logged in
         * since is stored in the asyncstorage its very useful whenever we reload only this page since we first pick the id from the storage before using it to load the admin's details
         */
        _asyncStore_fetch_staff_id();
    }, [staff_table_has_data]);


    /**asyncstorage 2 */
    /**async storage functions */
    const _asyncStore_clear_staff_id = async () => {
        try {
            await AsyncStorage.removeItem('stored_staff_id');
            modulevariables.global_staff_id = null;
        } catch (error) {
            // Error clearing data
            console.log("async storage error: ", error)
        }
    }

    const _asyncStore_fetch_staff_id = async () => {
        try {

            /**we fetch the async storage's stored student_id into the modulevariables.global_student_id
             * so that we can use the modulevariables.global_student_id for most of our db queries
             */
            modulevariables.global_staff_id = await AsyncStorage.getItem('stored_staff_id');
            console.log('staff id is ', modulevariables.global_staff_id)

            fetch_staff_details();

        } catch (error) {
            // Error clearing data
            console.log("async storage error: ", error)
        }
    }


    /**logout */
    const logout = () => {

        modulevariables.global_staff_id = null;

        _asyncStore_clear_staff_id();

        /**navigation 4 */
        /**navigate to the admin login page */
        setRedirect(true)
    }

    /**retrieve the details of the staff */
    const fetch_staff_details = () => {

        fetch(server + 'fetch_staff_details.php', {
            method: 'POST',
            headers: {
                'Accept': 'text/plain',
                'Content-Type': 'text/plain'
            },
            body: JSON.stringify({
                staff_idDB: modulevariables.global_staff_id
            })
        }).then((response) => response.text())
            .then((responseJson) => {
                console.log(responseJson)

                var jsonconvertedrows = JSON.parse(responseJson)
                var finaldata = JSON.stringify(jsonconvertedrows)

                if (finaldata === '"no search results"') {
                    console.log('no staff with id provided')
                }
                else {

                    /**if the staff id exists */
                    // setStaff_details_table([]);
                    setStaff_details_table(jsonconvertedrows)

                    setStaff_table_has_data(true)
                    console.log('staff details has data: ', staff_table_has_data)
                    console.log('staff details table: ', staff_details_table)
                }
            })
    }

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    /**popover 3 */
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    /**popover 3 */
    const handleClose = () => {
        setAnchorEl(null);
    };

    /**popover 3 */
    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    {/**react hooks 4...we define the funtion like this */ }
    // const updatename = () => {
    //     /**instead of using this.setState we just call the second argument when we were defining the state and put in bracket the new value */
    //     setName('botwe')
    // }

    const drawer = (
        <div>
            {/**this provides the space above the dashboard heading */}
            {/* <div className={classes.toolbar}></div> */}

            {/**dashboard heading */}
            <List>
                <ListItem>
                    <ListItemIcon><DashboardIcon style={{ color: 'white' }} /></ListItemIcon>
                    <Typography variant="h6" style={{ color: 'white' }} noWrap>Dashboard</Typography>
                </ListItem>
            </List>

            <Divider />

            <List>
                {/**students list item */}
                <Link to="/admin/adminpanel/students" style={{ textDecoration: 'none' }}>
                    <ListItem button style={{ paddingTop: 20, paddingBottom: 20 }}>
                        <ListItemIcon><FaceIcon style={{ color: 'white' }} /></ListItemIcon>
                        <ListItemText primary='Students' style={{ color: 'white' }} />
                        {/**add new student.......manage existing students */}
                    </ListItem>
                </Link>

                {/* <Divider /> */}

                {/**Staff list item */}
                <Link to="/admin/adminpanel/staff" style={{ textDecoration: 'none' }}>
                    <ListItem button style={{ paddingTop: 20, paddingBottom: 20 }}>
                        <ListItemIcon><PeopleIcon style={{ color: 'white' }} /></ListItemIcon>
                        <ListItemText primary='Staff' style={{ color: 'white' }} />
                        {/**add new staff...........manage existing staff */}
                    </ListItem>
                </Link>

                {/**halls list item */}
                <Link to="/admin/adminpanel/halls" style={{ textDecoration: 'none' }}>
                    <ListItem button style={{ paddingTop: 20, paddingBottom: 20 }}>
                        <ListItemIcon><HomeIcon style={{ color: 'white' }} /></ListItemIcon>
                        <ListItemText primary='Halls' style={{ color: 'white' }} />
                        {/**create new hall........manage existing halls */}
                    </ListItem>
                </Link>

                {/**rooms list item */}
                <Link to="/admin/adminpanel/rooms" style={{ textDecoration: 'none' }}>
                    <ListItem button style={{ paddingTop: 20, paddingBottom: 20 }}>
                        <ListItemIcon><HotelIcon style={{ color: 'white' }} /></ListItemIcon>
                        <ListItemText primary='Rooms' style={{ color: 'white' }} />
                        {/**add new room.........manage existing rooms */}
                    </ListItem>
                </Link>

                {/**porters list item */}
                <Link to="/admin/adminpanel/porters" style={{ textDecoration: 'none' }}>
                    <ListItem button style={{ paddingTop: 20, paddingBottom: 20 }}>
                        <ListItemIcon><PersonIcon style={{ color: 'white' }} /></ListItemIcon>
                        <ListItemText primary='Porters' style={{ color: 'white' }} />
                        {/**add new porter..........manage exisitng porters */}
                    </ListItem>
                </Link>
            </List>

            <Divider />

            {/**manageaccount list item */}
            <Link to="/admin/adminpanel/manageaccount" style={{ textDecoration: 'none' }}>
                <ListItem button style={{ paddingTop: 20, paddingBottom: 20 }}>
                    <ListItemIcon><SettingsIcon style={{ color: 'white' }} /></ListItemIcon>
                    <ListItemText primary='Manage account' style={{ color: 'white' }} />
                    {/**view my profile.............change password */}
                </ListItem>
            </Link>

            <Divider />

            {/**react hooks 2...we use the state in our render like this*/}
            {/* <p>{name}</p> */}

            {/**react hooks 3...we call the function like this*/}
            {/* <Button onClick={updatename}>click me</Button> */}

        </div>
    );

    const container = window !== undefined ? () => window().document.body : undefined;

    /**navigation 3 */
    if (redirect) {
        return <Redirect push to="/admin" />
    }

    return (
        <BrowserRouter>
            <div className={classes.root}>
                <CssBaseline />

                {/**app bar containing the admin's name and logout section */}
                <AppBar position="fixed" className={classes.appBar}>
                    <Row>

                        <Col xs='auto'>
                            <Toolbar>
                                <IconButton
                                    color="inherit"
                                    aria-label="open drawer"
                                    edge="start"
                                    onClick={handleDrawerToggle}
                                    className={classes.menuButton}
                                >
                                    <MenuIcon />
                                </IconButton>
                                {
                                    staff_details_table.map((countA) => {
                                        return (
                                            <Typography key={countA.admin_id} variant="h6" noWrap>
                                                {countA.admin_full_name}
                                            </Typography>
                                        )
                                    })
                                }
                            </Toolbar>
                        </Col>

                        {/**useless space column */}
                        <Col xs={true} sm={true} md={true} lg={true} style={{ background: 'transparent' }}></Col>

                        {/**logout section */}
                        <Col xs='auto' sm='auto' md='auto' lg='auto'>

                            {/**popover 4 */}
                            <div style={{ paddingLeft: 0, paddingRight: 10, paddingTop: 5 }}>

                                {/**logout button */}
                                <IconButton onClick={handleClick} style={{ paddingTop: 0, paddingBottom: 0 }}>
                                    <AccountCircleRoundedIcon fontSize='large' style={{ color: 'white', fontSize: 50 }} />
                                </IconButton>

                                {/**popover api */}
                                <Popover
                                    id={id}
                                    open={open}
                                    anchorEl={anchorEl}
                                    onClose={handleClose}
                                    anchorOrigin={{
                                        vertical: 'center',
                                        horizontal: 'left',
                                    }}
                                    transformOrigin={{
                                        vertical: 'center',
                                        horizontal: 'right',
                                    }}
                                >

                                    {/**popover contents */}
                                    {
                                        staff_details_table.map((countA) => {
                                            return (
                                                <Typography className={classes.typography} key={countA.admin_id} noWrap>
                                                    {countA.admin_full_name}
                                                </Typography>
                                            )
                                        })
                                    }
                                    <Button
                                        onClick={logout}
                                        block
                                        variant='outline-light' /**use variant='outline-primary' to show background color when clicked' or 'outline-*' to hide background color when clicked */
                                        size='sm'
                                        aria-controls="example-collapse-text"
                                        style={{
                                            color: 'black',
                                        }}>

                                        <ExitToAppIcon style={{ color: 'red', paddingRight: 5 }} />
                                        <span>Logout</span>
                                    </Button>

                                </Popover>
                            </div>
                        </Col>

                    </Row>
                </AppBar>

                {/**responsive side drawer for desktop and mobile view */}
                <nav className={classes.drawer} aria-label="mailbox folders">
                    <Hidden smUp implementation="css">
                        <Drawer
                            container={container}
                            variant="temporary"
                            anchor={theme.direction === 'rtl' ? 'right' : 'left'}
                            open={mobileOpen}
                            onClose={handleDrawerToggle}
                            classes={{
                                paper: classes.drawerPaper,
                            }}
                            ModalProps={{
                                keepMounted: true, // Better open performance on mobile.
                            }}
                        >
                            {drawer}
                        </Drawer>
                    </Hidden>
                    <Hidden xsDown implementation="css">
                        <Drawer
                            classes={{
                                paper: classes.drawerPaper,
                            }}
                            variant="permanent"
                            open
                        >
                            {drawer}
                        </Drawer>
                    </Hidden>
                </nav>

                <main className={classes.content}>
                    <div className={classes.toolbar} />

                    {/**pages of the selected link from the drawer will show here */}
                    <div>
                        <Switch>
                            <Route exact path="/admin/adminpanel/halls" component={HallsComponent} />
                            <Route exact path="/admin/adminpanel/rooms" component={RoomsComponent} />
                            <Route exact path="/admin/adminpanel/porters" component={PortersComponent} />
                            <Route exact path="/admin/adminpanel/staff" component={StaffComponent} />
                            <Route exact path="/admin/adminpanel/students" component={StudentsComponent} />
                            <Route exact path="/admin/adminpanel/manageaccount" component={ManageaccountComponent} />
                            <Route render={() => <ManageaccountComponent />} /> {/**default page to open */}
                        </Switch>
                    </div>

                </main>
            </div>
        </BrowserRouter >
    );
}


export default ResponsiveDrawer;


