import React, { Component } from 'react';
// import Button from '@material-ui/core/Button';
// import CssBaseline from '@material-ui/core/CssBaseline';
// import TextField from '@material-ui/core/TextField';
// import FormControlLabel from '@material-ui/core/FormControlLabel';
// import Checkbox from '@material-ui/core/Checkbox';
// import Typography from '@material-ui/core/Typography';
// import Container from '@material-ui/core/Container';
// import { Link } from 'react-router-dom'
import Carousel from 'react-bootstrap/Carousel'
import MediaQuery from 'react-responsive'
import Grid from '@material-ui/core/Grid'

class Testpage extends Component {

    constructor(props) {
        super(props)
    }


    render() {
        return (

            <div>
                {
                    this.showmediaqueriestest2()
                }
            </div>

        );
    }


    /**carousel design test */
    showcarouseldesigns() {
        return (
            <div>

                {/*****************************the following are styling from https://react-bootstrap.github.io/components/alerts/ */}
                <Carousel style={{ width: '100%', height: 300 }}>

                    <Carousel.Item>
                        <img
                            style={{ width: 300, height: 300 }}
                            className="d-block w-100"
                            src="https://lh3.googleusercontent.com/wEUGWzZLTblBnjQZ89tob5ridzWXnaptA_5lD-icyx7O3pANAi5iYnNIwGrI5bpkhuAyVhu6=w640-h400-e365"
                            alt="First slide"
                        />
                        <Carousel.Caption>
                            <h3>First slide label</h3>
                            <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
                        </Carousel.Caption>
                    </Carousel.Item>
                    <Carousel.Item>
                        <img
                            style={{ width: 300, height: 300 }}
                            className="d-block w-100"
                            src="https://i.ytimg.com/vi/1wRe6RNLI58/maxresdefault.jpg"
                            alt="Third slide"
                        />


                        <Carousel.Caption>
                            <h3>Second slide label</h3>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                        </Carousel.Caption>
                    </Carousel.Item>
                    <Carousel.Item>
                        <img
                            style={{ width: 300, height: 300 }}
                            className="d-block w-100"
                            src="https://repack-games.com/wp-content/uploads/2019/03/Need-for-Speed-Rivals-Free-Download-Torrent.jpg"
                            alt="Third slide"
                        />

                        <Carousel.Caption>
                            <h3>Third slide label</h3>
                            <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur.</p>
                        </Carousel.Caption>
                    </Carousel.Item>
                </Carousel>
                {/*****************************the following are styling from https://react-bootstrap.github.io/components/alerts/ */}



                {/******************************the following are styling from https://getbootstrap.com/docs/4.4/components/alerts/ */}
                <button type="button" class="btn btn-primary">Primary</button>

                <div class="btn-toolbar" role="toolbar" aria-label="Toolbar with button groups">
                    <div class="btn-group mr-2" role="group" aria-label="First group">
                        <button type="button" class="btn btn-secondary">1</button>
                        <button type="button" class="btn btn-secondary">2</button>
                        <button type="button" class="btn btn-secondary">3</button>
                        <button type="button" class="btn btn-secondary">4</button>
                    </div>
                    <div class="btn-group mr-2" role="group" aria-label="Second group">
                        <button type="button" class="btn btn-secondary">5</button>
                        <button type="button" class="btn btn-secondary">6</button>
                        <button type="button" class="btn btn-secondary">7</button>
                    </div>
                    <div class="btn-group" role="group" aria-label="Third group">
                        <button type="button" class="btn btn-secondary">8</button>
                    </div>
                </div>
                {/******************************the following are styling from https://getbootstrap.com/docs/4.4/components/alerts/ */}


                {/**perfect div container for 100% height */}
                {/**container */}
                <div style={{ height: '100%', margin: 0, padding: 0, background: 'red' }}>

                    {/**column container */}
                    <div style={{ display: 'flex', height: '100%' }}>

                        {/**left container */}
                        <div style={{ height: '100%', flex: '1', margin: 10, background: 'black' }}>

                        </div>

                        {/**middile container */}
                        <div style={{ flex: '2', margin: 10, background: 'black', height: '100%' }}>

                        </div>

                        {/**right container */}
                        <div style={{ flex: '1', margin: 10, background: 'black', height: '100%' }}>

                        </div>
                    </div>
                </div>


                {/**option 2 */}
                {/**container */}
                <div style={{ height: '100%', margin: 0, padding: 0, background: 'red' }}>

                    <div class="row" style={{ height: '100%', margin: 0, padding: 0, background: 'red' }}>
                        <div class="col" style={{ height: '60%', margin: 0, padding: 0, background: 'yellow' }}>col</div>
                        <div class="col" style={{ height: '50%', margin: 0, padding: 0, background: 'green' }}>col</div>

                        <div class="w-100"></div>
                        <div class="col">col</div>
                        <div class="col">col</div>
                    </div>

                </div>

            </div>
        )
    }


    /**media queries design test */
    showmediaqueries() {
        return (
            <div>
                <div>Device Test!</div>

                <MediaQuery minDeviceWidth={1224}>

                    <div>You are a desktop or laptop</div>
                    <MediaQuery minDeviceWidth={1824}>
                        <div>You also have a huge screen</div>
                    </MediaQuery>

                    <MediaQuery maxWidth={1224}>
                        <div>You are sized like a tablet or mobile phone though</div>
                    </MediaQuery>

                </MediaQuery>


                <MediaQuery maxDeviceWidth={1224}>
                    <div>You are a tablet or mobile phone</div>
                </MediaQuery>

                <MediaQuery orientation="portrait">
                    <div>You are portrait</div>
                </MediaQuery>

                <MediaQuery orientation="landscape">
                    <div>You are landscape</div>
                </MediaQuery>

                <MediaQuery minResolution="2dppx">
                    <div>You are retina</div>
                </MediaQuery>

            </div>
        )
    }


    /**media queries actual test */
    showmediaqueriestest1() {
        return (
            <div>

                <MediaQuery maxWidth={1224} >
                    {(matches) => {
                        if (matches) {

                            {/**tablet or phone screen */ }
                            return (
                                <div>

                                    <div>this is tablet or phone screen</div>

                                    <MediaQuery orientation="landscape">
                                        {(matches) => {
                                            if (matches) {

                                                {/**tablet/phone with landscape view */ }
                                                return (
                                                    <Grid container spacing={2} direction='row' style={{ background: 'transparent', position: 'fixed', margin: 0, top: 0, left: 0, width: '100%', height: '100%' }}>

                                                        {/**col 1 ***/}
                                                        <Grid xs={6} style={{ background: 'red' }}>
                                                        </Grid>

                                                        {/**col 2 ***/}
                                                        <Grid xs={6} style={{ background: 'yellow' }}>
                                                        </Grid>

                                                    </Grid>
                                                )
                                            }
                                            else {

                                                {/**tablet/phone with portrait view */ }
                                                return (
                                                    <Grid container spacing={0} direction='column' style={{ background: 'green', position: 'fixed', margin: 0, top: 0, left: 0, width: '100%', height: '100%' }}>

                                                        {/**row 1 ***/}
                                                        <Grid md={6} style={{ background: 'red', height: '50%' }}>
                                                        </Grid>

                                                        {/**row 2 ***/}
                                                        <Grid md={6} style={{ background: 'yellow', height: '50%' }}>
                                                        </Grid>

                                                    </Grid>
                                                )
                                            }
                                        }}
                                    </MediaQuery>

                                </div>
                            )


                        } else {


                            {/**desktop screen */ }
                            return (
                                <div>

                                    {/* <div>this is a desktop screen</div> */}

                                    <MediaQuery orientation="landscape">
                                        {(matches) => {
                                            if (matches) {

                                                {/**desktop with landscape view */ }
                                                return (
                                                    <Grid container spacing={2} direction='row' style={{ background: 'transparent', position: 'fixed', margin: 0, top: 0, left: 0, width: '100%', height: '100%' }}>

                                                        {/**col 1 ***/}
                                                        <Grid xs={6} style={{ background: 'red' }}>
                                                        </Grid>

                                                        {/**col 2 ***/}
                                                        <Grid xs={6} style={{ background: 'yellow' }}>
                                                        </Grid>

                                                    </Grid>
                                                )
                                            }
                                            else {

                                                {/**desktop with portrait view */ }
                                                return (
                                                    <Grid container spacing={2} direction='row' style={{ background: 'transparent', position: 'fixed', margin: 0, top: 0, left: 0, width: '100%', height: '100%' }}>

                                                        {/**col 1 ***/}
                                                        <Grid xs={6} style={{ background: 'red' }}>
                                                        </Grid>

                                                        {/**col 2 ***/}
                                                        <Grid xs={6} style={{ background: 'yellow' }}>
                                                        </Grid>

                                                    </Grid>
                                                )
                                            }
                                        }}
                                    </MediaQuery>

                                </div>
                            )
                        }
                    }}
                </MediaQuery>

            </div>
        )
    }


    /**actual media queries test */
    showmediaqueriestest2() {
        return (
            <div>

                {/**destop/laptop and landscape */}
                <MediaQuery minDeviceWidth={1224} orientation="landscape">

                    <Grid container spacing={2} direction='row' style={{ background: 'transparent', position: 'fixed', margin: 0, top: 0, left: 0, width: '100%', height: '100%' }}>

                        {/**col 1 ***/}
                        <Grid xs={6} style={{ background: 'red' }}>
                        </Grid>

                        {/**col 2 ***/}
                        <Grid xs={6} style={{ background: 'yellow' }}>
                        </Grid>

                    </Grid>

                </MediaQuery>

                {/**desktop/laptop and portrait */}
                <MediaQuery minDeviceWidth={1224} orientation="portrait">

                    <Grid container spacing={2} direction='row' style={{ background: 'transparent', position: 'fixed', margin: 0, top: 0, left: 0, width: '100%', height: '100%' }}>

                        {/**col 1 ***/}
                        <Grid item xs={6} style={{ background: 'red' }}>
                        </Grid>

                        {/**col 2 ***/}
                        <Grid item xs={6} style={{ background: 'yellow' }}>
                        </Grid>

                    </Grid>

                </MediaQuery>


                {/**destop/laptop resized to tablet/mobile and landscape */}
                <MediaQuery maxWidth={1224} orientation="landscape">

                    <Grid container spacing={2} direction='row' style={{ background: 'transparent', position: 'fixed', margin: 0, top: 0, left: 0, width: '100%', height: '100%' }}>

                        {/**col 1 ***/}
                        <Grid xs={6} style={{ background: 'red' }}>
                        </Grid>

                        {/**col 2 ***/}
                        <Grid xs={6} style={{ background: 'yellow' }}>
                        </Grid>

                    </Grid>

                </MediaQuery>


                {/**destop/laptop resized to tablet/mobile and portrait */}
                <MediaQuery maxWidth={1224} orientation="portrait">

                    <Grid container spacing={0} direction='column' style={{ background: 'green', position: 'fixed', margin: 0, top: 0, left: 0, width: '100%', height: '100%' }}>

                        {/**row 1 ***/}
                        <Grid item lg={6} style={{ background: 'red', height: '50%' }}>
                        </Grid>

                        {/**row 2 ***/}
                        <Grid item lg={6} style={{ background: 'yellow', height: '50%' }}>
                        </Grid>

                    </Grid>

                </MediaQuery>


                {/**tablet/mobile phone and portrait */}
                <MediaQuery maxDeviceWidth={1224} minResolution="2dppx" orientation="portrait">

                    <Grid container spacing={0} direction='column' style={{ background: 'green', position: 'fixed', margin: 0, top: 0, left: 0, width: '100%', height: '100%' }}>

                        {/**row 1 ***/}
                        <Grid item lg={6} style={{ background: 'red', height: '50%' }}>
                        </Grid>

                        {/**row 2 ***/}
                        <Grid item lg={6} style={{ background: 'yellow', height: '50%' }}>
                        </Grid>

                    </Grid>

                </MediaQuery>

                {/**tablet/mobile phone and landscape */}
                <MediaQuery maxDeviceWidth={1224} minResolution="2dppx" orientation="landscape">

                    <Grid container spacing={2} direction='row' style={{ background: 'transparent', position: 'fixed', margin: 0, top: 0, left: 0, width: '100%', height: '100%' }}>

                        {/**col 1 ***/}
                        <Grid item xs={6} style={{ background: 'red' }}>
                        </Grid>

                        {/**col 2 ***/}
                        <Grid item xs={6} style={{ background: 'yellow' }}>
                        </Grid>

                    </Grid>

                </MediaQuery>


            </div>
        )
    }


}

export default Testpage;