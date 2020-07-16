import React, { Component } from "react";
import axios from 'axios';
import Table from 'react-bootstrap/Table';
import StudentTableRow from './StudentTableRow';
import AuthService from "../Services/AuthService";
import AuthContexts from '../Context/AuthContext'
import { Redirect } from "react-router";

export default class StudentList extends Component {

  constructor(props) {
    super(props)
    this.state = {
      students: []
    };
  }

  componentDidMount() {

    
    AuthService.getStudens()
      .then(res => {
        console.log(res);
        this.setState({
          students: res
        });
        console.log(this.state.students)
      })
      .catch((error) => {
        console.log(error);
      })
  }

  DataTable() {
    return this.state.students.map((res, i) => {
      return <StudentTableRow obj={res} key={i} />;
    });
  }
 

  render() {
    return (
    <div className="table-wrapper">
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Nombres</th>
            <th>Apellidos</th>
            <th>Correo</th>
            <th>Telefono</th>
            <th>Institución</th>
            <th>Carrera</th>
            <th>Fecha de egreso</th>
            
          </tr>
        </thead>
        <tbody>
          {this.DataTable()}
        </tbody>
     </Table>
    </div>);
  }
}                          
