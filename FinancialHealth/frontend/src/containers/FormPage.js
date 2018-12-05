import React from 'react';
import {Link} from 'react-router';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import {grey400, red900} from 'material-ui/styles/colors';
import PageBase from '../components/PageBase';
import axios from 'axios';
import cookie from 'react-cookies'
import { loadProgressBar } from 'axios-progress-bar';


class FormPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inn: '',
      name: '',
      address: '',
      disableAddButton: false,
      cookies: cookie.loadAll() 
    };
  }
  addRequest(inn, name, address) {
    if(inn==''  &&  name=='' && address==''){
      this.setState({error: 'Введите инн, наименование и(или) адрес компании'});
      return;
    }
    if (!/^[0-9]*$/.test(inn)) { 
      this.setState({error:'В поле "ИНН" можно вводить лишь цифры'});
      return;
    }
    loadProgressBar();
    this.setState({disableAddButton: true});
    axios.post('httpS://localhost:5001/Companies/AddRequest', {
      inn: inn,
      name: name,
      address: address,
      userEmail: this.state.cookies.userEmail,
      hashedPassword: this.state.cookies.userPassword
      },{ headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }})
      .then(res => {
        if(res.data.isError){
          if(res.data.redirectToLogin){
            window.location.href='/';
          }
          this.setState({error: res.data.error});
          this.setState({disableAddButton: false});
        }
        else {
          this.setState({disableAddButton: false});
          window.location.href='table';
        }
      });
    
  }
  render() {
  const styles = {
    toggleDiv: {
      maxWidth: 300,
      marginTop: 40,
      marginBottom: 5
    },
    toggleLabel: {
      color: grey400,
      fontWeight: 100
    },
    buttons: {
      marginTop: 30,
      float: 'right'
    },
    saveButton: {
      marginLeft: 5
    },
    error:{
      color: red900
    }
  };

  return (
    <PageBase title="Система оценки платёжеспособности/Защита ТУСУР"
              navigation="Ввод компании для проверки">
      <form>
        <div style={styles.error}>
          {this.state.error}
        </div>
        <TextField
          hintText="ИНН"
          floatingLabelText="Инн компании"
          fullWidth={true}
          onChange={(e) => this.setState({inn: e.target.value})}
        />
        <TextField
          hintText="Наименование"
          floatingLabelText="Наименование компании"
          fullWidth={true}
          onChange={(e) => this.setState({name: e.target.value})}
        />
        <TextField
          hintText="Адрес"
          floatingLabelText="Адрес компании"
          fullWidth={true}
          onChange={(e) => this.setState({address: e.target.value})}
        />

     

        <div style={styles.buttons}>
          <Link to="/table">
            <RaisedButton label="Отмена"/>
          </Link>

          <RaisedButton label="Отправить запрос"
                        style={styles.saveButton}
                        disabled={this.state.disableAddButton}
                        onClick={() => this.addRequest(this.state.inn, this.state.name, this.state.address)}
                        primary={true}/>
        </div>
      </form>
    </PageBase>
  );
  }
}

export default FormPage;
