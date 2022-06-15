import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";
import {
  Card,
  Carousel,
  Nav,
  Dropdown,
  DropdownButton,
  Container,
  Row,
  Col,
  Button,
  Collapse,
  Modal,
  Spinner,
  InputGroup,
  FormControl as RBFormControl,
  ListGroup,
  OverlayTrigger,
  Popover,
} from "react-bootstrap";
// import { Hotel, Person, DeleteIcon } from '@material-ui/icons'
// import Icon from '@material-ui/core/Icon';
import HotelIcon from "@material-ui/icons/Hotel";
import PeopleIcon from "@material-ui/icons/People";
import RemoveIcon from "@material-ui/icons/Remove";
import AccountCircleRoundedIcon from "@material-ui/icons/AccountCircleRounded";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import { Paper, IconButton, Avatar } from "@material-ui/core";
// import { Page, Text, View, Document, PDFViewer } from '@react-pdf/renderer'
// import ReactPDF from '@react-pdf/renderer';
import modulevariables from "../Modulevariables";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import { AsyncStorage } from "AsyncStorage"; /**asyncstorage 1 */
import Tooltip from "@material-ui/core/Tooltip";
import { Redirect } from "react-router"; /**navigation***  1 */

//background image of page
import mybackground_image from "../../assets/bg5.jpg";

const server = modulevariables.applicationserver;

class Dashboard extends Component {
  constructor(props) {
    super(props);

    /**declaring our variables */
    this.state = {
      redirect: false /**navigation***  2 */,

      height: props.height /**fetching our window height */,

      student_details_table:
        [] /**table to receive logged in student's details */,
      student_fname: "",
      student_lname: "",
      student_oname: "",
      student_gender:
        "" /**we need the student's gender to filter out which halls should be displayed on their page */,
      student_payment_status: false /**after fetching from db if student has paid it will be set to true */,
      student_already_booked: false /**we want to fetch the value of the student's booked_status from his details when it loads from the db so that we can prompt him that he's already booked a room incase he tries to do so again*/,

      selected_hall_name:
        null /**default selected hall name near drop down menu */,

      halls_info_table: [] /**table to receive hall details */,
      selected_hall_rooms_table:
        [] /**table to receive selected hall's rooms */,
      selected_hall_floor_allocations_table:
        [] /**table to retrieve the floor names and ids of the selected hall */,
      selected_floor_rooms_table:
        [] /**table to receive the rooms of a particular floor from the selected hall */,

      /**show students button text */
      student_details_text: "Hide student details",
      open: true /**we show the collapsed text by default */,

      /**modal 1  we hide our modal by default*/
      display_modal_for_available_room: false,
      display_modal_for_unavailable_room: false,
      display_modal_for_successful_booking: false,
      display_modal_containing_quick_searched_rooms: false,

      /**incase we would be using a number of modals which will change only in their messages */
      display_general_modal: false,
      general_modal_message: "",

      /**details to store the info the room the user selects to book */
      bookedroom_floor_name: "",
      bookedroom_number: "",
      bookedroom_facilities: "",
      bookedroom_db_id:
        "" /**we'd need this when we're booking the studnet in the db */,

      /**loader to display whiles we're booking a student for a room */
      room_booking_please_wait_loader: false,
      display_backdrop: false, //or we can use a backdrop for the loader

      /**we disable the buttons whiles we're booking a person in the db to prevent interupttions */
      disable_room_booking_buttons: false,

      /**dialog box 1*/
      display_dialog_box: false,

      /**display tooltip 1*/
      display_tooltip_for_hall_search: false,
      display_tooltip_for_total_beds_search: false,
      display_tooltip_for_vacant_beds_search: false,
      display_tooltip_for_vacant_beds_notgreaterthan_totalbeds: false,

      /**we need these details to refresh a floor's room after the user has booked from there */
      hall_id_for_page_reload: "",
      floor_number_for_page_reload: "",

      /**our quick room search button will change depending on whether we're searching or not */
      search_button_text: "Search",
      show_searching_spinner: false,
      disable_search_inputs: false /**then we disable the search inputs to prevent changing the values while searching the rooms from the db */,

      /**our search items..includes the variables which will be received to search for a particular room in the db */
      search_table: [
        {
          hall_name: "",
          hall_id: "",
          room_total_beds:
            "" /**whatever total beds the user wants to search out of the maximum which is 8 will be stored here */,
          room_occupied_beds: "",
          room_vacant_beds: "",
        },
      ],

      /**table to store the searched rooms using the quick search */
      searched_rooms_table: [],

      /**whiles our halls are being fetched we display this loader which covers the whole card including the floors names nav links*/
      halls_not_fetched_loader: true,

      /**whiles our rooms are being fetched we display this loader which covers the area under the floor header tabs nav links */
      rooms_not_fetched_loader: false,
    };

    this.fetch_hall_info = this.fetch_hall_info.bind(this);
    this.fetch_student_details = this.fetch_student_details.bind(this);
  }

  componentDidMount() {
    /**fetch the student's id which we'd used to fetch his details and halls
     * as well as required whenever we refresh the page(benefit of the async storage)
     */
    this._asyncStore_fetch_student_id();

    this.setState({ height: window.innerHeight + "px" }); //retrieve height of page
  }

  /**retrieve the details of the student */
  fetch_student_details() {
    fetch(server + "fetch_student_details.php", {
      method: "POST",
      headers: {
        Accept: "text/plain",
        "Content-Type": "text/plain",
      },
      body: JSON.stringify({
        student_idDB: modulevariables.global_student_id,
      }),
    })
      .then((response) => response.text())
      .then((responseJson) => {
        //raw data response from database
        // console.log(responseJson)

        var jsonconvertedrows = JSON.parse(responseJson);
        var finaldata = JSON.stringify(jsonconvertedrows);

        if (finaldata === '"no search results"') {
          console.log("no student with id provided");
        } else {
          /**if student with given id exists */

          for (var count = 0; count < jsonconvertedrows.length; count++) {
            this.setState({
              student_fname: jsonconvertedrows[count].student_first_name,
            });
            this.setState({
              student_lname: jsonconvertedrows[count].student_last_name,
            });
            this.setState({
              student_oname: jsonconvertedrows[count].student_other_name,
            });
          }

          /**set the student's gender which we'd use later on to fetch which halls should be displayed on their page */
          for (var key in jsonconvertedrows) {
            this.setState({
              student_gender: jsonconvertedrows[key].student_gender,
            }); //we do this to prevent the student from trying to book a room again
          }

          for (var key2 in jsonconvertedrows) {
            if (jsonconvertedrows[key2].student_booked_room_status === "T") {
              this.setState({ student_already_booked: true }); //we do this to prevent the student from trying to book a room again
            }
          }

          for (var key3 in jsonconvertedrows) {
            if (
              jsonconvertedrows[key3].student_booking_payment_status === "T"
            ) {
              this.setState({ student_payment_status: true }); //we do this to prevent the student from trying to book a room again
            }
          }

          this.setState({ student_details_table: [] });
          this.setState({ student_details_table: jsonconvertedrows });

          // console.log('student details: ', this.state.student_details_table)

          /**then we fetch the halls of the student based on their gender */
          this.fetch_homepage_hall_info(); /**when the page loads we want to fetch only the info and rooms of the hall which will be displayed on the landing page */
          this.fetch_hall_info(); /**when the page loads we fetch all the halls info so that we can load the hall names into the select hall dropdown menu */
        }
      });
  }

  /**retrieve only the landing page hall's info
   * this is useful to fill the homepage with the first hall's info the and rooms for its first floor only
   */
  fetch_homepage_hall_info() {
    fetch(server + "fetch_homepage_hall_info.php", {
      method: "POST",
      headers: {
        Accept: "text/plain",
        "Content-Type": "text/plain",
      },
      body: JSON.stringify({
        hall_genderDB:
          this.state
            .student_gender /**we fetch the halls based on the student's gender */,
      }),
    })
      .then((response) => response.text())
      .then((responseJson) => {
        //raw data response from database
        // console.log(responseJson)

        var jsonconvertedrows = JSON.parse(responseJson);
        var finaldata = JSON.stringify(jsonconvertedrows);

        if (finaldata === '"no search results"') {
          console.log("no halls exist at all");
        } else {
          /**if halls exist */

          /**the query would give us only 1 hall info which we'd use for our homepage */
          var retrieved_hall_id = null;
          var retrieved_hall_name = null;
          for (var count = 0; count < 1; count++) {
            retrieved_hall_id = jsonconvertedrows[count].hall_id;
            retrieved_hall_name = jsonconvertedrows[count].hall_name;
          }

          // console.log('retrieved hall id is: ', retrieved_hall_id)
          // console.log('retrieved hall name is: ', retrieved_hall_name);

          /**since we have the hall_id this function will fetch the all the rooms in this hall and categorize the various floor names for us*/
          this.fetch_selected_hall_rooms(
            retrieved_hall_id,
            retrieved_hall_name
          );

          /**after that we can use this function to display the rooms of only the ground level floor for this hall*/
          this.fetch_rooms_for_selectedfloor(retrieved_hall_id, 0);
        }
      });
  }

  /**retrieve all the hall info when the page loads
   * this is needed to fill our dropdown menu with the list of available hostels
   */
  fetch_hall_info() {
    fetch(server + "fetch_halls_info.php", {
      method: "POST",
      headers: {
        Accept: "text/plain",
        "Content-Type": "text/plain",
      },
      body: JSON.stringify({
        hall_genderDB:
          this.state
            .student_gender /**we fetch the halls based on the student's gender */,
      }),
    })
      .then((response) => response.text())
      .then((responseJson) => {
        //raw data response from database
        // console.log(responseJson)

        var jsonconvertedrows = JSON.parse(responseJson);
        var finaldata = JSON.stringify(jsonconvertedrows);

        if (finaldata === '"no search results"') {
          console.log("no halls exist");
        } else {
          /**if halls exist */

          this.setState({ halls_info_table: [] });
          this.setState({ halls_info_table: jsonconvertedrows });
          // console.log('halls: ', this.state.halls_info_table)
        }
      });
  }

  /**we fetch all the rooms and their info when a user selcts a hall from the dropdown menu
   * note that the reason we fetched all the rooms for the selected hall here is that we also want to know all the available floor names that have been given to the rooms so that we can as well categorize the floor names for the hall
   */
  fetch_selected_hall_rooms(selected_hall_id, selected_hall_name_dropdownmenu) {
    /**first display the name of the hall selected next to the drop down menu */
    this.setState({ selected_hall_name: selected_hall_name_dropdownmenu });

    /**now we fetch the selected hall's rooms info from the db */
    fetch(server + "fetch_selected_hall_rooms.php", {
      method: "POST",
      headers: {
        Accept: "text/plain",
        "Content-Type": "text/plain",
      },
      body: JSON.stringify({
        hall_idDB: selected_hall_id,
      }),
    })
      .then((response) => response.text())
      .then((responseJson) => {
        //raw data response from database
        // console.log(responseJson)

        var jsonconvertedrows = JSON.parse(responseJson);
        var finaldata = JSON.stringify(jsonconvertedrows);

        if (finaldata === '"no search results"') {
          console.log("no rooms exist");
        } else {
          /**if rooms exist */

          /**we assign our rooms info to our table */
          this.setState({ selected_hall_rooms_table: [] });
          this.setState({ selected_hall_rooms_table: jsonconvertedrows });
          // console.log('rooms: ', this.state.selected_hall_rooms_table)

          /** then we retrieve the various floor names we can find from the different rooms in the table  and assign them to the floor allocations table
           * we avoid duplication of floor names */
          this.setState({
            selected_hall_floor_allocations_table: [],
          }); /**first clear table of any previous data */

          /**declaring our properties for the floor allocations obj table */
          this.state.selected_hall_floor_allocations_table.map((element) => {
            element.selected_hall_id = null;
            element.selected_hall_floor_number = null;
            element.selected_hall_floor_name = null;

            return false; //included this to clear the warning message in console
          });

          /**now we loop through the selected_hall_rooms_table for the various floor names and their ids/floor numbers */
          for (
            var count = 0;
            count < this.state.selected_hall_rooms_table.length;
            count++
          ) {
            /**we search inside selected_hall_floor_allocations_table and compare floor number in that table to the floor number in selected_hall_rooms_table */
            var index =
              this.state.selected_hall_floor_allocations_table.findIndex(
                (x) =>
                  x.selected_hall_floor_number ===
                  this.state.selected_hall_rooms_table[count].floor_number
              );

            /**if we compare and the two floor numbers are not the same we add that floor number and floor name from the selected_hall_rooms_table to the floor allocations table*/
            if (index === -1) {
              // console.log('floor_number does not exist')

              /**create a copy of an object array to store our new values */
              const temp_array = {
                selected_hall_id:
                  this.state.selected_hall_rooms_table[count].hall_id,
                selected_hall_floor_number:
                  this.state.selected_hall_rooms_table[count].floor_number,
                selected_hall_floor_name:
                  this.state.selected_hall_rooms_table[count].floor_name,
              };
              // console.log('temp_array is: ', temp_array)

              /**assign the temp_array object to the floor allocations table */
              this.setState({
                selected_hall_floor_allocations_table: [
                  ...this.state.selected_hall_floor_allocations_table,
                  temp_array,
                ],
              });
              // console.log('inserting obj into floor allocation table gives: ', this.state.selected_hall_floor_allocations_table)
            } else {
              //if we compare and the floor numbers on both tables are the same we do nothing
              // console.log('floor_ids exists')
            }
          }

          /**after we've categorized our floors into the various types we'd like to load the rooms for the ground level floor since we want those rooms to appear once the user selected the dropdown menu item */
          this.fetch_rooms_for_selectedfloor(selected_hall_id, 0);

          /**finally we can see our floor allocations table */
          // console.log('floor allocations', this.state.selected_hall_floor_allocations_table)
        }
      });
  }

  /**this will fetch out the rooms for a hall's selected floor */
  fetch_rooms_for_selectedfloor(hall_id, floor_number) {
    /**show our loader whiles the rooms are being fetched from the db */
    this.setState({ rooms_not_fetched_loader: true });

    // console.log('selected hall id is: ', hall_id)
    // console.log('selected floor number is: ', floor_number)

    /**we also save into these variables incase a student books a room from that floor then we call this function again with the variables below to reload the floor's room and give us the new room vacancy details */
    this.setState({ hall_id_for_page_reload: hall_id });
    this.setState({ floor_number_for_page_reload: floor_number });

    fetch(server + "fetch_selected_floor_rooms.php", {
      method: "POST",
      headers: {
        Accept: "text/plain",
        "Content-Type": "text/plain",
      },
      body: JSON.stringify({
        hall_idDB: hall_id,
        floor_numberDB: floor_number,
      }),
    })
      .then((response) => response.text())
      .then((responseJson) => {
        //raw data response from database
        // console.log(responseJson)

        var jsonconvertedrows = JSON.parse(responseJson);
        var finaldata = JSON.stringify(jsonconvertedrows);

        if (finaldata === '"no search results"') {
          console.log("no rooms exist");
        } else {
          /**if rooms exist */

          this.setState({ selected_floor_rooms_table: [] });

          /**before we assign the rooms from jsconverted rows to our
           * table we want to different rooms which are fully occupied(unavailable)
           * from rooms which are available by changing the color of the bar on the card */
          jsonconvertedrows.map((element) => {
            element.room_availablilty_color = "#50ad59";

            return false; //included this to clear the warning message in console
          });

          for (var key in jsonconvertedrows) {
            if (
              jsonconvertedrows[key].room_beds_occupied ===
              jsonconvertedrows[key].room_total_beds
            ) {
              jsonconvertedrows[key].room_availablilty_color = "red";
            }
          }

          /**now since some halls may be mixed we need to filter out and display only the rooms which are specific to the student's gender in that particular mixed hall */
          for (var key2 = jsonconvertedrows.length - 1; key2 >= 0; key2--) {
            if (
              jsonconvertedrows[key2].room_gender === null ||
              jsonconvertedrows[key2].room_gender === this.state.student_gender
            ) {
              /**we do nothing and leave the record in the table */
            } else {
              /**if room's gender is opposite of the student's gender we remove it from the table */
              // console.log('remove room: ', jsonconvertedrows[key].room_number)
              jsonconvertedrows.splice(key2, 1);
            }
          }

          /**we can now hide the waiting loader */
          this.setState({ halls_not_fetched_loader: false });

          /**hide our loader after the rooms have been fetched fetched from the db */
          this.setState({ rooms_not_fetched_loader: false });

          this.setState({ selected_floor_rooms_table: jsonconvertedrows });
          // console.log('selected rooms for hall and floor is:', this.state.selected_floor_rooms_table)
        }
      });
  }

  render() {
    /**navigation***  3 */
    if (this.state.redirect) {
      return <Redirect push to="/student" />;
    }

    return (
      /**page setup */

      /**fluid allows container to fill the whole width of the screen
       * react-bootstrap's col height are measured in veiwport heights (vh) ie. 100% height = 100vh
       * viewport width = vw
       */
      <Container
        fluid
        style={{
          backgroundImage: `url(${mybackground_image})`,
          height: "100vh",
        }}
      >
        <Row>
          {/**breakpoints are
           * xs : extra small devices
           * sm : small devices
           * md : medium device / desktops
           * lg : extra large devices
           *
           * breakpoints used with auto will size col based on width of the content inside. eg. xs='auto'
           * breakpoints used with {true} will size col width layout automatically eg. xs={true} */}

          {/**column containing user's details and quick search panel roooms */}
          <Col
            md={2}
            style={{
              background: "transparent",
              marginTop: 8,
              marginLeft: 5,
              marginRight: 7,
            }}
          >
            {/**user's details */}
            <Row
              xs="true"
              style={{ background: "transparent", marginBottom: 10 }}
            >
              <Paper
                square={false}
                elevation={15}
                style={{
                  background: "#303940",
                  width: "100%",
                  paddingTop: 25,
                  paddingBottom: 5,
                  height: 395,
                }}
              >
                <Row>
                  <Col></Col>
                  <Col md="auto" xs="auto" sm="auto" lg="auto">
                    <div className="container">
                      <div className="row">
                        <div className="col text-center">
                          <Avatar
                            src="../../assets/defaultprofilepic3.jpg"
                            style={{ width: 80, height: 80 }}
                          />
                        </div>
                      </div>
                    </div>
                  </Col>
                  <Col></Col>
                </Row>

                <h6
                  style={{
                    textAlign: "center",
                    paddingTop: 30,
                    color: "#a3a6af",
                  }}
                >
                  {this.state.student_lname} {this.state.student_fname}{" "}
                  {this.state.student_oname}
                </h6>

                <Row style={{ marginTop: 20 }}>
                  {/**collapse transition starts here */}
                  <div className="container">
                    <div className="row">
                      <div className="col text-center"></div>
                    </div>

                    <Collapse appear={this.state.open} in={this.state.open}>
                      <div
                        className="container"
                        style={{
                          fontSize: 13,
                          marginLeft: 3,
                          marginTop: 15,
                          color: "#a3a6af",
                          marginBottom: 10,
                        }}
                      >
                        {this.state.student_details_table.map((countC) => {
                          return (
                            <div className="row" key={countC.student_id}>
                              <div className="col-5" style={{}}>
                                Student No:
                              </div>
                              <div className="col" style={{ paddingLeft: 0 }}>
                                {countC.student_number}
                              </div>

                              <div
                                className="w-100"
                                style={{ marginTop: 15 }}
                              ></div>
                              <div className="col-5" style={{}}>
                                Year:
                              </div>
                              <div className="col" style={{ paddingLeft: 0 }}>
                                {countC.student_year}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </Collapse>
                  </div>
                  {/**collapse transition ends here */}

                  <div
                    className="col text-center"
                    style={{
                      marginTop: 10,
                      marginBottom: 5,
                    }}
                  >
                    <Container>
                      <Row>
                        <Col md="auto"></Col>

                        <Col md={12}>
                          {/**make payment button */}
                          <Button
                            onClick={() => {
                              this.make_payment();
                            }}
                            block
                            variant="outline-primary" /**use variant='outline-primary' to show background color when clicked' or 'outline-*' to hide background color when clicked */
                            size="lg"
                            aria-controls="example-collapse-text"
                            aria-expanded={this.state.open}
                            style={{
                              fontSize: 12,
                              color: "white",
                            }}
                          >
                            Make payment
                          </Button>

                          {/**generate receipt button */}
                          <Button
                            onClick={() => {
                              this.generate_receipt();
                            }}
                            block
                            variant="outline-primary" /**use variant='outline-primary' to show background color when clicked' or 'outline-*' to hide background color when clicked */
                            size="lg"
                            aria-controls="example-collapse-text"
                            aria-expanded={this.state.open}
                            style={{
                              fontSize: 12,
                              color: "white",
                              marginTop: 15,
                            }}
                          >
                            Generate receipt
                          </Button>
                        </Col>

                        <Col md="auto"></Col>
                      </Row>
                    </Container>
                  </div>
                </Row>
              </Paper>
            </Row>

            {/**booking process */}
            <Row style={{ background: "transparent" }}>
              <Paper
                elevation={15}
                style={{
                  background: "#14425e",
                  width: "100%",
                  color: "white",
                  fontSize: 13,
                  paddingTop: 10,
                  paddingRight: 10,
                  paddingLeft: 15,
                  paddingBottom: 5,
                  lineHeight: 2,
                  height: 500,
                }}
              >
                <div style={{ paddingBottom: 5 }}>
                  <b>Booking Process</b>
                </div>
                <b>1.</b> Select hall and book the room of your choice. Rooms
                with <span style={{ color: "red" }}>red</span> indicators are
                full and cannot be booked.
                <br />
                <b>Note: </b>You can only book one room at a time.
                <br />
                <br />
                <b>2.</b> Make payment after booking. <br />
                <b>Note:</b> If payment is not made after a certain period you
                will be unbooked from the room automatically. <br />
                <br />
                <b>3.</b> Generate receipt after payment for confirmation upon
                arrival at the hall.
              </Paper>
            </Row>
          </Col>

          {/**column containing selected hall, room layout and hall info details */}
          <Col
            md={true}
            style={{
              background: "transparent",
              marginTop: 8,
              marginLeft: 0,
              marginRight: 5,
            }}
          >
            {/**selected hall dropdown button and hall name*/}
            <Row
              style={{
                background: "transparent",
                marginBottom: 7,
                marginTop: 3,
              }}
            >
              <Paper
                elevation={15}
                style={{
                  background: "#1c88e3",
                  width: "100%",
                  paddingTop: 3,
                  paddingBottom: 3,
                  paddingRight: 0,
                }}
              >
                <Container fluid>
                  <Row>
                    {/**select hall drop down menu */}
                    <Col
                      xs="auto"
                      sm="auto"
                      md="auto"
                      lg="auto"
                      style={{ alignSelf: "center" }}
                    >
                      <DropdownButton
                        variant="dark"
                        drop="right"
                        id="dropdown-basic-button"
                        title="Select hall"
                        size="sm"
                        style={{ paddingTop: 5, paddingBottom: 5 }}
                      >
                        {this.state.halls_info_table.map((countA) => {
                          return (
                            <Dropdown.Item
                              key={countA.hall_id}
                              href="#"
                              onClick={() => {
                                this.fetch_selected_hall_rooms(
                                  countA.hall_id,
                                  countA.hall_name
                                );
                              }}
                            >
                              {countA.hall_name}
                            </Dropdown.Item>
                          );
                        })}
                      </DropdownButton>
                    </Col>

                    {/**selected hall's name */}
                    <Col
                      xs="auto"
                      sm="auto"
                      md="auto"
                      lg="auto"
                      style={{ alignSelf: "center" }}
                    >
                      <Paper
                        elevation={0}
                        style={{ background: "transparent", color: "#ffffff" }}
                      >
                        {this.state.selected_hall_name}
                      </Paper>
                    </Col>

                    {/**useless space column */}
                    <Col
                      xs={true}
                      sm={true}
                      md={true}
                      lg={true}
                      style={{ background: "transparent" }}
                    ></Col>

                    {/**logout section */}
                    <Col xs="auto" sm="auto" md="auto" lg="auto">
                      <OverlayTrigger
                        trigger="click"
                        key="left"
                        placement="left"
                        overlay={
                          <Popover
                            id="popover-positioned-left"
                            style={{
                              paddingLeft: 20,
                              paddingRight: 20,
                              paddingTop: 10,
                            }}
                          >
                            <Popover.Title
                              as="h3"
                              style={{ background: "transparent" }}
                            >
                              {this.state.student_lname}{" "}
                              {this.state.student_fname}{" "}
                              {this.state.student_oname}
                            </Popover.Title>
                            <Popover.Content style={{}}>
                              <Button
                                onClick={() => {
                                  this.logout();
                                }}
                                block
                                variant="outline-light" /**use variant='outline-primary' to show background color when clicked' or 'outline-*' to hide background color when clicked */
                                size="sm"
                                aria-controls="example-collapse-text"
                                style={{
                                  color: "black",
                                }}
                              >
                                <ExitToAppIcon
                                  style={{ color: "red", float: "left" }}
                                />
                                <span style={{ float: "left", paddingLeft: 5 }}>
                                  Logout
                                </span>
                              </Button>
                            </Popover.Content>
                          </Popover>
                        }
                      >
                        <IconButton
                          style={{
                            paddingTop: 3,
                            paddingBottom: 0,
                            fontSize: 20,
                            fontStyle: "bold",
                          }}
                        >
                          <AccountCircleRoundedIcon
                            fontSize="large"
                            style={{ color: "white" }}
                          />
                        </IconButton>
                      </OverlayTrigger>
                    </Col>
                  </Row>
                </Container>
              </Paper>
            </Row>

            <Row>
              {/**rooms layout */}
              <Col
                md={9}
                style={{
                  height: "90vh",
                  background: "transparent",
                  paddingLeft: 0,
                  paddingRight: 5,
                }}
              >
                {/**main card container with floor header tabs and rooms */}
                <Paper
                  square={false}
                  elevation={15}
                  style={{ height: "100%", background: "transparent" }}
                >
                  <Card
                    style={{
                      width: "100%",
                      height: "100%",
                      background: "#ffffff",
                    }}
                  >
                    {/**floor header tabs */}
                    <Card.Header>
                      <Nav variant="tabs" defaultActiveKey="0">
                        {" "}
                        {/**use tabs or pills */}
                        {this.state.selected_hall_floor_allocations_table.map(
                          (countB) => {
                            return (
                              <Nav.Item key={countB.selected_hall_floor_number}>
                                <Nav.Link
                                  eventKey={countB.selected_hall_floor_number}
                                  onSelect={() => {
                                    this.fetch_rooms_for_selectedfloor(
                                      countB.selected_hall_id,
                                      countB.selected_hall_floor_number
                                    );
                                  }}
                                >
                                  {countB.selected_hall_floor_name}
                                </Nav.Link>
                              </Nav.Item>
                            );
                          }
                        )}
                      </Nav>
                    </Card.Header>

                    {/**card body displaying the rooms in the form of cards */}
                    <Card.Body>
                      {/**the rooms are displayed in the card's body depending on the selected floor_number and hall_id*/}
                      <Grid container spacing={1} direction="row">
                        {this.state.selected_floor_rooms_table.map((count) => {
                          return (
                            <Grid item key={count.room_id}>
                              {/**paper container of the card */}
                              <Paper
                                elevation={5}
                                style={{
                                  width: "6rem",
                                  height: "6rem",
                                  margin: 5,
                                }}
                              >
                                {/**top card serving as the thick border line */}
                                <Card
                                  style={{
                                    width: "6rem",
                                    height: 7,
                                    borderRadius: 0,
                                    marginLeft: 0,
                                    marginTop: 0,
                                    background: count.room_availablilty_color,
                                  }}
                                ></Card>

                                {/**main card */}
                                {/**modal 2 we assign function to open the modal*/}
                                <Card
                                  onClick={() => {
                                    this.open_modal(
                                      count.room_availablilty_color,
                                      count.floor_name,
                                      count.room_number,
                                      count.room_facilities,
                                      count.room_id
                                    );
                                  }}
                                >
                                  <Card.Body style={{ height: "4rem" }}>
                                    {/**card text */}
                                    <Card.Text
                                      style={{
                                        textAlign: "center",
                                        margin: 0,
                                        fontSize: 12,
                                      }}
                                    >
                                      <b>Room</b>
                                    </Card.Text>
                                    <Card.Text
                                      style={{
                                        textAlign: "center",
                                        margin: 0,
                                        fontSize: 12,
                                      }}
                                    >
                                      <b>{count.room_number}</b>
                                    </Card.Text>
                                  </Card.Body>

                                  {/**card footer section */}
                                  <Card.Footer style={{ padding: 2 }}>
                                    {/**occupied icon */}
                                    <IconButton
                                      aria-label="delete"
                                      style={{
                                        padding: 0,
                                        fontSize: 11,
                                        float: "left",
                                      }}
                                    >
                                      <PeopleIcon
                                        fontSize="small"
                                        style={{
                                          paddingRight: 3,
                                          color: "dodgerblue",
                                        }}
                                      />
                                      <b>{count.room_beds_occupied}</b>
                                    </IconButton>

                                    {/**vacant icon */}
                                    <IconButton
                                      aria-label="delete"
                                      style={{
                                        padding: 0,
                                        fontSize: 11,
                                        fontStyle: "bold",
                                        float: "right",
                                      }}
                                    >
                                      <HotelIcon
                                        fontSize="small"
                                        style={{
                                          paddingRight: 3,
                                          color: "#50ad59",
                                        }}
                                      />
                                      <b>{count.room_beds_vacant}</b>
                                    </IconButton>
                                  </Card.Footer>
                                </Card>
                              </Paper>
                              {/**end of paper container */}
                            </Grid>
                          );
                        })}

                        {/**a backdrop that overlays over the card body containing the rooms when we're loading the selected hall's info and the data is not available yet*/}
                        {this.state.rooms_not_fetched_loader ? (
                          <Backdrop
                            open={true}
                            style={{
                              position: "absolute",
                              zIndex: 1,
                              background: "white",
                              marginTop: 55,
                            }}
                          >
                            <CircularProgress style={{ color: "black" }} />{" "}
                            <span style={{ paddingLeft: 8, color: "black" }}>
                              Fetching rooms...{" "}
                            </span>
                          </Backdrop>
                        ) : (
                          <div></div>
                        )}
                      </Grid>

                      {/**a backdrop that overlays over the card body containing the rooms when we're loading the selected hall's info and the data is not available yet*/}
                      {this.state.halls_not_fetched_loader ? (
                        <Backdrop
                          open={true}
                          style={{
                            position: "absolute",
                            zIndex: 1,
                            background: "white",
                          }}
                        >
                          <CircularProgress style={{ color: "black" }} />{" "}
                          <span style={{ paddingLeft: 8, color: "black" }}>
                            Loading...{" "}
                          </span>
                        </Backdrop>
                      ) : (
                        <div></div>
                      )}
                    </Card.Body>
                  </Card>
                </Paper>
              </Col>

              <Col md={3} style={{ background: "transparent" }}>
                {/**room symbols meaning */}
                <Row
                  style={{
                    background: "transparent",
                    marginBottom: 8,
                    marginTop: 1,
                  }}
                >
                  <Paper
                    style={{
                      width: "100%",
                      paddingTop: 6,
                      paddingBottom: 5,
                      background: "#f7f7f7",
                      paddingRight: 5,
                    }}
                  >
                    <Container fluid>
                      <Row>
                        {/**vacant bed symbol */}
                        <Col md={3} xs={true} sm={true} style={{}}>
                          <Paper
                            elevation={0}
                            style={{
                              fontSize: 12,
                              background: "transparent",
                              color: "black",
                            }}
                          >
                            Vacant
                          </Paper>
                          <IconButton
                            style={{
                              paddingTop: 0,
                              paddingBottom: 0,
                              fontSize: 11,
                              fontStyle: "bold",
                              marginTop: -5,
                            }}
                          >
                            <HotelIcon
                              fontSize="default"
                              style={{ color: "#50ad59" }}
                            />
                          </IconButton>
                        </Col>

                        {/**occupied bed symbol */}
                        <Col md={3} xs={true} sm={true} style={{}}>
                          <Paper
                            elevation={0}
                            style={{
                              fontSize: 12,
                              background: "transparent",
                              color: "black",
                            }}
                          >
                            Occupied
                          </Paper>
                          <IconButton
                            style={{
                              paddingTop: 0,
                              paddingBottom: 0,
                              fontSize: 11,
                              fontStyle: "bold",
                              marginTop: -5,
                            }}
                          >
                            <PeopleIcon
                              fontSize="default"
                              style={{ color: "dodgerblue" }}
                            />
                          </IconButton>
                        </Col>

                        {/**room available symbol*/}
                        <Col md={3} xs={true} sm={true} style={{}}>
                          <Paper
                            elevation={0}
                            style={{
                              fontSize: 12,
                              background: "transparent",
                              color: "black",
                            }}
                          >
                            Available
                          </Paper>
                          <IconButton
                            style={{
                              paddingTop: 0,
                              paddingBottom: 0,
                              fontSize: 11,
                              fontStyle: "bold",
                              marginTop: -5,
                            }}
                          >
                            <RemoveIcon
                              fontSize="default"
                              style={{ color: "#50ad59" }}
                            />
                          </IconButton>
                        </Col>

                        {/**room unavailable symbol*/}
                        <Col md={3} xs={true} style={{}}>
                          <Paper
                            elevation={0}
                            style={{
                              fontSize: 12,
                              background: "transparent",
                              color: "black",
                            }}
                          >
                            Unavailable
                          </Paper>
                          <IconButton
                            style={{
                              paddingTop: 0,
                              paddingBottom: 0,
                              fontSize: 11,
                              fontStyle: "bold",
                              marginTop: -5,
                            }}
                          >
                            <RemoveIcon
                              fontSize="default"
                              style={{ color: "red" }}
                            />
                          </IconButton>
                        </Col>
                      </Row>
                    </Container>
                  </Paper>
                </Row>

                {/**hall picture */}
                <Row
                  style={{
                    background: "transparent",
                    marginBottom: 10,
                    paddingTop: 0,
                  }}
                >
                  <Paper elevation={15} style={{ background: "transparent" }}>
                    {/**carousel */}
                    <Carousel indicators={false} controls={true}>
                      <Carousel.Item>
                        <img
                          style={{ borderRadius: 5 }}
                          className="d-block w-100"
                          src={require("../../assets/hostel1.jpg")}
                          alt="First slide"
                        />

                        <Carousel.Caption
                          style={{
                            color: "black",
                            position: "absolute",
                            bottom: 0,
                          }}
                        >
                          <span>Ashanti hall</span>
                        </Carousel.Caption>
                      </Carousel.Item>

                      <Carousel.Item>
                        <img
                          style={{ borderRadius: 5 }}
                          className="d-block w-100"
                          src={require("../../assets/hostel2.jpg")}
                          alt="Third slide"
                        />

                        <Carousel.Caption
                          style={{
                            color: "black",
                            position: "absolute",
                            bottom: 0,
                          }}
                        >
                          <span>Liberty hall</span>
                        </Carousel.Caption>
                      </Carousel.Item>
                    </Carousel>
                  </Paper>
                </Row>

                {/**quick room search */}
                <Row
                  style={{
                    background: "transparent",
                    marginBottom: 10,
                    marginTop: 10,
                  }}
                >
                  <Paper
                    elevation={15}
                    style={{
                      width: "100%",
                      background: "#14425e",
                      color: "white",
                      height: 510,
                    }}
                  >
                    <div
                      className="col text-center"
                      style={{
                        fontSize: 16,
                        paddingTop: 18,
                        paddingBottom: 20,
                      }}
                    >
                      Quick Room Search
                    </div>

                    {/**hall search input group */}
                    <div
                      style={{
                        fontSize: 14,
                        paddingLeft: 15,
                        paddingBottom: 15,
                      }}
                    >
                      Select Hall
                    </div>

                    {/**tooltip 2*/}
                    <Tooltip
                      placement="right"
                      arrow
                      leaveDelay={3000}
                      onClose={() => {
                        this.setState({
                          display_tooltip_for_hall_search: false,
                        });
                      }}
                      open={this.state.display_tooltip_for_hall_search}
                      title={
                        <span style={{ fontSize: 12 }}>Select a hall</span>
                      }
                    >
                      <InputGroup
                        size="sm"
                        style={{ paddingLeft: 10, paddingRight: 10 }}
                      >
                        <RBFormControl
                          disabled
                          placeholder="Hall"
                          aria-describedby="basic-addon2"
                        />
                        <DropdownButton
                          disabled={this.state.disable_search_inputs}
                          drop="top"
                          // alignLeft
                          as={InputGroup.Append}
                          variant="outline-secondary"
                          title={this.state.search_table[0].hall_name}
                          id="input-group-dropdown-2"
                        >
                          {this.state.halls_info_table.map((countD) => {
                            return (
                              <Dropdown.Item
                                key={countD.hall_id}
                                href="#"
                                onClick={() => {
                                  this.setState({
                                    display_tooltip_for_hall_search: false,
                                  });

                                  let temp_search_table = JSON.parse(
                                    JSON.stringify(this.state.search_table)
                                  );
                                  temp_search_table[0].hall_id = countD.hall_id;
                                  temp_search_table[0].hall_name =
                                    countD.hall_name;

                                  // console.log('temp search table', temp_search_table)
                                  this.setState(
                                    {
                                      search_table: temp_search_table,
                                    },
                                    () => {
                                      /**this is executed only after setstate has been updated */
                                      // console.log('search table', this.state.search_table)
                                      // console.log('search table hall id', this.state.search_table[0].hall_id)
                                      // console.log('search table hall name', this.state.search_table[0].hall_name)
                                    }
                                  );
                                }}
                              >
                                {countD.hall_name}
                              </Dropdown.Item>
                            );
                          })}

                          {/**if the user didnt select any of the listed halls but chose to go for the 'All' option we have to still assign it to the dropdown menu */}
                          <Dropdown.Item
                            href="#"
                            onClick={() => {
                              this.setState({
                                display_tooltip_for_hall_search: false,
                              });

                              let temp_search_table = JSON.parse(
                                JSON.stringify(this.state.search_table)
                              );
                              temp_search_table[0].hall_name = "All";
                              temp_search_table[0].hall_id = "All";

                              this.setState({
                                search_table: temp_search_table,
                              });
                            }}
                          >
                            All
                          </Dropdown.Item>
                        </DropdownButton>
                      </InputGroup>
                    </Tooltip>

                    <div
                      style={{
                        fontSize: 14,
                        paddingLeft: 15,
                        paddingTop: 35,
                        paddingBottom: 10,
                      }}
                    >
                      Room information
                    </div>

                    {/**total beds input group */}
                    <Tooltip
                      placement="right"
                      arrow
                      leaveDelay={3000}
                      onClose={() => {
                        this.setState({
                          display_tooltip_for_total_beds_search: false,
                        });
                      }}
                      open={this.state.display_tooltip_for_total_beds_search}
                      title={
                        <span style={{ fontSize: 12 }}>
                          Select the total number of beds
                        </span>
                      }
                    >
                      <InputGroup
                        size="sm"
                        style={{
                          paddingLeft: 10,
                          paddingRight: 10,
                          marginTop: 10,
                        }}
                      >
                        <RBFormControl
                          disabled
                          placeholder="Total beds"
                          aria-describedby="basic-addon2"
                        />
                        <DropdownButton
                          disabled={this.state.disable_search_inputs}
                          as={InputGroup.Append}
                          drop="top"
                          variant="outline-secondary"
                          title={this.state.search_table[0].room_total_beds}
                          id="input-group-dropdown-2"
                        >
                          <Dropdown.Item
                            onClick={() => {
                              this.update_total_beds_search_value(1);
                            }}
                            href="#"
                          >
                            1
                          </Dropdown.Item>
                          <Dropdown.Item
                            onClick={() => {
                              this.update_total_beds_search_value(2);
                            }}
                            href="#"
                          >
                            2
                          </Dropdown.Item>
                          <Dropdown.Item
                            onClick={() => {
                              this.update_total_beds_search_value(3);
                            }}
                            href="#"
                          >
                            3
                          </Dropdown.Item>
                          <Dropdown.Item
                            onClick={() => {
                              this.update_total_beds_search_value(4);
                            }}
                            href="#"
                          >
                            4
                          </Dropdown.Item>
                          <Dropdown.Item
                            onClick={() => {
                              this.update_total_beds_search_value(5);
                            }}
                            href="#"
                          >
                            5
                          </Dropdown.Item>
                          <Dropdown.Item
                            onClick={() => {
                              this.update_total_beds_search_value(6);
                            }}
                            href="#"
                          >
                            6
                          </Dropdown.Item>
                          <Dropdown.Item
                            onClick={() => {
                              this.update_total_beds_search_value(7);
                            }}
                            href="#"
                          >
                            7
                          </Dropdown.Item>
                          <Dropdown.Item
                            onClick={() => {
                              this.update_total_beds_search_value(8);
                            }}
                            href="#"
                          >
                            8
                          </Dropdown.Item>
                        </DropdownButton>
                      </InputGroup>
                    </Tooltip>

                    {/**vacant beds input group */}
                    <Tooltip
                      placement="right"
                      arrow
                      leaveDelay={3000}
                      onClose={() => {
                        this.setState({
                          display_tooltip_for_vacant_beds_search: false,
                        });
                      }}
                      open={this.state.display_tooltip_for_vacant_beds_search}
                      title={
                        <span style={{ fontSize: 12 }}>
                          Select the number of vacant beds
                        </span>
                      }
                    >
                      <InputGroup
                        size="sm"
                        style={{
                          paddingLeft: 10,
                          paddingRight: 10,
                          marginTop: 20,
                        }}
                      >
                        <RBFormControl
                          disabled
                          placeholder="Vacant beds"
                          aria-describedby="basic-addon2"
                        />

                        <Tooltip
                          placement="right"
                          arrow
                          leaveDelay={2000}
                          onClose={() => {
                            this.setState({
                              display_tooltip_for_vacant_beds_notgreaterthan_totalbeds: false,
                            });
                          }}
                          open={
                            this.state
                              .display_tooltip_for_vacant_beds_notgreaterthan_totalbeds
                          }
                          title={
                            <span style={{ fontSize: 12 }}>
                              Vacant beds cannot
                              <br />
                              exceed total beds
                            </span>
                          }
                        >
                          <DropdownButton
                            disabled={this.state.disable_search_inputs}
                            as={InputGroup.Append}
                            drop="top"
                            variant="outline-secondary"
                            title={this.state.search_table[0].room_vacant_beds}
                            id="input-group-dropdown-2"
                          >
                            <Dropdown.Item
                              onClick={() => {
                                this.update_vacant_beds_search_value(0);
                              }}
                              href="#"
                            >
                              0
                            </Dropdown.Item>
                            <Dropdown.Item
                              onClick={() => {
                                this.update_vacant_beds_search_value(1);
                              }}
                              href="#"
                            >
                              1
                            </Dropdown.Item>
                            <Dropdown.Item
                              onClick={() => {
                                this.update_vacant_beds_search_value(2);
                              }}
                              href="#"
                            >
                              2
                            </Dropdown.Item>
                            <Dropdown.Item
                              onClick={() => {
                                this.update_vacant_beds_search_value(3);
                              }}
                              href="#"
                            >
                              3
                            </Dropdown.Item>
                            <Dropdown.Item
                              onClick={() => {
                                this.update_vacant_beds_search_value(4);
                              }}
                              href="#"
                            >
                              4
                            </Dropdown.Item>
                            <Dropdown.Item
                              onClick={() => {
                                this.update_vacant_beds_search_value(5);
                              }}
                              href="#"
                            >
                              5
                            </Dropdown.Item>
                            <Dropdown.Item
                              onClick={() => {
                                this.update_vacant_beds_search_value(6);
                              }}
                              href="#"
                            >
                              6
                            </Dropdown.Item>
                            <Dropdown.Item
                              onClick={() => {
                                this.update_vacant_beds_search_value(7);
                              }}
                              href="#"
                            >
                              7
                            </Dropdown.Item>
                            <Dropdown.Item
                              onClick={() => {
                                this.update_vacant_beds_search_value(8);
                              }}
                              href="#"
                            >
                              8
                            </Dropdown.Item>
                          </DropdownButton>
                        </Tooltip>
                      </InputGroup>
                    </Tooltip>

                    {/**occupied beds input group */}
                    <InputGroup
                      size="sm"
                      style={{
                        paddingLeft: 10,
                        paddingRight: 10,
                        marginTop: 20,
                      }}
                    >
                      <RBFormControl disabled placeholder="Occupied beds" />
                      <InputGroup.Append>
                        <Button disabled variant="outline-secondary">
                          {this.state.search_table[0].room_occupied_beds}
                        </Button>
                      </InputGroup.Append>
                    </InputGroup>

                    {/**search rooms button */}
                    <div className="col text-center">
                      <Button
                        onClick={() => {
                          this.search_rooms();
                        }}
                        block
                        variant="outline-light" /**use variant='outline-primary' to show background color when clicked' or 'outline-*' to hide background color when clicked */
                        size="lg"
                        aria-controls="example-collapse-text"
                        aria-expanded={this.state.open}
                        style={{
                          fontSize: 12,
                          color: "#a3a6af",
                          marginBottom: 15,
                          marginTop: 20,
                        }}
                      >
                        {this.state.show_searching_spinner ? (
                          <span
                            className="spinner-border spinner-border-sm"
                            role="status"
                            aria-hidden="true"
                            style={{ marginRight: 5 }}
                          ></span>
                        ) : (
                          <div></div>
                        )}
                        {this.state.search_button_text}
                      </Button>
                    </div>
                  </Paper>
                </Row>
              </Col>
            </Row>
          </Col>
        </Row>

        {/**modal 4 we render the modal if this.state.display_modal is set to true ..this code should be anywhere inside the render() function*/}
        {/**modal for available room starts here*/}
        <Modal
          show={this.state.display_modal_for_available_room}
          backdrop="static"
          onHide={() => {
            this.close_modal_for_available_room();
          }}
          size="sm"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              <div className="col text-center" style={{ fontSize: 18 }}>
                Booking Confimation
              </div>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="container" style={{ fontSize: 13, color: "black" }}>
              <div className="row">
                <div className="col" style={{}}>
                  Hall:
                </div>
                <div className="col" style={{ paddingLeft: 0 }}>
                  {this.state.selected_hall_name}
                </div>

                <div className="w-100" style={{ marginTop: 5 }}></div>
                <div className="col" style={{}}>
                  Floor:
                </div>
                <div className="col" style={{ paddingLeft: 0 }}>
                  {this.state.bookedroom_floor_name}
                </div>

                <div className="w-100" style={{ marginTop: 5 }}></div>
                <div className="col" style={{}}>
                  Room number:
                </div>
                <div className="col" style={{ paddingLeft: 0 }}>
                  {this.state.bookedroom_number}
                </div>

                <div className="w-100" style={{ marginTop: 5 }}></div>
                <div className="col" style={{}}>
                  Room facilities:
                </div>
                <div className="col" style={{ paddingLeft: 0 }}>
                  {this.state.bookedroom_facilities}
                </div>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              block
              disabled={this.state.disable_room_booking_buttons}
              onClick={() => {
                this.book_room();
              }}
            >
              Book
            </Button>
            <Button
              block
              disabled={this.state.disable_room_booking_buttons}
              onClick={() => {
                this.close_modal_for_available_room();
              }}
              variant="danger"
            >
              Cancel
            </Button>
          </Modal.Footer>

          {this.state.room_booking_please_wait_loader ? (
            <Paper
              style={{
                position: "absolute",
                top: 140,
                right: 80,
                background: "dodgerblue",
                paddingTop: 5,
                paddingBottom: 5,
              }}
            >
              <div className="col text-center">
                <Spinner animation="border" size="sm" variant="light" />{" "}
                <span style={{ color: "white" }}>Please wait ... </span>
              </div>
            </Paper>
          ) : (
            <p style={{ color: "transparent" }}>useless text</p>
          )}
        </Modal>

        {/**modal for unavailable room starts here */}
        <Modal
          show={this.state.display_modal_for_unavailable_room}
          onHide={() => {
            this.close_modal_for_unavailable_room();
          }}
          size="sm"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Body>
            <div className="col text-center">
              <p>Sorry, this room has been fully occupied and is unavailable</p>
            </div>
            <div className="col text-center">
              <Button
                block
                onClick={() => {
                  this.close_modal_for_unavailable_room();
                }}
              >
                Close
              </Button>
            </div>
          </Modal.Body>
        </Modal>

        {/**modal for general purposes starts here */}
        <Modal
          show={this.state.display_general_modal}
          onHide={() => {
            this.close_general_modal();
          }}
          size="sm"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Body>
            <div className="col text-center">
              <p>{this.state.general_modal_message}</p>
            </div>
            <div className="col text-center">
              <Button
                block
                onClick={() => {
                  this.close_general_modal();
                }}
              >
                Close
              </Button>
            </div>
          </Modal.Body>
        </Modal>

        {/**modal for succesful booking starts here */}
        <Modal
          show={this.state.display_modal_for_successful_booking}
          onHide={() => {
            this.close_modal_for_successful_booking();
          }}
          size="sm"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Body>
            <div className="col text-center">
              <p>Room successfully booked!</p>
            </div>
            <div className="col text-center">
              <Button
                variant="success"
                onClick={() => {
                  this.close_modal_for_successful_booking();
                }}
              >
                Close
              </Button>
            </div>
          </Modal.Body>
        </Modal>

        {/**dialog box 3 */}
        <Dialog
          open={this.state.display_dialog_box}
          onClose={() => {
            this.close_dialog_box();
          }}
          aria-labelledby="draggable-dialog-title"
        >
          <DialogTitle
            style={{
              cursor: "move",
              textAlign: "center",
              background: "reds",
              width: 260,
              paddingTop: 5,
              paddingBottom: 0,
            }}
            id="draggable-dialog-title"
          >
            Confirm Booking
          </DialogTitle>
          <DialogContent
            style={{
              background: "yellows",
              width: 260,
              paddingLeft: 15,
              paddingBottom: 0,
            }}
          >
            <DialogContentText style={{ fontSize: 14, padding: 0 }}>
              Are you sure you want to book this room? Changes made cannot be
              undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions
            style={{ background: "greens", width: 260, paddingTop: 0 }}
          >
            <Button
              variant="primary"
              onClick={() => {
                this.confrim_booking();
              }}
            >
              Confirm
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                this.close_dialog_box();
              }}
            >
              Cancel
            </Button>
          </DialogActions>
        </Dialog>

        {/**backdrop  */}
        <Backdrop
          open={this.state.display_backdrop}
          style={{ position: "absolute", zIndex: 1, height: "100vh" }}
        >
          <CircularProgress style={{ color: "white" }} />{" "}
          <span style={{ paddingLeft: 8, color: "white" }}>
            Please wait...{" "}
          </span>
        </Backdrop>

        {/**modal for quick searched rooms starst here*/}
        <Modal
          show={this.state.display_modal_containing_quick_searched_rooms}
          backdrop="static"
          onHide={() => {
            this.setState({
              display_modal_containing_quick_searched_rooms: false,
            });
          }}
          // size="sm"
          dialogClassName="modal-80w" /**setting a custom width of 90% to the modal */
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              <div className="col text-center" style={{ fontSize: 18 }}>
                Search results
              </div>
            </Modal.Title>
          </Modal.Header>

          <Modal.Body
            style={{
              paddingLeft: 0,
              paddingRight: 0,
              paddingTop: 0,
              paddingBottom: 0,
              maxHeight: "calc(100vh-210px)",
              overflowY: "auto",
            }}
          >
            <ListGroup>
              {this.state.searched_rooms_table.map((countE) => {
                return (
                  <ListGroup.Item
                    key={countE.room_id}
                    style={{
                      paddingLeft: 0,
                      paddingRight: 0,
                      paddingTop: 5,
                      paddingBottom: 5,
                    }}
                  >
                    <div
                      className="row"
                      style={{ marginLeft: 0, fontSize: 12, marginRight: 0 }}
                    >
                      <div
                        className="col-4 text-center"
                        style={{ background: "reds", paddingTop: 3 }}
                      >
                        <h5>Room</h5>
                        <h6>{countE.room_number}</h6>
                      </div>
                      <div
                        className="col"
                        style={{
                          background: "yellows",
                          paddingLeft: 3,
                          paddingTop: 2,
                        }}
                      >
                        <div className="row">
                          <div className="col-12" style={{}}>
                            <b>{countE.hall_name}</b>
                          </div>

                          <div className="w-100" style={{ marginTop: 5 }}></div>
                          <div className="col-12" style={{}}>
                            {countE.floor_name}
                          </div>

                          <div className="w-100" style={{ marginTop: 5 }}></div>
                          <div className="col" style={{}}>
                            {countE.room_facilities}
                          </div>
                        </div>
                      </div>
                    </div>
                  </ListGroup.Item>
                );
              })}
            </ListGroup>
          </Modal.Body>
          <Modal.Footer>
            <div className="col text-center">
              <Button
                block
                variant="primary"
                onClick={() => {
                  this.setState({
                    display_modal_containing_quick_searched_rooms: false,
                  });
                }}
              >
                Close
              </Button>
            </div>
          </Modal.Footer>
        </Modal>
      </Container>
    );
  }

  /**modal 3 we define the function to open the modal */
  open_modal(
    room_availability_status,
    floor_name,
    room_number,
    room_facilities,
    room_db_id
  ) {
    // console.log('hall: ', this.state.selected_hall_name)
    // console.log('floor: ', floor_name)
    // console.log('room number: ', room_number)
    // console.log('room facilites: ', room_facilities)

    /**if the room is available or unavailable we can tell by the color of the bar on the room card which we had from the map function in the render method */
    /**if room is available */
    if (room_availability_status === "#50ad59") {
      /**we first assign the details of the room to our variables in the modal before it opens */
      this.setState({ bookedroom_floor_name: floor_name });
      this.setState({ bookedroom_number: room_number });
      this.setState({ bookedroom_facilities: room_facilities });

      this.setState({
        bookedroom_db_id: room_db_id,
      }); /**we'd use this for the booking the student in the db */

      /**then we can now display our modal */
      this.setState({ display_modal_for_available_room: true });
    } else {
      /**if room is unavailable room_status = red  */
      this.setState({ display_modal_for_unavailable_room: true });
    }
  }

  /**when the student selects an available room we present the available room modal */
  book_room() {
    /**if user has already booked a room before we prompt him he has done so */
    if (this.state.student_already_booked === true) {
      this.setState({
        general_modal_message: "You are already booked to a room!",
      });
      this.close_modal_for_available_room();
      this.open_general_modal();
    } else {
      /**if user hasnt booked a room before we can proceed to open confirmation dialog box for him */

      /**when the modal for available room opens and the user clicks book we want the user to confirm again by displaying a dialog box */
      this.open_dialog_box();
    }
  }

  /**if the user confrims booking from the dialog box that appears we proceed to update in the db */
  confrim_booking() {
    this.close_dialog_box(); /**hide the dialog box */
    this.setState({ display_modal_for_available_room: false });
    // this.setState({ disable_room_booking_buttons: true })   /**disable buttons on room available modal to prevent interfernce */

    /**we show our loader whiles doing the db insertion*****uncomment the one u want to use */
    // this.setState({ room_booking_please_wait_loader: true }) /**show please waiting loader */
    this.show_backdrop();

    // console.log('student id is: ', modulevariables.global_student_id)
    // console.log('room id is: ', this.state.bookedroom_db_id)

    /**then we insert into the db */
    this.insert_new_booking();
  }

  /**inserting a new booking into the db */
  insert_new_booking() {
    fetch(server + "insert_new_booking.php", {
      method: "POST",
      headers: {
        Accept: "text/plain",
        "Content-Type": "text/plain",
      },
      body: JSON.stringify({
        room_idDB: this.state.bookedroom_db_id,
        student_idDB: modulevariables.global_student_id,
      }),
    })
      .then((response) => response.text())
      .then(
        (responseJson) => {
          // console.log(responseJson)

          var jsonconvertedrows = JSON.parse(responseJson);
          var finaldata = JSON.stringify(jsonconvertedrows);

          // /**if booking was succesffuly inserted into the db */
          if (finaldata === '"new booking successfully added"') {
            this.setState({ student_already_booked: true }); //so that student cannot book any room again
            this.hide_backdrop();
            this.setState({ disable_room_booking_buttons: false });
            this.setState({ display_modal_for_successful_booking: true });
          } else {
            alert("booking failed");
            this.hide_backdrop();
            this.setState({ disable_room_booking_buttons: false });
          }
        },
        (err) => {
          /**connection to server err */
          alert("booking failed check internet conn.");
          this.hide_backdrop();
          this.setState({ disable_room_booking_buttons: false });
        }
      );
  }

  /**modal 5 we close our modal this way. NB also add it to the onHide prop in the modal */
  close_modal_for_available_room() {
    this.setState({ display_modal_for_available_room: false });
  }

  close_modal_for_unavailable_room() {
    this.setState({ display_modal_for_unavailable_room: false });
  }

  close_modal_for_successful_booking() {
    this.setState({ display_modal_for_successful_booking: false });

    /**after closing this modal we fresh the floor's rooms to reveal the new changes to the beds occupied and beds vacant values */
    this.fetch_rooms_for_selectedfloor(
      this.state.hall_id_for_page_reload,
      this.state.floor_number_for_page_reload
    );
  }

  open_general_modal() {
    this.setState({ display_general_modal: true });
  }

  close_general_modal() {
    this.setState({ display_general_modal: false });
  }

  /**dialog box 2 */
  open_dialog_box() {
    this.setState({ display_dialog_box: true });
  }

  close_dialog_box() {
    this.setState({ display_dialog_box: false });
  }

  show_backdrop() {
    this.setState({ display_backdrop: true });
  }

  hide_backdrop() {
    this.setState({ display_backdrop: false });
  }

  /**asyncstorage 2 */
  /**async storage functions */
  _asyncStore_clear_student_id = async () => {
    try {
      await AsyncStorage.removeItem("stored_student_id");
      modulevariables.global_student_id = null;
    } catch (error) {
      // Error clearing data
      console.log("async storage error: ", error);
    }
  };

  _asyncStore_fetch_student_id = async () => {
    try {
      /**we fetch the async storage's stored student_id into the modulevariables.global_student_id
       * so that we can use the modulevariables.global_student_id for most of our db queries
       */
      modulevariables.global_student_id = await AsyncStorage.getItem(
        "stored_student_id"
      );

      this.fetch_student_details();
    } catch (error) {
      // Error fetching data
      console.log("async storage error: ", error);
    }
  };

  /**we update the total beds value in the search table whenever a student selects a new value
   * for the total of beds to search for
   */
  update_total_beds_search_value(dropdown_value) {
    this.setState({ display_tooltip_for_total_beds_search: false });

    let temp_search_table = JSON.parse(JSON.stringify(this.state.search_table));
    temp_search_table[0].room_total_beds = dropdown_value;

    /**clear any values in the vacant beds and occupied beds section to prevent the sum of these from not reaching the total of beds selected */
    temp_search_table[0].room_vacant_beds = "";
    temp_search_table[0].room_occupied_beds = "";

    /**then we finally update all the values in our search table */
    this.setState({ search_table: temp_search_table });
  }

  /**we update the vacant beds value in the search table whenever the student selects a new value
   * for the number of vacant beds to search for
   */
  update_vacant_beds_search_value(dropdown_value) {
    this.setState({ display_tooltip_for_total_beds_search: false });

    /**we cant select total vacant beds which is more than the total beds initially selected */
    if (dropdown_value > this.state.search_table[0].room_total_beds) {
      this.setState({
        display_tooltip_for_vacant_beds_notgreaterthan_totalbeds: true,
      });
    } else {
      this.setState({
        display_tooltip_for_vacant_beds_notgreaterthan_totalbeds: false,
      });

      /**if the vacant beds selected doesnt exceed the total number of beds we update the value under 'Vacant beds' */
      let temp_search_table = JSON.parse(
        JSON.stringify(this.state.search_table)
      );
      temp_search_table[0].room_vacant_beds = dropdown_value;

      /**we also automatically update the number of occupied beds */
      temp_search_table[0].room_occupied_beds =
        temp_search_table[0].room_total_beds -
        temp_search_table[0].room_vacant_beds;

      /**then we finally update all the values in our search table */
      this.setState({ search_table: temp_search_table });
    }
  }

  /**search rooms */
  search_rooms() {
    /**if any of the search fields are empty we provide the tooltip */
    if (
      this.state.search_table[0].hall_name === "" ||
      this.state.search_table[0].room_total_beds === "" ||
      this.state.search_table[0].room_vacant_beds === ""
    ) {
      if (this.state.search_table[0].hall_name === "") {
        this.setState({ display_tooltip_for_hall_search: true });
      }

      if (this.state.search_table[0].room_total_beds === "") {
        this.setState({ display_tooltip_for_total_beds_search: true });
      }

      if (this.state.search_table[0].room_vacant_beds === "") {
        this.setState({ display_tooltip_for_vacant_beds_search: true });
      }
    } else {
      /**if user's provides all search details as required */
      /**disable the search inputs and change what appears on our search button  */
      this.setState({ disable_search_inputs: true });
      this.setState({ show_searching_spinner: true });
      this.setState({ search_button_text: "Searching" });

      /**search database for rooms which match search options provided */
      // console.log('search options are: ', this.state.search_table)

      /**begin our search in the db */
      fetch(server + "quick_search_for_rooms.php", {
        method: "POST",
        headers: {
          Accept: "text/plain",
          "Content-Type": "text/plain",
        },
        body: JSON.stringify({
          hall_idDB: this.state.search_table[0].hall_id,
          total_beds_searchDB: this.state.search_table[0].room_total_beds,
          vacant_beds_searchDB: this.state.search_table[0].room_vacant_beds,
          occupied_beds_searchDB: this.state.search_table[0].room_occupied_beds,
          student_genderDB:
            this.state
              .student_gender /**if the student selects all hostels then we search based on halls which match their gender */,
        }),
      })
        .then((response) => response.text())
        .then((responseJson) => {
          //raw data response from database
          // console.log(responseJson)

          var jsonconvertedrows = JSON.parse(responseJson);
          var finaldata = JSON.stringify(jsonconvertedrows);

          if (finaldata === '"no search results"') {
            this.setState({ general_modal_message: "No rooms were found!" });
            this.open_general_modal();
            this.setState({ disable_search_inputs: false });
            this.setState({ search_button_text: "Search" });
            this.setState({ show_searching_spinner: false });
          } else {
            /**if rooms were found according to the search*/
            this.setState({ searched_rooms_table: [] });

            /**now since some halls may be mixed we need to filter out and display only the rooms which are specific to the student's gender in that particular mixed hall */
            for (var key2 = jsonconvertedrows.length - 1; key2 >= 0; key2--) {
              if (
                jsonconvertedrows[key2].room_gender === null ||
                jsonconvertedrows[key2].room_gender ===
                  this.state.student_gender
              ) {
                /**we do nothing and leave the record in the table */
              } else {
                /**if room's gender is opposite of the student's gender we remove it from the table */
                // console.log('remove room: ', jsonconvertedrows[key].room_number)
                jsonconvertedrows.splice(key2, 1);
              }
            }

            /**then we finally set the results into our table excluding rooms which are opposite of the student's gender */
            this.setState({ searched_rooms_table: jsonconvertedrows });

            // console.log('Rooms found according to search: ', this.state.searched_rooms_table)
            this.setState({ disable_search_inputs: false });
            this.setState({ search_button_text: "Search" });
            this.setState({ show_searching_spinner: false });

            this.open_modal_for_quick_searched_rooms();
          }
        });
    }
  }

  /**modal to display list of rooms which matched the quick search */
  open_modal_for_quick_searched_rooms() {
    this.setState({ display_modal_containing_quick_searched_rooms: true });
  }

  /**logout */
  logout() {
    modulevariables.global_student_id = null;

    this._asyncStore_clear_student_id();

    /**navigate to student page */
    this.setState({ redirect: true }); /**navigation *** 4 */
  }

  /**generate payment receipt */
  generate_receipt() {
    /**if student hasnt paid we cant generate a receipt for them */
    if (this.state.student_payment_status === false) {
      /**for our general modal */
      this.setState({ general_modal_message: "No payment has been made!" });
      this.setState({ display_general_modal: true });
    } else {
      /**codes to generate receipt */
    }
  }

  /**make payment */
  make_payment() {
    /**if student hasnt booked a room they cannot make any payment */
    if (this.state.student_already_booked === false) {
      /**for our general modal */
      this.setState({
        general_modal_message: "Book a room before making payment",
      });
      this.setState({ display_general_modal: true });
    } else {
      /**codes to make payment */
    }
  }
}

export default Dashboard;
