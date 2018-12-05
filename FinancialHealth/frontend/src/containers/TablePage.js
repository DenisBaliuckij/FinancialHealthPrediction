import React from 'react';
import {Link} from 'react-router';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import {pink500, grey500} from 'material-ui/styles/colors';
import PageBase from '../components/PageBase';
import axios from 'axios';
import cookie from 'react-cookies'
import FlatButton from 'material-ui/FlatButton';
import { loadProgressBar } from 'axios-progress-bar';

class TablePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      requests: [],
      cookies: cookie.loadAll() 
    };
  }

  loadData(){
    loadProgressBar();
    axios.get('https://localhost:5001/Companies/GetRequests',{ 
        params:{
          userEmail: this.state.cookies.userEmail,
          hashedPassword: this.state.cookies.userPassword
        },
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }})
      .then(res => {
        if(res.data.isError){
          if(res.data.redirectToLogin){
            window.location.href='/';
          }       
        }
        else {
          this.setState({requests: res.data.results})
          //window.location.href='table';
        }
      });
  }
  componentDidMount(){
    this.loadData();
  }

  getFailProbability(item){
    console.log(item)
    if(item.positiveProbability!=null){
      return 1 - item.positiveProbability
    }
    return ''
  }

  render() {
  const styles = {
    floatingActionButton: {
      margin: 0,
      top: 'auto',
      right: 20,
      bottom: 20,
      left: 'auto',
      position: 'fixed',
    },
    editButton: {
      fill: grey500
    },
    columns: {
      id: {
        width: '10%'
      },
      name: {
        width: '10%'
      },
      price: {
        width: '30%'
      },
      category: {
        width: '10%'
      },
      edit: {
        width: '20%'
      }
    }
  };

  return (
    <PageBase title="Система оценки платёжеспособности/Защита ТУСУР"
              navigation="Запросы">

      <FlatButton
                label="Обновить"
                onClick={(e)=> {
                this.loadData();
                e.preventDefault();}}
                style={styles.flatButton}
               
              />
      <FlatButton
                label="Выход из системы"
               
                onClick={(e)=> {cookie.remove('userEmail', { path: '/' });
                                cookie.remove('userPassword', { path: '/' });
                                window.location.href='/';
                                e.preventDefault();}}
                style={styles.flatButton}
              />
      <div>
        <Link to="/form" >
          <FloatingActionButton style={styles.floatingActionButton} backgroundColor={pink500}>
            <ContentAdd />
          </FloatingActionButton>
        </Link>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHeaderColumn style={styles.columns.id}>Инн компании</TableHeaderColumn>
              <TableHeaderColumn style={styles.columns.name}>Наименование компании</TableHeaderColumn>
              <TableHeaderColumn style={styles.columns.price}>Адрес компании</TableHeaderColumn>
              <TableHeaderColumn style={styles.columns.category}>Результат обработки запроса</TableHeaderColumn>
              <TableHeaderColumn style={styles.columns.edit}>Совпадение с неблагоприятной группой</TableHeaderColumn>
              <TableHeaderColumn style={styles.columns.edit}>Совпадение с благоприятной группой</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody>
            {this.state.requests.map(item =>
              <TableRow key={item.id}>
                <TableRowColumn style={styles.columns.id}>{item.inn}</TableRowColumn>
                <TableRowColumn style={styles.columns.name}>{item.name}</TableRowColumn>
                <TableRowColumn style={styles.columns.price}>{item.address}</TableRowColumn>
                <TableRowColumn style={styles.columns.category}>{item.isFound?"Запрос обработан":"Запрос в обработке"}</TableRowColumn>
                <TableRowColumn style={styles.columns.edit}>{this.getFailProbability(item)}</TableRowColumn>
                <TableRowColumn style={styles.columns.edit}>{item.positiveProbability}</TableRowColumn>
              </TableRow>
            )}
          </TableBody>
        </Table>    
      </div>
    </PageBase>
  );
            }
}

export default TablePage;
