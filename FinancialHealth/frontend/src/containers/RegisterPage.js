import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { loadProgressBar } from 'axios-progress-bar';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import {grey500, white, red900} from 'material-ui/styles/colors';
import CardMembership from 'material-ui/svg-icons/action/card-membership';
import Help from 'material-ui/svg-icons/action/help';
import TextField from 'material-ui/TextField';
import ThemeDefault from '../theme-default';
import axios from 'axios';

import 'axios-progress-bar/dist/nprogress.css';


class LoginPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      confirmPassword: ''
    };
  }

  login(email, password, confirmPassword) {
    if(email=='' || password=='' || confirmPassword==''){
      this.setState({error: 'Введите вашу электронную почту и пароль'});
      return;
    }
    if (!/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/.test(email)) { 
      this.setState({error:'Введите действительный адрес электронной почты'});
      return;
    }
    if( password!=confirmPassword){
        this.setState({error: 'Введённые пароли не совпадают'});
        return;
      }
    loadProgressBar();
    this.setState({disableLoginButton: true});
    axios.post('httpS://localhost:5001/Account/Register', {
      email: email,
      password: password,
      confirmPassword: confirmPassword
      },{ headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }})
      .then(res => {
        if(res.data.isError){
          this.setState({error: res.data.error});
          this.setState({disableLoginButton: false});
        }
        else {
          this.setState({disableLoginButton: false});
          window.location.href='login';
        }
      });
    
  }

  
  render() {
    const styles = {
      loginContainer: {
        minWidth: 320,
        maxWidth: 400,
        height: 'auto',
        position: 'absolute',
        top: '20%',
        left: 0,
        right: 0,
        margin: 'auto'
      },
      paper: {
        padding: 20,
        overflow: 'auto'
      },
      buttonsDiv: {
        textAlign: 'center',
        padding: 10
      },
      flatButton: {
        color: grey500
      },
      checkRemember: {
        style: {
          float: 'left',
          maxWidth: 180,
          paddingTop: 5
        },
        labelStyle: {
          color: grey500
        },
        iconStyle: {
          color: grey500,
          borderColor: grey500,
          fill: grey500
        }
      },
      loginBtn: {
        float: 'right'
      },
      btn: {
        background: '#4f81e9',
        color: white,
        padding: 7,
        borderRadius: 2,
        margin: 2,
        fontSize: 13
      },
      btnFacebook: {
        background: '#4f81e9'
      },
      btnGoogle: {
        background: '#e14441'
      },
      btnSpan: {
        marginLeft: 5
      },
      error:{
        color: red900
      }
    };
    return (
      <MuiThemeProvider muiTheme={ThemeDefault}>
        <div>
          <div style={styles.loginContainer}>

         
            <Paper style={styles.paper}>
  
              <form>
                <div style={styles.error}>
                  {this.state.error}
                </div>
                <TextField
                  hintText="Введите адрес электронной почты"
                  floatingLabelText="Эл.почта"
                  fullWidth={true}
                  onChange={(e) => this.setState({email: e.target.value})}
                />
                <TextField
                  hintText="Введите пароль"
                  floatingLabelText="Пароль"
                  fullWidth={true}
                  type="password"
                  onChange={(e) => this.setState({password: e.target.value})}
                />
                 <TextField
                  hintText="Повторите ваш пароль"
                  floatingLabelText="Повторите пароль"
                  fullWidth={true}
                  type="password"
                  onChange={(e) => this.setState({confirmPassword: e.target.value})}
                />
  
                <div>
                 
                  
                    <RaisedButton label="Регистрация"
                                  primary={true}
                                  disabled={this.state.disableLoginButton}
                                  onClick={() => this.login(this.state.email, this.state.password, this.state.confirmPassword)}
                                  style={styles.loginBtn}/>
                </div>
              </form>
            </Paper>
  
            <div style={styles.buttonsDiv}>
              <FlatButton
                label="Вход в систему"
                href="/"
                style={styles.flatButton}
                icon={<CardMembership />}
              />
  
              <FlatButton
                label="Сброс пароля"
                href="/"
                onClick={(e)=> {alert('Для данного функционала необходимо подключить smtp сервер');
                                e.preventDefault();}}
                style={styles.flatButton}
                icon={<Help />}
              />
            </div>
  
         
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}


export default LoginPage;
