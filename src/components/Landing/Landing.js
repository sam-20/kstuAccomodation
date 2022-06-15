import React from 'react';
// import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { Link } from 'react-router-dom'
import { Card, Carousel, Nav, Dropdown, DropdownButton, Container as RBContainer, Row, Col, Button, Collapse, Modal, Spinner } from 'react-bootstrap'

const useStyles = makeStyles(theme => ({
  icon: {
    marginRight: theme.spacing(2),
  },
  heroContent: {
    // backgroundImage: "url(https://i0.wp.com/www.eafinder.com/gh/wp-content/uploads/sites/14/2019/05/10702202_1534066930145336_4047172079559345104_n-1.jpg?fit=960%2C719&ssl=1)",

    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    padding: theme.spacing(8, 0, 6),
    marginTop: 37,

    /**these styling make the div cover the entire page */
    position: 'fixed',
    margin: 0,
    top: 0,
    left: 0,
    width: '100%',
    height: '100%'
  },
  heroButtons: {
    marginTop: theme.spacing(0),
  },

}));


export default function Album() {
  const classes = useStyles();

  return (
    <React.Fragment>
      <CssBaseline />

      <main>
        {/* Hero unit */}
        <div className={classes.heroContent}>
          <Container maxWidth="sm" >
            <Typography style={{ marginBottom: 40 }} component="h1" variant="h2" align="center" color="textPrimary" gutterBottom >
              <div>
                <img alt="" src={require('../../assets/kstu.png')} style={{ width: 150, height: 150 }} />
              </div>
            </Typography>

            <Typography component="h1" variant="h5" align="center" gutterBottom style={{ color: 'black' }}>
              KUMASI TECHNICAL UNIVERSITY
            </Typography>

            <Typography variant="h6" align="center" paragraph style={{ color: 'black', marginTop: 20 }}>
              Hall allocation portal
            </Typography>

            <div className={classes.heroButtons} style={{ marginTop: 30 }}>
              <RBContainer style={{ background: 'transparent' }}>
                <Row style={{ background: 'transparent', justifyContent: 'center' }}>
                  <Col md={7} xs={12} style={{ marginBottom: 20 }}>
                    <Link to="/student" style={{ textDecoration: 'none' }} > <Button block className={classes.heroButtons} variant="contained" style={{ background: '#8A8500', color: 'white' }}> Student</Button> </Link>
                  </Col>
                </Row>

                <Row style={{ background: 'transparent', justifyContent: 'center' }}>
                  <Col md={7} xs={12} style={{}}>
                    {/**staff button */}

                    <Link to="/admin" style={{ textDecoration: 'none' }}><Button block className={classes.heroButtons} variant="outlined" style={{ background: '#2C064A', color: 'white' }}>Staff</Button></Link>
                  </Col>
                </Row>
              </RBContainer>
            </div>
          </Container>
        </div>

      </main>

    </React.Fragment>
  );
}